/* ---------- CDrive (taxi app) ----------
   Map (same atlas as Maps) -> tap to drop a pin / pick a place / use the GPS waypoint -> "Call taxi".
   The taxi is driven by client/yasir.lua, which pushes its state here with the 'yasirState' message. */

Object.assign(TR.ar, {
  'CDrive': 'ياسر', 'Where to?': 'وين رايح؟', 'GPS waypoint': 'نقطة GPS', 'Dropped pin': 'دبوس على الخريطة',
  'Call taxi': 'اطلب طاكسي', 'Get in': 'اركب', 'Stop here': 'وقّف هنا', 'Finding you a driver…': 'نقلّبو لك على سائق…',
  'Your driver is on the way': 'السائق جاي في الطريق', 'Meet at your pickup spot': 'استناه في مكانك',
  'Your taxi has arrived': 'الطاكسي وصل', 'The door is open, get in': 'الباب مفتوح، اركب',
  'On the way to': 'في الطريق إلى', 'You have arrived': 'وصلت', 'Fare': 'الأجرة', 'min': 'د',
  'Knows Arabic & French': 'يتكلم العربية والفرنسية', 'No waypoint set': 'ما كاين حتى نقطة GPS',
  'Estimated fare': 'الأجرة التقريبية', 'Done': 'تم', 'Pick a destination': 'اختر وجهة', 'Not enough money': 'ما عندكش فلوس كافية',
  'You already have a taxi': 'عندك طاكسي بالفعل', 'Wait a moment': 'استنى شوية', 'Get out of your vehicle first': 'انزل من سيارتك قبل',
  'Taxi': 'طاكسي', 'Change': 'تغيير', 'Paid': 'مدفوع',
});
Object.assign(TR.fr, {
  'CDrive': 'CDrive', 'Where to?': 'Où allez-vous ?', 'GPS waypoint': 'Point GPS', 'Dropped pin': 'Repère posé',
  'Call taxi': 'Appeler un taxi', 'Get in': 'Monter', 'Stop here': 'Arrêtez-vous ici', 'Finding you a driver…': 'Recherche d’un chauffeur…',
  'Your driver is on the way': 'Votre chauffeur arrive', 'Meet at your pickup spot': 'Rendez-vous à votre point de départ',
  'Your taxi has arrived': 'Votre taxi est arrivé', 'The door is open, get in': 'La porte est ouverte, montez',
  'On the way to': 'En route vers', 'You have arrived': 'Vous êtes arrivé', 'Fare': 'Tarif', 'min': 'min',
  'Knows Arabic & French': 'Parle arabe et français', 'No waypoint set': 'Aucun point GPS défini',
  'Estimated fare': 'Tarif estimé', 'Done': 'Terminé', 'Pick a destination': 'Choisissez une destination', 'Not enough money': 'Pas assez d’argent',
  'You already have a taxi': 'Vous avez déjà un taxi', 'Wait a moment': 'Patientez un instant', 'Get out of your vehicle first': 'Sortez d’abord de votre véhicule',
  'Taxi': 'Taxi', 'Change': 'Changer', 'Paid': 'Payé',
});

st.ys = st.ys || { d: { s: 'idle' }, dest: null, quote: null, q: '', loc: null, key: '' };

const YS_CAR = '<path d="M5 12l1.7-4.6A2 2 0 0 1 8.6 6h6.8a2 2 0 0 1 1.9 1.4L19 12"/><path d="M3.5 12h17a1 1 0 0 1 1 1v4h-2.2M3.5 12a1 1 0 0 0-1 1v4h2.2M8 17h8"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/>';
const ysCur = () => (st.ys.quote && st.ys.quote.cur) || '$';
const ysMoney = n => ysCur() + fmt(n);
const ysMin = s => Math.max(1, Math.ceil((s || 0) / 60));
const ysOn = () => !!document.querySelector('#app.ys');

async function yasirApp() {
  const [loc, cur] = await Promise.all([post('getLocation'), post('yasirGetState')]);
  st.ys.loc = loc || {};
  st.ys.d = (cur && cur.s) ? cur : { s: 'idle' };
  st.ys.key = '';
  view('CDrive', `
    <div class="mp-map ys-map">
      <div class="mp-map-bg" id="ysmap"></div>
      <button type="button" class="ys-back" id="ysback">${I(MP.back, 20)}</button>
      <div class="ys-brand"><b>CDrive</b></div>
      <button type="button" class="ys-locate" id="ysloc">${I(MP.nav, 18)}</button>
      <div class="ys-sheet" id="yssheet"></div>
    </div>`, { dark: false, app: 'ys', nohdr: true, cls: 'full mp-body' });
  $('#ysback').onclick = () => home();
  $('#ysloc').onclick = async () => {
    const l = await post('getLocation'); st.ys.loc = l || {};
    const el = $('#ysmap'); if (el) { mpCenterOn(l.x || 0, l.y || 0, el); ysMarkers(); }
  };
  ysMap();
  ysRender(true);
}

/* ----- map ----- */
function ysMap() {
  const el = $('#ysmap'); if (!el) return;
  const loc = st.ys.loc || {};
  const me = mpGameToPct(loc.x || 0, loc.y || 0);
  el.innerHTML = `<div class="mp-atlas" id="mpatlas">
    <div class="mp-player" id="ysme" style="left:${me.left}%;top:${me.top}%"></div>
    <div class="ys-pin hidden" id="yspin">${I(MP.pin, 30)}</div>
    <div class="ys-taxi hidden" id="ystaxi">${I(YS_CAR, 18)}</div>
  </div>`;
  el.dataset.bound = '';
  requestAnimationFrame(() => {
    mpCenterOn(loc.x || 0, loc.y || 0, el);
    mpBindPanZoom(el);
    ysBindTap(el);
    ysMarkers();
  });
}

function ysBindTap(el) {
  let dx = 0, dy = 0;
  el.addEventListener('mousedown', e => { dx = e.clientX; dy = e.clientY; });
  el.addEventListener('click', e => {
    if (Math.hypot(e.clientX - dx, e.clientY - dy) > 5) return;      // it was a drag
    if (!st.ys.d || st.ys.d.s !== 'idle') return;
    const a = el.querySelector('.mp-atlas'); if (!a) return;
    const r = a.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    if (fx < 0 || fx > 1 || fy < 0 || fy > 1) return;
    const B = MP_BOUNDS;
    ysSetDest({ n: t('Dropped pin'), x: Math.round((B.minX + fx * (B.maxX - B.minX)) * 10) / 10, y: Math.round((B.minY + (1 - fy) * (B.maxY - B.minY)) * 10) / 10, cat: 'Pin' });
  });
}

function ysPlace(node, x, y) {
  if (!node) return;
  const p = mpGameToPct(x, y);
  node.style.left = p.left + '%'; node.style.top = p.top + '%';
}

function ysMarkers() {
  const d = st.ys.d || {};
  const pin = $('#yspin'), taxi = $('#ystaxi'), me = $('#ysme');
  if (me) {
    if (d.px != null) ysPlace(me, d.px, d.py);
    else if (st.ys.loc) ysPlace(me, st.ys.loc.x || 0, st.ys.loc.y || 0);
  }
  const dest = (d.s && d.s !== 'idle') ? d.dest && { x: d.dest.x, y: d.dest.y } : st.ys.dest;
  if (pin) {
    if (dest) { ysPlace(pin, dest.x, dest.y); pin.classList.remove('hidden'); } else pin.classList.add('hidden');
  }
  if (taxi) {
    if (d.tx != null && d.s && d.s !== 'idle' && d.s !== 'searching') { ysPlace(taxi, d.tx, d.ty); taxi.classList.remove('hidden'); } else taxi.classList.add('hidden');
  }
}

/* ----- destination + quote ----- */
async function ysSetDest(p) {
  st.ys.dest = p; st.ys.quote = null;
  ysMarkers(); ysRender(true);
  const q = await post('yasirQuote', { x: p.x, y: p.y });
  if (st.ys.dest === p) { st.ys.quote = q; ysRender(true); }
}

/* ----- bottom sheet ----- */
function ysRender(force) {
  const box = $('#yssheet'); if (!box) return;
  const d = st.ys.d || { s: 'idle' };
  const key = d.s + ':' + (d.s === 'idle' ? (st.ys.dest ? st.ys.dest.x + st.ys.dest.y : '') + (st.ys.quote ? st.ys.quote.fare : '') : ysMin(d.eta));
  if (!force && key === st.ys.key) return;
  st.ys.key = key;
  if (d.s === 'idle') ysIdle(box); else ysActive(box, d);
  const m = box.parentElement; if (m) m.style.setProperty('--ys-sheet-h', box.offsetHeight + 'px');
}

function ysIdle(box) {
  const me = st.ys.loc || {};
  const dest = st.ys.dest, q = st.ys.quote;
  let body;
  if (dest) {
    const poor = q && q.ok && q.balance < q.fare;
    body = `<div class="ys-dest">
        <span class="ys-dest-ico">${I(MP.pin, 20)}</span>
        <div class="ys-dest-txt"><b dir="auto">${esc(dest.n)}</b><small>${q && q.ok ? mpFmt(q.dist) + ' · ' + t('Estimated fare') + ' ' + ysMoney(q.fare) : (q && q.err ? esc(t(q.err)) : '…')}</small></div>
        <button type="button" class="ys-chg" id="yschg">${esc(t('Change'))}</button>
      </div>
      <button type="button" class="ys-cta" id="yscall" ${!q || !q.ok || poor ? 'disabled' : ''}>${I(YS_CAR, 20)} ${esc(t('Call taxi'))}${q && q.ok ? ' · ' + ysMoney(q.fare) : ''}</button>
      ${poor ? `<p class="ys-warn">${esc(t('Not enough money'))}</p>` : ''}`;
  } else {
    body = `<div class="ys-quick">
        <button type="button" id="ysgps">${I(MP.nav, 16)}<span>${esc(t('GPS waypoint'))}</span></button>
        <button type="button" id="yshome">${I(MP.home, 16)}<span>${esc(t('Home'))}</span></button>
        <button type="button" id="yswork">${I(MP.work, 16)}<span>${esc(t('Work'))}</span></button>
      </div>
      <div class="ys-list" id="yslist"></div>`;
  }
  box.innerHTML = `<div class="mp-handle"></div>
    <div class="ys-search">${I(MP.search, 18)}<input id="ysq" dir="auto" autocomplete="off" placeholder="${esc(t('Where to?'))}" value="${esc(st.ys.q || '')}"></div>${body}`;

  if (dest) {
    $('#yschg').onclick = () => { st.ys.dest = null; st.ys.quote = null; ysMarkers(); ysRender(true); };
    $('#yscall').onclick = ysCall;
  } else {
    ysList();
    $('#ysq').oninput = () => { st.ys.q = $('#ysq').value.trim(); ysList(); };
    $('#ysgps').onclick = async () => {
      const r = await post('yasirWaypoint');
      if (r && r.ok) ysSetDest({ n: t('GPS waypoint'), x: Math.round(r.x * 10) / 10, y: Math.round(r.y * 10) / 10, cat: 'GPS' });
      else toast(t('No waypoint set'));
    };
    $('#yshome').onclick = () => { const p = mpHome(); if (p) ysSetDest(p); else toast(t('Set as Home')); };
    $('#yswork').onclick = () => { const p = mpWork(); if (p) ysSetDest(p); else toast(t('Set as Work')); };
  }
}

function ysList() {
  const l = $('#yslist'); if (!l) return;
  const me = { x: (st.ys.loc || {}).x || 0, y: (st.ys.loc || {}).y || 0 };
  const qq = (st.ys.q || '').toLowerCase();
  let list = GTA_PLACES.map(p => ({ ...p, d: mpDist(me, p) }));
  if (qq) list = list.filter(p => p.n.toLowerCase().includes(qq) || (p.zone || '').toLowerCase().includes(qq) || (p.cat || '').toLowerCase().includes(qq));
  list.sort((a, b) => a.d - b.d);
  list = list.slice(0, 12);
  l.innerHTML = list.length ? list.map((p, i) => `<div class="mp-row" data-i="${i}">
      <div class="mp-row-ico">${I(MP.pin, 18)}</div>
      <div class="mp-row-txt"><b>${esc(p.n)}</b><small>${esc(p.zone || p.cat || '')} · ${mpFmt(p.d)}</small></div></div>`).join('')
    : `<p class="mp-empty">${esc(t('Pick a destination'))}</p>`;
  l.querySelectorAll('.mp-row').forEach(e => e.onclick = () => {
    const p = list[+e.dataset.i];
    ysSetDest({ n: p.n, x: p.x, y: p.y, z: p.z, cat: p.cat });
    const el = $('#ysmap'); if (el) mpCenterOn(p.x, p.y, el);
  });
}

async function ysCall() {
  const dest = st.ys.dest; if (!dest) return;
  const btn = $('#yscall'); if (btn) btn.disabled = true;
  const r = await post('yasirOrder', { x: dest.x, y: dest.y, z: dest.z, name: dest.n });
  if (!r || !r.ok) { toast(t((r && r.err) || 'Failed')); if (btn) btn.disabled = false; return; }
  // the state arrives through the 'yasirState' message; make sure the sheet shows it right away
  st.ys.d = { ...(st.ys.d || {}), s: 'searching', fare: r.fare, dest: { x: dest.x, y: dest.y, n: dest.n } };
  ysMarkers(); ysRender(true);
}

function ysActive(box, d) {
  const dn = (d.dest && d.dest.n) || '';
  const eta = `<div class="ys-eta"><b>${ysMin(d.eta)}</b><small>${esc(t('min'))}</small></div>`;
  let title = '', sub = '', right = '', btns = '';
  if (d.s === 'searching') {
    title = t('Finding you a driver…'); sub = dn;
    btns = `<button type="button" class="ys-btn" id="yscancel">${esc(t('Cancel'))}</button>`;
  } else if (d.s === 'arriving') {
    title = t('Your driver is on the way'); sub = t('Meet at your pickup spot'); right = eta;
    btns = `<button type="button" class="ys-btn" id="yscancel">${esc(t('Cancel'))}</button>`;
  } else if (d.s === 'waiting') {
    title = t('Your taxi has arrived'); sub = t('The door is open, get in');
    btns = `<button type="button" class="ys-btn" id="yscancel">${esc(t('Cancel'))}</button><button type="button" class="ys-btn pri" id="ysenter">${esc(t('Get in'))}</button>`;
  } else if (d.s === 'riding') {
    title = t('On the way to') + ' ' + dn; sub = mpFmt(d.dist || 0); right = eta;
    btns = `<button type="button" class="ys-btn" id="ysstop">${esc(t('Stop here'))}</button>`;
  } else if (d.s === 'arrived') {
    title = t('You have arrived'); sub = t('Paid') + ' ' + ysMoney(d.fare || 0);
  }
  const showDriver = d.s !== 'searching';
  box.innerHTML = `<div class="mp-handle"></div>
    <div class="ys-head"><div class="ys-head-t"><b dir="auto">${esc(title)}</b><small dir="auto">${esc(sub)}</small></div>${right}</div>
    ${d.s === 'searching' ? '<div class="ys-load"><i></i></div>' : ''}
    ${showDriver ? `<div class="ys-driver">
      <div class="ys-av"><span>${esc((d.driver || '?')[0])}</span><em>${(d.rating || 5).toFixed(2)} ★</em></div>
      <div class="ys-dinfo"><b>${esc(d.driver || '')}</b><small>${esc(t('Knows Arabic & French'))}</small></div>
      <div class="ys-car"><b>${esc(d.plate || '')}</b><small>${esc(d.car || t('Taxi'))}</small></div>
    </div>` : ''}
    <div class="ys-btns">${btns}</div>`;
  const c = $('#yscancel'); if (c) c.onclick = () => post('yasirCancel');
  const en = $('#ysenter'); if (en) en.onclick = () => post('yasirEnter');
  const sp = $('#ysstop'); if (sp) sp.onclick = () => post('yasirStop');
}

/* state pushed by client/yasir.lua */
window.addEventListener('message', e => {
  const m = e.data;
  if (!m || m.action !== 'yasirState' || !m.data) return;
  const prev = st.ys.d && st.ys.d.s;
  st.ys.d = m.data;
  if (m.data.s === 'idle' && prev && prev !== 'idle') { st.ys.dest = null; st.ys.quote = null; st.ys.q = ''; }
  if (ysOn()) { ysMarkers(); ysRender(prev !== m.data.s); }
});
