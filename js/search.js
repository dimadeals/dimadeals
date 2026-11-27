import { escapeHTML, debounce, PRODUCT_IMAGE_SKELETON, PRODUCT_IMAGE_FALLBACK, PRODUCT_IMAGE_LOAD_ATTR, PRODUCT_IMAGE_ERROR_ATTR } from './utils.js';
import { getAllProducts } from './api.js';
import { getProductBroadCategory, getMainCategories, sortProducts } from './products.js';
import { initSearchPagination } from './ui.js';

const i18n = window.DimaI18n;
const t = (message, vars) => (i18n ? i18n.t(message, vars) : message);
const localizeProduct = (product) => (i18n ? i18n.localizeProduct(product) : product);

// ============ SINGLE SOURCE OF TRUTH FOR FILTERING ============
let selectedMainCategory = null; // 'all', 'subscriptions', 'games', 'courses', 'apps', or null

// ============ SEARCH FUNCTIONALITY ============

export function searchProducts(query) {
  if (!query || String(query).trim() === '') {
    return [];
  }

  const searchTerm = String(query).toLowerCase().trim();
  const allProducts = getAllProducts().map(localizeProduct);

  return allProducts.filter(product => {
    const name = String(product.name || '').toLowerCase();
    const description = String(product.description || '').toLowerCase();
    const category = String(product.category || '').toLowerCase();
    const price = String(product.price ?? '');
    return name.includes(searchTerm)
      || description.includes(searchTerm)
      || category.includes(searchTerm)
      || price.includes(searchTerm);
  });
}

function getTopSearchSuggestions(query, limit = 3) {
  const results = searchProducts(query);
  return results.slice(0, limit);
}

function jsArg(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return escapeHTML(JSON.stringify(String(value ?? '')));
}

function createSuggestionItem(product) {
  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const rating = Number(product.rating) || 0;
  const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 ? '✦' : '');
  const ratingHTML = rating ? `<div class="suggestion-rating">${stars} ${rating.toFixed(1)}</div>` : '';
  const description = String(product.description || '');
  const imageHTML = imageSrc
    ? `<img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(product.name)}" class="suggestion-image product-image" ${PRODUCT_IMAGE_LOAD_ATTR} ${PRODUCT_IMAGE_ERROR_ATTR}>`
    : '';

  return `
    <div class="suggestion-item" onclick="selectSuggestion(${jsArg(product.id)})">
      <span class="suggestion-image-shell product-image-shell${imageSrc ? '' : ' is-failed'}">
        ${PRODUCT_IMAGE_SKELETON}
        ${imageHTML}
        ${PRODUCT_IMAGE_FALLBACK}
      </span>
      <div class="suggestion-content">
        <div class="suggestion-name" data-i18n-skip>${escapeHTML(product.name)}</div>
        <div class="suggestion-price" dir="ltr">${product.price} TND</div>
        ${ratingHTML}
        <div class="suggestion-description" data-i18n-skip>${escapeHTML(description.substring(0, 50))}${description.length > 50 ? '...' : ''}</div>
      </div>
    </div>
  `;
}

function showSearchSuggestions(query) {
  const suggestionsContainer = document.querySelector('.search-suggestions');
  if (!suggestionsContainer) return;

  if (!query || query.trim() === '') {
    suggestionsContainer.classList.remove('show');
    return;
  }

  const suggestions = getTopSearchSuggestions(query);
  if (suggestions.length === 0) {
    suggestionsContainer.classList.remove('show');
    return;
  }

  suggestionsContainer.innerHTML = suggestions.map(product => createSuggestionItem(product)).join('');
  suggestionsContainer.classList.add('show');
}

function hideSearchSuggestions() {
  const suggestionsContainer = document.querySelector('.search-suggestions');
  if (suggestionsContainer) {
    setTimeout(() => {
      suggestionsContainer.classList.remove('show');
    }, 150); // Small delay to allow for clicks
  }
}

export function selectSuggestion(productId) {
  // Store the selected product ID and navigate to the shareable product URL.
  try { localStorage.setItem('selectedProductId', String(productId)); } catch { /* ignore */ }
  window.location.href = `/product?id=${encodeURIComponent(productId)}`;
}

export function performSearch(query) {
  const trimmed = String(query || '').trim();
  if (!trimmed) return;

  // Store search query and navigate to search results page. The query is in
  // the URL so results are shareable and the back button behaves correctly.
  try { localStorage.setItem('searchQuery', trimmed); } catch { /* ignore */ }
  window.location.href = `/search?q=${encodeURIComponent(trimmed)}`;
}

export function displaySearchResults(results, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>${escapeHTML(t('No products found'))}</h3>
        <p>${escapeHTML(t('Try a different search term or clear the category filter.'))}</p>
        <a href="/browse" class="cta-button">${escapeHTML(t('Browse the catalog'))}</a>
      </div>
    `;
    return;
  }

  initSearchPagination(results);
}

function filterSearchResults(results, category) {
  // category is 'all', 'subscriptions', 'games', 'courses', 'apps', etc.
  if (category === 'all' || !category) {
    console.log('[Filter] Showing all products');
    return results;
  }

  console.log('[Filter] Filtering by category:', category);
  
  return results.filter(product => {
    const mains = getMainCategories(product);
    
    // Check if any mainCategory matches (case-insensitive)
    if (mains && mains.length > 0) {
      const hasMatch = mains.some(mc => 
        mc.toLowerCase() === category.toLowerCase()
      );
      if (hasMatch) {
        console.debug(`[Filter] Product "${product.name}" matches mainCategories:`, mains);
        return true;
      }
    }
    
    // Fallback to broad category (getProductBroadCategory should be lowercase)
    const broadCat = getProductBroadCategory(product);
    const matches = broadCat && broadCat.toLowerCase() === category.toLowerCase();
    if (matches) {
      console.debug(`[Filter] Product "${product.name}" matches broad category: ${broadCat}`);
    }
    return matches;
  });
}

export function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  if (!searchInput || !searchButton) {
    return;
  }

  // Create search suggestions dropdown if it doesn't exist
  let suggestionsContainer = document.querySelector('.search-suggestions');
  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchInput.parentNode.appendChild(suggestionsContainer);
  }

  // Simple input event listener (debounce preserves `this`; we read the input
  // directly so it also works if the handler is called without a receiver).
  searchInput.addEventListener('input', debounce(function() {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      showSearchSuggestions(query);
    } else {
      hideSearchSuggestions();
    }
  }, 300));

  // Hide suggestions when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.parentNode.contains(e.target)) {
      hideSearchSuggestions();
    }
  });

  // Search button click
  searchButton.addEventListener('click', function() {
    const query = searchInput.value;
    if (query.trim() !== '') {
      performSearch(query);
    }
  });

  // Enter key support
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value;
      if (query.trim() !== '') {
        performSearch(query);
      }
    }
  });

  // Escape key to hide suggestions
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideSearchSuggestions();
      this.blur();
    }
  });
}

// ============ SEARCH RESULTS PAGE FUNCTIONALITY ============

export function loadSearchResults() {
  const urlQuery = new URLSearchParams(window.location.search).get('q');
  let searchQuery = urlQuery ? String(urlQuery).trim() : '';

  if (!searchQuery) {
    try { searchQuery = (localStorage.getItem('searchQuery') || '').trim(); } catch { searchQuery = ''; }
  }

  if (!searchQuery) {
    window.location.href = '/';
    return;
  }

  // Keep the URL and the stored query in sync so refreshes/back work.
  try { localStorage.setItem('searchQuery', searchQuery); } catch { /* ignore */ }
  if (!urlQuery) {
    const nextUrl = `/search?q=${encodeURIComponent(searchQuery)}`;
    window.history.replaceState({}, '', nextUrl);
  }

  // Display search query in the heading and restore it in the header input.
  const queryDisplay = document.getElementById('search-query-display');
  if (queryDisplay) queryDisplay.textContent = t('Searching for: "{query}"', { query: searchQuery });
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = searchQuery;

  // Get and display search results
  const results = searchProducts(searchQuery);
  displaySearchResults(results, 'search-results-grid');

  // Update results count
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = t('{count} result(s) found', { count: results.length });
  }

  document.title = t('Search: {query} — DIMA Deals', { query: searchQuery });

  // Initialize filter buttons
  initializeSearchFilters(results);
}

function initializeSearchFilters(allResults) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');

  // Initialize with 'all' category by default
  selectedMainCategory = 'all';

  // Handle sort change (assign, not add, so language re-renders don't stack)
  if (sortSelect) {
    sortSelect.onchange = function() {
      // Re-apply current filter with new sort
      let filteredResults = filterSearchResults(allResults, selectedMainCategory);
      filteredResults = sortProducts(filteredResults, this.value);

      const resultsCount = document.getElementById('results-count');
      if (resultsCount) {
        resultsCount.textContent = t('{count} result(s) found', { count: filteredResults.length });
      }

      initSearchPagination(filteredResults);
    };
  }

  // Handle filter button clicks
  filterButtons.forEach(button => {
    button.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      selectedMainCategory = this.dataset.filter;

      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      let filteredResults = filterSearchResults(allResults, selectedMainCategory);

      const sortValue = sortSelect ? sortSelect.value : 'relevance';
      filteredResults = sortProducts(filteredResults, sortValue);

      const resultsCount = document.getElementById('results-count');
      if (resultsCount) {
        resultsCount.textContent = t('{count} result(s) found', { count: filteredResults.length });
      }

      initSearchPagination(filteredResults);
    };
  });

  // Set initial 'all' button as active
  const allButton = document.querySelector('[data-filter="all"]');
  if (allButton) {
    allButton.classList.add('active');
    allButton.setAttribute('aria-pressed', 'true');
  }
}
