/* Frame-sampled scroll motion: the same response for wheel, touch and keyboard. */
(() => {
  'use strict';
  const state = window.portfolioScroll = { energy: 0, velocity: 0, progress: 0, offset: scrollY / Math.max(1, innerHeight) };
  let previousY = scrollY, raf = 0, lastFrame = 0;
  const allowed = () => window.portfolioMotion !== false && !document.hidden;
  function tick(now) {
    raf = 0;
    if (!allowed()) return;
    const dt = lastFrame ? Math.max(.008, Math.min((now - lastFrame) / 1000, .05)) : 1 / 60;
    lastFrame = now;
    const y = Math.max(0, scrollY), delta = y - previousY;
    previousY = y;
    const target = Math.max(-1, Math.min(1, delta / dt / 1800));
    const blend = 1 - Math.exp(-dt * 7);
    state.velocity += (target - state.velocity) * blend;
    state.energy += (Math.abs(target) - state.energy) * blend;
    const offset = y / Math.max(1, innerHeight);
    state.offset += (offset - state.offset) * (1 - Math.exp(-dt * 5));
    state.progress += (y / Math.max(1, document.documentElement.scrollHeight - innerHeight) - state.progress) * blend;
    if (Math.abs(delta) > .1 || state.energy > .001 || Math.abs(offset - state.offset) > .0001) raf = requestAnimationFrame(tick);
    else { state.energy = state.velocity = 0; state.offset = offset; lastFrame = 0; }
  }
  function schedule() { if (allowed() && !raf) raf = requestAnimationFrame(tick); }
  function reset() {
    cancelAnimationFrame(raf); raf = 0; lastFrame = 0;
    state.energy = state.velocity = 0; previousY = scrollY;
    // Preserve the current pose when pausing; ease toward the page position on resume.
    schedule();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('motionchange', reset);
  document.addEventListener('visibilitychange', reset);
  addEventListener('pagehide', () => { cancelAnimationFrame(raf); raf = 0; });
  addEventListener('pageshow', reset);
  schedule();
})();
