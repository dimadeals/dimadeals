// ============ MAIN INITIALIZATION ============

import { showSkeletons, showToast } from './utils.js';
import { PRODUCTS_DATABASE, loadProductsFromAPI } from './api.js';
import { CATALOG_METADATA, getAllPopularProducts, getAllRecommendedProducts, getRelatedProducts } from './products.js';
import {
  initializeLanguage, applyLanguage, createProductCard, handleBuyClick,
  viewProductDetails, loadMoreBrowse, loadMoreSearch, renderProducts,
  loadProductDetails, loadBrowsePage
} from './ui.js';
import {
  initializeCart, updateCartCount, updateQuantity, removeFromCart,
  goToCheckout, displayCart, displayCheckoutSummary, setupCheckoutForm,
  displayConfirmation
} from './cart.js';
import { initializeSearch, loadSearchResults, selectSuggestion } from './search.js';

// Global error handlers
window.addEventListener('error', function(event) {
  console.error('Uncaught error:', event.error);
});
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  showToast('Something went wrong. Please try again.', 'error');
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
window.initializeLanguage = initializeLanguage;
window.displayCheckoutSummary = displayCheckoutSummary;
window.setupCheckoutForm = setupCheckoutForm;
window.displayConfirmation = displayConfirmation;

document.addEventListener('DOMContentLoaded', async function() {
 try {
  // Initialize language
  initializeLanguage();
  
  // Show loading skeletons while fetching products
  showSkeletons('most-popular-grid', 4);
  showSkeletons('recommended-grid', 4);
  showSkeletons('products-grid', 8);
  showSkeletons('catalog-grid', 4);
  showSkeletons('search-results-grid', 4);

  // Load products from API (or fallback to hardcoded)
  const apiSuccess = await loadProductsFromAPI();
  
  if (!apiSuccess) {
    // Show fallback UI in product grids
    const fallbackHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Unable to load products. Please refresh the page.</p></div>';
    ['most-popular-grid', 'recommended-grid', 'products-grid', 'catalog-grid', 'search-results-grid'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = fallbackHTML;
    });
  }

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
        if (titleEl) titleEl.textContent = metadata.title;
        if (subEl)   subEl.textContent   = metadata.subtitle;
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
          for (const id of titleIds) { const el = document.getElementById(id); if (el) el.textContent = meta.title; }
          for (const id of subIds)   { const el = document.getElementById(id); if (el) el.textContent = meta.subtitle; }
        }
        const pcPlat = document.getElementById('pc-platforms');
        if (pcPlat) pcPlat.style.display = _tp === 'pc' ? 'block' : 'none';
      }
    }
  }

  // Product detail page — load after API data is ready
  if (document.querySelector('.product-detail-container')) {
    loadProductDetails();
    const _pid = localStorage.getItem('selectedProductId');
    if (_pid) renderProducts('related-products-grid', getRelatedProducts(parseInt(_pid)));
  }

  // Initialize search functionality
  initializeSearch();

  // Check if we're on the search results page
  if (document.querySelector('.search-results-section')) {
    loadSearchResults();
  }

  // Mobile menu toggle with improved UX
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      // Update aria-expanded for accessibility
      const isExpanded = navMenu.classList.contains('active');
      this.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link, .dropdown a').forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Dropdown menu hover behavior with improved performance
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const dropdown = item.querySelector('.dropdown');
    if (!dropdown) return;

    let timeoutId;
    let isHovering = false;

    const showDropdown = () => {
      clearTimeout(timeoutId);
      dropdown.style.display = 'block';
      isHovering = true;
    };

    const hideDropdown = () => {
      if (!isHovering) return;
      timeoutId = setTimeout(() => {
        if (!dropdown.matches(':hover') && !item.matches(':hover')) {
          dropdown.style.display = 'none';
          isHovering = false;
        }
      }, 150); // Slightly longer delay for better UX
    };

    // Show dropdown on hover
    item.addEventListener('mouseenter', showDropdown);
    dropdown.addEventListener('mouseenter', showDropdown);

    // Hide dropdown with delay when leaving
    item.addEventListener('mouseleave', hideDropdown);
    dropdown.addEventListener('mouseleave', hideDropdown);
  });

  // Product image gallery for product detail page
  const mainImg = document.getElementById('main-image');
  const thumbImgs = document.querySelectorAll('.thumbnails img');

  if (thumbImgs.length > 0) {
    thumbImgs[0].classList.add('active');
  }

  thumbImgs.forEach(img => {
    img.addEventListener('click', function() {
      if (mainImg) {
        mainImg.src = this.dataset.full ? this.dataset.full : this.src;
      }
      thumbImgs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Language selector
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      applyLanguage(this.value);
    });
  }

  // Theme toggle / Dark mode functionality
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Load saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.checked = true;
    }

    // Handle theme toggle
    themeToggle.addEventListener('change', function() {
      const newTheme = this.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
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
    const lastOrderId = sessionStorage.getItem('lastOrderId');
    if (!orderId && !lastOrderId) {
      window.location.href = '/';
    } else {
      try {
        displayConfirmation();
      } catch (e) {
        console.error('Confirmation page error:', e);
      }
    }
  }
 } catch (err) {
  console.error('App initialization error:', err);
  showToast('Something went wrong loading the page. Please refresh.', 'error');
 }
});
