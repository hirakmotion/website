/* Sends a message to the Hirak inbox through FormSubmit (window.HIRAK.endpoint, set by the page).
   Resolves true when it was accepted. With no endpoint, opens the visitor's email app instead. */
(function () {
  const cfg = window.HIRAK || {};
  window.hirakSend = async function (data, subject) {
    if (!cfg.endpoint) {
      const body = Object.entries(data).map(([k, v]) => k + ': ' + v).join('\n');
      location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      return true;
    }
    try {
      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: subject, _replyto: data.email, _template: 'table' }),
      });
      const json = await res.json().catch(() => ({}));
      return res.ok && String(json.success) !== 'false';
    } catch (e) {
      return false;
    }
  };
})();
