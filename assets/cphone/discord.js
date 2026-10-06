/* WayLife Discord - contacts-only social app */
let discordState = { channel:null, channels:[], profile:null, poll:null, voice:null, selectedPhoto:null };

function discordApp(){
  clearInterval(discordState.poll);
  discordState = {channel:null,channels:[],profile:null,poll:null,voice:null,selectedPhoto:null};
  view('', `
    <div class="dc-shell">
      <div class="dc-top">
        <button class="dc-back" id="dc-back">‹</button>
        <div class="dc-brand"><div class="dc-logo">◉</div><div><b>Discord</b><small id="dc-status">Connecting…</small></div></div>
        <button class="dc-search">⌕</button><button class="dc-friends">♙</button>
      </div>
      <div class="dc-serverbar"><div class="dc-server-avatar">W</div><div><b>WAYLIFE COMMUNITY</b><small>Private · Contacts only</small></div><span>⌄</span></div>
      <div class="dc-layout">
        <aside class="dc-sidebar">
          <div class="dc-account" id="dc-account"></div>
          <div class="dc-title"><span>TEXT CHANNELS</span></div><div id="dc-text-channels"></div>
          <div class="dc-title"><span>VOICE CHANNELS</span></div><div id="dc-voice-channels"></div>
          <div class="dc-title dc-members-title"><span>CONTACTS ONLINE</span><b id="dc-count">0</b></div>
          <div id="dc-members" class="dc-members"></div>
        </aside>
        <main class="dc-main">
          <div id="dc-channel-head" class="dc-channel-head"></div>
          <div id="dc-voice-panel" class="dc-voice-panel hidden"></div>
          <div id="dc-messages" class="dc-messages"></div>
          <form id="dc-compose" class="dc-compose">
            <button type="button" id="dc-photo" title="Photo">＋</button>
            <input id="dc-input" maxlength="500" autocomplete="off" placeholder="Message #chat">
            <button type="submit">➤</button>
          </form>
        </main>
      </div>
    </div>` ,{nohdr:true,dark:true,app:'discord',cls:'full'});
  $('#dc-back').onclick=async()=>{if(discordState.voice) await discordLeaveVoice(); home();};
  $('#dc-photo').onclick=discordPickPhoto;
  $('#dc-compose').onsubmit=async e=>{e.preventDefault(); const inp=$('#dc-input'),text=inp.value.trim(); if(!text||!discordState.channel)return; inp.value=''; const r=await post('discordSend',{channel:discordState.channel,text}); if(!r.ok)toast(r.err||'Message failed'); else discordLoadMessages(true);};
  discordLoad();
}

async function discordLoad(){
 try{
  const p=await post('discordProfile'); if(!p?.ok)throw new Error(p?.err||'Account unavailable'); discordState.profile=p.profile;
  $('#dc-account').innerHTML=`<div class="dc-avatar">${esc((p.profile.name||'?')[0])}<i></i></div><div class="dc-me"><b>${esc(p.profile.name)}</b><span>@${esc(p.profile.username)}</span><small>${esc(p.profile.job)}</small></div>`;
  const c=await post('discordChannels'); discordState.channels=c.channels||[]; drawDiscordChannels();
  if(discordState.channels.find(x=>x.type==='text')){discordState.channel=discordState.channels.find(x=>x.type==='text').id;drawDiscordChannels();await discordLoadMessages(false);}
  await discordRefreshMembers(); $('#dc-status').textContent='Connected';
  discordState.poll=setInterval(async()=>{if(document.querySelector('.dc-shell')){await discordRefreshMembers(); if(discordState.channel)discordLoadMessages(true); if(discordState.voice)discordVoiceState();}},2000);
 }catch(e){toast(e.message||'Discord unavailable');}
}

function drawDiscordChannels(){
 const tc=$('#dc-text-channels'),vc=$('#dc-voice-channels'); if(!tc)return;
 const texts=discordState.channels.filter(c=>c.type==='text'||c.type==='photo'), voices=discordState.channels.filter(c=>c.type==='voice');
 tc.innerHTML=texts.map(c=>`<button class="dc-channel ${c.id===discordState.channel?'sel':''}" data-id="${esc(c.id)}"><span class="dc-hash">${c.type==='photo'?'▧':'#'}</span><span>${esc(c.name)}</span></button>`).join('');
 vc.innerHTML=voices.map(c=>`<button class="dc-channel dc-voice ${discordState.voice?.channel===c.id?'sel':''}" data-id="${esc(c.id)}"><span class="dc-hash">🔊</span><span>${esc(c.name)}</span><em id="dc-vcount-${esc(c.id)}"></em></button>`).join('');
 tc.querySelectorAll('.dc-channel').forEach(b=>b.onclick=()=>{discordState.channel=b.dataset.id;drawDiscordChannels();discordLoadMessages(false);});
 vc.querySelectorAll('.dc-voice').forEach(b=>b.onclick=()=>discordToggleVoice(b.dataset.id));
}

async function discordRefreshMembers(){const r=await post('discordMembers');drawDiscordMembers(r.members||[]);}
function drawDiscordMembers(list){const el=$('#dc-members'); if(!el)return;$('#dc-count').textContent=list.length;el.innerHTML=list.map(m=>`<div class="dc-member"><div class="dc-avatar sm">${esc((m.name||'?')[0])}<i></i></div><div><b>${esc(m.name)}</b><span>${esc(m.role||'Citizen')}</span></div></div>`).join('')||'<div class="dc-empty">No contacts online</div>';}

async function discordLoadMessages(){if(!discordState.channel)return; const ch=discordState.channels.find(x=>x.id===discordState.channel); if(!ch)return; const head=$('#dc-channel-head'),box=$('#dc-messages'),form=$('#dc-compose');
 head.innerHTML=`<span class="dc-big-hash">${ch.type==='photo'?'▧':'#'}</span><div><b>${esc(ch.name)}</b><small>${esc(ch.topic||'')}</small></div><span class="dc-head-online">${$('#dc-count')?.textContent||0} online</span>`;
 if(ch.type==='voice'){form.classList.add('hidden');box.innerHTML='';return;} form.classList.remove('hidden');$('#dc-input').placeholder=`Message #${ch.name}`;
 const r=await post('discordMessages',{channel:discordState.channel});if(!r?.ok)return; const atBottom=box.scrollHeight-box.scrollTop-box.clientHeight<100; const old=box.dataset.last;
 box.innerHTML=(r.messages||[]).map(m=>m.kind==='photo'?`<div class="dc-msg"><div class="dc-avatar sm">${esc((m.name||'?')[0])}</div><div class="dc-msg-body"><div><b>${esc(m.name)}</b><span>${esc(m.time||'')}</span></div><img class="dc-photo-msg" src="${esc(m.media)}" onclick="window.open(this.src)"></div></div>`:`<div class="dc-msg"><div class="dc-avatar sm">${esc((m.name||'?')[0])}</div><div class="dc-msg-body"><div><b>${esc(m.name)}</b><span>${esc(m.time||'')}</span></div><p>${esc(m.text)}</p></div></div>`).join('')||'<div class="dc-welcome"><b>Welcome to the channel!</b><span>Only people in your contacts can appear online here.</span></div>';
 box.dataset.last=String(r.messages?.length||0);if(atBottom||old!==box.dataset.last)box.scrollTop=box.scrollHeight;
}

async function discordPickPhoto(){
 const r=await post('getPhotos');const photos=r.list||[];if(!photos.length)return toast('No photos in Gallery');
 const root=view('Choose photo',`<div class="dc-gallery-pick">${photos.filter(p=>p.kind!=='video').map(p=>`<button class="dc-pick-photo" data-id="${p.id}"><img data-id="${p.id}"><span>✓</span></button>`).join('')}</div>`,{dark:true});
 root.querySelectorAll('.dc-pick-photo').forEach(async b=>{const x=await post('getPhoto',{id:+b.dataset.id,thumb:true});const im=b.querySelector('img');if(im&&x?.data)im.src=x.data;b.onclick=async()=>{const full=await post('getPhoto',{id:+b.dataset.id,thumb:false});if(!full?.data)return;const s=await post('discordSendPhoto',{channel:discordState.channel,media:full.data});if(!s.ok)toast(s.err||'Photo failed');else{toast('Photo sent');discordApp();}};});
}

async function discordToggleVoice(channel){if(discordState.voice?.channel===channel)return discordLeaveVoice();if(discordState.voice)return await discordLeaveVoice();const r=await post('discordVoiceJoin',{channel});if(!r?.ok)return toast(r?.err||'Voice unavailable');discordState.voice={channel,count:r.count||1};drawDiscordChannels();discordVoiceState();}
async function discordLeaveVoice(){if(!discordState.voice)return;await post('discordVoiceLeave',{channel:discordState.voice.channel});discordState.voice=null;drawDiscordChannels();$('#dc-voice-panel')?.classList.add('hidden');}
async function discordVoiceState(){if(!discordState.voice)return;const r=await post('discordVoiceState',{channel:discordState.voice.channel});if(!r?.ok)return;discordState.voice.count=r.count;const p=$('#dc-voice-panel');p.classList.remove('hidden');p.innerHTML=`<div><b>🔊 ${esc(r.name||'Voice')}</b><span>${r.count}/4 connected</span></div><div class="dc-voice-users">${(r.members||[]).map(m=>`<span><i></i>${esc(m.name)}</span>`).join('')}</div><button id="dc-leave-voice">Leave</button>`;$('#dc-leave-voice').onclick=discordLeaveVoice;}
