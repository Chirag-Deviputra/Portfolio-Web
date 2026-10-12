/* Scroll-linked art drift: event-driven, bounded, and disabled for reduced motion. */
(() => {
  const cards = [...document.querySelectorAll('.showcase')];
  const desktop = matchMedia('(min-width: 761px)');
  let queued = false;
  function update() {
    queued = false;
    cards.forEach(card => {
      const art = card.querySelector('.exhibit');
      if (!art) return;
      if (!window.portfolioMotion || !desktop.matches) { art.style.removeProperty('--art-y'); return; }
      const box = card.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const offset = Math.max(-18, Math.min(18, (box.top + box.height / 2 - innerHeight / 2) * -.045));
      art.style.setProperty('--art-y', `${offset.toFixed(2)}px`);
    });
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('motionchange', schedule);
  update();
})();
