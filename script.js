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

// Replace the original initials treatment with Samar's uploaded local portrait.
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
}

document.getElementById('year').textContent = new Date().getFullYear();
