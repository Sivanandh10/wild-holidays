const WH = {
  filters: { destination: 'all', budget: 'all', tag: 'all', search: '' },
  plannerData: { group: '', destination: '', budget: '', month: '', travellers: '' },
  plannerStep: 0
};

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initNavigation() {
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navBackdrop');
  const header = document.querySelector('.site-header');
  if (!toggle || !drawer) return;

  const close = () => {
    toggle.classList.remove('open');
    drawer.classList.remove('open');
    backdrop?.classList.remove('open');
    header?.classList.remove('nav-open');
    document.body.style.overflow = '';
  };

  const open = () => {
    toggle.classList.add('open');
    drawer.classList.add('open');
    backdrop?.classList.add('open');
    header?.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  backdrop?.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}

function initHero() {
  const hero = document.querySelector('.hero--home');
  if (!hero) return;

  const slides = hero.querySelectorAll('.hero__slide');
  const dotsWrap = document.getElementById('heroDots');
  if (!slides.length) return;

  let current = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  const dots = dotsWrap?.querySelectorAll('button') || [];

  const goTo = (idx) => {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;
  };

  setInterval(() => goTo((current + 1) % slides.length), 6000);
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => obs.observe(el));
}

function renderPackages() {
  const grid = document.getElementById('packagesGrid');
  if (!grid || !window.WH_PACKAGES) return;

  grid.innerHTML = WH_PACKAGES.map((pkg) => `
    <article class="package-card glass-card" data-id="${pkg.id}"
      data-destination="${pkg.destination.toLowerCase()}" data-budget="${pkg.budget}"
      data-tags="${pkg.tags.join(',')}">
      <div class="package-card__image">
        <img src="${pkg.image.replace('w=900', 'w=500')}" alt="${pkg.title}" loading="lazy" width="360" height="200" />
      </div>
      <div class="package-card__body">
        <p class="eyebrow">${pkg.destination}</p>
        <h3>${pkg.title}</h3>
        <p style="font-size:0.85rem;color:var(--muted);margin:0;">${pkg.story}</p>
        <div class="package-card__meta"><span>${pkg.duration}</span></div>
        <button class="btn btn-whatsapp btn-sm btn-block btn-book" data-pkg="${pkg.id}">Book on WhatsApp</button>
      </div>
    </article>`).join('');

  grid.querySelectorAll('.btn-book').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pkg = WH_PACKAGES.find((p) => p.id === btn.dataset.pkg);
      if (pkg) whWhatsApp(whBookMessage(pkg));
    });
  });
}

function filterPackages() {
  document.querySelectorAll('.package-card').forEach((card) => {
    const { destination, tag, search } = WH.filters;
    const show =
      (destination === 'all' || card.dataset.destination === destination) &&
      (tag === 'all' || card.dataset.tags.includes(tag)) &&
      (!search || card.textContent.toLowerCase().includes(search.toLowerCase()));
    card.classList.toggle('hidden', !show);
  });
}

function initPackageFilters() {
  if (!document.getElementById('packagesGrid')) return;
  renderPackages();
  document.querySelectorAll('[data-filter]').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll(`[data-filter-group="${chip.dataset.filterGroup}"]`).forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      WH.filters[chip.dataset.filterGroup] = chip.dataset.filter;
      filterPackages();
    });
  });
  document.getElementById('packageSearch')?.addEventListener('input', (e) => {
    WH.filters.search = e.target.value;
    filterPackages();
  });
}

function initPlanner() {
  const panels = document.querySelectorAll('.planner-box .planner__panel');
  const indicators = document.querySelectorAll('.planner__step-indicator');
  const btnNext = document.getElementById('plannerNext');
  const btnPrev = document.getElementById('plannerPrev');
  const btnSubmit = document.getElementById('plannerSubmit');
  if (!panels.length) return;

  const steps = ['group', 'destination', 'budget', 'month', 'travellers'];

  const updateUI = () => {
    panels.forEach((p, i) => p.classList.toggle('active', i === WH.plannerStep));
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === WH.plannerStep);
      ind.classList.toggle('done', i < WH.plannerStep);
    });
    if (btnPrev) btnPrev.style.visibility = WH.plannerStep === 0 ? 'hidden' : 'visible';
    if (btnNext) btnNext.style.display = WH.plannerStep === steps.length - 1 ? 'none' : 'inline-flex';
    if (btnSubmit) btnSubmit.style.display = WH.plannerStep === steps.length - 1 ? 'inline-flex' : 'none';
  };

  document.querySelectorAll('.planner__option').forEach((opt) => {
    opt.addEventListener('click', () => {
      const panel = opt.closest('.planner__panel');
      if (!panel) return;
      panel.querySelectorAll('.planner__option').forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      WH.plannerData[steps[WH.plannerStep]] = opt.dataset.value;
    });
  });

  btnNext?.addEventListener('click', () => { if (WH.plannerStep < steps.length - 1) { WH.plannerStep++; updateUI(); } });
  btnPrev?.addEventListener('click', () => { if (WH.plannerStep > 0) { WH.plannerStep--; updateUI(); } });
  btnSubmit?.addEventListener('click', () => {
    const d = WH.plannerData;
    whWhatsApp(`Hello Wild Holidays!\n\nPlan a trip:\nWith: ${d.group || '—'}\nDestination: ${d.destination || '—'}\nBudget: ${d.budget || '—'}\nMonth: ${d.month || '—'}\nTravelers: ${d.travellers || '—'}`);
  });
  updateUI();
}

function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(btn);

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initPlaceSliders() {
  const sliders = document.querySelectorAll('.place-hero-slider');
  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll('.slider-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const btnPrev = slider.querySelector('.prev-arrow');
    const btnNext = slider.querySelector('.next-arrow');
    if (!slides.length) return;

    let activeIdx = 0;
    let timer = null;

    const showSlide = (idx) => {
      activeIdx = (idx + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === activeIdx));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIdx));
    };

    const startTimer = () => {
      stopTimer();
      timer = setInterval(() => {
        showSlide(activeIdx + 1);
      }, 4000);
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    btnPrev?.addEventListener('click', () => {
      stopTimer();
      showSlide(activeIdx - 1);
      startTimer();
    });

    btnNext?.addEventListener('click', () => {
      stopTimer();
      showSlide(activeIdx + 1);
      startTimer();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopTimer();
        showSlide(i);
        startTimer();
      });
    });

    startTimer();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initNavigation();
  initHero();
  initReveal();
  initPackageFilters();
  initPlanner();
  initScrollTop();
  initPlaceSliders();
});
