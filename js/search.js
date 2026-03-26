import { escapeHTML, debounce } from './utils.js';
import { PRODUCTS_DATABASE, getAllProducts } from './api.js';
import { getProductBroadCategory, sortProducts } from './products.js';
import { initSearchPagination } from './ui.js';

// ============ SEARCH FUNCTIONALITY ============

export function searchProducts(query) {
  if (!query || query.trim() === '') {
    return [];
  }

  if (!PRODUCTS_DATABASE || Object.keys(PRODUCTS_DATABASE).length === 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const allProducts = getAllProducts();

  return allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.price.toString().includes(searchTerm)
  );
}

function getTopSearchSuggestions(query, limit = 3) {
  const results = searchProducts(query);
  return results.slice(0, limit);
}

function createSuggestionItem(product) {
  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const rating = product.rating || 0;
  const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 ? '✦' : '');
  const ratingHTML = rating ? `<div class="suggestion-rating">${stars} ${rating.toFixed(1)}</div>` : '';

  return `
    <div class="suggestion-item" onclick="selectSuggestion(${product.id})">
      <img src="${escapeHTML(imageSrc) || 'images/placeholder.png'}" alt="${escapeHTML(product.name)}" class="suggestion-image" onerror="this.src='images/placeholder.png'">
      <div class="suggestion-content">
        <div class="suggestion-name">${escapeHTML(product.name)}</div>
        <div class="suggestion-price">${product.price} TND</div>
        ${ratingHTML}
        <div class="suggestion-description">${escapeHTML(product.description.substring(0, 50))}${product.description.length > 50 ? '...' : ''}</div>
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
  // Store the selected product ID and navigate to product page
  localStorage.setItem('selectedProductId', productId);
  window.location.href = '/product';
}

export function performSearch(query) {
  if (!query || query.trim() === '') return;

  // Store search query and navigate to search results page
  localStorage.setItem('searchQuery', query.trim());
  window.location.href = '/search';
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
  if (category === 'all') return results;
  return results.filter(product => getProductBroadCategory(product) === category);
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

  // Simple input event listener
  searchInput.addEventListener('input', debounce(function() {
    const query = this.value.trim();

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
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = this.value;
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
  const searchQuery = localStorage.getItem('searchQuery');
  if (!searchQuery) {
    window.location.href = '/';
    return;
  }

  // Display search query
  const queryDisplay = document.getElementById('search-query-display');
  if (queryDisplay) {
    queryDisplay.textContent = `Searching for: "${searchQuery}"`;
  }

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

  // Handle sort change
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const activeButton = document.querySelector('.filter-btn.active');
      const category = activeButton ? activeButton.dataset.filter : 'all';
      let filteredResults = filterSearchResults(allResults, category);
      
      // Apply sorting
      filteredResults = sortProducts(filteredResults, this.value);
      initSearchPagination(filteredResults);
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const category = this.dataset.filter;
      let filteredResults = filterSearchResults(allResults, category);
      const sortValue = sortSelect ? sortSelect.value : 'relevance';
      filteredResults = sortProducts(filteredResults, sortValue);
      initSearchPagination(filteredResults);

      const resultsCount = document.getElementById('results-count');
      if (resultsCount) {
        resultsCount.textContent = `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''} found`;
      }
    });
  });
}
