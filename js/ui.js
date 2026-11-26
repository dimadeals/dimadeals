import { escapeHTML, showToast } from './utils.js';
import { getProductById, getAllProducts, PRODUCTS_DATABASE } from './api.js';
import { CATALOG_METADATA, getMainCategories } from './products.js';
import { addToCart } from './cart.js';

// ============ LANGUAGE TRANSLATIONS ============

const TRANSLATIONS = {
  en: {
    'hero-title': 'Premium Digital Subscriptions for Tunisia',
    'hero-subtitle': 'Netflix, Spotify, Games & Courses – Instant Delivery & Secure Payments',
    'browse-deals': 'Browse Deals',
    'popular-platforms': 'Popular Platforms',
    'popular-platforms-subtitle': 'Choose from the most popular streaming services',
    'most-popular': 'Most Popular',
    'most-popular-subtitle': 'Top-selling subscriptions this month',
    'recommended': 'Recommended',
    'recommended-subtitle': 'Curated picks for you',
    'why-choose': 'Why Choose DIMA Deals?',
    'instant-delivery': 'Instant Delivery',
    'instant-delivery-desc': 'Get your subscription codes immediately via email after purchase',
    'secure-payment': 'Secure Payment',
    'secure-payment-desc': 'Safe and encrypted transactions for your peace of mind',
    '24-7-support': '24/7 Support',
    '24-7-support-desc': 'Dedicated customer support team ready to help anytime',
    '100-guarantee': '100% Guarantee',
    '100-guarantee-desc': 'Satisfaction guaranteed or your money back',
    'Related-Products': 'Related Products',
    'also-like': 'You might also like these',
  },
  fr: {
    'hero-title': 'Abonnements numériques premium pour la Tunisie',
    'hero-subtitle': 'Netflix, Spotify, Jeux et Cours – Livraison instantanée et paiements sécurisés',
    'browse-deals': 'Parcourir les offres',
    'popular-platforms': 'Plateformes populaires',
    'popular-platforms-subtitle': 'Choisissez parmi les services de diffusion les plus populaires',
    'most-popular': 'Plus populaire',
    'most-popular-subtitle': 'Abonnements les plus vendus ce mois-ci',
    'recommended': 'Recommandé',
    'recommended-subtitle': 'Sélections curées pour vous',
    'why-choose': 'Pourquoi choisir DIMA Deals?',
    'instant-delivery': 'Livraison instantanée',
    'instant-delivery-desc': 'Recevez vos codes d\'abonnement immédiatement par email après votre achat',
    'secure-payment': 'Paiement sécurisé',
    'secure-payment-desc': 'Transactions sûres et cryptées pour votre tranquillité d\'esprit',
    '24-7-support': 'Support 24h/24 7j/7',
    '24-7-support-desc': 'Équipe de support client dédiée prête à aider à tout moment',
    '100-guarantee': '100% Garantie',
    '100-guarantee-desc': 'Satisfaction garantie ou argent remboursé',
    'Related-Products': 'produits connexes',
    'also-like': 'Vous aimerez peut-être aussi'
  },
  ar: {
    'hero-title': 'اشتراكات رقمية فاخرة لتونس',
    'hero-subtitle': 'Netflix وSpotify والألعاب والدورات – التسليم الفوري والدفع الآمن',
    'browse-deals': 'تصفح الصفقات',
    'popular-platforms': 'المنصات الشهيرة',
    'popular-platforms-subtitle': 'اختر من بين خدمات البث الأكثر شهرة',
    'most-popular': 'الأكثر شهرة',
    'most-popular-subtitle': 'الاشتراكات الأكثر مبيعًا هذا الشهر',
    'recommended': 'موصى به',
    'recommended-subtitle': 'خيارات مختارة لك',
    'why-choose': 'لماذا تختار DIMA Deals؟',
    'instant-delivery': 'التسليم الفوري',
    'instant-delivery-desc': 'احصل على رموز الاشتراك الخاصة بك فوراً عبر البريد الإلكتروني بعد الشراء',
    'secure-payment': 'دفع آمن',
    'secure-payment-desc': 'معاملات آمنة ومشفرة لراحتك النفسية',
    '24-7-support': 'الدعم 24/7',
    '24-7-support-desc': 'فريق دعم عملاء مخصص جاهز للمساعدة في أي وقت',
    '100-guarantee': '100% ضمان',
    '100-guarantee-desc': 'الرضا مضمون أو استرد أموالك',
    'Related-Products': 'المنتجات ذات الصلة',
    'also-like': 'قد تعجبك أيضًا هذه'
  }
};

export function applyLanguage(lang) {
  const safeLang = ['en', 'fr', 'ar'].includes(lang) ? lang : 'en';

  // Save language preference
  try { localStorage.setItem('language', safeLang); } catch { /* ignore */ }

  // Set HTML lang attribute and direction
  document.documentElement.lang = safeLang;
  document.documentElement.dir = safeLang === 'ar' ? 'rtl' : 'ltr';

  // Apply translations to all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (TRANSLATIONS[safeLang] && TRANSLATIONS[safeLang][key]) {
      element.textContent = TRANSLATIONS[safeLang][key];
    }
  });
}

export function initializeLanguage() {
  let savedLanguage = 'en';
  try { savedLanguage = localStorage.getItem('language') || 'en'; } catch { /* ignore */ }
  if (!['en', 'fr', 'ar'].includes(savedLanguage)) savedLanguage = 'en';

  const languageSelect = document.getElementById('language-select');
  if (languageSelect) languageSelect.value = savedLanguage;

  applyLanguage(savedLanguage);
}

// ============ ENHANCED PRODUCT RENDERING ============

function inlineArg(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return escapeHTML(JSON.stringify(String(value ?? '')));
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0';
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

export function createProductCard(product) {
  if (!product) return '';

  // Handle image with fallback
  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const imageHTML = imageSrc
    ? `<img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(product.name)}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.onerror=null;this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex';">`
    : '';

  const noImageHTML = `<div class="no-image-card-message"${imageSrc ? ' style="display:none"' : ''}>🚫 No Image Available</div>`;

  // Create rating stars
  const rating = Number(product.rating) || 0;
  const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 ? '✦' : '');
  const ratingHTML = rating
    ? `<div class="product-rating"><span class="stars">${stars}</span> <span class="rating-value">${rating.toFixed(1)}</span></div>`
    : '';

  // Create badges
  let badgesHTML = '';
  if (product.popular) badgesHTML += '<span class="badge badge-popular">Popular</span>';
  if (product.recommended) badgesHTML += '<span class="badge badge-recommended">Recommended</span>';
  badgesHTML += '<span class="badge badge-instant">⚡ Instant</span>';

  const badgesContainer = badgesHTML ? `<div class="product-badges">${badgesHTML}</div>` : '';

  // Main categories display
  const mainCats = getMainCategories(product);
  const mainCatHTML = mainCats.length > 0
    ? `<div class="product-main-categories">${mainCats.map(mc => `<span class="main-cat-badge">${escapeHTML(mc)}</span>`).join('')}</div>`
    : '';

  // Check if product is out of stock
  const isOutOfStock = product.inStock === false;
  const outOfStockOverlay = isOutOfStock ? '<div class="out-of-stock-overlay"><div class="out-of-stock-label">OUT OF STOCK</div></div>' : '';
  const outOfStockClass = isOutOfStock ? 'out-of-stock' : '';

  // Create price HTML with discount if applicable
  const price = formatPrice(product.price);
  let priceHTML = `<p class="price">${price} TND</p>`;
  if (product.originalPrice && Number(product.originalPrice) > Number(product.price)) {
    priceHTML = `
      <div class="price-container">
        <p class="price">${price} TND</p>
        <p class="original-price"><strike>${formatPrice(product.originalPrice)} TND</strike></p>
      </div>
    `;
  }

  // Create action button
  let buttonHTML = '';
  if (isOutOfStock) {
    buttonHTML = '<button class="buy-now-button" disabled><i class="fas fa-ban"></i> Out of Stock</button>';
  } else {
    buttonHTML = `<button class="buy-now-button" onclick="event.stopPropagation(); handleBuyClick(${inlineArg(product.id)});"><i class="fas fa-shopping-bag"></i> Get Access Now</button>`;
  }

  return `
    <div class="product-card ${outOfStockClass}" role="button" tabindex="0"
         aria-label="View ${escapeHTML(product.name)}"
         onclick="viewProductDetails(${inlineArg(product.id)})"
         onkeydown="if(event.target!==event.currentTarget)return; if(event.key==='Enter'||event.key===' '){event.preventDefault();viewProductDetails(${inlineArg(product.id)});}">
      ${badgesContainer}
      <div class="product-image-container">
        ${imageHTML}
        ${noImageHTML}
        ${outOfStockOverlay}
      </div>
      <h3>${escapeHTML(product.name)}</h3>
      ${mainCatHTML}
      ${priceHTML}
      ${ratingHTML}
      <p class="product-description-preview">${escapeHTML(product.description)}</p>
      ${buttonHTML}
    </div>
  `;
}

// Handle Buy Now button clicks from product cards and product detail page
export function handleBuyClick(productId) {
  const product = getProductById(productId);
  if (product) {
    addToCart(product, 1);
  } else {
    showToast('Product not found. Please refresh and try again.', 'error');
  }
}

// ============ PAGINATION ============

const INITIAL_LOAD    = 8;
const LOAD_MORE_COUNT = 8;

let allBrowseProducts = [];
let browseShownCount  = 0;
let allSearchProducts = [];
let searchShownCount  = 0;

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
        <span class="see-more-icon"><i class="fas fa-th-large"></i></span>
        <span class="see-more-text">Show ${next} More</span>
        <span class="see-more-pill">${remaining} left</span>
      </button>`;
  } else if (seeMore) {
    seeMore.innerHTML = `<p class="all-loaded-msg"><i class="fas fa-check-circle"></i> All products loaded</p>`;
    setTimeout(() => seeMore.remove(), 2000);
  }
}

// ── Browse page ──────────────────────────────
export function initBrowsePagination(products) {
  allBrowseProducts = Array.isArray(products) ? products : [];
  browseShownCount = 0;
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  // Remove any existing see-more container
  const old = grid.parentNode.querySelector('.see-more-container');
  if (old) old.remove();

  if (allBrowseProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>No products here yet</h3>
        <p>This category is empty right now. Check out our other deals!</p>
        <a href="/browse" class="cta-button">Browse All Products</a>
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
  allSearchProducts = products;
  searchShownCount  = 0;
  const grid = document.getElementById('search-results-grid');
  if (!grid) return;
  const old = grid.parentNode.querySelector('.see-more-container');
  if (old) old.remove();
  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try a different search or filter</p>
        <a href="/" class="cta-button">Browse All Products</a>
      </div>`;
    return;
  }
  grid.innerHTML = '';
  const batch = products.slice(0, INITIAL_LOAD);
  grid.innerHTML = batch.map(p => createProductCard(p)).join('');
  searchShownCount = batch.length;
  _updateSeeMoreBtn(products.length, searchShownCount, 'search-results-grid', 'loadMoreSearch');
}

export function loadMoreSearch() {
  const grid = document.getElementById('search-results-grid');
  if (!grid) return;
  const batch = allSearchProducts.slice(searchShownCount, searchShownCount + LOAD_MORE_COUNT);
  grid.insertAdjacentHTML('beforeend', batch.map(p => createProductCard(p)).join(''));
  searchShownCount += batch.length;
  _updateSeeMoreBtn(allSearchProducts.length, searchShownCount, 'search-results-grid', 'loadMoreSearch');
}

// ============ END PAGINATION ============

export function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with ID '${containerId}' not found`);
    return;
  }

  if (!Array.isArray(products)) {
    console.error('Products must be an array');
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Something went wrong</h3>
      <p>Could not load products. Please try refreshing.</p>
      <button class="cta-button" onclick="location.reload()">Refresh Page</button>
    </div>`;
    return;
  }

  if (products.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-box-open"></i>
      <h3>No products available</h3>
      <p>Check back later for new arrivals!</p>
      <a href="/" class="cta-button">Back to Home</a>
    </div>`;
    return;
  }

  try {
    container.innerHTML = products.map(product => createProductCard(product)).join('');
  } catch (error) {
    console.error('Error rendering products:', error);
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Something went wrong</h3>
      <p>Could not display products. Please try refreshing.</p>
      <button class="cta-button" onclick="location.reload()">Refresh Page</button>
    </div>`;
  }
}

// ============ PRODUCT DETAILS & NAVIGATION ============

export function viewProductDetails(productId) {
  if (productId === undefined || productId === null || productId === '') {
    console.error('Invalid product ID:', productId);
    showToast('Error: Invalid product selected', 'error');
    return;
  }

  try {
    // Keep the id in localStorage for backwards compatibility, but put it in
    // the URL too so product pages can be shared, bookmarked, and refreshed.
    localStorage.setItem('selectedProductId', String(productId));
    window.location.href = `/product?id=${encodeURIComponent(productId)}`;
  } catch (error) {
    console.error('Error navigating to product details:', error);
    showToast('Error: Could not load product details', 'error');
  }
}

export function loadProductDetails() {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('id');
    let productId = urlId;

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
  const mainImageContainer = document.querySelector('.product-images');

  if (productInfo) {
    productInfo.innerHTML = `
      <h2>Product Not Found</h2>
      <p>Sorry, the product you're looking for doesn't exist or has been removed.</p>
      <button onclick="window.location.href='/'" class="details-button">Back to Home</button>
    `;
  }

  if (mainImageContainer) {
    const mainImage = document.getElementById('main-image');
    if (mainImage) mainImage.style.display = 'none';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-image-message main-image-message';
    messageDiv.innerHTML = '❌ Product not found';
    mainImageContainer.appendChild(messageDiv);
  }
}

function displayProductDetails(product) {
  if (!product) {
    console.error('Product not found');
    return;
  }

  // Handle image with better error handling
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

  // Update main image or show message
  const mainImageElement = document.getElementById('main-image');
  const mainImageContainer = document.querySelector('.product-images');

  if (mainImageElement && mainImageContainer) {
    // Remove any existing messages first
    const existingMessage = mainImageContainer.querySelector('.main-image-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    if (mainImage) {
      // Set handlers BEFORE src so a cached image cannot finish loading before
      // the .loaded class is attached (which would leave it at opacity: 0).
      mainImageElement.onerror = function() {
        this.style.display = 'none';
        showNoImageMessage();
      };

      mainImageElement.onload = function() {
        this.style.display = 'block';
        this.classList.add('loaded');
      };

      mainImageElement.src = mainImage;
      mainImageElement.style.display = 'block';
      mainImageElement.alt = product.name;

      if (mainImageElement.complete && mainImageElement.naturalWidth > 0) {
        mainImageElement.classList.add('loaded');
      }
    } else {
      // No image available
      mainImageElement.style.display = 'none';
      showNoImageMessage();
    }
  }

  function showNoImageMessage() {
    // Remove any existing message first
    const existingMessage = mainImageContainer.querySelector('.main-image-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Add message before thumbnails
    const thumbnails = document.querySelector('.thumbnails');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-image-message main-image-message';
    messageDiv.innerHTML = '🚫 You got us! We still don\'t have an image for this product';

    if (thumbnails) {
      mainImageContainer.insertBefore(messageDiv, thumbnails);
    } else {
      mainImageContainer.appendChild(messageDiv);
    }
  }

  // Update product info
  const productInfo = document.querySelector('.product-info');
  if (productInfo) {
    // Check if product is out of stock
    const isOutOfStock = product.inStock === false;
    const statusText = isOutOfStock ? 'Out of Stock' : (product.availability || 'In Stock');
    const statusClass = isOutOfStock ? 'out-of-stock-status' : 'in-stock-status';
    
    // Check if product has a discount
    const price = formatPrice(product.price);
    let priceDisplayHTML = `<p class="price"><i class="fas fa-tag"></i> ${price} TND</p>`;

    if (product.originalPrice && Number(product.originalPrice) > Number(product.price)) {
      priceDisplayHTML = `
        <div class="price-detail">
          <p class="price"><i class="fas fa-tag"></i> ${price} TND <strike>${formatPrice(product.originalPrice)} TND</strike></p>
        </div>
      `;
    }

    // Create button HTML based on stock status
    let buttonHTML = '';
    if (isOutOfStock) {
      buttonHTML = `
        <button class="buy-button out-of-stock-button" disabled>
          <i class="fas fa-ban"></i> Out of Stock - Cannot Purchase
        </button>
      `;
    } else {
      buttonHTML = `
        <button class="buy-button" onclick="handleBuyClick(${inlineArg(product.id)})">
          <i class="fas fa-shopping-cart"></i> Buy Now for ${price} TND
        </button>
      `;
    }

    productInfo.innerHTML = `
      <h1>${escapeHTML(product.name)}</h1>
      <p class="availability ${statusClass}">${escapeHTML(statusText)}</p>
      ${priceDisplayHTML}
      <p class="product-description">${escapeHTML(product.description).replace(/\n/g, '<br>')}</p>
      ${buttonHTML}
      <div class="product-trust-section">
        <div class="trust-badges">
          <div class="trust-badge"><i class="fas fa-bolt"></i><span>Instant delivery after purchase</span></div>
          <div class="trust-badge"><i class="fab fa-whatsapp"></i><span>24/7 support via WhatsApp</span></div>
          <div class="trust-badge"><i class="fas fa-users"></i><span>Trusted by 100+ customers</span></div>
          <div class="trust-badge"><i class="fas fa-shield-alt"></i><span>100% working or money back</span></div>
        </div>
      </div>
    `;
  }

  // Generate thumbnail images below the main image
  const thumbnails = document.querySelector('.thumbnails');
  if (thumbnails) {
    // Clear existing thumbnails
    thumbnails.innerHTML = '';

    if (product.images && product.images.length > 0) {
      // Show thumbnails for all available images
      product.images.forEach((imgSrc, index) => {
        const thumbImg = document.createElement('img');
        thumbImg.alt = `Image ${index + 1}`;
        thumbImg.loading = 'lazy';
        thumbImg.className = 'thumbnail';
        thumbImg.onload = function() { this.classList.add('loaded'); };
        thumbImg.onerror = function() { this.style.display = 'none'; };
        thumbImg.src = imgSrc;
        if (thumbImg.complete && thumbImg.naturalWidth > 0) thumbImg.classList.add('loaded');
        thumbnails.appendChild(thumbImg);
      });
    }
  }
}

// ============ UNIFIED BROWSE PAGE HANDLER ============

const MAIN_CATEGORY_KEYS = ['subscriptions', 'games', 'courses', 'apps'];

export function loadBrowsePage() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return false; // Not on browse page

  const urlParams = new URLSearchParams(window.location.search);
  let category = (urlParams.get('category') || '').toLowerCase().trim();
  let type = (urlParams.get('type') || '').toLowerCase().trim();
  let key = type || category;

  // Older links use "mobile-apps"; the catalog slug is "mobile_apps".
  if (key.includes('-')) {
    const alternative = key.replace(/-/g, '_');
    if (PRODUCTS_DATABASE[alternative]) key = alternative;
  }

  let products;
  if (!key) {
    // /browse with no filter: show the entire catalog instead of a blank page.
    products = getAllProducts();
  } else if (MAIN_CATEGORY_KEYS.includes(key)) {
    products = getAllProducts().filter(product =>
      getMainCategories(product).some(main => main.toLowerCase() === key)
    );
  } else {
    products = PRODUCTS_DATABASE[key] || [];
  }

  // Initialize paginated display
  initBrowsePagination(products);

  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  const metadata = key ? CATALOG_METADATA[key] : null;

  if (!key) {
    if (pageTitle) pageTitle.textContent = 'All Products';
    if (pageSubtitle) pageSubtitle.textContent = 'Browse every deal available at DIMA Deals';
  } else if (metadata) {
    if (pageTitle) pageTitle.textContent = metadata.title;
    if (pageSubtitle) pageSubtitle.textContent = metadata.subtitle;
  } else {
    if (pageTitle) pageTitle.textContent = 'Browse Products';
    if (pageSubtitle) pageSubtitle.textContent = 'Discover amazing digital products';
  }

  // Show the platform shortcuts for PC games / the games section.
  const platformsSection = document.getElementById('platforms-section');
  if (platformsSection) {
    platformsSection.style.display = (key === 'pc' || key === 'games') ? 'block' : 'none';
  }

  return true;
}

// ============ MOUSE TRACKING FOR HERO BACKGROUND ============

const heroSection = document.querySelector('.hero');
const gradient1 = document.querySelector('.gradient-1');
const gradient2 = document.querySelector('.gradient-2');
const heroBg = document.querySelector('.hero-background');
const particles = document.querySelectorAll('.particle');

let mouseX = 0;
let mouseY = 0;
let targetX1 = 0;
let targetY1 = 0;
let targetX2 = 0;
let targetY2 = 0;
let currentX1 = 0;
let currentY1 = 0;
let currentX2 = 0;
let currentY2 = 0;

if (heroSection && gradient1 && gradient2) {
  document.addEventListener('mousemove', (e) => {
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    
    // Only track if mouse is over hero section
    if (e.clientX < rect.left || e.clientX > rect.right || 
        e.clientY < rect.top || e.clientY > rect.bottom) {
      return;
    }
    
    const heroX = rect.left;
    const heroY = rect.top;
    const heroWidth = rect.width;
    const heroHeight = rect.height;
    
    // Calculate mouse position relative to hero section
    mouseX = e.clientX - heroX;
    mouseY = e.clientY - heroY;
    
    // Calculate normalized values (-1 to 1)
    const normalizedX = (mouseX / heroWidth) * 2 - 1;
    const normalizedY = (mouseY / heroHeight) * 2 - 1;
    
    // Gradient 1 moves toward mouse (attracted)
    targetX1 = normalizedX * 60;
    targetY1 = normalizedY * 60;
    
    // Gradient 2 moves away from mouse (repelled)
    targetX2 = normalizedX * -70;
    targetY2 = normalizedY * -70;
    
    // Apply smooth easing
    currentX1 += (targetX1 - currentX1) * 0.08;
    currentY1 += (targetY1 - currentY1) * 0.08;
    currentX2 += (targetX2 - currentX2) * 0.08;
    currentY2 += (targetY2 - currentY2) * 0.08;
    
    gradient1.style.transform = `translate(${currentX1}px, ${currentY1}px)`;
    gradient2.style.transform = `translate(${currentX2}px, ${currentY2}px)`;
    
    // Apply subtle effect to particles
    particles.forEach((particle, index) => {
      const particleRect = particle.getBoundingClientRect();
      const particleX = particleRect.left - heroX;
      const particleY = particleRect.top - heroY;
      
      // Calculate distance from mouse to particle
      const dx = mouseX - particleX;
      const dy = mouseY - particleY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        // Particles are repelled from mouse
        const angle = Math.atan2(dy, dx);
        const force = (1 - distance / maxDistance) * 15;
        const pushX = Math.cos(angle) * force;
        const pushY = Math.sin(angle) * force;
        
        particle.style.transform = `translate(${pushX}px, ${pushY}px)`;
      } else {
        particle.style.transform = 'translate(0px, 0px)';
      }
    });
  });
  
  // Reset position when mouse leaves
  heroSection.addEventListener('mouseleave', () => {
    targetX1 = 0;
    targetY1 = 0;
    targetX2 = 0;
    targetY2 = 0;
    
    // Reset particles
    particles.forEach(particle => {
      particle.style.transform = 'translate(0px, 0px)';
    });
    
    // Smooth animation back to center
    const animate = () => {
      currentX1 += (targetX1 - currentX1) * 0.1;
      currentY1 += (targetY1 - currentY1) * 0.1;
      currentX2 += (targetX2 - currentX2) * 0.1;
      currentY2 += (targetY2 - currentY2) * 0.1;
      
      gradient1.style.transform = `translate(${currentX1}px, ${currentY1}px)`;
      gradient2.style.transform = `translate(${currentX2}px, ${currentY2}px)`;
      
      if (Math.abs(currentX1) > 0.5 || Math.abs(currentY1) > 0.5 || 
          Math.abs(currentX2) > 0.5 || Math.abs(currentY2) > 0.5) {
        requestAnimationFrame(animate);
      } else {
        currentX1 = 0;
        currentY1 = 0;
        currentX2 = 0;
        currentY2 = 0;
        gradient1.style.transform = 'translate(0px, 0px)';
        gradient2.style.transform = 'translate(0px, 0px)';
      }
    };
    animate();
  });
}
