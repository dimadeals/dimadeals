import { escapeHTML, showToast } from './utils.js';
import { getProductById, getAllProducts, PRODUCTS_DATABASE } from './api.js';
import { CATALOG_METADATA, getMainCategories } from './products.js';
import { addToCart } from './cart.js';

// ============ LANGUAGE TRANSLATIONS ============

const TRANSLATIONS = {
  en: {
    'hero-title': 'Games, subscriptions and software.',
    'hero-title-accent': 'Delivered in minutes.',
    'hero-subtitle': 'PC and console titles, streaming plans, courses and software — chosen for gamers, creators and students in Tunisia. Pay in TND and get your access digitally.',
    'explore-games': 'Explore games',
    'browse-deals': 'Browse the catalog',
    'eyebrow-store': "Tunisia's digital store",
    'eyebrow-browse': 'Browse the catalog',
    'eyebrow-trending': 'Trending this month',
    'eyebrow-offers': 'Selected offers',
    'eyebrow-standard': 'The DIMA standard',
    'shop-category': 'Shop by category',
    'view-everything': 'View everything',
    'shop-all': 'Shop all',
    'see-game-deals': 'See game deals',
    'cat-subs': 'Subscriptions',
    'cat-subs-desc': 'Netflix, Spotify, Canva & more',
    'cat-games': 'Games',
    'cat-games-desc': 'PC, console, mobile & gift cards',
    'cat-courses': 'Courses',
    'cat-courses-desc': 'Programming, design & business',
    'cat-apps': 'Apps & software',
    'cat-apps-desc': 'Tools, licenses & mobile apps',
    'hero-point-1': 'Instant digital delivery',
    'hero-point-2': 'Verified before delivery',
    'hero-point-3': 'Local WhatsApp support',
    'cta-title': 'Not sure which plan or platform to pick?',
    'cta-desc': 'Tell us what you need and we will point you to the right product — no pressure.',
    'cta-button': 'Chat on WhatsApp',
    'popular-platforms': 'Popular platforms',
    'popular-platforms-subtitle': 'The services customers ask for most',
    'most-popular': 'Most popular',
    'most-popular-subtitle': 'The products our customers keep coming back for',
    'recommended': 'Featured deals',
    'recommended-subtitle': 'Hand-picked offers with clear savings',
    'why-choose': 'Why buy from DIMA Deals',
    'instant-delivery': 'Instant delivery',
    'instant-delivery-desc': 'Digital codes and access sent as soon as your order is verified.',
    'secure-payment': 'Secure checkout',
    'secure-payment-desc': 'Your details are handled carefully and payment is confirmed manually.',
    '24-7-support': 'Local support',
    '24-7-support-desc': 'Message us on WhatsApp and talk to a real person in Tunisia.',
    '100-guarantee': 'Working or refunded',
    '100-guarantee-desc': 'If a product does not work as described, we make it right.',
    'Related-Products': 'Related products',
    'also-like': 'More from the same part of the store',
  },
  fr: {
    'hero-title': 'Jeux, abonnements et logiciels.',
    'hero-title-accent': 'Livrés en quelques minutes.',
    'hero-subtitle': 'Jeux PC et console, abonnements streaming, cours et logiciels — choisis pour les gamers, créateurs et étudiants en Tunisie. Payez en TND et recevez votre accès en ligne.',
    'explore-games': 'Explorer les jeux',
    'browse-deals': 'Parcourir le catalogue',
    'eyebrow-store': 'La boutique numérique en Tunisie',
    'eyebrow-browse': 'Parcourir le catalogue',
    'eyebrow-trending': 'Tendances du mois',
    'eyebrow-offers': 'Offres sélectionnées',
    'eyebrow-standard': 'Le standard DIMA',
    'shop-category': 'Acheter par catégorie',
    'view-everything': 'Tout voir',
    'shop-all': 'Voir tout',
    'see-game-deals': 'Voir les offres jeux',
    'cat-subs': 'Abonnements',
    'cat-subs-desc': 'Netflix, Spotify, Canva et plus',
    'cat-games': 'Jeux',
    'cat-games-desc': 'PC, console, mobile et cartes cadeaux',
    'cat-courses': 'Cours',
    'cat-courses-desc': 'Programmation, design et business',
    'cat-apps': 'Applications et logiciels',
    'cat-apps-desc': 'Outils, licences et apps mobiles',
    'hero-point-1': 'Livraison numérique instantanée',
    'hero-point-2': 'Vérifié avant livraison',
    'hero-point-3': 'Support WhatsApp local',
    'cta-title': 'Vous hésitez entre une offre ou une plateforme ?',
    'cta-desc': 'Dites-nous ce qu’il vous faut et nous vous orienterons vers le bon produit — sans pression.',
    'cta-button': 'Discuter sur WhatsApp',
    'popular-platforms': 'Plateformes populaires',
    'popular-platforms-subtitle': 'Les services les plus demandés par nos clients',
    'most-popular': 'Les plus populaires',
    'most-popular-subtitle': 'Les produits que nos clients reviennent chercher',
    'recommended': 'Offres à la une',
    'recommended-subtitle': 'Une sélection d’offres aux économies claires',
    'why-choose': 'Pourquoi acheter chez DIMA Deals',
    'instant-delivery': 'Livraison instantanée',
    'instant-delivery-desc': 'Codes et accès numériques envoyés dès que votre commande est vérifiée.',
    'secure-payment': 'Paiement sécurisé',
    'secure-payment-desc': 'Vos informations sont traitées avec soin et le paiement est confirmé manuellement.',
    '24-7-support': 'Support local',
    '24-7-support-desc': 'Écrivez-nous sur WhatsApp et parlez à une vraie personne en Tunisie.',
    '100-guarantee': 'Fonctionnel ou remboursé',
    '100-guarantee-desc': 'Si un produit ne fonctionne pas comme décrit, nous corrigeons le problème.',
    'Related-Products': 'Produits connexes',
    'also-like': 'D’autres produits du même univers',
  },
  ar: {
    'hero-title': 'ألعاب واشتراكات وبرامج.',
    'hero-title-accent': 'تُسلّم في دقائق.',
    'hero-subtitle': 'ألعاب الكمبيوتر والكونسول، اشتراكات البث، الدورات والبرامج — مختارة للاعبين والمبدعين والطلاب في تونس. ادفع بالدينار التونسي واستلم وصولك رقمياً.',
    'explore-games': 'استكشف الألعاب',
    'browse-deals': 'تصفح المتجر',
    'eyebrow-store': 'متجر تونس الرقمي',
    'eyebrow-browse': 'تصفح المتجر',
    'eyebrow-trending': 'الأكثر رواجاً هذا الشهر',
    'eyebrow-offers': 'عروض مختارة',
    'eyebrow-standard': 'معيار DIMA',
    'shop-category': 'تسوق حسب الفئة',
    'view-everything': 'عرض الكل',
    'shop-all': 'تسوق الكل',
    'see-game-deals': 'شاهد عروض الألعاب',
    'cat-subs': 'الاشتراكات',
    'cat-subs-desc': 'نتفليكس، سبوتيفاي، كانفا والمزيد',
    'cat-games': 'الألعاب',
    'cat-games-desc': 'كمبيوتر، كونسول، موبايل وبطاقات هدايا',
    'cat-courses': 'الدورات',
    'cat-courses-desc': 'البرمجة، التصميم والأعمال',
    'cat-apps': 'التطبيقات والبرامج',
    'cat-apps-desc': 'أدوات وتراخيص وتطبيقات موبايل',
    'hero-point-1': 'تسليم رقمي فوري',
    'hero-point-2': 'تم التحقق قبل التسليم',
    'hero-point-3': 'دعم واتساب محلي',
    'cta-title': 'لست متأكداً من الخطة أو المنصة المناسبة؟',
    'cta-desc': 'أخبرنا بما تحتاجه وسنوجهك إلى المنتج المناسب — دون ضغط.',
    'cta-button': 'تحدث على واتساب',
    'popular-platforms': 'المنصات الشهيرة',
    'popular-platforms-subtitle': 'الخدمات الأكثر طلباً من عملائنا',
    'most-popular': 'الأكثر رواجاً',
    'most-popular-subtitle': 'المنتجات التي يعود إليها عملاؤنا دائماً',
    'recommended': 'عروض مميزة',
    'recommended-subtitle': 'مجموعة مختارة من العروض بتوفير واضح',
    'why-choose': 'لماذا تشتري من DIMA Deals',
    'instant-delivery': 'تسليم فوري',
    'instant-delivery-desc': 'أكواد الوصول الرقمية تُرسل فور التحقق من طلبك.',
    'secure-payment': 'دفع آمن',
    'secure-payment-desc': 'معلوماتك تُعالج بعناية ويتم تأكيد الدفع يدوياً.',
    '24-7-support': 'دعم محلي',
    '24-7-support-desc': 'راسلنا على واتساب وتحدث مع شخص حقيقي في تونس.',
    '100-guarantee': 'يعمل أو نعيد المال',
    '100-guarantee-desc': 'إذا لم يعمل المنتج كما هو موضح، نصحح الأمر.',
    'Related-Products': 'منتجات ذات صلة',
    'also-like': 'المزيد من نفس القسم',
  },
};

export function applyLanguage(lang) {
  const safeLang = ['en', 'fr', 'ar'].includes(lang) ? lang : 'en';

  try { localStorage.setItem('language', safeLang); } catch { /* ignore */ }

  document.documentElement.lang = safeLang;
  document.documentElement.dir = safeLang === 'ar' ? 'rtl' : 'ltr';

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
  if (CATEGORY_LABELS[category]) return CATEGORY_LABELS[category];
  if (category) return category.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const main = getMainCategories(product)[0];
  return main || 'Digital product';
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
  return `<span class="${large ? 'product-rating-large' : 'product-rating'}" aria-label="Rated ${rating.toFixed(1)} out of 5"><span class="stars">${stars}</span> <span class="rating-value">${rating.toFixed(1)}</span></span>`;
}

export function createProductCard(product) {
  if (!product) return '';

  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const imageHTML = imageSrc
    ? `<img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(product.name)}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.onerror=null;this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex';">`
    : '';
  const noImageHTML = `<div class="no-image-card-message"${imageSrc ? ' style="display:none"' : ''}>No image available</div>`;

  const discount = getDiscountPercent(product);
  const badges = [];
  if (product.popular) badges.push('<span class="badge badge-popular">Popular</span>');
  if (product.recommended) badges.push('<span class="badge badge-recommended">Recommended</span>');
  if (discount > 0) badges.push(`<span class="badge badge-discount">-${discount}%</span>`);

  const isOutOfStock = product.inStock === false;
  const overlay = isOutOfStock
    ? '<div class="out-of-stock-overlay"><span class="out-of-stock-label">Out of stock</span></div>'
    : '';

  const price = formatPrice(product.price);
  const hasOriginal = Number(product.originalPrice) > Number(product.price);
  const priceRow = `
    <div class="product-price-row">
      <span class="price">${price} TND</span>
      ${hasOriginal ? `<span class="original-price">${formatPrice(product.originalPrice)} TND</span>` : ''}
    </div>`;

  const buttonHTML = isOutOfStock
    ? '<button class="buy-now-button" disabled><i class="fas fa-ban"></i> Out of stock</button>'
    : `<button class="buy-now-button" onclick="event.stopPropagation(); handleBuyClick(${inlineArg(product.id)});"><i class="fas fa-shopping-bag"></i> Add to cart</button>`;

  return `
    <article class="product-card ${isOutOfStock ? 'out-of-stock' : ''} ${usesLogoArtwork(product) ? 'product-card--contain' : ''}"
             role="button" tabindex="0"
             aria-label="View ${escapeHTML(product.name)}"
             onclick="viewProductDetails(${inlineArg(product.id)})"
             onkeydown="if(event.target!==event.currentTarget)return; if(event.key==='Enter'||event.key===' '){event.preventDefault();viewProductDetails(${inlineArg(product.id)});}">
      <div class="product-card-media">
        ${imageHTML}
        ${noImageHTML}
        ${overlay}
        ${badges.length ? `<div class="product-card-badges">${badges.join('')}</div>` : ''}
      </div>
      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-category">${escapeHTML(getCategoryLabel(product))}</span>
          ${ratingHTML(product)}
        </div>
        <h3 class="product-card-title">${escapeHTML(product.name)}</h3>
        <p class="product-card-description">${escapeHTML(product.description)}</p>
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
    addToCart(product, 1);
  } else {
    showToast('Product not found. Please refresh and try again.', 'error');
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
        <span class="see-more-text">Show ${next} more</span>
        <span class="see-more-pill">${remaining} left</span>
      </button>`;
  } else if (seeMore) {
    seeMore.innerHTML = '<p class="all-loaded-msg"><i class="fas fa-check-circle"></i> All products loaded</p>';
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
    count.innerHTML = `<strong>${allBrowseProducts.length}</strong> product${allBrowseProducts.length === 1 ? '' : 's'} available`;
  }

  const old = grid.parentNode.querySelector('.see-more-container');
  if (old) old.remove();

  if (allBrowseProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>No products here yet</h3>
        <p>This category is empty right now. Browse the full catalog for other deals.</p>
        <a href="/browse" class="cta-button">Browse all products</a>
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
        <h3>No products found</h3>
        <p>Try a different search term or clear the category filter.</p>
        <a href="/browse" class="cta-button">Browse the catalog</a>
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
        <h3>Something went wrong</h3>
        <p>Could not load products. Please refresh the page.</p>
        <button class="cta-button" onclick="location.reload()">Refresh page</button>
      </div>`;
    return;
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>No products available</h3>
        <p>Check back later for new arrivals.</p>
        <a href="/browse" class="cta-button">Browse the catalog</a>
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
        <h3>Something went wrong</h3>
        <p>Could not display products. Please refresh the page.</p>
        <button class="cta-button" onclick="location.reload()">Refresh page</button>
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
  const mainImageContainer = document.querySelector('.product-images');

  if (productInfo) {
    productInfo.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>Product not found</h3>
        <p>This product may have been removed or the link is no longer valid.</p>
        <a href="/browse" class="cta-button">Browse the catalog</a>
      </div>`;
  }

  if (mainImageContainer) {
    const mainImage = document.getElementById('main-image');
    if (mainImage) mainImage.style.display = 'none';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-image-message main-image-message';
    messageDiv.textContent = 'Product not found';
    mainImageContainer.appendChild(messageDiv);
  }
}

function displayProductDetails(product) {
  if (!product) return;

  document.title = `${product.name} — DIMA Deals`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && product.description) {
    metaDescription.setAttribute('content', String(product.description).slice(0, 160));
  }

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const mainImageElement = document.getElementById('main-image');
  const mainImageContainer = document.querySelector('.product-images');

  if (mainImageElement && mainImageContainer) {
    mainImageContainer.classList.toggle('is-logo', usesLogoArtwork(product));
    const existingMessage = mainImageContainer.querySelector('.main-image-message');
    if (existingMessage) existingMessage.remove();

    if (mainImage) {
      mainImageElement.onerror = function () {
        this.style.display = 'none';
        showNoImageMessage();
      };
      mainImageElement.onload = function () {
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
      mainImageElement.style.display = 'none';
      showNoImageMessage();
    }
  }

  function showNoImageMessage() {
    if (!mainImageContainer) return;
    const existingMessage = mainImageContainer.querySelector('.main-image-message');
    if (existingMessage) existingMessage.remove();

    const thumbnails = document.querySelector('.thumbnails');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-image-message main-image-message';
    messageDiv.textContent = 'No product image available';

    if (thumbnails) mainImageContainer.insertBefore(messageDiv, thumbnails);
    else mainImageContainer.appendChild(messageDiv);
  }

  // Breadcrumb
  const breadcrumb = document.getElementById('product-breadcrumb');
  if (breadcrumb) {
    const main = getMainCategories(product)[0] || 'Store';
    const mainSlug = main.toLowerCase().replace(/\s+/g, '-');
    breadcrumb.innerHTML = `
      <a href="/">Home</a><span class="sep">/</span>
      <a href="/browse?category=${encodeURIComponent(mainSlug)}">${escapeHTML(main)}</a><span class="sep">/</span>
      <span class="current">${escapeHTML(product.name)}</span>`;
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
    const statusText = isOutOfStock ? 'Out of stock' : 'In stock';
    const statusClass = isOutOfStock ? 'out-of-stock-status' : 'in-stock-status';
    const price = formatPrice(product.price);
    const main = getMainCategories(product)[0] || 'Store';
    const mainSlug = main.toLowerCase().replace(/\s+/g, '-');

    const priceHTML = `
      <div class="product-price-block">
        <span class="product-price">${price} TND</span>
        ${Number(product.originalPrice) > Number(product.price) ? `<span class="product-old-price">${formatPrice(product.originalPrice)} TND</span>` : ''}
        ${discount > 0 ? `<span class="product-save">Save ${discount}%</span>` : ''}
      </div>`;

    const buttonHTML = isOutOfStock
      ? `<button class="buy-button" disabled><i class="fas fa-ban"></i> Out of stock</button>`
      : `<button class="buy-button" onclick="handleBuyClick(${inlineArg(product.id)})"><i class="fas fa-shopping-bag"></i> Add to cart — ${price} TND</button>`;

    productInfo.innerHTML = `
      <div class="product-info-category">
        <a href="/browse?category=${encodeURIComponent(mainSlug)}">${escapeHTML(main)}</a>
        <a href="/browse?category=${encodeURIComponent(product.category)}">${escapeHTML(getCategoryLabel(product))}</a>
      </div>
      <h1>${escapeHTML(product.name)}</h1>
      <div class="product-meta-row">
        ${ratingHTML(product, true)}
        <span class="availability ${statusClass}">${statusText}</span>
      </div>
      ${priceHTML}
      <p class="product-description">${escapeHTML(product.description).replace(/\n/g, '<br>')}</p>
      <div class="product-purchase">${buttonHTML}</div>
      <ul class="product-assurance">
        <li><i class="fas fa-bolt"></i> Instant digital delivery after verification</li>
        <li><i class="fas fa-shield-alt"></i> Working product or money back</li>
        <li><i class="fab fa-whatsapp"></i> Support on WhatsApp</li>
        <li><i class="fas fa-receipt"></i> Clear price in Tunisian dinars</li>
      </ul>`;
  }

  // Gallery thumbnails
  const thumbnails = document.querySelector('.thumbnails');
  if (thumbnails) {
    thumbnails.innerHTML = '';
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((imgSrc, index) => {
        const thumbImg = document.createElement('img');
        thumbImg.alt = `${product.name} — image ${index + 1}`;
        thumbImg.loading = 'lazy';
        thumbImg.className = 'thumbnail';
        thumbImg.onload = function () { this.classList.add('loaded'); };
        thumbImg.onerror = function () { this.style.display = 'none'; };
        thumbImg.src = imgSrc;
        if (thumbImg.complete && thumbImg.naturalWidth > 0) thumbImg.classList.add('loaded');
        thumbnails.appendChild(thumbImg);
      });
      if (thumbnails.firstElementChild) thumbnails.firstElementChild.classList.add('active');
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
    if (pageTitle) pageTitle.textContent = 'All products';
    if (pageSubtitle) pageSubtitle.textContent = 'Every game, subscription, course and app in one place.';
  } else if (metadata) {
    if (pageTitle) pageTitle.textContent = metadata.title;
    if (pageSubtitle) pageSubtitle.textContent = metadata.subtitle;
  } else {
    if (pageTitle) pageTitle.textContent = 'Browse products';
    if (pageSubtitle) pageSubtitle.textContent = 'Discover digital products from DIMA Deals.';
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
