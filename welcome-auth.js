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
    `;
    document.head.appendChild(style);
    title.insertAdjacentElement('afterend', wrap);

    wrap.querySelector('button').addEventListener('click',()=>{
      const topLogin=document.getElementById('rubyAuthButton');
      if(topLogin) topLogin.click();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addWelcomeAuth,{once:true});
  else addWelcomeAuth();
})();
