// Ruby Chan — auth-aware welcome
(function(){
  'use strict';

  function addWelcomeAuth(){
    const hero=document.querySelector('#page-home .hero,.hero');
    const title=hero?.querySelector('h2');
    if(!hero||!title)return;

    let wrap=document.getElementById('rubyWelcomeAuth');
    let greeting=document.getElementById('rubyWelcomeGreeting');
    if(!wrap){
      wrap=document.createElement('div');wrap.id='rubyWelcomeAuth';
      wrap.innerHTML='<button type="button" class="ruby-welcome-auth-btn"><span>Continue to Login</span><span class="ruby-welcome-arrow">›</span></button>';
      title.insertAdjacentElement('afterend',wrap);
      wrap.querySelector('button').addEventListener('click',()=>document.getElementById('rubyAuthButton')?.click());
    }
    if(!greeting){
      greeting=document.createElement('div');greeting.id='rubyWelcomeGreeting';
      title.insertAdjacentElement('afterend',greeting);
    }

    if(!document.getElementById('ruby-welcome-auth-style')){
      const style=document.createElement('style');style.id='ruby-welcome-auth-style';style.textContent=`
        #rubyWelcomeAuth{margin-top:16px}
        #rubyWelcomeAuth .ruby-welcome-auth-btn{width:100%;min-height:50px;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 15px;border:1px solid rgba(124,58,237,.16);border-radius:14px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:14px;font-weight:800;box-shadow:0 8px 20px rgba(124,58,237,.20);cursor:pointer}
        #rubyWelcomeAuth .ruby-welcome-arrow{font-size:24px;font-weight:300;line-height:1;margin-left:auto}
        #rubyWelcomeGreeting{margin-top:7px;color:#5d6470;font-size:14px;line-height:1.5}
      `;document.head.appendChild(style);
    }

    function nameOf(user){const m=user?.user_metadata||{};return String(m.full_name||m.name||m.username||user?.email?.split('@')[0]||'Mario').trim()}
    function updateWelcome(session){
      if(session?.user){
        title.textContent=`Welcome, ${nameOf(session.user)}`;
        wrap.style.display='none';
        greeting.style.display='none';
      }else{
        title.textContent='Welcome to Ruby Chan';
        greeting.textContent='Continue to login or sign up to use Ruby Chan.';
        wrap.style.display='';
        greeting.style.display='block';
      }
    }

    function bindAuth(){
      const sb=window.supabaseClient||window.rubySupabase;
      if(!sb?.auth)return false;
      sb.auth.getSession().then(({data})=>updateWelcome(data?.session));
      sb.auth.onAuthStateChange((_event,session)=>setTimeout(()=>updateWelcome(session),20));
      return true;
    }
    if(!bindAuth())setTimeout(bindAuth,300);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addWelcomeAuth,{once:true});else addWelcomeAuth();
})();
