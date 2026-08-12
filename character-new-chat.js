(()=>{
  if(window.__rubyCharacterPopupV3)return;
  window.__rubyCharacterPopupV3=true;

  const SUPABASE_URL='https://hcbajvladlvhklelbxdr.supabase.co';
  const SUPABASE_KEY='sb_publishable_eKKXyB0rc7QUwTbdi8Xw_t0n27eIj';
  const TG=window.Telegram?.WebApp||null;
  const db=window.supabase?.createClient?.(SUPABASE_URL,SUPABASE_KEY)||null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const style=document.createElement('style');
  style.id='ruby-character-popup-v3-css';
  style.textContent=`
    #rubyCharacterPopup{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(4,2,8,.80);backdrop-filter:blur(14px)}
    #rubyCharacterPopup.open{display:flex!important}
    #rubyCharacterPopup .rcp-card{width:min(410px,100%);max-height:88vh;overflow:auto;border:1px solid rgba(242,182,216,.20);border-radius:24px;background:linear-gradient(180deg,#26192e,#120b16);box-shadow:0 34px 100px rgba(0,0,0,.68);color:#f7eef6}
    #rubyCharacterPopup .rcp-hero{display:grid;grid-template-columns:92px 1fr;gap:14px;align-items:center;padding:16px;border-bottom:1px solid rgba(242,182,216,.11)}
    #rubyCharacterPopup .rcp-avatar{width:92px;height:92px;border-radius:18px;object-fit:cover;background:#18101f;border:1px solid rgba(255,255,255,.10)}
    #rubyCharacterPopup .rcp-name{font-size:21px;font-weight:950;color:#fff3fa}
    #rubyCharacterPopup .rcp-tag{display:inline-block;margin-top:7px;padding:4px 8px;border:1px solid rgba(242,182,216,.17);border-radius:999px;color:#efb4d1;font-size:8px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
    #rubyCharacterPopup .rcp-body{padding:16px}
    #rubyCharacterPopup .rcp-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#dca2bf;font-weight:950;margin-bottom:7px}
    #rubyCharacterPopup .rcp-copy{margin:0;color:#ccb7c5;font-size:11px;line-height:1.7;white-space:pre-line}
    #rubyCharacterPopup .rcp-actions{display:flex;gap:8px;margin-top:17px}
    #rubyCharacterPopup .rcp-btn{flex:1;border:0;border-radius:999px;padding:12px 14px;font-weight:900;font-size:10px;font-style:normal;cursor:pointer}
    #rubyCharacterPopup .rcp-close{background:#221523;color:#dbc3d0;border:1px solid rgba(242,182,216,.14)}
    #rubyCharacterPopup .rcp-new{background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff}
    #rubyCharacterPopup .rcp-new:disabled{opacity:.55;cursor:not-allowed}
    #rubyCharacterPopup .rcp-status{margin-top:8px;color:#8f7e8d;font-size:9px}
  `;
  document.head.appendChild(style);

  const root=document.createElement('div');
  root.id='rubyCharacterPopup';
  root.innerHTML=`
    <div class="rcp-card" role="dialog" aria-modal="true" aria-labelledby="rcpName">
      <div class="rcp-hero">
        <img id="rcpAvatar" class="rcp-avatar" alt="Character">
        <div>
          <div id="rcpName" class="rcp-name">Character</div>
          <span class="rcp-tag">AI Companion</span>
        </div>
      </div>
      <div class="rcp-body">
        <div class="rcp-label">Personality</div>
        <p id="rcpPersonality" class="rcp-copy">Loading personality…</p>
        <div class="rcp-label" style="margin-top:14px">About</div>
        <p id="rcpAbout" class="rcp-copy">Loading character details…</p>
        <div id="rcpStatus" class="rcp-status"></div>
        <div class="rcp-actions">
          <button id="rcpClose" class="rcp-btn rcp-close" type="button">CLOSE</button>
          <button id="rcpNew" class="rcp-btn rcp-new" type="button">NEW CHAT</button>
        </div>
      </div>
    </div>`;

  function mount(){
    if(!document.body)return;
    if(!document.getElementById('rubyCharacterPopup'))document.body.appendChild(root);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();

  let selected=null;

  function closePopup(){
    root.classList.remove('open');
    document.body.style.overflow='';
    selected=null;
  }

  root.querySelector('#rcpClose').addEventListener('click',closePopup);
  root.addEventListener('click',e=>{if(e.target===root)closePopup()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('open'))closePopup()});

  function fallbackCharacter(card,id){
    const name=card?.querySelector('.charname b')?.textContent?.trim()||card?.querySelector('h3')?.textContent?.trim()||'Character';
    const image=card?.querySelector('img')?.src||'';
    return {
      id,
      name,
      image_url:image,
      description:card?.querySelector('.char p')?.textContent?.trim()||'A private AI companion ready to talk with you.',
      personality:'Warm, engaging and private companion.'
    };
  }

  async function fetchCharacter(id,card){
    const fallback=fallbackCharacter(card,id);
    if(!db||!id)return fallback;
    try{
      const r=await db.from('characters').select('id,name,image_url,description,personality,backstory,speaking_style,scenario,is_premium').eq('id',id).maybeSingle();
      if(r.data)return r.data;
    }catch(e){console.warn('Ruby character fetch failed',e)}
    return fallback;
  }

  function renderCharacter(c){
    root.querySelector('#rcpAvatar').src=c.image_url||('https://api.dicebear.com/9.x/adventurer/svg?seed='+encodeURIComponent(c.name||'Character'));
    root.querySelector('#rcpName').textContent=c.name||'Character';
    root.querySelector('#rcpPersonality').textContent=c.personality||c.speaking_style||'Warm, engaging and private companion.';
    root.querySelector('#rcpAbout').textContent=c.description||c.backstory||c.scenario||'A private AI companion ready to talk with you.';
  }

  async function openCharacter(id,card){
    if(!id)return;
    const base=fallbackCharacter(card,id);
    selected=base;
    renderCharacter(base);
    root.querySelector('#rcpStatus').textContent='';
    root.querySelector('#rcpNew').disabled=false;
    root.classList.add('open');
    document.body.style.overflow='hidden';

    const c=await fetchCharacter(id,card);
    if(!selected||selected.id!==id)return;
    selected=c;
    renderCharacter(c);
  }

  async function startNewChat(){
    if(!selected?.id)return;
    const btn=root.querySelector('#rcpNew');
    btn.disabled=true;
    const payload=JSON.stringify({
      type:'character_selected',
      character_id:String(selected.id),
      telegram_chat_id:String(TG?.initDataUnsafe?.user?.id||new URLSearchParams(location.search).get('telegram_chat_id')||'')
    });

    try{
      if(TG?.sendData){
        root.querySelector('#rcpStatus').textContent='Opening Telegram…';
        TG.sendData(payload);
        setTimeout(()=>{try{TG.close()}catch{}},350);
        return;
      }
    }catch(e){console.warn('Telegram sendData failed',e)}

    // Browser fallback when the page is not running inside Telegram.
    const deepLink='https://t.me/Rubby_Chan_Bot?start=char_'+encodeURIComponent(String(selected.id));
    try{
      if(TG?.openTelegramLink){TG.openTelegramLink(deepLink);return;}
    }catch(e){console.warn('Telegram openTelegramLink failed',e)}
    window.open(deepLink,'_blank','noopener,noreferrer');
    btn.disabled=false;
  }
  root.querySelector('#rcpNew').addEventListener('click',startNewChat);

  function getCharacterIdFromCard(card){
    return card?.querySelector('.choose')?.dataset?.id||card?.dataset?.characterId||'';
  }

  // Capture clicks before the original Choose Character handler can navigate away.
  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:null;
    if(!target)return;
    if(target.closest('#rubyCharacterPopup'))return;
    const card=target.closest('#characterGrid .char');
    if(!card)return;
    const id=getCharacterIdFromCard(card);
    if(!id)return;
    e.preventDefault();
    e.stopPropagation();
    if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();
    openCharacter(id,card);
  },true);

  // Also bind dynamically-rendered cards so the popup still works after navigation/re-render.
  function bindCards(){
    const grid=document.getElementById('characterGrid');
    if(!grid)return;
    grid.querySelectorAll('.char').forEach(card=>{
      const id=getCharacterIdFromCard(card);
      if(!id||card.dataset.rubyV3Bound==='1')return;
      card.dataset.rubyV3Bound='1';
      card.style.cursor='pointer';
    });
  }

  const start=()=>{
    mount();
    bindCards();
    const grid=document.getElementById('characterGrid');
    if(grid&&!grid.dataset.rubyV3Observer){
      grid.dataset.rubyV3Observer='1';
      new MutationObserver(bindCards).observe(grid,{childList:true,subtree:true});
    }
    setTimeout(bindCards,200);
    setTimeout(bindCards,700);
    setTimeout(bindCards,1500);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
