/* Ruby Chan — Unified Supabase Chat History Sync */
(function(){
  const URL='https://hcbajvladlvhklelbxdr.supabase.co';
  const KEY='sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj';
  if(!window.supabase)return;
  const db=window.supabase.createClient(URL,KEY);
  let currentUser=null;
  let historyCharacterFilter=null;
  const images={Sakura:'https://i.pinimg.com/originals/bf/ef/23/bfef23375344609c048165a7e7ae150b.jpg',Yuna:'https://i.pinimg.com/564x/ab/4f/c7/ab4fc790bddb89dc9b006e1e4a9c3e2.jpg',Rin:'https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/59b1c9a8-392b-4d9a-84d0-f075091ffa1b.png',Akari:'https://i-blog.csdnimg.cn/blog_migrate/332cc1a83679e50899b6045e2bb3cece.png',Hana:'https://c-ssl.duitang.com/uploads/blog/202306/14/Q2SDz364f8YX0jM.jpg',Reina:'https://c-ssl.duitang.com/uploads/blog/202305/01/20230501125015_95235.jpg'};

  function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  async function session(){const r=await db.auth.getSession();currentUser=r.data.session?.user||null;return currentUser}
  function loginRequired(){alert('🔐 Please log in or create an account to start chatting.');document.getElementById('rubyAuthButton')?.click()}

  async function ensureConversation(character){
    if(!currentUser||!character)return null;
    let r=await db.from('conversations').select('*').eq('user_id',currentUser.id).eq('character_id',character).order('updated_at',{ascending:false}).limit(1).maybeSingle();
    if(r.error)throw r.error;
    if(r.data)return r.data;
    r=await db.from('conversations').insert({user_id:currentUser.id,character_id:character,title:character+' Chat'}).select().single();
    if(r.error)throw r.error;
    return r.data;
  }

  async function createNewConversation(character){
    if(!currentUser||!character)return null;
    const r=await db.from('conversations').insert({user_id:currentUser.id,character_id:character,title:'New '+character}).select().single();
    if(r.error)throw r.error;
    return r.data;
  }

  async function addMessage(conversationId,role,content){
    if(!currentUser||!conversationId||!content)return false;
    const r=await db.from('messages').insert({conversation_id:conversationId,user_id:currentUser.id,role,content});
    if(r.error){console.error('Chat save failed:',r.error);return false}
    await db.from('conversations').update({updated_at:new Date().toISOString()}).eq('id',conversationId).eq('user_id',currentUser.id);
    return true;
  }

  function ensureHistoryStyle(){
    if(document.getElementById('ruby-unified-history-premium-style'))return;
    const s=document.createElement('style');s.id='ruby-unified-history-premium-style';s.textContent=`
      .ruby-unified-history{position:relative;border:1px solid rgba(124,58,237,.18)!important;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(250,245,255,.98))!important;box-shadow:0 8px 24px rgba(124,58,237,.08);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
      .ruby-unified-history:hover{transform:translateY(-1px);border-color:rgba(124,58,237,.34)!important;box-shadow:0 12px 30px rgba(124,58,237,.14)}
      .ruby-history-badges{display:flex;align-items:center;gap:5px;margin-top:4px}
      .ruby-history-badge{display:inline-flex;align-items:center;gap:3px;padding:3px 7px;border-radius:999px;background:#f3e8ff;color:#6d28d9;font-size:9px;font-weight:850;letter-spacing:.1px}
      .ruby-history-filter{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:10px 12px;border-radius:14px;background:#f8f5ff;border:1px solid rgba(124,58,237,.14);color:#6d28d9;font-size:12px;font-weight:800}
      .ruby-history-filter button{margin-left:auto;border:0;background:transparent;color:#7c3aed;font-weight:800;cursor:pointer}
      .ruby-history-actions{display:flex;align-items:center;gap:6px;margin-left:auto;flex:0 0 auto}
      .ruby-history-new-btn{border:0;border-radius:10px;padding:7px 9px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:10px;font-weight:850;cursor:pointer;white-space:nowrap;box-shadow:0 5px 14px rgba(124,58,237,.18)}
      .ruby-new-chat-btn{margin-left:auto;flex:0 0 auto;border:0;border-radius:12px;padding:8px 10px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:11px;font-weight:800;cursor:pointer;box-shadow:0 5px 14px rgba(124,58,237,.20)}
      .ruby-new-chat-btn:active,.ruby-history-new-btn:active{transform:scale(.96)}
      .ruby-new-chat-btn:disabled{opacity:.55;cursor:default}
    `;document.head.appendChild(s);
  }

  function ensureNewChatButton(){
    ensureHistoryStyle();
    const head=document.querySelector('#rubyKindroidChat .rk-head');
    if(!head || head.querySelector('#rubyNewChatBtn'))return;
    const btn=document.createElement('button');
    btn.id='rubyNewChatBtn';btn.type='button';btn.className='ruby-new-chat-btn';btn.textContent='＋ New';
    btn.setAttribute('aria-label','Start a new chat with this character');
    btn.addEventListener('click',startNewChat);head.appendChild(btn);
  }

  async function startNewChat(){
    if(!currentUser)return loginRequired();
    const character=window.rubyCurrentCharacter;if(!character)return;
    const btn=document.getElementById('rubyNewChatBtn');if(btn)btn.disabled=true;
    try{
      const c=await createNewConversation(character);
      window.rubyCurrentConversation=c?.id||null;window.rubyChatMessages=[];historyCharacterFilter=null;
      switchPage('chat');
      window.dispatchEvent(new CustomEvent('rubychat:open',{detail:{character,conversation:c,messages:[]}}));
      await loadHistory();
    }catch(e){console.error('New chat failed:',e);alert('Could not start a new chat. Please try again.');}
    finally{if(btn)btn.disabled=false;}
  }

  async function loadHistory(){
    if(!currentUser)return;
    const list=document.getElementById('chatHistoryList');if(!list)return;
    ensureHistoryStyle();
    let q=db.from('conversations').select('id,character_id,title,updated_at').eq('user_id',currentUser.id).order('updated_at',{ascending:false}).limit(100);
    if(historyCharacterFilter)q=q.eq('character_id',historyCharacterFilter);
    const r=await q;
    if(r.error){console.error('History load failed:',r.error);return}
    list.innerHTML='';

    if(historyCharacterFilter){
      const filter=document.createElement('div');filter.className='ruby-history-filter';
      filter.innerHTML=`💜 ${esc(historyCharacterFilter)} history <button type="button">All Characters</button>`;
      filter.querySelector('button').onclick=function(){historyCharacterFilter=null;loadHistory();};
      list.appendChild(filter);
    }

    if(!r.data?.length){
      const empty=document.createElement('div');empty.className='chat-empty';
      empty.innerHTML=historyCharacterFilter?`💬<br><span>No ${esc(historyCharacterFilter)} history yet.</span>`:'💬<br><span>No chat history yet.</span>';
      list.appendChild(empty);return;
    }

    r.data.forEach(c=>{
      const row=document.createElement('div');row.className='chat-history-item ruby-unified-history';
      row.style.cursor='pointer';
      const title=c.title||('Chat with '+c.character_id);
      row.innerHTML=`<img class="chat-history-avatar" src="${images[c.character_id]||images.Sakura}" alt="${esc(c.character_id)}"><div class="chat-history-info"><div class="chat-history-name">${esc(title)}</div><div class="chat-history-preview">${esc(c.character_id)} • Continue this conversation</div></div><div class="ruby-history-actions"><span class="chat-history-time">${new Date(c.updated_at).toLocaleDateString()}</span><button type="button" class="ruby-history-new-btn">New ${esc(c.character_id)}</button></div>`;
      row.addEventListener('click',function(){openConversation(c);});
      row.querySelector('.ruby-history-new-btn').addEventListener('click',function(e){e.stopPropagation();window.rubyStartNewCharacterChat(c.character_id);});
      list.appendChild(row);
    });
  }

  async function openConversation(c){
    if(!currentUser)return loginRequired();
    window.rubyCurrentConversation=c.id;window.rubyCurrentCharacter=c.character_id;
    historyCharacterFilter=null;switchPage('chat');
    const r=await db.from('messages').select('role,content,created_at').eq('conversation_id',c.id).order('created_at',{ascending:true});
    if(r.error){console.error('Conversation load failed:',r.error);return}
    window.rubyChatMessages=r.data||[];ensureNewChatButton();
    window.dispatchEvent(new CustomEvent('rubychat:loaded',{detail:{character:c.character_id,conversation:c,messages:r.data||[]}}));
  }

  window.rubyStartNewCharacterChat=async function(character){
    if(!currentUser)return loginRequired();
    try{
      const c=await createNewConversation(character);
      window.rubyCurrentConversation=c?.id||null;window.rubyCurrentCharacter=character;window.rubyChatMessages=[];historyCharacterFilter=null;
      switchPage('chat');ensureNewChatButton();
      window.dispatchEvent(new CustomEvent('rubychat:open',{detail:{character,conversation:c,messages:[]}}));
      await loadHistory();
    }catch(e){console.error('New character chat failed:',e);alert('Could not start a new chat. Please try again.');}
  };

  window.rubyShowCharacterHistory=async function(character){
    if(!currentUser)return loginRequired();
    historyCharacterFilter=character;switchPage('chat');await loadHistory();
  };

  window.rubyChatSaveMessage=async function(role,content){
    if(!currentUser)return false;
    let id=window.rubyCurrentConversation;
    if(!id){const c=await ensureConversation(window.rubyCurrentCharacter||'Unknown');id=c?.id;window.rubyCurrentConversation=id}
    if(!id)return false;
    const ok=await addMessage(id,role,content);await loadHistory();return ok;
  };

  window.rubyLoadChatHistory=loadHistory;

  window.startChat=async function(character){
    if(!currentUser){loginRequired();return}
    window.rubyCurrentCharacter=character;
    try{
      const c=await ensureConversation(character);window.rubyCurrentConversation=c?.id||null;historyCharacterFilter=null;
      switchPage('chat');ensureNewChatButton();
      window.dispatchEvent(new CustomEvent('rubychat:open',{detail:{character,conversation:c}}));
    }catch(e){console.error('Start chat failed:',e);alert('Could not open this conversation. Please try again.')}
  };

  window.addEventListener('rubychat:open',()=>setTimeout(ensureNewChatButton,0));
  window.addEventListener('rubychat:loaded',()=>setTimeout(ensureNewChatButton,0));

  db.auth.onAuthStateChange((_e,s)=>{
    currentUser=s?.user||null;
    if(currentUser)setTimeout(loadHistory,100);
    else{window.rubyCurrentConversation=null;window.rubyCurrentCharacter=null;const list=document.getElementById('chatHistoryList');if(list)list.innerHTML='<div class="chat-empty" id="chatEmpty">🔐<br><span>Login to view your chat history.</span></div>'}
  });

  document.addEventListener('DOMContentLoaded',async()=>{await session();if(currentUser)loadHistory();else{const list=document.getElementById('chatHistoryList');if(list)list.innerHTML='<div class="chat-empty" id="chatEmpty">🔐<br><span>Login to view your chat history.</span></div>'}});
})();
