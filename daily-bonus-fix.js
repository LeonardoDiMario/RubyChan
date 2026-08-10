// Ruby Chan — one account-based Daily Bonus controller
(function () {
  'use strict';
  if (window.__rubyDailyBonusInstalled) return;
  window.__rubyDailyBonusInstalled = true;

  const BONUS = 25;
  const COOLDOWN = 86400;
  let loggedIn = false;
  let nextClaimAt = null;
  let busy = false;
  let eligible = false;

  function db() { return window.supabaseClient || window.rubySupabase || null; }

  function removeLegacy() {
    document.querySelectorAll('#rubyGiftFloat,#rubyGiftModal').forEach(el => el.remove());
  }

  function ensureUI() {
    removeLegacy();
    if (!document.body) return null;
    let gift = document.getElementById('rubyDailyGift');
    if (!gift) {
      gift = document.createElement('button');
      gift.id = 'rubyDailyGift';
      gift.type = 'button';
      gift.setAttribute('aria-label', 'Daily Bonus');
      gift.innerHTML = '🎁<span class="ruby-gift-badge">+25</span>';
      gift.style.cssText = 'position:fixed;right:18px;bottom:92px;width:58px;height:58px;z-index:9998;border:0;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);box-shadow:0 9px 26px rgba(124,58,237,.34),0 0 0 4px rgba(255,255,255,.86);color:#fff;font-size:27px;cursor:pointer;display:none;align-items:center;justify-content:center;';
      gift.addEventListener('click', claim);
      document.body.appendChild(gift);
    }
    let timer = document.getElementById('rubyDailyCountdown');
    if (!timer) {
      timer = document.createElement('div');
      timer.id = 'rubyDailyCountdown';
      timer.style.cssText = 'position:fixed;right:10px;bottom:70px;z-index:9997;min-width:76px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.96);color:#6d28d9;font-size:10px;font-weight:800;text-align:center;display:none;';
      document.body.appendChild(timer);
    }
    return gift;
  }

  function fmt(ms) {
    const n = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(n / 3600)).padStart(2,'0')}:${String(Math.floor((n % 3600) / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
  }

  function render(isEligible) {
    eligible = !!isEligible;
    const gift = ensureUI();
    const timer = document.getElementById('rubyDailyCountdown');
    if (!gift || !timer) return;
    if (!loggedIn) {
      gift.style.display = 'none';
      timer.style.display = 'none';
      return;
    }
    gift.style.display = 'flex';
    if (eligible) {
      gift.disabled = false;
      gift.style.pointerEvents = 'auto';
      gift.style.opacity = '1';
      timer.style.display = 'none';
    } else {
      gift.disabled = true;
      gift.style.pointerEvents = 'none';
      gift.style.opacity = '.62';
      timer.style.display = 'block';
      const remaining = nextClaimAt ? new Date(nextClaimAt).getTime() - Date.now() : COOLDOWN * 1000;
      timer.textContent = remaining > 0 ? `⏳ ${fmt(remaining)}` : '⏳ Checking…';
    }
  }

  async function refresh() {
    const client = db();
    if (!client || busy) return;
    busy = true;
    try {
      const { data: s } = await client.auth.getSession();
      const user = s?.session?.user;
      loggedIn = !!user;
      if (!user) {
        nextClaimAt = null;
        render(false);
        return;
      }
      const { data, error } = await client.rpc('get_daily_bonus_status', { p_cooldown_seconds: COOLDOWN });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      nextClaimAt = row?.next_claim_at || null;
      render(row?.eligible === true);
    } catch (e) {
      console.warn('Daily bonus status:', e);
    } finally {
      busy = false;
    }
  }

  async function claim() {
    const client = db();
    const gift = ensureUI();
    if (!client || !gift || gift.disabled || !loggedIn || !eligible) return;
    gift.disabled = true;
    gift.style.pointerEvents = 'none';
    try {
      const { data, error } = await client.rpc('claim_daily_bonus', {
        p_bonus: BONUS,
        p_cooldown_seconds: COOLDOWN
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.next_claim_at) nextClaimAt = row.next_claim_at;
      if (row?.ok === true) {
        const energy = document.getElementById('energyValue');
        if (energy && row.energy != null) energy.textContent = String(row.energy);
      }
      if (row?.ok === false && row?.next_claim_at) {
        nextClaimAt = row.next_claim_at;
      }
      render(false);
    } catch (e) {
      console.warn('Daily bonus claim:', e);
      await refresh();
    }
  }

  function start() {
    ensureUI();
    const client = db();
    if (!client) return;
    client.auth.onAuthStateChange(() => setTimeout(refresh, 0));
    refresh();
    setInterval(() => {
      if (!loggedIn || !nextClaimAt || eligible) return;
      const timer = document.getElementById('rubyDailyCountdown');
      const remaining = new Date(nextClaimAt).getTime() - Date.now();
      if (remaining <= 0) {
        refresh();
      } else if (timer) {
        timer.textContent = `⏳ ${fmt(remaining)}`;
      }
    }, 1000);
  }

  function boot() { if (document.body) start(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
