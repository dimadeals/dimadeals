import { escapeHTML, showToast } from './utils.js';
import { PRODUCTS_DATABASE, getAllProducts } from './api.js';
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
  // Save language preference
  localStorage.setItem('language', lang);
  
  // Set HTML lang attribute and direction
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Apply translations to all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      element.textContent = TRANSLATIONS[lang][key];
    }
  });
  
}

export function initializeLanguage() {
  const savedLanguage = localStorage.getItem('language') || 'en';
  const languageSelect = document.getElementById('language-select');
  
  // Set the initial selection
  if (languageSelect) {
    languageSelect.value = savedLanguage;
  }
  
  // Apply the saved language
  applyLanguage(savedLanguage);
}

// ============ ENHANCED PRODUCT RENDERING ============

export function createProductCard(product) {
  // Handle image with fallback
  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const imageHTML = imageSrc
    ? `<img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(product.name)}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
    : '';

  const noImageHTML = `<div class="no-image-card-message"${imageSrc ? ' style="display:none"' : ''}>🚫 No Image Available</div>`;

  // Create rating stars
  const rating = product.rating || 0;
  const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 ? '✦' : '');
  const ratingHTML = rating ? `<div class="product-rating"><span class="stars">${stars}</span> <span class="rating-value">${rating.toFixed(1)}</span></div>` : '';

  // Create badges
  let badgesHTML = '';
  if (product.popular) {
    badgesHTML += '<span class="badge badge-popular">Popular</span>';
  }
  if (product.recommended) {
    badgesHTML += '<span class="badge badge-recommended">Recommended</span>';
  }
  
  const badgesContainer = badgesHTML ? `<div class="product-badges">${badgesHTML}</div>` : '';

  // Main categories display
  const mainCats = getMainCategories(product);
  const mainCatHTML = mainCats.length > 0
    ? `<div class="product-main-categories">${mainCats.map(mc => `<span class="main-cat-badge">${escapeHTML(mc)}</span>`).join('')}</div>`
    : '';

  // Check if product is out of stock
  const isOutOfStock = product.inStock === false;
  const outOfStockOverlay = isOutOfStock ? `<div class="out-of-stock-overlay"><div class="out-of-stock-label">OUT OF STOCK</div></div>` : '';
  const outOfStockClass = isOutOfStock ? 'out-of-stock' : '';

  // Create price HTML with discount if applicable
  let priceHTML = `<p class="price">${product.price} TND</p>`;
  if (product.originalPrice && product.originalPrice > product.price) {
    priceHTML = `
      <div class="price-container">
        <p class="price">${product.price} TND</p>
        <p class="original-price"><strike>${product.originalPrice} TND</strike></p>
      </div>
    `;
  }

  // Create action button - Buy Now with price (not clickable when out of stock)
  let buttonHTML = '';
  if (isOutOfStock) {
    buttonHTML = `<button class="buy-now-button" disabled><i class="fas fa-ban"></i> Out of Stock</button>`;
  } else {
    buttonHTML = `<button class="buy-now-button" onclick="handleBuyClick(${product.id}); event.stopPropagation();">Buy Now for ${product.price} TND</button>`;
  }

  return `
    <div class="product-card ${outOfStockClass}" onclick="viewProductDetails(${product.id})">
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
  const allProducts = getAllProducts();
  const product = allProducts.find(p => p.id === productId);
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
  allBrowseProducts = products;
  browseShownCount  = 0;
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  // Remove any existing see-more container
  const old = grid.parentNode.querySelector('.see-more-container');
  if (old) old.remove();
  grid.innerHTML = '';
  const batch = products.slice(0, INITIAL_LOAD);
  grid.innerHTML = batch.map(p => createProductCard(p)).join('');
  browseShownCount = batch.length;
  _updateSeeMoreBtn(products.length, browseShownCount, 'products-grid', 'loadMoreBrowse');
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
  if (!productId || (typeof productId !== 'number' && isNaN(parseInt(productId)))) {
    console.error('Invalid product ID:', productId);
    showToast('Error: Invalid product selected', 'error');
    return;
  }

  try {
    // Store the product ID in localStorage to be retrieved on the product page
    localStorage.setItem('selectedProductId', parseInt(productId));
    window.location.href = '/product';
  } catch (error) {
    console.error('Error navigating to product details:', error);
    showToast('Error: Could not load product details', 'error');
  }
}

export function loadProductDetails() {
  try {
    const productId = localStorage.getItem('selectedProductId');
    if (!productId) {
      console.error('No product ID found in localStorage');
      showProductNotFound();
      return;
    }

    const parsedId = parseInt(productId);
    if (isNaN(parsedId)) {
      console.error('Invalid product ID format:', productId);
      showProductNotFound();
      return;
    }

    // Find product in database
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.id === parsedId);

    if (product) {
      displayProductDetails(product);
    } else {
      console.error('Product not found with ID:', parsedId);
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
      // Show the image with error handling
      mainImageElement.src = mainImage;
      mainImageElement.style.display = 'block';
      mainImageElement.alt = product.name;

      // Add error handler for broken images
      mainImageElement.onerror = function() {
        this.style.display = 'none';
        showNoImageMessage();
      };

      mainImageElement.onload = function() {
        this.style.display = 'block';
        this.classList.add('loaded');
      };
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
    let priceDisplayHTML = `<p class="price"><i class="fas fa-tag"></i> ${product.price} TND</p>`;
    
    if (product.originalPrice && product.originalPrice > product.price) {
      priceDisplayHTML = `
        <div class="price-detail">
          <p class="price"><i class="fas fa-tag"></i> ${product.price} TND <strike>${product.originalPrice} TND</strike></p>
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
        <button class="buy-button" onclick="handleBuyClick(${product.id})">
          <i class="fas fa-shopping-cart"></i> Buy Now for ${product.price} TND
        </button>
      `;
    }

    productInfo.innerHTML = `
      <h1>${escapeHTML(product.name)}</h1>
      <p class="stock-status ${statusClass}"><i class="fas fa-circle"></i> ${escapeHTML(statusText)}</p>
      ${priceDisplayHTML}
      <p class="product-description">${escapeHTML(product.description)}</p>
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
        thumbImg.src = imgSrc;
        thumbImg.alt = `Image ${index + 1}`;
        thumbImg.loading = 'lazy';
        thumbImg.className = 'thumbnail';
        thumbImg.onload = function() { this.classList.add('loaded'); };
        thumbnails.appendChild(thumbImg);
      });
    }
  }
}

// ============ UNIFIED BROWSE PAGE HANDLER ============

export function loadBrowsePage() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return false; // Not on browse page

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'subscriptions';
  // If ?type= is absent (new URL format: ?category=netflix), use category as the product key
  const type = urlParams.get('type') || category;

  const products = PRODUCTS_DATABASE[type] || [];
  
  // Initialize paginated display
  initBrowsePagination(products);

  // Title and subtitle configuration
  const categoryTitles = {
    subscriptions: 'Premium Subscriptions',
    games: 'Games & Digital Content',
    courses: 'Online Learning',
    apps: 'Applications & Software'
  };

  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');

  if (CATALOG_METADATA[type]) {
    if (pageTitle) pageTitle.textContent = CATALOG_METADATA[type].title;
    if (pageSubtitle) pageSubtitle.textContent = CATALOG_METADATA[type].subtitle;
  } else {
    if (pageTitle) pageTitle.textContent = categoryTitles[category] || 'Browse Products';
    if (pageSubtitle) pageSubtitle.textContent = 'Discover amazing digital products';
  }

  // Show platforms section only for PC games
  const platformsSection = document.getElementById('platforms-section');
  if (platformsSection) {
    platformsSection.style.display = (category === 'games') ? 'block' : 'none';
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
