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
    if (!em.value || !em.checkValidity()) { em.setAttribute('aria-invalid', 'true'); note.dataset.state = 'error'; note.textContent = 'Add an email address so we can reply.'; em.focus(); return; }
    em.removeAttribute('aria-invalid');
    const data = {
      email: v('r-email'), 'Peak torque (N·m)': v('r-peak'), 'Continuous torque (N·m)': v('r-cont'), 'Top speed (rpm)': v('r-speed'),
      'Max diameter (mm)': v('r-dia'), 'Supply (V)': v('r-volt'), Interface: v('r-bus'), Quantity: v('r-qty'), Application: v('r-notes'),
    };
    if (btn.disabled) return;
    btn.disabled = true; btn.textContent = 'Sending…'; delete note.dataset.state; note.textContent = '';
    const ok = await window.hirakSend(data, 'Joint specs from ' + data.email);
    btn.disabled = false; btn.textContent = 'Send specs';
    const mail = (window.HIRAK || {}).email || 'hello@hirakmotion.com';
    if (ok) { note.dataset.state = 'ok'; note.textContent = 'Sent. We have your specs and will reply by email.'; form.reset(); }
    else { note.dataset.state = 'error'; note.innerHTML = 'That did not go through. Please email <a class="addr" href="mailto:' + mail + '">' + mail + '</a>.'; }
  });
})();
