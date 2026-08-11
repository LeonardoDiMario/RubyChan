/* Ruby Chan — Telegram-only chat mode */
(function(){
  'use strict';

  const BOT = String(window.RUBY_TELEGRAM_BOT_USERNAME || 'Rubby_Chan_Bot').replace(/^@/, '');
  const db = window.supabaseClient || window.rubySupabase || null;

  function openTelegram(characterId){
    const payload = characterId ? `character_${characterId}` : '';
    window.location.href = `https://t.me/${BOT}${payload ? `?start=${encodeURIComponent(payload)}` : ''}`;
  }

  async function openTelegramForCharacter(characterName){
    if(!db || !characterName){ openTelegram(); return; }
    try{
      const {data,error}=await db.from('characters').select('id').eq('name',characterName).maybeSingle();
      if(!error && data?.id){ openTelegram(data.id); return; }
    }catch(e){ console.warn('Telegram character lookup failed',e); }
    openTelegram();
  }

  function installStartChat(){
    window.startChat=function(character){
      openTelegramForCharacter(String(character||'').trim());
    };
  }

  function installChatNav(){
    const nav=document.getElementById('nav-chat');
    if(!nav || nav.dataset.telegramOnly==='1') return;
    nav.dataset.telegramOnly='1';
    nav.onclick=function(e){ e.preventDefault(); e.stopPropagation(); openTelegram(); };
  }

  async function renderTelegramHistory(){
    const list=document.getElementById('chatHistoryList');
    if(!list || !db) return;
    try{
      const {data:{session}}=await db.auth.getSession();
      if(!session?.user){
        list.innerHTML='<div class="chat-empty">💬<br><span>Log in to view your Telegram chat history.</span></div>';
        return;
      }
      const {data:rows,error}=await db.from('conversations')
        .select('id,character_id,title,updated_at,source')
        .eq('user_id',session.user.id)
        .eq('source','telegram')
        .order('updated_at',{ascending:false})
        .limit(100);
      if(error) throw error;
      list.innerHTML='';
      if(!rows?.length){
        list.innerHTML='<div class="chat-empty">💬<br><span>No Telegram chat history yet.</span></div>';
        return;
      }
      for(const c of rows){
        const row=document.createElement('button');
        row.type='button';
        row.className='chat-history-item ruby-unified-history';
        row.innerHTML=`<div class="chat-history-avatar" style="display:flex;align-items:center;justify-content:center;background:#229ED9;font-size:25px">✈️</div><div class="chat-history-info"><div class="chat-history-name">${escapeHtml(c.title||c.character_id||'Telegram Chat')}</div><div class="chat-history-preview">Telegram conversation</div></div><span class="chat-history-time">${new Date(c.updated_at).toLocaleDateString()}</span>`;
        row.onclick=()=>openTelegramForCharacter(c.character_id);
        list.appendChild(row);
      }
    }catch(e){
      console.error('Telegram history error',e);
      list.innerHTML='<div class="chat-empty">⚠️<br><span>Could not load Telegram chat history.</span></div>';
    }
  }

  function escapeHtml(v){
    return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  }

  function installHistory(){
    window.rubyLoadChatHistory=renderTelegramHistory;
    const nav=document.getElementById('nav-chat');
    if(nav){
      nav.title='Open Telegram';
      nav.setAttribute('aria-label','Open Telegram');
    }
    renderTelegramHistory();
  }

  function boot(){
    installStartChat();
    installChatNav();
    installHistory();
    const observer=new MutationObserver(()=>{ installStartChat(); installChatNav(); });
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),10000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
