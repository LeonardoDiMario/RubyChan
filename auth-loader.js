// Ruby Chan — single feature loader
(function () {
  'use strict';
  if (window.__rubyAuthLoaderStarted) return;
  window.__rubyAuthLoaderStarted = true;
  const v = '20260811-5';
  const scripts = [
    `./supabase.js?v=${v}`,
    `./telegram-config.js?v=${v}`,
    `./auth.js?v=${v}`,
    `./welcome-auth.js?v=${v}`,
    `./chat-sync.js?v=${v}`,
    `./chat-client.js?v=${v}`,
    `./premium-ui.js?v=${v}`,
    `./telegram-bridge.js?v=${v}`,
    `./daily-bonus-v2.js?v=${v}`,
    `./character-new-chat.js?v=${v}`,
    `./ui-polish.js?v=${v}`
  ];
  let i=0;
  function loadNext(){if(i>=scripts.length)return;const src=scripts[i++];if(document.querySelector(`script[src="${src}"]`))return loadNext();const s=document.createElement('script');s.src=src;s.async=false;s.onload=loadNext;s.onerror=()=>{console.error('Ruby Chan: failed to load',src);loadNext()};document.head.appendChild(s)}
  function boot(){if(document.head)loadNext()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();