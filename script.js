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

// Add the Certificates link on the home page without duplicating it on certificates.html.
if (nav && !nav.querySelector('[href="certificates.html"]')) {
  const certificatesLink = document.createElement('a');
  certificatesLink.href = 'certificates.html';
  certificatesLink.textContent = 'Certificates';
  nav.insertBefore(certificatesLink, nav.querySelector('.nav-contact'));
}

// Use Samar's uploaded portrait while retaining an initials fallback if the file is unavailable.
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

// Keep the experience timeline complete and consistent with Samar's resume.
const timeline = document.querySelector('.timeline');
if (timeline) {
  timeline.innerHTML = `
    <article class="timeline-item featured reveal">
      <div class="timeline-date">02/2025 — 08/2025</div>
      <div class="timeline-content">
        <p class="role-type">BRS Shipbrokers</p>
        <h3>Business Intelligence Internship</h3>
        <p>Created a decision-support solution on Microsoft Fabric by integrating Synapse and Power BI.</p>
        <div class="tag-list"><span>Microsoft Fabric</span><span>Synapse</span><span>Power BI</span><span>Azure</span></div>
        <ul><li>Extracted, transformed, and modeled data from Azure and Microsoft Admin Center.</li></ul>
      </div>
    </article>
    <article class="timeline-item reveal">
      <div class="timeline-date">01/2024 — 06/2024</div>
      <div class="timeline-content">
        <p class="role-type">PGS International</p>
        <h3>Business Intelligence Project</h3>
        <p>Contributed to the creation of a decision-support system.</p>
        <div class="tag-list"><span>Data cleaning</span><span>Data transformation</span><span>Decision support</span></div>
      </div>
    </article>
    <article class="timeline-item reveal">
      <div class="timeline-date">2022 — 2024</div>
      <div class="timeline-content">
        <p class="role-type">SDA</p>
        <h3>Community Management & Web Development</h3>
        <p>Created personalized websites with frameworks and supported content management and digital strategy delivery.</p>
        <div class="tag-list"><span>Web development</span><span>Content management</span><span>Digital strategy</span></div>
      </div>
    </article>
    <article class="timeline-item reveal">
      <div class="timeline-date">06/2023 — 08/2023</div>
      <div class="timeline-content">
        <p class="role-type">BNA National Agricultural Bank</p>
        <h3>Internship</h3>
        <p>Analyzed and transformed insurance-related data and created effective dashboards.</p>
        <div class="tag-list"><span>Data analysis</span><span>Data transformation</span><span>Dashboards</span></div>
      </div>
    </article>
    <article class="timeline-item reveal">
      <div class="timeline-date">01/2022 — 12/2022</div>
      <div class="timeline-content">
        <p class="role-type">The Road</p>
        <h3>Virtual Assistant</h3>
        <p>Supported administrative operations, customer relations, events, recruiting, and employee supervision.</p>
        <div class="tag-list"><span>Administration</span><span>Customer relations</span><span>Event coordination</span></div>
        <ul><li>Managed email, agendas, meeting planning, and customer relations.</li><li>Assisted with recruiting and employee supervision.</li></ul>
      </div>
    </article>
    <article class="timeline-item reveal">
      <div class="timeline-date">02/2022 — 06/2022</div>
      <div class="timeline-content">
        <p class="role-type">SQOIN</p>
        <h3>End-of-Study Internship</h3>
        <p>Developed a web application and contributed to database management while exploring blockchain technology and smart contracts.</p>
        <div class="tag-list"><span>Web application</span><span>Database management</span><span>Blockchain</span><span>Smart contracts</span></div>
      </div>
    </article>`;
}

// Add the confirmed Red Crescent period and volunteering experience to community leadership.
const leadershipList = document.querySelector('.leadership-list');
if (leadershipList) {
  leadershipList.innerHTML = `
    <div><span>2023 / 2024</span><strong>Vice President</strong><em>Rotaract Amilcar Sidi Boussaid</em></div>
    <div><span>2022 / 2023</span><strong>Head of Public Interest Committee</strong><em>Rotaract Amilcar Sidi Boussaid</em></div>
    <div><span>2021 / 2022</span><strong>Head of International Committee</strong><em>Rotaract Amilcar Sidi Boussaid</em></div>
    <div><span>2018 / 2019</span><strong>Member of CRT</strong><em>Tunisian Red Crescent</em></div>
    <div><span>December 2018</span><strong>24-Hour Volunteering Experience</strong><em>Tunisian Red Crescent</em></div>`;
}

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
