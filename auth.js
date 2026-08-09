/* Ruby Chan — Supabase Auth */
(function () {
  const SUPABASE_URL = 'https://hcbajvladlvhklelbxdr.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj';
  if (!window.supabase || typeof window.supabase.createClient !== 'function') return;
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  function ensureAuthUI() {
    if (!document.body || document.getElementById('rubyAuthModal')) return;
    const style = document.createElement('style');
    style.textContent = `
      #rubyAuthButton{position:static;flex:0 0 auto;border:0;border-radius:12px;padding:9px 13px;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer;white-space:nowrap;z-index:30;margin-left:8px}
      #rubyAuthModal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:20px}
      #rubyAuthModal.show{display:flex}#rubyAuthBox{width:min(390px,100%);background:#fff;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
      #rubyAuthBox input{display:block;width:100%;box-sizing:border-box;margin:9px 0;padding:12px;border:1px solid #ddd;border-radius:10px}
      #rubyAuthBox button{border:0;border-radius:10px;padding:11px 14px;cursor:pointer;font-weight:700}#rubyAuthSubmit{width:100%;background:#7c3aed;color:#fff;margin-top:8px}#rubyAuthSwitch{width:100%;margin-top:8px}#rubyAuthClose{float:right;background:transparent;font-size:20px;padding:0}
      #rubyAuthMessage{min-height:20px;margin-top:10px;font-size:13px;color:#666}
      #rubyAccountCard{margin-bottom:14px;background:linear-gradient(135deg,#fff,#faf5ff);border:1px solid rgba(124,58,237,.16);border-radius:18px;padding:17px;box-shadow:0 7px 20px rgba(124,58,237,.08)}
      #rubyAccountCard .ruby-account-name{font-size:18px;font-weight:800;color:#1c1c1e}.ruby-account-meta{margin-top:5px;color:#8e8e93;font-size:12px;line-height:1.6}.ruby-account-badge{display:inline-block;margin-top:10px;padding:5px 9px;border-radius:999px;background:#f3e8ff;color:#7c3aed;font-size:11px;font-weight:700}
      #rubyAccountActions{display:flex;gap:8px;margin-top:14px}#rubyAccountActions button{flex:1;padding:10px;border:0;border-radius:10px;font-weight:700;cursor:pointer}.ruby-change{background:#f2f2f7;color:#1c1c1e}.ruby-logout{background:#ff3b30;color:#fff}
    `;
    document.head.appendChild(style);

    const button=document.createElement('button');button.id='rubyAuthButton';button.type='button';button.textContent='Login';
    const header=document.querySelector('header');const balanceArea=document.querySelector('.balance-area');
    if(balanceArea) balanceArea.appendChild(button); else if(header) header.appendChild(button); else document.body.appendChild(button);

    const modal=document.createElement('div');modal.id='rubyAuthModal';modal.innerHTML=`<div id="rubyAuthBox"><button id="rubyAuthClose" type="button">×</button><h2 id="rubyAuthTitle">Login to Ruby Chan</h2><div id="rubySignupFields" style="display:none"><input id="rubyAuthName" type="text" placeholder="Full name" autocomplete="name"><input id="rubyAuthUsername" type="text" placeholder="Username" autocomplete="username"></div><input id="rubyAuthEmail" type="email" placeholder="Email" autocomplete="email"><input id="rubyAuthPassword" type="password" placeholder="Password" autocomplete="current-password"><button id="rubyAuthSubmit" type="button">Login</button><button id="rubyAuthSwitch" type="button">Create account</button><div id="rubyAuthMessage"></div></div>`;document.body.appendChild(modal);
    let signup=false;const title=document.getElementById('rubyAuthTitle'),submit=document.getElementById('rubyAuthSubmit'),switchBtn=document.getElementById('rubyAuthSwitch'),message=document.getElementById('rubyAuthMessage'),fields=document.getElementById('rubySignupFields');
    function render(){title.textContent=signup?'Create your Ruby Chan account':'Login to Ruby Chan';submit.textContent=signup?'Sign Up':'Login';switchBtn.textContent=signup?'Back to Login':'Create account';fields.style.display=signup?'block':'none';message.textContent='';}
    function open(){modal.classList.add('show')};document.getElementById('rubyAuthClose').onclick=()=>modal.classList.remove('show');switchBtn.onclick=()=>{signup=!signup;render()};
    function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
    function accountCard(user){const old=document.getElementById('rubyAccountCard');if(old)old.remove();if(!user)return;const name=user.user_metadata?.full_name||'Ruby Chan member',un=user.user_metadata?.username||'',email=user.email||'';const card=document.createElement('div');card.id='rubyAccountCard';card.innerHTML=`<div class="ruby-account-name">👤 ${esc(name)}</div><div class="ruby-account-meta">${esc(un?'@'+un:'')}${un&&email?' · ':''}${esc(email)}</div><span class="ruby-account-badge">Signed in</span><div id="rubyAccountActions"><button class="ruby-change" type="button">Change account</button><button class="ruby-logout" type="button">Logout</button></div>`;const settings=document.getElementById('page-settings');if(settings){const accountSection=settings.querySelector('.settings-section');if(accountSection)accountSection.parentNode.insertBefore(card,accountSection);else settings.prepend(card)}card.querySelector('.ruby-change').onclick=async()=>{await client.auth.signOut();signup=false;render();open()};card.querySelector('.ruby-logout').onclick=async()=>{await client.auth.signOut()};}
    submit.onclick=async()=>{const name=document.getElementById('rubyAuthName').value.trim(),username=document.getElementById('rubyAuthUsername').value.trim(),email=document.getElementById('rubyAuthEmail').value.trim(),password=document.getElementById('rubyAuthPassword').value;if(signup&&(!name||!username)){message.textContent='Enter your name and username.';return}if(!email||!password){message.textContent='Enter your email and password.';return}if(signup&&password.length<6){message.textContent='Password must be at least 6 characters.';return}submit.disabled=true;message.textContent='Please wait…';try{const r=signup?await client.auth.signUp({email,password,options:{data:{full_name:name,username}}}):await client.auth.signInWithPassword({email,password});if(r.error)throw r.error;message.textContent=signup&&!r.data.session?'Account created. Check your email to confirm it.':'Success.';if(r.data.session){accountCard(r.data.user);modal.classList.remove('show')}}catch(e){message.textContent=e.message||'Authentication failed.'}finally{submit.disabled=false}};
    button.onclick=open;
    client.auth.onAuthStateChange((_e,session)=>{if(session?.user){const name=session.user.user_metadata?.full_name||'Account';button.textContent='Account';button.onclick=()=>{const settings=document.getElementById('page-settings');if(typeof window.switchPage==='function')window.switchPage('settings');setTimeout(()=>{accountCard(session.user);document.getElementById('rubyAccountCard')?.scrollIntoView({behavior:'smooth',block:'start'})},50)};accountCard(session.user)}else{button.textContent='Login';button.onclick=open;accountCard(null)}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureAuthUI,{once:true});else ensureAuthUI();
})();
