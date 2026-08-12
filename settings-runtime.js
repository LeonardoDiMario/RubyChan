(()=>{
  const boot=()=>{
    if(document.documentElement.dataset.rubyLucidSingleUI==='1') return;
    document.documentElement.dataset.rubyLucidSingleUI='1';

    // Load one global visual system on the EXISTING application.
    if(!document.getElementById('ruby-lucid-overwrite-css')){
      const link=document.createElement('link');
      link.id='ruby-lucid-overwrite-css';
      link.rel='stylesheet';
      link.href='ruby-lucid-overwrite.css';
      document.head.appendChild(link);
    }

    const setText=(sel,value)=>{const el=document.querySelector(sel);if(el)el.textContent=value};
    const setButton=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};

    setText('.eyebrow','Private AI Companion');
    const hero=document.querySelector('.hero h1');
    if(hero) hero.innerHTML='<span>Your private AI companions.</span>';
    setText('.hero p','Choose someone to talk to and keep every conversation in one private space.');

    setButton('homeCharacters','Meet Characters');
    setButton('homeHistory','Open History');
    setButton('navChat','History');

    const cards=[
      ['cardCharacters','Characters','Meet your AI companions.'],
      ['cardHistory','History','Continue your previous conversations.'],
      ['cardRecharge','Energy & Gems','Recharge when you need more.'],
      ['cardSettings','Settings','Personalize your experience.']
    ];
    cards.forEach(([id,title,desc])=>{
      const el=document.getElementById(id);if(!el)return;
      el.querySelector('h3')?.replaceChildren(document.createTextNode(title));
      el.querySelector('p')?.replaceChildren(document.createTextNode(desc));
    });

    // Keep only the existing page structure. Never append replacement pages.
    document.querySelectorAll('[id="cardMemory"],[id="navMemory"],[data-page="memory"]').forEach(el=>el.remove());
    document.querySelectorAll('.memory-list').forEach(el=>{if(el.closest('#memory'))el.remove();});

    const syncNav=()=>{
      const active=document.querySelector('.view.active');
      const target={home:'navHome',characters:'navCharacters',chat:'navChat',settings:'navSettings'}[active?.id];
      document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.id===target));
    };
    syncNav();
    document.querySelector('.nav')?.addEventListener('click',()=>setTimeout(syncNav,35));
    new MutationObserver(syncNav).observe(document.querySelector('.app')||document.body,{subtree:true,attributes:true,attributeFilter:['class']});

    const decorateCharacters=()=>document.querySelectorAll('#characterGrid .char').forEach(card=>{
      card.classList.add('lucid-character-card');
      const img=card.querySelector('img');
      if(img)img.referrerPolicy='no-referrer';
    });
    decorateCharacters();
    const grid=document.getElementById('characterGrid');
    if(grid)new MutationObserver(decorateCharacters).observe(grid,{childList:true,subtree:true});

    const bonus=document.getElementById('bonus');
    if(bonus)bonus.setAttribute('aria-label','Daily Bonus');
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();