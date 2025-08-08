// SteveSpace Live — modern interactive JS
(() => {
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    }
  };

  const themeBtn = $("#themeBtn");
  const pref = store.get("steve_theme90s", false);
  if (pref) document.body.classList.add("mode-90s");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("mode-90s");
    store.set("steve_theme90s", document.body.classList.contains("mode-90s"));
  });

  const visitKey = "stevespace_visits_live";
  const visits = (parseInt(localStorage.getItem(visitKey) || "0", 10) + 1);
  localStorage.setItem(visitKey, visits);
  $("#visitCounter").textContent = String(visits).padStart(6, "0");

  $$(".statbar > span").forEach((el) => {
    const t = parseFloat(el.dataset.target || "0.5");
    requestAnimationFrame(() => {
      el.style.transition = "width 900ms ease-out";
      el.style.width = (t * 100) + "%";
    });
  });

  const top8 = $("#top8");
  const friendSeeds = store.get("steve_top8", null) || Array.from({length: 8}, (_,i) => `friend-${i}-${Math.random().toString(36).slice(2,7)}`);
  store.set("steve_top8", friendSeeds);

  function renderTop8(list) {
    top8.innerHTML = "";
    list.forEach((seed, idx) => {
      const card = document.createElement("div");
      card.className = "friend"; card.draggable = true;
      card.innerHTML = `<img src="https://picsum.photos/seed/${seed}/220/220" alt="Friend ${idx+1}">
                        <div>Friend ${idx+1} <span class="star" title="Star">☆</span></div>`;
      const star = $(".star", card);
      star.style.cursor = "pointer";
      star.addEventListener("click", (e) => {
        e.stopPropagation();
        const i = list.indexOf(seed);
        list.unshift(list.splice(i,1)[0]);
        store.set("steve_top8", list);
        renderTop8(list);
        pop("⭐");
      });

      card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer.setData("text/plain", seed);
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
      card.addEventListener("dragover", (e) => e.preventDefault());
      card.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragged = e.dataTransfer.getData("text/plain");
        const from = list.indexOf(dragged);
        const to = idx;
        if (from >= 0 && to >= 0 && from !== to) {
          list.splice(to, 0, list.splice(from, 1)[0]);
          store.set("steve_top8", list);
          renderTop8(list);
        }
      });

      top8.appendChild(card);
    });
  }
  renderTop8(friendSeeds);
  $("#shuffleTopBtn").addEventListener("click", () => {
    friendSeeds.sort(() => Math.random() - 0.5);
    store.set("steve_top8", friendSeeds);
    renderTop8(friendSeeds);
    pop("🔀");
  });

  const playlist = [
    { title: "Sum 41 — In Too Deep (preview)", url: "https://cdn.pixabay.com/download/audio/2022/03/31/audio_02e0e44b2b.mp3?filename=blink-182-style-pop-punk-112199.mp3" },
    { title: "Indie Rock Loop", url: "https://cdn.pixabay.com/download/audio/2022/10/21/audio_0c83a5bb40.mp3?filename=indie-rock-123135.mp3" },
    { title: "Nostalgic Synthwave", url: "https://cdn.pixabay.com/download/audio/2022/03/22/audio_9f1e872e8b.mp3?filename=retrowave-ambient-110879.mp3" }
  ];
  let track = 0;
  const audio = new Audio();
  const playBtn = $("#playBtn");
  const npTitle = $("#npTitle");
  const npProgress = $("#npProgress");

  function load(i) {
    track = (i + playlist.length) % playlist.length;
    audio.src = playlist[track].url;
    npTitle.textContent = playlist[track].title;
    audio.play().catch(()=>{});
    playBtn.textContent = "⏸";
  }
  playBtn.addEventListener("click", () => {
    if (audio.paused) { audio.play(); playBtn.textContent = "⏸"; }
    else { audio.pause(); playBtn.textContent = "▶︎"; }
  });
  audio.addEventListener("timeupdate", () => {
    const p = (audio.currentTime / (audio.duration || 1)) * 100;
    npProgress.style.width = p + "%";
  });
  audio.addEventListener("ended", () => load(track+1));
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.code === "Space") { e.preventDefault(); playBtn.click(); }
    if (e.code === "ArrowRight") load(track+1);
    if (e.code === "ArrowLeft") load(track-1);
  });
  load(0);

  const gallery = $("#gallery");
  const seeds = store.get("steve_gallery", null) || [
    "trees", "cars", "catzz", "skate", "flowers", "city", "phone", "stars", "pizza"
  ].map(s => s + "-" + Math.random().toString(36).slice(2, 6));
  store.set("steve_gallery", seeds);

  function layoutGallery() {
    const W = gallery.clientWidth;
    const H = Math.max(gallery.clientHeight, 360);
    const margin = 20;
    seeds.forEach((seed, i) => {
      let card = $(`.polaroid[data-seed="${seed}"]`, gallery);
      if (!card) {
        card = document.createElement("div");
        card.className = "polaroid";
        card.dataset.seed = seed;
        card.style.setProperty("--rot", (Math.random()*10-5)+"deg");
        card.innerHTML = `<img src="https://picsum.photos/seed/${seed}/500/380" alt="${seed}">
                          <div class="cap">${seed.replace(/-.+$/, '')}</div>`;
        gallery.appendChild(card);
        makeDraggable(card);
      }
      const x = Math.random() * (W - 240 - margin) + margin;
      const y = Math.random() * (H - 220 - margin) + margin;
      card.style.left = x + "px";
      card.style.top = y + "px";
    });
  }
  function makeDraggable(el) {
    let sx=0, sy=0, ox=0, oy=0, down=false;
    el.addEventListener("pointerdown", (e) => {
      down = true; el.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(el.style.left||"0"); oy = parseFloat(el.style.top||"0");
      el.style.boxShadow = "0 12px 28px rgba(0,0,0,.5)";
    });
    el.addEventListener("pointermove", (e) => {
      if (!down) return;
      const nx = ox + (e.clientX - sx);
      const ny = oy + (e.clientY - sy);
      el.style.left = nx + "px"; el.style.top = ny + "px";
    });
    el.addEventListener("pointerup", (e) => {
      down = false; el.releasePointerCapture(e.pointerId);
      el.style.boxShadow = "0 8px 20px rgba(0,0,0,.35)";
    });
    el.addEventListener("dblclick", () => { pop("📸"); });
  }

  layoutGallery();
  window.addEventListener("resize", layoutGallery);
  $("#shuffleGalleryBtn").addEventListener("click", () => {
    gallery.innerHTML = "";
    seeds.sort(() => Math.random()-0.5);
    layoutGallery();
    pop("🔀");
  });

  const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"];
  const buffer = [];
  window.addEventListener("keydown", (e) => {
    buffer.push(e.code); buffer.splice(0, buffer.length - konami.length);
    if (konami.every((k,i) => buffer[i] === k)) confetti();
  });

  const canvas = $("#fx"); const ctx = canvas.getContext("2d");
  let W=0,H=0; function size(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; } size(); addEventListener("resize", size);
  const parts = [];
  function addParticle(x,y,emoji) {
    parts.push({x,y, vx:(Math.random()*2-1)*2, vy: -Math.random()*2-1, a:1, r: (Math.random()*0.5+0.6), t:emoji});
  }
  function pop(emoji="✦"){
    const x = Math.random()*W, y = Math.random()*H*.7 + 30;
    for (let i=0;i<18;i++) addParticle(x,y,emoji);
  }
  $("#confettiBtn").addEventListener("click", () => confetti());

  function confetti() {
    for (let n=0;n<12;n++) pop(["✦","★","✸","❇","✨","💿","🛹","🎸"][Math.floor(Math.random()*8)]);
  }
  addEventListener("pointermove", (e) => {
    if (Math.random() < 0.2) addParticle(e.clientX, e.clientY, ["✦","★","✸","❇","✨"][Math.floor(Math.random()*5)]);
  });

  function tick() {
    ctx.clearRect(0,0,W,H);
    parts.forEach(p => {
      p.vy += 0.02; p.x += p.vx; p.y += p.vy; p.a -= 0.008;
      ctx.save();
      ctx.globalAlpha = Math.max(p.a,0);
      ctx.font = (18*p.r) + "px system-ui, emoji";
      ctx.fillText(p.t, p.x, p.y);
      ctx.restore();
    });
    for (let i=parts.length-1;i>=0;i--) if (parts[i].a <= 0) parts.splice(i,1);
    requestAnimationFrame(tick);
  }
  tick();

})();