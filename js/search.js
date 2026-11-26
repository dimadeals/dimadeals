import { escapeHTML, debounce } from './utils.js';
import { getAllProducts } from './api.js';
import { getProductBroadCategory, getMainCategories, sortProducts } from './products.js';
import { initSearchPagination } from './ui.js';

// ============ SINGLE SOURCE OF TRUTH FOR FILTERING ============
let selectedMainCategory = null; // 'all', 'subscriptions', 'games', 'courses', 'apps', or null

// ============ SEARCH FUNCTIONALITY ============

export function searchProducts(query) {
  if (!query || String(query).trim() === '') {
    return [];
  }

  const searchTerm = String(query).toLowerCase().trim();
  const allProducts = getAllProducts();

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

  return `
    <div class="suggestion-item" onclick="selectSuggestion(${jsArg(product.id)})">
      <img src="${escapeHTML(imageSrc) || 'images/brand.png'}" alt="${escapeHTML(product.name)}" class="suggestion-image" onerror="this.onerror=null;this.src='images/brand.png'">
      <div class="suggestion-content">
        <div class="suggestion-name">${escapeHTML(product.name)}</div>
        <div class="suggestion-price">${product.price} TND</div>
        ${ratingHTML}
        <div class="suggestion-description">${escapeHTML(description.substring(0, 50))}${description.length > 50 ? '...' : ''}</div>
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
        <h3>No products found</h3>
        <p>Try searching with different keywords</p>
        <a href="/" class="cta-button">Browse All Products</a>
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
  if (queryDisplay) queryDisplay.textContent = `Searching for: "${searchQuery}"`;
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = searchQuery;

  // Get and display search results
  const results = searchProducts(searchQuery);
  displaySearchResults(results, 'search-results-grid');

  // Update results count
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} found`;
  }

  // Initialize filter buttons
  initializeSearchFilters(results);
}

function initializeSearchFilters(allResults) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');

  // Initialize with 'all' category by default
  selectedMainCategory = 'all';

  // Handle sort change
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      // Re-apply current filter with new sort
      let filteredResults = filterSearchResults(allResults, selectedMainCategory);
      filteredResults = sortProducts(filteredResults, this.value);
      
      // Update results count
      const resultsCount = document.getElementById('results-count');
      if (resultsCount) {
        resultsCount.textContent = `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''} found`;
      }
      
      console.log('[Sort] Applied sort:', this.value, 'Results:', filteredResults.length);
      initSearchPagination(filteredResults);
    });
  }

  // Handle filter button clicks
  filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Update single source of truth
      selectedMainCategory = this.dataset.filter;
      console.log('[Category Click] Selected category:', selectedMainCategory);

      // Update UI - remove active from all, add to clicked
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      // Apply filter
      let filteredResults = filterSearchResults(allResults, selectedMainCategory);
      
      // Apply current sort
      const sortValue = sortSelect ? sortSelect.value : 'relevance';
      filteredResults = sortProducts(filteredResults, sortValue);
      
      // Update results count
      const resultsCount = document.getElementById('results-count');
      if (resultsCount) {
        resultsCount.textContent = `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''} found`;
      }
      
      console.log('[Category Click] Filtered to:', filteredResults.length, 'products');
      initSearchPagination(filteredResults);
    });
  });

  // Set initial 'all' button as active
  const allButton = document.querySelector('[data-filter="all"]');
  if (allButton) {
    allButton.classList.add('active');
    allButton.setAttribute('aria-pressed', 'true');
  }
}
