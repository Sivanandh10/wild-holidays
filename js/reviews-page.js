window.whRenderReviewCard = (r, isNew = false) => `
  <article class="review-card${isNew ? ' review-card--new' : ''}" data-id="${r.id || ''}">
    <div class="review-card__header">
      <div class="review-card__stars" aria-label="${r.rating} out of 5 stars">${whStars(r.rating)}</div>
      <span class="review-card__tag">${r.destination} Journey</span>
    </div>
    <blockquote class="review-card__quote">
      “${r.text}”
    </blockquote>
    <div class="review-card__meta">
      <div class="review-card__guest">
        <span class="review-card__name">${r.name}</span>
        <span class="review-card__location">${r.city || 'Explorer'}</span>
      </div>
      <span class="review-card__date">${r.date || 'Just now'}</span>
    </div>
  </article>`;

window.whRenderReviews = (container, filter = 'all', limit = null, newId = null) => {
  if (!container) return;
  let list = whGetAllReviews();
  if (filter !== 'all') list = list.filter((r) => r.destination.toLowerCase() === filter.toLowerCase());
  if (limit) list = list.slice(0, limit);
  container.innerHTML = list.length
    ? list.map((r) => whRenderReviewCard(r, newId && r.id === newId)).join('')
    : '<p style="color:var(--muted);">No reviews yet. Be the first!</p>';
};

window.whShowToast = (msg) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
};

window.whInitReviewFilters = () => {
  const grid = document.getElementById('reviewsGrid');
  const chips = document.querySelectorAll('[data-review-filter]');
  if (!grid) return;
  whRenderReviews(grid);
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      whRenderReviews(grid, chip.dataset.reviewFilter);
    });
  });
};

window.whInitReviewForm = (opts = {}) => {
  const form = document.getElementById('reviewForm');
  if (!form) return;

  const targets = (opts.targets || ['#reviewsGrid', '#homeReviews']).map((s) => document.querySelector(s)).filter(Boolean);
  let rating = 5;
  let lastReview = null;
  const stars = form.querySelectorAll('.star-picker button');

  stars.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      rating = i + 1;
      stars.forEach((s, j) => s.classList.toggle('active', j < rating));
    });
  });
  stars.forEach((s, j) => s.classList.toggle('active', j < rating));

  const saveAndRender = async (review) => {
    // 1. Fetch latest reviews list from the cloud first to prevent overwrites
    let latestOnline = [];
    try {
      const res = await fetch(WH_KVDB_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) latestOnline = data;
      } else if (res.status === 404) {
        latestOnline = [];
      }
    } catch (err) {
      console.warn('Could not fetch latest cloud reviews for merging:', err);
      latestOnline = window.WH_CLOUD_REVIEWS; // fallback to in-memory list
    }

    // 2. Prepend the new review
    latestOnline.unshift(review);
    window.WH_CLOUD_REVIEWS = latestOnline;

    // 3. Render immediately on page
    whUpdateTrustStats();
    targets.forEach((el) => {
      const limit = el.id === 'homeReviews' ? (opts.limit || 3) : null;
      whRenderReviews(el, 'all', limit, review.id);
    });
    const newEl = document.querySelector(`[data-id="${review.id}"]`);
    if (newEl) newEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // 4. Save the merged array back to KVdb.io
    try {
      await fetch(WH_KVDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(latestOnline)
      });
    } catch (err) {
      console.warn('Failed to upload review to cloud:', err);
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const review = {
      id: Date.now(),
      name: fd.get('name') || 'Traveler',
      city: fd.get('city') || '',
      destination: fd.get('destination') || 'General',
      rating,
      photo: '',
      text: fd.get('text') || '',
      date: 'Just now'
    };
    lastReview = review;
    saveAndRender(review);
    form.reset();
    rating = 5;
    stars.forEach((s, j) => s.classList.toggle('active', j < 5));
    whShowToast('Review published! Thank you for sharing.');
  });

  document.getElementById('reviewWhatsApp')?.addEventListener('click', () => {
    const fd = new FormData(form);
    const name = fd.get('name') || 'Traveler';
    const text = fd.get('text') || '';
    if (!text) { whShowToast('Please write a review first.'); return; }
    whWhatsApp(`New Review for Wild Holidays\n\nName: ${name}\nDestination: ${fd.get('destination')}\nRating: ${rating}/5\n\n${text}`);
  });
};

window.whUpdateTrustStats = () => {
  const all = whGetAllReviews();
  document.querySelectorAll('[data-avg-rating]').forEach((el) => { el.textContent = whAvgRating(); });
  document.querySelectorAll('[data-review-count]').forEach((el) => { el.textContent = all.length + '+'; });
};

window.whRenderDestCards = (container) => {
  if (!container || !window.WH_DESTINATIONS) return;
  container.innerHTML = WH_DESTINATIONS.map((d) => `
    <a class="dest-card" href="places/${d.slug}.html">
      <div class="dest-card__img"><img src="${d.image.replace('w=1400', 'w=500')}" alt="${d.name}" loading="lazy" width="320" height="200" /></div>
      <div class="dest-card__body">
        <h3>${d.name}</h3>
        <p>${d.story.slice(0, 72)}…</p>
        <div class="dest-card__meta"><span>${d.duration}</span><strong>${d.price}</strong></div>
      </div>
    </a>`).join('');
};
