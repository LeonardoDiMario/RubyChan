/* Ruby Chan V2 — clean UI controller. No legacy premium catalog. */
(function(){
  'use strict';
  const pages=['home','characters','chat','recharge','settings'];
  const chars=[
    {name:'Sakura',traits:'Cheerful • Caring • Playful',image:'https://i.pinimg.com/originals/bf/ef/23/bfef23375344609c048165a7e7ae150b.jpg'},
    {name:'Yuna',traits:'Calm • Mysterious • Gentle',image:'https://i.pinimg.com/564x/ab/4f/c7/ab4fc790bddb89dc9b006e1e4a9c3e2.jpg'},
    {name:'Rin',traits:'Elegant • Quiet • Intelligent',image:'https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/59b1c9a8-392b-4d9a-84d0-f075091ffa1b.png'}
  ];
  function page(id){pages.forEach(p=>{const el=document.getElementById('page-'+p);if(el)el.classList.toggle('active',p===id)});document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.page===id));window.scrollTo({top:0,behavior:'smooth'});}
  window.switchPage=page;
  function render(){
    const home=document.getElementById('page-home');
    if(home)home.innerHTML='<div class="hero"><h2>Welcome</h2><p>Your private AI character platform.</p><div class="quick-grid"><button data-go="characters">Characters</button><button data-go="chat">Chat</button><button data-go="recharge">Recharge</button><button data-go="settings">Settings</button></div></div>';
    const c=document.getElementById('page-characters');
    if(c)c.innerHTML='<div class="detail-back" id="charBack">‹ Back</div><h2 class="section-title">Characters</h2><div class="character-search-wrap"><input id="v2CharacterSearch" class="character-search" placeholder="Search characters…" autocomplete="off"></div><div id="v2CharacterGrid" class="characters-grid"></div>';
    const chat=document.getElementById('page-chat');if(chat)chat.innerHTML='<h2 class="section-title">Chat</h2><div class="empty-state">Your Telegram conversations will appear here.</div>';
    const r=document.getElementById('page-recharge');if(r)r.innerHTML='<h2 class="section-title">Recharge</h2><div class="empty-state">Recharge options will be added later.</div>';
    const s=document.getElementById('page-settings');if(s)s.innerHTML='<h2 class="section-title">Settings</h2><div class="empty-state">Account and platform settings.</div>';
    draw(chars);
    document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>page(b.dataset.go));
    const input=document.getElementById('v2CharacterSearch');if(input)input.oninput=()=>draw(chars.filter(x=>(x.name+' '+x.traits).toLowerCase().includes(input.value.toLowerCase())));
  }
  function draw(list){const g=document.getElementById('v2CharacterGrid');if(!g)return;g.innerHTML=list.map((x,i)=>`<article class="character-card v2-card" data-i="${i}"><img class="avatar-img" src="${x.image}" alt="${x.name}"><h3>${x.name}</h3><p>${x.traits}</p><button class="chat-btn">Chat</button></article>`).join('');g.querySelectorAll('.v2-card').forEach((el,i)=>el.onclick=e=>{if(e.target.classList.contains('chat-btn'))return;detail(list[i]);});}
  function detail(x){const c=document.getElementById('page-characters');if(!c)return;c.innerHTML=`<div class="detail-back" id="charBack">‹ Back</div><div class="character-detail"><img class="detail-avatar" src="${x.image}" alt="${x.name}"><h2>${x.name}</h2><p class="detail-traits">${x.traits}</p><button class="chat-btn detail-chat">Chat</button><div class="personality"><strong>Personality</strong><p>${x.traits}</p></div></div>`;document.getElementById('charBack').onclick=render;}
  document.addEventListener('DOMContentLoaded',()=>{render();page('home');document.dispatchEvent(new Event('ruby:v2-ready'));});
})();
