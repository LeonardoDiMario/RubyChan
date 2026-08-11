/* Ruby Chan — Character detail + Jump right in */
(function(){
  'use strict';
  if(window.__rubyCharacterDetailV1) return;
  window.__rubyCharacterDetailV1 = true;

  const characters = {
    Sakura: {
      image:'https://i.pinimg.com/originals/bf/ef/23/bfef23375344609c048165a7e7ae150b.jpg',
      tags:'Cheerful • Caring • Playful',
      personality:'Sakura is cheerful, caring and playful. She keeps conversations warm and natural, enjoys light teasing, and pays close attention to the mood of the person she is talking with.',
      traits:['Cheerful','Caring','Playful']
    },
    Yuna: {
      image:'https://i.pinimg.com/564x/ab/4f/c7/ab4fc790bddb89dc9b006e1e4a9c3e2.jpg',
      tags:'Calm • Mysterious • Gentle',
      personality:'Yuna is calm, gentle and slightly mysterious. She listens carefully, responds thoughtfully and keeps a soft, composed presence.',
      traits:['Calm','Mysterious','Gentle']
    },
    Rin: {
      image:'https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/59b1c9a8-392b-4d9a-84d0-f075091ffa1b.png',
      tags:'Elegant • Quiet • Intelligent',
      personality:'Rin is elegant, quiet and intelligent. She prefers thoughtful conversations, measured replies and a composed atmosphere.',
      traits:['Elegant','Quiet','Intelligent']
    },
    Akari: {
      image:'https://i-blog.csdnimg.cn/blog_migrate/332cc1a83679e50899b6045e2bb3cece.png',
      tags:'Confident • Creative • Lively',
      personality:'Akari is confident, creative and lively. She brings energy into conversations and enjoys imaginative ideas and playful interaction.',
      traits:['Confident','Creative','Lively']
    },
    Hana: {
      image:'https://c-ssl.duitang.com/uploads/blog/202306/14/Q2SDz364f8YX0jM.jpg',
      tags:'Kind • Caring • Soft',
      personality:'Hana is kind, caring and soft-spoken. She focuses on supportive, comfortable conversations and a gentle atmosphere.',
      traits:['Kind','Caring','Soft']
    },
    Reina: {
      image:'https://c-ssl.duitang.com/uploads/blog/202305/01/20230501125015_95235.jpg',
      tags:'Elegant • Mature • Calm',
      personality:'Reina has an elegant, mature and calm personality. Her conversations feel composed, attentive and confident.',
      traits:['Elegant','Mature','Calm']
    }
  };

  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const svg = {
    characters:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.7-4 2.7-6 6.5-6s5.8 2 6.5 6"/><path d="M4 12h2M18 12h2"/></svg>',
    chat:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H11l-4.5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"/><path d="M7 11h10M7 14h6"/></svg>',
    recharge:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v6"/><path d="M8.5 6.5A7.5 7.5 0 1 0 19 9.8"/><path d="M15 6h4v4"/></svg>',
    settings:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9 18 18M18 6l-2.1 2.1M8.1 15.9 6 18"/><circle cx="12" cy="12" r="4"/></svg>'
  };

  function styles(){
    if(document.getElementById('ruby-detail-v1-style')) return;
    const s=document.createElement('style');
    s.id='ruby-detail-v1-style';
    s.textContent=`
      .ruby-home-quick-old{display:none!important}
      .ruby-jump{margin-top:4px;padding:20px;border-radius:24px;background:linear-gradient(145deg,#fff,#f7f4ff);border:1px solid rgba(85,60,130,.12);box-shadow:0 18px 45px rgba(60,40,120,.09)}
      .ruby-jump-head{margin-bottom:16px}.ruby-jump-kicker{font-size:10px;font-weight:850;letter-spacing:2px;color:#7c3aed}.ruby-jump-title{margin:5px 0 3px;font-size:23px;font-weight:800;color:#18181b}.ruby-jump-sub{font-size:12px;color:#77717f}
      .ruby-jump-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
      .ruby-jump-card{position:relative;min-height:112px;border:1px solid rgba(90,70,130,.11);border-radius:18px;background:rgba(255,255,255,.96);padding:15px;text-align:left;cursor:pointer;transition:transform .18s,border-color .18s,box-shadow .18s;box-shadow:0 7px 20px rgba(30,20,50,.035)}
      .ruby-jump-card:hover{transform:translateY(-2px);border-color:rgba(124,58,237,.28);box-shadow:0 14px 30px rgba(60,40,120,.10)}
      .ruby-jump-icon{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;border:1px solid rgba(124,58,237,.18);background:linear-gradient(145deg,#fff,#f4efff);color:#6d28d9;margin-bottom:11px}.ruby-jump-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
      .ruby-jump-name{display:block;font-size:15px;font-weight:800;color:#18181b}.ruby-jump-desc{display:block;margin-top:4px;font-size:10.5px;color:#85808c;line-height:1.4}.ruby-jump-arrow{position:absolute;right:13px;bottom:12px;color:#8b5cf6;font-size:16px}
      .ruby-character-list-hidden{display:none!important}
      .ruby-character-detail{position:relative;min-height:calc(100vh - 190px);padding:4px 2px 30px;animation:rubyDetailIn .2s ease}.ruby-character-back{position:absolute;top:0;left:0;width:38px;height:38px;border-radius:12px;border:1px solid rgba(60,60,67,.12);background:rgba(255,255,255,.92);color:#3f3f46;font-size:22px;line-height:1;cursor:pointer;box-shadow:0 7px 20px rgba(0,0,0,.06)}
      .ruby-character-detail-main{padding-top:52px;text-align:center}.ruby-character-detail-image{width:min(270px,70vw);height:min(330px,82vw);object-fit:cover;object-position:center top;border-radius:26px;display:block;margin:0 auto 18px;box-shadow:0 18px 45px rgba(35,20,55,.16);border:1px solid rgba(124,58,237,.14)}
      .ruby-character-detail h2{font-size:28px;color:#18181b;margin-bottom:5px}.ruby-character-tags{font-size:12px;color:#6d28d9;font-weight:750;letter-spacing:.2px;margin-bottom:20px}
      .ruby-personality{max-width:560px;margin:0 auto 20px;padding:18px;border-radius:19px;background:linear-gradient(145deg,#fff,#faf7ff);border:1px solid rgba(124,58,237,.12);box-shadow:0 9px 28px rgba(60,40,120,.06);text-align:left}.ruby-personality-label{font-size:10px;letter-spacing:1.5px;font-weight:850;color:#8b5cf6;margin-bottom:8px}.ruby-personality p{font-size:13px;line-height:1.65;color:#5f5968}
      .ruby-character-chat{width:100%;max-width:560px;padding:13px 18px;border:0;border-radius:13px;background:linear-gradient(135deg,#7c3aed,#9b5cf6);color:#fff;font-size:14px;font-weight:850;cursor:pointer;box-shadow:0 10px 24px rgba(124,58,237,.22)}
      @keyframes rubyDetailIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
      @media(max-width:520px){.ruby-jump-grid{grid-template-columns:1fr}.ruby-jump{padding:16px}.ruby-character-detail-image{height:310px}}
    `;
    document.head.appendChild(s);
  }

  function installJump(){
    const home=document.getElementById('page-home');
    if(!home) return;
    const hero=home.querySelector('.hero');
    const old=home.querySelector('.quick-access');
    if(old){old.classList.add('ruby-home-quick-old')}
    if(home.querySelector('.ruby-jump')) return;
    const box=document.createElement('section');
    box.className='ruby-jump';
    box.innerHTML=`<div class="ruby-jump-head"><span class="ruby-jump-kicker">JUMP RIGHT IN</span><div class="ruby-jump-title">Quick Access</div><div class="ruby-jump-sub">Choose where you want to go.</div></div><div class="ruby-jump-grid">
      <button class="ruby-jump-card" type="button" data-jump="characters"><span class="ruby-jump-icon">${svg.characters}</span><span class="ruby-jump-name">Characters</span><span class="ruby-jump-desc">Explore your companions</span><span class="ruby-jump-arrow">→</span></button>
      <button class="ruby-jump-card" type="button" data-jump="chat"><span class="ruby-jump-icon">${svg.chat}</span><span class="ruby-jump-name">Chat</span><span class="ruby-jump-desc">Open your conversation history</span><span class="ruby-jump-arrow">→</span></button>
      <button class="ruby-jump-card" type="button" data-jump="recharge"><span class="ruby-jump-icon">${svg.recharge}</span><span class="ruby-jump-name">Recharge</span><span class="ruby-jump-desc">Manage your balance</span><span class="ruby-jump-arrow">→</span></button>
      <button class="ruby-jump-card" type="button" data-jump="settings"><span class="ruby-jump-icon">${svg.settings}</span><span class="ruby-jump-name">Settings</span><span class="ruby-jump-desc">Personalize your account</span><span class="ruby-jump-arrow">→</span></button>
    </div>`;
    (hero?.parentNode||home).appendChild(box);
    box.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>{
      const p=b.dataset.jump;
      if(typeof window.showPage==='function') window.showPage(p);
      else if(typeof window.switchPage==='function') window.switchPage(p);
      if(p==='chat' && typeof window.renderChatHistory==='function') setTimeout(window.renderChatHistory,0);
    }));
  }

  function detail(name){
    const data=characters[name]||characters.Sakura;
    const page=document.getElementById('page-characters');
    if(!page) return;
    page.dataset.detail=name;
    const old=page.querySelector('.characters-grid');
    if(old) old.classList.add('ruby-character-list-hidden');
    page.querySelectorAll('.section-title,.section-subtitle,#characterSearch,.ruby-platform-search').forEach(el=>el.style.display='none');
    let d=page.querySelector('.ruby-character-detail');
    if(!d){d=document.createElement('div');d.className='ruby-character-detail';page.appendChild(d)}
    d.innerHTML=`<button type="button" class="ruby-character-back" aria-label="Back">‹</button><div class="ruby-character-detail-main"><img class="ruby-character-detail-image" src="${esc(data.image)}" alt="${esc(name)}"><h2>${esc(name)}</h2><div class="ruby-character-tags">${esc(data.tags)}</div><div class="ruby-personality"><div class="ruby-personality-label">PERSONALITY</div><p>${esc(data.personality)}</p></div><button type="button" class="ruby-character-chat">Chat</button></div>`;
    d.querySelector('.ruby-character-back').onclick=back;
    d.querySelector('.ruby-character-chat').onclick=()=>{
      if(typeof window.startChat==='function') window.startChat(name); else if(typeof window.openTelegramChat==='function') window.openTelegramChat(name);
      else window.location.href='https://t.me/Rubby_Chan_Bot?start='+encodeURIComponent('character_'+name);
    };
    page.scrollTop=0;
  }

  function back(){
    const page=document.getElementById('page-characters');
    if(!page)return;
    page.removeAttribute('data-detail');
    page.querySelector('.ruby-character-detail')?.remove();
    page.querySelector('.characters-grid')?.classList.remove('ruby-character-list-hidden');
    page.querySelectorAll('.section-title,.section-subtitle,#characterSearch,.ruby-platform-search').forEach(el=>el.style.display='');
  }

  function installCharacterCards(){
    const grid=document.querySelector('#page-characters .characters-grid');
    if(!grid)return;
    grid.querySelectorAll('.character-card').forEach(card=>{
      const name=card.querySelector('h3')?.textContent?.trim();
      if(!name || card.dataset.rubyDetailBound==='1')return;
      card.dataset.rubyDetailBound='1';
      card.addEventListener('click',e=>{
        if(e.target.closest('.chat-btn')) return;
        detail(name);
      });
    });
  }

  function boot(){styles();installJump();installCharacterCards();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
  const mo=new MutationObserver(()=>{installJump();installCharacterCards()});
  setTimeout(()=>mo.disconnect(),20000); mo.observe(document.body,{childList:true,subtree:true});
})();
