/* ---------- App opening splash ----------
   Every app opens with a short branded screen: icon pops in, the app name is typed letter by letter (FLECABANK, GARAGE, ...),
   a tagline fades in, then the app appears. Tap the splash to skip it. Can be turned off in Settings > Display. */

const SPLASH = {
  bank:     { n: 'FLECABANK',      c: ['#04211b', '#0b6b4f', '#3ddc97'], tag: { en: 'Your money, in your pocket', ar: 'فلوسك في جيبك', fr: 'Votre argent, dans la poche' } },
  garage:   { n: 'GARAGE',     c: ['#16181d', '#3a3f4a', '#ff9f1c'], tag: { en: 'Your cars, one tap away', ar: 'سياراتك بضغطة وحدة', fr: 'Vos voitures, en un geste' } },
  trendy:   { n: 'TRENDY',     c: ['#0a0a12', '#2a0f3a', '#fe2c55'], tag: { en: 'See what is trending', ar: 'شوف شنو في الترند', fr: 'Voyez ce qui buzz' } },
  inpic:    { n: 'INPIC',      c: ['#3a1c71', '#d76d77', '#ffaf7b'], tag: { en: 'Share your moments', ar: 'شارك لحظاتك', fr: 'Partagez vos moments' } },
  messages: { n: 'MESSAGES',   c: ['#0a2540', '#1a73e8', '#8ab4f8'], tag: { en: 'Stay in touch', ar: 'خليك على تواصل', fr: 'Restez en contact' } },
  phone:    { n: 'PHONE',      c: ['#062b1a', '#0f7a3f', '#5bf29a'], tag: { en: 'Call anyone', ar: 'اتصل بأي واحد', fr: 'Appelez qui vous voulez' } },
  whatsnow: { n: 'WHATSNOW',   c: ['#05302a', '#128c7e', '#25d366'], tag: { en: 'Chat right now', ar: 'دردش دروك', fr: 'Discutez maintenant' } },
  calc:     { n: 'CALCULATOR', c: ['#1c1c1e', '#3a3a3c', '#ff9f0a'], tag: { en: 'Quick maths', ar: 'حسابات سريعة', fr: 'Calculs rapides' } },
  services: { n: 'SERVICES',   c: ['#0d2b45', '#1f6f8b', '#7fd4ff'], tag: { en: 'Find the right pro', ar: 'لقّى اللي تحتاجو', fr: 'Trouvez le bon pro' } },
  music:    { n: 'MUSIC',      c: ['#1a0b2e', '#5b2a86', '#e0aaff'], tag: { en: 'Feel the beat', ar: 'استمتع بالموسيقى', fr: 'Sentez le rythme' } },
  youtube:  { n: 'CTUBE',    c: ['#1a0505', '#7a0c0c', '#ff3d3d'], tag: { en: 'Watch anything', ar: 'شاهد أي حاجة', fr: 'Regardez tout' } },
  gemini:   { n: 'CMINAI',     c: ['#0b1230', '#3b2f7a', '#8ab4f8'], tag: { en: 'Ask me anything', ar: 'اسألني على أي حاجة', fr: 'Demandez-moi tout' } },
  browser:  { n: 'BROWSER',    c: ['#0f1a2e', '#1a4fa3', '#8ab4f8'], tag: { en: 'Any site, anywhere', ar: 'أي موقع، في أي مكان', fr: 'Tout site, partout' } },
  camera:   { n: 'CAMERA',     c: ['#0e0e0e', '#2b2b2b', '#ffffff'], tag: { en: 'Capture the moment', ar: 'التقط اللحظة', fr: 'Capturez l’instant' } },
  photos:   { n: 'PHOTOS',     c: ['#2a1030', '#7a3b7a', '#ffd166'], tag: { en: 'Your memories', ar: 'ذكرياتك', fr: 'Vos souvenirs' } },
  weather:  { n: 'WEATHER',    c: ['#0b2a52', '#3a86c8', '#bde4ff'], tag: { en: 'Know the sky', ar: 'اعرف الجو', fr: 'Le ciel du jour' } },
  clock:    { n: 'CLOCK',      c: ['#0d0d12', '#25262e', '#7aa2ff'], tag: { en: 'Time is on your side', ar: 'الوقت معاك', fr: 'Le temps pour vous' } },
  maps:     { n: 'MAPS',       c: ['#0c2b1c', '#1f7a4c', '#7ee0a6'], tag: { en: 'Find your way', ar: 'لقّى طريقك', fr: 'Trouvez votre route' } },
  radio:    { n: 'RADIO',      c: ['#2b1205', '#8a3b0f', '#ffb37a'], tag: { en: 'Tune in', ar: 'اضبط الموجة', fr: 'Restez branchés' } },
  yasir:    { n: 'CDRIVE',      c: ['#2a2200', '#7a6200', '#ffd60a'], tag: { en: 'Your ride is on the way', ar: 'الطاكسي جاي', fr: 'Votre taxi arrive' } },
  settings: { n: 'SETTINGS',   c: ['#101820', '#2b3a4a', '#9ec5ff'], tag: { en: 'Make it yours', ar: 'خصّصو على ذوقك', fr: 'Personnalisez' } },
};

const SPL = { busy: false, timer: 0, done: null };
const splashOn = () => { try { return localStorage.getItem('spl') !== '0' } catch (e) { return true } };

function splashRun(id, open) {
  const d = SPLASH[id];
  const host = $('#screen');
  if (!d || !host) { open(); return }
  const lang = (st.settings && st.settings.language) || 'en';
  const iconId = (typeof APPS !== 'undefined' && (APPS.find(a => a.id === id) || {}).i) || id;
  const len = d.n.length, step = Math.min(75, Math.round(650 / len)), fs = Math.min(40, Math.floor(250 / (len * 0.82)));
  const typed = 160 + len * step, total = typed + 420;
  const el = document.createElement('div');
  el.id = 'spl'; el.className = 'spl';
  el.style.cssText = `--c1:${d.c[0]};--c2:${d.c[1]};--ac:${d.c[2]};--fs:${fs}px;--tot:${total}ms`;
  el.innerHTML = `<div class="spl-glow"></div>
    <div class="spl-ico"><img src="icons/${esc(iconId)}.svg" alt=""></div>
    <div class="spl-name" dir="ltr">${[...d.n].map((c, i) => `<span style="animation-delay:${160 + i * step}ms">${esc(c)}</span>`).join('')}</div>
    <div class="spl-tag" dir="auto" style="animation-delay:${typed}ms">${esc(d.tag[lang] || d.tag.en)}</div>
    <div class="spl-line"><i></i></div>`;
  host.appendChild(el);
  SPL.busy = true;
  let fin = false;
  const finish = () => {
    if (fin) return; fin = true;
    clearTimeout(SPL.timer);
    try { open() } catch (e) { console.log('[ios-phone] splash open failed', e) }
    el.classList.add('out');
    setTimeout(() => { el.remove(); SPL.busy = false }, 300);
  };
  el.onclick = finish;
  SPL.timer = setTimeout(finish, total);
}

/* wrap openApp: same lock handling as before, then splash, then the real open */
const _openAppNow = openApp;
openApp = function (id) {
  if (st.locked && !unlockPhone()) { st.afterUnlock = () => openApp(id); return }
  if (SPL.busy) return;
  if (!splashOn() || !SPLASH[id]) return _openAppNow(id);
  splashRun(id, () => _openAppNow(id));
};

/* Settings > Display: on/off switch */
const _displaySettings = displaySettings;
displaySettings = function () {
  _displaySettings();
  const card = document.querySelector('#app .ss-card');
  if (!card) return;
  card.insertAdjacentHTML('beforeend', `<div class="ss-div"></div><div class="ss-row" style="cursor:default"><div class="ss-txt"><b>App opening animation</b><small>Show the app name when an app opens</small></div>${ssToggle('ss-spl', splashOn())}</div>`);
  const sw = $('#ss-spl');
  if (sw) sw.onchange = e => { try { localStorage.setItem('spl', e.target.checked ? '1' : '0') } catch (err) { } };
};
