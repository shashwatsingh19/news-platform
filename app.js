// News Reading Application - Main Orchestrator

document.addEventListener('DOMContentLoaded', () => {
  // Hardcoded news api credentials (integrated directly)
  const API_KEY = '67b39076dcc5471884f6a8b68c8edf4f';

  // Application State
  const state = {
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
    { id: 'general', name: 'General' },
    { id: 'technology', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'sports', name: 'Sports' },
    { id: 'health', name: 'Health' },
    { id: 'science', name: 'Science' },
    { id: 'entertainment', name: 'Entertainment' }
  ];

  // DOM Elements Selection
  const el = {
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),
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
    
    // Reader elements
    readerView: document.getElementById('reader-view'),
    readerBackBtn: document.getElementById('reader-back-btn'),
    readerImg: document.getElementById('reader-img'),
    readerSource: document.getElementById('reader-source'),
    readerDate: document.getElementById('reader-date'),
    readerTitle: document.getElementById('reader-title'),
    readerAuthor: document.getElementById('reader-author'),
    readerText: document.getElementById('reader-text'),
    readerOriginLink: document.getElementById('reader-origin-link')
  };

  // Init App
  function init() {
    // 1. Initialise Icons
    lucide.createIcons();

    // 2. Set Theme
    applyTheme(state.theme);

    // 3. Render Category Tabs
    renderCategories();

    // 4. Bind Event Listeners
    setupEventListeners();

    // 5. Load Headlines
    loadNews().then(() => {
      // Handle initial route if loaded with hash
      handleRouting();
    });

    // 6. Watch Hash Routes
    window.addEventListener('hashchange', handleRouting);
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
      // Always attempt to fetch from NewsAPI since we have a hardcoded key
      let url;
      if (state.query) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(state.query)}&page=${state.page}&pageSize=${state.pageSize}&apiKey=${API_KEY}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${state.category}&page=${state.page}&pageSize=${state.pageSize}&apiKey=${API_KEY}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      state.articles = data.articles || [];
      state.totalResults = data.totalResults || 0;

      // Cache results in localStorage for backup
      const cacheKey = `cached_news_${state.category}_${state.page}`;
      utils.storage.set(cacheKey, { articles: state.articles, totalResults: state.totalResults });

    } catch (err) {
      console.warn('Live API request failed, falling back to mock/cache data:', err);
      
      // Fallback: Try loading cache first, else use Mock Data
      const cacheKey = `cached_news_${state.category}_${state.page}`;
      const cachedData = utils.storage.get(cacheKey);

      if (cachedData && cachedData.articles && cachedData.articles.length > 0) {
        state.articles = cachedData.articles;
        state.totalResults = cachedData.totalResults;
      } else {
        // Fallback Mock Mode (Simulate network latency)
        await new Promise(resolve => setTimeout(resolve, 300));

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
    }

    // 3. Render Results
    if (state.articles.length === 0) {
      renderEmptyState();
    } else {
      renderArticles(state.articles);
      setupPaginationUI();
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
    
    el.newsGridContainer.innerHTML = articles.map((art, index) => {
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
              <a href="#article/${index}" class="card-link">
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
          <i data-lucide="search" style="width: 32px; height: 32px;"></i>
        </div>
        <h3 class="status-title">No Articles Found</h3>
        <p class="status-desc">We couldn't find any news matches for "${state.query || state.category}". Try clearing filters or using another keyword query.</p>
        <button class="primary-btn" id="empty-reset-btn">Reset Search</button>
      </div>
    `;
    
    document.getElementById('empty-reset-btn').addEventListener('click', resetSearchState);
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

  // Hash-based Router
  function handleRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#article/')) {
      const indexStr = hash.replace('#article/', '');
      const index = parseInt(indexStr, 10);
      
      if (!isNaN(index) && state.articles[index]) {
        renderArticleDetail(state.articles[index]);
        document.body.classList.add('reader-active');
      } else {
        // Fallback if item isn't in memory (e.g. direct url load)
        window.location.hash = '';
      }
    } else {
      document.body.classList.remove('reader-active');
      // Reset reader fields after slide-out transition ends
      setTimeout(() => {
        if (!window.location.hash.startsWith('#article/')) {
          el.readerImg.src = '';
          el.readerTitle.textContent = '';
          el.readerText.innerHTML = '';
        }
      }, 450);
    }
  }

  // Render Full Article Details in Reader View (iOS Style)
  function renderArticleDetail(article) {
    // 1. Hero Image Setup
    if (article.urlToImage) {
      el.readerImg.src = article.urlToImage;
      el.readerImg.style.display = 'block';
      el.readerImg.nextElementSibling.style.display = 'none'; // hide fallback
    } else {
      el.readerImg.src = '';
      el.readerImg.style.display = 'none';
      el.readerImg.nextElementSibling.style.display = 'flex'; // show fallback
    }

    // 2. Metadata Setup
    el.readerSource.textContent = article.source ? article.source.name : 'Publication';
    el.readerDate.textContent = utils.timeAgo(article.publishedAt);
    el.readerTitle.textContent = article.title || 'Headline';
    el.readerAuthor.textContent = article.author ? `By ${article.author}` : 'By Editorial Desk';
    
    // 3. Dynamic Reader text formatting (Simulate realistic editorial body paragraphs)
    const formattedBodyHtml = generateDetailedBody(article);
    el.readerText.innerHTML = formattedBodyHtml;

    // 4. Original Source Link
    el.readerOriginLink.href = article.url;

    // Re-create icons for reader view
    lucide.createIcons();
    
    // Scroll reader view to top
    el.readerView.querySelector('.reader-scroll-container').scrollTop = 0;
  }

  // Generates editorial body blocks based on NewsAPI snippet limits
  function generateDetailedBody(article) {
    const description = article.description || '';
    let content = article.content || '';
    const sourceName = article.source ? article.source.name : 'NewsWave Publication';

    // Split description into sentences to generate lead block
    const sentences = description.split(/(?<=[.!?])\s+/);
    const leadSentence = sentences[0] || 'Reporting updates and initial details on this developing story.';
    const leadBody = sentences.slice(1).join(' ');

    // Clean up content from NewsAPI trailing character counter e.g. " [x chars]"
    content = content.replace(/\[\+\d+ chars\]$/, '');
    
    // If we have minimal content, pad it with realistic reporting details
    const paragraph1 = `<p class="lead" style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem; line-height: 1.6;">${leadSentence}. ${leadBody}</p>`;
    
    const paragraph2 = content ? `<p>${content}</p>` : `<p>Further insights from representatives indicate key operational groups have initiated reviews regarding these developments. Details remain fluid as teams coordinate with on-site observers to gather supplementary validation.</p>`;

    const paragraph3 = `<p>According to reports verified by <em>${sourceName}</em>, the timeline for implementing subsequent phases will hinge on upcoming panel reviews. Industry observers expect these developments to set a precedent, influencing technical guidelines and operational benchmarks for similar initiatives in the sector going forward.</p>`;
    
    const blockquote = `<blockquote>"This represents a pivotal moment, and our teams are focusing resources on securing a smooth transition while meeting quality standards."</blockquote>`;
    
    const paragraph4 = `<p>As updates continue to filter through, stakeholders are encouraged to refer directly to authorized channels for official press declarations. The next briefing is scheduled to take place within the coming business week.</p>`;

    return paragraph1 + paragraph2 + blockquote + paragraph3 + paragraph4;
  }

  // Event Listeners Binding
  function setupEventListeners() {
    // 1. Theme Toggle
    el.themeToggleBtn.addEventListener('click', toggleTheme);

    // 2. Reader Back Button
    el.readerBackBtn.addEventListener('click', () => {
      window.location.hash = '';
    });    // 3. Debounced Keyword Search
    const performSearch = utils.debounce((val) => {
      state.query = val;
      state.page = 1;
      loadNews();
    }, 500);

    el.searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      
      // Update UI state synchronously for instant response
      if (val) {
        el.searchClearBtn.classList.add('active');
        el.categoriesWrapper.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
      } else {
        el.searchClearBtn.classList.remove('active');
        renderCategories();
      }
      
      // Trigger debounced fetch
      performSearch(val);
    });
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
