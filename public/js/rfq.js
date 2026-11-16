/* "Send your specs" form at the bottom of the page. */
(function () {
  const form = document.getElementById('rfq-form');
  if (!form) return;
  const note = document.getElementById('r-note');
  const btn = form.querySelector('button[type=submit]');
  const v = id => (document.getElementById(id).value || '').trim();
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.querySelector('[name=_honey]').value) return;   // bots fill the hidden field
    const em = document.getElementById('r-email');
    if (!em.value || !em.checkValidity()) { note.textContent = 'Add your email so we can reply.'; em.focus(); return; }
    const data = {
      email: v('r-email'), 'Peak torque (N·m)': v('r-peak'), 'Continuous torque (N·m)': v('r-cont'), 'Top speed (rpm)': v('r-speed'),
      'Max diameter (mm)': v('r-dia'), 'Supply (V)': v('r-volt'), Interface: v('r-bus'), Quantity: v('r-qty'), Application: v('r-notes'),
    };
    btn.disabled = true; note.textContent = 'Sending…';
    const ok = await window.hirakSend(data, 'Joint specs from ' + data.email);
    btn.disabled = false;
    if (ok) { note.textContent = 'Thank you. Your specs reached us, and we reply by email.'; form.reset(); }
    else { note.innerHTML = 'That did not go through. Please email <span class="addr">' + (window.HIRAK || {}).email + '</span>.'; }
  });
})();
