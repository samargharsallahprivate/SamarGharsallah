// Load the portfolio motion layer after the base styles.
const motionStyles = document.createElement('link');
motionStyles.rel = 'stylesheet';
motionStyles.href = 'animations.css';
document.head.appendChild(motionStyles);

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

// Add the Certificates navigation link to the home page.
if (nav && !nav.querySelector('[href="certificates.html"]')) {
  const certificatesLink = document.createElement('a');
  certificatesLink.href = 'certificates.html';
  certificatesLink.textContent = 'Certificates';
  nav.insertBefore(certificatesLink, nav.querySelector('.nav-contact'));
}

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Replace the initials placeholder with Samar's uploaded portrait.
const portraitCard = document.querySelector('.portrait-card');
const portraitFallback = document.querySelector('.portrait-fallback');
if (portraitCard && portraitFallback) {
  const portrait = document.createElement('img');
  portrait.src = 'assets/Pic_Samar.jpg';
  portrait.alt = 'Samar Gharsallah, AI and Business Intelligence professional';
  portrait.width = 600;
  portrait.height = 600;
  portrait.style.cssText = 'width:100%;height:100%;display:block;object-fit:cover;object-position:center top;';
  portraitFallback.replaceWith(portrait);
  portrait.addEventListener('error', () => {
    portrait.remove();
    portraitCard.insertAdjacentHTML('afterbegin', '<div class="portrait-fallback"><span>S</span><span>G</span></div>');
  }, { once: true });
}

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

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });
  }

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 42);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

// Turn certificate cards into a responsive carousel only on the certificates page.
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
  viewport.tabIndex = 0;
  viewport.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1); });
  viewport.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  viewport.addEventListener('touchend', (event) => { const distance = event.changedTouches[0].screenX - touchStartX; if (Math.abs(distance) > 40) { move(distance > 0 ? -1 : 1); restartTimer(); } }, { passive: true });
  const stopTimer = () => window.clearInterval(timer);
  const restartTimer = () => { stopTimer(); if (!reducedMotion) timer = window.setInterval(() => move(1), 6500); };
  section.addEventListener('mouseenter', stopTimer);
  section.addEventListener('mouseleave', restartTimer);
  section.addEventListener('focusin', stopTimer);
  section.addEventListener('focusout', restartTimer);
  window.addEventListener('resize', render, { passive: true });
  render();
  restartTimer();
}

document.getElementById('year').textContent = new Date().getFullYear();
