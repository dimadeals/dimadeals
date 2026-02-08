// ============ PRODUCT DATABASE ============
// This is where you can easily add, remove, or edit products
const PRODUCTS_DATABASE = {
  netflix: [
    { id: 1, name: 'Netflix 1 Month', price: 30, image: 'https://via.placeholder.com/250x140/e50914/ffffff?text=Netflix+1M', description: 'One month of Netflix streaming', availability: 'In Stock', rating: 4.8, popular: true, recommended: false },
    { id: 2, name: 'Netflix 3 Months', price: 85, image: 'https://via.placeholder.com/250x140/e50914/ffffff?text=Netflix+3M', description: 'Three months of unlimited streaming', availability: 'In Stock', rating: 4.9, popular: true, recommended: true },
    { id: 3, name: 'Netflix 6 Months', price: 160, image: 'https://via.placeholder.com/250x140/e50914/ffffff?text=Netflix+6M', description: 'Half year access to all content', availability: 'In Stock', rating: 4.9, popular: true, recommended: true },
    { id: 4, name: 'Netflix 12 Months', price: 300, image: 'https://via.placeholder.com/250x140/e50914/ffffff?text=Netflix+12M', description: 'Full year Netflix subscription', availability: 'In Stock', rating: 4.9, popular: false, recommended: true }
  ],
  spotify: [
    { id: 5, name: 'Spotify 1 Month', price: 12, image: 'https://via.placeholder.com/250x140/1db954/ffffff?text=Spotify+1M', description: 'One month premium access', availability: 'In Stock', rating: 4.7, popular: true, recommended: false },
    { id: 6, name: 'Spotify 3 Months', price: 32, image: 'https://via.placeholder.com/250x140/1db954/ffffff?text=Spotify+3M', description: 'Three months ad-free music', availability: 'In Stock', rating: 4.8, popular: false, recommended: true },
    { id: 7, name: 'Spotify 6 Months', price: 60, image: 'https://via.placeholder.com/250x140/1db954/ffffff?text=Spotify+6M', description: 'Six months unlimited streaming', availability: 'In Stock', rating: 4.8, popular: false, recommended: true },
    { id: 8, name: 'Spotify 12 Months', price: 110, image: 'https://via.placeholder.com/250x140/1db954/ffffff?text=Spotify+12M', description: 'Full year premium subscription', availability: 'In Stock', rating: 4.9, popular: false, recommended: false }
  ],
  prime: [
    { id: 9, name: 'Amazon Prime 1 Month', price: 45, image: 'https://via.placeholder.com/250x140/00a8e1/ffffff?text=Prime+1M', description: 'One month Prime Video access', availability: 'In Stock', rating: 4.7, popular: true, recommended: false },
    { id: 10, name: 'Amazon Prime 3 Months', price: 120, image: 'https://via.placeholder.com/250x140/00a8e1/ffffff?text=Prime+3M', description: 'Three months streaming & shipping', availability: 'In Stock', rating: 4.8, popular: false, recommended: true },
    { id: 11, name: 'Amazon Prime 6 Months', price: 220, image: 'https://via.placeholder.com/250x140/00a8e1/ffffff?text=Prime+6M', description: 'Half year full Prime membership', availability: 'In Stock', rating: 4.8, popular: false, recommended: false },
    { id: 12, name: 'Amazon Prime 12 Months', price: 399, image: 'https://via.placeholder.com/250x140/00a8e1/ffffff?text=Prime+12M', description: 'Full year unlimited benefits', availability: 'In Stock', rating: 4.9, popular: false, recommended: true }
  ],
  shahid: [
    { id: 13, name: 'Shahid 1 Month', price: 10, image: 'https://via.placeholder.com/250x140/000000/ffffff?text=Shahid+1M', description: 'One month Arab content streaming', availability: 'In Stock', rating: 4.6, popular: false, recommended: false },
    { id: 14, name: 'Shahid 3 Months', price: 25, image: 'https://via.placeholder.com/250x140/000000/ffffff?text=Shahid+3M', description: 'Three months premium access', availability: 'In Stock', rating: 4.7, popular: true, recommended: true },
    { id: 15, name: 'Shahid 6 Months', price: 45, image: 'https://via.placeholder.com/250x140/000000/ffffff?text=Shahid+6M', description: 'Half year streaming service', availability: 'In Stock', rating: 4.7, popular: false, recommended: false },
    { id: 16, name: 'Shahid 12 Months', price: 80, image: 'https://via.placeholder.com/250x140/000000/ffffff?text=Shahid+12M', description: 'Full year exclusive Arab shows', availability: 'In Stock', rating: 4.8, popular: false, recommended: true }
  ]
};

// Get all popular products
function getAllPopularProducts() {
  const allProducts = Object.values(PRODUCTS_DATABASE).flat();
  return allProducts.filter(p => p.popular).sort(() => Math.random() - 0.5).slice(0, 6);
}

// Get all recommended products
function getAllRecommendedProducts() {
  const allProducts = Object.values(PRODUCTS_DATABASE).flat();
  return allProducts.filter(p => p.recommended).sort(() => Math.random() - 0.5).slice(0, 6);
}

// ============ PRODUCT RENDERING ============

function createProductCard(product) {
  return `
    <div class="product-card" onclick="viewProductDetails(${product.id})">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price} TND</p>
      <p>${product.description}</p>
      <button class="details-button">View Details</button>
    </div>
  `;
}

function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = products.map(product => createProductCard(product)).join('');
  }
}

// ============ NAVIGATION & MENU ============

document.addEventListener('DOMContentLoaded', function() {
  // Initialize product grids
  renderProducts('most-popular-grid', getAllPopularProducts());
  renderProducts('recommended-grid', getAllRecommendedProducts());

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link, .dropdown a').forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
      });
    });
  }

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
      // Placeholder for language switching functionality
      console.log('Language changed to:', this.value);
    });
  }
});

// ============ PRODUCT DETAILS & NAVIGATION ============

function viewProductDetails(productId) {
  // Store the product ID in localStorage to be retrieved on the product page
  localStorage.setItem('selectedProductId', productId);
  window.location.href = 'product.html';
}

function loadProductDetails() {
  const productId = localStorage.getItem('selectedProductId');
  if (productId) {
    // Find product in database
    const allProducts = Object.values(PRODUCTS_DATABASE).flat();
    const product = allProducts.find(p => p.id === parseInt(productId));

    if (product) {
      displayProductDetails(product);
    }
  }
}

function displayProductDetails(product) {
  // Update main image
  const mainImage = document.getElementById('main-image');
  if (mainImage) {
    mainImage.src = product.image;
  }

  // Update product info
  const productInfo = document.querySelector('.product-info');
  if (productInfo) {
    productInfo.innerHTML = `
      <h2>${product.name}</h2>
      <p class="price"><i class="fas fa-tag"></i> ${product.price} TND</p>
      <p class="availability"><strong>Status:</strong> ${product.availability}</p>
      <p class="description">
        ${product.description}
        <br><br>
        Experience premium entertainment with ${product.name}. Enjoy unlimited access to thousands of shows, movies, and content.
        Instant delivery via email with activation instructions. Compatible with all devices.
      </p>
      <button class="buy-button" onclick="handleBuyClick('${product.name}', ${product.price})">
        <i class="fas fa-shopping-cart"></i> Buy Now for ${product.price} TND
      </button>
    `;
  }

  // Generate thumbnail images
  const thumbnails = document.querySelector('.thumbnails');
  if (thumbnails) {
    const thumbnailHTML = `
      <img src="${product.image}" data-full="${product.image}" alt="Image 1" class="active">
      <img src="https://via.placeholder.com/100x60/cccccc/000000?text=${product.name}+2" data-full="https://via.placeholder.com/400x250/cccccc/000000?text=${product.name}+2" alt="Image 2">
      <img src="https://via.placeholder.com/100x60/666666/ffffff?text=${product.name}+3" data-full="https://via.placeholder.com/400x250/666666/ffffff?text=${product.name}+3" alt="Image 3">
    `;
    thumbnails.innerHTML = thumbnailHTML;

    // Re-attach click handlers
    document.querySelectorAll('.thumbnails img').forEach(img => {
      img.addEventListener('click', function() {
        mainImage.src = this.dataset.full ? this.dataset.full : this.src;
        document.querySelectorAll('.thumbnails img').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
}

function handleBuyClick(productName, price) {
  alert(`Added to cart: ${productName} - ${price} TND\n\nPayment processing would happen here.`);
  // Here you would integrate with your payment gateway
}

// Load product details when on product page
if (document.querySelector('.product-detail-container')) {
  document.addEventListener('DOMContentLoaded', loadProductDetails);
}

// ============ SUBSCRIPTION PAGE LOADING ============

function loadSubscriptionProducts(type) {
  const products = PRODUCTS_DATABASE[type] || [];
  const gridId = document.querySelector('.product-grid');
  if (gridId) {
    gridId.innerHTML = products.map(product => createProductCard(product)).join('');
  }
}

// Determine subscription type from URL or page
if (document.location.pathname.includes('netflix')) {
  document.addEventListener('DOMContentLoaded', () => loadSubscriptionProducts('netflix'));
} else if (document.location.pathname.includes('spotify')) {
  document.addEventListener('DOMContentLoaded', () => loadSubscriptionProducts('spotify'));
} else if (document.location.pathname.includes('prime')) {
  document.addEventListener('DOMContentLoaded', () => loadSubscriptionProducts('prime'));
} else if (document.location.pathname.includes('shahid')) {
  document.addEventListener('DOMContentLoaded', () => loadSubscriptionProducts('shahid'));
}
