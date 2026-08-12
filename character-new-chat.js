(()=>{
  if(window.__rubyCharacterPopupV1)return;
  window.__rubyCharacterPopupV1=true;

  const URL='https://hcbajvladlvhklelbxdr.supabase.co';
  const KEY='sb_publishable_eKKXyB0rc7QUwTbdi8Xw_t0n27eIj';
  const db=window.supabase?.createClient?.(URL,KEY);
  const TG=window.Telegram?.WebApp||null;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));

  const css=document.createElement('style');
  css.id='ruby-character-popup-css';
  css.textContent=`
    #rubyCharacterPopup{position:fixed;inset:0;z-index:16000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(5,3,9,.72);backdrop-filter:blur(14px)}
    #rubyCharacterPopup.open{display:flex}
    .rcp-card{width:min(390px,100%);overflow:hidden;border:1px solid rgba(242,182,216,.18);border-radius:23px;background:linear-gradient(180deg,#24182b,#120c17);box-shadow:0 32px 90px rgba(0,0,0,.6);color:#f7eef6}
    .rcp-hero{display:grid;grid-template-columns:86px 1fr;gap:13px;align-items:center;padding:15px;border-bottom:1px solid rgba(242,182,216,.12)}
    .rcp-avatar{width:86px;height:86px;border-radius:18px;object-fit:cover;background:#17111e;border:1px solid rgba(255,255,255,.1)}
    .rcp-name{font-size:20px;font-weight:950;color:#fff2fa}.rcp-tag{display:inline-block;margin-top:6px;padding:4px 7px;border:1px solid rgba(242,182,216,.17);border-radius:999px;color:#efb4d1;font-size:8px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
    .rcp-body{padding:15px}.rcp-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#dca2bf;font-weight:950;margin-bottom:6px}.rcp-copy{margin:0;color:#cdb8c6;font-size:10px;line-height:1.7;white-space:pre-line}.rcp-actions{display:flex;gap:8px;margin-top:15px}.rcp-btn{flex:1;border:0;border-radius:999px;padding:11px 13px;font-weight:900;font-size:10px;font-style:normal;cursor:pointer}.rcp-close{background:#211622;color:#d8bfcc;border:1px solid rgba(242,182,216,.14)}.rcp-new{background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff}.rcp-new[disabled]{opacity:.55;cursor:not-allowed}
  `;
  document.head.appendChild(css);

  const root=document.createElement('div');
  root.id='rubyCharacterPopup';
  root.innerHTML=`<div class="rcp-card" role="dialog" aria-modal="true" aria-labelledby="rcpName"><div class="rcp-hero"><img id="rcpAvatar" class="rcp-avatar" alt=""><div><div id="rcpName" class="rcp-name">Character</div><span class="rcp-tag">AI Companion</span></div></div><div class="rcp-body"><div class="rcp-label">Personality</div><p id="rcpPersonality" class="rcp-copy">—</p><div class="rcp-label" style="margin-top:12px">About</div><p id="rcpAbout" class="rcp-copy">—</p><div class="rcp-actions"><button id="rcpClose" class="rcp-btn rcp-close" type="button">CLOSE</button><button id="rcpNew" class="rcp-btn rcp-new" type="button">NEW CHAT</button></div></div></div>`;
  document.body.appendChild(root);

  let selected=null;
  const close=()=>{root.classList.remove('open');document.body.style.overflow='';selected=null};
  root.querySelector('#rcpClose').onclick=close;
  root.addEventListener('click',e=>{if(e.target===root)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('open'))close()});

  const open=async id=>{
    if(!db||!id)return;
    const r=await db.from('characters').select('id,name,image_url,description,personality,backstory,speaking_style,scenario,is_premium').eq('id',id).maybeSingle();
    if(r.error||!r.data)return;
    if(r.data.is_premium){return}
    selected=r.data;
    root.querySelector('#rcpAvatar').src=r.data.image_url||('https://api.dicebear.com/9.x/adventurer/svg?seed='+encodeURIComponent(r.data.name||'Character'));
    root.querySelector('#rcpName').textContent=r.data.name||'Character';
    root.querySelector('#rcpPersonality').textContent=r.data.personality||r.data.speaking_style||'Warm, engaging and private companion.';
    root.querySelector('#rcpAbout').textContent=r.data.description||r.data.backstory||r.data.scenario||'A private AI companion ready to talk with you.';
    root.classList.add('open');document.body.style.overflow='hidden';
  };

  root.querySelector('#rcpNew').onclick=()=>{
    if(!selected)return;
    const id=selected.id;
    const chat=String(TG?.initDataUnsafe?.user?.id||new URLSearchParams(location.search).get('telegram_chat_id')||'');
    if(TG?.sendData){
      TG.sendData(JSON.stringify({type:'character_selected',character_id:id,telegram_chat_id:chat}));
      setTimeout(()=>{try{TG.close()}catch{}},250);
      return;
    }
    if(TG?.openTelegramLink)TG.openTelegramLink('https://t.me/Rubby_Chan_Bot');
    else window.open('https://t.me/Rubby_Chan_Bot','_blank','noopener');
  };

  document.addEventListener('click',async e=>{
    const card=e.target.closest?.('#characterGrid .char');
    if(!card)return;
    const btn=card.querySelector('.choose');
    const id=btn?.dataset?.id;
    if(!id)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    await open(id);
  },true);
})();
