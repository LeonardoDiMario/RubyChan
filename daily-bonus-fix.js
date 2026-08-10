// Ruby Chan — authoritative account-based Daily Bonus
(function () {
  'use strict';
  if (window.__rubyDailyBonusInstalled) return;
  window.__rubyDailyBonusInstalled = true;

  const BONUS = 25;
  const COOLDOWN = 86400;
  let loggedIn = false;
  let nextClaimAt = null;
  let eligible = false;
  let refreshing = false;
  let retryTimer = null;

  function db() { return window.supabaseClient || window.rubySupabase || null; }

  function removeLegacy() {
    document.querySelectorAll('#rubyGiftFloat,#rubyGiftModal,#rubyDailyCountdown').forEach(el => el.remove());
  }

  function ensureUI() {
    if (!document.body) return null;
    let gift = document.getElementById('rubyDailyGift');
    if (!gift) {
      gift = document.createElement('button');
      gift.id = 'rubyDailyGift';
      gift.type = 'button';
      gift.setAttribute('aria-label', 'Daily Bonus');
      gift.style.cssText = 'position:fixed;right:18px;bottom:92px;width:68px;height:68px;z-index:99999;border:0;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);box-shadow:0 9px 26px rgba(124,58,237,.34),0 0 0 4px rgba(255,255,255,.86);color:#fff;font-size:27px;cursor:pointer;display:none;align-items:center;justify-content:center;flex-direction:column;gap:1px;padding:5px;';
      gift.addEventListener('click', claim);
      document.body.appendChild(gift);
    }
    return gift;
  }

  function fmt(ms) {
    const n = Math.max(0, Math.ceil(ms / 1000));
    return `${String(Math.floor(n / 3600)).padStart(2,'0')}:${String(Math.floor((n % 3600) / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
  }

  function render() {
    const gift = ensureUI();
    if (!gift) return;
    if (!loggedIn) {
      gift.style.display = 'none';
      return;
    }
    gift.style.display = 'flex';
    if (eligible) {
      gift.disabled = false;
      gift.style.pointerEvents = 'auto';
      gift.style.opacity = '1';
      gift.innerHTML = '🎁<span style="font-size:9px;font-weight:900;line-height:1">+25</span>';
      gift.title = 'Daily Bonus — claim +25 energy';
    } else {
      gift.disabled = true;
      gift.style.pointerEvents = 'none';
      gift.style.opacity = '.62';
      const remaining = nextClaimAt ? new Date(nextClaimAt).getTime() - Date.now() : COOLDOWN * 1000;
      gift.innerHTML = `🎁<span style="font-size:9px;font-weight:900;line-height:1">${remaining > 0 ? fmt(remaining) : 'Checking…'}</span>`;
      gift.title = remaining > 0 ? `Next Daily Bonus in ${fmt(remaining)}` : 'Checking Daily Bonus';
    }
  }

  async function refresh() {
    const client = db();
    if (!client || refreshing) return;
    refreshing = true;
    try {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData?.session?.user;
      loggedIn = !!user;
      if (!user) {
        eligible = false;
        nextClaimAt = null;
        render();
        return;
      }
      const { data, error } = await client.rpc('get_daily_bonus_status', { p_cooldown_seconds: COOLDOWN });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      nextClaimAt = row?.next_claim_at || null;
      eligible = row?.eligible === true;
      render();
    } catch (error) {
      console.warn('Ruby Chan Daily Bonus status:', error);
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(refresh, 2000);
    } finally {
      refreshing = false;
    }
  }

  async function claim() {
    const client = db();
    const gift = ensureUI();
    if (!client || !gift || gift.disabled || !loggedIn || !eligible) return;
    gift.disabled = true;
    gift.style.pointerEvents = 'none';
    try {
      const { data, error } = await client.rpc('claim_daily_bonus', { p_bonus: BONUS, p_cooldown_seconds: COOLDOWN });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      nextClaimAt = row?.next_claim_at || nextClaimAt;
      eligible = row?.ok === true ? false : false;
      render();
      const energy = document.getElementById('energyValue');
      if (energy && row?.energy != null) energy.textContent = String(row.energy);
    } catch (error) {
      console.warn('Ruby Chan Daily Bonus claim:', error);
      await refresh();
    }
  }

  function start() {
    removeLegacy();
    ensureUI();
    const client = db();
    if (!client) {
      setTimeout(start, 500);
      return;
    }
    client.auth.onAuthStateChange(() => setTimeout(refresh, 50));
    refresh();
    setInterval(() => {
      if (!loggedIn || eligible || !nextClaimAt) return;
      const remaining = new Date(nextClaimAt).getTime() - Date.now();
      if (remaining <= 0) {
        eligible = true;
        nextClaimAt = null;
        render();
        refresh();
      } else {
        render();
      }
    }, 1000);
  }

  function boot() {
    if (document.body) start();
    else setTimeout(boot, 100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
