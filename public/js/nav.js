/* Marks the header link of the section that is in the middle of the screen. One observer, no scroll handler. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  const links = [...document.querySelectorAll('.top nav a[href^="#"]')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    const a = links.find(l => l.getAttribute('href') === '#' + e.target.id);
    if (!a) return;
    if (e.isIntersecting) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(l => { const t = document.querySelector(l.getAttribute('href')); if (t) io.observe(t); });
})();
