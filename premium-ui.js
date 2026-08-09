/* Ruby Chan — Premium UI polish */
(function () {
  'use strict';

  function boot() {
    if (document.getElementById('ruby-premium-ui')) return;

    const style = document.createElement('style');
    style.id = 'ruby-premium-ui';
    style.textContent = `
      :root{
        --ruby:#7c3aed;
        --ruby2:#a855f7;
        --ruby3:#c084fc;
        --ruby-soft:#f5f0ff;
        --ruby-border:rgba(124,58,237,.14);
        --ruby-shadow:0 14px 40px rgba(72,35,130,.10);
      }

      body{background:#f7f5fb!important}
      .app{background:linear-gradient(180deg,#faf9ff 0%,#f6f3fb 100%)!important}
      header{
        height:72px!important;
        padding:10px 16px!important;
        background:rgba(255,255,255,.82)!important;
        border-bottom:1px solid var(--ruby-border)!important;
        box-shadow:0 4px 24px rgba(60,30,110,.05)!important;
      }
      .logo{
        color:var(--ruby)!important;
        font-size:26px!important;
        letter-spacing:-1.2px!important;
        text-shadow:0 2px 18px rgba(124,58,237,.18);
      }
      .balance-area{gap:8px!important}
      .balance{
        height:38px!important;
        padding:0 12px!important;
        border-radius:19px!important;
        background:linear-gradient(180deg,#fff,#f8f4ff)!important;
        border:1px solid var(--ruby-border)!important;
        box-shadow:0 5px 16px rgba(124,58,237,.08)!important;
        color:#4c1d95!important;
      }
      .plus-btn{background:linear-gradient(135deg,var(--ruby),var(--ruby2))!important;box-shadow:0 5px 15px rgba(124,58,237,.28)!important}
      #rubyAuthButton{background:linear-gradient(135deg,var(--ruby),var(--ruby2))!important;box-shadow:0 7px 18px rgba(124,58,237,.22)!important;border-radius:13px!important}

      .content-container{padding:20px 16px 104px!important}
      .hero{
        position:relative!important;
        overflow:hidden!important;
        padding:26px!important;
        border-radius:26px!important;
        background:radial-gradient(circle at 90% 0%,rgba(192,132,252,.45),transparent 38%),linear-gradient(135deg,#f0e9ff,#fff 58%,#f7efff)!important;
        border:1px solid rgba(124,58,237,.14)!important;
        box-shadow:var(--ruby-shadow)!important;
      }
      .hero:after{content:'✦';position:absolute;right:22px;top:16px;font-size:70px;color:rgba(124,58,237,.08);transform:rotate(15deg)}
      .hero h2{color:#6d28d9!important;font-size:28px!important;letter-spacing:-.8px}
      .hero p{color:#6b6477!important}

      .section-title{font-size:21px!important;letter-spacing:-.3px;color:#241b35!important}
      .section-subtitle{color:#91889d!important}
      .character-card,.ios-card,.package,.plan-card,.chat-history-item{
        border:1px solid var(--ruby-border)!important;
        box-shadow:0 8px 28px rgba(54,30,90,.055)!important;
        transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease!important;
      }
      .character-card:hover,.package:hover,.plan-card:hover,.chat-history-item:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(54,30,90,.10)!important;border-color:rgba(124,58,237,.24)!important}
      .avatar-img{border-color:rgba(124,58,237,.28)!important;box-shadow:0 8px 22px rgba(124,58,237,.16)!important}
      .chat-btn,.buy-btn,.primary-btn{background:linear-gradient(135deg,var(--ruby),var(--ruby2))!important;box-shadow:0 7px 18px rgba(124,58,237,.18)!important}
      .wallet-box{background:radial-gradient(circle at 90% 0%,rgba(255,255,255,.22),transparent 34%),linear-gradient(135deg,#6d28d9,#a855f7)!important;box-shadow:0 16px 34px rgba(109,40,217,.22)!important}
      .plan-card.premium{border:1.5px solid rgba(124,58,237,.40)!important;background:linear-gradient(180deg,#fff,#faf5ff)!important;box-shadow:0 14px 36px rgba(124,58,237,.12)!important}
      .plan-card h3,.price{color:#6d28d9!important}
      .row-icon{background:#f1eaff!important;color:#6d28d9!important}
      .ios-row:active{background:#f4effb!important}

      #rubyPremiumMark{
        display:inline-flex;align-items:center;gap:5px;margin-left:7px;padding:4px 8px;border-radius:999px;
        background:linear-gradient(135deg,#f3e8ff,#ede9fe);color:#6d28d9;font-size:9px;font-weight:800;letter-spacing:.5px;vertical-align:middle;
      }

      #rubyGiftFloat{
        position:fixed;right:18px;bottom:86px;width:58px;height:58px;border-radius:50%;z-index:9990;
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        background:linear-gradient(145deg,#7c3aed,#c084fc);color:#fff;font-size:25px;
        border:3px solid rgba(255,255,255,.9);box-shadow:0 10px 30px rgba(124,58,237,.35),0 0 0 7px rgba(124,58,237,.08);
        animation:rubyGiftPulse 2.2s infinite;
      }
      #rubyGiftFloat:active{transform:scale(.91)}
      #rubyGiftFloat small{position:absolute;right:-2px;top:-3px;background:#ff3b30;color:#fff;border-radius:10px;padding:2px 5px;font-size:8px;font-weight:900}
      @keyframes rubyGiftPulse{0%,100%{box-shadow:0 10px 30px rgba(124,58,237,.35),0 0 0 7px rgba(124,58,237,.08)}50%{box-shadow:0 12px 34px rgba(124,58,237,.45),0 0 0 12px rgba(124,58,237,0)}}

      #rubyGiftModal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:22px;background:rgba(25,14,40,.45);backdrop-filter:blur(8px)}
      #rubyGiftModal.show{display:flex}
      .ruby-gift-box{width:min(360px,100%);padding:28px;border-radius:28px;text-align:center;background:linear-gradient(180deg,#fff,#faf5ff);border:1px solid rgba(255,255,255,.8);box-shadow:0 30px 80px rgba(30,15,50,.28)}
      .ruby-gift-icon{font-size:58px;margin-bottom:8px}
      .ruby-gift-box h3{font-size:22px;color:#3b2555;margin-bottom:6px}
      .ruby-gift-box p{color:#8b8196;font-size:13px;line-height:1.5;margin-bottom:18px}
      #rubyGiftClaim{width:100%;padding:13px;border:0;border-radius:14px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:800;cursor:pointer;box-shadow:0 9px 22px rgba(124,58,237,.25)}
      #rubyGiftClose{margin-top:9px;width:100%;padding:11px;border:0;border-radius:14px;background:#f1edf6;color:#6b6477;font-weight:700;cursor:pointer}

      @media(max-width:520px){
        header{padding-left:13px!important;padding-right:10px!important}
        .logo{font-size:23px!important}
        .content-container{padding-left:12px!important;padding-right:12px!important}
        .hero{padding:22px!important;border-radius:23px!important}
        #rubyGiftFloat{right:14px;bottom:80px}
      }
    `;
    document.head.appendChild(style);

    const gift = document.createElement('button');
    gift.id = 'rubyGiftFloat';
    gift.type = 'button';
    gift.setAttribute('aria-label','Daily gift');
    gift.innerHTML = '🎁<small>+25</small>';
    document.body.appendChild(gift);

    const modal = document.createElement('div');
    modal.id = 'rubyGiftModal';
    modal.innerHTML = `<div class="ruby-gift-box"><div class="ruby-gift-icon">🎁</div><h3>Daily Energy Gift</h3><p>Come back every day and claim your free energy bonus.</p><button id="rubyGiftClaim" type="button">Claim +25 Energy</button><button id="rubyGiftClose" type="button">Maybe later</button></div>`;
    document.body.appendChild(modal);

    gift.onclick = () => modal.classList.add('show');
    modal.querySelector('#rubyGiftClose').onclick = () => modal.classList.remove('show');
    modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('show'); });

    // UI-only gift state. Backend claiming can be connected without changing the premium UI.
    const key = 'rubychan_daily_gift_ui_v1';
    const today = new Date().toISOString().slice(0,10);
    if (localStorage.getItem(key) === today) gift.style.display = 'none';
    modal.querySelector('#rubyGiftClaim').onclick = () => {
      localStorage.setItem(key, today);
      gift.style.display = 'none';
      modal.classList.remove('show');
      window.dispatchEvent(new CustomEvent('rubychan:daily-gift-claimed',{detail:{energy:25}}));
    };

    // Keep the gift visible while navigating pages; hide only on the actual chat overlay.
    window.addEventListener('rubychat:open', () => { gift.style.display='none'; });
    document.addEventListener('click', () => {
      const chat = document.getElementById('rubyKindroidChat');
      if(chat && chat.classList.contains('open')) gift.style.display='none';
      else if(localStorage.getItem(key) !== today) gift.style.display='flex';
    }, {passive:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
