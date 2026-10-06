/* ===== Health app (CPhone-Health look): steps, walking, running, cycling, swimming - data from qb-core server ===== */
const HL = { tab: 'home', page: 'home', d: null, top: null };
const hlN = n => Math.round(+n || 0).toLocaleString('en');
const hlKm = m => ((+m || 0) / 1000).toFixed(2);
const hlMin = s => { const m = Math.round((+s || 0) / 60); return m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60) + 'm' : m + ' ' + t('min') };
const HL_ICO = {
  home: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><path d="M17.5 10c-3-1.9-4-3.4-4-4.7a2.2 2.2 0 014-.9 2.2 2.2 0 014 .9c0 1.3-1 2.8-4 4.7z"/>',
  act: '<circle cx="14.5" cy="4.5" r="1.9"/><path d="M4.5 21l4.5-6 3.5 1.5 1 5.5M12.5 16L11 11l4-1.5 2.5 3.5 3 .5M11 11.5L7.5 12.5"/>',
  fire: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 .3 1.5 1 2 2 2-.5-3 0-6 1-8z"/>',
  bars: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
  nhome: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M12 17.5c-2.5-1.7-3.3-2.8-3.3-3.9a1.7 1.7 0 013.3-.5 1.7 1.7 0 013.3.5c0 1.1-.8 2.2-3.3 3.9z" fill="currentColor"/>',
  flag: '<path d="M5 21V4h13l-3 4.5 3 4.5H5"/>',
  fit: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M10.5 11.5v5l4-2.5z"/>',
  goal: '<path d="M4 9V6a2 2 0 012-2h3M15 4h3a2 2 0 012 2v3M20 15v3a2 2 0 01-2 2h-3M9 20H6a2 2 0 01-2-2v-3M9 12h6M12 9v6"/>',
  walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6-2.5-2.5 1.5-4.5 3.5 2 2.5 1M11 9.5L8 12M13.5 15l3 2 1 4"/>',
  bike: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l3 7M14 6h2"/>',
  swim: '<circle cx="16" cy="6" r="1.8"/><path d="M5 11l5-3 4 3M3 15c2 1.5 3 1.5 5 0s3-1.5 5 0 3 1.5 5 0M3 20c2 1.5 3 1.5 5 0s3-1.5 5 0 3 1.5 5 0"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5z"/>',
  more: '<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
};
const hlI = (k, s = 24) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${HL_ICO[k]}</svg>`;
const HL_BLANK = { ok: false, today: { steps: 0, walk_m: 0, run_m: 0, bike_m: 0, swim_m: 0, walk_s: 0, run_s: 0, bike_s: 0, swim_s: 0, kcal: 0, min: 0, dist: 0 }, goal: 6000, goals: { min: 30, kcal: 400 }, profile: { weight: 70, height: 175, goal: 6000 }, week: [], mode: 'idle' };

function hlHeart(a, b, c, S = 104) {
  const P = 'M50 90C10 62 4 32 26 19c12-6 24 0 24 10 0-10 12-16 24-10 22 13 16 43-24 71z';
  const ring = (p, col, sc, w) => `<g transform="translate(50 52) scale(${sc}) translate(-50 -52)"><path d="${P}" pathLength="100" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="${w}"/><path d="${P}" pathLength="100" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${Math.max(.1, Math.min(100, p))} 100"/></g>`;
  return `<svg width="${S}" height="${S}" viewBox="0 0 100 100">${ring(a, '#8ed61f', 1, 7)}${ring(b, '#25b5ee', .76, 8)}${ring(c, '#a63de0', .53, 10)}</svg>`;
}
const hlDay = ds => new Date(ds + 'T12:00:00').toLocaleDateString(st.settings.language || 'en', { weekday: 'short' });
function hlBars(w, key, fmt) {
  const mx = Math.max(1, ...w.map(x => x[key]));
  return `<div class="hl-bars">${w.map((x, i) => `<div class="${i === w.length - 1 ? 'now' : ''}" title="${esc(fmt(x[key]))}"><i style="height:${Math.max(3, x[key] / mx * 78)}px"></i>${esc(hlDay(x.d).slice(0, 3))}</div>`).join('')}</div>`;
}
function hlMsg(d) {
  const s = d.today.steps, g = d.goal, h = new Date().getHours();
  if (s >= g) return [t('Goal reached!'), t('You hit your daily steps goal. Great job!')];
  if (s < 5) return [t('Ready to get moving?'), t('Walk or run around the city and your steps will be counted here.')];
  return [h >= 20 ? t("It's not too late to get in some movement") : t('Keep it up!'), hlN(g - s) + ' ' + t('steps to your daily goal.')];
}
const HL_MODE = { idle: 'Resting', walk: 'Walking', run: 'Running', bike: 'Cycling', swim: 'Swimming', vehicle: 'In a vehicle' };

function hlHome(d) {
  const T = d.today, [h1, h2] = hlMsg(d), p1 = T.steps / d.goal * 100, p2 = T.min / d.goals.min * 100, p3 = T.kcal / d.goals.kcal * 100;
  const tab = HL.tab;
  if (tab === 'home') return `
    <div class="hl-card hl-glass hl-hero"><b>${esc(h1)}</b><p>${esc(h2)}</p><button class="hl-btn" data-tab="act">${esc(t('View records'))}</button><div class="hl-dots"><i></i><i></i><i></i></div></div>
    <div class="hl-card"><h3>${esc(t('Steps'))}</h3><div class="hl-big">${hlN(T.steps)}<small>/ ${hlN(d.goal)} ${esc(t('steps'))}</small></div><div class="hl-prog"><i style="width:${Math.min(100, p1)}%"></i></div>
      <div class="hl-days">${d.week.map((x, i) => `<span class="${i === d.week.length - 1 ? 'now' : ''}">${+x.d.slice(8)}</span>`).join('')}</div></div>
    <div class="hl-g2"><div class="hl-card"><h3>${esc(t('Daily activity'))}</h3><div style="display:grid;place-items:center">${hlHeart(p1, p2, p3, 96)}</div></div>
      <div class="hl-card c-nv hl-col"><span class="art"></span><h3>${esc(t('Now'))}</h3><div class="hl-big">${esc(t(HL_MODE[d.mode] || 'Resting'))}</div><div class="hl-sub">${hlKm(T.dist)} km ${esc(t('today'))}</div></div></div>
    <div style="height:10px"></div>
    <div class="hl-g2"><div class="hl-card c-gr hl-col"><span class="art"></span><span class="ic">${hlI('walk', 26)}</span><h3>${esc(t('Walking'))}</h3><div class="hl-big">${hlKm(T.walk_m)}<small>km</small></div><div class="hl-sub">${hlMin(T.walk_s)}</div></div>
      <div class="hl-card c-or hl-col"><span class="art"></span><span class="ic">${hlI('act', 26)}</span><h3>${esc(t('Running'))}</h3><div class="hl-big">${hlKm(T.run_m)}<small>km</small></div><div class="hl-sub">${hlMin(T.run_s)}</div></div></div>
    <div style="height:10px"></div>
    <div class="hl-g2"><div class="hl-card c-pk hl-col"><span class="art"></span><span class="ic">${hlI('bike', 26)}</span><h3>${esc(t('Cycling'))}</h3><div class="hl-big">${hlKm(T.bike_m)}<small>km</small></div><div class="hl-sub">${hlMin(T.bike_s)}</div></div>
      <div class="hl-card c-bl hl-col"><span class="art"></span><span class="ic">${hlI('swim', 26)}</span><h3>${esc(t('Swimming'))}</h3><div class="hl-big">${hlKm(T.swim_m)}<small>km</small></div><div class="hl-sub">${hlMin(T.swim_s)}</div></div></div>`;
  if (tab === 'act') return `
    <div class="hl-h"><b>${esc(t('Activity'))}</b><p>${esc(h2)}</p></div>
    <div class="hl-card"><h3>${esc(t('Daily activity'))}</h3><div class="hl-rings"><div class="hl-st">
      <div><i style="background:#6cb81a">${hlI('walk', 15)}</i><span><b>${hlN(T.steps)}</b>${esc(t('steps'))}</span></div>
      <div><i style="background:#1a9bd8">${hlI('fit', 15)}</i><span><b>${hlN(T.min)}</b>${esc(t('mins'))}</span></div>
      <div><i style="background:#9b2fd0">${hlI('fire', 15)}</i><span><b>${hlN(T.kcal)}</b>kcal</span></div></div>${hlHeart(p1, p2, p3, 118)}</div></div>
    <div class="hl-card c-gr"><h3>${esc(t('Active days this week'))}</h3><div class="hl-big">${d.week.filter(x => x.min >= 1).length}<small>/ 7 ${esc(t('days'))}</small></div>${hlBars(d.week, 'min', v => hlN(v) + ' min')}</div>
    <div class="hl-card c-nv"><h3>${esc(t('Distance today'))}</h3><div class="hl-big">${hlKm(T.dist)}<small>km</small></div><div class="hl-sub">${esc(t('Walking'))} ${hlKm(T.walk_m)} · ${esc(t('Running'))} ${hlKm(T.run_m)} · ${esc(t('Cycling'))} ${hlKm(T.bike_m)} · ${esc(t('Swimming'))} ${hlKm(T.swim_m)}</div></div>`;
  if (tab === 'fire') {
    const w = d.profile.weight, kc = (met, s) => (met - 1) * w * s / 3600, rows = [['Walking', kc(3.5, T.walk_s), '#6cb81a'], ['Running', kc(9, T.run_s), '#ff7a2f'], ['Cycling', kc(6.8, T.bike_s), '#e85a8f'], ['Swimming', kc(8, T.swim_s), '#25b5ee']], mx = Math.max(1, ...rows.map(r => r[1]));
    return `<div class="hl-h"><b>${esc(t('Energy'))}</b><p>${esc(t('Active calories burned today from walking, running, cycling and swimming.'))}</p></div>
    <div class="hl-card c-or"><h3>${esc(t('Active calories'))}</h3><div class="hl-big">${hlN(T.kcal)}<small>/ ${hlN(d.goals.kcal)} kcal</small></div><div class="hl-prog"><i style="width:${Math.min(100, p3)}%;background:#fff"></i></div></div>
    <div class="hl-card"><h3>${esc(t('Breakdown'))}</h3><div class="hl-brk">${rows.map(r => `<div><em>${esc(t(r[0]))}</em><span class="hl-prog"><i style="width:${r[1] / mx * 100}%;background:${r[2]}"></i></span><b>${hlN(r[1])}</b></div>`).join('')}</div></div>
    <div class="hl-card c-pu"><h3>${esc(t('Weekly calories'))}</h3>${hlBars(d.week, 'kcal', v => hlN(v) + ' kcal')}</div>`;
  }
  const W = d.week, sum = k => W.reduce((a, x) => a + x[k], 0);
  return `<div class="hl-h"><b>${esc(t('Trends'))}</b><p>${esc(t('Your last 7 days.'))}</p></div>
    <div class="hl-card"><h3>${esc(t('Steps'))}</h3><div class="hl-sub">${esc(t('Average'))} ${hlN(sum('steps') / 7)} / ${esc(t('day'))}</div>${hlBars(W, 'steps', hlN)}</div>
    <div class="hl-card c-nv"><h3>${esc(t('Distance'))} (km)</h3><div class="hl-sub">${esc(t('Total'))} ${hlKm(sum('dist'))} km</div>${hlBars(W, 'dist', v => hlKm(v) + ' km')}</div>
    <div class="hl-card c-gr"><h3>${esc(t('Active minutes'))}</h3><div class="hl-sub">${esc(t('Total'))} ${hlN(sum('min'))} ${esc(t('min'))}</div>${hlBars(W, 'min', hlN)}</div>`;
}
function hlTogether() {
  const l = (HL.top && HL.top.list) || [];
  return `<div class="hl-h"><b>${esc(t('Together'))}</b><p>${esc(t("Today's top walkers in the city."))}</p></div>
    <div class="hl-card">${l.length ? l.map(r => `<div class="hl-row${r.me ? ' me' : ''}"><em>${r.rank}</em><b>${esc(r.name)}</b><span>${hlN(r.steps)} ${esc(t('steps'))}</span></div>`).join('') : `<div class="hl-empty">${esc(t('No activity yet today. Go for a walk!'))}</div>`}</div>`;
}
function hlFitness(d) {
  const T = d.today, live = d.mode && d.mode !== 'idle' && d.mode !== 'vehicle';
  return `<div class="hl-h"><b>${esc(t('Fitness'))}</b></div>
    <div class="hl-card hl-glass"><div class="hl-live ${live ? '' : 'idle'}"><i></i><span>${esc(t(HL_MODE[d.mode] || 'Resting'))}</span></div></div>
    <div class="hl-card"><h3>${esc(t('Exercise'))}</h3><div class="hl-ex">
      <div><i style="background:#4f9a3f">${hlI('walk', 28)}</i>${esc(t('Walking'))}<b>${hlKm(T.walk_m)} km</b></div>
      <div><i style="background:#7a8a1e">${hlI('act', 28)}</i>${esc(t('Running'))}<b>${hlKm(T.run_m)} km</b></div>
      <div><i style="background:#e0705f">${hlI('bike', 28)}</i>${esc(t('Cycling'))}<b>${hlKm(T.bike_m)} km</b></div>
      <div><i style="background:#2f86d8">${hlI('swim', 28)}</i>${esc(t('Swimming'))}<b>${hlKm(T.swim_m)} km</b></div></div></div>
    <div class="hl-card c-gr"><h3>${esc(t('Time active today'))}</h3><div class="hl-big">${hlN(T.min)}<small>${esc(t('min'))}</small></div><div class="hl-sub">${hlN(T.kcal)} kcal · ${hlKm(T.dist)} km</div></div>`;
}
function hlRender() {
  const sc = $('#hl-scroll'); if (!sc) return;
  const d = HL.d || HL_BLANK, y = sc.scrollTop;
  const tabs = [['home', 'home'], ['act', 'act'], ['fire', 'fire'], ['bars', 'bars']];
  const head = HL.page === 'home' ? `<div class="hl-top"><h1>${esc(t('Health'))}</h1><button class="hl-av" id="hl-me">${hlI('user', 20)}</button><button class="hl-kb" id="hl-kb">${hlI('more', 22)}</button></div>
    <div class="hl-pills">${tabs.map(x => `<button data-tab="${x[0]}" class="${HL.tab === x[0] ? 'on' : ''}">${hlI(x[1], 23)}</button>`).join('')}</div>` : '<div class="hl-top"></div>';
  sc.innerHTML = head + (HL.page === 'home' ? hlHome(d) : HL.page === 'together' ? hlTogether() : hlFitness(d));
  sc.scrollTop = y;
  sc.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { HL.tab = b.dataset.tab; sc.scrollTop = 0; hlRender() });
  $('#hl-me')?.addEventListener('click', hlSheet); $('#hl-kb')?.addEventListener('click', hlSheet);
  const nv = $('#hl-nav');
  nv.innerHTML = `<div class="hl-pill">${[['home', 'nhome', 'Home'], ['together', 'flag', 'Together'], ['fitness', 'fit', 'Fitness']].map(x => `<button data-p="${x[0]}" class="${HL.page === x[0] ? 'on' : ''}">${hlI(x[1], 24)}<span>${esc(t(x[2]))}</span></button>`).join('')}</div><button class="hl-fab" id="hl-goal">${hlI('goal', 26)}</button>`;
  nv.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { HL.page = b.dataset.p; sc.scrollTop = 0; hlLoad(); });
  $('#hl-goal').onclick = hlSheet;
}
async function hlLoad() {
  if (!$('#hl-scroll')) return;
  const r = await post('healthGet');
  if (!$('#hl-scroll')) return;
  HL.d = r && r.ok ? r : (HL.d || HL_BLANK);
  if (HL.page === 'together') HL.top = await post('healthTop');
  hlRender();
}
function hlSheet() {
  const p = (HL.d || HL_BLANK).profile;
  $('.hl-sheet')?.remove();
  const m = document.createElement('div'); m.className = 'hl-sheet';
  m.innerHTML = `<div class="hl-sh"><b>${esc(t('Health profile'))}</b>
    <label>${esc(t('Daily steps goal'))}<input id="hl-g" type="number" value="${p.goal}"></label>
    <label>${esc(t('Weight (kg)'))}<input id="hl-w" type="number" value="${p.weight}"></label>
    <label>${esc(t('Height (cm)'))}<input id="hl-h" type="number" value="${p.height}"></label>
    <button class="hl-btn" id="hl-save">${esc(t('Save'))}</button><button class="hl-btn g" id="hl-x">${esc(t('Cancel'))}</button></div>`;
  $('#app').appendChild(m);
  m.onclick = e => { if (e.target === m) m.remove() };
  $('#hl-x').onclick = () => m.remove();
  $('#hl-save').onclick = async () => {
    const r = await post('healthProfile', { goal: +$('#hl-g').value, weight: +$('#hl-w').value, height: +$('#hl-h').value });
    if (r && r.ok) { HL.d = { ...r, mode: HL.d && HL.d.mode }; m.remove(); toast(t('Saved')); hlRender() } else toast(t('Invalid values'));
  };
}
function healthApp() {
  view('', '<div class="hl-scroll" id="hl-scroll"></div><div class="hl-nav" id="hl-nav"></div>', { nohdr: true, dark: true, app: 'hlth', cls: 'full' });
  HL.page = 'home'; HL.tab = 'home';
  hlRender(); hlLoad();
  clearInterval(st.wi); st.wi = setInterval(hlLoad, 5000);
}
if (typeof TR !== 'undefined' && TR.ar) Object.assign(TR.ar, { 'Health': 'الصحة', 'Home': 'الرئيسية', 'Together': 'معًا', 'Fitness': 'اللياقة', 'Steps': 'الخطوات', 'steps': 'خطوة', 'Walking': 'المشي', 'Running': 'الجري', 'Cycling': 'الدراجة', 'Swimming': 'السباحة', 'Activity': 'النشاط', 'Energy': 'الطاقة', 'Trends': 'الإحصائيات', 'Daily activity': 'النشاط اليومي', 'today': 'اليوم', 'Now': 'الآن', 'Resting': 'راحة', 'In a vehicle': 'في سيارة', 'View records': 'عرض السجلات', 'Goal reached!': 'تم بلوغ الهدف!', 'Save': 'حفظ', 'Cancel': 'إلغاء', 'Exercise': 'التمارين', 'min': 'د', 'mins': 'دقيقة', 'Health profile': 'الملف الصحي', 'Daily steps goal': 'هدف الخطوات اليومي', 'Weight (kg)': 'الوزن (كغ)', 'Height (cm)': 'الطول (سم)', 'Keep it up!': 'واصل!', 'Ready to get moving?': 'مستعد للحركة؟' });
if (typeof TR !== 'undefined' && TR.fr) Object.assign(TR.fr, { 'Health': 'Santé', 'Home': 'Accueil', 'Together': 'Ensemble', 'Fitness': 'Forme', 'Steps': 'Pas', 'steps': 'pas', 'Walking': 'Marche', 'Running': 'Course', 'Cycling': 'Vélo', 'Swimming': 'Natation', 'Activity': 'Activité', 'Energy': 'Énergie', 'Trends': 'Tendances', 'Save': 'Enregistrer', 'Cancel': 'Annuler' });
