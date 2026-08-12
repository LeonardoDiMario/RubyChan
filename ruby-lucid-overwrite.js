(()=>{
  // This file is loaded by index.html. It is the single entry point for the current in-place UI overwrite.
  const boot=()=>{
    if(document.documentElement.dataset.rubyLucidBoot==='1') return;
    document.documentElement.dataset.rubyLucidBoot='1';
    const load=(src)=>new Promise((resolve,reject)=>{
      const existing=document.querySelector(`script[data-ruby-runtime="${src}"]`);
      if(existing){resolve();return;}
      const s=document.createElement('script');
      s.src=src;
      s.dataset.rubyRuntime=src;
      s.defer=false;
      s.onload=resolve;
      s.onerror=reject;
      document.body.appendChild(s);
    });
    const addCss=()=>{
      if(document.getElementById('ruby-lucid-overwrite-css'))return;
      const l=document.createElement('link');
      l.id='ruby-lucid-overwrite-css';
      l.rel='stylesheet';
      l.href='ruby-lucid-overwrite.css?v=20260813';
      document.head.appendChild(l);
    };
    addCss();
    load('settings-runtime.js?v=20260813').catch(e=>console.error('Ruby settings runtime failed',e));
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
