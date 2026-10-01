// =========================================================
// PURCHASE LINKS — replace these URLs with your real store/payment pages.
// Prices are displayed on the website only; change them here if needed.
// =========================================================
const PURCHASE_CONFIG = {
  wayscoot:  { price: '$5',  product: 'wayscoot' },
  burgershot:{ price: '$5',  product: 'burgershot' },
  pets:      { price: '$10', product: 'waypets' },
  catcoffee: { price: '$5',  product: 'catcoffee' }
};

// RedotPay checkout is created securely by server.js.
// Do NOT put RedotPay appKey/private keys in this browser file.
async function startRedotPayCheckout(key){
  const cfg=PURCHASE_CONFIG[key];
  if(!cfg) throw new Error('Unknown product');
  const userId=(localStorage.getItem('carlodz-user-id') || ('web-'+crypto.randomUUID())).slice(0,32);
  localStorage.setItem('carlodz-user-id', userId);
  const r=await fetch('/api/create-payment',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({product:key, userId})
  });
  const data=await r.json().catch(()=>({}));
  if(!r.ok || !data.paymentUrl) throw new Error(data.message || 'Unable to create payment');
  window.location.href=data.paymentUrl;
}

function bindPurchaseButtons(){
  document.querySelectorAll('[data-buy]').forEach(btn=>{
    const key=btn.getAttribute('data-buy');
    const cfg=PURCHASE_CONFIG[key];
    if(!cfg) return;
    btn.href='#';
    btn.removeAttribute('target');
    btn.addEventListener('click', async (e)=>{
      e.preventDefault();
      if(btn.dataset.loading==='1') return;
      btn.dataset.loading='1';
      const old=btn.innerHTML;
      btn.innerHTML='Processing...';
      try{ await startRedotPayCheckout(key); }
      catch(err){ alert(err.message || 'Payment could not be started.'); btn.innerHTML=old; btn.dataset.loading=''; }
    });
    const row=btn.closest('.purchase-row');
    const price=row?.querySelector('.script-price');
    if(price) price.textContent=cfg.price;
  });
}


/* CARLODZ — Video links per script (YouTube or direct mp4 URL only) */
const SCRIPT_VIDEOS = {
  fishing: "https://www.youtube.com/watch?v=v_GOK6WL9kg",
  wayscoot: "",
  burgershot: "",
  pets: "",
  hunting: "",
  catcoffee: ""
};

/* ========== i18n (EN / AR) — Cairo font for Arabic ========== */
const TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_scripts: "Scripts",
    nav_about: "About",
    nav_contact: "Contact",
    brand_tag: "FIVEM SCRIPTS & MORE",
    search_placeholder: "Search scripts...",
    discord: "Discord",
    hero_eyebrow: "WELCOME TO",
    hero_subtitle: "HIGH QUALITY FIVEM SCRIPTS",
    hero_desc: "Premium scripts, custom solutions and unique experiences designed for modern FiveM servers. Clean code, polished NUI, and continuous support.",
    hero_explore: "Explore Scripts",
    hero_trailer: "Watch Trailer",
    stat_scripts: "Premium Scripts",
    stat_secure: "Secure & Tested",
    stat_support: "Community Support",
    feat1_title: "Premium Quality",
    feat1_desc: "Well tested & optimized",
    feat2_title: "100% Secure",
    feat2_desc: "No bugs · No risk",
    feat3_title: "Fast Support",
    feat3_desc: "Always here for you",
    feat4_title: "Regular Updates",
    feat4_desc: "New features & fixes",
    scripts_small: "FEATURED SCRIPTS",
    scripts_title: "OUR <em>SCRIPTS</em>",
    scripts_desc: "Discover our most popular and high-quality scripts for your FiveM server.",
    filter_all: "All",
    filter_free: "Free",
    filter_paid: "Paid",
    live_visitors: "LIVE VISITORS",
    status: "STATUS",
    online: "ONLINE",
    details: "Details",
    download: "Download",
    rate_this: "Rate this script",
    join_discord: "Join Discord",
    about_small: "ABOUT CARLODZ",
    about_title: "BUILT FOR <em>FIVEM</em>",
    about_desc: "CARLODZ creates custom FiveM resources with polished NUI, gameplay systems, optimized performance and a focus on clean server integration. Every script is built with quality, security and player experience in mind.",
    about_li1: "Optimized performance for large servers",
    about_li2: "Modern & responsive NUI interfaces",
    about_li3: "Easy installation & configuration",
    about_li4: "Continuous updates & dedicated support",
    about_h1: "Quality First",
    about_h1d: "Every resource is tested thoroughly before release.",
    about_h2: "Player Focused",
    about_h2d: "Gameplay systems designed for fun and immersion.",
    about_h3: "Always Improving",
    about_h3d: "Regular updates based on community feedback.",
    contact_small: "NEED HELP?",
    contact_title: "LET'S BUILD<br><em>SOMETHING</em>",
    contact_desc: "Have a custom request or need support? Reach out via Discord, WhatsApp or Email — we're ready to help.",
    contact_btn: "Contact on Discord",
    contact_email: "Email us",
    footer_rights: "© 2026 CARLODZ. All rights reserved. · FiveM Scripts & Custom Solutions.",
    footer_thanks: "THANK YOU FOR YOUR SUPPORT!",
    play_video: "Play Video",
    back_scripts: "← Back to Scripts",
    download_script: "Download Script",
    script_preview: "SCRIPT PREVIEW"
  },
  ar: {
    nav_home: "الرئيسية",
    nav_scripts: "السكربتات",
    nav_about: "من نحن",
    nav_contact: "تواصل",
    brand_tag: "سكربتات فايف إم والمزيد",
    search_placeholder: "ابحث عن سكربت...",
    discord: "ديسكورد",
    hero_eyebrow: "مرحباً بك في",
    hero_subtitle: "سكربتات فايف إم عالية الجودة",
    hero_desc: "سكربتات بريميوم وحلول مخصصة وتجارب فريدة مصممة لسيرفرات فايف إم الحديثة. كود نظيف، واجهة NUI راقية، ودعم مستمر.",
    hero_explore: "استكشف السكربتات",
    hero_trailer: "شاهد التريلر",
    stat_scripts: "سكربتات بريميوم",
    stat_secure: "آمن ومُختبر",
    stat_support: "دعم المجتمع",
    feat1_title: "جودة بريميوم",
    feat1_desc: "مُختبر ومُحسّن جيداً",
    feat2_title: "آمن ١٠٠٪",
    feat2_desc: "بدون أخطاء · بدون مخاطر",
    feat3_title: "دعم سريع",
    feat3_desc: "دائماً هنا من أجلك",
    feat4_title: "تحديثات مستمرة",
    feat4_desc: "ميزات جديدة وإصلاحات",
    scripts_small: "السكربتات المميزة",
    scripts_title: "سكربتاتنا",
    scripts_desc: "اكتشف أشهر وأفضل السكربتات عالية الجودة لسيرفر فايف إم الخاص بك.",
    filter_all: "الكل",
    filter_free: "مجاني",
    filter_paid: "مدفوع",
    live_visitors: "زوار مباشرون",
    status: "الحالة",
    online: "متصل",
    details: "التفاصيل",
    download: "تحميل",
    rate_this: "قيّم هذا السكربت",
    join_discord: "انضم للديسكورد",
    about_small: "عن كارلودز",
    about_title: "مصمم لـ <em>فايف إم</em>",
    about_desc: "كارلودز يبتكر موارد فايف إم مخصصة بواجهات NUI راقية وأنظمة لعب وأداء محسّن مع التركيز على التكامل النظيف مع السيرفر. كل سكربت يُبنى بجودة وأمان وتجربة لاعب في الحسبان.",
    about_li1: "أداء محسّن للسيرفرات الكبيرة",
    about_li2: "واجهات NUI عصرية ومتجاوبة",
    about_li3: "تثبيت وإعداد سهل",
    about_li4: "تحديثات مستمرة ودعم مخصص",
    about_h1: "الجودة أولاً",
    about_h1d: "كل مورد يُختبر جيداً قبل الإصدار.",
    about_h2: "تركيز على اللاعب",
    about_h2d: "أنظمة لعب مصممة للمتعة والانغماس.",
    about_h3: "تحسين دائم",
    about_h3d: "تحديثات منتظمة بناءً على ملاحظات المجتمع.",
    contact_small: "تحتاج مساعدة؟",
    contact_title: "خلينا نبني<br><em>شيئاً</em>",
    contact_desc: "عندك طلب مخصص أو تحتاج دعم؟ تواصل معنا عبر ديسكورد أو واتساب أو الإيميل — نحن جاهزون للمساعدة.",
    contact_btn: "تواصل عبر ديسكورد",
    contact_email: "راسلنا بالإيميل",
    footer_rights: "© 2026 كارلودز. جميع الحقوق محفوظة. · سكربتات فايف إم وحلول مخصصة.",
    footer_thanks: "شكراً لدعمكم!",
    play_video: "تشغيل الفيديو",
    back_scripts: "→ العودة للسكربتات",
    download_script: "تحميل السكربت",
    script_preview: "معاينة السكربت"
  }
};

function setLanguage(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  // Update common dynamic buttons that may not have data-i18n yet
  document.querySelectorAll('.details-btn').forEach(btn => {
    const span = btn.querySelector('span');
    btn.childNodes.forEach(n => {
      if (n.nodeType === 3 && n.textContent.trim()) n.textContent = t.details + ' ';
    });
    if (span) span.textContent = '→';
  });
  document.querySelectorAll('.download-btn').forEach(btn => {
    const img = btn.querySelector('img');
    btn.innerHTML = '';
    if (img) btn.appendChild(img);
    btn.appendChild(document.createTextNode(' ' + t.download));
  });
  document.querySelectorAll('.script-rating small').forEach(el => {
    el.textContent = t.rate_this;
  });

  // Update language flags and active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const flag = btn.querySelector('.lang-flag');
    if (flag) {
      const isArabic = btn.dataset.lang === 'ar';
      flag.src = isArabic ? 'assets/flags/dz.svg' : 'assets/flags/gb.svg';
      flag.alt = isArabic ? 'العربية' : 'English';
    }
  });

  // Lang buttons state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  localStorage.setItem('carlodz-lang', lang);
}

// Init language
(function initLang() {
  const saved = localStorage.getItem('carlodz-lang') || 'en';
  setLanguage(saved);
  document.getElementById('langSwitch')?.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    setLanguage(btn.dataset.lang);
  });
})();

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

/* Service worker cleanup — prevents old GitHub Pages cache from serving stale files */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
      if (navigator.serviceWorker.controller) window.location.reload();
    } catch (_) {}
  });
}

/* Visitor counter — real shared count via CounterAPI (once per browser session) */
(async function visitorCounter(){
  const el=document.getElementById('visitorCount');
  if(!el) return;
  const sessionKey='carlodz-visited-session';
  const already=sessionStorage.getItem(sessionKey);
  // Show last known count immediately
  const last=localStorage.getItem('carlodz-last-visits');
  if(last) el.textContent=Number(last).toLocaleString();
  try{
    // Only increment once per browser session
    const url=already
      ? 'https://api.counterapi.dev/v1/carlodz-site/visits'
      : 'https://api.counterapi.dev/v1/carlodz-site/visits/up';
    const r=await fetch(url,{cache:'no-store'});
    if(r.ok){
      const data=await r.json();
      const n=Number(data?.count ?? data?.value);
      if(Number.isFinite(n)){
        el.textContent=n.toLocaleString();
        localStorage.setItem('carlodz-last-visits',String(n));
        if(!already) sessionStorage.setItem(sessionKey,'1');
      }
    }
  }catch(e){
    // offline fallback
    if(!last){
      const local=Number(localStorage.getItem('carlodz-local-visits')||0)+(already?0:1);
      localStorage.setItem('carlodz-local-visits',String(local));
      el.textContent=local.toLocaleString();
      if(!already) sessionStorage.setItem(sessionKey,'1');
    }
  }
})();


bindPurchaseButtons();

/* Script details — opens in the same page (YouTube / direct video only) */
const SCRIPT_DETAILS={
  fishing:{title:'Fishing',category:'FREE SCRIPT',description:'A clean fishing system for your FiveM server with fishing spots, catches, rewards and an easy QBCore setup.',logo:'assets/fishing-logo.png',photo:'assets/design-reference 2.png',tags:['QBCore','Fishing','Rewards','Free'],video:SCRIPT_VIDEOS.fishing,download:'assets/downloads/fishing/script.zip',downloadName:'Fishing.zip'},
  hunting:{title:'Hunting Zone',category:'FREE SCRIPT',description:'A lightweight hunting zone system for your FiveM server, designed to be simple, clean and easy to configure.',logo:'assets/Hunting Zone-logo.png',photo:'assets/design-reference 4.png',tags:['QBCore','Free','Hunting','Zone'],video:SCRIPT_VIDEOS.hunting,download:'assets/downloads/hunting/script.zip',downloadName:'Hunting-Zone.zip'},
  wayscoot:{title:'WayScoot',category:'PAID SCRIPT',description:'Modern scooter rental system with multiple stations, rental timer, payment flow, polished NUI and FiveM integration.',logo:'assets/wayscoot-logo.png',photo:'assets/design-reference.png',tags:['QBCore','Target','NUI','Rental'],price:'$5',buyKey:'wayscoot',video:SCRIPT_VIDEOS.wayscoot},
  burgershot:{title:'Burger Shot',category:'PAID SCRIPT',description:'Complete Burger Shot restaurant job with food props, animations, cooking flow, deliveries and modern NUI.',logo:'assets/burgershot-logo.png',photo:'assets/design-reference 3.png',tags:['QBCore','Job','NUI','Delivery'],price:'$5',buyKey:'burgershot',video:SCRIPT_VIDEOS.burgershot},
  pets:{title:'WayPets',category:'PAID SCRIPT',description:'A complete pets system with adoption, training, care and animal features built for a modern FiveM server.',logo:'assets/waypets-logo.png',photo:'assets/design-reference 1.png',tags:['QBCore','NUI','Animals','System'],price:'$10',buyKey:'pets',video:SCRIPT_VIDEOS.pets},
  catcoffee:{title:'Cat Coffee',category:'PAID SCRIPT',description:'Run your own cat coffee shop with orders, crafting, cat interactions and a polished QBCore job system.',logo:'assets/CATCOFFE - LOGO.png',photo:'assets/design-reference 5.png',tags:['QBCore','Job','NUI','Cafe'],price:'$5',buyKey:'catcoffee',video:SCRIPT_VIDEOS.catcoffee}
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
const detailsBuy=document.getElementById('detailsBuy');
const detailsPrice=document.getElementById('detailsPrice');
const detailsBg=document.getElementById('detailsBg');
let currentDetail=null;

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
  // Paid purchase button
  if(detailsBuy){
    if(d.buyKey){
      detailsBuy.href='#';
      detailsBuy.style.display='';
      if(detailsPrice) detailsPrice.textContent=d.price||'';
      detailsBuy.onclick=async (e)=>{
        e.preventDefault();
        try{ await startRedotPayCheckout(d.buyKey); }
        catch(err){ alert(err.message || 'Payment could not be started.'); }
      };
    }else{
      detailsBuy.removeAttribute('href');
      detailsBuy.style.display='none';
      detailsBuy.onclick=null;
    }
  }
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
  // Play YouTube / direct video on open
  setTimeout(()=>playDetailsVideo(), 80);
}

function isDirectVideoUrl(url){
  if(!url||typeof url!=='string') return false;
  const u=url.trim().toLowerCase();
  if(u.includes('cdn.discordapp.com')||u.includes('media.discordapp.net')) return true;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(u);
}

async function playDirectVideoUrl(url){
  if(!detailsLocalVideo||!url) return false;
  return new Promise(resolve=>{
    let done=false;
    const finish=(ok)=>{
      if(done) return; done=true;
      detailsLocalVideo.onloadeddata=null;
      detailsLocalVideo.onerror=null;
      if(ok){
        detailsWrap.classList.add('playing','playing-local');
        detailsPlay.style.display='none';
        detailsLocalVideo.play().catch(()=>{ detailsPlay.style.display=''; });
      }
      resolve(ok);
    };
    detailsLocalVideo.onloadeddata=()=>finish(true);
    detailsLocalVideo.oncanplay=()=>finish(true);
    detailsLocalVideo.onerror=()=>finish(false);
    detailsLocalVideo.src=url;
    detailsLocalVideo.load();
    setTimeout(()=>finish(detailsLocalVideo.readyState>=2), 2500);
  });
}

async function playDetailsVideo(){
  const d=SCRIPT_DETAILS[currentDetail]; if(!d) return;

  // Resume local/direct if already playing
  if(detailsWrap?.classList.contains('playing-local') && detailsLocalVideo?.src){
    try{ await detailsLocalVideo.play(); detailsPlay.style.display='none'; }catch(_){}
    return;
  }

  // 1) Direct video URL (mp4 / Discord CDN)
  if(d.video && isDirectVideoUrl(d.video)){
    if(detailsVideo) detailsVideo.src='';
    const ok=await playDirectVideoUrl(d.video);
    if(ok) return;
  }
  // 2) YouTube
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
  // No video — keep design-reference preview
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

/* RedotPay return/status screen */
(async function paymentReturnStatus(){
  const params=new URLSearchParams(location.search);
  if(params.get('payment')!=='return') return;
  const order=params.get('order'); const panel=document.getElementById('paymentReturn');
  const title=document.getElementById('paymentReturnTitle'); const textEl=document.getElementById('paymentReturnText');
  const download=document.getElementById('paymentDownload'); const close=document.getElementById('paymentReturnClose');
  if(!panel||!order) return;
  panel.hidden=false;
  close?.addEventListener('click',()=>{ panel.hidden=true; history.replaceState({},'',location.pathname); });
  try{
    const r=await fetch('/api/payment-status?order='+encodeURIComponent(order),{cache:'no-store'}); const d=await r.json();
    if(d.status==='PAID'){
      title.textContent='Payment successful'; textEl.textContent='Your payment has been confirmed.';
      if(d.download){ download.href=d.download; download.hidden=false; }
    }else if(d.status==='PENDING'){
      title.textContent='Payment pending'; textEl.textContent='Payment was not confirmed yet. Please wait a moment and refresh this page.';
    }else{ title.textContent='Payment not completed'; textEl.textContent='The order is not confirmed as paid.'; }
  }catch(e){ title.textContent='Payment status'; textEl.textContent='Unable to check the order right now.'; }
})();
