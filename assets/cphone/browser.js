/* ---------- Browser (real Chromium page through DUI) ----------
   The page itself is drawn by the game (client/browser.lua) UNDER this UI. Here we only draw the chrome (address bar,
   buttons, menu) and leave a transparent "viewport" hole; mouse / wheel events on the hole are forwarded to the page. */

Object.assign(TR.ar, {
  'Search or type address': 'ابحث أو اكتب العنوان', 'Home': 'الرئيسية', 'Favorites': 'المفضلة', 'History': 'السجل',
  'Add to favorites': 'أضف للمفضلة', 'Remove favorite': 'إزالة من المفضلة', 'Scroll mode': 'وضع التمرير', 'Mouse mode': 'وضع الماوس',
  'Drag scrolls the page': 'السحب يمرّر الصفحة', 'Drag moves like a mouse': 'السحب مثل الماوس', 'No favorites yet': 'لا توجد مفضلة بعد',
  'No history yet': 'لا يوجد سجل بعد', 'Clear': 'مسح', 'Shortcuts': 'اختصارات', 'Only http and https pages': 'صفحات http و https فقط',
  'Invalid address': 'عنوان غير صالح', 'This address is not allowed': 'هذا العنوان غير مسموح', 'This site is blocked': 'هذا الموقع محظور',
  'Browser disabled': 'المتصفح معطّل', 'Browser not ready': 'المتصفح غير جاهز', 'Saved': 'تم الحفظ', 'Removed': 'تمت الإزالة',
  'Type in the address bar to search': 'للبحث اكتب في شريط العنوان', 'Close': 'إغلاق',
  'Type in the page': 'اكتب في الصفحة', 'Keyboard': 'لوحة المفاتيح', 'Clear field': 'مسح الحقل',
});
Object.assign(TR.fr, {
  'Search or type address': 'Rechercher ou saisir une adresse', 'Home': 'Accueil', 'Favorites': 'Favoris', 'History': 'Historique',
  'Add to favorites': 'Ajouter aux favoris', 'Remove favorite': 'Retirer des favoris', 'Scroll mode': 'Mode défilement', 'Mouse mode': 'Mode souris',
  'Drag scrolls the page': 'Glisser fait défiler la page', 'Drag moves like a mouse': 'Glisser comme une souris', 'No favorites yet': 'Aucun favori',
  'No history yet': 'Aucun historique', 'Clear': 'Effacer', 'Shortcuts': 'Raccourcis', 'Only http and https pages': 'Pages http et https uniquement',
  'Invalid address': 'Adresse invalide', 'This address is not allowed': 'Adresse non autorisée', 'This site is blocked': 'Ce site est bloqué',
  'Browser disabled': 'Navigateur désactivé', 'Browser not ready': 'Navigateur pas prêt', 'Saved': 'Enregistré', 'Removed': 'Retiré',
  'Type in the address bar to search': 'Pour chercher, saisissez dans la barre d’adresse', 'Close': 'Fermer',
  'Type in the page': 'Écrire dans la page', 'Keyboard': 'Clavier', 'Clear field': 'Vider le champ',
});

Object.assign(TR.ar, { 'Search or URL': 'ابحث أو اكتب عنوان', 'Bookmarks': 'العلامات', 'Tabs': 'علامات التبويب', 'New tab': 'علامة تبويب جديدة', 'Add page to': 'إضافة الصفحة إلى', 'Remove bookmark': 'إزالة العلامة', 'Link copied': 'تم نسخ الرابط', 'Home page': 'الصفحة الرئيسية', 'Close all': 'إغلاق الكل', 'Done': 'تم', 'Max tabs': 'الحد الأقصى 8 علامات', 'Reload': 'إعادة تحميل', 'Copy link': 'نسخ الرابط', 'Back': 'رجوع' });
Object.assign(TR.fr, { 'Search or URL': 'Rechercher ou saisir une URL', 'Bookmarks': 'Favoris', 'Tabs': 'Onglets', 'New tab': 'Nouvel onglet', 'Add page to': 'Ajouter la page à', 'Remove bookmark': 'Retirer le favori', 'Link copied': 'Lien copié', 'Home page': "Page d'accueil", 'Close all': 'Tout fermer', 'Done': 'OK', 'Max tabs': '8 onglets maximum', 'Reload': 'Actualiser', 'Copy link': 'Copier le lien', 'Back': 'Retour' });

const BR = {
  start: false, tabs: [], cur: 0,
  on: false, cfg: null, url: '', hist: [], pos: -1, drag: 'scroll', rect: null, timer: 0, sheet: null,
  fav: [], past: [], q: Promise.resolve(),
};
const BRI = {
  back: '<path d="M15 5l-7 7 7 7"/>', fwd: '<path d="M9 5l7 7-7 7"/>', home: '<path d="M4 11l8-7 8 7v9H4z"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
  menu: '<circle cx="12" cy="5" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="19" r="1.7" fill="currentColor"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
  go: '<path d="M5 12h14M13 6l6 6-6 6"/>', hand: '<path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 10V5a1.5 1.5 0 0 1 3 0v6M14 10V6.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 6.5-6 6.5-2.6 0-4-1.3-5.3-3.5L4 14c-.5-1 .6-2 1.6-1.4L8 14"/>',
  mouse: '<path d="M6 3l12 8.5-5.2 1 3 5.5-2.4 1.3-3-5.5L6.5 18z"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  bs: '<path d="M9 5h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/>', shift: '<path d="M12 4l8 9h-5v7H9v-7H4z"/>',
  kbd: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>',
};
Object.assign(BRI, {
  hist: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4.2l2.8 1.7M4.5 6.5L4 10l3.4-.6"/>',
  addto: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  reload: '<path d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5M19.5 4.5v4.2h-4.2"/>',
  bkl: '<path d="M14 4.2l1.9 4 4.4.6-3.2 3.1.8 4.4-3.9-2.1-3.9 2.1.8-4.4-3.2-3.1 4.4-.6z"/><path d="M3 16h3M3 20h8"/>',
  share: '<circle cx="6.5" cy="12" r="2.3"/><circle cx="17" cy="6.5" r="2.3"/><circle cx="17" cy="17.5" r="2.3"/><path d="M8.5 10.9l6.5-3.3M8.5 13.1l6.5 3.3"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', copy: '<rect x="8" y="8" width="11" height="12" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
  starf: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
});
const brLs = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch (e) { return d } };
const brSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } };
const brIc = (p, s = 20) => I(BRI[p], s);

/* ---------- address handling ---------- */
function brHost(u) { try { return new URL(u).hostname.toLowerCase() } catch (e) { return '' } }
function brLooksLikeUrl(s) {
  if (/^https?:\/\//i.test(s)) return true;
  if (/\s/.test(s)) return false;
  return /^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([\/?#].*)?$/i.test(s) || /^\d{1,3}(\.\d{1,3}){3}(:\d+)?([\/?#].*)?$/.test(s);
}
function brResolve(input) {
  const s = String(input || '').trim();
  if (!s) return '';
  if (brLooksLikeUrl(s)) return /^https?:\/\//i.test(s) ? s : 'https://' + s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/\s/.test(s) && !/^[a-z0-9.-]+:\d+/i.test(s)) return s;   // javascript:, file:, nui: ... -> refused below
  const tpl = (BR.cfg && BR.cfg.search) || 'https://www.google.com/search?q=%s';
  const lang = (st.settings && st.settings.language) || 'en';
  const u = tpl.replace('%s', encodeURIComponent(s));
  return /google\./.test(u) && !/[?&]hl=/.test(u) ? u + '&hl=' + lang : u;
}
const brShow = u => String(u || '').replace(/^https?:\/\//i, '').replace(/\/$/, '');

/* ---------- viewport rectangle -> game ---------- */
function brSendRect(force) {
  const v = $('#brv');
  if (!v || !BR.on || (BR.start && !force)) return;
  const r = v.getBoundingClientRect();
  const W = innerWidth || 1, H = innerHeight || 1;
  const key = [r.left, r.top, r.width, r.height, W, H].map(n => Math.round(n * 2)).join(',');
  if (!force && key === BR.rect) return;
  BR.rect = key;
  post('brRect', { x: r.left / W, y: r.top / H, w: r.width / W, h: r.height / H, ar: r.height / Math.max(1, r.width), pw: Math.round(r.width), ph: Math.round(r.height) });
}

/* ---------- navigation ---------- */
const brRaf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const brDomain = u => brHost(u).replace(/^www\./, '') || brShow(u);
const brNewTabObj = () => ({ hist: [], pos: -1, url: '', start: true });

function brStartClass(on) {
  $('#app .brbody')?.classList.toggle('st', on);
  $('#screen')?.classList.toggle('brst', on);
}
function brStartOn() {
  if (BR.kb) brKbClose();
  BR.start = true; BR.rect = null;
  brStartClass(true);
  post('brClose');                       // stop the page (sound / video) while the start page is shown
  brUpdateBar();
}
async function brStartOff() {
  if (!BR.start) return;
  BR.start = false;
  brStartClass(false);
  await brRaf();
  brSendRect(true);
}

async function brGo(input, opt = {}) {
  const url = brResolve(input);
  if (!url) return false;
  const was = BR.start;
  if (was) await brStartOff();
  const r = await post('brNav', { url });
  if (!r || !r.ok) { toast(t((r && r.err) || 'Invalid address')); if (was) brStartOn(); return false }
  BR.url = url;
  if (!opt.noPush) { BR.hist = BR.hist.slice(0, BR.pos + 1); if (BR.hist[BR.hist.length - 1] !== url) BR.hist.push(url); BR.pos = BR.hist.length - 1 }
  if (!opt.noPast) { BR.past = [{ u: url, t: Date.now() }, ...BR.past.filter(x => x.u !== url)].slice(0, 30); brSet('br_past', BR.past) }
  brSet('br_last', url);
  brUpdateBar();
  return true;
}
function brStep(d) {
  if (BR.start) { if (d < 0 && BR.url) brGo(BR.url, { noPush: true, noPast: true }); return }
  const i = BR.pos + d;
  if (i < 0 || i >= BR.hist.length) return;
  BR.pos = i;
  brGo(BR.hist[i], { noPush: true, noPast: true });
}
function brUpdateBar() {
  const inp = $('#brurl');
  if (inp && document.activeElement !== inp) inp.value = BR.start ? '' : brDomain(BR.url);
  const fav = !BR.start && BR.fav.some(f => f.u === BR.url);
  $('#brfav')?.classList.toggle('on', fav);
  $('#brback')?.toggleAttribute('disabled', BR.start ? !BR.url : BR.pos <= 0);
  $('#brfwd')?.toggleAttribute('disabled', BR.start || BR.pos >= BR.hist.length - 1);
  const n = $('#brtabn'); if (n) n.textContent = BR.tabs.length;
  const m = $('#brmode'); if (m) m.innerHTML = brIc(BR.drag === 'scroll' ? 'hand' : 'mouse', 20);
}

/* ---------- tabs (one real page at a time; the other tabs keep their address + history) ---------- */
function brTabSave() { const x = BR.tabs[BR.cur]; if (x) { x.hist = BR.hist; x.pos = BR.pos; x.url = BR.url; x.start = BR.start } }
async function brTabLoad(i) {
  const x = BR.tabs[i]; if (!x) return;
  BR.cur = i; BR.hist = x.hist; BR.pos = x.pos; BR.url = x.url;
  if (x.start || !x.url) brStartOn(); else await brGo(x.url, { noPush: true, noPast: true });
  brUpdateBar();
}
function brTabOpen(i) { brTabSave(); return brTabLoad(i) }
function brNewTab() {
  if (BR.tabs.length >= 8) { toast(t('Max tabs')); return false }
  brTabSave();
  BR.tabs.push(brNewTabObj());
  BR.cur = BR.tabs.length - 1; BR.hist = []; BR.pos = -1; BR.url = '';
  brStartOn();
  return true;
}
function brTabClose(i) {
  brTabSave();
  const was = i === BR.cur;
  BR.tabs.splice(i, 1);
  if (!BR.tabs.length) BR.tabs.push(brNewTabObj());
  if (i < BR.cur) BR.cur--;
  BR.cur = Math.min(BR.cur, BR.tabs.length - 1);
  if (was) brTabLoad(BR.cur); else brUpdateBar();
}

/* ---------- mouse forwarding (drag = scroll, or real mouse drag) ---------- */
function brBindViewport(v) {
  let down = null, lastMove = 0, acc = { dx: 0, dy: 0 }, flushT = 0;
  const norm = e => {
    const r = v.getBoundingClientRect();
    return { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)), r };
  };
  const pageScale = () => { const w = v.getBoundingClientRect().width || 1; return (BR.pageW || w) / w };   // auto width = 1:1
  const flush = () => {
    flushT = 0;
    if (!acc.dx && !acc.dy) return;
    post('brScroll', { dx: Math.round(acc.dx), dy: Math.round(acc.dy) });
    acc = { dx: 0, dy: 0 };
  };
  const addScroll = (dx, dy) => { acc.dx += dx; acc.dy += dy; if (!flushT) flushT = setTimeout(flush, 33) };

  v.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    v.setPointerCapture(e.pointerId);
    const n = norm(e);
    if (BR.kb) { const ki = $('#brkin'); if (ki) ki.value = ''; brType('begin'); setTimeout(() => $('#brkin')?.focus(), 160) }
    down = { id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, x: n.x, y: n.y, moved: false };
    if (BR.drag === 'mouse') post('brMouse', { t: 'down', x: n.x, y: n.y });
  });
  v.addEventListener('pointermove', e => {
    const n = norm(e);
    if (!down) {                                                     // hover
      const now = performance.now();
      if (now - lastMove > 60) { lastMove = now; post('brMouse', { t: 'move', x: n.x, y: n.y }) }
      return;
    }
    if (BR.drag === 'mouse') {
      const now = performance.now();
      if (now - lastMove > 25) { lastMove = now; post('brMouse', { t: 'move', x: n.x, y: n.y }) }
      down.moved = true;
      return;
    }
    if (!down.moved && Math.hypot(e.clientX - down.sx, e.clientY - down.sy) < 7) return;
    down.moved = true;
    const k = pageScale();
    addScroll(-(e.clientX - down.lx) * k, -(e.clientY - down.ly) * k);   // finger down = page goes up
    down.lx = e.clientX; down.ly = e.clientY;
  });
  const end = e => {
    if (!down) return;
    const n = norm(e), d = down; down = null;
    if (BR.drag === 'mouse') post('brMouse', { t: 'up', x: n.x, y: n.y });
    else if (!d.moved) post('brMouse', { t: 'click', x: d.x, y: d.y });
    else flush();
  };
  v.addEventListener('pointerup', end);
  v.addEventListener('pointercancel', () => { down = null });
  v.addEventListener('wheel', e => { e.preventDefault(); const k = pageScale(); addScroll(e.deltaX * k * .6, e.deltaY * k * .6) }, { passive: false });
  v.addEventListener('contextmenu', e => e.preventDefault());
}

/* ---------- keyboard -> page ----------
   FiveM DUI has no keyboard native, so the text typed here (real keyboard, NUI has focus) is injected into the field that is
   focused on the page (client/browser.lua builds the script; the NUI never sends code). Tap a field in the page, then type. */
let brKbT = 0;
function brType(op, text) { post('brType', { op, text: text || '' }) }
function brKbOpen(first) {
  const b = $('#brkb'), i = $('#brkin'); if (!b || !i || BR.sheet) return;
  if (!BR.kb) { BR.kb = true; b.classList.add('on'); i.value = ''; brType('begin') }
  if (first) { i.value += first; brType('text', i.value) }
  i.focus();
}
function brKbClose() {
  const b = $('#brkb'), i = $('#brkin');
  clearTimeout(brKbT);
  if (!BR.kb) return;
  BR.kb = false; b?.classList.remove('on'); if (i) { i.value = ''; i.blur() }
  brType('end');
}
function brKbBind() {
  const i = $('#brkin'); if (!i) return;
  i.oninput = () => { clearTimeout(brKbT); brKbT = setTimeout(() => brType('text', i.value), 50) };
  i.onkeydown = e => {
    if (e.key === 'Enter') { e.preventDefault(); brKbSubmit() }
  };
  $('#brkclr').onclick = () => { i.value = ''; brType('clear'); i.focus() };
  $('#brksend').onclick = brKbSubmit;
  $('#brkbd').onclick = () => { BR.kb ? brKbClose() : brKbOpen() };
  brKeysBind();
  brKeysRender();
}
function brKbSubmit() {
  const i = $('#brkin'); if (!i) return;
  clearTimeout(brKbT); brType('text', i.value); brType('enter'); brKbClose();
}

/* ---------- on-screen keyboard (FR azerty / EN qwerty / AR / symbols) ---------- */
const BRK = {
  fr: ['azertyuiop', 'qsdfghjklm', 'wxcvbn'],
  en: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
  ar: ['ضصثقفغعهخح', 'شسيبلاتنمك', 'جدذرزوةىطظ', 'ئءؤ،؟'],
  sym: ['1234567890', '@#&_-()=/+', '.,?!\'":;*%'],
};
const BRK_N = { fr: 'FR', en: 'EN', ar: 'ع' };
function brKeysRender() {
  const el = $('#brkeys'); if (!el) return;
  const lay = BR.lay || 'fr', latin = lay !== 'ar', sym = !!BR.sym, cap = BR.shift && latin && !sym;
  const rows = (sym ? BRK.sym : BRK[lay] || BRK.fr).map(r => [...r]);
  const key = k => `<button type="button" data-k="${esc(k)}">${esc(cap ? k.toUpperCase() : k)}</button>`;
  let h = '';
  rows.forEach((r, n) => {
    const last = n === 2 && latin && !sym;
    h += `<div class="brkrow">${last ? `<button type="button" class="sp wide${BR.shift ? ' on' : ''}" data-a="shift">${brIc('shift', 17)}</button>` : ''}${r.map(key).join('')}${last ? `<button type="button" class="sp wide" data-a="bs">${brIc('bs', 18)}</button>` : ''}</div>`;
  });
  h += `<div class="brkrow">
    <button type="button" class="sp wide" data-a="sym">${sym ? 'abc' : '123'}</button>
    <button type="button" class="sp" data-a="lang">${BRK_N[lay] || 'FR'}</button>
    <button type="button" class="sp space" data-a="space"></button>
    <button type="button" data-k=".">.</button>
    ${(latin && !sym) ? '' : `<button type="button" class="sp wide" data-a="bs">${brIc('bs', 18)}</button>`}
    <button type="button" class="sp go wide" data-a="enter">${brIc('go', 18)}</button>
  </div>`;
  el.innerHTML = h;
}
function brKeyPress(b) {
  const i = $('#brkin'); if (!i) return;
  const a = b.dataset.a, lay = BR.lay || 'fr', latin = lay !== 'ar';
  if (a === 'shift') { BR.shift = !BR.shift; brKeysRender(); return }
  if (a === 'sym') { BR.sym = !BR.sym; brKeysRender(); return }
  if (a === 'lang') { const o = ['fr', 'en', 'ar']; BR.lay = o[(o.indexOf(lay) + 1) % o.length]; BR.sym = false; BR.shift = false; brSet('br_lay', BR.lay); brKeysRender(); return }
  if (a === 'enter') { brKbSubmit(); return }
  if (a === 'bs') i.value = [...i.value].slice(0, -1).join('');
  else {
    let c = a === 'space' ? ' ' : (b.dataset.k || '');
    if (BR.shift && latin && !BR.sym) { c = c.toUpperCase(); BR.shift = false; brKeysRender() }
    if (i.value.length < 300) i.value += c;
  }
  clearTimeout(brKbT); brKbT = setTimeout(() => brType('text', i.value), 30);
}
function brKeysBind() {
  const el = $('#brkeys'); if (!el) return;
  let rep = 0, rep2 = 0;
  const stop = () => { clearTimeout(rep); clearInterval(rep2); rep = rep2 = 0 };
  el.onpointerdown = e => {
    const b = e.target.closest('button'); if (!b) return;
    e.preventDefault();
    brKeyPress(b);
    if (b.dataset.a === 'bs') { stop(); rep = setTimeout(() => { rep2 = setInterval(() => brKeyPress(b), 55) }, 420) }
  };
  el.onpointerup = el.onpointerleave = el.onpointercancel = stop;
  el.oncontextmenu = e => e.preventDefault();
}
/* ESC closes the keyboard bar first (before the phone-wide ESC handler); a printable key typed with no field focused opens it */
addEventListener('keydown', e => {
  if (!BR.on) return;
  if (e.key === 'Escape' && BR.kb) { e.stopImmediatePropagation(); e.preventDefault(); brKbClose(); return }
  if (BR.kb || BR.sheet || BR.start || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
  const a = document.activeElement;
  if (a && a !== document.body && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
  e.preventDefault(); brKbOpen(e.key);
}, true);

/* ---------- start page (CPhone-Internet-like quick access) ---------- */
const BR_COL = { google: '#4285f4', youtube: '#ff0000', wikipedia: '#202124', maps: '#34a853', translate: '#1a73e8', gmail: '#ea4335', amazon: '#ff9900', facebook: '#1877f2', x: '#000000' };
function brStartHtml(cfg) {
  const tiles = (cfg.shortcuts || []).slice(0, 11).map(x => {
    const c = BR_COL[String(x.n || '').toLowerCase()] || '#5b5f66';
    return `<button class="brsc" data-u="${esc(x.u)}"><span class="brsci" style="color:${c}">${esc((x.n || '?').slice(0, 1).toUpperCase())}</span><em dir="auto">${esc(x.n)}</em></button>`;
  }).join('');
  return `<div class="brst-in">
    <div class="brst-search">${brIc('search', 20)}<input id="brsin" dir="auto" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t('Search or URL'))}"></div>
    <div class="brgrid">${tiles}<button class="brsc" data-a="bk"><span class="brsci add">${brIc('plus', 24)}</span><em></em></button></div></div>`;
}

/* ---------- menu popup / tabs / bookmarks / history ---------- */
function brCopy(text) {
  let ok = false;
  try { const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); ok = document.execCommand('copy'); ta.remove() } catch (e) { }
  if (!ok) { try { navigator.clipboard.writeText(text); ok = true } catch (e) { } }
  toast(t(ok ? 'Link copied' : 'Invalid address'));
}
function brSheet(kind) {
  BR.sheet = kind;
  let s = $('#brsheet');
  if (!s) { s = document.createElement('div'); s.id = 'brsheet'; $('#app .body').appendChild(s) }
  if (!kind) { s.remove(); BR.sheet = null; setTimeout(() => brSendRect(true), 30); return }
  if (BR.kb) brKbClose();
  s.className = 'k-' + kind;
  const letter = u => esc((brDomain(u) || '?').slice(0, 1).toUpperCase());
  const rows = (list, cls) => list.length ? list.map(x => `<button class="brrow ${cls}" data-u="${esc(x.u)}"><i>${letter(x.u)}</i><span><b dir="auto">${esc(brDomain(x.u))}</b><small dir="ltr">${esc(brShow(x.u))}</small></span></button>`).join('') : '';
  let h = '';
  if (kind === 'menu') {
    const cur = BR.start ? '' : BR.url, fav = BR.fav.some(f => f.u === cur);
    const mi = (a, ic, lbl, sub, dis) => `<button class="brmi" data-a="${a}"${dis ? ' disabled' : ''}>${brIc(ic, 24)}<span>${esc(lbl)}${sub ? `<small>${esc(sub)}</small>` : ''}</span></button>`;
    h = `<div class="brsh-bg" data-a="x"></div><div class="brpop">
      <div class="brpop-h"><div class="brpop-th">${cur ? letter(cur) : brIc('home', 22)}</div>
        <div class="brpop-t"><b dir="auto">${esc(cur ? brDomain(cur) : t('Home page'))}</b><small dir="ltr">${esc(cur ? brShow(cur) : '')}</small></div>
        <button class="brpop-s" data-a="share"${cur ? '' : ' disabled'}>${brIc('share', 22)}</button></div>
      <div class="brpop-l">
        ${mi('past', 'hist', t('History'))}
        ${mi('fav', 'bkl', t('Bookmarks'))}
        ${mi('addfav', fav ? 'starf' : 'addto', fav ? t('Remove bookmark') : t('Add page to'), '', !cur)}
        ${mi('reload', 'reload', t('Reload'), '', !cur)}
        <div class="brdot"></div>
        ${mi('home', 'home', t('Home page'))}
        ${mi('kb', 'kbd', t('Keyboard'))}
        ${mi('mode', BR.drag === 'scroll' ? 'hand' : 'mouse', BR.drag === 'scroll' ? t('Scroll mode') : t('Mouse mode'), BR.drag === 'scroll' ? t('Drag scrolls the page') : t('Drag moves like a mouse'))}
      </div></div>`;
  } else if (kind === 'tabs') {
    const cards = BR.tabs.map((x, i) => {
      const u = i === BR.cur ? (BR.start ? '' : BR.url) : (x.start ? '' : x.url);
      return `<div class="brtc${i === BR.cur ? ' cur' : ''}" data-i="${i}"><div class="brtch"><b dir="auto">${esc(u ? brDomain(u) : t('New tab'))}</b><button data-x="${i}">${brIc('close', 16)}</button></div>
        <div class="brtcb">${u ? `<span>${letter(u)}</span>` : brIc('home', 30)}</div></div>`;
    }).join('');
    h = `<div class="brfull"><div class="brfh"><b>${esc(t('Tabs'))}</b><em>${BR.tabs.length}</em></div>
      <div class="brtgrid">${cards}</div>
      <div class="brtbar"><button data-a="closeall">${esc(t('Close all'))}</button><button class="plus" data-a="newtab">${brIc('plus', 26)}</button><button data-a="x">${esc(t('Done'))}</button></div></div>`;
  } else {
    const fav = kind === 'fav';
    const list = fav ? BR.fav : BR.past;
    h = `<div class="brfull"><div class="brfh"><button class="brback" data-a="x">${brIc('back', 22)}</button><b>${esc(fav ? t('Bookmarks') : t('History'))}</b>${(!fav && BR.past.length) ? `<button class="brclr" data-a="clear">${esc(t('Clear'))}</button>` : ''}</div>
      <div class="brlist">${rows(list, fav ? 'f' : 'h') || `<div class="brempty">${esc(t(fav ? 'No favorites yet' : 'No history yet'))}</div>`}</div></div>`;
  }
  s.innerHTML = h;
  s.onclick = e => {
    const xb = e.target.closest('[data-x]');
    if (xb) { e.stopPropagation(); brTabClose(+xb.dataset.x); BR.sheet === 'tabs' && brSheet('tabs'); return }
    const card = e.target.closest('[data-i]');
    if (card) { const i = +card.dataset.i; brSheet(null); if (i !== BR.cur) brTabOpen(i); return }
    const b = e.target.closest('[data-a],[data-u]'); if (!b || b.disabled) return;
    if (b.dataset.u) { brSheet(null); brGo(b.dataset.u); return }
    const a = b.dataset.a;
    if (a === 'x') brSheet(null);
    else if (a === 'fav' || a === 'past') brSheet(a);
    else if (a === 'bk') brSheet('fav');
    else if (a === 'newtab') { brSheet(null); brNewTab() }
    else if (a === 'closeall') { BR.tabs = [brNewTabObj()]; BR.cur = 0; BR.hist = []; BR.pos = -1; BR.url = ''; brStartOn(); brSheet(null) }
    else if (a === 'share') { brCopy(BR.url); brSheet(null) }
    else if (a === 'addfav') { brSheet(null); brToggleFav() }
    else if (a === 'reload') { brSheet(null); brGo(BR.url, { noPush: true, noPast: true }) }
    else if (a === 'home') { brSheet(null); brStartOn() }
    else if (a === 'kb') { brSheet(null); setTimeout(() => brKbOpen(), 60) }
    else if (a === 'mode') { BR.drag = BR.drag === 'scroll' ? 'mouse' : 'scroll'; brSet('br_drag', BR.drag); brUpdateBar(); brSheet('menu') }
    else if (a === 'clear') { BR.past = []; brSet('br_past', []); brSheet('past') }
  };
}
function brToggleFav() {
  if (!BR.url || BR.start) return;
  const i = BR.fav.findIndex(f => f.u === BR.url);
  if (i >= 0) { BR.fav.splice(i, 1); toast(t('Removed')) } else { BR.fav.unshift({ u: BR.url, t: Date.now() }); BR.fav = BR.fav.slice(0, 40); toast(t('Saved')) }
  brSet('br_fav', BR.fav);
  brUpdateBar();
}

/* ---------- life cycle ---------- */
function brStop() {
  if (!BR.on) return;
  if (BR.kb) brKbClose();
  BR.on = false; BR.rect = null; BR.sheet = null; BR.start = false;
  clearInterval(BR.timer); BR.timer = 0;
  $('#screen')?.classList.remove('br-live', 'brst');
  $('#phone')?.classList.remove('br-live');
  post('brClose');
}

async function chromeApp() {
  brStop();
  const cfg = await post('brCfg');
  if (!cfg || !cfg.ok) { toast(t('Browser disabled')); home(); return }
  BR.cfg = cfg; BR.pageW = cfg.pageW || 0;
  BR.fav = brLs('br_fav', []); BR.past = brLs('br_past', []); BR.drag = brLs('br_drag', 'scroll');
  BR.hist = []; BR.pos = -1; BR.url = ''; BR.lay = brLs('br_lay', 'fr'); BR.sym = false; BR.shift = false;
  BR.tabs = [brNewTabObj()]; BR.tabs[0].start = false; BR.cur = 0; BR.start = false;

  const b = view('', `<div class="brtop">
      <div class="brbar">
        <button id="brfav" type="button">${brIc('star', 20)}</button>
        <i class="brlock">${brIc('lock', 14)}</i>
        <input id="brurl" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t('Search or type address'))}">
        <button id="brgo" type="button">${brIc('reload', 20)}</button></div>
    </div>
    <div id="brv"></div>
    <div id="brstart">${brStartHtml(cfg)}</div>
    <button id="brkbd" type="button" title="${esc(t('Keyboard'))}">${brIc('kbd', 22)}</button>
    <div class="brbot">
      <button id="brback" type="button" disabled>${brIc('back', 24)}</button>
      <button id="brfwd" type="button" disabled>${brIc('fwd', 24)}</button>
      <button id="brhome" type="button">${brIc('home', 24)}</button>
      <button id="brbk" type="button">${brIc('bkl', 24)}</button>
      <button id="brtabs" type="button"><span class="brtb"><span id="brtabn">1</span></span></button>
      <button id="brmenu" type="button">${brIc('menu', 24)}<u></u></button>
    </div>
    <div class="brkb" id="brkb"><div class="brkr"><input id="brkin" dir="auto" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="300" placeholder="${esc(t('Type in the page'))}">
      <button id="brkclr" type="button" title="${esc(t('Clear field'))}">${brIc('close', 16)}</button>
      <button id="brksend" type="button">${brIc('go', 18)}</button></div>
      <div class="brkeys" id="brkeys"></div></div>`, { nohdr: true, dark: true, app: 'br', cls: 'full brbody' });

  BR.on = true;
  $('#screen').classList.add('br-live');
  $('#phone').classList.add('br-live');
  $('#screen').classList.remove('light');

  const inp = $('#brurl');
  inp.onfocus = () => { inp.value = BR.start ? '' : BR.url; setTimeout(() => inp.select(), 0) };
  inp.onblur = () => brUpdateBar();
  inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); const v = inp.value; inp.blur(); brGo(v) } };
  $('#brgo').onclick = () => { if (BR.url && !BR.start) brGo(BR.url, { noPush: true, noPast: true }) };
  $('#brback').onclick = () => brStep(-1);
  $('#brfwd').onclick = () => brStep(1);
  $('#brhome').onclick = () => brStartOn();
  $('#brfav').onclick = brToggleFav;
  $('#brbk').onclick = () => brSheet(BR.sheet ? null : 'fav');
  $('#brtabs').onclick = () => brSheet(BR.sheet ? null : 'tabs');
  $('#brmenu').onclick = () => brSheet(BR.sheet ? null : 'menu');
  const sin = $('#brsin');
  sin.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); const v = sin.value; sin.value = ''; sin.blur(); brGo(v) } };
  $('#brstart').onclick = e => {
    const x = e.target.closest('[data-u],[data-a]'); if (!x) return;
    if (x.dataset.u) brGo(x.dataset.u); else if (x.dataset.a === 'bk') brSheet('fav');
  };
  brBindViewport($('#brv'));
  brKbBind();

  // keep the game-side rectangle in sync (the phone can animate / be resized)
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  brSendRect(true);
  BR.timer = setInterval(() => brSendRect(false), 120);

  const last = cfg.restore ? brLs('br_last', '') : '';
  await brGo(last || cfg.home);
}

/* leaving the app (home, another app, phone closed) must release the page */
(function () {
  const check = () => {
    if (!BR.on) return;
    const a = $('#app'), p = $('#phone');
    if (!a || !a.classList.contains('br') || (p && p.classList.contains('hidden'))) brStop();
  };
  const app = $('#app'), ph = $('#phone');
  if (app) new MutationObserver(check).observe(app, { attributes: true, attributeFilter: ['class'] });
  if (ph) new MutationObserver(check).observe(ph, { attributes: true, attributeFilter: ['class'] });
  addEventListener('resize', () => { if (BR.on) setTimeout(() => brSendRect(true), 60) });
})();
