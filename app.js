// News Reading Application Main Controller

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    apiKey: utils.storage.get('news_api_key', ''),
    theme: utils.storage.get('theme', 'light'),
    category: 'general',
    query: '',
    page: 1,
    pageSize: 9,
    totalResults: 0,
    articles: []
  };

  // Supported Categories
  const CATEGORIES = [
    { id: 'general', name: 'General', icon: 'globe' },
    { id: 'technology', name: 'Technology', icon: 'cpu' },
    { id: 'business', name: 'Business', icon: 'briefcase' },
    { id: 'sports', name: 'Sports', icon: 'trophy' },
    { id: 'health', name: 'Health', icon: 'activity' },
    { id: 'science', name: 'Science', icon: 'flask' },
    { id: 'entertainment', name: 'Entertainment', icon: 'tv' }
  ];

  // DOM Elements Selection
  const el = {
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),
    settingsToggleBtn: document.getElementById('settings-toggle-btn'),
    settingsModal: document.getElementById('settings-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalSaveBtn: document.getElementById('modal-save-btn'),
    modalClearBtn: document.getElementById('modal-clear-btn'),
    apiKeyInput: document.getElementById('api-key-input'),
    toggleKeyVisibility: document.getElementById('toggle-key-visibility'),
    eyeIcon: document.getElementById('eye-icon'),
    searchInput: document.getElementById('search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    categoriesWrapper: document.getElementById('categories-wrapper'),
    sectionTitle: document.getElementById('section-title'),
    resultsCount: document.getElementById('results-count'),
    newsGridContainer: document.getElementById('news-grid-container'),
    paginationControls: document.getElementById('pagination-controls'),
    prevPageBtn: document.getElementById('prev-page-btn'),
    nextPageBtn: document.getElementById('next-page-btn'),
    currentPageNum: document.getElementById('current-page-num'),
    modeExplanation: document.getElementById('mode-explanation')
  };

  // Init App
  function init() {
    // 1. Initialise Icons
    lucide.createIcons();

    // 2. Set Theme
    applyTheme(state.theme);

    // 3. Update Key & Badge UI
    el.apiKeyInput.value = state.apiKey;
    updateBadgeUI();

    // 4. Render Category Tabs
    renderCategories();

    // 5. Load Initial Headlines
    // Try to load cached data for instant load satisfaction (Stretch goal)
    const cacheKey = `cached_news_${state.category}_${state.page}`;
    const cachedData = utils.storage.get(cacheKey);
    if (cachedData && !state.apiKey) {
      state.articles = cachedData.articles || [];
      state.totalResults = cachedData.totalResults || 0;
      renderArticles(state.articles);
    } else {
      loadNews();
    }

    // 6. Bind Event Listeners
    setupEventListeners();
  }

  // Theme Management
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    utils.storage.set('theme', theme);
    
    // Update theme toggle icon
    if (theme === 'dark') {
      el.themeIcon.setAttribute('data-lucide', 'sun');
      el.themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    } else {
      el.themeIcon.setAttribute('data-lucide', 'moon');
      el.themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    }
    lucide.createIcons({
      attrs: { id: 'theme-icon' },
      name: 'theme-icon'
    });
  }

  function toggleTheme() {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
  }

  // Update Badge Info based on active mode
  function updateBadgeUI() {
    if (state.apiKey) {
      el.modeExplanation.innerHTML = `<strong>Live Mode:</strong> Fetching active news from NewsAPI endpoints. Ensure your API Key stays active and private.`;
    } else {
      el.modeExplanation.innerHTML = `<strong>Demo Mode:</strong> Powered by curated mock news data. Perfect for offline review, portfolio showcase, and avoiding API rate limits.`;
    }
  }

  // Render Category Tabs
  function renderCategories() {
    el.categoriesWrapper.innerHTML = CATEGORIES.map(cat => `
      <button class="category-pill glass ${state.category === cat.id ? 'active' : ''}" data-category="${cat.id}">
        ${cat.name}
      </button>
    `).join('');

    // Attach click events
    el.categoriesWrapper.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedCategory = e.currentTarget.getAttribute('data-category');
        if (state.category === selectedCategory && !state.query) return;

        // Clear search inputs
        state.query = '';
        el.searchInput.value = '';
        el.searchClearBtn.classList.remove('active');

        // Set Category and Reset Page
        state.category = selectedCategory;
        state.page = 1;

        // Update Pill UI
        el.categoriesWrapper.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Fetch
        loadNews();
      });
    });
  }

  // Main Loader Manager
  async function loadNews() {
    // 1. Show Shimmering Skeletons
    renderSkeletons();
    el.paginationControls.style.display = 'none';

    // 2. Set Header/Section Details
    if (state.query) {
      el.sectionTitle.textContent = `Search Results: "${state.query}"`;
    } else {
      const activeCat = CATEGORIES.find(c => c.id === state.category);
      el.sectionTitle.textContent = `${activeCat ? activeCat.name : 'Latest'} Headlines`;
    }

    try {
      if (state.apiKey) {
        // Fetch real data from NewsAPI
        let url;
        if (state.query) {
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(state.query)}&page=${state.page}&pageSize=${state.pageSize}&apiKey=${state.apiKey}`;
        } else {
          url = `https://newsapi.org/v2/top-headlines?country=us&category=${state.category}&page=${state.page}&pageSize=${state.pageSize}&apiKey=${state.apiKey}`;
        }

        const res = await fetch(url);
        
        // NewsAPI returns standard status codes
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const errMsg = errorData.message || `Request failed with status ${res.status}`;
          throw new Error(errMsg);
        }

        const data = await res.json();
        state.articles = data.articles || [];
        state.totalResults = data.totalResults || 0;

        // Cache results in localStorage for demo backup
        const cacheKey = `cached_news_${state.category}_${state.page}`;
        utils.storage.set(cacheKey, { articles: state.articles, totalResults: state.totalResults });

      } else {
        // Fallback Mock Mode (Simulate network latency)
        await new Promise(resolve => setTimeout(resolve, 600));

        let localArticles = [];
        if (state.query) {
          localArticles = window.searchMockNews(state.query);
        } else {
          localArticles = window.MOCK_NEWS[state.category] || [];
        }

        state.totalResults = localArticles.length;
        
        // Paginate locally
        const start = (state.page - 1) * state.pageSize;
        const end = start + state.pageSize;
        state.articles = localArticles.slice(start, end);
      }

      // 3. Render Results
      if (state.articles.length === 0) {
        renderEmptyState();
      } else {
        renderArticles(state.articles);
        setupPaginationUI();
      }

    } catch (err) {
      console.error('Fetch error:', err);
      // Friendly, context-specific error message
      let friendlyMessage = err.message;
      if (err.message.includes('apiKey') || err.message.includes('401')) {
        friendlyMessage = 'The API key provided is invalid or has expired. Please check your credentials in the Settings.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
        friendlyMessage = 'Network connection blocked. NewsAPI developer plans are restricted to localhost and may fail on public domains due to CORS restrictions.';
      }
      renderErrorState(friendlyMessage);
    }
  }

  // Render Shimmer Skeletons
  function renderSkeletons() {
    el.resultsCount.textContent = 'Fetching articles...';
    let skeletonHtml = '';
    for (let i = 0; i < state.pageSize; i++) {
      skeletonHtml += `
        <div class="skeleton-card glass">
          <div class="skeleton-img shimmer"></div>
          <div class="skeleton-body">
            <div class="skeleton-badge shimmer"></div>
            <div class="skeleton-title shimmer"></div>
            <div class="skeleton-title-short shimmer"></div>
            <div class="skeleton-desc shimmer"></div>
            <div class="skeleton-desc shimmer"></div>
            <div class="skeleton-desc-short shimmer"></div>
            <div class="skeleton-footer">
              <div class="skeleton-btn shimmer"></div>
              <div class="skeleton-btn shimmer"></div>
            </div>
          </div>
        </div>
      `;
    }
    el.newsGridContainer.innerHTML = skeletonHtml;
  }

  // Render Success Articles List
  function renderArticles(articles) {
    el.resultsCount.textContent = `Showing ${articles.length} of ${state.totalResults} results`;
    
    el.newsGridContainer.innerHTML = articles.map(art => {
      // Parse details safely
      const imgUrl = art.urlToImage;
      const title = art.title || 'Untitled Article';
      const description = art.description || 'No description available for this headline. Click Read Full Article to view full story details.';
      const source = art.source ? art.source.name : 'Unknown Source';
      const relativeDate = utils.timeAgo(art.publishedAt);
      const articleCategory = state.query ? 'Search Result' : state.category;

      return `
        <article class="news-card glass">
          <div class="card-img-wrapper">
            ${imgUrl ? `
              <img src="${imgUrl}" 
                   alt="${title}" 
                   class="card-img" 
                   loading="lazy" 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            ` : ''}
            <div class="card-img-fallback" style="${imgUrl ? 'display:none;' : 'display:flex;'}">
              <i data-lucide="image-off" style="width: 32px; height: 32px;"></i>
              <span style="font-size: 0.8rem; font-weight: 500;">No Image Available</span>
            </div>
            <span class="card-badge">${articleCategory}</span>
          </div>
          <div class="card-body">
            <div class="card-source-bar">
              <span class="source-name">${source}</span>
              <span class="publish-time">${relativeDate}</span>
            </div>
            <h3 class="card-title" title="${title}">${title}</h3>
            <p class="card-desc">${description}</p>
            <div class="card-footer">
              <a href="${art.url}" target="_blank" rel="noopener noreferrer" class="card-link">
                Read full article
                <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Re-trigger Lucide icon instantiation for dynamic content
    lucide.createIcons();
  }

  // Render Empty Results State
  function renderEmptyState() {
    el.resultsCount.textContent = 'No results';
    el.newsGridContainer.innerHTML = `
      <div class="status-panel glass" style="grid-column: 1 / -1;">
        <div class="status-icon">
          <i data-lucide="search-code" style="width: 32px; height: 32px;"></i>
        </div>
        <h3 class="status-title">No Articles Found</h3>
        <p class="status-desc">We couldn't find any news matches for "${state.query || state.category}". Try clearing filters or using another keyword query.</p>
        <button class="primary-btn" id="empty-reset-btn">Reset Search</button>
      </div>
    `;
    
    document.getElementById('empty-reset-btn').addEventListener('click', resetSearchState);
    lucide.createIcons();
  }

  // Render Error Response State
  function renderErrorState(message) {
    el.resultsCount.textContent = 'Failed to load';
    el.newsGridContainer.innerHTML = `
      <div class="status-panel error glass" style="grid-column: 1 / -1;">
        <div class="status-icon">
          <i data-lucide="alert-triangle" style="width: 32px; height: 32px;"></i>
        </div>
        <h3 class="status-title">Retrieval Failed</h3>
        <p class="status-desc">${message}</p>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn-secondary" id="error-settings-btn">Open Settings</button>
          <button class="primary-btn" id="error-retry-btn">Retry Fetch</button>
        </div>
      </div>
    `;

    document.getElementById('error-retry-btn').addEventListener('click', loadNews);
    document.getElementById('error-settings-btn').addEventListener('click', openSettingsModal);
    lucide.createIcons();
  }

  // Setup Pagination Visibility & Actions
  function setupPaginationUI() {
    const totalPages = Math.ceil(state.totalResults / state.pageSize);
    
    if (totalPages > 1) {
      el.paginationControls.style.display = 'flex';
      el.currentPageNum.textContent = `Page ${state.page} of ${totalPages}`;
      el.prevPageBtn.disabled = state.page === 1;
      el.nextPageBtn.disabled = state.page === totalPages;
    } else {
      el.paginationControls.style.display = 'none';
    }
  }

  // Clear/Reset Search to default GeneralCategory
  function resetSearchState() {
    state.query = '';
    state.category = 'general';
    state.page = 1;
    el.searchInput.value = '';
    el.searchClearBtn.classList.remove('active');
    renderCategories();
    loadNews();
  }

  // Modal Window Controls
  function openSettingsModal() {
    el.apiKeyInput.value = state.apiKey;
    el.settingsModal.classList.add('active');
  }

  function closeSettingsModal() {
    el.settingsModal.classList.remove('active');
    // Hide password characters again when closing
    el.apiKeyInput.type = 'password';
    el.eyeIcon.setAttribute('data-lucide', 'eye');
    lucide.createIcons({
      attrs: { id: 'eye-icon' },
      name: 'eye-icon'
    });
  }

  // Event Listeners Binding
  function setupEventListeners() {
    // 1. Theme Toggle
    el.themeToggleBtn.addEventListener('click', toggleTheme);

    // 2. Settings Modal Toggle
    el.settingsToggleBtn.addEventListener('click', openSettingsModal);
    el.modalCloseBtn.addEventListener('click', closeSettingsModal);
    
    // Close modal if user clicks backdrop
    el.settingsModal.addEventListener('click', (e) => {
      if (e.target === el.settingsModal) closeSettingsModal();
    });

    // Toggle Secret Key Visibility
    el.toggleKeyVisibility.addEventListener('click', () => {
      if (el.apiKeyInput.type === 'password') {
        el.apiKeyInput.type = 'text';
        el.eyeIcon.setAttribute('data-lucide', 'eye-off');
      } else {
        el.apiKeyInput.type = 'password';
        el.eyeIcon.setAttribute('data-lucide', 'eye');
      }
      lucide.createIcons({
        attrs: { id: 'eye-icon' },
        name: 'eye-icon'
      });
    });

    // Save Key Config
    el.modalSaveBtn.addEventListener('click', () => {
      const inputVal = el.apiKeyInput.value.trim();
      state.apiKey = inputVal;
      utils.storage.set('news_api_key', inputVal);
      
      updateBadgeUI();
      closeSettingsModal();
      
      // Reload news with new connection configurations
      state.page = 1;
      loadNews();
    });

    // Clear Key Config (Reset to Mock Mode)
    el.modalClearBtn.addEventListener('click', () => {
      state.apiKey = '';
      utils.storage.remove('news_api_key');
      el.apiKeyInput.value = '';
      
      updateBadgeUI();
      closeSettingsModal();

      state.page = 1;
      loadNews();
    });

    // 3. Debounced Keyword Search (Stretch Goal)
    const handleSearchInput = utils.debounce((e) => {
      const val = e.target.value.trim();
      state.query = val;
      state.page = 1;

      // Update clear icon visibility
      if (val) {
        el.searchClearBtn.classList.add('active');
        // Unhighlight any active category pill when custom keyword typing
        el.categoriesWrapper.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
      } else {
        el.searchClearBtn.classList.remove('active');
        // Fallback to active state category
        renderCategories();
      }

      loadNews();
    }, 500);

    el.searchInput.addEventListener('input', handleSearchInput);

    // Clear Search Input Click
    el.searchClearBtn.addEventListener('click', () => {
      resetSearchState();
    });

    // 4. Pagination Actions
    el.prevPageBtn.addEventListener('click', () => {
      if (state.page > 1) {
        state.page--;
        loadNews();
      }
    });

    el.nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(state.totalResults / state.pageSize);
      if (state.page < totalPages) {
        state.page++;
        loadNews();
      }
    });
  }

  // Trigger init sequence
  init();
});
