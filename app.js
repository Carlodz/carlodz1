/* CARLODZ — Video links per script
   Supported:
   - Local file: put video.mp4 in assets/videos/{script}/
   - YouTube: https://www.youtube.com/watch?v=...
   - Direct video URL (Discord CDN, etc.): https://cdn.discordapp.com/attachments/.../file.mp4
   Note: Discord links can expire after some time.
*/
const SCRIPT_VIDEOS = {
  fishing: "https://www.youtube.com/watch?v=v_GOK6WL9kg",
  wayscoot: "https://www.youtube.com/watch?v=8yIDkU6_c-w&list=RD8yIDkU6_c-w&start_radio=1",
  burgershot: "",
  pets: "",
  hunting: "",
  catcoffee: ""
};

/* Loader */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 600);
  }
});

/* Sticky header shadow */
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  if (!topbar) return;
  topbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* Search */
const search = document.getElementById('search');
const cards = [...document.querySelectorAll('.script-card')];
search?.addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  cards.forEach(c => {
    const match = !q || (c.dataset.name || '').includes(q);
    c.classList.toggle('hidden', !match);
  });
});

/* Filter buttons */
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(c => {
      const cat = c.dataset.category || 'all';
      const show = filter === 'all' || cat === filter;
      c.classList.toggle('hidden', !show);
    });
    // clear search when filtering
    if (search) search.value = '';
  });
});

/* Active nav on scroll */
const navLinks = document.querySelectorAll('[data-nav]');
const sections = ['home', 'scripts', 'about', 'contact'].map(id => document.getElementById(id)).filter(Boolean);

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let current = 'home';
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollY) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

/* Mobile menu */
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('nav')?.classList.toggle('open');
});
navLinks.forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('nav')?.classList.remove('open');
  });
});

/* YouTube helpers */
function youtubeEmbed(url) {
  if (!url) return '';
  try {
    const u = new URL(url.trim());
    let id = '';
    if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1).split('/')[0];
    if (u.hostname.includes('youtube.com')) {
      id = u.searchParams.get('v') || '';
      if (u.pathname.includes('/shorts/')) id = u.pathname.split('/shorts/')[1].split('/')[0];
      if (u.pathname.includes('/embed/')) id = u.pathname.split('/embed/')[1].split('/')[0];
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&modestbranding=1` : '';
  } catch (e) {
    return '';
  }
}

/* Card videos removed: all script videos open inside Details. */

/* Trailer button */
document.getElementById('trailerBtn')?.addEventListener('click', () => {
  document.getElementById('scripts')?.scrollIntoView({ behavior: 'smooth' });
});

/* Hero slideshow — keep design-reference photos, overlay matching small logos */
(() => {
  const hero = document.querySelector('.hero-reference-rotate');
  const logoOverlay = document.querySelector('.hero-logo-overlay');
  if (!hero) return;

  const slides = [
    { photo: 'assets/design-reference.png', logo: 'assets/wayscoot-logo.png' },
    { photo: 'assets/design-reference 1.png', logo: 'assets/waypets-logo.png' },
    { photo: 'assets/design-reference 2.png', logo: 'assets/fishing-logo.png' },
    { photo: 'assets/design-reference 3.png', logo: 'assets/burgershot-logo.png' },
    { photo: 'assets/design-reference 4.png', logo: 'assets/Hunting Zone-logo.png' },
    { photo: 'assets/design-reference 5.png', logo: 'assets/CATCOFFE - LOGO.png' }
  ];

  let index = 0;
  slides.forEach(s => {
    const img = new Image();
    img.src = s.photo;
    const logo = new Image();
    logo.src = s.logo;
  });

  setInterval(() => {
    hero.classList.add('is-changing');
    if (logoOverlay) logoOverlay.classList.add('is-changing');
    setTimeout(() => {
      index = (index + 1) % slides.length;
      hero.src = slides[index].photo;
      if (logoOverlay) logoOverlay.src = slides[index].logo;
      hero.classList.remove('is-changing');
      if (logoOverlay) logoOverlay.classList.remove('is-changing');
    }, 220);
  }, 3500);
})();

/* Theme toggle (subtle accent flip) */
/* Theme: dark / light, persisted */
const themeBtn = document.getElementById('themeBtn');
function applyTheme(theme){
  document.body.classList.toggle('light-theme', theme === 'light');
  const icon = themeBtn?.querySelector('img');
  if(icon) icon.src = 'assets/icons/moon.svg';
  localStorage.setItem('carlodz-theme', theme);
}
applyTheme(localStorage.getItem('carlodz-theme') || 'dark');
themeBtn?.addEventListener('click', () => {
  applyTheme(document.body.classList.contains('light-theme') ? 'dark' : 'light');
});

/* Service worker */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

/* Visitor counter
   Uses a shared counter API when available; localStorage is used as a fallback. */
(async function visitorCounter(){
  const el=document.getElementById('visitorCount');
  if(!el) return;
  const fallbackKey='carlodz-local-visits';
  const local=Number(localStorage.getItem(fallbackKey)||0)+1;
  localStorage.setItem(fallbackKey,String(local));
  el.textContent=local.toLocaleString();
  try{
    const r=await fetch('https://api.counterapi.dev/v1/carlodz-site/visits/up',{cache:'no-store'});
    if(r.ok){
      const data=await r.json();
      const n=Number(data?.count ?? data?.value);
      if(Number.isFinite(n)) el.textContent=n.toLocaleString();
    }
  }catch(e){}
})();

/* Script details — opens in the same page */
/* Local video path: assets/videos/{scriptKey}/video.mp4 (or .webm) */
const SCRIPT_DETAILS={
  fishing:{title:'Fishing',category:'FREE SCRIPT',description:'A clean fishing system for your FiveM server with fishing spots, catches, rewards and an easy QBCore setup.',logo:'assets/fishing-logo.png',photo:'assets/design-reference 2.png',tags:['QBCore','Fishing','Rewards','Free'],video:SCRIPT_VIDEOS.fishing,folder:'fishing',download:'assets/downloads/fishing/script.zip',downloadName:'Fishing.zip'},
  hunting:{title:'Hunting Zone',category:'FREE SCRIPT',description:'A lightweight hunting zone system for your FiveM server, designed to be simple, clean and easy to configure.',logo:'assets/Hunting Zone-logo.png',photo:'assets/design-reference 4.png',tags:['QBCore','Free','Hunting','Zone'],video:'',folder:'hunting',download:'assets/downloads/hunting/script.zip',downloadName:'Hunting-Zone.zip'},
  wayscoot:{title:'WayScoot',category:'PAID SCRIPT',description:'Modern scooter rental system with multiple stations, rental timer, payment flow, polished NUI and FiveM integration.',logo:'assets/wayscoot-logo.png',photo:'assets/design-reference.png',tags:['QBCore','Target','NUI','Rental'],video:SCRIPT_VIDEOS.wayscoot,folder:'wayscoot'},
  burgershot:{title:'Burger Shot',category:'PAID SCRIPT',description:'Complete Burger Shot restaurant job with food props, animations, cooking flow, deliveries and modern NUI.',logo:'assets/burgershot-logo.png',photo:'assets/design-reference 3.png',tags:['QBCore','Job','NUI','Delivery'],video:SCRIPT_VIDEOS.burgershot,folder:'burgershot'},
  pets:{title:'Carlodz Pets',category:'PAID SCRIPT',description:'A complete pets system with adoption, training, care and animal features built for a modern FiveM server.',logo:'assets/waypets-logo.png',photo:'assets/design-reference 1.png',tags:['QBCore','NUI','Animals','System'],video:SCRIPT_VIDEOS.pets,folder:'pets'},
  catcoffee:{title:'Cat Coffee',category:'PAID SCRIPT',description:'Run your own cat coffee shop with orders, crafting, cat interactions and a polished QBCore job system.',logo:'assets/CATCOFFE - LOGO.png',photo:'assets/design-reference 5.png',tags:['QBCore','Job','NUI','Cafe'],video:SCRIPT_VIDEOS.catcoffee,folder:'catcoffee'}
};
const detailsModal=document.getElementById('detailsModal');
const detailsVideo=document.getElementById('detailsVideo');
const detailsLocalVideo=document.getElementById('detailsLocalVideo');
const detailsWrap=document.getElementById('detailsVideoWrap');
const detailsTitle=document.getElementById('detailsTitle');
const detailsCategory=document.getElementById('detailsCategory');
const detailsDescription=document.getElementById('detailsDescription');
const detailsTags=document.getElementById('detailsTags');
const detailsLogo=document.getElementById('detailsLogo');
const detailsPlay=document.getElementById('detailsPlay');
const detailsDownload=document.getElementById('detailsDownload');
const detailsBg=document.getElementById('detailsBg');
let currentDetail=null;

function localVideoCandidates(folder){
  if(!folder) return [];
  const base=`assets/videos/${folder}/`;
  // Prefer these exact names inside the script folder
  return [
    base+'video.mp4',
    base+'video.webm',
    base+'video.mov',
    base+'preview.mp4',
    base+'trailer.mp4',
    base+folder+'.mp4'
  ];
}

function stopDetailsMedia(){
  if(detailsVideo) detailsVideo.src='';
  if(detailsLocalVideo){
    detailsLocalVideo.onloadeddata=null;
    detailsLocalVideo.onerror=null;
    detailsLocalVideo.pause();
    detailsLocalVideo.removeAttribute('src');
    detailsLocalVideo.load();
  }
  detailsWrap?.classList.remove('playing','playing-local');
}

function showDetails(key){
  const d=SCRIPT_DETAILS[key]; if(!d||!detailsModal) return;
  currentDetail=key;
  detailsTitle.textContent=d.title; detailsCategory.textContent=d.category;
  detailsDescription.textContent=d.description;
  detailsLogo.src=d.photo||d.logo;
  detailsTags.innerHTML=d.tags.map(t=>`<span>${t}</span>`).join('');
  // Free script download button
  if(detailsDownload){
    if(d.download){
      detailsDownload.href=d.download;
      detailsDownload.setAttribute('download', d.downloadName||'script.zip');
      detailsDownload.style.display='';
    }else{
      detailsDownload.removeAttribute('href');
      detailsDownload.style.display='none';
    }
  }
  // design-reference as details background
  if(detailsBg){
    detailsBg.style.backgroundImage=d.photo?`url("${d.photo}")`:'none';
  }
  stopDetailsMedia();
  detailsModal.classList.add('open'); detailsModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  // Try local video first, then URL / YouTube — play on open
  setTimeout(()=>playDetailsVideo(), 80);
}

/** Probe a path by loading it in the <video> element (works with local http.server) */
function probeVideoSrc(path){
  return new Promise(resolve=>{
    if(!detailsLocalVideo) return resolve(false);
    let done=false;
    const finish=(ok)=>{
      if(done) return;
      done=true;
      detailsLocalVideo.onloadeddata=null;
      detailsLocalVideo.onerror=null;
      resolve(ok);
    };
    detailsLocalVideo.onloadeddata=()=>finish(true);
    detailsLocalVideo.oncanplay=()=>finish(true);
    detailsLocalVideo.onerror=()=>finish(false);
    detailsLocalVideo.src=path;
    detailsLocalVideo.load();
    // safety timeout
    setTimeout(()=>finish(detailsLocalVideo.readyState>=2), 2500);
  });
}

async function tryPlayLocalVideo(folder){
  const paths=localVideoCandidates(folder);
  for(const path of paths){
    const ok=await probeVideoSrc(path);
    if(!ok) continue;
    detailsWrap.classList.add('playing','playing-local');
    detailsPlay.style.display='none';
    try{
      await detailsLocalVideo.play();
    }catch(_){
      // autoplay blocked — show play button so user can click
      detailsPlay.style.display='';
    }
    return true;
  }
  // reset video element if nothing found
  if(detailsLocalVideo){
    detailsLocalVideo.removeAttribute('src');
    detailsLocalVideo.load();
  }
  return false;
}

function isDirectVideoUrl(url){
  if(!url||typeof url!=='string') return false;
  const u=url.trim().toLowerCase();
  if(u.includes('cdn.discordapp.com')||u.includes('media.discordapp.net')) return true;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(u);
}

async function playDirectVideoUrl(url){
  if(!detailsLocalVideo||!url) return false;
  const ok=await probeVideoSrc(url);
  if(!ok) return false;
  detailsWrap.classList.add('playing','playing-local');
  detailsPlay.style.display='none';
  try{ await detailsLocalVideo.play(); }catch(_){ detailsPlay.style.display=''; }
  return true;
}

async function playDetailsVideo(){
  const d=SCRIPT_DETAILS[currentDetail]; if(!d) return;

  // If local video already loaded and visible, just resume play (Play button)
  if(detailsWrap?.classList.contains('playing-local') && detailsLocalVideo?.src){
    try{ await detailsLocalVideo.play(); detailsPlay.style.display='none'; }catch(_){}
    return;
  }

  // 1) Local file: assets/videos/{folder}/video.mp4
  if(d.folder && detailsLocalVideo){
    const ok=await tryPlayLocalVideo(d.folder);
    if(ok) return;
  }
  // 2) Direct video URL (Discord CDN, mp4 link, etc.)
  if(d.video && isDirectVideoUrl(d.video)){
    if(detailsVideo) detailsVideo.src='';
    const ok=await playDirectVideoUrl(d.video);
    if(ok) return;
  }
  // 3) YouTube
  if(d.video){
    const embed=youtubeEmbed(d.video);
    if(embed){
      if(detailsLocalVideo){ detailsLocalVideo.pause(); detailsLocalVideo.removeAttribute('src'); detailsLocalVideo.load(); }
      detailsVideo.src=embed;
      detailsWrap.classList.add('playing');
      detailsWrap.classList.remove('playing-local');
      detailsPlay.style.display='none';
      return;
    }
  }
  // No video found — keep design-reference preview, hide play
  detailsPlay.style.display='none';
}

function closeDetails(){
  stopDetailsMedia();
  detailsModal.classList.remove('open'); detailsModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  if(detailsBg) detailsBg.style.backgroundImage='none';
}
document.addEventListener('click', e => { const b=e.target.closest('.details-btn'); if(b) showDetails(b.dataset.script); });
document.querySelectorAll('[data-close-details]').forEach(b=>b.addEventListener('click',closeDetails));
document.getElementById('detailsClose')?.addEventListener('click',closeDetails);
detailsPlay?.addEventListener('click',playDetailsVideo);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&detailsModal?.classList.contains('open'))closeDetails()});


/* Discord server live information */
(async function loadDiscordServer(){
  const inviteCode='E4fXxY7pkg';
  const nameEl=document.getElementById('discordServerName');
  const membersEl=document.getElementById('discordMembers');
  const onlineEl=document.getElementById('discordOnline');
  const iconEl=document.getElementById('discordServerIcon');
  if(!nameEl) return;
  try{
    const r=await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`,{cache:'no-store'});
    if(!r.ok) throw new Error('Discord invite unavailable');
    const d=await r.json();
    const g=d.guild||{};
    nameEl.textContent=g.name||'CARLODZ Community';
    if(Number.isFinite(Number(d.approximate_member_count))) membersEl.textContent=Number(d.approximate_member_count).toLocaleString();
    if(Number.isFinite(Number(d.approximate_presence_count))) onlineEl.textContent=Number(d.approximate_presence_count).toLocaleString();
    if(g.id && g.icon) iconEl.src=`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=128`;
  }catch(e){
    nameEl.textContent='CARLODZ Community';
    membersEl.textContent='—';
    onlineEl.textContent='—';
  }
})();

/* 4-heart visitor rating system
   Each visitor can rate each script once on this browser. Shared totals use CounterAPI when available. */
(() => {
  const RATING_NS = 'carlodz-script-ratings-v1';
  const scripts = ['hunting','wayscoot','burgershot','fishing','pets','catcoffee'];
  const votedKey = key => `carlodz-rated-${key}`;

  function setVisual(root, value){
    root.querySelectorAll('.heart-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.heart) <= value);
    });
  }

  async function getCounts(key){
    const counts = [0,0,0,0];
    await Promise.all(counts.map(async (_, i) => {
      try{
        const r = await fetch(`https://api.counterapi.dev/v1/${RATING_NS}/${key}-heart-${i+1}`, {cache:'no-store'});
        if(r.ok){
          const d = await r.json();
          counts[i] = Number(d?.count ?? d?.value ?? 0) || 0;
        }
      }catch(e){}
    }));
    return counts;
  }

  function localCounts(key){
    try{return JSON.parse(localStorage.getItem(`carlodz-rating-counts-${key}`)||'[0,0,0,0]')}catch(e){return [0,0,0,0]}
  }
  function saveLocal(key, counts){ localStorage.setItem(`carlodz-rating-counts-${key}`, JSON.stringify(counts)); }

  function render(root, counts){
    const total = counts.reduce((a,b)=>a+b,0);
    const score = total ? (counts.reduce((sum,n,i)=>sum+n*(i+1),0)/total).toFixed(1) : '—';
    const value = root.querySelector('.rating-value');
    if(value) value.textContent = total ? `${score}/4` : '—';
    const mine = Number(localStorage.getItem(votedKey(root.dataset.rating)) || 0);
    setVisual(root, mine);
    root.title = total ? `${score}/4 from ${total} vote${total===1?'':'s'}` : 'Be the first to rate';
  }

  document.querySelectorAll('.script-rating').forEach(root => {
    const key = root.dataset.rating;
    let counts = localCounts(key);
    render(root, counts);

    getCounts(key).then(remote => {
      if(remote.some(n => n > 0)) { counts = remote; saveLocal(key, counts); render(root, counts); }
    });

    root.querySelectorAll('.heart-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const old = Number(localStorage.getItem(votedKey(key)) || 0);
        if(old){
          setVisual(root, old);
          return;
        }
        const rating = Number(btn.dataset.heart);
        if(rating < 1 || rating > 4) return;
        localStorage.setItem(votedKey(key), String(rating));
        counts[rating-1] = (counts[rating-1] || 0) + 1;
        saveLocal(key, counts);
        render(root, counts);
        try{
          await fetch(`https://api.counterapi.dev/v1/${RATING_NS}/${key}-heart-${rating}/up`, {cache:'no-store'});
        }catch(e){}
      });
    });
  });
})();
