(function () {
  const C = window.WEDDING;
  const $ = (s) => document.querySelector(s);

  /* ---------- Theme ---------- */
  const themes = ["sage", "forest", "mint"];
  function setTheme(t) {
    if (!themes.includes(t)) t = C.defaultTheme;
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
  }
  const qTheme = new URLSearchParams(location.search).get("theme");
  let saved = null; try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(qTheme || saved || C.defaultTheme);
  document.querySelectorAll("#themeBar button").forEach((b) =>
    b.addEventListener("click", () => setTheme(b.dataset.theme)));
  // Hiện thanh chọn theme khi thêm ?pick=1 vào URL (để bạn thử, khách không thấy)
  if (new URLSearchParams(location.search).has("pick")) $("#themeBar").classList.remove("hidden");

  /* ---------- Images (fallback to gradient if file is missing) ---------- */
  function bg(el, url) {
    const img = new Image();
    img.onload = () => (el.style.backgroundImage = `url("${url}")`);
    img.src = url;
  }
  // Bìa và đầu trang dùng nền màu trơn (gradient xanh), không dùng ảnh.
  document.querySelectorAll(".portrait").forEach((p) => bg(p, p.dataset.img));

  const grid = $("#gallery-grid");
  C.gallery.forEach((src) => {
    const d = document.createElement("div"); d.className = "ph";
    const i = document.createElement("img"); i.loading = "lazy"; i.alt = "Ảnh cưới";
    i.onerror = () => d.remove();
    d.appendChild(i);
    i.src = src;
    d.addEventListener("click", () => {
      const lb = document.createElement("div"); lb.className = "lightbox";
      const big = new Image(); big.src = src; big.alt = ""; lb.appendChild(big);
      lb.onclick = () => lb.remove(); document.body.appendChild(lb);
    });
    grid.appendChild(d);
  });

  /* ---------- Music (YouTube IFrame API) ---------- */
  let player = null, ready = false, wantPlay = false;
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("ytHolder", {
      width: "200", height: "200", videoId: C.youtubeId,
      playerVars: { autoplay: 0, loop: 1, playlist: C.youtubeId, controls: 0, playsinline: 1 },
      events: {
        onReady: () => { ready = true; if (wantPlay) play(); },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) setBtn(true);
          if (e.data === YT.PlayerState.PAUSED) setBtn(false);
        },
      },
    });
  };
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(tag);

  const musicBtn = $("#musicBtn");
  function setBtn(on) { musicBtn.classList.toggle("playing", on); musicBtn.classList.toggle("muted", !on); }
  function play() { wantPlay = true; if (ready) { player.playVideo(); } }
  function pause() { wantPlay = false; if (ready) player.pauseVideo(); setBtn(false); }
  musicBtn.addEventListener("click", () => (musicBtn.classList.contains("playing") ? pause() : play()));

  /* ---------- Open cover ---------- */
  $("#openBtn").addEventListener("click", () => {
    play(); // user gesture → cho phép phát nhạc
    $("#cover").classList.add("closing");
    $("#main").classList.remove("hidden");
    musicBtn.classList.remove("hidden");
    setTimeout(() => $("#cover").remove(), 900);
    observe();
  });

  /* ---------- Reveal on scroll ---------- */
  function observe() {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- Countdown ---------- */
  const target = new Date(C.dateISO).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let d = Math.max(0, target - Date.now());
    const D = Math.floor(d / 864e5); d -= D * 864e5;
    const H = Math.floor(d / 36e5); d -= H * 36e5;
    const M = Math.floor(d / 6e4); d -= M * 6e4;
    $("#cdD").textContent = D; $("#cdH").textContent = pad(H);
    $("#cdM").textContent = pad(M); $("#cdS").textContent = pad(Math.floor(d / 1e3));
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Add to calendar (.ics) ---------- */
  $("#calBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const s = new Date(C.dateISO), en = new Date(s.getTime() + 3 * 36e5);
    const f = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
      `DTSTART:${f(s)}`, `DTEND:${f(en)}`, `SUMMARY:${C.title}`,
      `LOCATION:${C.location} (${C.lat},${C.lng})`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "dam-cuoi.ics"; a.click();
  });

  /* ---------- RSVP form ---------- */
  const form = $("#rsvpForm"), msg = $("#formMsg"), btn = $("#submitBtn");
  form.addEventListener("change", () => {
    const no = form.attending.value === "Không";
    $("#guestsWrap").style.display = no ? "none" : "";
    $("#stayWrap").style.display = no ? "none" : "";
  });
  function say(t, ok) { msg.textContent = t; msg.className = "form-msg " + (ok ? "ok" : "err"); }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // bot
    if (!form.name.value.trim()) return say("Vui lòng nhập họ tên.", false);
    if (!form.attending.value) return say("Vui lòng chọn bạn có tham dự không.", false);
    if (!C.rsvpEndpoint) return say("Form chưa được kết nối Google Sheet (xem README.md).", false);

    btn.disabled = true; say("Đang gửi...", true);
    const body = new URLSearchParams({
      name: form.name.value.trim(),
      attending: form.attending.value,
      guests: form.attending.value === "Có" ? form.guests.value : "0",
      stay: form.attending.value === "Có" ? form.stay.value : "",
      message: form.message.value.trim(),
    });
    try {
      // no-cors: Apps Script không trả CORS header, nhưng dữ liệu vẫn được ghi
      await fetch(C.rsvpEndpoint, { method: "POST", mode: "no-cors", body });
      form.reset(); $("#guestsWrap").style.display = ""; $("#stayWrap").style.display = "";
      say("Cảm ơn bạn! Chúng mình đã nhận được xác nhận ♡", true);
    } catch (err) {
      say("Có lỗi khi gửi, bạn thử lại giúp mình nhé.", false);
    } finally { btn.disabled = false; }
  });
})();
