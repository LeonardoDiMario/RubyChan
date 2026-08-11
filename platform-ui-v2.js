/* Ruby Chan — platform UI v2
   Keeps the Chat page, but makes it Telegram-history only.
   Adds character search and ability tooltips without changing the AI engine.
*/
(function(){
  'use strict';

  const BOT = String(window.RUBY_TELEGRAM_BOT_USERNAME || 'Rubby_Chan_Bot').replace(/^@/,'');
  const db = window.supabaseClient || window.rubySupabase || null;

  const CHARACTERS = {
    Sakura:{ability:'Cheerful, caring and playful. Great for warm everyday conversations.',image:'https://i.pinimg.com/originals/bf/ef/23/bfef23375344609c048165a7e7ae150b.jpg'},
    Yuna:{ability:'Calm, mysterious and gentle. Best for quiet, thoughtful conversations.',image:'https://i.pinimg.com/564x/ab/4f/c7/ab4fc790bddb89dc9b006e1e4a9c3e2.jpg'},
    Rin:{ability:'Elegant, quiet and intelligent. Good for serious and clever conversations.',image:'https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/59b1c9a8-392b-4d9a-84d0-f075091ffa1b.png'},
    Akari:{ability:'Confident, energetic and bold. Brings a lively, direct style.',image:'https://i-blog.csdnimg.cn/blog_migrate/332cc1a83679e50899b6045e2bb3cece.png'},
    Hana:{ability:'Friendly, romantic and sweet. Suited to affectionate conversations.',image:'https://c-ssl.duitang.com/uploads/blog/202306/14/Q2SDz364f8YX0jM.jpg'},
    Reina:{ability:'Cool, intelligent and composed. Strong at calm, focused conversations.',image:'https://c-ssl.duitang.com/uploads/blog/202305/01/20230501125015_95235.jpg'},
    Ruby:{ability:'Elegant, affectionate and confident. Premium character.',image:'https://api.dicebear.com/9.x/adventurer/svg?seed=Ruby&backgroundColor=e9d5ff&hairColor=a855f7'},
    Velvet:{ability:'Mysterious, teasing and intelligent. Premium character.',image:'https://api.dicebear.com/9.x/adventurer/svg?seed=Velvet&backgroundColor=fce7f3&hairColor=ec4899'},
    Celeste:{ability:'Sweet, dreamy and romantic. Premium character.',image:'https://api.dicebear.com/9.x/adventurer/svg?seed=Celeste&backgroundColor=dbeafe&hairColor=3b82f6'},
    Seraphine:{ability:'Royal, calm and possessive. Premium character.',image:'https://api.dicebear.com/9.x/adventurer/svg?seed=Seraphine&backgroundColor=f3f4f6&hairColor=111827'}
  };

  function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}

  function telegram(character){
    const payload=character?`?start=${encodeURIComponent('character_'+character)}`:'';
    window.location.href=`https://t.me/${BOT}${payload}`;
  }

  function injectStyle(){
    if(document.getElementById('ruby-platform-v2-style')) return;
    const s=document.createElement('style');
    s.id='ruby-platform-v2-style';
    s.textContent=`
      .ruby-character-search{position:relative;margin:0 0 14px}
      .ruby-character-search input{width:100%;height:46px;border:1px solid rgba(124,58,237,.16);border-radius:14px;background:#fff;padding:0 16px 0 43px;font-size:15px;outline:none;box-shadow:0 7px 22px rgba(54,30,90,.055)}
      .ruby-character-search input:focus{border-color:rgba(124,58,237,.4);box-shadow:0 8px 24px rgba(124,58,237,.12)}
      .ruby-character-search:before{content:'⌕';position:absolute;left:15px;top:9px;font-size:24px;color:#7c3aed;z-index:1}
      .ruby-char-card{position:relative;cursor:pointer}
      .ruby-char-card .ruby-ability{position:absolute;left:10px;right:10px;bottom:10px;padding:10px 11px;border-radius:12px;background:rgba(28,20,38,.92);color:#fff;font-size:11px;line-height:1.45;text-align:left;opacity:0;transform:translateY(5px);pointer-events:none;transition:.18s;z-index:10;box-shadow:0 10px 25px rgba(0,0,0,.2)}
      .ruby-char-card:hover .ruby-ability,.ruby-char-card.show-ability .ruby-ability{opacity:1;transform:translateY(0)}
      .ruby-char-card .ruby-ability strong{display:block;color:#d8b4fe;margin-bottom:3px;font-size:10px;letter-spacing:.4px}
      .ruby-history-wrap{display:flex;flex-direction:column;gap:12px}
      .ruby-history-card{background:#fff;border:1px solid rgba(124,58,237,.14);border-radius:18px;padding:13px;box-shadow:0 8px 28px rgba(54,30,90,.055)}
      .ruby-history-head{display:flex;align-items:center;gap:12px}
      .ruby-history-avatar{width:54px;height:54px;border-radius:15px;object-fit:cover;object-position:center top;flex:0 0 54px;border:1px solid rgba(124,58,237,.15)}
      .ruby-history-name{font-size:16px;font-weight:800;color:#241b35}
      .ruby-history-meta{font-size:10px;color:#91889d;margin-top:3px}
      .ruby-history-text{margin:12px 2px 11px;padding:12px 13px;border-radius:13px;background:#f8f5fc;color:#3b3344;font-size:15px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
      .ruby-history-empty{padding:38px 16px;text-align:center;color:#8e8e93}
      .ruby-history-empty .big{font-size:32px}
      .ruby-history-empty span{display:block;margin-top:7px;font-size:13px}
      .ruby-continue{width:100%;padding:11px;border:0;border-radius:11px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:800;cursor:pointer;box-shadow:0 7px 18px rgba(124,58,237,.18)}
      .ruby-continue:active{transform:scale(.98)}
      .ruby-hidden{display:none!important}
    `;
    document.head.appendChild(s);
  }

  function setupCharacters(){
    const page=document.getElementById('page-characters');
    if(!page || page.dataset.rubyV2==='1') return;
    page.dataset.rubyV2='1';

    const subtitle=page.querySelector('.section-subtitle');
    const search=document.createElement('div');
    search.className='ruby-character-search';
    search.innerHTML='<input id="rubyCharacterSearch" type="search" autocomplete="off" placeholder="Search characters..." aria-label="Search characters">';
    if(subtitle) subtitle.insertAdjacentElement('afterend',search); else page.insertBefore(search,page.firstChild);

    const input=search.querySelector('input');
    input.addEventListener('input',()=>filterCharacters(input.value));

    page.querySelectorAll('.character-card').forEach(card=>{
      const title=card.querySelector('h3');
      if(!title) return;
      const name=title.textContent.trim();
      const ability=CHARACTERS[name]?.ability;
      if(!ability || card.querySelector('.ruby-ability')) return;
      card.classList.add('ruby-char-card');
      const tip=document.createElement('div');
      tip.className='ruby-ability';
      tip.innerHTML=`<strong>ABILITY</strong>${esc(ability)}`;
      card.appendChild(tip);
      card.addEventListener('click',e=>{
        if(e.target.closest('button')) return;
        card.classList.toggle('show-ability');
      });
    });
  }

  function filterCharacters(q){
    const term=String(q||'').trim().toLowerCase();
    document.querySelectorAll('#page-characters .character-card').forEach(card=>{
      const text=card.textContent.toLowerCase();
      card.classList.toggle('ruby-hidden',!!term && !text.includes(term));
    });
  }

  async function loadTelegramHistory(){
    const list=document.getElementById('chatHistoryList');
    if(!list || !db) return;
    const old=list;
    old.innerHTML='<div class="ruby-history-empty"><div class="big">✈️</div><span>Loading Telegram history...</span></div>';
    try{
      const {data:{session}}=await db.auth.getSession();
      if(!session?.user){
        old.innerHTML='<div class="ruby-history-empty"><div class="big">✈️</div><span>Log in to view your Telegram chat history.</span></div>';
        return;
      }
      const {data:convs,error}=await db.from('conversations').select('id,character_id,title,updated_at,source').eq('user_id',session.user.id).eq('source','telegram').order('updated_at',{ascending:false}).limit(100);
      if(error) throw error;
      if(!convs?.length){
        old.innerHTML='<div class="ruby-history-empty"><div class="big">💬</div><span>No Telegram chat history yet.</span></div>';
        return;
      }
      const ids=[...new Set(convs.map(c=>c.character_id).filter(Boolean))];
      let chars=[];
      if(ids.length){
        const r=await db.from('characters').select('id,name,image_url').in('id',ids);
        if(!r.error) chars=r.data||[];
      }
      const charMap=Object.fromEntries(chars.map(c=>[String(c.id),c]));
      const msgRes=await db.from('messages').select('conversation_id,content,created_at').in('conversation_id',convs.map(c=>c.id)).order('created_at',{ascending:false}).limit(300);
      const latest={};
      (msgRes.data||[]).forEach(m=>{if(!latest[m.conversation_id])latest[m.conversation_id]=m});

      old.classList.add('ruby-history-wrap');
      old.innerHTML='';
      convs.forEach(c=>{
        const ch=charMap[String(c.character_id)]||{};
        const name=ch.name||c.title||'Telegram Chat';
        const meta=new Date(c.updated_at).toLocaleString();
        const image=ch.image_url||CHARACTERS[name]?.image||'';
        const msg=latest[c.id]?.content||'No message preview available.';
        const card=document.createElement('div');
        card.className='ruby-history-card';
        card.innerHTML=`<div class="ruby-history-head">${image?`<img class="ruby-history-avatar" src="${esc(image)}" alt="${esc(name)}">`:'<div class="ruby-history-avatar" style="display:flex;align-items:center;justify-content:center;background:#229ED9;font-size:25px">✈️</div>'}<div><div class="ruby-history-name">${esc(name)}</div><div class="ruby-history-meta">${esc(meta)}</div></div></div><div class="ruby-history-text">${esc(msg)}</div><button type="button" class="ruby-continue">Continue Chat</button>`;
        card.querySelector('.ruby-continue').onclick=()=>telegram(name);
        old.appendChild(card);
      });
    }catch(err){
      console.error('Ruby Telegram history v2:',err);
      old.innerHTML='<div class="ruby-history-empty"><div class="big">⚠️</div><span>Could not load Telegram chat history.</span></div>';
    }
  }

  function setupChat(){
    const nav=document.getElementById('nav-chat');
    if(nav){nav.onclick=e=>{e.preventDefault();e.stopPropagation();telegram();};}
    const chat=document.getElementById('page-chat');
    if(chat && chat.dataset.rubyV2!=='1'){
      chat.dataset.rubyV2='1';
      const sub=chat.querySelector('.section-subtitle');
      if(sub) sub.textContent='Your Telegram conversations';
      const extra=chat.querySelector('.ios-card');
      if(extra) extra.remove();
    }
    window.rubyLoadChatHistory=loadTelegramHistory;
    loadTelegramHistory();
  }

  function boot(){
    injectStyle();
    setupCharacters();
    setupChat();
    window.addEventListener('rubychat:open',()=>{});
    document.addEventListener('click',()=>{
      setupCharacters();
      setupChat();
    },{passive:true});
    const observer=new MutationObserver(()=>{setupCharacters();setupChat();});
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),15000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
