/* OMx Testimonials Autoplay — Dawn-friendly, tiny, accessible */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const root = document.querySelector('.section-omx-testimonials');
  if (!root) return;

  // Find a scrollable slider track (Dawn or custom)
  const track =
    root.querySelector('.slider') || // Dawn <div class="slider">
    root.querySelector('[data-omx-slider]') ||
    root.querySelector('.omx-track');

  if (!track) return;

  const slides = track.querySelectorAll(
    '.slider__slide, [data-omx-slide], .slide'
  );
  if (!slides.length) return;

  const dots = root.querySelectorAll(
    '.slider-counter__link, .dots button, [data-omx-dot]'
  );

  const nextBtn = root.querySelector('.slider-button--next, [data-omx-next]');

  const DURATION = 6000; // 6s per slide (CRO sweet spot)
  const IDLE_AFTER_INTERACT = 10000;

  let i = 0,
    timer = null,
    idleTimer = null,
    playing = false;

  const go = (idx, smooth = true) => {
    i = (idx + slides.length) % slides.length;
    const el = slides[i];
    track.scrollTo({
      left: el.offsetLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
    // dots
    dots.forEach((d, k) =>
      d.setAttribute('aria-current', k === i ? 'true' : 'false')
    );
  };

  const step = () => {
    if (!playing) return;
    if (nextBtn) {
      nextBtn.click();
    } else {
      go(i + 1);
    }
    timer = setTimeout(step, DURATION);
  };

  const play = () => {
    if (playing) return;
    playing = true;
    clearTimeout(timer);
    timer = setTimeout(step, DURATION);
    root.setAttribute('aria-live', 'polite');
  };

  const pause = () => {
    playing = false;
    clearTimeout(timer);
    root.setAttribute('aria-live', 'off');
  };

  const userInteracted = () => {
    pause();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(play, IDLE_AFTER_INTERACT); // resume after 10s
  };

  // Pause when not visible
  const io = new IntersectionObserver(
    (entries) => {
      const v = entries[0].isIntersecting && entries[0].intersectionRatio > 0.4;
      v ? play() : pause();
    },
    { threshold: [0, 0.4, 1] }
  );
  io.observe(root);

  // UX: pause on hover/focus/drag/touch
  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', userInteracted);
  root.addEventListener('pointerdown', userInteracted, { passive: true });
  root.addEventListener('focusin', pause);
  root.addEventListener('focusout', userInteracted);

  // kickoff to current slide without animation
  go(0, false);
})();
