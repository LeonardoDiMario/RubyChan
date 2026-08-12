(()=>{
  const boot=()=>{
    if(document.documentElement.dataset.rubyLucidOverwrite==='1') return;
    document.documentElement.dataset.rubyLucidOverwrite='1';

    // IN-PLACE OVERWRITE ONLY: keep the existing DOM, IDs and backend hooks.
    const text=(sel,value)=>{const el=document.querySelector(sel);if(el&&value)el.textContent=value};
    text('.eyebrow','Private AI Companion');
    const hero=document.querySelector('.hero h1');
    if(hero) hero.innerHTML='<span>Your private AI companions.</span>';
    const heroP=document.querySelector('.hero p');
    if(heroP) heroP.textContent='Choose someone to talk to and keep every conversation in one private space.';

    const rename=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
    rename('homeCharacters','Meet Characters');
    rename('homeHistory','Open History');
    rename('navChat','History');

    // Make the existing shortcut grid feel like the primary product sections.
    const cards=[
      ['cardCharacters','Characters','Meet your AI companions.'],
      ['cardHistory','History','Continue your previous conversations.'],
      ['cardRecharge','Energy & Gems','Recharge when you need more.'],
      ['cardSettings','Settings','Personalize your experience.']
    ];
    cards.forEach(([id,title,desc])=>{const el=document.getElementById(id);if(!el)return;const h=el.querySelector('h3'),p=el.querySelector('p');if(h)h.textContent=title;if(p)p.textContent=desc});

    // Existing character cards: presentation only.
    const updateCharacters=()=>document.querySelectorAll('#characterGrid .char').forEach(card=>{
      card.classList.add('lucid-character-card');
      const img=card.querySelector('img');if(img)img.referrerPolicy='no-referrer';
      const badge=card.querySelector('.badge');if(badge&&/available/i.test(badge.textContent||''))badge.textContent='Available';
    });
    updateCharacters();
    new MutationObserver(updateCharacters).observe(document.getElementById('characterGrid')||document.body,{childList:true,subtree:true});

    // Keep one navigation instance and synchronize only the existing active state.
    const nav=document.querySelector('.nav');
    if(nav){
      const sync=()=>{
        const active=[...document.querySelectorAll('.view.active')][0];
        nav.querySelectorAll('button').forEach(b=>{
          const id={home:'navHome',characters:'navCharacters',chat:'navChat',settings:'navSettings'}[active?.id];
          b.classList.toggle('active',b.id===id);
        });
      };
      document.addEventListener('click',e=>{if(e.target.closest('.nav button'))setTimeout(sync,30)});
      new MutationObserver(sync).observe(document.querySelector('.app')||document.body,{subtree:true,attributes:true,attributeFilter:['class']});
      sync();
    }

    // Existing Daily Bonus remains a single floating action.
    const bonus=document.getElementById('bonus');
    if(bonus) bonus.setAttribute('aria-label','Daily Bonus');
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();