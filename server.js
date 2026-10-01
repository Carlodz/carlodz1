const http = require('http');
// Minimal .env loader so the site works without npm dependencies.
const envFile = require('fs').existsSync(require('path').join(__dirname, '.env')) ? require('fs').readFileSync(require('path').join(__dirname, '.env'), 'utf8') : '';
for (const line of envFile.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m || m[1] in process.env) continue;
  let v=m[2]; if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v=v.slice(1,-1);
  process.env[m[1]]=v.replace(/\\n/g,'\n');
}
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 5500);
const PUBLIC_URL = (process.env.PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const REDOTPAY_APP_KEY = process.env.REDOTPAY_APP_KEY || '';
const REDOTPAY_KEY_VERSION = String(process.env.REDOTPAY_KEY_VERSION || '1');
const REDOTPAY_PRIVATE_KEY = process.env.REDOTPAY_PRIVATE_KEY || '';
const REDOTPAY_ENV = (process.env.REDOTPAY_ENV || 'sandbox').toLowerCase();
const REDOTPAY_API = REDOTPAY_ENV === 'production'
  ? 'https://acquirer.redotpay.com'
  : 'https://acquirersandbox.rp-2023app.com';
const REDOTPAY_PUBLIC_KEY = process.env.REDOTPAY_PUBLIC_KEY || '';

const PRODUCTS = {
  wayscoot:   { name: 'WayScoot',   amount: 5,  code: 'WAY-SCOOT',   download: '' },
  burgershot: { name: 'Burger Shot',amount: 5,  code: 'BURGER-SHOT', download: '' },
  waypets:    { name: 'WayPets',    amount: 10, code: 'WAY-PETS',    download: '' },
  catcoffee:  { name: 'Cat Coffee', amount: 5,  code: 'CAT-COFFEE',  download: '' }
};

const DATA_DIR = path.join(ROOT, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '{}');

function loadOrders(){ try { return JSON.parse(fs.readFileSync(ORDERS_FILE,'utf8') || '{}'); } catch { return {}; } }
function saveOrders(o){ fs.writeFileSync(ORDERS_FILE, JSON.stringify(o,null,2)); }
function json(res, status, body){ const b=Buffer.from(JSON.stringify(body)); res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Content-Length':b.length,'Access-Control-Allow-Origin':'*'}); res.end(b); }
function body(req){ return new Promise((resolve,reject)=>{ let d=''; req.on('data',c=>{d+=c; if(d.length>1000000) req.destroy();}); req.on('end',()=>{try{resolve(d?JSON.parse(d):{});}catch(e){reject(e);}}); req.on('error',reject); }); }
function makeSignature(method, uri, appKey, ts, requestBody){
  if(!REDOTPAY_PRIVATE_KEY) throw new Error('REDOTPAY_PRIVATE_KEY is not configured');
  const signText = `${method} ${uri}\n${appKey}.${ts}.${requestBody}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signText,'utf8'); signer.end();
  return signer.sign(REDOTPAY_PRIVATE_KEY).toString('base64');
}
function verifyWebhook(raw, req){
  if(!REDOTPAY_PUBLIC_KEY) return REDOTPAY_ENV === 'sandbox';
  const ts=req.headers['x-r-ts']; const sig=req.headers['x-r-signature'];
  if(!ts || !sig || !REDOTPAY_APP_KEY) return false;
  if(Math.abs(Date.now()-Number(ts)) > 5*60*1000) return false;
  const text=`${REDOTPAY_APP_KEY}.${ts}.${raw}`;
  const verifier=crypto.createVerify('RSA-SHA256'); verifier.update(text,'utf8'); verifier.end();
  return verifier.verify(REDOTPAY_PUBLIC_KEY, Buffer.from(sig,'base64'));
}
function safeId(){ return `CZ${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`.slice(0,32); }

async function createPayment(productKey, userId){
  const product=PRODUCTS[productKey];
  if(!product) throw new Error('Product not found');
  if(!REDOTPAY_APP_KEY) throw new Error('RedotPay is not configured yet. Add REDOTPAY_APP_KEY and RSA key to .env');
  const outerOrderSn=safeId();
  const now=Date.now();
  const payload={
    outerOrderSn,
    outerUid:String(userId||'guest').slice(0,32),
    orderAmount:product.amount,
    orderCurrency:'USD',
    timeExpire:now+60*60*1000,
    env:'WEB',
    rateExtra:0,
    orderDesc:`CARLODZ ${product.name}`,
    goods:[{goodsType:'02',goodsCategory:'6000',goodsCode:product.code,goodsName:product.name,goodsCount:1,goodsAmount:product.amount,goodsCoin:'USD'}],
    buyer:{redirectUrl:`${PUBLIC_URL}/?payment=return&order=${encodeURIComponent(outerOrderSn)}`},
    merchantName:'CARLODZ'
  };
  const raw=JSON.stringify(payload);
  const uri='/openapi/v2/order/create';
  const ts=Date.now().toString();
  const signature=makeSignature('POST',uri,REDOTPAY_APP_KEY,ts,raw);
  const r=await fetch(REDOTPAY_API+uri,{method:'POST',headers:{'content-type':'application/json','accept':'application/json','X-R-AK':REDOTPAY_APP_KEY,'X-R-TS':ts,'X-R-Key-Version':REDOTPAY_KEY_VERSION,'X-R-Signature':signature},body:raw});
  const data=await r.json().catch(()=>({}));
  if(!r.ok || data.code!=='SUCCESS') throw new Error(data.msg || `RedotPay API error (${r.status})`);
  const paymentUrl=data.data?.h5Url || data.data?.webUrl || data.data?.paymentUrl || data.data?.payUrl;
  if(!paymentUrl) throw new Error('RedotPay did not return a payment URL');
  const orders=loadOrders(); orders[outerOrderSn]={outerOrderSn,product:productKey,userId,amount:product.amount,status:'PENDING',orderSn:data.data?.orderSn||data.data?.preSn||'',createdAt:now}; saveOrders(orders);
  return {paymentUrl,order:outerOrderSn};
}

async function handleWebhook(req,res){
  let raw=''; req.on('data',c=>raw+=c); req.on('end',()=>{
    if(!verifyWebhook(raw,req)) return json(res,401,{code:'FAIL',msg:'Invalid webhook signature',requestId:crypto.randomUUID()});
    let data; try{data=JSON.parse(raw);}catch{return json(res,400,{code:'FAIL',msg:'Invalid JSON',requestId:crypto.randomUUID()});}
    const id=data.outerOrderSn || data.outerOrder; const orders=loadOrders(); const order=orders[id];
    if(order){ order.status=Number(data.orderStatus)===2?'PAID':Number(data.orderStatus)===3?'FAILED':Number(data.orderStatus)===4?'CLOSED':order.status; order.payment=data; order.updatedAt=Date.now(); saveOrders(orders); }
    return json(res,200,{code:'SUCCESS',requestId:crypto.randomUUID()});
  });
}
function mime(p){ return {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.zip':'application/zip','.ico':'image/x-icon'}[path.extname(p).toLowerCase()] || 'application/octet-stream'; }
function serve(req,res){
  const u=new URL(req.url,`http://${req.headers.host}`); let pathname=decodeURIComponent(u.pathname); if(pathname==='/') pathname='/index.html';
  const file=path.normalize(path.join(ROOT,pathname)); if(!file.startsWith(ROOT)) return json(res,403,{error:'Forbidden'});
  fs.stat(file,(e,st)=>{ if(e||!st.isFile()) return json(res,404,{error:'Not found'}); res.writeHead(200,{'Content-Type':mime(file)}); fs.createReadStream(file).pipe(res); });
}

const server=http.createServer(async (req,res)=>{
  try{
    const u=new URL(req.url,`http://${req.headers.host}`);
    if(req.method==='POST' && u.pathname==='/api/create-payment'){
      const b=await body(req); const result=await createPayment(b.product,b.userId); return json(res,200,result);
    }
    if(req.method==='GET' && u.pathname==='/api/payment-status'){
      const order=u.searchParams.get('order'); const o=loadOrders()[order]; return json(res,200,{status:o?.status||'NOT_FOUND',product:o?.product||null,download:PRODUCTS[o?.product||'']?.download||''});
    }
    if(req.method==='POST' && u.pathname==='/api/redotpay/webhook') return handleWebhook(req,res);
    if(req.method==='GET' || req.method==='HEAD') return serve(req,res);
    return json(res,405,{error:'Method not allowed'});
  }catch(e){ console.error(e); return json(res,500,{message:e.message||'Server error'}); }
});
server.listen(PORT,()=>console.log(`CARLODZ site: ${PUBLIC_URL}`));
