/* ===== CPhone Clock app: Alarm / World clock / Stopwatch / Timer ===== */
const CKL = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch (e) { return d } };
const CKS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } };
const CK = {
  tab: 'world',
  alarms: CKL('ck_alarms', []),
  cities: CKL('ck_cities', ['Europe/London']),
  sw: { run: false, start: 0, acc: 0, laps: [] },
  tm: { pick: [0, 0, 0], active: false, run: false, end: 0, total: 0, left: 0 },
  wxType: 'CLEAR', snooze: 0, audio: null, menu: false, editCities: false,
};
const CK_CITIES = [['London', 'Europe/London'], ['Paris', 'Europe/Paris'], ['Algiers', 'Africa/Algiers'], ['Cairo', 'Africa/Cairo'], ['Dubai', 'Asia/Dubai'], ['Riyadh', 'Asia/Riyadh'], ['Istanbul', 'Europe/Istanbul'], ['Moscow', 'Europe/Moscow'], ['Madrid', 'Europe/Madrid'], ['Berlin', 'Europe/Berlin'], ['Rome', 'Europe/Rome'], ['Casablanca', 'Africa/Casablanca'], ['Tunis', 'Africa/Tunis'], ['Lagos', 'Africa/Lagos'], ['New York', 'America/New_York'], ['Los Angeles', 'America/Los_Angeles'], ['Chicago', 'America/Chicago'], ['Toronto', 'America/Toronto'], ['Sao Paulo', 'America/Sao_Paulo'], ['Tokyo', 'Asia/Tokyo'], ['Seoul', 'Asia/Seoul'], ['Beijing', 'Asia/Shanghai'], ['Mumbai', 'Asia/Kolkata'], ['Sydney', 'Australia/Sydney']];
const CK_ICO = {
  alarm: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4.5l3 1.8M4 5.5L7 3M20 5.5L17 3"/>',
  world: '<circle cx="11" cy="11" r="8"/><path d="M3 11h16M11 3c3.2 2.6 3.2 13.4 0 16M11 3c-3.2 2.6-3.2 13.4 0 16"/><circle cx="18" cy="18" r="4" fill="#000"/><path d="M18 16v2.2l1.4.8"/>',
  stop: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 3h5M12 3v3M18 6l1.5-1.5"/>',
  timer: '<path d="M7 3h10M7 21h10M8 3c0 5 4 5.5 4 9s-4 4-4 9M16 3c0 5-4 5.5-4 9s4 4 4 9"/>',
};
const ckp = n => String(n).padStart(2, '0');
const ckLocalTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' } catch (e) { return 'UTC' } };
const ckCityName = tz => { const c = CK_CITIES.find(x => x[1] === tz); return c ? c[0] : String(tz).split('/').pop().replace(/_/g, ' ') };
function ckWall(tz, d) {
  const p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(d || new Date()).forEach(x => p[x.type] = x.value);
  return { h: +p.hour, m: +p.minute, s: +p.second, utc: Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) };
}
function ckTzLong() { try { return new Intl.DateTimeFormat('en', { timeZoneName: 'long' }).formatToParts(new Date()).find(x => x.type === 'timeZoneName').value } catch (e) { return ckLocalTz() } }
function ckRel(tz) {
  const a = ckWall(tz), b = ckWall(ckLocalTz()); const diff = Math.round((a.utc - b.utc) / 60000);
  if (!diff) return t('Same as local time');
  const day = diff > 0 && a.utc - b.utc >= 0 && new Date(a.utc).getUTCDate() !== new Date(b.utc).getUTCDate() ? t('Tomorrow') : diff < 0 && new Date(a.utc).getUTCDate() !== new Date(b.utc).getUTCDate() ? t('Yesterday') : t('Today');
  const ad = Math.abs(diff), h = Math.floor(ad / 60), m = ad % 60;
  return day + ', ' + (h ? h + ' ' + t('hr') + ' ' : '') + (m ? m + ' ' + t('min') + ' ' : '') + (diff > 0 ? t('ahead') : t('behind'));
}
const ckDays = () => ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const ckDayNames = () => [t('Sun'), t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat')];

/* ---------- looping wheel picker (mouse drag + wheel) ---------- */
function ckWheel(col, N, val, cb) {
  const H = 53; let html = '';
  for (let r = 0; r < 3; r++) for (let i = 0; i < N; i++) html += `<div>${ckp(i)}</div>`;
  col.innerHTML = html;
  const items = col.children;
  const sel = () => { for (const e of items) e.classList.remove('sel'); const i = Math.round(col.scrollTop / H) + 1; if (items[i]) items[i].classList.add('sel') };
  const setV = v => { col.scrollTop = (N + v - 1) * H; col._v = v; sel() };
  setV(val);
  let tmo;
  col.addEventListener('scroll', () => {
    sel(); clearTimeout(tmo);
    tmo = setTimeout(() => {
      const i = Math.round(col.scrollTop / H) + 1, v = ((i % N) + N) % N;
      if (i < N || i >= 2 * N) { col.style.scrollSnapType = 'none'; col.scrollTop = (N + v - 1) * H; col.style.scrollSnapType = '' }
      if (col._v !== v) { col._v = v; cb && cb(v) }
    }, 110);
  });
  let dy = null, st0 = 0;
  col.addEventListener('mousedown', e => { dy = e.clientY; st0 = col.scrollTop; col.style.scrollSnapType = 'none' });
  const mv = e => { if (!col.isConnected) return rm(); if (dy !== null) col.scrollTop = st0 - (e.clientY - dy) };
  const up = () => { if (!col.isConnected) return rm(); if (dy === null) return; dy = null; col.scrollTop = Math.round(col.scrollTop / H) * H; col.style.scrollSnapType = '' };
  const rm = () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up) };
  window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
  col.setV = setV;
  return col;
}

/* ---------- ring (alarm / timer finished) ---------- */
function ckStopSound() { try { if (CK.audio) { CK.audio.pause(); CK.audio = null } } catch (e) { } }
function ckRing(kind, label) {
  ckStopSound();
  try { const a = new Audio(toneFile(st.settings.ringtone)); a.loop = true; a.volume = Math.max(0, Math.min(1, (st.settings.volume ?? 70) / 100)); a.play().catch(() => { }); CK.audio = a } catch (e) { }
  $('#ck-ring')?.remove();
  const d = new Date(), el = document.createElement('div'); el.id = 'ck-ring';
  el.innerHTML = `<div><b>${kind === 'timer' ? t('Timer') : ckp(d.getHours()) + ':' + ckp(d.getMinutes())}</b><small>${esc(label || (kind === 'timer' ? t("Time's up") : t('Alarm')))}</small></div>
    <div class="ck-btns">${kind === 'alarm' ? `<button class="ck-pill dark act" id="ck-snz">${t('Snooze')}</button>` : ''}<button class="ck-pill" id="ck-off">${kind === 'timer' ? t('Stop') : t('Dismiss')}</button></div>`;
  $('#screen').appendChild(el);
  const off = () => { ckStopSound(); el.remove() };
  $('#ck-off').onclick = off;
  const sz = $('#ck-snz'); if (sz) sz.onclick = () => { CK.snooze = Date.now() + 5 * 60000; off(); toast(t('Snoozed for 5 minutes')) };
}
setInterval(() => {
  const d = new Date(), key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;
  let ch = false;
  CK.alarms.forEach(a => {
    if (a.on && a.h === d.getHours() && a.m === d.getMinutes() && (!a.days.some(Boolean) || a.days[d.getDay()]) && a.last !== key) {
      a.last = key; if (!a.days.some(Boolean)) a.on = false; ch = true; ckRing('alarm', a.label);
    }
  });
  if (ch) { CKS('ck_alarms', CK.alarms); if (CK.tab === 'alarm' && $('#app.clk')) ckRender() }
  if (CK.snooze && Date.now() >= CK.snooze) { CK.snooze = 0; ckRing('alarm', t('Snooze')) }
  if (CK.tm.active && CK.tm.run && Date.now() >= CK.tm.end) { CK.tm.active = false; CK.tm.run = false; ckRing('timer'); if ($('#app.clk') && CK.tab === 'timer') ckRender() }
}, 1000);

/* ---------- app shell ---------- */
function clockApp() {
  view('', '<div class="ck-page" id="ck-page"></div><div class="ck-tabs" id="ck-tabs"></div>', { nohdr: true, dark: true, app: 'clk', cls: 'full' });
  ckRender();
}
function ckMenu(items) {
  $('.ck-menu')?.remove();
  const m = document.createElement('div'); m.className = 'ck-menu';
  m.innerHTML = items.map((x, i) => `<div data-i="${i}">${esc(x[0])}</div>`).join('');
  $('#app').appendChild(m);
  m.querySelectorAll('[data-i]').forEach(e => e.onclick = () => { m.remove(); items[+e.dataset.i][1]() });
  setTimeout(() => { const f = ev => { if (!ev.target.closest('.ck-menu')) { m.remove(); document.removeEventListener('click', f, true) } }; document.addEventListener('click', f, true) }, 0);
}
function ckRender() {
  const pg = $('#ck-page'); if (!pg) return;
  clearInterval(st.wi); st.wi = null;
  const tabs = [['alarm', 'Alarm'], ['world', 'World clock'], ['stop', 'Stopwatch'], ['timer', 'Timer']];
  const map = { alarm: 'alarm', world: 'world', stopwatch: 'stop', timer: 'timer' };
  const cur = CK.tab === 'stopwatch' ? 'stop' : CK.tab;
  $('#ck-tabs').innerHTML = tabs.map(([id, n]) => `<button data-t="${id}" class="${cur === id ? 'on' : ''}">${I(CK_ICO[id], 25)}<span>${esc(t(n))}</span></button>`).join('');
  $('#ck-tabs').querySelectorAll('button').forEach(b => b.onclick = () => { CK.tab = b.dataset.t === 'stop' ? 'stopwatch' : b.dataset.t; ckRender() });
  ({ alarm: ckAlarm, world: ckWorld, stopwatch: ckStopwatch, timer: ckTimer })[CK.tab](pg);
}

/* ---------- World clock ---------- */
function ckWorld(pg) {
  const loc = ckLocalTz();
  const list = [...CK.cities.map(tz => ({ tz, own: false })), { tz: loc, own: true }];
  const card = c => {
    const w = ckWall(c.tz), game = c.own;
    const tp = temp(game ? CK.wxType : 'CLEAR', w.h) - (game ? 0 : 7);
    return `<div class="wc-card"><button class="wc-del" data-d="${esc(c.tz)}">⊖</button><div class="wc-nm"><b>${esc(ckCityName(c.tz))}</b><small>${esc(c.own ? t('Local time zone') : ckRel(c.tz))}</small></div>
      <span class="wc-tm" data-tz="${esc(c.tz)}">${ckp(w.h)}:${ckp(w.m)}</span><span class="wc-wx">${icon(game ? CK.wxType : 'CLEAR', w.h, 22)}${tp}°</span></div>`;
  };
  const w0 = ckWall(loc);
  pg.innerHTML = `<div class="wc-big"><b id="wc-t">${ckp(w0.h)}:${ckp(w0.m)}:${ckp(w0.s)}</b><small>${esc(ckTzLong())}</small></div>
    <div class="wc-bar"><button class="ck-ic" id="wc-add">${I(IP.plus, 28)}</button><button class="ck-ic" id="wc-more">${I(IP.dots, 22)}</button></div>
    <div id="wc-list" class="${CK.editCities ? 'wc-edit' : ''}">${list.map(card).join('')}</div>`;
  const bind = () => $('#wc-list').querySelectorAll('[data-d]').forEach(b => b.onclick = e => { e.stopPropagation(); CK.cities = CK.cities.filter(x => x !== b.dataset.d); CKS('ck_cities', CK.cities); ckRender() });
  bind();
  $('#wc-more').onclick = e => { e.stopPropagation(); ckMenu([[CK.editCities ? t('Done') : t('Edit'), () => { CK.editCities = !CK.editCities; ckRender() }]]) };
  $('#wc-add').onclick = () => {
    const sh = document.createElement('div'); sh.className = 'ck-sheet';
    sh.innerHTML = `<div class="ck-sc"><b>${t('Add city')}</b>${CK_CITIES.filter(c => !CK.cities.includes(c[1]) && c[1] !== loc).map(c => `<div class="ck-city" data-z="${c[1]}"><span>${esc(c[0])}</span><small>${esc(c[1].split('/')[0])}</small></div>`).join('')}<button class="ck-pill dark act" id="ck-x">${t('Cancel')}</button></div>`;
    $('#app').appendChild(sh);
    sh.onclick = e => { if (e.target === sh) sh.remove() };
    $('#ck-x').onclick = () => sh.remove();
    sh.querySelectorAll('[data-z]').forEach(e => e.onclick = () => { CK.cities.push(e.dataset.z); CKS('ck_cities', CK.cities); sh.remove(); ckRender() });
  };
  post('getWeather').then(w => { if (w && w.type && w.type !== CK.wxType) { CK.wxType = w.type; if (CK.tab === 'world' && $('#wc-list')) ckRender() } });
  st.wi = setInterval(() => {
    if (!$('#wc-t')) return;
    const a = ckWall(loc); $('#wc-t').textContent = `${ckp(a.h)}:${ckp(a.m)}:${ckp(a.s)}`;
    document.querySelectorAll('#wc-list .wc-tm').forEach(e => { const x = ckWall(e.dataset.tz); e.textContent = ckp(x.h) + ':' + ckp(x.m) });
  }, 1000);
}

/* ---------- Stopwatch ---------- */
const ckSwMs = () => CK.sw.acc + (CK.sw.run ? Date.now() - CK.sw.start : 0);
function ckSwFmt(ms) { const cs = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000) % 60, m = Math.floor(ms / 60000) % 60, h = Math.floor(ms / 3600000); return (h ? h + ' : ' : '') + `${ckp(m)} : ${ckp(s)} . ${ckp(cs)}` }
function ckStopwatch(pg) {
  const sw = CK.sw;
  pg.innerHTML = `<div class="ck-top"><button id="sw-more">${I(IP.dots, 22)}</button></div><div class="sw-dis" id="sw-d">${ckSwFmt(ckSwMs())}</div>
    <div class="sw-laps" id="sw-l">${sw.laps.map((l, i) => `<div><span>${t('Lap')} ${sw.laps.length - i}</span><b>${ckSwFmt(l.d)}</b><span>${ckSwFmt(l.t)}</span></div>`).join('')}</div>
    <div class="ck-btns"><button class="ck-pill dark ${sw.run ? 'act' : sw.acc ? 'act' : ''}" id="sw-a">${sw.run ? t('Lap') : sw.acc ? t('Reset') : t('Lap')}</button><button class="ck-pill" id="sw-b">${sw.run ? t('Stop') : sw.acc ? t('Resume') : t('Start')}</button></div>`;
  $('#sw-b').onclick = () => { if (sw.run) { sw.acc += Date.now() - sw.start; sw.run = false } else { sw.start = Date.now(); sw.run = true } ckRender() };
  $('#sw-a').onclick = () => {
    if (sw.run) { const tot = ckSwMs(), prev = sw.laps[0] ? sw.laps[0].t : 0; sw.laps.unshift({ t: tot, d: tot - prev }); ckRender() }
    else if (sw.acc) { sw.acc = 0; sw.laps = []; ckRender() }
  };
  $('#sw-more').onclick = e => { e.stopPropagation(); ckMenu([[t('Clear laps'), () => { sw.laps = []; ckRender() }]]) };
  if (sw.run) st.wi = setInterval(() => { const d = $('#sw-d'); if (d) d.textContent = ckSwFmt(ckSwMs()) }, 40);
}

/* ---------- Timer ---------- */
const ckTmFmt = s => `${ckp(Math.floor(s / 3600))}:${ckp(Math.floor(s / 60) % 60)}:${ckp(s % 60)}`;
function ckTmLeft() { const tm = CK.tm; return tm.run ? Math.max(0, Math.ceil((tm.end - Date.now()) / 1000)) : tm.left }
function ckTimer(pg) {
  const tm = CK.tm;
  if (tm.active) {
    const C = 2 * Math.PI * 92;
    pg.innerHTML = `<div class="ck-top"><button id="tm-more">${I(IP.dots, 22)}</button></div><div class="tm-run"><div class="tm-ring"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="none" stroke="#2b2b2d" stroke-width="8"/><circle id="tm-c" cx="100" cy="100" r="92" fill="none" stroke="#5b5fe6" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><b id="tm-t">${ckTmFmt(ckTmLeft())}</b></div></div>
      <div class="ck-btns"><button class="ck-pill dark act" id="tm-x">${t('Cancel')}</button><button class="ck-pill" id="tm-p">${tm.run ? t('Pause') : t('Resume')}</button></div>`;
    const upd = () => { const l = ckTmLeft(); const tt = $('#tm-t'); if (!tt) return; tt.textContent = ckTmFmt(l); $('#tm-c').style.strokeDashoffset = C * (1 - (tm.total ? l / tm.total : 0)) };
    upd();
    $('#tm-x').onclick = () => { tm.active = false; tm.run = false; ckRender() };
    $('#tm-p').onclick = () => { if (tm.run) { tm.left = ckTmLeft(); tm.run = false } else { tm.end = Date.now() + tm.left * 1000; tm.run = true } ckRender() };
    $('#tm-more').onclick = e => { e.stopPropagation(); ckMenu([[t('Cancel'), () => { tm.active = false; tm.run = false; ckRender() }]]) };
    if (tm.run) st.wi = setInterval(upd, 200);
    return;
  }
  pg.innerHTML = `<div class="ck-top"><button id="tm-more">${I(IP.dots, 22)}</button></div>
    <div class="tm-lab"><span>${t('Hours')}</span><span>${t('Minutes')}</span><span>${t('Seconds')}</span></div>
    <div class="tm-wheel"><div class="tm-col" id="w0"></div><div class="tm-col" id="w1"></div><div class="tm-col" id="w2"></div><span class="tm-sep" style="left:calc(33.33% - 6px)">:</span><span class="tm-sep" style="left:calc(66.66% - 6px)">:</span></div>
    <div class="tm-pre">${[[0, 10, 0], [0, 15, 0], [0, 30, 0]].map((p, i) => `<button data-p="${i}">${p.map(ckp).join(':')}</button>`).join('')}</div>
    <div class="ck-btns" style="justify-content:center;margin-top:auto"><button class="ck-pill dim" id="tm-s" style="flex:none;width:260px">${t('Start')}</button></div>`;
  const N = [100, 60, 60], cols = [0, 1, 2].map(i => ckWheel($('#w' + i), N[i], tm.pick[i], v => { tm.pick[i] = v; chk() }));
  const chk = () => { $('#tm-s')?.classList.toggle('dim', !(tm.pick[0] || tm.pick[1] || tm.pick[2])) };
  chk();
  const go = () => { const s = tm.pick[0] * 3600 + tm.pick[1] * 60 + tm.pick[2]; if (!s) return; tm.total = s; tm.left = s; tm.end = Date.now() + s * 1000; tm.run = true; tm.active = true; ckRender() };
  $('#tm-s').onclick = go;
  pg.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { const p = [[0, 10, 0], [0, 15, 0], [0, 30, 0]][+b.dataset.p]; tm.pick = [...p]; cols.forEach((c, i) => c.setV(p[i])); go() });
  $('#tm-more').onclick = e => { e.stopPropagation(); ckMenu([[t('Reset'), () => { tm.pick = [0, 0, 0]; ckRender() }]]) };
}

/* ---------- Alarm ---------- */
const ckRepeat = a => { const n = a.days.filter(Boolean).length; if (!n) return t('Once'); if (n === 7) return t('Every day'); if (n === 5 && !a.days[0] && !a.days[6]) return t('Weekdays'); return ckDayNames().filter((_, i) => a.days[i]).join(', ') };
function ckAlarm(pg) {
  const ls = [...CK.alarms].sort((a, b) => a.h * 60 + a.m - (b.h * 60 + b.m));
  pg.innerHTML = `<div class="ck-top"><button id="al-add">${I(IP.plus, 28)}</button><button id="al-more">${I(IP.dots, 22)}</button></div><div class="al-title">${t('Alarm')}</div>
    ${ls.length ? ls.map(a => `<div class="al-card ${a.on ? '' : 'off'}" data-id="${a.id}"><div class="inf"><div class="tt">${ckp(a.h)}:${ckp(a.m)}</div><small>${esc(a.label ? a.label + ', ' : '')}${esc(ckRepeat(a))}</small></div><div class="ck-sw ${a.on ? 'on' : ''}" data-sw="${a.id}"><i></i></div></div>`).join('') : `<div class="al-empty">${t('No alarms')}</div>`}`;
  $('#al-add').onclick = () => ckAlarmEdit(null);
  $('#al-more').onclick = e => { e.stopPropagation(); ckMenu([[t('Delete all'), () => { CK.alarms = []; CKS('ck_alarms', CK.alarms); ckRender() }]]) };
  pg.querySelectorAll('.al-card').forEach(c => c.onclick = e => {
    const id = +c.dataset.id;
    if (e.target.closest('[data-sw]')) { const a = CK.alarms.find(x => x.id === id); a.on = !a.on; CKS('ck_alarms', CK.alarms); ckRender() } else ckAlarmEdit(id);
  });
}
function ckAlarmEdit(id) {
  const a = id ? CK.alarms.find(x => x.id === id) : null, d = new Date();
  const m = a ? { ...a, days: [...a.days] } : { id: Date.now(), h: d.getHours(), m: (d.getMinutes() + 1) % 60, days: [false, false, false, false, false, false, false], on: true, label: '' };
  const sh = document.createElement('div'); sh.className = 'ck-sheet';
  sh.innerHTML = `<div class="ck-sc"><b>${a ? t('Edit alarm') : t('Add alarm')}</b>
    <div class="tm-wheel" style="--c:2;margin:0 40px"><div class="tm-col" id="a0"></div><div class="tm-col" id="a1"></div><span class="tm-sep" style="left:calc(50% - 6px)">:</span></div>
    <div class="ck-days">${ckDays().map((x, i) => `<button data-d="${i}" class="${m.days[i] ? 'on' : ''}">${x}</button>`).join('')}</div>
    <input id="a-l" placeholder="${esc(t('Alarm name'))}" value="${esc(m.label)}" maxlength="24">
    <div class="ck-sa">${a ? `<button class="ck-pill red" id="a-del">${t('Delete')}</button>` : ''}<button class="ck-pill dark act" id="a-x">${t('Cancel')}</button><button class="ck-pill" id="a-ok">${t('Save')}</button></div></div>`;
  $('#app').appendChild(sh);
  ckWheel($('#a0'), 24, m.h, v => m.h = v); ckWheel($('#a1'), 60, m.m, v => m.m = v);
  sh.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { const i = +b.dataset.d; m.days[i] = !m.days[i]; b.classList.toggle('on', m.days[i]) });
  $('#a-x').onclick = () => sh.remove();
  if (a) $('#a-del').onclick = () => { CK.alarms = CK.alarms.filter(x => x.id !== id); CKS('ck_alarms', CK.alarms); sh.remove(); ckRender() };
  $('#a-ok').onclick = () => {
    m.label = $('#a-l').value.trim(); m.on = true; m.last = '';
    if (a) Object.assign(a, m); else CK.alarms.push(m);
    CKS('ck_alarms', CK.alarms); sh.remove(); ckRender();
  };
}

/* translations */
Object.assign(TR.ar, { 'Clock': 'الساعة', 'Alarm': 'المنبه', 'World clock': 'الساعة العالمية', 'Stopwatch': 'ساعة الإيقاف', 'Timer': 'المؤقت', 'Start': 'ابدأ', 'Stop': 'إيقاف', 'Lap': 'لفة', 'Reset': 'إعادة', 'Resume': 'استئناف', 'Pause': 'إيقاف مؤقت', 'Hours': 'ساعات', 'Minutes': 'دقائق', 'Seconds': 'ثوانٍ', 'Local time zone': 'المنطقة الزمنية المحلية', 'Same as local time': 'نفس التوقيت المحلي', 'Add city': 'إضافة مدينة', 'Cancel': 'إلغاء', 'Save': 'حفظ', 'Delete': 'حذف', 'Edit': 'تعديل', 'Done': 'تم', 'No alarms': 'لا توجد منبهات', 'Add alarm': 'إضافة منبه', 'Edit alarm': 'تعديل المنبه', 'Alarm name': 'اسم المنبه', 'Once': 'مرة واحدة', 'Every day': 'كل يوم', 'Weekdays': 'أيام الأسبوع', 'Snooze': 'غفوة', 'Dismiss': 'إيقاف', "Time's up": 'انتهى الوقت', 'Today': 'اليوم', 'Tomorrow': 'غداً', 'Yesterday': 'أمس', 'ahead': 'أمام', 'behind': 'خلف', 'hr': 'س', 'min': 'د', 'Delete all': 'حذف الكل', 'Clear laps': 'مسح اللفات', 'Snoozed for 5 minutes': 'غفوة 5 دقائق' });
Object.assign(TR.fr, { 'Clock': 'Horloge', 'Alarm': 'Alarme', 'World clock': 'Fuseaux horaires', 'Stopwatch': 'Chronomètre', 'Timer': 'Minuteur', 'Start': 'Démarrer', 'Stop': 'Arrêter', 'Lap': 'Tour', 'Reset': 'Réinitialiser', 'Resume': 'Reprendre', 'Pause': 'Pause', 'Hours': 'Heures', 'Minutes': 'Minutes', 'Seconds': 'Secondes', 'Local time zone': 'Fuseau horaire local', 'Same as local time': "Même heure qu'ici", 'Add city': 'Ajouter une ville', 'Cancel': 'Annuler', 'Save': 'Enregistrer', 'Delete': 'Supprimer', 'Edit': 'Modifier', 'Done': 'OK', 'No alarms': "Aucune alarme", 'Add alarm': 'Ajouter une alarme', 'Edit alarm': "Modifier l'alarme", 'Alarm name': "Nom de l'alarme", 'Once': 'Une fois', 'Every day': 'Tous les jours', 'Weekdays': 'En semaine', 'Snooze': 'Répéter', 'Dismiss': 'Arrêter', "Time's up": 'Temps écoulé', 'Today': "Aujourd'hui", 'Tomorrow': 'Demain', 'Yesterday': 'Hier', 'ahead': "d'avance", 'behind': 'de retard', 'hr': 'h', 'min': 'min', 'Delete all': 'Tout supprimer', 'Clear laps': 'Effacer les tours', 'Snoozed for 5 minutes': 'Répétition dans 5 min', 'Sun': 'Dim', 'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mer', 'Thu': 'Jeu', 'Fri': 'Ven', 'Sat': 'Sam' });
