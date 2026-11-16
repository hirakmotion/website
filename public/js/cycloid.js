/* Live cycloidal reducer drawn from H-02's real geometry (41 pins on R29, pin r1.25, e 0.65, 6 output rollers on R17).
   Round 3: the real 0.65 mm wobble is ~2% of the drawing, so on its own the animation looked static. Now:
   - Detail A: a magnified loupe on one pin, where the lobes can be seen rolling over it;
   - two dials, Motor and Output, so 40 turns against 1 (and the opposite direction) is obvious;
   - a degree scale with an output needle around the ring, and one lobe marked in copper.
   Markup: <div data-cycloid> <canvas></canvas> + controls data-c="pins|play|kv|volt|torque|eff" and outputs data-o="..." */
(function () {
  const css = (el, name, fb) => (getComputedStyle(el).getPropertyValue(name) || '').trim() || fb;
  function profile(N, R, rp, e, steps) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const psi = Math.atan2(Math.sin((1 - N) * t), R / (e * N) - Math.cos((1 - N) * t));
      pts.push([R * Math.cos(t) - rp * Math.cos(t + psi) - e * Math.cos(N * t), -R * Math.sin(t) + rp * Math.sin(t + psi) + e * Math.sin(N * t)]);
    }
    return pts;
  }
  function mount(root) {
    const cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    const q = s => root.querySelector(`[data-c="${s}"]`), o = s => root.querySelector(`[data-o="${s}"]`);
    const R = 29, rp = 1.25, E = 0.65, STEPS = 1600, ZOOM = 4.5;
    let N = 41, e = E, prof, tip = 0, theta = 0, playing = true, last = 0, dpr = 1;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) playing = false;
    function rebuild() {
      prof = profile(N, R, rp, e, STEPS);
      let best = 0; const lim = Math.ceil(STEPS / (N - 1)) + 2;           // one lobe tip, to mark in copper
      for (let i = 0; i < lim; i++) { const [x, y] = prof[i], r = x * x + y * y; if (r > best) { best = r; tip = i; } }
    }
    rebuild();
    function size() {
      const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); draw();
    }
    const circ = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); };
    let C = {};
    function colors() {
      C = { ink: css(root, '--cy-ink', '#15171a'), acc: css(root, '--cy-accent', '#a94f19'), soft: css(root, '--cy-soft', '#d9dcdc'),
            disc: css(root, '--cy-disc', '#2a2c2f'), muted: css(root, '--cy-muted', '#6b7176'), bg: css(root, '--cy-bg', '#ffffff'),
            font: getComputedStyle(root).fontFamily || 'sans-serif' };
    }
    // the mechanism in model units (mm), drawn with scale s around pixel origin (ox, oy)
    function scene(s, ox, oy, main) {
      ctx.setTransform(s, 0, 0, -s, ox, oy);
      const lw = dpr / s, rot = -theta / (N - 1), cx = e * Math.cos(theta), cy = e * Math.sin(theta);
      ctx.fillStyle = C.soft; ctx.beginPath(); ctx.arc(0, 0, R + 5.5, 0, Math.PI * 2); ctx.arc(0, 0, R + 0.2, 0, Math.PI * 2, true); ctx.fill();
      // disc: sits on the eccentric, turns backwards one lobe per input turn
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      ctx.beginPath(); prof.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ctx.moveTo(16.6 * Math.cos(a) + 6.24, 16.6 * Math.sin(a)); ctx.arc(16.6 * Math.cos(a), 16.6 * Math.sin(a), 6.24, 0, Math.PI * 2, true); }
      ctx.moveTo(9, 0); ctx.arc(0, 0, 9, 0, Math.PI * 2, true);
      ctx.fillStyle = C.disc; ctx.fill('evenodd');
      const [tx, ty] = prof[tip]; ctx.fillStyle = C.acc; circ(tx * 0.955, ty * 0.955, main ? 1.1 : 0.55); ctx.fill();   // the marked lobe
      ctx.restore();
      ctx.fillStyle = C.ink;   // pins, fixed in the ring
      for (let k = 0; k < N; k++) { const a = (2 * Math.PI * k) / N; circ(R * Math.cos(a), R * Math.sin(a), rp); ctx.fill(); }
      for (let k = 0; k < 6; k++) {   // output rollers turn with the output flange
        const a = k * Math.PI / 3 + rot, x = 17 * Math.cos(a), y = 17 * Math.sin(a);
        ctx.fillStyle = C.acc; circ(x, y, 5); ctx.fill(); ctx.fillStyle = C.soft; circ(x, y, 2.4); ctx.fill();
      }
      ctx.strokeStyle = C.acc; ctx.lineWidth = 1.4 * lw; circ(cx, cy, 6); ctx.stroke();   // eccentric cam
      ctx.fillStyle = C.ink; circ(0, 0, 2.6); ctx.fill();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6 * lw; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(5.4 * Math.cos(theta), 5.4 * Math.sin(theta)); ctx.stroke();
      if (!main) return;
      // degree scale and output needle outside the ring
      ctx.strokeStyle = C.muted; ctx.lineWidth = 1 * lw;
      for (let d = 0; d < 360; d += 10) {
        const a = d * Math.PI / 180, r0 = R + 7, r1 = R + (d % 90 ? 8.2 : 9.6);
        ctx.beginPath(); ctx.moveTo(r0 * Math.cos(a), r0 * Math.sin(a)); ctx.lineTo(r1 * Math.cos(a), r1 * Math.sin(a)); ctx.stroke();
      }
      const oa = Math.PI / 2 + rot;
      ctx.fillStyle = C.acc; ctx.beginPath();
      ctx.moveTo((R + 6.2) * Math.cos(oa), (R + 6.2) * Math.sin(oa));
      ctx.lineTo((R + 10.4) * Math.cos(oa + 0.045), (R + 10.4) * Math.sin(oa + 0.045));
      ctx.lineTo((R + 10.4) * Math.cos(oa - 0.045), (R + 10.4) * Math.sin(oa - 0.045)); ctx.closePath(); ctx.fill();
    }
    function text(str, x, y, px, color, align, weight) {
      ctx.font = `${weight || 500} ${px * dpr}px ${C.font}`; ctx.fillStyle = color; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle'; ctx.fillText(str, x, y);
    }
    function dial(x, y, r, ang, label, value, hand) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = C.bg; circ(x, y, r); ctx.fill();
      ctx.strokeStyle = C.soft; ctx.lineWidth = 1.5 * dpr; circ(x, y, r); ctx.stroke();
      ctx.strokeStyle = C.muted; ctx.lineWidth = 1 * dpr;
      for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.82, y - Math.sin(a) * r * 0.82); ctx.lineTo(x + Math.cos(a) * r * 0.94, y - Math.sin(a) * r * 0.94); ctx.stroke(); }
      ctx.strokeStyle = hand; ctx.lineWidth = 2.2 * dpr; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * r * 0.74, y - Math.sin(ang) * r * 0.74); ctx.stroke(); ctx.lineCap = 'butt';
      ctx.fillStyle = hand; circ(x, y, 3 * dpr); ctx.fill();
      text(label, x, y + r + 16 * dpr, 13, C.ink, 'center', 600);
      text(value, x, y + r + 33 * dpr, 12.5, C.muted, 'center', 400);
    }
    function draw() {
      if (!prof) return;
      colors();
      const w = cv.width, h = cv.height, land = w / h >= 1.25;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h);
      let s, ox, oy, L, Lr, D1, D2, Dr;
      if (land) {
        const side = h; s = side / (2 * (R + 12)); ox = side / 2; oy = side / 2;
        const cw = w - side;
        Lr = Math.min(cw * 0.34, h * 0.25); L = [side + cw / 2, h * 0.30];
        Dr = Math.min(cw * 0.15, h * 0.11); D1 = [side + cw * 0.27, h * 0.70]; D2 = [side + cw * 0.73, h * 0.70];
      } else {
        const side = w; s = side / (2 * (R + 12)); ox = side / 2; oy = side / 2;
        const bh = h - side;
        Lr = Math.min(w * 0.21, bh * 0.36); L = [w * 0.25, side + bh * 0.42];
        Dr = Math.min(w * 0.095, bh * 0.2); D1 = [w * 0.62, side + bh * 0.36]; D2 = [w * 0.86, side + bh * 0.36];
      }
      scene(s, ox, oy, true);
      // Detail A: source circle on the main view at the pin at 0 degrees, leader to the loupe
      const P = [R, 0], pr = Lr / ZOOM, px = ox + s * P[0], py = oy - s * P[1];
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1 * dpr; circ(px, py, pr); ctx.stroke();
      const dx = L[0] - px, dy = L[1] - py, dl = Math.hypot(dx, dy) || 1;
      ctx.beginPath(); ctx.moveTo(px + dx / dl * pr, py + dy / dl * pr); ctx.lineTo(L[0] - dx / dl * Lr, L[1] - dy / dl * Lr); ctx.stroke();
      ctx.save(); circ(L[0], L[1], Lr); ctx.clip();
      ctx.fillStyle = C.bg; ctx.fillRect(L[0] - Lr, L[1] - Lr, Lr * 2, Lr * 2);
      const s2 = s * ZOOM; scene(s2, L[0] - s2 * P[0], L[1] + s2 * P[1], false);
      ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5 * dpr; circ(L[0], L[1], Lr); ctx.stroke();
      text(`Detail A · ${ZOOM} : 1`, L[0], L[1] + Lr + 16 * dpr, 12.5, C.muted, 'center', 500);
      const tin = theta / (2 * Math.PI), tout = tin / (N - 1);
      dial(D1[0], D1[1], Dr, Math.PI / 2 + theta, 'Motor', `${tin.toFixed(1)} turns`, C.ink);
      dial(D2[0], D2[1], Dr, Math.PI / 2 - theta / (N - 1), 'Output', `${tout.toFixed(2)} turns`, C.acc);
      text(`${N - 1} : 1`, (D1[0] + D2[0]) / 2, land ? D1[1] : D1[1] - Dr - 14 * dpr, 14, C.ink, 'center', 600);   // phone: dials sit close, so the ratio goes above them
      const set = (k, v) => { const el = o(k); if (el) el.textContent = v; };
      set('in', tin.toFixed(2)); set('out', tout.toFixed(3));
    }
    function calc() {
      const v = k => { const el = q(k); return el ? parseFloat(el.value) : NaN; };
      const ratio = N - 1, kv = v('kv'), volt = v('volt'), tq = v('torque'), eff = v('eff') / 100;
      const set = (k, val) => { const el = o(k); if (el) el.textContent = val; };
      set('ratio', `${ratio}:1`); set('pins', N); set('lobes', N - 1);
      if (kv > 0 && volt > 0) set('rpm', Math.round(kv * volt / ratio).toLocaleString('en-IN'));
      if (kv > 0 && tq > 0 && eff > 0) { const kt = 8.27 / kv; set('amps', (tq / (ratio * eff * kt)).toFixed(1)); set('kt', kt.toFixed(4)); }
    }
    function frame(t) {
      if (playing) { const dt = last ? Math.min(50, t - last) : 16; theta += dt * 0.0032; draw(); }   // motor ~0.5 turn/s
      last = t; if (visible) requestAnimationFrame(frame); else last = 0;
    }
    let visible = false;
    new IntersectionObserver(es => { const v = es.some(e => e.isIntersecting); if (v && !visible) { visible = true; requestAnimationFrame(frame); } else if (!v) visible = false; }).observe(root);
    const pins = q('pins');
    if (pins) pins.addEventListener('input', () => { N = Math.max(7, Math.min(61, Math.round(+pins.value) || 41)); e = Math.min(E, R / (N * 1.05)); rebuild(); calc(); draw(); });
    const play = q('play');
    if (play) { play.textContent = playing ? 'Pause' : 'Play'; play.addEventListener('click', () => { playing = !playing; play.textContent = playing ? 'Pause' : 'Play'; play.setAttribute('aria-pressed', String(!playing)); }); }
    ['kv', 'volt', 'torque', 'eff'].forEach(k => { const el = q(k); if (el) el.addEventListener('input', calc); });
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(cv); else window.addEventListener('resize', size);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    size(); calc();
  }
  function init() { document.querySelectorAll('[data-cycloid]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
