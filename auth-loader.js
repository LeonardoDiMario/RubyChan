// Ruby Chan — single platform loader
(function () {
  'use strict';
  if (window.__rubyAuthLoaderStarted) return;
  window.__rubyAuthLoaderStarted = true;

  const v = '20260811-14';
  const scripts = [
    `./supabase.js?v=${v}`,
    `./telegram-config.js?v=${v}`,
    `./auth.js?v=${v}`,
    `./welcome-auth.js?v=${v}`,
    `./premium-ui.js?v=${v}`,
    `./telegram-bridge.js?v=${v}`,
    `./daily-bonus-v2.js?v=${v}`,
    `./ui-polish.js?v=${v}`,
    `./account-settings.js?v=${v}`,
    `./platform-ui-v3.js?v=${v}`,
    `./character-new-chat.js?v=${v}`,
    `./quick-access.js?v=${v}`,
    `./platform-ui-v5.js?v=${v}`
  ];

  let index = 0;
  function loadNext() {
    if (index >= scripts.length) return;
    const src = scripts[index++];
    if (document.querySelector(`script[src="${src}"]`)) return loadNext();
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = loadNext;
    script.onerror = function () {
      console.error('Ruby Chan: failed to load', src);
      loadNext();
    };
    document.head.appendChild(script);
  }

  function boot() {
    if (document.head) loadNext();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
