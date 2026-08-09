// Ruby Chan — Welcome login / sign-up shortcut
(function(){
  function addWelcomeAuth(){
    const hero = document.querySelector('.hero');
    const title = hero?.querySelector('h2');
    if(!hero || !title || document.getElementById('rubyWelcomeAuth')) return;

    const wrap = document.createElement('div');
    wrap.id = 'rubyWelcomeAuth';
    wrap.innerHTML = `
      <button type="button" class="ruby-welcome-auth-btn">
        <span>🔐</span>
        <span>Login / Sign Up</span>
        <span class="ruby-welcome-arrow">›</span>
      </button>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #rubyWelcomeAuth{margin-top:16px}
      #rubyWelcomeAuth .ruby-welcome-auth-btn{
        width:100%;
        min-height:50px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        padding:12px 15px;
        border:1px solid rgba(124,58,237,.16);
        border-radius:14px;
        background:linear-gradient(135deg,#7c3aed,#a855f7);
        color:#fff;
        font-size:14px;
        font-weight:800;
        box-shadow:0 8px 20px rgba(124,58,237,.20);
        cursor:pointer;
      }
      #rubyWelcomeAuth .ruby-welcome-auth-btn:active{transform:scale(.985)}
      #rubyWelcomeAuth .ruby-welcome-arrow{font-size:24px;font-weight:300;line-height:1;margin-left:auto}
      #rubyWelcomeGreeting{display:none;margin-top:7px;color:#5d6470;font-size:14px;line-height:1.5}
    `;
    document.head.appendChild(style);
    title.insertAdjacentElement('afterend', wrap);

    const greeting = document.createElement('div');
    greeting.id = 'rubyWelcomeGreeting';
    title.insertAdjacentElement('afterend', greeting);

    wrap.querySelector('button').addEventListener('click',()=>{
      const topLogin=document.getElementById('rubyAuthButton');
      if(topLogin) topLogin.click();
    });

    function updateWelcome(session){
      const user = session?.user;
      if(user){
        const username = user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';
        title.textContent = `Welcome, ${username}`;
        wrap.style.display = 'none';
        greeting.style.display = 'none';
      }else{
        title.textContent = 'Welcome to Ruby Chan';
        wrap.style.display = '';
        greeting.style.display = 'none';
      }
    }

    if(window.supabaseClient?.auth){
      window.supabaseClient.auth.getSession().then(({data})=>updateWelcome(data?.session));
      window.supabaseClient.auth.onAuthStateChange((_event,session)=>updateWelcome(session));
    }else{
      setTimeout(()=>{
        if(window.supabaseClient?.auth){
          window.supabaseClient.auth.getSession().then(({data})=>updateWelcome(data?.session));
          window.supabaseClient.auth.onAuthStateChange((_event,session)=>updateWelcome(session));
        }
      },300);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addWelcomeAuth,{once:true});
  else addWelcomeAuth();
})();
