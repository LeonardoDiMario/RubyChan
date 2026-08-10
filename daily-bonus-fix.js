// Ruby Chan — account-based Daily Bonus (server authoritative)
(function () {
  'use strict';
  if (window.__rubyDailyBonusInstalled) return;
  window.__rubyDailyBonusInstalled = true;

  const BONUS = 25;
  let loggedIn = false, eligible = false, nextClaimAt = null, busy = false, notice = null;

  function db(){ return window.supabaseClient || window.rubySupabase || null; }

  function ensureUI(){
    if(!document.body)return null;
    let gift=document.getElementById('rubyDailyGift');
    if(gift && !gift.dataset.rubyServerBonus){
      // chat-client.js creates the same button and attaches its old localStorage
      // claim handler. Clone it to remove ALL old event listeners before taking over.
      const replacement=gift.cloneNode(true);
      replacement.dataset.rubyServerBonus='1';
      gift.replaceWith(replacement);
      gift=replacement;
    }
    if(!gift){
      gift=document.createElement('button');
      gift.id='rubyDailyGift'; gift.type='button';
      gift.setAttribute('aria-label','Daily Bonus');
      gift.dataset.rubyServerBonus='1';
      document.body.appendChild(gift);
    }
    gift.style.cssText='position:fixed;right:18px;bottom:92px;width:72px;height:72px;z-index:99999;border:0;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);box-shadow:0 9px 26px rgba(124,58,237,.34),0 0 0 4px rgba(255,255,255,.86);color:#fff;font-size:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px;padding:5px;';
    if(!gift.dataset.rubyServerClick){
      gift.addEventListener('click',handleClick);
      gift.dataset.rubyServerClick='1';
    }
    return gift;
  }

  function ensureNotice(){
    if(!document.body)return null;
    let el=document.getElementById('rubyBonusNotice');
    if(!el){
      el=document.createElement('div'); el.id='rubyBonusNotice';
      el.style.cssText='position:fixed;right:18px;bottom:174px;z-index:100000;display:none;max-width:300px;padding:14px 16px;border-radius:16px;background:rgba(31,20,50,.97);color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.22);font-size:13px;line-height:1.55;text-align:center;';
      document.body.appendChild(el);
    }
    return el;
  }

  function fmt(ms){
    const total=Math.max(0,Math.floor(ms/1000));
    return `${String(Math.floor(total/3600)).padStart(2,'0')}:${String(Math.floor((total%3600)/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
  }

  function setNext(v){
    if(!v)return false;
    const t=new Date(v);
    if(Number.isNaN(t.getTime()))return false;
    nextClaimAt=t.toISOString();
    return true;
  }

  function calculateMyanmarNextMidnight(){
    const now=new Date();
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Rangoon',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const y=Number(parts.find(p=>p.type==='year').value);
    const m=Number(parts.find(p=>p.type==='month').value);
    const d=Number(parts.find(p=>p.type==='day').value);
    return new Date(Date.UTC(y,m-1,d+1,0,0,0)-390*60000).toISOString();
  }

  function render(){
    const gift=ensureUI(); if(!gift)return;
    if(!loggedIn){gift.style.display='none';return;}
    gift.style.display='flex';
    if(eligible){
      gift.disabled=false; gift.style.pointerEvents='auto'; gift.style.opacity='1';
      gift.innerHTML=`🎁<span style="font-size:9px;font-weight:900">+${BONUS}</span>`;
      gift.title='Daily Bonus — click to claim +25';
    }else{
      gift.disabled=false; gift.style.pointerEvents='auto'; gift.style.opacity='.72';
      gift.innerHTML='🎁<span style="font-size:8px;font-weight:900">Already claimed</span>';
      gift.title='Already claimed — click to see next claim time';
    }
  }

  function updateNotice(){
    const el=ensureNotice(); if(!el)return;
    if(!nextClaimAt) nextClaimAt=calculateMyanmarNextMidnight();
    const remaining=new Date(nextClaimAt).getTime()-Date.now();
    if(remaining<=0){
      el.innerHTML='<strong>🎁 Bonus ပြန်ယူလို့ရပါပြီ</strong><br><span>အခု ပြန်လာယူပါ</span>';
      el.style.display='block';
      return;
    }
    const target=new Date(nextClaimAt);
    const local=new Intl.DateTimeFormat('my-MM',{timeZone:'Asia/Rangoon',dateStyle:'medium',timeStyle:'short'}).format(target);
    el.innerHTML=`<strong>🎁 Bonus already claimed</strong><br><span>နောက်တစ်ကြိမ် Bonus ယူရန်</span><br><strong style="font-size:22px;letter-spacing:1px">${fmt(remaining)}</strong><br><span style="font-size:11px;opacity:.82">မြန်မာစံတော်ချိန် — ${local}</span><br><span style="font-size:11px;opacity:.78">အချိန်ပြည့်တဲ့အခါ ပြန်လာယူပါ</span>`;
    el.style.display='block';
  }

  function handleClick(event){
    if(event)event.preventDefault();
    if(!loggedIn||busy)return;
    if(!eligible){updateNotice();return;}
    claim();
  }

  async function invoke(action){
    const client=db();
    if(!client)throw new Error('Supabase client unavailable');
    const {data,error}=await client.functions.invoke('daily-bonus',{body:{action}});
    if(error){
      const ctx=error.context; let body=null;
      try{body=ctx?await ctx.json():null;}catch{}
      if(body)throw Object.assign(new Error(body.error||'Daily bonus request failed'),{payload:body});
      throw error;
    }
    return data||{};
  }

  async function refresh(){
    if(busy)return;
    const client=db(); if(!client)return;
    busy=true;
    try{
      const {data:s}=await client.auth.getSession();
      const user=s?.session?.user; loggedIn=!!user;
      if(!user){eligible=false;nextClaimAt=null;render();return;}
      const data=await invoke('status');
      eligible=data?.eligible===true;
      if(!setNext(data?.next_claim_at) && data?.claimed_today===true) nextClaimAt=calculateMyanmarNextMidnight();
      render();
    }catch(e){
      console.warn('Daily Bonus status:',e);
      const p=e?.payload;
      if(p?.claimed_today===true){eligible=false;if(!setNext(p.next_claim_at))nextClaimAt=calculateMyanmarNextMidnight();}
      render();
    }finally{busy=false;}
  }

  async function claim(){
    if(!eligible||busy||!loggedIn)return;
    busy=true;
    try{
      const data=await invoke('claim');
      if(data?.success===true){
        eligible=false;
        if(!setNext(data.next_claim_at))nextClaimAt=calculateMyanmarNextMidnight();
        const energy=document.getElementById('energyValue');
        if(energy&&data.energy!=null)energy.textContent=String(data.energy);
      }else{
        eligible=false;
        if(!setNext(data?.next_claim_at))nextClaimAt=calculateMyanmarNextMidnight();
      }
    }catch(e){
      const p=e?.payload;
      if(p?.claimed_today===true){eligible=false;if(!setNext(p.next_claim_at))nextClaimAt=calculateMyanmarNextMidnight();}
      else console.warn('Daily Bonus claim:',e);
    }finally{busy=false;render();}
  }

  function start(){
    ensureUI(); notice=ensureNotice();
    const client=db();
    if(!client){setTimeout(start,500);return;}
    client.auth.onAuthStateChange(()=>setTimeout(refresh,100));
    refresh();
    setInterval(()=>{
      if(!loggedIn)return;
      if(nextClaimAt&&Date.now()>=new Date(nextClaimAt).getTime()){eligible=true;nextClaimAt=null;refresh();}
      if(notice&&notice.style.display==='block')updateNotice();
    },1000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();