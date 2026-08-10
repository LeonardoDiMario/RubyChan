// Ruby Chan — authenticated Daily Bonus UI
(function () {
  const BONUS = 25;
  const KEY = 'rubychan_daily_bonus_claimed_at_v2';
  const MMT_OFFSET_MS = 6.5 * 60 * 60 * 1000;

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

  function claimedAt() {
    const value = Number(localStorage.getItem(KEY) || 0);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  function isLoggedIn() {
    const db = getDb();
    return db ? db.auth.getUser().then(({ data }) => !!data?.user).catch(() => false) : Promise.resolve(false);
  }

  function ensureStyle() {
    if (document.getElementById('ruby-daily-bonus-fix-style')) return;
    const style = document.createElement('style');
    style.id = 'ruby-daily-bonus-fix-style';
    style.textContent = `
      #rubyDailyGift.ruby-bonus-visible{display:flex!important;}
      #rubyDailyGift.ruby-bonus-hidden{display:none!important;}
      #rubyDailyGift.ruby-bonus-disabled{opacity:.62;cursor:default;animation:none!important;}
      #rubyDailyCountdown{position:fixed;right:10px;bottom:70px;z-index:9997;min-width:76px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.96);border:1px solid rgba(124,58,237,.16);box-shadow:0 5px 18px rgba(0,0,0,.10);color:#6d28d9;font-size:10px;font-weight:800;text-align:center;white-space:nowrap;}
    `;
    document.head.appendChild(style);
  }

  function mmtDate(ts) {
    return new Date(ts + MMT_OFFSET_MS);
  }

  function formatCountdown(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function ensureCountdown() {
    let el = document.getElementById('rubyDailyCountdown');
    if (!el) {
      el = document.createElement('div');
      el.id = 'rubyDailyCountdown';
      document.body.appendChild(el);
    }
    return el;
  }

  async function addEnergy() {
    const db = getDb();
    if (!db) throw new Error('Supabase is unavailable.');
    const { data: userData, error: userError } = await db.auth.getUser();
    if (userError || !userData?.user) throw new Error('Please login first.');
    const user = userData.user;
    const { data: profile, error: profileError } = await db.from('profiles').select('energy').eq('id', user.id).maybeSingle();
    if (profileError) throw profileError;
    if (!profile) throw new Error('Profile not found.');
    const next = Math.max(0, Number(profile.energy || 0) + BONUS);
    const { data, error } = await db.from('profiles').update({ energy: next, updated_at: new Date().toISOString() }).eq('id', user.id).select('energy').single();
    if (error) throw error;
    const top = document.getElementById('energyValue');
    if (top) top.textContent = String(data.energy);
    return data.energy;
  }

  function wire() {
    ensureStyle();
    const original = document.getElementById('rubyDailyGift');
    if (!original) return;

    let gift = original;
    if (!gift.dataset.rubyBonusFix) {
      gift = original.cloneNode(true);
      gift.dataset.rubyBonusFix = '1';
      original.replaceWith(gift);
      gift.addEventListener('click', async () => {
        if (claimedAt()) return;
        gift.disabled = true;
        try {
          const total = await addEnergy();
          const now = Date.now();
          localStorage.setItem(KEY, String(now));
          gift.classList.remove('ruby-bonus-disabled');
          update();
          const toast = document.getElementById('rubyGiftToast');
          if (toast) {
            toast.textContent = `🎁 Daily bonus claimed! +${BONUS} Energy • ${total} total`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2800);
          }
        } catch (e) {
          const toast = document.getElementById('rubyGiftToast');
          if (toast) {
            toast.textContent = '❌ ' + (e?.message || e);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2800);
          }
        } finally {
          gift.disabled = false;
        }
      });
    }

    update();
  }

  async function update() {
    const gift = document.getElementById('rubyDailyGift');
    if (!gift) return;
    const countdown = ensureCountdown();
    const logged = await isLoggedIn();

    if (!logged) {
      gift.classList.remove('ruby-bonus-visible', 'ruby-bonus-disabled');
      gift.classList.add('ruby-bonus-hidden');
      countdown.style.display = 'none';
      return;
    }

    gift.classList.remove('ruby-bonus-hidden');
    gift.classList.add('ruby-bonus-visible');

    const claimed = claimedAt();
    if (!claimed) {
      gift.classList.remove('ruby-bonus-disabled');
      gift.disabled = false;
      countdown.style.display = 'none';
      return;
    }

    const next = claimed + 24 * 60 * 60 * 1000;
    const remaining = next - Date.now();
    if (remaining <= 0) {
      localStorage.removeItem(KEY);
      gift.classList.remove('ruby-bonus-disabled');
      gift.disabled = false;
      countdown.style.display = 'none';
      return;
    }

    gift.classList.add('ruby-bonus-disabled');
    gift.disabled = true;
    countdown.style.display = 'block';
    countdown.textContent = `⏳ ${formatCountdown(remaining)}`;
  }

  function start() {
    wire();
    setInterval(update, 1000);
    const db = getDb();
    if (db) db.auth.onAuthStateChange(() => setTimeout(update, 100));
  }

  const timer = setInterval(() => {
    if (document.getElementById('rubyDailyGift')) {
      clearInterval(timer);
      start();
    }
  }, 100);
})();
