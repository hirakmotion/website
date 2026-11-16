/* Scroll-scrubbed exploded view: draws pre-rendered Blender frames on a canvas.
   Markup: <section data-explode data-frames="72" data-path="assets/seq/f" data-ext=".webp">
             <div class="x-stick"><canvas></canvas> ... <ol class="x-parts"><li data-at="0.1">…</li></ol></div></section>
   Each list item with data-at (0..1) becomes active once the scroll progress passes it. */
(function () {
  function mount(sec) {
    const n = +sec.dataset.frames || 72, path = sec.dataset.path, ext = sec.dataset.ext || '.webp';
    const canvas = sec.querySelector('canvas'), ctx = canvas.getContext('2d');
    const items = [...sec.querySelectorAll('[data-at]')];
    const meter = sec.querySelector('[data-x-meter]');
    const frames = new Array(n); let shown = -1, want = 0, ticking = false;
    const pad = i => String(i).padStart(3, '0');
    function load(i) {
      if (frames[i]) return frames[i];
      const im = new Image(); im.decoding = 'async'; im.src = path + pad(i) + ext;
      im.onload = () => { if (i === want) draw(i, true); };
      frames[i] = im; return im;
    }
    // first frame immediately, the rest progressively
    load(0); load(n - 1);
    let k = 1; (function more() { for (let j = 0; j < 6 && k < n - 1; j++, k++) load(k); if (k < n - 1) setTimeout(more, 60); })();
    function size() {
      const r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d); shown = -1; draw(want, true);
    }
    function nearestLoaded(i) {
      for (let s = 0; s < n; s++) { for (const j of [i - s, i + s]) { const f = frames[j]; if (f && f.complete && f.naturalWidth) return j; } }
      return -1;
    }
    function draw(i, force) {
      const j = nearestLoaded(i); if (j < 0 || (j === shown && !force)) return;
      const im = frames[j], cw = canvas.width, ch = canvas.height;
      const s = Math.min(cw / im.naturalWidth, ch / im.naturalHeight);
      const w = im.naturalWidth * s, h = im.naturalHeight * s;
      ctx.clearRect(0, 0, cw, ch); ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h); shown = j;
    }
    function progress() {
      const r = sec.getBoundingClientRect(), vh = window.innerHeight;
      const total = r.height - vh; if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -r.top / total));
    }
    function update() {
      ticking = false;
      const p = progress(); want = Math.round(p * (n - 1)); draw(want);
      let active = -1; items.forEach((li, idx) => { if (p >= +li.dataset.at) active = idx; });
      items.forEach((li, idx) => li.classList.toggle('is-active', idx === active));
      if (meter) meter.style.setProperty('--p', p.toFixed(3));
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', size);
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(canvas);
    size(); update();
  }
  function init() { document.querySelectorAll('[data-explode]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
