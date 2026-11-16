/* Rule-based help box: no AI and no API. It matches keywords to answers we wrote ourselves; anything else goes to a message form.
   Colours come from the page: --hc-bg --hc-fg --hc-muted --hc-line --hc-accent --hc-accent-fg --hc-font --hc-radius */
(function () {
  const EMAIL = 'hello@hirakmotion.com';
  const A = [
    { id: 'what', q: 'What is H-02?', k: /\b(what is|what's|tell me|about|h-?0?2|actuator|product)\b/i,
      a: 'H-02 is our cycloidal actuator. A 5010 outrunner motor drives two cycloidal discs inside a ring of 41 pins, for a 40:1 reduction. The housing is Ø70 × 62 mm and printed in PLA. It is built and running, and we are measuring it on the bench now.', next: ['specs', 'buy'] },
    { id: 'specs', q: 'How much torque?', k: /\b(torque|nm|n·m|newton|spec|specs|strength|power|speed|rpm|backlash|weight|mass)\b/i,
      a: 'Torque, backlash and mass are on the bench now. We will publish the numbers together with how we measured them, so they can be checked. What we know from the design: 40:1 ratio, 0.65 mm eccentricity, two discs offset by half a lobe, and 17 bearings.', next: ['buy', 'open'] },
    { id: 'buy', q: 'Can I buy one?', k: /\b(buy|price|cost|order|purchase|ship|shipping|deliver|available|availability|quote|sample)\b/i,
      a: 'H-02 is a working prototype, not a catalogue product yet. For research and student projects we can build a small number on request. Tell us what your joint needs (torque, speed, size, voltage) and we will say honestly what we can do and when.', next: ['custom', 'contact'] },
    { id: 'custom', q: 'Can you build a custom actuator?', k: /\b(custom|design|build|make|bespoke|my robot|my arm|my leg|joint|ratio)\b/i,
      a: 'We can look at it. Send us the joint\'s peak and continuous torque, top speed, size limit, supply voltage and how you talk to it (CAN, RS-485, PWM). We reply with a proposal or with the reasons it will not work.', next: ['contact'] },
    { id: 'student', q: 'Do you help student projects?', k: /\b(student|university|college|school|discount|thesis|research|lab)\b/i,
      a: 'We like student and lab projects, since that is where we come from. Write to us with what you are building and what each joint needs. We read every message.', next: ['contact'] },
    { id: 'drive', q: 'What drives the motor?', k: /\b(foc|driver|drive|esc|controller|encoder|can|rs-?485|current|firmware|electronics)\b/i,
      a: 'Today H-02 runs on a hobby drone ESC, which is enough for lift and back-drive tests. Our own field-oriented drive with current sensing, an encoder input and CAN is in development, starting from open reference designs.', next: ['open'] },
    { id: 'open', q: 'Will the design be open?', k: /\b(open|source|cad|step|stl|files|github|download|licen[cs]e)\b/i,
      a: 'Yes. We plan to publish the H-02 CAD and the bench data once the test results are in. Follow along on X (@hirakmotion) or GitHub (hirakmotion).', next: ['contact'] },
    { id: 'where', q: 'Where are you based?', k: /\b(where|india|location|based|city|country|team|who)\b/i,
      a: 'We design, print and test in India.', next: ['contact'] },
    { id: 'contact', q: 'How do I reach you?', k: /\b(contact|email|mail|reach|talk|call|phone|whatsapp|message)\b/i,
      a: `Email ${EMAIL}, or leave a message here and we will reply by email.`, form: true },
  ];
  const byId = Object.fromEntries(A.map(x => [x.id, x]));
  const PRIORITY = ['buy', 'specs', 'custom', 'student', 'drive', 'open', 'contact', 'where', 'what'];
  function match(text) {   // most keyword hits wins; the general 'what is it' answer only when nothing else fits
    let best = null, score = 0;
    for (const id of PRIORITY) { const n = (text.match(new RegExp(byId[id].k.source, 'gi')) || []).length; if (n > score) { best = byId[id]; score = n; } }
    return best;
  }
  const style = `
  .hc-launch{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:60;font:500 14px/1 var(--hc-font,system-ui);color:var(--hc-accent-fg,#fff);background:var(--hc-accent,#111);border:0;border-radius:var(--hc-radius,6px);padding:13px 16px;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.18)}
  .hc-launch:focus-visible,.hc-panel button:focus-visible,.hc-panel input:focus-visible,.hc-panel textarea:focus-visible{outline:2px solid var(--acc,var(--hc-accent,#111));outline-offset:2px}
  .hc-panel{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:61;width:min(380px,calc(100vw - 32px));max-height:min(560px,calc(100vh - 110px));display:flex;flex-direction:column;background:var(--hc-bg,#fff);color:var(--hc-fg,#111);border:1px solid var(--hc-line,#ddd);border-radius:var(--hc-radius,6px);box-shadow:0 18px 60px rgba(0,0,0,.22);font:15px/1.45 var(--hc-font,system-ui)}
  .hc-panel[hidden]{display:none}
  .hc-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--hc-line,#ddd)}
  .hc-head b{display:block;font-weight:600}.hc-head small{display:block;color:var(--hc-muted,#666);font-size:12.5px;margin-top:2px}
  .hc-x{background:none;border:0;color:var(--hc-fg,#111);font-size:20px;line-height:1;cursor:pointer;padding:2px 4px}
  .hc-log{overflow:auto;scrollbar-width:thin;scrollbar-color:var(--hc-line,#ccc) transparent;padding:14px 16px;display:flex;flex-direction:column;gap:10px;min-height:120px}
  .hc-m{max-width:88%;padding:9px 12px;border-radius:var(--hc-radius,6px);white-space:pre-wrap}
  .hc-bot{background:var(--hc-soft,rgba(127,127,127,.12));align-self:flex-start}
  .hc-me{background:var(--hc-accent,#111);color:var(--hc-accent-fg,#fff);align-self:flex-end}
  .hc-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px}
  .hc-chip{font:13px/1.2 var(--hc-font,system-ui);background:transparent;color:var(--hc-fg,#111);border:1px solid var(--hc-line,#ccc);border-radius:var(--hc-radius,6px);padding:7px 10px;cursor:pointer}
  .hc-chip:hover{border-color:var(--hc-fg,#111)}
  .hc-in{display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--hc-line,#ddd)}
  .hc-in input{flex:1;min-width:0;font:16px var(--hc-font,system-ui);color:var(--hc-fg,#111);background:transparent;border:1px solid var(--hc-line,#ccc);border-radius:var(--hc-radius,6px);padding:9px 10px}
  .hc-in button,.hc-f button{font:500 14px var(--hc-font,system-ui);background:var(--hc-accent,#111);color:var(--hc-accent-fg,#fff);border:0;border-radius:var(--hc-radius,6px);padding:9px 14px;cursor:pointer}
  .hc-f{display:grid;gap:8px;align-self:stretch}
  .hc-f label{font-size:12.5px;color:var(--hc-muted,#666);display:grid;gap:4px}
  .hc-f input,.hc-f textarea{font:16px var(--hc-font,system-ui);color:var(--hc-fg,#111);background:transparent;border:1px solid var(--hc-line,#ccc);border-radius:var(--hc-radius,6px);padding:8px 9px}
  .hc-addr{user-select:all;font-weight:600}
  @media (prefers-reduced-motion:no-preference){.hc-panel{animation:hcIn .18s ease-out}@keyframes hcIn{from{transform:translateY(8px);opacity:.6}to{transform:none;opacity:1}}}`;
  function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function init() {
    const st = el('style'); st.textContent = style; document.head.appendChild(st);
    const launch = el('button', 'hc-launch', matchMedia('(max-width:760px)').matches ? 'Questions' : (document.body.dataset.chatLabel || 'Questions about H-02'));
    launch.setAttribute('aria-expanded', 'false'); launch.setAttribute('aria-controls', 'hc-panel');
    const panel = el('div', 'hc-panel'); panel.id = 'hc-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Questions about Hirak Motion');
    const head = el('div', 'hc-head'); const h = el('div'); h.append(el('b', '', 'Hirak Motion'), el('small', '', 'Answers we wrote ourselves. For anything else, we reply by email.'));
    const x = el('button', 'hc-x', '×'); x.setAttribute('aria-label', 'Close'); head.append(h, x);
    const log = el('div', 'hc-log'); log.setAttribute('aria-live', 'polite');
    const chips = el('div', 'hc-chips');
    const form = el('form', 'hc-in'); const inp = el('input'); inp.id = 'hc-input'; inp.placeholder = 'Ask about H-02, custom joints, or ordering'; inp.setAttribute('aria-label', 'Your question'); inp.autocomplete = 'off';
    const send = el('button', '', 'Ask'); send.type = 'submit'; form.append(inp, send);
    panel.append(head, log, chips, form); document.body.append(launch, panel);
    const say = (t, who) => { const m = el('div', 'hc-m ' + (who === 'me' ? 'hc-me' : 'hc-bot'), t); log.append(m); log.scrollTop = log.scrollHeight; return m; };
    function setChips(ids) { chips.replaceChildren(...ids.map(id => { const b = el('button', 'hc-chip', byId[id].q); b.type = 'button'; b.onclick = () => ask(byId[id].q, byId[id]); return b; })); }
    function contactForm() {
      const f = el('form', 'hc-f hc-m hc-bot');
      const l1 = el('label', '', 'Your email'); const e1 = el('input'); e1.type = 'email'; e1.required = true; e1.id = 'hc-mail'; l1.append(e1);
      const l2 = el('label', '', 'Your message'); const e2 = el('textarea'); e2.rows = 3; e2.required = true; e2.id = 'hc-msg'; l2.append(e2);
      const b = el('button', '', 'Send message'); b.type = 'submit'; f.append(l1, l2, b);
      f.addEventListener('submit', async ev => {
        ev.preventDefault(); b.disabled = true; b.textContent = 'Sending…';
        const ok = window.hirakSend ? await window.hirakSend({ email: e1.value.trim(), message: e2.value.trim() }, 'Question from the website chat') : false;
        f.replaceWith(say(ok ? 'Sent. We will reply by email.' : 'That did not go through. Please email ' + EMAIL + '.'));
      });
      log.append(f); log.scrollTop = log.scrollHeight;
    }
    function ask(text, forced) {
      say(text, 'me');
      const hit = forced || match(text);
      setTimeout(() => {
        if (hit) { say(hit.a); setChips(hit.next || ['what', 'buy', 'custom']); if (hit.form) contactForm(); }
        else { say("We don't have a written answer for that yet. Leave your email and question, and we'll reply."); setChips(['what', 'specs', 'buy']); contactForm(); }
      }, 220);
    }
    let opened = false;
    function toggle(open) {
      panel.hidden = !open; launch.setAttribute('aria-expanded', String(open));
      if (open && !opened) { opened = true; say('Hi. Ask about the H-02 actuator, custom joints, or ordering. Or pick one below.'); setChips(['what', 'specs', 'buy', 'custom', 'student']); }
      if (open) inp.focus(); else launch.focus();
    }
    launch.onclick = () => toggle(panel.hidden); x.onclick = () => toggle(false);
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
    form.addEventListener('submit', e => { e.preventDefault(); const t = inp.value.trim(); if (!t) return; inp.value = ''; ask(t); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
