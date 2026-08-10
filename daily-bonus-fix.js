// Ruby Chan — account-based Daily Bonus controller (fast, non-blocking)
(function () {
  const BONUS = 25;
  const DAY = 24 * 60 * 60 * 1000;
  let nextClaimAt = null;
  let loggedInState = false;
  let refreshTimer = null;
  let authBound = false;

  function getDb() {
    return window.supabaseClient ||
      (window.supabase && window.supabase.createClient
        ? window.supabase.createClient(
            'https://hcbajvladlvhklelbxdr.supabase.co',
            'sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj',
            { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
          )
        : null);
  }

  function removeOtherGiftUI() {
    document.querySelectorAll('#rubyGiftFloat, #rubyGiftModal').forEach(el => el.remove());
  }

  function styles() {
    if (document.getElementById('ruby-single-daily-style')) return;
    const s = document.createElement('style');
    s.id = 'ruby-single-daily-style';
    s.textContent = `
      #rubyGiftFloat,#rubyGiftModal{display:none!important;visibility:hidden!important;pointer-events:none!important}
      #rubyDailyGift.ruby-daily-single{position:fixed!important;right:18px!important;bottom:92px!important;width:58px!important;height:58px!important;z-index:9998!important;display:flex!important;align-items:center!important;justify-content:center!important;border:0!important;border-radius:50%!important;background:linear-gradient(135deg,#7c3aed,#a855f7)!important;box-shadow:0 9px 26px rgba(124,58,237,.34),0 0 0 4px rgba(255,255,255,.86)!important;color:#fff!important;font-size:27px!important;cursor:pointer!important;animation:rubyDailyFloat 2.2s ease-in-out infinite!important}
      #rubyDailyGift.ruby-daily-single .ruby-gift-badge{position:absolute;right:-2px;top:-2px;min-width:21px;height:21px;padding:0 5px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:#ff3b30;color:#fff;font-size:9px;font-weight:900;border:2px solid #fff}
      #rubyDailyGift.ruby-daily-single.ruby-locked{opacity:.62;cursor:default;animation:none!important}
      @keyframes rubyDailyFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      #rubyDailyCountdown{position:fixed!important;right:10px!important;bottom:70px!important;z-index:9997!important;min-width:76px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.96);border:1px solid rgba(124,58,237,.16);box-shadow:0 5px 18px rgba(0,0,0,.10);color:#6d28d9;font-size:10px;font-weight:800;text-align:center;white-space:nowrap}
    `;
    document.head.appendChild(s);
  }

  function ensureGift() {
    styles();
    removeOtherGiftUI();
    let gift = document.getElementById('rubyDailyGift');
    if (!gift || !gift.dataset.rubyAccountBonusOwner) {
      const fresh = document.createElement('button');
      fresh.id = 'rubyDailyGift';
      fresh.type = 'button';
      fresh.setAttribute('aria-label', 'Daily Bonus');
      fresh.innerHTML = '🎁<span class="ruby-gift-badge">+25</span>';
      fresh.className = 'ruby-daily-single';
      fresh.dataset.rubyAccountBonusOwner = '1';
      fresh.addEventListener('click', claim);
      if (gift?.parentNode) gift.parentNode.replaceChild(fresh, gift);
      else if (document.body) document.body.appendChild(fresh);
      gift = fresh;
    }
    gift.classList.add('ruby-daily-single');
    return gift;
  }

  function countdown() {
    let el = document.getElementById('rubyDailyCountdown');
    if (!el && document.body) {
      el = document.createElement('div');
      el.id = 'rubyDailyCountdown';
      document.body.appendChild(el);
    }
    return el;
  }

  function fmt(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(total / 3600)).padStart(2,'0')}:${String(Math.floor((total % 3600) / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
  }

  async function getSessionUser() {
    const db = getDb();
    if (!db) return null;
    try {
      const { data } = await db.auth.getSession();
      return data?.session?.user || null;
    } catch (_) {
      return null;
    }
  }

  async function status() {
    const db = getDb();
    if (!db) return { eligible: false, next_claim_at: null };
    try {
      const { data, error } = await db.rpc('get_daily_bonus_status', { p_cooldown_seconds: 86400 });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return { eligible: !!row?.eligible, next_claim_at: row?.next_claim_at || null };
    } catch (e) {
      console.warn('Daily bonus status failed:', e);
      return { eligible: false, next_claim_at: null };
    }
  }

  function render(eligible) {
    const gift = ensureGift();
    const timer = countdown();
    if (!gift || !timer) return;
    if (!loggedInState) {
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
    if (remaining <= 0) {
      // One status refresh when the local countdown expires; never poll RPC every second.
      refreshStatus();
      return;
    }
    timer.textContent = `⏳ ${fmt(remaining)}`;
  }

  async function refreshStatus() {
    const user = await getSessionUser();
    loggedInState = !!user;
    if (!loggedInState) {
      nextClaimAt = null;
      render(false);
      return;
    }
    const state = await status();
    nextClaimAt = state.next_claim_at || null;
    render(state.eligible);
  }

  async function claim() {
    const gift = ensureGift();
    if (!loggedInState) {
      await refreshStatus();
      return;
    }
    const db = getDb();
    if (!db) return;
    gift.disabled = true;
    try {
      const { data, error } = await db.rpc('claim_daily_bonus', { p_bonus: BONUS, p_cooldown_seconds: 86400 });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.ok) {
        const top = document.getElementById('energyValue');
        if (top) top.textContent = String(row.energy);
      }
      await refreshStatus();
    } catch (e) {
      console.error('Daily bonus claim failed:', e);
      await refreshStatus();
    }
  }

  function bindAuth() {
    if (authBound) return;
    const db = getDb();
    if (!db) return;
    authBound = true;
    db.auth.onAuthStateChange((_event, session) => {
      loggedInState = !!session?.user;
      nextClaimAt = null;
      // Defer the RPC until after the auth callback completes.
      setTimeout(refreshStatus, 0);
    });
  }

  function start() {
    ensureGift();
    bindAuth();
    // Initial status check happens once; it no longer blocks page rendering.
    setTimeout(refreshStatus, 0);
    // Update only the local countdown. No network request every second.
    refreshTimer = setInterval(() => render(false), 1000);
    const observer = new MutationObserver(() => {
      removeOtherGiftUI();
      ensureGift();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  const wait = setInterval(() => {
    if (document.body) {
      clearInterval(wait);
      start();
    }
  }, 50);
})();
