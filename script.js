const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((element) => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((element) => observer.observe(element));
}

// Turn the certificate cards into a responsive, keyboard-accessible carousel.
const certificateGrid = document.querySelector('.certificate-grid');
if (certificateGrid) {
  const carouselStyles = document.createElement('link');
  carouselStyles.rel = 'stylesheet';
  carouselStyles.href = 'carousel.css';
  document.head.appendChild(carouselStyles);

  const section = certificateGrid.closest('.certificate-section');
  const heading = section.querySelector('.certificate-heading');
  const cards = [...certificateGrid.children];
  let page = 0;
  let timer;
  let touchStartX = 0;

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  viewport.setAttribute('aria-label', 'Certificate carousel');
  certificateGrid.before(viewport);
  viewport.appendChild(certificateGrid);
  certificateGrid.classList.add('carousel-track');

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  controls.innerHTML = '<button class="carousel-button carousel-previous" type="button" aria-label="Show previous certificates">←</button><span class="carousel-status" aria-live="polite"></span><button class="carousel-button carousel-next" type="button" aria-label="Show next certificates">→</button>';
  heading.appendChild(controls);

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  dots.setAttribute('aria-label', 'Choose certificate group');
  section.appendChild(dots);

  const getVisibleCards = () => window.innerWidth <= 560 ? 1 : window.innerWidth <= 850 ? 2 : 3;
  const getPageCount = () => Math.ceil(cards.length / getVisibleCards());

  const render = () => {
    const visibleCards = getVisibleCards();
    const pageCount = getPageCount();
    page = Math.min(page, pageCount - 1);
    const gap = 16;
    const cardWidth = (viewport.clientWidth - gap * (visibleCards - 1)) / visibleCards;
    certificateGrid.style.transform = `translateX(-${page * visibleCards * (cardWidth + gap)}px)`;
    controls.querySelector('.carousel-status').textContent = `${page + 1} / ${pageCount}`;
    dots.innerHTML = '';
    for (let index = 0; index < pageCount; index += 1) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show certificate group ${index + 1}`);
      dot.setAttribute('aria-current', String(index === page));
      dot.addEventListener('click', () => { page = index; render(); restartTimer(); });
      dots.appendChild(dot);
    }
  };

  const move = (direction) => { page = (page + direction + getPageCount()) % getPageCount(); render(); };
  controls.querySelector('.carousel-previous').addEventListener('click', () => { move(-1); restartTimer(); });
  controls.querySelector('.carousel-next').addEventListener('click', () => { move(1); restartTimer(); });
  viewport.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1); });
  viewport.tabIndex = 0;
  viewport.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  viewport.addEventListener('touchend', (event) => { const distance = event.changedTouches[0].screenX - touchStartX; if (Math.abs(distance) > 40) { move(distance > 0 ? -1 : 1); restartTimer(); } }, { passive: true });

  const stopTimer = () => window.clearInterval(timer);
  const restartTimer = () => {
    stopTimer();
    if (!reducedMotion) timer = window.setInterval(() => move(1), 6500);
  };
  section.addEventListener('mouseenter', stopTimer);
  section.addEventListener('mouseleave', restartTimer);
  section.addEventListener('focusin', stopTimer);
  section.addEventListener('focusout', restartTimer);
  window.addEventListener('resize', render, { passive: true });
  render();
  restartTimer();
}

document.getElementById('year').textContent = new Date().getFullYear();
