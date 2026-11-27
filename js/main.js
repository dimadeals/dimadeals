// ============ MAIN INITIALIZATION ============

import { showSkeletons, showToast, escapeHTML } from './utils.js';
import { PRODUCTS_DATABASE, loadProductsFromAPI, getProductById } from './api.js';
import { CATALOG_METADATA, getAllPopularProducts, getAllRecommendedProducts, getRelatedProducts } from './products.js';
import {
  createProductCard, handleBuyClick,
  viewProductDetails, loadMoreBrowse, loadMoreSearch, renderProducts,
  loadProductDetails, loadBrowsePage
} from './ui.js';
import {
  initializeCart, updateCartCount, updateQuantity, removeFromCart,
  goToCheckout, displayCart, displayCheckoutSummary, setupCheckoutForm,
  displayConfirmation
} from './cart.js';
import { initializeSearch, loadSearchResults, selectSuggestion } from './search.js';

const i18n = window.DimaI18n;
const t = (message, vars) => (i18n ? i18n.t(message, vars) : message);
const localizeProduct = (product) => (i18n ? i18n.localizeProduct(product) : product);

// Global error handlers
window.addEventListener('error', function(event) {
  console.error('Uncaught error:', event.error);
});
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  showToast(t('Something went wrong. Please try again.'), 'error');
});

// Register globals for onclick handlers in dynamically generated HTML
window.handleBuyClick = handleBuyClick;
window.viewProductDetails = viewProductDetails;
window.loadMoreBrowse = loadMoreBrowse;
window.loadMoreSearch = loadMoreSearch;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.goToCheckout = goToCheckout;
window.selectSuggestion = selectSuggestion;

// Also expose for inline scripts in HTML pages
window.displayCart = displayCart;
window.displayCheckoutSummary = displayCheckoutSummary;
window.setupCheckoutForm = setupCheckoutForm;
window.displayConfirmation = displayConfirmation;

// Keep the editorial hero cards in sync with the real product data.
function hydrateFeaturedProducts() {
  document.querySelectorAll('[data-featured-product]').forEach(card => {
    const product = getProductById(card.dataset.featuredProduct);
    if (!product) return;

    const localized = localizeProduct(product);
    card.setAttribute('href', `/product?id=${encodeURIComponent(localized.id)}`);

    // Keep the curated, compressed hero artwork; only the commerce data is
    // hydrated from the product record.
    const title = card.querySelector('h2, h3');
    if (title) {
      title.textContent = localized.name;
      title.setAttribute('data-i18n-skip', '');
    }

    const price = card.querySelector('.showcase-price');
    if (price) {
      const value = Number(localized.price);
      price.textContent = `${Number.isInteger(value) ? value : value.toFixed(2)} TND`;
    }

    const oldPrice = card.querySelector('.showcase-old');
    if (oldPrice) {
      const original = Number(localized.originalPrice);
      if (Number.isFinite(original) && original > Number(localized.price)) {
        oldPrice.textContent = `${Number.isInteger(original) ? original : original.toFixed(2)} TND`;
        oldPrice.style.display = '';
      } else {
        oldPrice.style.display = 'none';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', async function() {
 try {
  window.DimaI18n?.init();

  // Product data is only needed on shopping pages. Legal/about pages should
  // not hit the API (or show a product-load toast if it is down).
  const needsProducts = Boolean(document.querySelector(
    '#products-grid, #most-popular-grid, #recommended-grid, #search-results-grid, ' +
    '#related-products-grid, .product-detail-container, #checkout-form, #confirmation-info, #cart-items'
  ));

  // Show loading skeletons while fetching products
  showSkeletons('most-popular-grid', 4);
  showSkeletons('recommended-grid', 4);
  showSkeletons('products-grid', 8);
  showSkeletons('catalog-grid', 4);
  showSkeletons('search-results-grid', 4);

  // Load products from API (or fallback to hardcoded)
  let apiSuccess = true;
  if (needsProducts) {
    apiSuccess = await loadProductsFromAPI();
  }
  
  if (!apiSuccess) {
    // Show a single clear error in every product grid instead of silently
    // rendering "no products" (which looks like an empty shop).
    const fallbackHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${escapeHTML(t('Unable to load products. Please refresh the page.'))}</p></div>`;
    ['most-popular-grid', 'recommended-grid', 'products-grid', 'catalog-grid', 'search-results-grid', 'related-products-grid'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = fallbackHTML;
    });
  } else {
    hydrateFeaturedProducts();

    // Initialize product grids
    renderProducts('most-popular-grid', getAllPopularProducts());
    renderProducts('recommended-grid', getAllRecommendedProducts());

    // Page-specific product loading (runs after API data is available)
    if (!loadBrowsePage()) {
      const _up = new URLSearchParams(window.location.search);
      const _tp = _up.get('type');
      const catalogGrid = document.getElementById('catalog-grid');
      if (catalogGrid && _tp) {
        const products = PRODUCTS_DATABASE[_tp] || [];
        const metadata = CATALOG_METADATA[_tp];
        if (metadata) {
          const titleEl = document.getElementById('catalog-title');
          const subEl   = document.getElementById('catalog-subtitle');
          if (titleEl) titleEl.textContent = t(metadata.title);
          if (subEl)   subEl.textContent   = t(metadata.subtitle);
        }
        catalogGrid.innerHTML = products.map(p => createProductCard(p)).join('');
      } else {
        const gridWithCat = document.querySelector('.product-grid[data-category]');
        if (gridWithCat) {
          const cat = gridWithCat.dataset.category;
          gridWithCat.innerHTML = (PRODUCTS_DATABASE[cat] || []).map(p => createProductCard(p)).join('');
        } else if (_tp) {
          const products = PRODUCTS_DATABASE[_tp] || [];
          const legacyGrid = document.getElementById('games-grid') || document.getElementById('courses-grid') || document.getElementById('apps-grid');
          if (legacyGrid) legacyGrid.innerHTML = products.map(p => createProductCard(p)).join('');
          const meta = CATALOG_METADATA[_tp];
          if (meta) {
            const titleIds = ['games-title', 'courses-title', 'apps-title'];
            const subIds   = ['games-subtitle', 'courses-subtitle', 'apps-subtitle'];
            for (const id of titleIds) { const el = document.getElementById(id); if (el) el.textContent = t(meta.title); }
            for (const id of subIds)   { const el = document.getElementById(id); if (el) el.textContent = t(meta.subtitle); }
          }
          const pcPlat = document.getElementById('pc-platforms');
          if (pcPlat) pcPlat.style.display = _tp === 'pc' ? 'block' : 'none';
        }
      }
    }

    // Product detail page — load after API data is ready
    if (document.querySelector('.product-detail-container')) {
      loadProductDetails();
      const _pid = new URLSearchParams(window.location.search).get('id')
        || localStorage.getItem('selectedProductId');
      if (_pid) renderProducts('related-products-grid', getRelatedProducts(_pid));
    }

    // Check if we're on the search results page
    if (document.querySelector('.search-results-section')) {
      loadSearchResults();
    }
  }

  // Initialize search functionality
  initializeSearch();

  // Mobile menu toggle with improved UX
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function closeMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    document.querySelectorAll('.nav-item.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
    });
  }

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');

    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      this.setAttribute('aria-expanded', String(isExpanded));
      document.body.classList.toggle('nav-open', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Top-level category links toggle their submenu (important on touch,
    // where :hover does not exist). On desktop they still work with hover.
    document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      link.addEventListener('click', function(e) {
        const item = this.parentElement;
        const dropdown = item.querySelector('.dropdown');
        if (!dropdown) return;
        e.preventDefault();

        const willOpen = !item.classList.contains('open');
        document.querySelectorAll('.nav-item.open').forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('open', willOpen);
        this.setAttribute('aria-expanded', String(willOpen));
      });
    });

    // Close the whole menu after choosing an actual submenu link.
    document.querySelectorAll('.dropdown a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Escape closes the mobile menu.
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 1140) closeMenu();
    });
  }

  // Mobile search toggle for mobile devices
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const searchContainer = document.querySelector('.search-container');

  if (searchButton && searchInput && searchContainer) {
    searchButton.addEventListener('click', function(e) {
      if (window.innerWidth <= 1140) {
        // First tap expands the search field; once expanded, the normal search
        // handler in search.js performs the search.
        if (!searchContainer.classList.contains('expanded')) {
          e.preventDefault();
          searchContainer.classList.add('expanded');
          searchInput.focus();
        } else if (!searchInput.value.trim()) {
          e.preventDefault();
          searchContainer.classList.remove('expanded');
        }
      }
    });

    // Close expanded search when clicking outside
    document.addEventListener('click', function(e) {
      if (searchContainer && window.innerWidth <= 1140) {
        if (!searchContainer.contains(e.target)) {
          searchContainer.classList.remove('expanded');
        }
      }
    });

    // Close expanded search on escape key
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && window.innerWidth <= 1140) {
        searchContainer.classList.remove('expanded');
      }
    });
  }

  // Dropdown menus now use CSS :hover / :focus-within / .open, so the old
  // JS mouseenter/mouseleave timers are no longer needed.

  // Product image gallery (delegated so it survives language re-renders)
  document.addEventListener('click', function(event) {
    const thumb = event.target.closest('.thumbnails img');
    if (!thumb) return;
    const main = document.getElementById('main-image');
    if (!main) return;
    const nextSrc = thumb.dataset.full ? thumb.dataset.full : thumb.src;
    if (main.src !== nextSrc) {
      const shell = main.closest('.product-image-shell');
      shell?.classList.remove('is-loaded', 'is-failed');
      main.classList.remove('loaded');
      main.src = nextSrc;
      if (main.complete && main.naturalWidth > 0) {
        main.classList.add('loaded');
        shell?.classList.add('is-loaded');
      }
    }
    document.querySelectorAll('.thumbnails img').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });

  // Theme toggle / Dark mode functionality
  // DIMA is dark-first: use dark unless the visitor explicitly chose light.
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('theme') || 'dark';
  } catch { savedTheme = 'dark'; }

  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.checked = savedTheme === 'dark';

    themeToggle.addEventListener('change', function() {
      const newTheme = this.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      try { localStorage.setItem('theme', newTheme); } catch { /* ignore */ }
    });
  }

  // Initialize cart
  initializeCart();
  updateCartCount();

  // Cart page
  if (document.getElementById('cart-items')) {
    displayCart();
  }

  // Checkout page
  if (document.getElementById('checkout-form')) {
    displayCheckoutSummary();
    setupCheckoutForm();
  }

  // Confirmation page
  if (document.getElementById('confirmation-info')) {
    const orderId = new URLSearchParams(window.location.search).get('orderId');
    let lastOrderId = null;
    try { lastOrderId = sessionStorage.getItem('lastOrderId'); } catch { /* ignore */ }

    if (!orderId && !lastOrderId) {
      window.location.href = '/';
    } else {
      displayConfirmation().catch((e) => console.error('Confirmation page error:', e));
    }
  }

  // Re-render all data-driven content when the language changes. Static text
  // is handled by DimaI18n; product names/descriptions need fresh records.
  if (i18n) {
    i18n.onLanguageChange(() => {
      if (!apiSuccess) return;
      try {
        hydrateFeaturedProducts();
        if (document.getElementById('most-popular-grid')) {
          renderProducts('most-popular-grid', getAllPopularProducts());
          renderProducts('recommended-grid', getAllRecommendedProducts());
        }
        if (document.getElementById('products-grid')) loadBrowsePage();
        if (document.querySelector('.product-detail-container')) {
          loadProductDetails();
          const pid = new URLSearchParams(window.location.search).get('id')
            || localStorage.getItem('selectedProductId');
          if (pid) renderProducts('related-products-grid', getRelatedProducts(pid));
        }
        if (document.querySelector('.search-results-section')) loadSearchResults();
        if (document.getElementById('cart-items')) displayCart();
        if (document.getElementById('checkout-form')) displayCheckoutSummary();
        if (document.getElementById('confirmation-info')) {
          displayConfirmation().catch((error) => console.error(error));
        }
      } catch (error) {
        console.error('Language refresh failed:', error);
      }
    });
  }
 } catch (err) {
  console.error('App initialization error:', err);
  showToast(t('Something went wrong loading the page. Please refresh.'), 'error');
 }
});
