/**
 * MahaVastu Blog - Client Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const blogGrid = document.getElementById('blogGrid');
  const searchInput = document.getElementById('searchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const zoneButtons = document.querySelectorAll('.zone-btn');
  const zoneDetailPanel = document.getElementById('zoneDetailPanel');
  const header = document.querySelector('.main-header');

  let currentCategory = 'all';
  let searchQuery = '';

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Render Blog Grid
  function renderPosts() {
    if (!blogGrid || !window.BLOG_POSTS) return;

    const filtered = window.BLOG_POSTS.filter(post => {
      const matchesCategory = currentCategory === 'all' || 
        post.category.toLowerCase().includes(currentCategory.toLowerCase()) ||
        post.element.toLowerCase() === currentCategory.toLowerCase();
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' || 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.zone.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      blogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFF; border-radius: 16px; border: 1px dashed var(--mv-sand-dark);">
          <h3 style="margin-bottom: 8px; color: var(--mv-dark);">No Articles Found</h3>
          <p style="color: var(--mv-text-secondary);">Try changing your search terms or elemental filter.</p>
          <button id="resetSearchBtn" style="margin-top: 16px; padding: 8px 20px; background: var(--mv-red); color: #fff; border-radius: 9999px; font-weight: 600;">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          searchInput.value = '';
          currentCategory = 'all';
          filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
          renderPosts();
        });
      }
      return;
    }

    blogGrid.innerHTML = filtered.map(post => `
      <article class="blog-card" onclick="window.open('article.html?id=${post.id}', '_blank')" data-id="${post.id}">
        <div class="card-img-wrap">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
          <div class="card-zone-tag">
            <span>📍 ${post.zone}</span>
            <span>•</span>
            <span>${post.element}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="category-tag">${post.category}</span>
            <span>•</span>
            <span>${post.readTime}</span>
          </div>
          <h3 class="card-title">${post.title}</h3>
          <p class="card-excerpt">${post.excerpt}</p>
          <div class="card-footer">
            <span>By ${post.author.name}</span>
            <a href="article.html?id=${post.id}" target="_blank" class="read-more-btn" onclick="event.stopPropagation()">
              Read Full Article ↗
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter;
      renderPosts();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPosts();
    });
  }

  // Interactive Direction Guide (Zone switcher)
  window.selectZone = function(zoneKey) {
    const data = window.ZONE_GUIDE_DATA[zoneKey];
    if (!data || !zoneDetailPanel) return;

    zoneButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.zone === zoneKey);
    });

    zoneDetailPanel.innerHTML = `
      <div class="zone-badge-meta">
        <span class="badge-element" style="background: ${data.color};">Element: ${data.element}</span>
        <span class="badge-deity">Presiding Deity: ${data.deity}</span>
      </div>
      <h3 class="zone-title">${data.name}</h3>
      <p class="zone-attributes">${data.attribute}</p>
      
      <div class="zone-info-grid">
        <div class="info-item">
          <h6>Harmonious Colors</h6>
          <p>${data.colorName}</p>
        </div>
        <div class="info-item">
          <h6>Directional Chakra Angle</h6>
          <p>${data.name.split('(')[1] ? data.name.split('(')[1].replace(')', '') : 'Cardinal Axis'}</p>
        </div>
      </div>

      <div class="remedy-highlight">
        <h5>MahaVastu Balanced Remedies &amp; Cures</h5>
        <p>${data.remedy}</p>
      </div>

      <div style="margin-top: 18px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.85rem; color: var(--mv-text-muted);">Have questions about this zone?</span>
        <a href="https://wa.me/917998566666?text=Hi%20Montu%20Singh%20Sir,%20I%20have%20an%20enquiry%20regarding%20the%20${encodeURIComponent(data.name)}%20zone." target="_blank" class="btn-primary" style="font-size: 0.8rem; padding: 6px 14px;">
          Ask on WhatsApp
        </a>
      </div>
    `;
  };

  zoneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const zoneKey = btn.dataset.zone;
      window.selectZone(zoneKey);
    });
  });

  // Initial renders
  renderPosts();
  window.selectZone('north');
});
