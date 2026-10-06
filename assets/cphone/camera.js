/* =====================================================================
   CPhone-style camera for ios-phone
   Photo / Portrait / Video / More (Pro, Night, Food, Slow motion, Hyperlapse)
   - UI is drawn in NUI (design grid 720x1600, scaled to the screen height)
   - the viewfinder is a transparent window: the GAME is visible through it
   - pictures/frames come from screenshot-basic (client/main.lua) and are cropped to the window
   - video = frames -> canvas -> MediaRecorder (webm), saved with a latent event
   Loaded after app.js (uses: st, post, $, t, shrink, TR)
   ===================================================================== */
(() => {
  'use strict';

  /* ---------- texts ---------- */
  const EN = {
    PORTRAIT: 'PORTRAIT', PHOTO: 'PHOTO', VIDEO: 'VIDEO', MORE: 'MORE', PRO: 'PRO', NIGHT: 'NIGHT', FOOD: 'FOOD',
    PANORAMA: 'PANORAMA', 'SLOW MOTION': 'SLOW MOTION', HYPERLAPSE: 'HYPERLAPSE', Edit: 'Edit',
    far: 'Move further away from subject.', Ready: 'Ready', hold: 'Hold still', soon: 'Coming soon',
    saved: 'Photo saved', vsaved: 'Video saved', saving: 'Saving…', failed: 'Failed', big: 'Video too large',
    settings: 'Camera settings', grid: 'Grid lines', sound: 'Shutter sound', close: 'Close',
    Original: 'Original', Warm: 'Warm', Cool: 'Cool', Mono: 'Mono', Vivid: 'Vivid', Fade: 'Fade', Noir: 'Noir',
    hint: '<kbd>ENTER</kbd> shoot · <kbd>←</kbd><kbd>→</kbd> mode · <kbd>↑</kbd> flip<br><kbd>🖱</kbd> zoom · <kbd>ALT</kbd> mouse cursor · <kbd>BACKSPACE</kbd> exit',
    hintc: '<kbd>ALT</kbd> back to look-around · <kbd>BACKSPACE</kbd> exit',
  };
  const CTR = {
    fr: { PORTRAIT: 'PORTRAIT', PHOTO: 'PHOTO', VIDEO: 'VIDÉO', MORE: 'PLUS', PRO: 'PRO', NIGHT: 'NUIT', FOOD: 'FOOD', PANORAMA: 'PANORAMA', 'SLOW MOTION': 'RALENTI', HYPERLAPSE: 'HYPERLAPSE', Edit: 'Modifier',
      far: 'Éloignez-vous du sujet.', Ready: 'Prêt', hold: 'Ne bougez pas', soon: 'Bientôt disponible', saved: 'Photo enregistrée', vsaved: 'Vidéo enregistrée', saving: 'Enregistrement…', failed: 'Échec', big: 'Vidéo trop lourde',
      settings: 'Paramètres de l’appareil photo', grid: 'Grille', sound: 'Son de l’obturateur', close: 'Fermer', Original: 'Original', Warm: 'Chaud', Cool: 'Froid', Mono: 'Mono', Vivid: 'Vif', Fade: 'Délavé', Noir: 'Noir',
      hint: '<kbd>ENTRÉE</kbd> photo · <kbd>←</kbd><kbd>→</kbd> mode · <kbd>↑</kbd> inverser<br><kbd>🖱</kbd> zoom · <kbd>ALT</kbd> curseur souris · <kbd>RETOUR</kbd> quitter', hintc: '<kbd>ALT</kbd> revenir à la caméra · <kbd>RETOUR</kbd> quitter' },
    ar: { PORTRAIT: 'بورتريه', PHOTO: 'صورة', VIDEO: 'فيديو', MORE: 'المزيد', PRO: 'احترافي', NIGHT: 'ليلي', FOOD: 'طعام', PANORAMA: 'بانوراما', 'SLOW MOTION': 'حركة بطيئة', HYPERLAPSE: 'هايبرلابس', Edit: 'تعديل',
      far: 'ابتعد عن الهدف.', Ready: 'جاهز', hold: 'لا تتحرك', soon: 'قريباً', saved: 'تم حفظ الصورة', vsaved: 'تم حفظ الفيديو', saving: 'جارٍ الحفظ…', failed: 'فشل', big: 'الفيديو كبير جداً',
      settings: 'إعدادات الكاميرا', grid: 'خطوط الشبكة', sound: 'صوت الالتقاط', close: 'إغلاق', Original: 'أصلي', Warm: 'دافئ', Cool: 'بارد', Mono: 'أحادي', Vivid: 'زاهي', Fade: 'باهت', Noir: 'داكن',
      hint: '<kbd>ENTER</kbd> التقاط · <kbd>←</kbd><kbd>→</kbd> الوضع · <kbd>↑</kbd> قلب<br><kbd>🖱</kbd> zoom · <kbd>ALT</kbd> مؤشر الفأرة · <kbd>BACKSPACE</kbd> خروج', hintc: '<kbd>ALT</kbd> رجوع للتصوير · <kbd>BACKSPACE</kbd> خروج' },
    es: { PORTRAIT: 'RETRATO', PHOTO: 'FOTO', VIDEO: 'VÍDEO', MORE: 'MÁS', PRO: 'PRO', NIGHT: 'NOCHE', FOOD: 'COMIDA', PANORAMA: 'PANORAMA', 'SLOW MOTION': 'CÁMARA LENTA', HYPERLAPSE: 'HIPERLAPSO', Edit: 'Editar',
      far: 'Aléjate del sujeto.', Ready: 'Listo', hold: 'No te muevas', soon: 'Próximamente', saved: 'Foto guardada', vsaved: 'Vídeo guardado', saving: 'Guardando…', failed: 'Error', big: 'Vídeo demasiado grande',
      settings: 'Ajustes de la cámara', grid: 'Cuadrícula', sound: 'Sonido del obturador', close: 'Cerrar', Original: 'Original', Warm: 'Cálido', Cool: 'Frío', Mono: 'Mono', Vivid: 'Vivo', Fade: 'Desvaído', Noir: 'Noir',
      hint: '<kbd>ENTER</kbd> foto · <kbd>←</kbd><kbd>→</kbd> modo · <kbd>↑</kbd> girar<br><kbd>🖱</kbd> zoom · <kbd>ALT</kbd> cursor · <kbd>RETROCESO</kbd> salir', hintc: '<kbd>ALT</kbd> volver a la cámara · <kbd>RETROCESO</kbd> salir' },
    tr: { PORTRAIT: 'PORTRE', PHOTO: 'FOTOĞRAF', VIDEO: 'VİDEO', MORE: 'DAHA FAZLA', PRO: 'PRO', NIGHT: 'GECE', FOOD: 'YEMEK', PANORAMA: 'PANORAMA', 'SLOW MOTION': 'YAVAŞ ÇEKİM', HYPERLAPSE: 'HİPERLAPS', Edit: 'Düzenle',
      far: 'Konudan uzaklaşın.', Ready: 'Hazır', hold: 'Sabit durun', soon: 'Yakında', saved: 'Fotoğraf kaydedildi', vsaved: 'Video kaydedildi', saving: 'Kaydediliyor…', failed: 'Başarısız', big: 'Video çok büyük',
      settings: 'Kamera ayarları', grid: 'Izgara çizgileri', sound: 'Deklanşör sesi', close: 'Kapat', Original: 'Orijinal', Warm: 'Sıcak', Cool: 'Soğuk', Mono: 'Mono', Vivid: 'Canlı', Fade: 'Soluk', Noir: 'Noir',
      hint: '<kbd>ENTER</kbd> çek · <kbd>←</kbd><kbd>→</kbd> mod · <kbd>↑</kbd> çevir<br><kbd>🖱</kbd> zoom · <kbd>ALT</kbd> imleç · <kbd>BACKSPACE</kbd> çıkış', hintc: '<kbd>ALT</kbd> kameraya dön · <kbd>BACKSPACE</kbd> çıkış' },
  };
  const L = k => ((CTR[st.settings.language] || {})[k]) || EN[k] || k;

  /* ---------- icons ---------- */
  const S = (p, o = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${o}>${p}</svg>`;
  const BOLT = '<path d="M13 2.5L5.5 13H11l-1 8.5L18.5 10H13z"/>';
  const ICO = {
    flashOff: S(BOLT + '<path d="M3.5 3.5l17 17"/>'),
    flashOn: S(BOLT),
    flashAuto: S('<path d="M12 2.5L4.5 13H10l-1 8.5L17.5 10H12z"/><path d="M17 15l2.4-6 2.4 6M17.9 13.2h3" stroke-width="1.4"/>'),
    ring: S('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.6"/><path d="M12 1.5v2.2M12 20.3v2.2M1.5 12h2.2M20.3 12h2.2" stroke-width="1.3"/>'),
    flower: '<svg viewBox="0 0 24 24" width="50" height="50"><g fill="#fff"><circle cx="12" cy="5.6" r="3.5"/><circle cx="17.5" cy="8.8" r="3.5"/><circle cx="17.5" cy="15.2" r="3.5"/><circle cx="12" cy="18.4" r="3.5"/><circle cx="6.5" cy="15.2" r="3.5"/><circle cx="6.5" cy="8.8" r="3.5"/></g></svg>',
    flip: S('<path d="M20 11a8 8 0 0 0-14-4.2L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14 4.2l2-2.2"/><path d="M20 20v-5h-5"/>', 'width="50" height="50"'),
    gear: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    timer: S('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.8M9.5 2.5h5M12 2.5v3.5"/>'),
    smile: S('<circle cx="12" cy="12" r="9"/><path d="M8.3 14.3a4.6 4.6 0 0 0 7.4 0"/><circle cx="9" cy="9.8" r=".6" fill="#fff"/><circle cx="15" cy="9.8" r=".6" fill="#fff"/>'),
    x: S('<path d="M6 6l12 12M18 6L6 18"/>'),
    back: S('<path d="M14.5 5.5L8 12l6.5 6.5"/>', 'stroke-width="2"'),
    recents: S('<path d="M5 4v16M12 4v16M19 4v16" stroke-width="2.2"/>'),
    home: S('<rect x="4" y="4" width="16" height="16" rx="8" stroke-width="2"/>'),
    // MORE panel icons (circle + symbol)
    pro: '<svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"><circle cx="32" cy="32" r="26"/><path d="M32 12l8 14M48 22l-16 1.6M46 42l-8-14M32 52l-8-14M16 42l16-1.6M18 22l8 14" stroke-width="2.4"/></svg>',
    night: '<svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3"><circle cx="32" cy="32" r="26"/><path d="M42 40A13 13 0 0 1 26 22a13 13 0 1 0 16 18z" fill="#fff" stroke="none"/></svg>',
    food: '<svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="26"/><path d="M24 17v9a4 4 0 0 0 8 0v-9M28 17v28M40 45V17c-4 2-6 7-6 13h6"/></svg>',
    pano: '<svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18c14 7 30 7 44 0v28c-14 7-30 7-44 0z"/><path d="M10 18l-3-3M54 18l3-3" /><path d="M10 28c14 7 30 7 44 0" stroke-width="2"/></svg>',
    slow: '<svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3"><circle cx="32" cy="32" r="26"/><circle cx="34" cy="32" r="9" fill="#fff" stroke="none"/><path d="M19 32h-4" stroke-linecap="round"/></svg>',
    hyper: '<svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><circle cx="32" cy="32" r="26"/><circle cx="36" cy="32" r="8" fill="#fff" stroke="none"/><path d="M14 26h10M12 32h8M14 38h10"/></svg>',
  };

  /* ---------- state ---------- */
  const MAIN = ['portrait', 'photo', 'video', 'more'];
  const VIDM = ['video', 'slow', 'hyper'];
  const RATIOS = { '3:4': { h: 960, l: '12M' }, '1:1': { h: 720, l: '9M' }, '9:16': { h: 1280, l: 'FULL' } };
  const FX = {
    '': { css: '' },
    Warm: { css: 'sepia(.28) saturate(1.25) hue-rotate(-8deg)', tint: 'rgba(255,150,40,.12)' },
    Cool: { css: 'hue-rotate(14deg) saturate(1.1) brightness(1.03)', tint: 'rgba(40,120,255,.12)' },
    Mono: { css: 'grayscale(1) contrast(1.1)', tint: 'rgba(120,120,120,.10)' },
    Vivid: { css: 'saturate(1.65) contrast(1.1)', tint: '' },
    Fade: { css: 'contrast(.85) brightness(1.1) saturate(.8)', tint: 'rgba(255,255,255,.10)' },
    Noir: { css: 'grayscale(1) contrast(1.45) brightness(.9)', tint: 'rgba(0,0,0,.18)' },
  };
  const PRO_OPTS = {
    iso: ['A', 50, 100, 200, 400, 800, 1600, 3200],
    ss: ['A', '1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15', '1/8'],
    ev: [-2, -1.5, -1, -.5, 0, .5, 1, 1.5, 2],
    af: ['AF', 'MF'],
    wb: ['A', 2500, 3000, 4000, 5000, 6500, 8000],
  };
  const cam = {
    on: false, mode: 'photo', sub: null, ratio: '3:4', flash: 0, timer: 0, grid: false, snd: true, zoom: 1, hz: 8,
    bar: false, fxOpen: false, fx: '', blur: 2, proEdit: null, sheet: false, res: 'FHD',
    pro: { iso: 'A', ss: 'A', ev: 0, af: 'AF', wb: 'A' },
    busy: false, tok: 0, pend: null, rec: null, dec: false, compose: false, cur: false,
    cfg: { maxSec: 15, fps: 6, bitrate: 350000, maxSize: 1200000 }, vw: {}, vpend: null, pillT: null,
  };
  const key = () => cam.sub || cam.mode;
  const isVid = () => VIDM.includes(key());
  const $c = s => document.querySelector('#camfs ' + s);

  /* ---------- DOM ---------- */
  function build() {
    if (document.getElementById('camfs')) return;
    const el = document.createElement('div');
    el.id = 'camfs'; el.className = 'hidden';
    el.innerHTML = `<div id="cw">
      <div id="cvf"><div id="cvt"></div><div id="cgr"></div><div id="czf"></div><div id="cpill"></div><div id="ccd"></div><div id="cfl"></div></div>
      <div id="ctopbg"></div><div id="cbotbg"></div>
      <div id="ctop"></div><div id="cmid"></div><div id="clab"></div><div id="csub"></div>
      <div id="cnav">
        <button type="button" data-a="recents" style="left:159px">${ICO.recents}</button>
        <button type="button" data-a="exit" style="left:360px">${ICO.home}</button>
        <button type="button" data-a="exit" style="left:561px">${ICO.back}</button>
      </div>
    </div><div id="chint"></div>`;
    document.body.appendChild(el);
    el.addEventListener('click', onClick);
    window.addEventListener('resize', fit);
  }
  function fit() {
    const cw = $c('#cw'); if (!cw) return;
    const s = Math.min(innerHeight / 1600, innerWidth / 720);
    cw.style.transform = `scale(${s})`;
    cw.style.left = Math.round((innerWidth - 720 * s) / 2) + 'px';
  }
  const rectOf = () => { const r = $c('#cvf').getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height } };

  /* ---------- rendering ---------- */
  const fl = () => [ICO.flashOff, ICO.flashOn, ICO.flashAuto][cam.flash];
  const tt = (a, x, inner, cls = '') => `<button type="button" class="ctt ${cls}" data-a="${a}" style="left:${x}px">${inner}</button>`;
  const fmtT = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0');

  function renderTop() {
    const m = key(); let h = '';
    if (cam.rec) h = `<div class="rtime"><i></i><span id="crt">00:00</span></div>`;
    else if (m === 'portrait' || m === 'more') h = '';
    else if (m === 'photo' || m === 'night' || m === 'food') h = tt('flash', 523, fl()) + tt('ratio', 591, RATIOS[cam.ratio].l, 'tx') + tt('fxs', 660, ICO.ring);
    else if (m === 'pro') h = tt('flash', 592, fl()) + tt('fxs', 660, ICO.ring);
    else if (m === 'pano') h = tt('flash', 592, fl());
    else {
      const sl = m === 'slow' ? '240' : '30';
      h = tt('flash', 592, fl()) + tt('res', 660, `<span>${cam.res}</span><span>${sl}</span>`, 'tx2');
    }
    $c('#ctop').innerHTML = h;
  }

  function proBar() {
    const p = cam.pro;
    const iso = p.iso === 'A' ? 'A400' : p.iso;
    const ss = p.ss === 'A' ? 'A1/17S' : p.ss + 'S';
    const ev = (p.ev > 0 ? '+' : '') + p.ev.toFixed(1);
    const wb = p.wb === 'A' ? 'A4500K' : p.wb + 'K';
    const it = (k, lbl, v) => `<button type="button" data-a="pro" data-v="${k}" class="${cam.proEdit === k ? 'on' : ''}">${lbl}<b>${v}</b></button>`;
    return `<div class="cpro">${it('iso', 'ISO', iso)}${it('ss', '', ss)}${it('ev', 'EV', ev)}${it('af', '', p.af)}${it('wb', 'WB', wb)}</div>`;
  }
  function proRuler() {
    const k = cam.proEdit, cur = cam.pro[k];
    const lbl = v => k === 'ev' ? (v > 0 ? '+' : '') + v.toFixed(1) : k === 'wb' && v !== 'A' ? v + 'K' : v;
    return `<div class="cfx">${PRO_OPTS[k].map(v => `<button type="button" data-a="proset" data-k="${k}" data-v="${v}" class="${String(v) === String(cur) ? 'on' : ''}">${lbl(v)}</button>`).join('')}</div>`;
  }
  function barHtml() {
    const m = key();
    return `<div class="cbar">
      <button type="button" data-a="sheet">${ICO.gear}</button>
      <button type="button" data-a="timer" class="${cam.timer ? 'act' : ''}">${ICO.timer}${cam.timer ? `<em>${cam.timer}s</em>` : ''}</button>
      <button type="button" data-a="ratio" style="${isVid() ? 'opacity:.4' : ''}">${cam.ratio}</button>
      <button type="button" data-a="fxs">${ICO.smile}</button>
      <button type="button" class="x" data-a="bar">${ICO.x}</button></div>`;
  }
  function fxStrip() {
    return `<div class="cfx">${Object.keys(FX).map(k => `<button type="button" data-a="fxset" data-v="${k}" class="${cam.fx === k ? 'on' : ''}">${L(k || 'Original')}</button>`).join('')}</div>`;
  }
  function sheetHtml() {
    return `<div class="csheet"><h4>${L('settings')}</h4>
      <div class="rw"><span>${L('grid')}</span><button type="button" class="sw ${cam.grid ? 'on' : ''}" data-a="grid"></button></div>
      <div class="rw"><span>${L('sound')}</span><button type="button" class="sw ${cam.snd ? 'on' : ''}" data-a="snd"></button></div>
      <button type="button" class="cl" data-a="sheet">${L('close')}</button></div>`;
  }
  function morePanel() {
    const items = [['pro', 'PRO'], ['night', 'NIGHT'], ['food', 'FOOD'], ['pano', 'PANORAMA'], ['slow', 'SLOW MOTION'], ['hyper', 'HYPERLAPSE']];
    const xs = [104, 259, 414, 569];
    return `<button type="button" class="cedit" data-a="edit" style="left:628px;top:920px">${L('Edit')}</button><div id="cmore">` +
      items.map(([k, n], i) => `<button type="button" class="mi" data-a="sub" data-v="${k}" style="left:${xs[i % 4]}px;top:${i < 4 ? 29 : 201}px">${ICO[k]}<span>${L(n)}</span></button>`).join('') + '</div>';
  }

  function renderMid() {
    const m = key(), vid = isVid(), rec = !!cam.rec;
    let h = '';
    if (cam.mode === 'more' && !cam.sub) { $c('#cmid').innerHTML = morePanel(); return; }
    if (m === 'pro') h += proBar();
    // row A (y=1160)
    if (cam.sheet) h += sheetHtml();
    if (!rec) {
      if (cam.bar) h += barHtml();
      else if (cam.fxOpen) h += fxStrip();
      else if (cam.proEdit) h += proRuler();
      else {
        if (m === 'portrait') h += `<button type="button" class="cb pb" data-a="blur" style="left:66px;top:1160px"><i></i></button>`;
        if (vid && m !== 'hyper') h += `<div class="zp"><button type="button" data-a="zoom" data-v="1" class="${cam.zoom === 1 ? 'on' : ''}">1×</button><button type="button" data-a="zoom" data-v="2" class="${cam.zoom === 2 ? 'on' : ''}">2</button></div>`;
        if (m === 'hyper') h += `<button type="button" class="hp" data-a="hz">×${cam.hz}</button>`;
        if (m === 'pro') h += `<button type="button" class="cb wb" data-a="lens" style="left:359px;top:1160px">${cam.zoom === 2 ? 'T' : 'W'}</button>`;
        h += `<button type="button" class="cb gb" data-a="bar" style="left:652px;top:1160px"><i><b></b><b></b><b></b><b></b></i></button>`;
      }
    }
    // row B (y=1310)
    if (!rec) h += `<button type="button" class="cb fb" data-a="fx" style="left:116px;top:1310px">${ICO.flower}</button>`;
    h += `<button type="button" class="cb sh ${vid ? 'rd' : ''} ${rec ? 'rec' : ''}" data-a="shoot" style="left:360px;top:1310px"></button>`;
    if (m !== 'pro') h += `<button type="button" class="cb flb" data-a="flip" style="left:603px;top:1310px">${ICO.flip}</button>`;
    $c('#cmid').innerHTML = h;
  }

  function renderLab() {
    const lab = $c('#clab'), sub = $c('#csub');
    if (cam.sub) {
      lab.style.display = 'none';
      sub.innerHTML = `<div class="lbsub"><b data-a="subback">‹</b><span>${L(cam.sub === 'pano' ? 'PANORAMA' : { pro: 'PRO', night: 'NIGHT', food: 'FOOD', slow: 'SLOW MOTION', hyper: 'HYPERLAPSE' }[cam.sub])}</span></div>`;
      return;
    }
    sub.innerHTML = ''; lab.style.display = 'flex';
    lab.innerHTML = MAIN.map(k => `<span class="lb ${k === cam.mode ? 'on' : ''}" data-a="mode" data-v="${k}">${L(k.toUpperCase())}</span>`).join('');
    const on = lab.querySelector('.lb.on');
    lab.style.transform = `translateX(${Math.round(360 - (on.offsetLeft + on.offsetWidth / 2))}px)`;
  }

  function applyVf() {
    const r = RATIOS[cam.ratio], vf = $c('#cvf');
    vf.style.height = r.h + 'px';
    $c('#cbotbg').style.top = (120 + r.h) + 'px';
    $c('#cgr').classList.toggle('on', cam.grid);
    $c('#czf').classList.toggle('on', isVid() && cam.zoom === 2 && key() !== 'hyper');
    const e = expo(), tint = [];
    const f = FX[cam.fx] && FX[cam.fx].tint;
    let bg = f || 'transparent';
    if (key() === 'pro' && e < 1) bg = `rgba(0,0,0,${Math.min(.55, (1 - e) * .8)})`;
    else if (key() === 'pro' && e > 1) bg = `rgba(255,255,255,${Math.min(.3, (e - 1) * .18)})`;
    $c('#cvt').style.background = bg;
  }

  function render() {
    // ratio rules: video family is always 9:16, others use the chosen ratio (default 3:4)
    if (isVid()) cam.ratio = '9:16'; else if (cam.ratio === '9:16' && !cam.userRatio) cam.ratio = '3:4';
    renderTop(); renderMid(); renderLab(); applyVf();
  }

  /* ---------- helpers ---------- */
  function msg(text, ms = 2200, cls = '') {
    const p = $c('#cpill'); clearTimeout(cam.pillT);
    if (!text) { p.classList.remove('on'); return }
    p.textContent = text; p.className = 'on ' + cls;
    if (ms) cam.pillT = setTimeout(() => { p.classList.remove('on'); if (key() === 'portrait') msg(L('Ready'), 0, 'ready') }, ms);
  }
  function setMode(mode, sub) {
    if (cam.rec) stopRec();
    cam.mode = mode; cam.sub = sub || null; cam.bar = cam.fxOpen = cam.sheet = false; cam.proEdit = null;
    if (!isVid()) { cam.zoom = cam.zoom === 2 && key() === 'pro' ? 2 : 1; }
    cam.userRatio = false;
    if (!isVid() && cam.ratio === '9:16') cam.ratio = '3:4';
    render();
    if (key() === 'portrait') { msg(L('far'), 2000); }
    else msg('');
  }
  function expo() {
    if (key() !== 'pro') return 1;
    const p = cam.pro; let e = Math.pow(2, p.ev);
    if (p.iso !== 'A') e *= p.iso / 400;
    if (p.ss !== 'A') { const d = +String(p.ss).split('/')[1]; e *= 17 / d * 2.2; }
    return Math.max(.35, Math.min(2.6, e));
  }
  function flashFx() {
    const f = $c('#cfl'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  }
  function countdown(n, night) {
    return new Promise(res => {
      const c = $c('#ccd'); let i = n;
      const step = () => {
        if (!cam.on) return res();
        if (i <= 0) { c.classList.remove('on'); return res() }
        c.innerHTML = i + (night ? `<small>${L('hold')}</small>` : ''); c.classList.add('on'); i--;
        cam.cdT = setTimeout(step, 1000);
      };
      step();
    });
  }

  /* ---------- image processing ---------- */
  function filterStr(p) {
    const f = [];
    if (p.expo && p.expo !== 1) f.push(`brightness(${p.expo.toFixed(2)})`);
    if (p.mode === 'night') f.push('brightness(1.55) contrast(1.08) saturate(1.12)');
    if (p.mode === 'food') f.push('saturate(1.32) contrast(1.07)');
    if (p.fx && FX[p.fx]) f.push(FX[p.fx].css);
    return f.join(' ') || 'none';
  }
  function crop(img, p) {
    const fx = img.naturalWidth / innerWidth, fy = img.naturalHeight / innerHeight;
    let { left, top, width, height } = p.rect;
    if (p.zoom > 1) { left += width * (1 - 1 / p.zoom) / 2; top += height * (1 - 1 / p.zoom) / 2; width /= p.zoom; height /= p.zoom }
    return { sx: left * fx, sy: top * fy, sw: width * fx, sh: height * fy };
  }
  function soften(cv, ctx, img, c, p, radius, inner) {
    // blurred background + sharp elliptical centre (portrait / food)
    const w = cv.width, h = cv.height;
    ctx.filter = `blur(${radius}px) ${filterStr(p) === 'none' ? '' : filterStr(p)}`;
    ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, -radius, -radius, w + radius * 2, h + radius * 2);
    const sharp = document.createElement('canvas'); sharp.width = w; sharp.height = h;
    const sx = sharp.getContext('2d');
    sx.filter = filterStr(p);
    sx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, w, h);
    sx.filter = 'none'; sx.globalCompositeOperation = 'destination-in';
    const g = sx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * inner, w / 2, h / 2, Math.min(w, h) * (inner + .32));
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    sx.save(); sx.translate(w / 2, h / 2); sx.scale(1, h / w * 1.05); sx.translate(-w / 2, -h / 2);
    sx.fillStyle = g; sx.fillRect(-w, -h, w * 3, h * 3); sx.restore();
    ctx.filter = 'none'; ctx.drawImage(sharp, 0, 0);
  }
  function wbOverlay(ctx, w, h, wb) {
    if (wb === 'A') return;
    const k = +wb; ctx.save(); ctx.globalCompositeOperation = 'soft-light';
    if (k < 5000) ctx.fillStyle = `rgba(70,130,255,${Math.min(.5, (5000 - k) / 2500 * .45)})`;
    else if (k > 5500) ctx.fillStyle = `rgba(255,160,70,${Math.min(.5, (k - 5500) / 2500 * .45)})`;
    else { ctx.restore(); return }
    ctx.fillRect(0, 0, w, h); ctx.restore();
  }
  function processPhoto(img, p) {
    const c = crop(img, p);
    const outW = Math.max(120, Math.min(720, Math.round(c.sw))), outH = Math.round(outW * c.sh / c.sw);
    const cv = document.createElement('canvas'); cv.width = outW; cv.height = outH;
    const ctx = cv.getContext('2d');
    if (p.mode === 'portrait') soften(cv, ctx, img, c, p, [4, 9, 16][p.blur] || 9, .2);
    else if (p.mode === 'food') soften(cv, ctx, img, c, p, 6, .3);
    else { ctx.filter = filterStr(p); ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, outW, outH); ctx.filter = 'none' }
    if (p.mode === 'pro') wbOverlay(ctx, outW, outH, p.wb);
    return cv;
  }
  const thumbOf = (cv, w = 180, q = .65) => {
    const t = document.createElement('canvas'); t.width = w; t.height = Math.round(cv.height * w / cv.width);
    t.getContext('2d').drawImage(cv, 0, 0, t.width, t.height); return t.toDataURL('image/jpeg', q);
  };

  /* ---------- photo ---------- */
  async function shoot() {
    const m = key();
    if (m === 'pano') return msg(L('soon'));
    if (isVid()) return cam.rec ? stopRec() : startRec();
    if (cam.busy) return;
    cam.busy = true;
    let n = cam.timer; if (m === 'night' && n < 3) n = 3;
    if (n) await countdown(n, m === 'night');
    if (!cam.on) { cam.busy = false; return }
    const token = ++cam.tok;
    cam.pend = { token, mode: m, rect: rectOf(), zoom: cam.zoom, fx: cam.fx, expo: expo(), wb: cam.pro.wb, blur: cam.blur };
    $c('').classList.add('shot');                       // hide our UI for a moment (also acts as a shutter blink)
    setTimeout(() => post('camShot', { token, snd: cam.snd }), 60);
    setTimeout(() => { if (cam.pend && cam.pend.token === token) { cam.pend = null; cam.busy = false; $c('').classList.remove('shot'); msg(L('failed')) } }, 7000);
  }
  async function onPhotoFrame(d) {
    const p = cam.pend;
    if (!p || p.token !== d.token) return;
    cam.pend = null;
    const done = () => { cam.busy = false; $c('').classList.remove('shot'); };
    if (d.err || !d.data) { done(); return msg(L('failed')) }
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = d.data });
      const cv = processPhoto(img, p);
      const full = cv.toDataURL('image/jpeg', .8), th = thumbOf(cv);
      done(); flashFx();
      const r = await post('savePhoto', { image: full, thumb: th });
      if (r && r.ok) {
        msg(L('saved'), 1600);
        st.ph = st.ph || [];
        if (r.id) { st.ph.unshift({ id: r.id, ts: Date.now() / 1000, kind: 'photo' }); st.pc[r.id] = th }
        if (cam.compose || st.igCompose) {
          st.igComposeMedia = full; st.igComposePhotoId = r.id || null;
          setTimeout(() => post('camExit'), 500);
        }
      } else msg(L('failed'));
    } catch (e) { console.log('[ios-phone] camera error', e); done(); msg(L('failed')) }
  }

  /* ---------- video ---------- */
  function startRec() {
    if (typeof MediaRecorder === 'undefined') return msg(L('failed'));
    const m = key(), rect = rectOf();
    const wpx = cam.res === 'FHD' ? 480 : 360, hpx = Math.round(wpx * rect.height / rect.width);
    const cv = document.createElement('canvas'); cv.width = wpx; cv.height = hpx;
    const ctx = cv.getContext('2d'); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, wpx, hpx);
    if (!cv.captureStream) return msg(L('failed'));
    const mime = ['video/webm;codecs=vp8', 'video/webm;codecs=vp9', 'video/webm'].find(x => MediaRecorder.isTypeSupported(x));
    if (!mime) return msg(L('failed'));
    const br = cam.res === 'FHD' ? cam.cfg.bitrate : Math.round(cam.cfg.bitrate * .7);
    let mr, stream; try { stream = cv.captureStream(0); mr = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: br }) } catch (e) { return msg(L('failed')) }
    const track = stream.getVideoTracks()[0], manual = !!(track && track.requestFrame);
    if (!manual) { try { stream = cv.captureStream(); mr = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: br }) } catch (e) { return msg(L('failed')) } }
    const mk = () => { const c = document.createElement('canvas'); c.width = wpx; c.height = hpx; return c };
    const R = {
      cv, ctx, mr, chunks: [], bytes: 0, t0: performance.now(), rect, zoom: m === 'hyper' ? 1 : cam.zoom, fx: cam.fx, mode: m,
      speed: m === 'slow' ? .5 : m === 'hyper' ? cam.hz : 1, thumb: null, frames: 0,
      a: mk(), b: mk(), tb: 0, dt: 160, track: manual ? track : null, blend: m !== 'hyper',
      limit: m === 'hyper' ? cam.cfg.maxSec * 4 : m === 'slow' ? Math.max(4, Math.round(cam.cfg.maxSec / 2)) : cam.cfg.maxSec,
    };
    mr.ondataavailable = e => {
      if (!e.data || !e.data.size) return;
      R.chunks.push(e.data); R.bytes += e.data.size;
      if (R.bytes * 1.34 > cam.cfg.maxSize * .9) stopRec();
    };
    mr.onstop = () => finishRec(R);
    cam.rec = R; cam.bar = cam.fxOpen = false;
    mr.start(500);
    const fps = m === 'slow' ? Math.min(10, cam.cfg.fps + 3) : m === 'hyper' ? 1.5 : cam.cfg.fps;
    post('camVidStart', { fps, q: .4 });
    if (cam.snd) post('camSound', {});
    // constant 15 fps output: cross-fade previous -> newest game frame so low capture rates still look fluid
    R.draw = setInterval(() => {
      if (!R.tb) return;
      const k = R.blend ? Math.min(1, (performance.now() - R.tb) / R.dt) : 1;
      if (k < 1) { R.ctx.globalAlpha = 1; R.ctx.drawImage(R.a, 0, 0); R.ctx.globalAlpha = k; R.ctx.drawImage(R.b, 0, 0); R.ctx.globalAlpha = 1 }
      else R.ctx.drawImage(R.b, 0, 0);
      if (R.track) R.track.requestFrame();
    }, 66);
    R.tick = setInterval(() => {
      const s = (performance.now() - R.t0) / 1000, e = document.getElementById('crt');
      if (e) e.textContent = fmtT(s);
      if (s >= R.limit) stopRec();
    }, 250);
    render();
  }
  function onVidFrame(d) {
    const R = cam.rec; if (!R || cam.dec || !d.data) return;
    cam.dec = true;
    const put = im => {
      try {
        if (!cam.rec || cam.rec !== R) return;
        const c = crop(im, R), now = performance.now();
        const t = R.a; R.a = R.b; R.b = t;                       // b = newest frame
        const x = R.b.getContext('2d');
        x.filter = filterStr({ fx: R.fx, mode: '' });
        x.drawImage(im, c.sx, c.sy, c.sw, c.sh, 0, 0, R.b.width, R.b.height);
        x.filter = 'none';
        if (!R.frames) R.a.getContext('2d').drawImage(R.b, 0, 0);  // first frame: nothing to blend from
        if (R.tb) R.dt = Math.max(60, Math.min(700, R.dt * .6 + (now - R.tb) * .4));
        R.tb = now;
        if (!R.thumb) R.thumb = thumbOf(R.b, 180, .65);
        R.frames++;
      } finally { cam.dec = false; if (im.close) im.close() }
    };
    const fallback = () => { const im = new Image(); im.onload = () => put(im); im.onerror = () => { cam.dec = false }; im.src = d.data };
    if (window.createImageBitmap && window.fetch) {
      fetch(d.data).then(r => r.blob()).then(b => createImageBitmap(b)).then(put, fallback);
    } else fallback();
  }
  function stopRec(discard) {
    const R = cam.rec; if (!R) return;
    R.discard = !!discard; clearInterval(R.tick); clearInterval(R.draw);
    post('camVidStop');
    cam.rec = null; R.dur = Math.max(1, Math.round((performance.now() - R.t0) / 1000));
    try { R.mr.state !== 'inactive' ? R.mr.stop() : finishRec(R) } catch (e) { finishRec(R) }
    if (cam.on) render();
  }
  function finishRec(R) {
    if (R.discard || R.done) return; R.done = true;
    if (!R.frames || !R.chunks.length) return msg(L('failed'));
    const blob = new Blob(R.chunks, { type: 'video/webm' });
    const fr = new FileReader();
    fr.onload = () => {
      const image = 'data:video/webm;base64,' + String(fr.result).split(',')[1];
      if (image.length > cam.cfg.maxSize) return msg(L('big'));
      cam.vpend = { thumb: R.thumb, dur: R.dur, speed: R.speed };
      msg(L('saving'), 0);
      post('camSaveVideo', { image, thumb: R.thumb, dur: R.dur, speed: R.speed });
    };
    fr.readAsDataURL(blob);
  }

  /* ---------- gallery helpers (used by app.js) ---------- */
  window.camGetVideo = id => new Promise(res => {
    cam.vw[id] = res; post('getVideo', { id });
    setTimeout(() => { if (cam.vw[id]) { delete cam.vw[id]; res(null) } }, 25000);
  });
  window.camPlayVideo = (box, data, speed) => {
    const v = document.createElement('video');
    v.src = data; v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true; v.className = 'cam-vid';
    v.addEventListener('loadedmetadata', () => {
      v.playbackRate = speed || 1;
      if (v.duration === Infinity) {                       // MediaRecorder webm has no duration: force it
        v.currentTime = 1e101;
        v.addEventListener('timeupdate', function f() { v.removeEventListener('timeupdate', f); v.currentTime = 0; v.playbackRate = speed || 1; v.play().catch(() => { }) });
      }
    });
    v.addEventListener('play', () => { v.playbackRate = speed || 1 });
    v.onclick = () => v.paused ? v.play() : v.pause();
    box.innerHTML = ''; box.appendChild(v);
  };

  /* ---------- actions ---------- */
  function cycle(arr, v) { const i = arr.findIndex(x => String(x) === String(v)); return arr[(i + 1) % arr.length] }
  function onClick(e) {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a, v = b.dataset.v;
    switch (a) {
      case 'shoot': shoot(); break;
      case 'flip': post('camFlip'); break;
      case 'exit': post('camExit'); break;
      case 'recents': break;
      case 'mode': if (v === cam.mode && !cam.sub) break; setMode(v); break;
      case 'sub': if (v === 'pano') { msg(L('soon')); break } setMode('more', v); if (v === 'pro') { cam.zoom = 1 } render(); break;
      case 'subback': setMode('photo'); break;
      case 'edit': msg(L('soon')); break;
      case 'flash': cam.flash = (cam.flash + 1) % 3; renderTop(); break;
      case 'ratio': if (isVid()) break; cam.ratio = cycle(['3:4', '1:1', '9:16'], cam.ratio); cam.userRatio = true; render(); break;
      case 'res': cam.res = cam.res === 'FHD' ? 'HD' : 'FHD'; renderTop(); break;
      case 'fxs': cam.fxOpen = !cam.fxOpen; cam.bar = false; cam.proEdit = null; renderMid(); break;
      case 'fx': cam.fxOpen = !cam.fxOpen; cam.bar = false; cam.proEdit = null; renderMid(); break;
      case 'fxset': cam.fx = v; renderMid(); applyVf(); break;
      case 'bar': cam.bar = !cam.bar; cam.fxOpen = false; cam.proEdit = null; renderMid(); break;
      case 'timer': cam.timer = cycle([0, 2, 5, 10], cam.timer); renderMid(); break;
      case 'sheet': cam.sheet = !cam.sheet; renderMid(); break;
      case 'grid': cam.grid = !cam.grid; renderMid(); applyVf(); break;
      case 'snd': cam.snd = !cam.snd; renderMid(); break;
      case 'zoom': cam.zoom = +v; renderMid(); applyVf(); break;
      case 'lens': cam.zoom = cam.zoom === 2 ? 1 : 2; renderMid(); break;
      case 'hz': cam.hz = cycle([4, 8, 16], cam.hz); renderMid(); break;
      case 'blur': cam.blur = (cam.blur + 1) % 3; msg(['●', '●●', '●●●'][cam.blur], 700); break;
      case 'pro': cam.proEdit = cam.proEdit === v ? null : v; if (v === 'af') { cam.pro.af = cam.pro.af === 'AF' ? 'MF' : 'AF'; cam.proEdit = null } render(); break;
      case 'proset': { const k = b.dataset.k; const raw = b.dataset.v; cam.pro[k] = raw === 'A' || raw === 'AF' || raw === 'MF' ? raw : (k === 'ss' ? raw : +raw); render(); break }
    }
  }
  function handleKey(k) {
    if (!cam.on) return;
    if (k === 'shoot') shoot();
    else if (k === 'prev' || k === 'next') {
      if (cam.rec) return;
      if (cam.sub) return setMode('photo');
      const i = MAIN.indexOf(cam.mode) + (k === 'next' ? 1 : -1);
      if (i >= 0 && i < MAIN.length) setMode(MAIN[i]);
    }
  }
  window.addEventListener('keydown', e => {
    if (!cam.on || !cam.cur) return;                       // keyboard only reaches NUI while the cursor mode is on
    const k = e.key;
    if (k === 'Alt') { e.preventDefault(); post('camCursor', { on: false }) }
    else if (k === 'Enter') handleKey('shoot');
    else if (k === 'ArrowLeft') handleKey('prev');
    else if (k === 'ArrowRight') handleKey('next');
    else if (k === 'ArrowUp') post('camFlip');
    else if (k === 'Backspace' || k === 'Escape') post('camExit');
  });

  /* ---------- open / close ---------- */
  function open(d) {
    build();
    Object.assign(cam.cfg, { maxSec: d.maxSec || 15, fps: d.fps || 6, bitrate: d.bitrate || 350000, maxSize: d.maxSize || 1200000 });
    Object.assign(cam, { on: true, mode: 'photo', sub: null, ratio: '3:4', zoom: 1, bar: false, fxOpen: false, sheet: false, proEdit: null, busy: false, pend: null, rec: null, compose: !!d.compose, cur: false, userRatio: false });
    const el = $c(''); el.classList.remove('hidden', 'cur', 'shot');
    fit(); render(); msg('');
    const h = $c('#chint'); h.innerHTML = L('hint'); h.classList.remove('off');
    clearTimeout(cam.hintT); cam.hintT = setTimeout(() => h.classList.add('off'), 9000);
  }
  function close() {
    if (cam.rec) stopRec(true);
    clearTimeout(cam.cdT); cam.on = false; cam.busy = false; cam.pend = null;
    const el = document.getElementById('camfs'); if (el) el.classList.add('hidden');
  }

  window.addEventListener('message', e => {
    const d = e.data || {};
    switch (d.action) {
      case 'camOpen': open(d); break;
      case 'camClose': close(); break;
      case 'camKey': handleKey(d.key); break;
      case 'camZoom': msg(d.z.toFixed(1) + '×', 900, 'ready'); break;
      case 'camCursor': {
        cam.cur = !!d.on; const el = document.getElementById('camfs'); if (el) el.classList.toggle('cur', cam.cur);
        const h = $c('#chint'); if (h) { h.innerHTML = cam.cur ? L('hintc') : L('hint'); h.classList.remove('off'); clearTimeout(cam.hintT); cam.hintT = setTimeout(() => h.classList.add('off'), 5000) }
        break;
      }
      case 'camFrame': d.kind === 'vid' ? onVidFrame(d) : onPhotoFrame(d); break;
      case 'videoSaved': {
        const vp = cam.vpend; cam.vpend = null;
        if (d.data && d.data.ok) {
          msg(L('vsaved'), 1800);
          st.ph = st.ph || [];
          if (d.data.id && vp) { st.ph.unshift({ id: d.data.id, ts: Date.now() / 1000, kind: 'video', dur: vp.dur, speed: vp.speed }); st.pc[d.data.id] = vp.thumb }
          if (d.data.id && vp && (cam.compose || st.igCompose) && st.composeApp === 'trendy') {
            st.igComposeMedia = vp.thumb; st.igComposePhotoId = d.data.id; st.igComposeKind = 'video';
            setTimeout(() => post('camExit'), 600);
          }
        } else msg(d.data && d.data.err === 'size' ? L('big') : L('failed'));
        break;
      }
      case 'videoData': {
        const r = cam.vw[d.data && d.data.id]; if (r) { delete cam.vw[d.data.id]; r(d.data.data || null) }
        break;
      }
    }
  });
})();
