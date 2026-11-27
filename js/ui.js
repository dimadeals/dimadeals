import { escapeHTML, showToast, PRODUCT_IMAGE_SKELETON, PRODUCT_IMAGE_FALLBACK, PRODUCT_IMAGE_LOAD_ATTR, PRODUCT_IMAGE_ERROR_ATTR } from './utils.js';
import { getProductById, getAllProducts, PRODUCTS_DATABASE } from './api.js';
import { CATALOG_METADATA, getMainCategories } from './products.js';
import { addToCart } from './cart.js';

// ============ I18N HELPERS ============

const i18n = window.DimaI18n;
const t = (message, vars) => (i18n ? i18n.t(message, vars) : message);
const localizeProduct = (product) => (i18n ? i18n.localizeProduct(product) : product);

// ============ PRODUCT CARD HELPERS ============

const CATEGORY_LABELS = {
  netflix: 'Netflix',
  spotify: 'Spotify',
  canva: 'Canva',
  shahid: 'Shahid',
  capcut: 'CapCut',
  pc: 'PC Games',
  console: 'Console Games',
  mobile: 'Mobile Games',
  steam: 'Steam',
  epic_games: 'Epic Games',
  ea_games: 'EA Play',
  xbox_pc: 'Xbox Game Pass',
  programming: 'Programming',
  design: 'Design',
  business: 'Business',
  mobile_apps: 'Mobile Apps',
  software: 'Software',
};

const LOGO_CATEGORIES = new Set([
  'netflix', 'spotify', 'canva', 'shahid', 'capcut',
  'programming', 'design', 'business',
  'mobile_apps', 'software',
  'steam', 'epic_games', 'ea_games', 'xbox_pc',
]);

function usesLogoArtwork(product) {
  return LOGO_CATEGORIES.has(String(product?.category || '').toLowerCase());
}

function getCategoryLabel(product) {
  const category = String(product?.category || '').toLowerCase();
  if (CATEGORY_LABELS[category]) return t(CATEGORY_LABELS[category]);
  if (category) return t(category.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
  const main = getMainCategories(product)[0];
  return t(main || 'Digital product');
}

function inlineArg(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return escapeHTML(JSON.stringify(String(value ?? '')));
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0';
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function getDiscountPercent(product) {
  const price = Number(product?.price);
  const original = Number(product?.originalPrice);
  if (!Number.isFinite(price) || !Number.isFinite(original) || original <= price || price < 0) return 0;
  return Math.round(((original - price) / original) * 100);
}

function ratingHTML(product, large = false) {
  const rating = Number(product?.rating) || 0;
  if (!rating) return '';
  const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 ? '✦' : '');
  return `<span class="${large ? 'product-rating-large' : 'product-rating'}" aria-label="${escapeHTML(t('Rated {rating} out of 5', { rating: rating.toFixed(1) }))}"><span class="stars">${stars}</span> <span class="rating-value">${rating.toFixed(1)}</span></span>`;
}

export function createProductCard(product) {
  if (!product) return '';

  const localized = localizeProduct(product);
  const name = localized.name;
  const description = localized.description;

  const imageSrc = localized.images && localized.images.length > 0 ? localized.images[0] : localized.image;
  const imageHTML = imageSrc
    ? `<img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(name)}" class="product-image" loading="lazy" decoding="async" ${PRODUCT_IMAGE_LOAD_ATTR} ${PRODUCT_IMAGE_ERROR_ATTR}>`
    : '';

  const discount = getDiscountPercent(localized);
  const badges = [];
  if (localized.popular) badges.push(`<span class="badge badge-popular">${escapeHTML(t('Popular'))}</span>`);
  if (localized.recommended) badges.push(`<span class="badge badge-recommended">${escapeHTML(t('Recommended'))}</span>`);
  if (discount > 0) badges.push(`<span class="badge badge-discount">-${discount}%</span>`);

  const isOutOfStock = localized.inStock === false;
  const overlay = isOutOfStock
    ? `<div class="out-of-stock-overlay"><span class="out-of-stock-label">${escapeHTML(t('Out of stock'))}</span></div>`
    : '';

  const price = formatPrice(localized.price);
  const hasOriginal = Number(localized.originalPrice) > Number(localized.price);
  const priceRow = `
    <div class="product-price-row">
      <span class="price" dir="ltr">${price} TND</span>
      ${hasOriginal ? `<span class="original-price" dir="ltr">${formatPrice(localized.originalPrice)} TND</span>` : ''}
    </div>`;

  const buttonHTML = isOutOfStock
    ? `<button class="buy-now-button" disabled><i class="fas fa-ban"></i> ${escapeHTML(t('Out of stock'))}</button>`
    : `<button class="buy-now-button" onclick="event.stopPropagation(); handleBuyClick(${inlineArg(localized.id)});"><i class="fas fa-shopping-bag"></i> ${escapeHTML(t('Add to cart'))}</button>`;

  return `
    <article class="product-card ${isOutOfStock ? 'out-of-stock' : ''} ${usesLogoArtwork(localized) ? 'product-card--contain' : ''}"
             role="button" tabindex="0"
             aria-label="${escapeHTML(t('View {name}', { name }))}"
             onclick="viewProductDetails(${inlineArg(localized.id)})"
             onkeydown="if(event.target!==event.currentTarget)return; if(event.key==='Enter'||event.key===' '){event.preventDefault();viewProductDetails(${inlineArg(localized.id)});}">
      <div class="product-card-media product-image-shell${imageSrc ? '' : ' is-failed'}">
        ${PRODUCT_IMAGE_SKELETON}
        ${imageHTML}
        ${PRODUCT_IMAGE_FALLBACK}
        ${overlay}
        ${badges.length ? `<div class="product-card-badges">${badges.join('')}</div>` : ''}
      </div>
      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-category">${escapeHTML(getCategoryLabel(localized))}</span>
          ${ratingHTML(localized)}
        </div>
        <h3 class="product-card-title" data-i18n-skip>${escapeHTML(name)}</h3>
        <p class="product-card-description" data-i18n-skip>${escapeHTML(description)}</p>
        <div class="product-card-footer">
          ${priceRow}
          ${buttonHTML}
        </div>
      </div>
    </article>
  `;
}

export function handleBuyClick(productId) {
  const product = getProductById(productId);
  if (product) {
    addToCart(localizeProduct(product), 1);
  } else {
    showToast(t('Product not found. Please refresh and try again.'), 'error');
  }
}

// ============ PAGINATION ============

const INITIAL_LOAD = 8;
const LOAD_MORE_COUNT = 8;

let allBrowseProducts = [];
let browseShownCount = 0;
let allSearchProducts = [];
let searchShownCount = 0;

function _updateSeeMoreBtn(total, shown, gridId, loadMoreFn) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const parent = grid.parentNode;
  let seeMore = parent.querySelector('.see-more-container');

  if (shown < total) {
    const remaining = total - shown;
    const next = Math.min(LOAD_MORE_COUNT, remaining);
    if (!seeMore) {
      seeMore = document.createElement('div');
      seeMore.className = 'see-more-container';
      parent.insertBefore(seeMore, grid.nextSibling);
    }
    seeMore.innerHTML = `
      <button class="see-more-button" onclick="${loadMoreFn}()">
        <span class="see-more-icon"><i class="fas fa-plus"></i></span>
        <span class="see-more-text">${escapeHTML(t('Show {count} more', { count: next }))}</span>
        <span class="see-more-pill">${escapeHTML(t('{count} left', { count: remaining }))}</span>
      </button>`;
  } else if (seeMore) {
    seeMore.innerHTML = `<p class="all-loaded-msg"><i class="fas fa-check-circle"></i> ${escapeHTML(t('All products loaded'))}</p>`;
    setTimeout(() => seeMore.remove(), 2000);
  }
}

// ── Browse page ──────────────────────────────
export function initBrowsePagination(products) {
  allBrowseProducts = Array.isArray(products) ? products : [];
  browseShownCount = 0;

  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const count = document.getElementById('browse-count');
  if (count) {
    count.textContent = t(
      allBrowseProducts.length === 1 ? '{count} product available' : '{count} products available',
      { count: allBrowseProducts.length }
    );
  }

  const old = grid.parentNode.querySelector('.see-more-container');
  if (old) old.remove();

  if (allBrowseProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>${escapeHTML(t('No products here yet'))}</h3>
        <p>${escapeHTML(t('This category is empty right now. Browse the full catalog for other deals.'))}</p>
        <a href="/browse" class="cta-button">${escapeHTML(t('Browse all products'))}</a>
      </div>`;
    return;
  }

  const batch = allBrowseProducts.slice(0, INITIAL_LOAD);
  grid.innerHTML = batch.map(p => createProductCard(p)).join('');
  browseShownCount = batch.length;
  _updateSeeMoreBtn(allBrowseProducts.length, browseShownCount, 'products-grid', 'loadMoreBrowse');
}

export function loadMoreBrowse() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const batch = allBrowseProducts.slice(browseShownCount, browseShownCount + LOAD_MORE_COUNT);
  grid.insertAdjacentHTML('beforeend', batch.map(p => createProductCard(p)).join(''));
  browseShownCount += batch.length;
  _updateSeeMoreBtn(allBrowseProducts.length, browseShownCount, 'products-grid', 'loadMoreBrowse');
}

// ── Search page ──────────────────────────────
export function initSearchPagination(products) {
  allSearchProducts = Array.isArray(products) ? products : [];
  searchShownCount = 0;

  const grid = document.getElementById('search-results-grid');
  if (!grid) return;

  const old = grid.parentNode.querySelector('.see-more-container');
  if (old) old.remove();

  if (allSearchProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>${escapeHTML(t('No products found'))}</h3>
        <p>${escapeHTML(t('Try a different search term or clear the category filter.'))}</p>
        <a href="/browse" class="cta-button">${escapeHTML(t('Browse the catalog'))}</a>
      </div>`;
    return;
  }

  const batch = allSearchProducts.slice(0, INITIAL_LOAD);
  grid.innerHTML = batch.map(p => createProductCard(p)).join('');
  searchShownCount = batch.length;
  _updateSeeMoreBtn(allSearchProducts.length, searchShownCount, 'search-results-grid', 'loadMoreSearch');
}

export function loadMoreSearch() {
  const grid = document.getElementById('search-results-grid');
  if (!grid) return;
  const batch = allSearchProducts.slice(searchShownCount, searchShownCount + LOAD_MORE_COUNT);
  grid.insertAdjacentHTML('beforeend', batch.map(p => createProductCard(p)).join(''));
  searchShownCount += batch.length;
  _updateSeeMoreBtn(allSearchProducts.length, searchShownCount, 'search-results-grid', 'loadMoreSearch');
}

export function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!Array.isArray(products)) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>${escapeHTML(t('Something went wrong'))}</h3>
        <p>${escapeHTML(t('Could not load products. Please refresh the page.'))}</p>
        <button class="cta-button" onclick="location.reload()">${escapeHTML(t('Refresh page'))}</button>
      </div>`;
    return;
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>${escapeHTML(t('No products available'))}</h3>
        <p>${escapeHTML(t('Check back later for new arrivals.'))}</p>
        <a href="/browse" class="cta-button">${escapeHTML(t('Browse the catalog'))}</a>
      </div>`;
    return;
  }

  try {
    container.innerHTML = products.map(product => createProductCard(product)).join('');
  } catch (error) {
    console.error('Error rendering products:', error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>${escapeHTML(t('Something went wrong'))}</h3>
        <p>${escapeHTML(t('Could not display products. Please refresh the page.'))}</p>
        <button class="cta-button" onclick="location.reload()">${escapeHTML(t('Refresh page'))}</button>
      </div>`;
  }
}

// ============ PRODUCT DETAILS & NAVIGATION ============

export function viewProductDetails(productId) {
  if (productId === undefined || productId === null || productId === '') {
    console.error('Invalid product ID:', productId);
    showToast(t('Error: Invalid product selected'), 'error');
    return;
  }

  try {
    localStorage.setItem('selectedProductId', String(productId));
    window.location.href = `/product?id=${encodeURIComponent(productId)}`;
  } catch (error) {
    console.error('Error navigating to product details:', error);
    showToast(t('Error: Could not load product details'), 'error');
  }
}

export function loadProductDetails() {
  try {
    const params = new URLSearchParams(window.location.search);
    let productId = params.get('id');

    if (!productId) {
      try { productId = localStorage.getItem('selectedProductId'); } catch { productId = null; }
    }

    if (!productId) {
      console.error('No product ID found in URL or localStorage');
      showProductNotFound();
      return;
    }

    try { localStorage.setItem('selectedProductId', String(productId)); } catch { /* ignore */ }

    const product = getProductById(productId);
    if (product) {
      displayProductDetails(product);
    } else {
      console.error('Product not found with ID:', productId);
      showProductNotFound();
    }
  } catch (error) {
    console.error('Error loading product details:', error);
    showProductNotFound();
  }
}

function showProductNotFound() {
  const productInfo = document.querySelector('.product-info');
  const galleryMain = document.querySelector('.gallery-main');
  const mainImage = document.getElementById('main-image');

  if (productInfo) {
    productInfo.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>${escapeHTML(t('Product not found'))}</h3>
        <p>${escapeHTML(t('This product may have been removed or the link is no longer valid.'))}</p>
        <a href="/browse" class="cta-button">${escapeHTML(t('Browse the catalog'))}</a>
      </div>`;
  }

  if (mainImage) mainImage.style.display = 'none';
  if (galleryMain) {
    galleryMain.classList.remove('is-loaded');
    galleryMain.classList.add('is-failed');
  }
}

function displayProductDetails(product) {
  if (!product) return;

  const localized = localizeProduct(product);
  const displayName = localized.name;
  const displayDescription = localized.description;

  document.title = `${displayName} — DIMA Deals`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && displayDescription) {
    metaDescription.setAttribute('content', String(displayDescription).slice(0, 160));
  }

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const mainImageElement = document.getElementById('main-image');
  const mainImageContainer = document.querySelector('.product-images');
  const galleryMain = document.querySelector('.gallery-main');

  if (mainImageElement && mainImageContainer) {
    mainImageContainer.classList.toggle('is-logo', usesLogoArtwork(product));
    if (galleryMain) galleryMain.classList.remove('is-loaded', 'is-failed');

    if (mainImage) {
      mainImageElement.classList.remove('loaded');
      mainImageElement.onerror = function () {
        this.style.display = 'none';
        this.classList.remove('loaded');
        galleryMain?.classList.remove('is-loaded');
        galleryMain?.classList.add('is-failed');
      };
      mainImageElement.onload = function () {
        this.style.display = 'block';
        this.classList.add('loaded');
        galleryMain?.classList.remove('is-failed');
        galleryMain?.classList.add('is-loaded');
      };
      mainImageElement.src = mainImage;
      mainImageElement.style.display = 'block';
      mainImageElement.alt = displayName;
      if (mainImageElement.complete && mainImageElement.naturalWidth > 0) {
        mainImageElement.classList.add('loaded');
        galleryMain?.classList.add('is-loaded');
      }
    } else {
      mainImageElement.style.display = 'none';
      galleryMain?.classList.add('is-failed');
    }
  }

  // Breadcrumb
  const breadcrumb = document.getElementById('product-breadcrumb');
  if (breadcrumb) {
    const main = getMainCategories(product)[0] || 'Store';
    const mainSlug = main.toLowerCase().replace(/\s+/g, '-');
    breadcrumb.innerHTML = `
      <a href="/">${escapeHTML(t('Home'))}</a><span class="sep">/</span>
      <a href="/browse?category=${encodeURIComponent(mainSlug)}">${escapeHTML(t(main))}</a><span class="sep">/</span>
      <span class="current" data-i18n-skip>${escapeHTML(displayName)}</span>`;
  }

  // Discount badge on gallery
  const galleryBadge = document.getElementById('gallery-discount');
  const discount = getDiscountPercent(product);
  if (galleryBadge) {
    galleryBadge.textContent = discount > 0 ? `-${discount}%` : '';
    galleryBadge.style.display = discount > 0 ? 'inline-flex' : 'none';
  }

  // Main product information
  const productInfo = document.querySelector('.product-info');
  if (productInfo) {
    const isOutOfStock = product.inStock === false;
    const statusText = isOutOfStock ? t('Out of stock') : t('In stock');
    const statusClass = isOutOfStock ? 'out-of-stock-status' : 'in-stock-status';
    const price = formatPrice(localized.price);
    const main = getMainCategories(product)[0] || 'Store';
    const mainSlug = main.toLowerCase().replace(/\s+/g, '-');

    const priceHTML = `
      <div class="product-price-block">
        <span class="product-price" dir="ltr">${price} TND</span>
        ${Number(localized.originalPrice) > Number(localized.price) ? `<span class="product-old-price" dir="ltr">${formatPrice(localized.originalPrice)} TND</span>` : ''}
        ${discount > 0 ? `<span class="product-save">${escapeHTML(t('Save {percent}%', { percent: discount }))}</span>` : ''}
      </div>`;

    const buttonHTML = isOutOfStock
      ? `<button class="buy-button" disabled><i class="fas fa-ban"></i> ${escapeHTML(t('Out of stock'))}</button>`
      : `<button class="buy-button" onclick="handleBuyClick(${inlineArg(localized.id)})"><i class="fas fa-shopping-bag"></i> ${escapeHTML(t('Add to cart'))} — ${price} TND</button>`;

    productInfo.innerHTML = `
      <div class="product-info-category">
        <a href="/browse?category=${encodeURIComponent(mainSlug)}">${escapeHTML(t(main))}</a>
        <a href="/browse?category=${encodeURIComponent(localized.category)}">${escapeHTML(getCategoryLabel(localized))}</a>
      </div>
      <h1 data-i18n-skip>${escapeHTML(displayName)}</h1>
      <div class="product-meta-row">
        ${ratingHTML(localized, true)}
        <span class="availability ${statusClass}">${escapeHTML(statusText)}</span>
      </div>
      ${priceHTML}
      <p class="product-description" data-i18n-skip>${escapeHTML(displayDescription).replace(/\n/g, '<br>')}</p>
      <div class="product-purchase">${buttonHTML}</div>
      <ul class="product-assurance">
        <li><i class="fas fa-bolt"></i> ${escapeHTML(t('Instant digital delivery after verification'))}</li>
        <li><i class="fas fa-shield-alt"></i> ${escapeHTML(t('Working product or money back'))}</li>
        <li><i class="fab fa-whatsapp"></i> ${escapeHTML(t('Support on WhatsApp'))}</li>
        <li><i class="fas fa-receipt"></i> ${escapeHTML(t('Clear price in Tunisian dinars'))}</li>
      </ul>`;
  }

  // Gallery thumbnails
  const thumbnails = document.querySelector('.thumbnails');
  if (thumbnails) {
    thumbnails.innerHTML = '';
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((imgSrc, index) => {
        const shell = document.createElement('span');
        shell.className = 'thumbnail-shell product-image-shell';
        shell.innerHTML = `${PRODUCT_IMAGE_SKELETON}<img class="thumbnail product-image" loading="lazy" decoding="async" alt="${escapeHTML(displayName)} — ${index + 1}">${PRODUCT_IMAGE_FALLBACK}`;
        const thumbImg = shell.querySelector('img');

        thumbImg.onload = function () {
          this.classList.add('loaded');
          shell.classList.add('is-loaded');
          shell.classList.remove('is-failed');
        };
        thumbImg.onerror = function () {
          this.classList.remove('loaded');
          this.classList.add('is-failed');
          shell.classList.remove('is-loaded');
          shell.classList.add('is-failed');
        };
        thumbImg.src = imgSrc;
        if (thumbImg.complete && thumbImg.naturalWidth > 0) {
          thumbImg.classList.add('loaded');
          shell.classList.add('is-loaded');
        }
        thumbnails.appendChild(shell);
      });
      thumbnails.querySelector('img')?.classList.add('active');
    }
  }
}

// ============ UNIFIED BROWSE PAGE HANDLER ============

const MAIN_CATEGORY_KEYS = ['subscriptions', 'games', 'courses', 'apps'];

export function loadBrowsePage() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return false;

  const urlParams = new URLSearchParams(window.location.search);
  let category = (urlParams.get('category') || '').toLowerCase().trim();
  let type = (urlParams.get('type') || '').toLowerCase().trim();
  let key = type || category;

  if (key.includes('-')) {
    const alternative = key.replace(/-/g, '_');
    if (PRODUCTS_DATABASE[alternative]) key = alternative;
  }

  let products;
  if (!key) {
    products = getAllProducts();
  } else if (MAIN_CATEGORY_KEYS.includes(key)) {
    products = getAllProducts().filter(product =>
      getMainCategories(product).some(main => main.toLowerCase() === key)
    );
  } else {
    products = PRODUCTS_DATABASE[key] || [];
  }

  initBrowsePagination(products);

  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  const metadata = key ? CATALOG_METADATA[key] : null;

  if (!key) {
    if (pageTitle) pageTitle.textContent = t('All products');
    if (pageSubtitle) pageSubtitle.textContent = t('Every game, subscription, course and app in one place.');
  } else if (metadata) {
    if (pageTitle) pageTitle.textContent = t(metadata.title);
    if (pageSubtitle) pageSubtitle.textContent = t(metadata.subtitle);
  } else {
    if (pageTitle) pageTitle.textContent = t('Browse products');
    if (pageSubtitle) pageSubtitle.textContent = t('Discover digital products from DIMA Deals.');
  }

  // Highlight the matching top-level category chip.
  const activeMain = getMainCategories(products[0])[0]?.toLowerCase();
  document.querySelectorAll('.browse-chip').forEach(chip => {
    const chipKey = (new URL(chip.href, window.location.origin).searchParams.get('category') || '').toLowerCase();
    const active = chipKey === key || (chipKey === 'all' && !key) || (activeMain && chipKey === activeMain);
    chip.classList.toggle('active', Boolean(active));
    if (active) chip.setAttribute('aria-current', 'page');
    else chip.removeAttribute('aria-current');
  });

  const platformsSection = document.getElementById('platforms-section');
  if (platformsSection) {
    platformsSection.style.display = (key === 'pc' || key === 'games') ? 'block' : 'none';
  }

  if (pageTitle) document.title = `${pageTitle.textContent} — DIMA Deals`;

  return true;
}
