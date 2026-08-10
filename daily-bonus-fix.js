// Ruby Chan — account-based Daily Bonus (server authoritative)
(function () {
  'use strict';
  if (window.__rubyDailyBonusInstalled) return;
  window.__rubyDailyBonusInstalled = true;

  const BONUS = 25;
  let loggedIn = false;
  let eligible = false;
  let nextClaimAt = null;
  let busy = false;

  function db() { return window.supabaseClient || window.rubySupabase || null; }

  function ensureUI() {
    if (!document.body) return null;
    document.querySelectorAll('#rubyGiftFloat,#rubyGiftModal,#rubyDailyCountdown').forEach(el => el.remove());
    let gift = document.getElementById('rubyDailyGift');
    if (!gift) {
      gift = document.createElement('button');
      gift.id = 'rubyDailyGift';
      gift.type = 'button';
      gift.setAttribute('aria-label', 'Daily Bonus');
      gift.style.cssText = 'position:fixed;right:18px;bottom:92px;width:72px;height:72px;z-index:99999;border:0;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);box-shadow:0 9px 26px rgba(124,58,237,.34),0 0 0 4px rgba(255,255,255,.86);color:#fff;font-size:28px;cursor:pointer;display:none;align-items:center;justify-content:center;flex-direction:column;gap:2px;padding:5px;';
      gift.onclick = claim;
      document.body.appendChild(gift);
    }
    return gift;
  }

  function fmt(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(total / 3600)).padStart(2,'0')}:${String(Math.floor((total % 3600) / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
  }

  function render() {
    const gift = ensureUI();
    if (!gift) return;
    if (!loggedIn) { gift.style.display = 'none'; return; }
    gift.style.display = 'flex';
    if (eligible) {
      gift.disabled = false;
      gift.style.pointerEvents = 'auto';
      gift.style.opacity = '1';
      gift.innerHTML = `🎁<span style="font-size:9px;font-weight:900">+${BONUS}</span>`;
      gift.title = `Daily Bonus — claim +${BONUS}`;
    } else {
      gift.disabled = true;
      gift.style.pointerEvents = 'none';
      gift.style.opacity = '.62';
      const remaining = nextClaimAt ? new Date(nextClaimAt).getTime() - Date.now() : 0;
      gift.innerHTML = `🎁<span style="font-size:9px;font-weight:900">${remaining > 0 ? fmt(remaining) : 'Already claimed'}</span>`;
      gift.title = remaining > 0 ? `Next Daily Bonus in ${fmt(remaining)}` : 'Daily Bonus already claimed';
    }
  }

  async function invoke(action) {
    const client = db();
    if (!client) throw new Error('Supabase client unavailable');
    const { data, error } = await client.functions.invoke('daily-bonus', { body: { action } });
    if (error) throw error;
    if (data?.error && action === 'status') throw new Error(data.error);
    return data;
  }

  async function refresh() {
    if (busy) return;
    const client = db();
    if (!client) return;
    busy = true;
    try {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData?.session?.user;
      loggedIn = !!user;
      if (!user) { eligible = false; nextClaimAt = null; render(); return; }
      const data = await invoke('status');
      eligible = data?.eligible === true;
      nextClaimAt = data?.next_claim_at || null;
      render();
    } catch (e) {
      console.warn('Daily Bonus status:', e);
      eligible = false;
      render();
    } finally { busy = false; }
  }

  async function claim() {
    if (!eligible || busy || !loggedIn) return;
    busy = true;
    render();
    try {
      const data = await invoke('claim');
      eligible = data?.success !== true;
      nextClaimAt = data?.next_claim_at || null;
      const energy = document.getElementById('energyValue');
      if (energy && data?.energy != null) energy.textContent = String(data.energy);
    } catch (e) {
      console.warn('Daily Bonus claim:', e);
      await refresh();
      return;
    } finally { busy = false; }
    render();
  }

  function start() {
    ensureUI();
    const client = db();
    if (!client) { setTimeout(start, 500); return; }
    client.auth.onAuthStateChange(() => setTimeout(refresh, 100));
    refresh();
    setInterval(() => {
      if (!loggedIn) return render();
      if (nextClaimAt && Date.now() >= new Date(nextClaimAt).getTime()) { eligible = true; nextClaimAt = null; refresh(); }
      else render();
    }, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
