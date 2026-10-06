/* CPhone S26 — website preview backend.
   The real phone UI runs here; every NUI callback (https://<resource>/<name>) is answered locally with demo data.
   Nothing is saved, nothing leaves the page. */
(() => {
  const now = () => Math.floor(Date.now() / 1000);
  const ME = { name: 'Carlos Mendez', number: '555-0142', account: '4829104733', bringFee: 150, hasPin: false, pinLen: 0 };
  const WALLS = ['wallpapers/w8.svg', 'wallpapers/w1.svg', 'wallpapers/w2.svg', 'wallpapers/w3.svg', 'wallpapers/w4.svg', 'wallpapers/w5.svg',
    'wallpapers/w6.svg', 'wallpapers/w7.svg', 'wallpapers/fuji-sun.jpg', 'wallpapers/mountain-sun.jpg', 'wallpapers/paper-waves.jpg', 'wallpapers/waves-abstract.jpg'];
  const TONES = ['samsung', 'galaxy_bells', 'horizon', 'remix', 's15', 'spaceline', 'tune', 'wave'];

  const svg = (a, b, txt) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="320" height="320" fill="url(#g)"/><text x="160" y="180" font-family="Arial" font-size="64" text-anchor="middle" fill="rgba(255,255,255,.85)">${txt || ''}</text></svg>`);

  const contacts = [
    { id: 1, name: 'Amine', number: '555-0111' }, { id: 2, name: 'Karim Taxi', number: '555-0132' },
    { id: 3, name: 'Lina', number: '555-0178' }, { id: 4, name: 'Mechanic Joe', number: '555-0190' },
    { id: 5, name: 'Sofiane', number: '555-0156' }, { id: 6, name: 'Yacine', number: '555-0123' },
  ];
  const convs = {
    '555-0111': [{ mine: false, text: 'Wach khoya, rak jay lel meeting?', ts: now() - 3600 }, { mine: true, text: 'Iyeh, nsal 10 d9ayek', ts: now() - 3500 }, { mine: false, text: 'Top, nstanak 9odam el garage 🚗', ts: now() - 3400 }],
    '555-0178': [{ mine: false, text: 'Check the new Yasir app, it calls a taxi for you!', ts: now() - 86400 }, { mine: true, text: 'Wow, perfect 🔥', ts: now() - 86000 }],
    '555-0156': [{ mine: false, text: 'Dinner tonight?', ts: now() - 172800 }],
  };
  const calls = [
    { number: '555-0111', name: 'Amine', dir: 'in', ts: now() - 1800 }, { number: '555-0178', name: 'Lina', dir: 'missed', ts: now() - 7200 },
    { number: '555-0132', name: 'Karim Taxi', dir: 'out', ts: now() - 86400 }, { number: '555-0190', name: 'Mechanic Joe', dir: 'out', ts: now() - 90000 },
  ];
  const photos = [1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ id: i, ts: now() - i * 40000 }));
  const palette = [['#7b4dff', '#4a1fb8'], ['#ff9f1c', '#e4572e'], ['#16a085', '#2c3e50'], ['#ee5a9b', '#8e44ad'], ['#2d9cdb', '#1b3a57'], ['#f2c94c', '#f2994a'], ['#27ae60', '#145a32'], ['#eb5757', '#6a1b1b']];
  const yt = ['Los Santos night drive', 'Best FiveM roleplay moments', 'Chill beats to cruise', 'City tour in 4K', 'Street racing highlights', 'Lofi music mix'].map((t, i) => ({
    id: 'demo' + i, title: t, channel: ['Waylife TV', 'RP Clips', 'ChillCity', 'Los Santos Tours', 'Speed DZ', 'Lofi Girl'][i], thumb: svg(palette[i][0], palette[i][1], '▶'),
    pub: new Date(Date.now() - i * 86400000 * 3).toISOString(), views: 120000 + i * 53000, dur: 180 + i * 47, avatar: '',
  }));
  const posts = [1, 2, 3].map(i => ({ id: i, app: 'trendy', author: ['Lina', 'Amine', 'Yacine'][i - 1], caption: ['Sunset ride 🌇', 'New car day!', 'Beach vibes'][i - 1], media: svg(palette[i][0], palette[i][1], '♥'), likes: 20 * i, liked: false, avatar: '' }));
  const garage = [
    { label: 'Pegassi Zentorno', plate: 'WAY 482', garage: 'Legion Square', state: 1, fuel: 82, engine: 96, body: 91 },
    { label: 'Karin Sultan RS', plate: 'LS 7721', garage: 'Alta Street', state: 0, fuel: 55, engine: 88, body: 80 },
    { label: 'Dinka Blista', plate: 'DZ 1920', garage: 'Impound Lot', state: 2, fuel: 30, engine: 60, body: 52 },
  ];

  /* ---------- Yasir: simulated taxi ride ---------- */
  const Y = { s: 'idle', timers: [], d: null };
  const ME_POS = { x: 300.0, y: -590.0 };
  const send = d => window.postMessage({ action: 'yasirState', data: d }, '*');
  const clear = () => { Y.timers.forEach(clearTimeout); Y.timers = []; };
  const at = (ms, fn) => Y.timers.push(setTimeout(fn, ms));
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function snap(extra) {
    return Object.assign({ s: Y.s, fare: Y.fare || 0, plate: 'YASIR482', driver: 'Yacine', rating: 4.96, car: 'Taxi', eta: Y.eta || 0, dist: Y.dd || 0,
      px: ME_POS.x, py: ME_POS.y, tx: Y.tx, ty: Y.ty, dest: Y.dest }, extra || {});
  }
  function fare(x, y) { const m = dist(ME_POS, { x, y }) * 1.3; return { fare: Math.max(30, Math.round(25 + m / 1000 * 40)), dist: Math.round(m) }; }
  function lerpMove(from, to, steps, ms, key, cb) {
    for (let i = 1; i <= steps; i++) at(i * ms, () => {
      Y.tx = from.x + (to.x - from.x) * i / steps; Y.ty = from.y + (to.y - from.y) * i / steps;
      Y.dd = dist({ x: Y.tx, y: Y.ty }, to); Y.eta = Math.max(1, Math.ceil(Y.dd / 400));
      send(snap());
      if (i === steps && cb) cb();
    });
  }
  function ride() {
    const start = { x: ME_POS.x + 140, y: ME_POS.y + 160 };
    at(2200, () => {
      Y.s = 'arriving'; Y.tx = start.x; Y.ty = start.y; Y.dd = dist(start, ME_POS); Y.eta = 2; send(snap());
      lerpMove(start, ME_POS, 10, 600, 'pick', () => {
        Y.s = 'waiting'; Y.eta = 0; send(snap());
        Y.waitStart = () => {
          Y.s = 'riding'; const d = Y.dest, from = { x: ME_POS.x, y: ME_POS.y };
          Y.tx = from.x; Y.ty = from.y; send(snap());
          lerpMove(from, d, 16, 700, 'ride', () => {
            Y.s = 'arrived'; Y.eta = 0; send(snap());
            at(4000, () => { Y.s = 'idle'; Y.dest = null; Y.tx = Y.ty = undefined; send(snap()); });
          });
        };
        at(25000, () => { if (Y.s === 'waiting') cancel(); });
      });
    });
  }
  function cancel() { clear(); Y.s = 'idle'; Y.dest = null; Y.tx = Y.ty = undefined; send(snap()); }

  /* ---------- callbacks ---------- */
  const store = { msgs: JSON.parse(JSON.stringify(convs)), contacts, calls, photos, rd: { on: false, f: 91.1 } };
  const H = {
    init: () => ({ ...ME, settings: { language: 'en' }, wallpapers: WALLS, ringtones: TONES, storySec: 30 }),
    getLocation: () => ({ ...ME_POS, z: 30, street: 'Strawberry Ave', cross: 'Alta St', zone: 'Strawberry' }),
    getConversations: () => ({ list: Object.keys(store.msgs).map(n => { const l = store.msgs[n]; const m = l[l.length - 1]; const c = store.contacts.find(x => x.number === n); return { number: n, name: c ? c.name : n, text: m.text, ts: m.ts, unread: false }; }) }),
    getMessages: d => ({ list: store.msgs[d.number] || [] }),
    sendMessage: d => { (store.msgs[d.number] = store.msgs[d.number] || []).push({ mine: true, text: d.text, ts: now() }); return { ok: true }; },
    getContacts: () => ({ list: store.contacts }),
    addContact: d => { store.contacts.push({ id: Date.now(), name: d.name, number: d.number }); return { ok: true }; },
    deleteContact: d => { store.contacts = store.contacts.filter(c => c.id !== d.id); return { ok: true }; },
    getCalls: () => ({ list: store.calls }),
    clearCalls: () => { store.calls = []; return { ok: true }; },
    call: () => ({ ok: true }), answer: () => ({ ok: true }), hangup: () => ({ ok: true }),
    getBank: () => ({ balance: 48250, list: [
      { name: 'Salary - Los Santos PD', amount: 3200, out: false, ts: now() - 3600 }, { name: 'Yasir Taxi', amount: 85, out: true, ts: now() - 7200 },
      { name: 'Carlodz Car Dealer', amount: 12000, out: true, ts: now() - 86400 }, { name: 'Amine', amount: 500, out: false, ts: now() - 172800 } ] }),
    transfer: () => ({ ok: true }),
    getGarage: () => ({ list: garage }),
    track: () => ({ ok: true, kind: 'vehicle' }), bringVehicle: () => ({ ok: true }),
    getServices: () => ({ list: [{ job: 'police', label: 'Police', onduty: 4 }, { job: 'ambulance', label: 'EMS', onduty: 2 }, { job: 'mechanic', label: 'Mechanic', onduty: 3 }, { job: 'taxi', label: 'Taxi', onduty: 1 }] }),
    requestService: () => ({ ok: true }),
    getWeather: () => ({ type: 'CLEAR' }),
    getPhotos: () => ({ list: store.photos }),
    getPhoto: d => { const i = (d.id || 1) % palette.length; return { data: svg(palette[i][0], palette[i][1], '') }; },
    savePhoto: () => ({ ok: true }), deletePhoto: () => ({ ok: true }),
    getPosts: () => ({ list: posts }),
    getProfile: () => ({ name: ME.name, username: 'carlos', avatar: '', likes: 12, posts: posts.map(p => ({ ...p, author: ME.name, mine: true })) }),
    saveProfile: () => ({ ok: true }), like: () => ({ ok: true, liked: true, likes: 1 }), post: () => ({ ok: true }), deletePost: () => ({ ok: true }), getPostVideo: () => ({ ok: false }), getVideo: () => ({ ok: false }),
    getInpicStories: () => ({ list: [] }),
    ytTrending: () => ({ ok: true, list: yt }), ytSearch: () => ({ ok: true, list: yt }), ytShorts: () => ({ ok: true, list: yt }), ytChannel: () => ({ ok: true, list: yt }),
    webSearch: d => ({ ok: true, answer: 'Preview only: web search is live in-game.', next: false, list: [
      { title: (d.q || 'CPhone') + ' — result 1', link: 'https://example.com', snippet: 'This is a demo result shown in the website preview.', display: 'example.com' },
      { title: (d.q || 'CPhone') + ' — result 2', link: 'https://example.org', snippet: 'Another demo result.', display: 'example.org' } ] }),
    geminiChat: () => ({ ok: true, text: 'Hi! In the server I answer questions with AI. This is a preview, so I only show demo text 🙂' }),
    radioList: () => ({ list: [{ f: 88.1, n: 'Los Santos Rock' }, { f: 91.1, n: 'Non Stop Pop' }, { f: 95.5, n: 'Radio Mirror Park' }, { f: 99.9, n: 'Flylo FM' }, { f: 103.3, n: 'The Lab' }] }),
    radioState: () => ({ ok: true }), radioPlay: () => ({ ok: true }), radioStop: () => ({ ok: true }),
    setWaypoint: () => ({ ok: true }), checkPin: () => ({ ok: true }), setPin: () => ({ ok: true }), clearPin: () => ({ ok: true }), saveSettings: () => ({ ok: true }),
    getNearbyPlayers: () => ({ list: [{ id: 2, name: 'Lina' }, { id: 5, name: 'Sofiane' }] }), btNearbyInfo: () => ({ ok: true, list: [] }), btShareNumber: () => ({ ok: true }), btSharePhoto: () => ({ ok: true }),
    close: () => ({ ok: true }),
    startCamera: () => ({ ok: false }), camCursor: () => ({ ok: true }), camExit: () => ({ ok: true }), camFlip: () => ({ ok: true }), camShot: () => ({ ok: true }),
    camSound: () => ({ ok: true }), camSaveVideo: () => ({ ok: true }), camVidStart: () => ({ ok: true }), camVidStop: () => ({ ok: true }), setCamCompose: () => ({ ok: true }), setFlashlight: () => ({ ok: true }),
    yasirGetState: () => snap(),
    yasirWaypoint: () => ({ ok: true, x: 215.0, y: -1180.0 }),
    yasirQuote: d => ({ ok: true, ...fare(d.x, d.y), balance: 48250, cur: '$' }),
    yasirOrder: d => {
      if (Y.s !== 'idle') return { ok: false, err: 'You already have a taxi' };
      const f = fare(d.x, d.y); Y.fare = f.fare; Y.dest = { x: d.x, y: d.y, n: d.name }; Y.s = 'searching'; Y.eta = 0;
      ride(); return { ok: true, fare: f.fare };
    },
    yasirCancel: () => { if (['searching', 'arriving', 'waiting'].includes(Y.s)) cancel(); return { ok: true }; },
    yasirEnter: () => { if (Y.s === 'waiting' && Y.waitStart) Y.waitStart(); return { ok: true }; },
    yasirStop: () => { if (Y.s === 'riding') { clear(); Y.s = 'arrived'; Y.eta = 0; send(snap()); at(3000, () => { Y.s = 'idle'; Y.dest = null; send(snap()); }); } return { ok: true }; },
  };

  /* ---------- v2 apps (Health, Discord, Dark Chat, CStore, Stories, Services staff, CTube region) ---------- */
  const day = n => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
  const HEALTH = { ok: true, mode: 'walk', goal: 6000, goals: { min: 30, kcal: 400 }, profile: { weight: 74, height: 178, goal: 6000 },
    today: { steps: 4280, walk_m: 3100, run_m: 900, bike_m: 1800, swim_m: 0, walk_s: 2400, run_s: 420, bike_s: 600, swim_s: 0, kcal: 265, min: 24, dist: 5800 },
    week: [5200, 7400, 3100, 8800, 6100, 2500, 4280].map((s, i) => ({ d: day(6 - i), steps: s, min: Math.round(s / 190), kcal: Math.round(s / 16), dist: s * 0.75 })) };
  const DC = {
    channels: [{ id: 'general', name: 'general', type: 'text', topic: 'City chat' }, { id: 'photos', name: 'photos', type: 'photo', topic: 'Share your shots' },
      { id: 'jobs', name: 'jobs', type: 'text', topic: 'Work offers' }, { id: 'lounge', name: 'Lounge', type: 'voice' }],
    msgs: { general: [{ name: 'Lina', time: '20:41', text: 'Anyone up for a night drive?' }, { name: 'Amine', time: '20:43', text: 'I am in, meet at Legion Square 🚗' }], photos: [], jobs: [{ name: 'Mechanic Joe', time: '19:10', text: 'Need a part-time helper at the garage.' }] },
    voice: false,
  };
  const dark = { registered: false, unlocked: false, alias: 'Anon', number: '', posts: [{ id: 1, alias: 'Ghost', number: '555-0666', text: 'Preview only: Dark Chat is live in-game.', ts: now() - 900, mine: false }] };
  const stories = [{ id: 'u1', name: 'Lina', username: 'lina', avatar: '', mine: false, items: [{ id: 's1', kind: 'photo', ts: now() - 3600 }] },
    { id: 'u2', name: 'Amine', username: 'amine', avatar: '', mine: false, items: [{ id: 's2', kind: 'photo', ts: now() - 7200 }] }];
  let ytRegion = 'US';
  Object.assign(H, {
    getStories: () => ({ ok: true, list: stories }),
    getStoryMedia: d => ({ media: svg(palette[(String(d.id).length + 3) % 8][0], palette[(String(d.id).length + 3) % 8][1], '★') }),
    addStory: () => ({ ok: true }), deleteStory: () => ({ ok: true }),
    getServiceStaff: () => ({ ok: true, canTime: false, list: [
      { name: 'Carlos Mendez', grade: 'Boss', boss: true, onduty: true, me: true, phone: ME.number }, { name: 'Amine B.', grade: 'Officer', onduty: true, phone: '555-0111' }, { name: 'Lina K.', grade: 'Recruit', onduty: false, phone: '555-0178' } ] }),
    getYtRegion: () => ({ ok: true, code: ytRegion, auto: false }), setYtRegion: d => { ytRegion = d.code || ytRegion; return { ok: true, code: ytRegion }; },
    carPhotos: () => ({ ok: true, map: {} }),
    healthGet: () => HEALTH,
    healthProfile: d => { if (d.goal > 0 && d.weight > 0 && d.height > 0) { HEALTH.goal = d.goal; HEALTH.profile = { goal: d.goal, weight: d.weight, height: d.height }; return HEALTH; } return { ok: false }; },
    healthTop: () => ({ ok: true, list: [{ rank: 1, name: 'Lina', steps: 9120 }, { rank: 2, name: ME.name, steps: HEALTH.today.steps, me: true }, { rank: 3, name: 'Amine', steps: 3300 }] }),
    discordProfile: () => ({ ok: true, profile: { name: ME.name, username: 'carlos', job: 'Unemployed' } }),
    discordChannels: () => ({ ok: true, channels: DC.channels }),
    discordMembers: () => ({ ok: true, members: [{ name: 'Lina', role: 'Citizen' }, { name: 'Amine', role: 'Police' }, { name: 'Mechanic Joe', role: 'Mechanic' }] }),
    discordMessages: d => ({ ok: true, messages: DC.msgs[d.channel] || [] }),
    discordSend: d => { (DC.msgs[d.channel] = DC.msgs[d.channel] || []).push({ name: ME.name, time: new Date().toTimeString().slice(0, 5), text: d.text }); return { ok: true }; },
    discordSendPhoto: d => { (DC.msgs[d.channel] = DC.msgs[d.channel] || []).push({ name: ME.name, time: new Date().toTimeString().slice(0, 5), kind: 'photo', media: d.media }); return { ok: true }; },
    discordVoiceJoin: () => { DC.voice = true; return { ok: true, count: 1 }; }, discordVoiceLeave: () => { DC.voice = false; return { ok: true }; },
    discordVoiceState: () => ({ ok: true, name: 'Lounge', count: 1, members: [{ name: ME.name }] }),
    darkChatOpen: () => dark.registered ? (dark.unlocked ? { ok: true, state: 'home', alias: dark.alias, number: dark.number } : { ok: true, state: 'unlock' }) : { ok: true, state: 'register' },
    darkChatRegister: d => { dark.registered = dark.unlocked = true; dark.alias = d.alias || 'Anon'; dark.number = d.number || '555-0999'; return { ok: true }; },
    darkChatUnlock: () => { dark.unlocked = true; return { ok: true }; }, darkChatLock: () => { dark.unlocked = false; return { ok: true }; },
    darkChatFeed: () => ({ ok: true, now: now(), list: dark.posts }),
    darkChatPost: d => { dark.posts.unshift({ id: Date.now(), alias: dark.alias, number: dark.number, text: d.text || '', ts: now(), mine: true }); return { ok: true }; },
    darkChatDelete: d => { dark.posts = dark.posts.filter(p => p.id !== d.id); return { ok: true }; }, darkChatMedia: () => ({ ok: false }),
    storeInstall: () => ({ ok: true }), storeRemove: () => ({ ok: true }),
    brCfg: () => ({ ok: true }), brClose: () => ({ ok: true }), brMouse: () => ({ ok: true }), brNav: () => ({ ok: true }), brRect: () => ({ ok: true }), brScroll: () => ({ ok: true }), brType: () => ({ ok: true }),
    phoneTyping: () => ({ ok: true }), mirror: () => ({ ok: true }), tvCast: () => ({ ok: true }), tvCtl: () => ({ ok: true }),
  });

  const realFetch = window.fetch.bind(window);
  window.fetch = (url, opt) => {
    const m = /^https:\/\/[^/]+\/([A-Za-z0-9_]+)$/.exec(String(url));
    if (m && (opt && opt.method === 'POST')) {
      let body = {}; try { body = JSON.parse(opt.body || '{}'); } catch (e) { }
      const h = H[m[1]];
      const res = h ? h(body) : { ok: true };
      return new Promise(r => setTimeout(() => r(new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } })), 90));
    }
    return realFetch(url, opt);
  };
  window.GetParentResourceName = () => 'cphone-preview';

  /* open the phone as soon as the UI is ready; a click on the dark area re-opens it if the user "closes" it */
  const open = () => window.postMessage({ action: 'open' }, '*');
  window.addEventListener('load', () => setTimeout(open, 60));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopImmediatePropagation(); } }, true);
})();
