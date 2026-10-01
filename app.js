/* CARLODZ — Video links per script (YouTube or direct mp4 URL only) */
const SCRIPT_VIDEOS = {
  fishing: "https://www.youtube.com/watch?v=v_GOK6WL9kg",
  wayscoot: "",
  burgershot: "",
  pets: "",
  hunting: "",
  catcoffee: "",
  carlodz_character: ""
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

/* Hero showcase — automatically rotates through all CARLODZ scripts and updates the hero text/logo/photo together. */
document.addEventListener('DOMContentLoaded', () => {
  const photo = document.querySelector('.hero-reference');
  const logo = document.getElementById('heroBrandLogo');
  const eyebrow = document.getElementById('heroEyebrow');
  const subtitle = document.getElementById('heroSubtitle');
  const description = document.getElementById('heroDescription');
  const label = document.querySelector('.clothing-hero-label');
  const slides = [
    {key:'carlodzclothing', eyebrow:'PREMIUM • QBCORE • CARLODZ CHARACTER', subtitle:'THE COMPLETE CHARACTER STYLE SYSTEM', desc:'Premium QBCore clothing and character ecosystem with clothing shops, tattoo shops, female-only beauty surgery and a complete creator system.', label:'CARLODZ CLOTHING', meta:'CHARACTER • BEAUTY • STYLE'},
    {key:'carlodz_character', eyebrow:'PREMIUM • QBCORE • CHARACTER', subtitle:'THE COMPLETE CHARACTER CREATOR SYSTEM', desc:'A dedicated Carlodz Character creator for building and customizing your FiveM character, designed to work together with Carlodz Clothing and QBCore.', label:'CARLODZ CHARACTER', meta:'CREATOR • CUSTOMIZATION • QBCORE'},
    {key:'wayscoot', eyebrow:'PREMIUM • QBCORE • RENTAL', subtitle:'MODERN SCOOTER RENTAL SYSTEM', desc:'A polished scooter rental experience with stations, payment flow, rental timer, vehicle keys and modern NUI.', label:'WAY SCOOT', meta:'RENTAL • NUI • CITY MOBILITY'},
    {key:'burgershot', eyebrow:'PREMIUM • QBCORE • JOB', subtitle:'COMPLETE BURGER SHOT EXPERIENCE', desc:'A complete restaurant job with cooking, food props, animations, orders, deliveries and a polished gameplay flow.', label:'BURGER SHOT', meta:'JOB • COOKING • DELIVERY'},
    {key:'pets', eyebrow:'PREMIUM • QBCORE • PETS', subtitle:'YOUR PETS. YOUR CITY. YOUR STORY.', desc:'A modern pets system with adoption, care, interaction and animal features designed for immersive FiveM servers.', label:'CARLODZ PETS', meta:'PETS • NUI • IMMERSION'},
    {key:'fishing', eyebrow:'FREE • QBCORE • FISHING', subtitle:'FISH. CATCH. REWARD.', desc:'A clean fishing experience with fishing spots, catches, rewards and simple QBCore integration.', label:'FISHING', meta:'FREE • FISHING • REWARDS'},
    {key:'hunting', eyebrow:'FREE • QBCORE • HUNTING', subtitle:'ENTER THE HUNTING ZONE', desc:'A lightweight hunting zone system built for simple configuration, hunting gameplay and a clean server experience.', label:'HUNTING ZONE', meta:'FREE • HUNTING • ZONE'},
    {key:'catcoffee', eyebrow:'PREMIUM • QBCORE • JOB', subtitle:'RUN YOUR OWN CAT COFFEE', desc:'A complete cat coffee job with orders, crafting, cat interactions and a polished QBCore workflow.', label:'CAT COFFEE', meta:'JOB • CAFE • CATS'}
  ];
  if(!photo || !logo) return;
  const heroStrip=document.getElementById('heroScriptStrip');
  if(heroStrip){ heroStrip.innerHTML=slides.map((s,i)=>`<button type="button" class="hero-script-pill${i===0?' active':''}" data-hero-index="${i}"><span>${String(i+1).padStart(2,'0')}</span>${s.label}</button>`).join(''); }
  let index=0, timer;
  const apply=(i,animate=true)=>{
    const s=slides[i], d=SCRIPT_DETAILS[s.key]; if(!d) return;
    const swap=()=>{
      photo.src=d.photo; logo.src=d.logo;
      const ov=document.querySelector('.hero-logo-overlay'); if(ov){ov.src=d.logo; ov.alt=d.title;}
      photo.alt=d.title+' showcase'; logo.alt=d.title;
      if(eyebrow) eyebrow.textContent=s.eyebrow;
      if(subtitle) subtitle.textContent=s.subtitle;
      if(description) description.textContent=s.desc;
      if(label) label.innerHTML=s.label+'<br><em>'+s.meta+'</em>';
      document.querySelector('.hero')?.setAttribute('data-hero-script',s.key);
      if(heroStrip) heroStrip.querySelectorAll('.hero-script-pill').forEach((el,n)=>el.classList.toggle('active',n===i));
    };
    if(!animate){swap();return;}
    photo.classList.add('hero-changing'); logo.classList.add('hero-changing');
    setTimeout(()=>{swap(); photo.classList.remove('hero-changing'); logo.classList.remove('hero-changing');},260);
  };
  apply(0,false);
  timer=setInterval(()=>{index=(index+1)%slides.length;apply(index,true);},4000);
  heroStrip?.addEventListener('click',e=>{
    const b=e.target.closest('.hero-script-pill');
    if(!b) return;
    index=Number(b.dataset.heroIndex)||0;
    apply(index,true);
    clearInterval(timer);
    timer=setInterval(()=>{index=(index+1)%slides.length;apply(index,true);},4000);
    const key=slides[index]?.key;
    if(typeof showDetails==='function' && key) showDetails(key);
  });

  document.querySelectorAll('.script-card').forEach(card=>{
    card.addEventListener('mouseenter',()=>{
      const key=card.querySelector('[data-script]')?.dataset.script;
      const i=slides.findIndex(s=>s.key===key);
      if(i>=0){index=i;apply(i,true);clearInterval(timer);timer=setInterval(()=>{index=(index+1)%slides.length;apply(index,true);},4000);}
    });
    card.addEventListener('click',e=>{
      if(e.target.closest('a,button,input,select,textarea')) return;
      const key=card.querySelector('[data-script]')?.dataset.script;
      if(typeof showDetails==='function' && key) showDetails(key);
    });
  });
});

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

/* Script details — opens in the same page (YouTube / direct video only) */
const SCRIPT_DETAILS={
  fishing:{title:'Fishing',category:'FREE SCRIPT',description:'Fish in any weather with a clean QBCore fishing system featuring catches, rewards and simple setup.',logo:'assets/fishing-logo.png',photo:'assets/design-reference 2.png',tags:['QBCore','Fishing','Any Weather','Rewards','Free'],video:SCRIPT_VIDEOS.fishing,download:'assets/downloads/fishing/script.zip',downloadName:'Fishing.zip',features:['Fishing in any weather','Catches & rewards','QBCore ready','Easy configuration']},
  hunting:{title:'Hunting Zone',category:'FREE SCRIPT',description:'A complete hunting loop with weapon purchase, animal selling and off-road vehicle rental inside the hunting zone.',logo:'assets/Hunting Zone-logo.png',photo:'assets/design-reference 4.png',tags:['QBCore','Free','Hunting','Weapons','Animal Sales','Offroad'],video:SCRIPT_VIDEOS.hunting,download:'assets/downloads/hunting/script.zip',downloadName:'Hunting-Zone.zip',features:['Buy the weapon','Hunt and sell animals','Rent the off-road','Dedicated hunting zone']},
  wayscoot:{title:'WayScoot',category:'PAID SCRIPT',description:'Modern scooter rental with a polished NUI, payment flow and flexible rental durations: 15 minutes or 1 hour 30 minutes.',logo:'assets/wayscoot-logo.png',photo:'assets/design-reference.png',tags:['QBCore','Target','NUI','Rental','15 Min','1H 30 Min'],video:SCRIPT_VIDEOS.wayscoot,features:['15 minute rental','1 hour 30 minute rental','Payment system','Multiple stations','Return system']},
  burgershot:{title:'Burger Shot',category:'PAID SCRIPT',description:'A full Burger Shot system with ingredient deliveries in boxes, custom boxes, duty management, a custom NUI and an advanced order system.',logo:'assets/burgershot-logo.png',photo:'assets/design-reference 3.png',tags:['QBCore','Job','NUI','Delivery','Boxes','Duty','Orders'],video:SCRIPT_VIDEOS.burgershot,features:['Ingredient delivery with boxes','Custom box system','Duty system','New custom NUI','Advanced order system','More restaurant features']},
  pets:{title:'Carlodz Pets',category:'PAID SCRIPT',description:'Customize your pet with a dedicated NUI, veterinary system, interactive play and a complete pet experience.',logo:'assets/waypets-logo.png',photo:'assets/design-reference 1.png',tags:['QBCore','NUI','Pets','Veterinary','Customization','Play'],video:SCRIPT_VIDEOS.pets,features:['Customize your pet','Custom NUI system','Veterinary system','Play with your pet','Pet care & interactions']},
  catcoffee:{title:'Cat Coffee',category:'PAID SCRIPT',description:'A premium Cat Coffee job with custom NUI, advanced order menus, cat interactions and an immersive café workflow.',logo:'assets/CATCOFFE - LOGO.png',photo:'assets/design-reference 5.png',tags:['QBCore','Job','NUI','Cafe','Orders','Cats'],video:SCRIPT_VIDEOS.catcoffee,features:['Custom NUI','Advanced order menu','Play with cats','Cat Coffee job system','More café features']},
  carlodzclothing:{title:'Carlodz Clothing',category:'PAID SCRIPT',description:'Premium QBCore clothing and character ecosystem designed to work with Carlodz Character. Includes clothing shops, tattoo shops, female-only beauty surgery, advanced character creator and creator tools.',logo:'assets/carlodz-clothing-logo.png',photo:'assets/design-reference 6.png',tags:['QBCore','Carlodz Character','Creator','Clothing','Tattoos','Beauty'],video:SCRIPT_VIDEOS.carlodzclothing,features:['Clothing system','Character creator','Tattoos','Beauty & surgery','QBCore integration']},
  carlodz_character:{title:'Carlodz Character',category:'PAID SCRIPT',description:'A complete QBCore character creator system designed for modern FiveM servers, built to work with Carlodz Clothing for character creation and customization.',logo:'assets/carlodz_character-LOGO.png',photo:'assets/design-reference 7.png',tags:['QBCore','Character Creator','Customization','Carlodz Clothing','NUI'],video:SCRIPT_VIDEOS.carlodz_character,features:['Character creation','Character customization','Carlodz Clothing sync','Modern creator NUI','QBCore integration']}
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
const detailsPurchase=document.getElementById('detailsPurchase');
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
  // Paid scripts show Contact / Purchase; free scripts show Download.
  if(detailsPurchase){
    const paid=d.category==='PAID SCRIPT';
    detailsPurchase.style.display=paid?'inline-flex':'none';
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
  const inviteCode='Q4Z2M2veAD';
  const fallbackName='CARLODZ COMMUNITY';
  const fallbackIcon='assets/carlodz-clothing-logo.png';

  const nameEl=document.getElementById('discordServerName');
  const membersEl=document.getElementById('discordMembers');
  const onlineEl=document.getElementById('discordOnline');
  const iconEl=document.getElementById('discordServerIcon');
  const joinEl=document.getElementById('discordJoin');

  if(!nameEl) return;

  // Never leave the UI in a loading state.
  nameEl.textContent=fallbackName;
  if(iconEl) iconEl.src=fallbackIcon;
  if(onlineEl) onlineEl.textContent='LIVE';
  if(membersEl) membersEl.textContent='COMMUNITY';
  if(joinEl) joinEl.href='https://discord.gg/Q4Z2M2veAD';

  try{
    const response=await fetch(
      `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`,
      {cache:'no-store'}
    );
    if(!response.ok) throw new Error('Discord invite unavailable');

    const data=await response.json();
    const guild=data.guild || {};

    if(guild.name) nameEl.textContent=guild.name;

    if(Number.isFinite(Number(data.approximate_presence_count)))
      onlineEl.textContent=Number(data.approximate_presence_count).toLocaleString();

    if(Number.isFinite(Number(data.approximate_member_count)))
      membersEl.textContent=Number(data.approximate_member_count).toLocaleString();

    if(guild.id && guild.icon && iconEl)
      iconEl.src=`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
  }catch(error){
    // Keep the polished fallback card visible.
  }
})();

/* 4-heart visitor rating system
   Each visitor can rate each script once on this browser. Shared totals use CounterAPI when available. */
(() => {
  const RATING_NS = 'carlodz-script-ratings-v1';
  const scripts = ['carlodz_character','carlodzclothing','hunting','wayscoot','burgershot','fishing','pets','catcoffee'];
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
