(()=>{
  const boot=()=>{
    if(document.documentElement.dataset.rubyLucidSingleUI==='1') return;
    document.documentElement.dataset.rubyLucidSingleUI='1';

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

    const page=document.getElementById('page-settings');
    if(page){
      [...page.querySelectorAll('.settings-section')].forEach(section=>{
        const title=(section.querySelector('.settings-title')?.textContent||'').trim().toUpperCase();
        if(['BACKGROUND','PRIVACY & SAFETY','HISTORY & SAFETY','CHAT PREFERENCES'].includes(title)) section.remove();
      });
      page.querySelectorAll('.ios-row').forEach(row=>{
        const t=(row.textContent||'').trim().toLowerCase();
        if(t.includes('chat notifications')||t.includes('offers & updates')||t.includes('notifications')) row.remove();
      });
      const languageSection=[...page.querySelectorAll('.settings-section')].find(s=>/PREFERENCES/i.test(s.querySelector('.settings-title')?.textContent||''));
      languageSection?.querySelector('.settings-title')?.replaceChildren(document.createTextNode('LANGUAGE'));
      const legal=[...page.querySelectorAll('.settings-section')].find(s=>/LEGAL/i.test(s.querySelector('.settings-title')?.textContent||''));
      if(legal){
        [...legal.querySelectorAll('.ios-row')].forEach(btn=>{
          const text=(btn.textContent||'').trim().toLowerCase();
          const title=btn.querySelector('.row-title');
          const sub=btn.querySelector('.row-sub');
          if(text.includes('terms')){title&&(title.textContent='Terms & Conditions');sub&&(sub.textContent='Read the full service rules');}
          else if(text.includes('privacy')){title&&(title.textContent='Privacy Policy');sub&&(sub.textContent='How Ruby Chan handles your data');}
        });
      }
      const support=[...page.querySelectorAll('.settings-section')].find(s=>/SUPPORT/i.test(s.querySelector('.settings-title')?.textContent||''));
      if(support){
        const first=support.querySelector('.ios-row');
        if(first){first.querySelector('.row-title')&&(first.querySelector('.row-title').textContent='Support & Feedback');first.querySelector('.row-sub')&&(first.querySelector('.row-sub').textContent='Get help, report bugs or send feedback');}
      }
      const legalTitle=legal?.querySelector('.settings-title');
      if(legalTitle) legalTitle.textContent='LEGAL & POLICIES';
    }

    const setModalHTML=(id,html)=>{const el=document.getElementById(id)?.querySelector('.terms-text');if(el)el.innerHTML=html;};
    setModalHTML('termsModal',`<strong>1. Eligibility & Age</strong><br>Ruby Chan is an adults-only service for people who are 18 years of age or older. You must truthfully confirm that you meet the minimum age requirement before entering the platform.<br><br><strong>2. AI Characters</strong><br>Characters on Ruby Chan are fictional AI companions. Their names, personalities, stories and responses are presented as fictional experiences and are not claims about real people.<br><br><strong>3. Acceptable Use</strong><br>Use the service lawfully and responsibly. Do not use Ruby Chan to harass, threaten, exploit, impersonate or target another person, or to facilitate unlawful activity.<br><br><strong>4. Prohibited Minor Sexual Content</strong><br>Any sexual content involving minors, or content that sexualizes or exploits anyone under 18, is strictly prohibited.<br><br><strong>5. Account Security</strong><br>Keep passwords, OTPs, PINs, Telegram access and payment credentials private. Support should never ask you to disclose these secrets.<br><br><strong>6. Payments, Energy & Gems</strong><br>Payments, subscriptions, Energy and Gems are subject to the package information shown at purchase and the service rules applicable at that time.<br><br><strong>7. Telegram Integration</strong><br>Some features may connect to Telegram. Use official Ruby Chan links and protect your Telegram account.<br><br><strong>8. Service Availability</strong><br>Features may change, pause or become temporarily unavailable because of maintenance, technical issues, security work or third-party service changes.<br><br><strong>9. User Responsibility</strong><br>You are responsible for your activity and for complying with applicable laws and these Terms & Conditions.<br><br><strong>10. Changes</strong><br>These Terms & Conditions may be updated when the service or applicable requirements change.`);
    setModalHTML('privacyPolicyModal',`<strong>1. Information We Process</strong><br>Ruby Chan may process account identifiers, Telegram-related identifiers, application settings, usage information, conversation records and information required to operate and secure the service.<br><br><strong>2. Conversation Data</strong><br>Messages may be processed or stored so the service can provide AI conversations and chat history. Retention depends on the current backend configuration and feature rules.<br><br><strong>3. Authentication</strong><br>The service may use authentication sessions, device information and security controls to establish and protect access.<br><br><strong>4. Telegram</strong><br>Telegram may provide account or Web App information needed to connect your session and deliver requested features.<br><br><strong>5. Payments</strong><br>Payments may be processed by third-party providers. Ruby Chan should not request your banking password, PIN or OTP.<br><br><strong>6. Local Storage</strong><br>The app may use local storage for preferences and application state.<br><br><strong>7. Third-Party Services</strong><br>Hosting, AI, analytics and payment providers may be used to deliver features. Their own policies may also apply.<br><br><strong>8. Retention</strong><br>Retention periods may vary by feature and account state. Some conversations may be subject to automatic deletion rules shown in the app.<br><br><strong>9. Children</strong><br>Ruby Chan is for adults aged 18 and above and is not intended for children or minors.<br><br><strong>10. Contact</strong><br>For privacy questions, use Ruby Chan Support and the official owner contact configured by the service owner.`);
    setModalHTML('18Modal',`<strong>18+ Adults Only</strong><br>Ruby Chan is strictly intended for adults who are at least 18 years old.<br><br><strong>Age Verification</strong><br>Before entering the platform, you must confirm that you are 18 or older. If you do not confirm, access is blocked.<br><br><strong>Minors Are Not Allowed</strong><br>Anyone under 18 must not access, use or attempt to access Ruby Chan.<br><br><strong>Safety Rule</strong><br>Sexual content involving minors, exploitation, trafficking, coercion or other illegal sexual material is prohibited.<br><br><strong>Accuracy</strong><br>Do not falsely confirm your age. If you are not 18 or older, exit the service.`);
    setModalHTML('supportModal',`<strong>💬 Support & Feedback</strong><br>Use this page for account problems, bugs, feature issues, payment questions and feedback.<br><br><strong>🛠 Bug Reports</strong><br>Include what happened, which page or feature was affected, and any useful error message. Screenshots may help when safe to share.<br><br><strong>💳 Payment Problems</strong><br>If Energy, Gems or Premium did not update after payment, keep your receipt and transaction information. Never send your banking password, PIN or OTP.<br><br><strong>👑 Premium Problems</strong><br>Include the package name and payment reference when contacting support if a Premium plan did not activate correctly.<br><br><strong>📩 Owner Support</strong><br>The official owner Telegram account can be connected through the owner contact setting. The real owner username has intentionally not been invented or hard-coded until configured by the owner.`);

    // Ask for 18+ confirmation on every app entry. Do not trust a stored yes from a previous visit.
    const gate=document.getElementById('ageGate');
    if(gate){
      gate.classList.remove('hidden');
      const exitBtn=gate.querySelector('.btn-secondary');
      if(exitBtn){
        exitBtn.textContent='Exit';
        exitBtn.onclick=(e)=>{e.preventDefault();document.body.innerHTML='<div style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#0b0b12;color:#fff;font-family:system-ui;text-align:center"><div><h2>Access Restricted</h2><p>You must be 18 or older to use Ruby Chan.</p></div></div>';};
      }
    }
    const termsGate=document.getElementById('termsGate');
    if(termsGate && localStorage.getItem('ruby_terms_accepted')!=='true') termsGate.classList.add('hidden');

    window.RUBY_OWNER_TELEGRAM=window.RUBY_OWNER_TELEGRAM||'';
    window.rubyOpenOwnerSupport=()=>{
      const u=window.RUBY_OWNER_TELEGRAM;
      if(u){const url=u.startsWith('http')?u:`https://t.me/${u.replace(/^@/,'')}`;if(window.Telegram?.WebApp?.openTelegramLink)window.Telegram.WebApp.openTelegramLink(url);else window.open(url,'_blank');}
      else if(typeof contactSupport==='function') contactSupport();
    };
    document.querySelector('#supportModal .btn-primary')?.addEventListener('click',(e)=>{e.preventDefault();window.rubyOpenOwnerSupport();});

    const syncNav=()=>{
      const active=document.querySelector('.page.active');
      const map={home:'nav-home',characters:'nav-characters',chat:'nav-chat',recharge:'nav-recharge',upgrade:'nav-upgrade',settings:'nav-settings'};
      document.querySelectorAll('nav .nav-item').forEach(b=>b.classList.toggle('active',b.id===map[active?.id?.replace('page-','')]));
    };
    syncNav();
    document.querySelector('nav')?.addEventListener('click',()=>setTimeout(syncNav,35));

    const decorateCharacters=()=>document.querySelectorAll('.character-card').forEach(card=>{card.classList.add('lucid-character-card');const img=card.querySelector('img');if(img)img.referrerPolicy='no-referrer';});
    decorateCharacters();
    const bonus=document.getElementById('bonus');
    if(bonus)bonus.setAttribute('aria-label','Daily Bonus');
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();