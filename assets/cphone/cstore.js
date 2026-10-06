/* ===== CStore: app store. Default apps come preinstalled, everything else is downloaded here (saved per player). ===== */
const CS_META = {
  whatsnow: { dev: 'WhatsNow Inc.', r: 4.6, sz: 48, c: 'Social', d: 'Chat with friends, share moments and keep in touch.' },
  garage:   { dev: 'Los Santos Motors', r: 4.4, sz: 22, c: 'Tools', d: 'See your vehicles, mark them on the map and bring them to you.' },
  trendy:   { dev: 'Trendy Labs', r: 4.5, sz: 71, c: 'Social', d: 'Watch and post short videos.' },
  inpic:    { dev: 'Inpic Inc.', r: 4.3, sz: 64, c: 'Social', d: 'Share photos and stories with your friends.' },
  calc:     { dev: 'CStore Tools', r: 4.2, sz: 6, c: 'Tools', d: 'A simple, fast calculator.' },
  services: { dev: 'Los Santos Gov.', r: 4.1, sz: 14, c: 'Lifestyle', d: 'Call a police officer, a paramedic, a mechanic or any other service.' },
  music:    { dev: 'CStore Media', r: 4.5, sz: 35, c: 'Music', d: 'Search and play your music.' },
  youtube:  { dev: 'Google LLC', r: 4.4, sz: 82, c: 'Video', d: 'Watch videos and shorts.' },
  gemini:   { dev: 'Google LLC', r: 4.6, sz: 57, c: 'Productivity', d: 'Your AI assistant. Ask anything.' },
  browser:  { dev: 'Google LLC', r: 4.3, sz: 96, c: 'Communication', d: 'Browse the web and search Google.' },
  weather:  { dev: 'CStore Tools', r: 4.2, sz: 18, c: 'Weather', d: 'Live weather and forecast for Los Santos.' },
  yasir:    { dev: 'CDrive Taxi', r: 4.7, sz: 44, c: 'Travel', d: 'Order a taxi, follow it on the map and get there.' },
  darkchat: { dev: 'Dark Net', r: 4.8, sz: 28, c: 'Social', d: 'Anonymous encrypted chat. Auto number. Locked for police jobs.' },
  discord: { dev: 'WayLife Communications', r: 4.9, sz: 32, c: 'Social', d: 'Chat with players, browse channels and communicate with everyone in the city.' },
};
const CS_BANNERS = [
  { a: '#6a4cff', b: '#2b6bff', t: 'Welcome to CStore', s: 'Download the apps you want', i: 'cstore' },
  { a: '#18b86a', b: '#0b7a52', t: 'Stay connected', s: 'WhatsNow, Inpic and Trendy', i: 'whatsnow' },
  { a: '#ff8a1f', b: '#d6381f', t: 'Go anywhere', s: 'CDrive taxi, Garage and Browser', i: 'yasir' },
];
const CS = { tab: 'apps', sub: 'feat', page: null, dl: {}, q: '' };

Object.assign(TR.ar, { 'CStore': 'سي ستور', 'Featured': 'مميز', 'Top charts': 'الأكثر تحميلاً', 'Apps': 'التطبيقات', 'My apps': 'تطبيقاتي', 'Downloading': 'التنزيلات', 'Install': 'تثبيت', 'Open': 'فتح', 'Uninstall': 'إلغاء التثبيت', 'Installed': 'مثبّت', 'Free': 'مجاني', 'Search apps': 'ابحث عن تطبيقات', 'App installed': 'تم تثبيت التطبيق', 'App uninstalled': 'تم إلغاء تثبيت التطبيق', 'About this app': 'حول هذا التطبيق', 'Recommended this week': 'موصى به هذا الأسبوع', 'Popular apps': 'تطبيقات شائعة', 'Nothing is downloading.': 'لا توجد تنزيلات.', 'Apps are shown here when they\'re downloading.': 'تظهر التطبيقات هنا أثناء التنزيل.', 'No apps downloaded yet.': 'لم تقم بتنزيل أي تطبيق بعد.', 'Welcome to CStore': 'مرحباً بك في سي ستور', 'Download the apps you want': 'حمّل التطبيقات التي تريدها', 'Stay connected': 'ابقَ على تواصل', 'WhatsNow, Inpic and Trendy': 'واتس ناو وإنبيك وتراندي', 'Go anywhere': 'اذهب إلى أي مكان', 'CDrive taxi, Garage and Browser': 'تاكسي ياسر والكراج والمتصفح', 'Installed by default': 'مثبّت افتراضياً', 'Size': 'الحجم', 'Rating': 'التقييم', 'Category': 'الفئة', 'No results': 'لا توجد نتائج' });
Object.assign(TR.fr, { 'CStore': 'CStore', 'Featured': 'À la une', 'Top charts': 'Classements', 'Apps': 'Applis', 'My apps': 'Mes applis', 'Downloading': 'Téléchargements', 'Install': 'Installer', 'Open': 'Ouvrir', 'Uninstall': 'Désinstaller', 'Installed': 'Installée', 'Free': 'Gratuit', 'Search apps': 'Rechercher des applis', 'App installed': 'Application installée', 'App uninstalled': 'Application désinstallée', 'About this app': 'À propos', 'Recommended this week': 'Recommandé cette semaine', 'Popular apps': 'Applis populaires', 'Nothing is downloading.': 'Aucun téléchargement.', 'Apps are shown here when they\'re downloading.': 'Les applis s\'affichent ici pendant le téléchargement.', 'No apps downloaded yet.': 'Aucune appli téléchargée.', 'Welcome to CStore': 'Bienvenue sur CStore', 'Download the apps you want': 'Téléchargez les applis que vous voulez', 'Stay connected': 'Restez connecté', 'WhatsNow, Inpic and Trendy': 'WhatsNow, Inpic et Trendy', 'Go anywhere': 'Allez partout', 'CDrive taxi, Garage and Browser': 'Taxi CDrive, Garage et Navigateur', 'Installed by default': 'Installée par défaut', 'Size': 'Taille', 'Rating': 'Note', 'Category': 'Catégorie', 'No results': 'Aucun résultat' });

const csIds = () => (st.storeIds || Object.keys(CS_META)).filter(id => CS_META[id] && APPS.some(a => a.id === id));
const csApp = id => APPS.find(a => a.id === id);
const csName = id => { const a = csApp(id); return a ? t(a.n) : id };
const csIcon = id => `icons/${(csApp(id) || { i: id }).i}.svg?v=2`;
const csStar = '<svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/></svg>';
const CS_IC = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  dl: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  apps: '<circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  myapps: '<circle cx="7" cy="6" r="2.6"/><circle cx="17" cy="6" r="2.6"/><circle cx="7" cy="16" r="2.6"/><path d="M17 13v6m-3-3l3 3 3-3"/>',
  dling: '<circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/><path d="M12 8v7M9 12l3 3 3-3"/>',
};
const csIc = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${CS_IC[n]}</svg>`;

/* action button for one app: download / progress ring / open */
function csBtn(id, big) {
  if (isInst(id)) return `<button type="button" class="cs-b open${big ? ' big' : ''}" data-act="open" data-id="${id}">${esc(t('Open'))}</button>`;
  if (CS.dl[id] !== undefined) {
    const p = Math.round(CS.dl[id] * 100), C = 2 * Math.PI * 15;
    return `<button type="button" class="cs-b ring" data-act="x" data-id="${id}"><svg width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="#4a4a4e" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#8ab4ff" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(C * p / 100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 18 18)"/></svg><i>${p}</i></button>`;
  }
  return `<button type="button" class="cs-b get${big ? ' big' : ''}" data-act="get" data-id="${id}" aria-label="${esc(t('Install'))}">${big ? esc(t('Install')) : csIc('dl', 22)}</button>`;
}
function csBtns(id) {
  document.querySelectorAll(`.cs [data-btn="${id}"]`).forEach(e => e.innerHTML = csBtn(id, e.classList.contains('big')));
  const dn = $('#cs-dlcount'); if (dn) dn.textContent = Object.keys(CS.dl).length || '';
}
function csRow(id, rank) {
  const m = CS_META[id];
  return `<div class="cs-row" data-open="${id}"><img src="${csIcon(id)}" alt="">
    <div class="cs-i"><b>${rank ? `<em>${rank}</em> ` : ''}${esc(csName(id))}</b><small>${esc(m.dev)}</small><small>${esc(t('Free'))}</small><span class="cs-r">${csStar}${m.r.toFixed(1)}</span></div>
    <div class="cs-act" data-btn="${id}">${csBtn(id)}</div></div>`;
}
function csCard(id) {
  const m = CS_META[id];
  return `<div class="cs-card" data-open="${id}"><img src="${csIcon(id)}" alt=""><b>${esc(csName(id))}</b><small>${esc(m.dev)}</small>
    <div class="cs-act" data-btn="${id}">${csBtn(id)}</div></div>`;
}

/* ---------- pages ---------- */
function csBanner() {
  return `<div class="cs-bn" id="cs-bn">${CS_BANNERS.map((b, n) => `<div class="cs-bs${n ? '' : ' on'}" style="background:linear-gradient(135deg,${b.a},${b.b})"><div><b>${esc(t(b.t))}</b><span>${esc(t(b.s))}</span></div><img src="${csIcon(b.i)}" alt=""></div>`).join('')}<em id="cs-bc">1/${CS_BANNERS.length}</em></div>`;
}
function csPageApps() {
  const ids = csIds(), top = [...ids].sort((x, y) => CS_META[y].r - CS_META[x].r);
  const sub = `<div class="cs-sub"><button data-sub="feat" class="${CS.sub === 'feat' ? 'on' : ''}">${esc(t('Featured'))}</button><button data-sub="top" class="${CS.sub === 'top' ? 'on' : ''}">${esc(t('Top charts'))}</button></div>`;
  const head = `<div class="cs-top"><h1>${esc(t('CStore'))}</h1><button data-go="search" aria-label="${esc(t('Search apps'))}">${csIc('search', 26)}</button></div>`;
  if (CS.sub === 'top') return head + csBanner() + sub + `<div class="cs-list">${top.map((id, n) => csRow(id, n + 1)).join('')}</div>`;
  return head + csBanner() + sub + `<h2>${esc(t('Recommended this week'))}</h2><div class="cs-hs">${top.slice(0, 5).map(csCard).join('')}</div>
    <h2>${esc(t('Popular apps'))}</h2><div class="cs-list">${top.slice(5).map(id => csRow(id)).join('')}</div>`;
}
function csPageMenu() {
  const my = csIds().filter(isInst).length, dn = Object.keys(CS.dl).length;
  return `<div class="cs-top"><h1>${esc(t('Menu'))}</h1></div>
    <div class="cs-menu"><button data-go="my"><i>${csIc('myapps', 26)}</i><span>${esc(t('My apps'))}</span>${my ? `<em>${my}</em>` : ''}</button>
    <button data-go="dl"><i>${csIc('dling', 26)}</i><span>${esc(t('Downloading'))}</span><em id="cs-dlcount">${dn || ''}</em></button></div>`;
}
const csBackHdr = title => `<div class="cs-top sub"><button data-back="1" aria-label="${esc(t('Back'))}">${csIc('back', 26)}</button><h1>${esc(title)}</h1></div>`;
function csPageMy() {
  const ids = csIds().filter(isInst);
  return csBackHdr(t('My apps')) + (ids.length ? `<div class="cs-list">${ids.map(id => csRow(id)).join('')}</div>` : `<p class="cs-empty">${esc(t('No apps downloaded yet.'))}</p>`);
}
function csPageDl() {
  const ids = Object.keys(CS.dl);
  return csBackHdr(t('Downloading')) + (ids.length ? `<div class="cs-list">${ids.map(id => csRow(id)).join('')}</div>` : `<p class="cs-empty">${esc(t('Apps are shown here when they\'re downloading.'))}</p>`);
}
function csPageSearch() {
  return `<div class="cs-top sub"><button data-back="1" aria-label="${esc(t('Back'))}">${csIc('back', 26)}</button><input id="cs-q" dir="auto" autocomplete="off" placeholder="${esc(t('Search apps'))}" value="${esc(CS.q)}"></div><div class="cs-list" id="cs-sr"></div>`;
}
function csSearchRes() {
  const q = CS.q.trim().toLowerCase(), box = $('#cs-sr'); if (!box) return;
  const ids = csIds().filter(id => !q || csName(id).toLowerCase().includes(q) || CS_META[id].dev.toLowerCase().includes(q) || CS_META[id].c.toLowerCase().includes(q));
  box.innerHTML = ids.length ? ids.map(id => csRow(id)).join('') : `<p class="cs-empty">${esc(t('No results'))}</p>`;
}
function csPageDetail(id) {
  const m = CS_META[id];
  return csBackHdr('') + `<div class="cs-det"><img src="${csIcon(id)}" alt=""><b>${esc(csName(id))}</b><small>${esc(m.dev)}</small>
    <div class="cs-facts"><div><b>${csStar} ${m.r.toFixed(1)}</b><small>${esc(t('Rating'))}</small></div><div><b>${m.sz} MB</b><small>${esc(t('Size'))}</small></div><div><b>${esc(m.c)}</b><small>${esc(t('Category'))}</small></div></div>
    <div class="cs-act big" data-btn="${id}">${csBtn(id, true)}</div>
    ${isInst(id) ? `<button type="button" class="cs-un" data-act="rm" data-id="${id}">${esc(t('Uninstall'))}</button>` : ''}
    <h2>${esc(t('About this app'))}</h2><p dir="auto">${esc(t(m.d))}</p></div>`;
}

/* ---------- logic ---------- */
function csRender() {
  const main = $('#cs-main'); if (!main) return;
  const p = CS.page;
  let h;
  if (p) h = p.t === 'app' ? csPageDetail(p.id) : p.t === 'my' ? csPageMy() : p.t === 'dl' ? csPageDl() : csPageSearch();
  else h = CS.tab === 'menu' ? csPageMenu() : csPageApps();
  main.innerHTML = h; main.scrollTop = 0;
  document.querySelectorAll('.cs-nav button').forEach(b => b.classList.toggle('on', !p && b.dataset.tab === CS.tab));
  $('#cs-nav')?.classList.toggle('hidden', !!p);
  if (p && p.t === 'search') { const q = $('#cs-q'); csSearchRes(); if (q) { q.oninput = () => { CS.q = q.value; csSearchRes() }; q.focus() } }
  csBannerStart();
}
function csBannerStart() {
  clearInterval(st.wi);
  const bn = $('#cs-bn'); if (!bn) return;
  let n = 0;
  st.wi = setInterval(() => {
    const s = document.querySelectorAll('#cs-bn .cs-bs'); if (!s.length) return;
    s[n].classList.remove('on'); n = (n + 1) % s.length; s[n].classList.add('on');
    const c = $('#cs-bc'); if (c) c.textContent = (n + 1) + '/' + s.length;
  }, 4000);
}
function csGet(id) {
  if (isInst(id) || CS.dl[id] !== undefined || !CS_META[id]) return;
  CS.dl[id] = 0; csBtns(id);
  const dur = 2200 + Math.random() * 2200, t0 = Date.now();
  const tick = setInterval(async () => {
    const p = Math.min(1, (Date.now() - t0) / dur); CS.dl[id] = p;
    if (p < 1) { csBtns(id); return }
    clearInterval(tick);
    const r = await post('storeInstall', { id });
    delete CS.dl[id];
    if (r && r.ok) { st.apps.add(id); toast(t('App installed')); if (!st.locked) renderHome() } else toast(t('Failed'));
    if (CS.page && CS.page.t === 'app' && CS.page.id === id) csRender(); else if (CS.page && (CS.page.t === 'dl' || CS.page.t === 'my')) csRender(); else csBtns(id);
  }, 120);
}
async function csRemove(id) {
  const r = await post('storeRemove', { id });
  if (r && r.ok) { st.apps.delete(id); st.recents = (st.recents || []).filter(x => x !== id); toast(t('App uninstalled')); renderHome(); csRender() } else toast(t('Failed'));
}
function cstoreApp() {
  CS.page = null; CS.q = '';
  const b = view('', `<div class="cs"><div id="cs-main"></div>
    <nav class="cs-nav" id="cs-nav"><button data-tab="apps">${csIc('apps', 24)}<span>${esc(t('Apps'))}</span></button><button data-tab="menu">${csIc('menu', 24)}<span>${esc(t('Menu'))}</span></button></nav></div>`, { nohdr: true, dark: true, app: 'cst', cls: 'full' });
  b.querySelector('.cs').onclick = e => {
    const act = e.target.closest('[data-act]');
    if (act) { e.stopPropagation(); const id = act.dataset.id; if (act.dataset.act === 'get') csGet(id); else if (act.dataset.act === 'open') openApp(id); else if (act.dataset.act === 'rm') csRemove(id); return }
    const o = e.target.closest('[data-open]'); if (o) { CS.page = { t: 'app', id: o.dataset.open }; csRender(); return }
    const g = e.target.closest('[data-go]'); if (g) { CS.page = { t: g.dataset.go }; csRender(); return }
    const bk = e.target.closest('[data-back]'); if (bk) { CS.page = null; csRender(); return }
    const sb = e.target.closest('[data-sub]'); if (sb) { CS.sub = sb.dataset.sub; csRender(); return }
    const tb = e.target.closest('[data-tab]'); if (tb) { CS.tab = tb.dataset.tab; CS.page = null; csRender() }
  };
  csRender();
}
