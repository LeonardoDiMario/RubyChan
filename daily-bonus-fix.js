// Ruby Chan — single account-based Daily Bonus controller
(function () {
  'use strict';

  // Prevent this controller from being installed twice by cached/legacy loaders.
  if (window.__rubyDailyBonusInstalled) return;
  window.__rubyDailyBonusInstalled = true;

  const BONUS = 25;
  const DAY = 86400000;
  let nextClaimAt = null;
  let loggedIn = false;
  let authBound = false;
  let statusLoading = false;
  let countdownTimer = null;

  function db() {
    return window.supabaseClient || null;
  }

  function removeLegacyGifts() {
    // Old bonus implementations used these IDs. Remove them before creating the single current gift.
    document.querySelectorAll('#rubyGiftFloat,#rubyGiftModal,#rubyDailyGift').forEach(function (el) {
      if (el.dataset.rubyAccountBonusOwner !== '1') el.remove();
    });
  }

  function styles() {
    if (document.getElementById('ruby-single-daily-style')) return;
    const s = document.createElement('style');
    s.id = 'ruby-single-daily-style';
    s.textContent = `
      #rubyGiftFloat,#rubyGiftModal{display:none!important;visibility:hidden!important;pointer-events:none!important}
      #rubyDailyGift.ruby-daily-single{position:fixed!important;right:18px!important;bottom:92px!important;width:58px!important;height:58px!important;z-index:9998!important;display:flex!important;align-items:center!important;justify-content:center!important;border:0!important;border-radius:50%!important;background:linear-gradient(135deg,#7c3aed,#a855f7)!important;box-shadow:0 9px 26px rgba(124,58,237,.34),0 0 0 4px rgba(255,255,255,.86)!important;color:#fff!important;font-size:27px!important;cursor:pointer!important}
      #rubyDailyGift.ruby-daily-single.ruby-locked{opacity:.62;cursor:default}
      #rubyDailyGift.ruby-daily-single .ruby-gift-badge{position:absolute;right:-2px;top:-2px;min-width:21px;height:21px;padding:0 5px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:#ff3b30;color:#fff;font-size:9px;font-weight:900;border:2px solid #fff}
      #rubyDailyCountdown{position:fixed!important;right:10px!important;bottom:70px!important;z-index:9997!important;min-width:76px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.96);border:1px solid rgba(124,58,237,.16);box-shadow:0 5px 18px rgba(0,0,0,.10);color:#6d28d9;font-size:10px;font-weight:800;text-align:center;white-space:nowrap}
    `;
    document.head.appendChild(s);
  }

  function ensureGift() {
    removeLegacyGifts();
    styles();
    let gift = document.getElementById('rubyDailyGift');
    if (!gift || gift.dataset.rubyAccountBonusOwner !== '1') {
      const fresh = document.createElement('button');
      fresh.id = 'rubyDailyGift';
      fresh.type = 'button';
      fresh.setAttribute('aria-label', 'Daily Bonus');
      fresh.innerHTML = '🎁<span class="ruby-gift-badge">+25</span>';
      fresh.className = 'ruby-daily-single';
      fresh.dataset.rubyAccountBonusOwner = '1';
      fresh.addEventListener('click', claim);
      if (gift?.parentNode) gift.parentNode.replaceChild(fresh, gift);
      else document.body?.appendChild(fresh);
      gift = fresh;
    }
    gift.classList.add('ruby-daily-single');
    return gift;
  }

  function timerEl() {
    let el = document.getElementById('rubyDailyCountdown');
    if (!el && document.body) {
      el = document.createElement('div');
      el.id = 'rubyDailyCountdown';
      document.body.appendChild(el);
    }
    return el;
  }

  function fmt(ms) {
    const n = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(n / 3600)).padStart(2,'0')}:${String(Math.floor((n % 3600) / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
  }

  function draw(eligible) {
    const gift = ensureGift();
    const timer = timerEl();
    if (!gift || !timer) return;
    if (!loggedIn) {
      gift.style.display = 'none';
      timer.style.display = 'none';
      return;
    }
    gift.style.display = 'flex';
    if (eligible) {
      gift.classList.remove('ruby-locked');
      gift.disabled = false;
      timer.style.display = 'none';
      return;
    }
    gift.classList.add('ruby-locked');
    gift.disabled = true;
    timer.style.display = 'block';
    const remaining = nextClaimAt ? new Date(nextClaimAt).getTime() - Date.now() : DAY;
    timer.textContent = `⏳ ${fmt(remaining)}`;
  }

  async function refreshStatus() {
    if (statusLoading) return;
    const client = db();
    if (!client) return;
    statusLoading = true;
    try {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData?.session?.user;
      loggedIn = !!user;
      if (!user) {
        nextClaimAt = null;
        draw(false);
        return;
      }
      const { data, error } = await client.rpc('get_daily_bonus_status', { p_cooldown_seconds: 86400 });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      nextClaimAt = row?.next_claim_at || null;
      draw(!!row?.eligible);
    } catch (e) {
      console.warn('Daily bonus status failed:', e);
    } finally {
      statusLoading = false;
    }
  }

  async function claim() {
    const client = db();
    const gift = ensureGift();
    if (!client || gift.disabled) return;
    if (!loggedIn) {
      await refreshStatus();
      return;
    }
    gift.disabled = true;
    try {
      const { data, error } = await client.rpc('claim_daily_bonus', {
        p_bonus: BONUS,
        p_cooldown_seconds: 86400
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.ok) {
        const energy = document.getElementById('energyValue');
        if (energy) energy.textContent = String(row.energy);
      }
      await refreshStatus();
    } catch (e) {
      console.error('Daily bonus claim failed:', e);
      await refreshStatus();
    } finally {
      gift.disabled = false;
    }
  }

  function bindAuth() {
    if (authBound) return;
    const client = db();
    if (!client) return;
    authBound = true;
    client.auth.onAuthStateChange((_event, session) => {
      loggedIn = !!session?.user;
      nextClaimAt = null;
      setTimeout(refreshStatus, 0);
    });
  }

  function start() {
    ensureGift();
    bindAuth();
    setTimeout(refreshStatus, 0);
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
      if (!loggedIn || !nextClaimAt) return;
      const timer = document.getElementById('rubyDailyCountdown');
      const remaining = new Date(nextClaimAt).getTime() - Date.now();
      if (remaining <= 0) {
        refreshStatus();
        return;
      }
      if (timer) timer.textContent = `⏳ ${fmt(remaining)}`;
    }, 1000);
  }

  const wait = setInterval(() => {
    if (document.body) {
      clearInterval(wait);
      start();
    }
  }, 50);
})();
