// ============ SEARCH FUNCTIONALITY ============

function searchProducts(query) {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const allProducts = Object.values(PRODUCTS_DATABASE).flat();

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
      <img src="${imageSrc || 'images/placeholder.png'}" alt="${product.name}" class="suggestion-image" onerror="this.src='images/placeholder.png'">
      <div class="suggestion-content">
        <div class="suggestion-name">${product.name}</div>
        <div class="suggestion-price">${product.price} TND</div>
        ${ratingHTML}
        <div class="suggestion-description">${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</div>
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

function selectSuggestion(productId) {
  // Store the selected product ID and navigate to product page
  localStorage.setItem('selectedProductId', productId);
  window.location.href = 'product.html';
}

function performSearch(query) {
  if (!query || query.trim() === '') return;

  // Store search query and navigate to search results page
  localStorage.setItem('searchQuery', query.trim());
  window.location.href = 'search.html';
}

function displaySearchResults(results, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try searching for something else</p>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(product => createProductCard(product)).join('');
}

function filterSearchResults(results, category) {
  if (category === 'all') return results;
  return results.filter(product => getProductBroadCategory(product) === category);
}

function initializeSearch() {
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
  searchInput.addEventListener('input', function() {
    const query = this.value.trim();

    if (query.length > 0) {
      showSearchSuggestions(query);
    } else {
      hideSearchSuggestions();
    }
  });

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

function loadSearchResults() {
  const searchQuery = localStorage.getItem('searchQuery');
  if (!searchQuery) {
    window.location.href = 'index.html';
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
      displaySearchResults(filteredResults, 'search-results-grid');
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      const category = this.dataset.filter;
      let filteredResults = filterSearchResults(allResults, category);
      
      // Apply current sort
      const sortValue = sortSelect ? sortSelect.value : 'relevance';
      filteredResults = sortProducts(filteredResults, sortValue);
      
      displaySearchResults(filteredResults, 'search-results-grid');

      // Update results count
      const resultsCount = document.getElementById('results-count');
      if (resultsCount) {
        resultsCount.textContent = `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''} found`;
      }
    });
  });
}

// ============ PRODUCT DATABASE ============
// This is where you can easily add, remove, or edit products
const PRODUCTS_DATABASE = {
  netflix: [
    { id: 1, name: 'Basic 720p', price: 22, images: ['images/NetflixBigLogo.png'], description: '1 user subscription of Netflix for 1 month', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 2, name: 'Standard 1080p', price: 29, originalPrice: 34, images: ['images/NetflixBigLogo.png'], description: '2 users subscription of Netflix for 1 month', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 3, name: 'premium 4K + HDR', price: 40, images: ['images/NetflixBigLogo.png'], description: '6 user subscription of Netflix for 1 month', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 4, name: 'part of premium (shared)', price: 15, images: ['images/NetflixBigLogo.png'], description: '1 user subscription of Netflix for 1 month (shared account)', rating: 4.9, popular: false, recommended: true, inStock: true }
  ],
  spotify: [
    { id: 10, name: 'Spotify Étudiants', price: 17, images: ['images/spotify-1.png'], description: '1 user subscription of Spotify for 1 month', rating: 4.7, popular: true, recommended: false, inStock: true },
    { id: 11, name: 'Spotify Personnel', price: 23, images: ['images/spotify-1.png'], description: '1 user subscription of Spotify for 1 month', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 12, name: 'Spotify Duo', price: 27, images: ['images/spotify-1.png'], description: 'Six months unlimited streaming', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 13, name: 'Spotify Famille', price: 32, images: ['images/spotify-1.png'], description: 'Full year premium subscription', rating: 4.9, popular: false, recommended: false, inStock: true },
    { id: 14, name: 'part of premium (shared)', price: 13, images: ['images/spotify-1.png'], description: 'Full year premium subscription', rating: 4.9, popular: false, recommended: false, inStock: true }
  ],
  canva: [
    { id: 20, name: 'Canva Pro', price: 200, images: ['images/canva-icon.png'], description: 'One year canva pro for 1 person', rating: 4.7, popular: true, recommended: false, inStock: true },
    { id: 21, name: 'Canva business', price: 300, images: ['images/canva-icon.png'], description: 'One year canva business for 1 person', rating: 4.8, popular: false, recommended: true, inStock: true }
  ],
  shahid: [
    { id: 30, name: 'Shahid VIP Mobile', price: 20, images: ['images/Shahid_Logo.png'], description: 'Epic Shahid Originals, exclusive series, movie premieres & Live TV.', rating: 4.6, popular: false, recommended: false, inStock: true },
    { id: 31, name: 'Shahid VIP', price: 23, images: ['images/Shahid_Logo.png'], description: 'Epic Shahid Originals, exclusive series, movie premieres, Live TV & more!', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 32, name: 'Shahid VIP | BigTime', price: 40, images: ['images/Shahid_Logo.png'], description: 'Riyadh & Jeddah Seasons: Live concerts, thrilling events, plus all VIP perks.', rating: 4.7, popular: false, recommended: false, inStock: true },
    { id: 33, name: 'Shahid VIP | Sport', price: 42, images: ['images/Shahid_Logo.png'], description: 'International qualifiers, global tournaments, and showdowns, plus all VIP perks.', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 34, name: 'Shahid Ultimate', price: 60, images: ['images/Shahid_Logo.png'], description: 'The best of all worlds: VIP access, Riyadh & Jeddah Seasons, sports & more!', rating: 4.8, popular: false, recommended: true, inStock: true }
  ],
  console: [
    { id: 60, name: 'PlayStation Store Card 50 TND', price: 50, images: ['images/playstation.png'], description: 'Digital gift card for PlayStation Store', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 61, name: 'PlayStation Store Card 100 TND', price: 100, images: ['images/playstation.png'], description: 'Digital gift card for PlayStation Store', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 62, name: 'Xbox Gift Card 50 TND', price: 50, images: ['images/xbox.png'], description: 'Digital gift card for Xbox games', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  mobile: [
    { id: 70, name: 'Google Play Gift Card 20 TND', price: 20, images: ['images/google-play.png'], description: 'Digital gift card for Google Play Store apps and games', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 71, name: 'Google Play Gift Card 50 TND', price: 50, images: ['images/google-play.png'], description: 'Digital gift card for Google Play Store apps and games', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 72, name: 'App Store Gift Card 20 TND', price: 20, images: ['images/app-store.png'], description: 'Digital gift card for Apple App Store', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  programming: [
    { id: 80, name: 'Udemy subscription', price: 80, images: ['images/Udemy.png'], description: 'Complete programming course bundle', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 81, name: 'Coursera Single learning program', price: 100, images: ['images/Coursera.png'], description: 'Learn a single topic or skill and earn a credential with coursera', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 82, name: 'Coursera Plus Annual', price: 600, images: ['images/Coursera.png'], description: 'Combine flexibility and savings with long-term learning goals using coursera pro annual', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 83, name: 'Codecademy Plus Subscription', price: 60, images: ['images/Codecademy.png'], description: 'Build in-demand technical skills for work or a personal project', rating: 4.7, popular: false, recommended: true, inStock: true },
    { id: 84, name: 'Codecademy Pro Subscription', price: 80, images: ['images/Codecademy.png'], description: 'Develop the experience to land a job and move up in your career', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  design: [
    { id: 90, name: 'Adobe Creative Cloud Student', price: 100, images: ['images/creativecloud.png'], description: 'Get 20+ creative apps, including Photoshop and Acrobat Pro, plus Adobe Firefly creative AI for images, video, and audio.', rating: 4.9, popular: true, recommended: false, inStock: true },
    { id: 91, name: 'Figma Professional Full Seat Subscription', price: 100, images: ['images/Figmapro.png'], description: 'Professional design and prototyping tools', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 92, name: 'Sketch Standard License', price: 65, images: ['images/sketch.png'], description: 'Vector graphics editor for UI/UX design', rating: 4.6, popular: false, recommended: true, inStock: true },
    { id: 40, name: 'Capcut 1 month', price: 40, images: ['images/logo-capcut.png'], description: 'CapCut Pro offers advanced AI tools that can automatically remove background noise and sharpen video details', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 41, name: 'Capcut 1 year', price: 160, images: ['images/logo-capcut.png'], description: 'CapCut Pro offers advanced AI tools that can automatically remove background noise and sharpen video details', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 42, name: 'Capcut teams (two people)', price: 50, images: ['images/logo-capcut.png'], description: 'Edit YouTube and Instagram videos with CapCut teams, team up to create creativeness', rating: 4.7, popular: false, recommended: true, inStock: true }

  ],
  business: [
    { id: 110, name: 'LinkedIn Learning Subscription', price: 100, images: ['images/LinkedInLearning.png'], description: 'Professional development and business courses', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 111, name: 'QuickBooks Online Simple Start', price: 30, images: ['images/quickbooks.png'], description: '1 user Plus access for your accountant', rating: 4.7, popular: false, recommended: false, inStock: true },
    { id: 112, name: 'QuickBooks Online Essentials', price: 35, images: ['images/quickbooks.png'], description: '3 users Plus access for your accountant', rating: 4.7, popular: true, recommended: false, inStock: true },
    { id: 113, name: 'QuickBooks Online Plus', price: 40, images: ['images/quickbooks.png'], description: '5 users Plus access for your accountant', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 114, name: 'QuickBooks Online Advanced', price: 50, images: ['images/quickbooks.png'], description: '25 users Plus access for your accountant', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  software: [
    { id: 130, name: 'Microsoft 365 Personal', price: 45, images: ['images/365.png'], description: 'Complete Microsoft Office suite subscription', rating: 4.9, popular: true, recommended: false, inStock: true },
    { id: 131, name: 'Norton AntiVirus Plus', price: 20, images: ['images/norton.png'], description: 'Comprehensive security software package', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 132, name: 'Adobe Premiere Pro', price: 45, images: ['images/adobe.png'], description: 'Professional video editing suite', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  steam: [
    { id: 150, name: 'Steam Gift Card $5', price: 25, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 151, name: 'Steam Gift Card $10', price: 40, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 152, name: 'Steam Gift Card $25', price: 100, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.7, popular: false, recommended: true, inStock: true },
    { id: 153, name: 'Steam Gift Card $50', price: 180, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 154, name: 'Steam Gift Card $100', price: 350, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  epic_games: [
    { id: 160, name: 'Epic Games Card $5', price: 25, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 161, name: 'Epic Games Card $10', price: 40, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 162, name: 'Epic Games Card $25', price: 100, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.7, popular: false, recommended: true, inStock: true },
    { id: 163, name: 'Epic Games Card $50', price: 180, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 164, name: 'Epic Games Card $100', price: 350, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  ea_games: [
    { id: 170, name: 'EA Play 1 Month', price: 50, images: ['images/ea-logo.png'], description: 'Get unlimited access to top EA titles for 1 month', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 171, name: 'EA Play Pro 1 Months', price: 100, images: ['images/ea-logo.png'], description: 'Get unlimited access to premium editions for 3 months', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 172, name: 'EA Play 1 Year', price: 150, images: ['images/ea-logo.png'], description: 'Get unlimited access to top EA titles for 1 year', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 173, name: 'EA Play Pro 1 Year', price: 350, images: ['images/ea-logo.png'], description: 'Get unlimited access to premium editions for 1 year', rating: 4.8, popular: false, recommended: true, inStock: true }
  ],
  xbox_pc: [
    { id: 180, name: 'Xbox Game Pass PC Essential', price: 40, images: ['images/xbox-game-pass.png'], description: 'Access to Xbox Game Pass PC, 50+ games on Xbox console, PC, and supported devices for 1 month', rating: 4.7, popular: true, recommended: false, inStock: true },
    { id: 181, name: 'Xbox Game Pass PC Premium', price: 60, images: ['images/xbox-game-pass.png'], description: 'Access to Xbox Game Pass PC, 200+ games on Xbox console, PC, and supported devices for 1 month', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 182, name: 'Xbox Game Pass PC Ultimate', price: 110, images: ['images/xbox-game-pass.png'], description: 'Access to Xbox Game Pass PC, 500+ games on Xbox console, PC, and supported devices for 1 month', rating: 4.9, popular: false, recommended: true, inStock: true }
  ],
  pc: [
    { id: 500, name: 'ARC Raiders Steam Account', price: 95, images: ['images/arc-raiders.png','images/Arc_Raiders2.png','images/Arc_Raiders3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 501, name: 'FC 26 Standard Edition Steam Account', price: 60, images: ['images/fc-26.png','images/fc-26s.png','images/fc-26-2.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 502, name: 'GTA V Standard Edition Steam Account', price: 50, images: ['images/gta5.png','images/gta5-2.png','images/gta5-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 503, name: 'RUST Steam Account', price: 40, images: ['images/rust.png','images/rust-2.png','images/rust-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 504, name: 'Elden Ring Steam Account', price: 90, images: ['images/elden-ring.png','images/elden-ring-2.png','images/elden-ring-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 505, name: 'HELLDIVERS 2 Steam Account', price: 95, images: ['images/helldivers-2-2.png','images/helldivers-2-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 506, name: 'Nioh 3 Steam Account', price: 170, images: ['images/nioh-3.png','images/nioh-3-2.png','images/nioh-3-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: false, inStock: true },
    { id: 507, name: 'REANIMAL Steam CD Key', price: 70, images: ['images/REANIMAL.png','images/REANIMAL-2.png','images/REANIMAL-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 508, name: "No Man's Sky Steam Account", price: 40, images: ['images/no-man-s-sky.png','images/no-man-s-sky-2.png','images/no-man-s-sky-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 509, name: 'Cyberpunk 2077 Steam Account', price: 50, images: ['images/Cyberpunk2077.png','images/Cyberpunk2077-2.png','images/Cyberpunk2077-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: false, inStock: true },
    { id: 510, name: 'ARC Raiders Steam CD Key', price: 120, images: ['images/arc-raiders.png','images/Arc_Raiders2.png','images/Arc_Raiders3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 511, name: 'Nioh 3 Steam CD Key', price: 190, images: ['images/nioh-3.png','images/nioh-3-2.png','images/nioh-3-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: false, inStock: true },
  
  ]
};

updateProductDescription(1, 'Stream your favorite movies and series in clear HD quality (720p) on one screen at a time. Perfect for personal viewing with smooth playback and full access to Netflix’s content library. Enjoy affordable entertainment anytime, anywhere on your preferred device.');
updateProductDescription(2, 'Enjoy your favorite movies and series in sharp Full HD quality (1080p) for a more immersive viewing experience. Watch on two screens at the same time, perfect for sharing with a partner or family member. Unlimited access to Netflix’s full library across TV, laptop, tablet, and mobile devices.');
updateProductDescription(3, 'Experience Netflix in stunning Ultra HD 4K with HDR for richer colors, deeper contrast, and exceptional clarity. Stream on up to four screens simultaneously, ideal for families or shared viewing. Enjoy the complete Netflix library with the highest video and audio quality available.');
updateProductDescription(4, 'Access Netflix Premium features at a lower cost by sharing a Premium subscription. Enjoy high-quality streaming with smooth playback and full access to the entire Netflix library. A smart and affordable way to experience premium entertainment on your own device.');
updateProductDescription(10, 'Profitez de Spotify Premium à prix réduit spécialement conçu pour les étudiants. Écoutez vos musiques et podcasts sans publicité, en mode hors-ligne et avec lecture illimitée. Une expérience audio complète pour accompagner vos études et vos moments de détente.');
updateProductDescription(11, 'Profitez de Spotify Premium pour un seul utilisateur. Écoutez vos musiques et podcasts sans publicité, en mode hors-ligne et avec lecture illimitée. Une expérience audio complète pour accompagner vos études et vos moments de détente.');
updateProductDescription(12, 'Profitez de Spotify Premium pour deux utilisateurs. Écoutez vos musiques et podcasts sans publicité, en mode hors-ligne et avec lecture illimitée. Une expérience audio complète pour accompagner vos études et vos moments de détente.');
updateProductDescription(13, 'Profitez de Spotify Premium pour 6 utilisateurs. Écoutez vos musiques et podcasts sans publicité, en mode hors-ligne et avec lecture illimitée. Une expérience audio complète pour accompagner vos études et vos moments de détente.');
updateProductDescription(14, 'Profitez de Spotify Premium à prix réduit un seul utilisateur en abonnement famille partagee. Écoutez vos musiques et podcasts sans publicité, en mode hors-ligne et avec lecture illimitée. Une expérience audio complète pour accompagner vos études et vos moments de détente.');





// Get all popular products
function getAllPopularProducts() {
  const allProducts = Object.values(PRODUCTS_DATABASE).flat();
  return allProducts
    .filter(p => p && p.popular && p.inStock !== false)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
}

// Get all recommended products
function getAllRecommendedProducts() {
  const allProducts = Object.values(PRODUCTS_DATABASE).flat();
  return allProducts
    .filter(p => p && p.recommended && p.inStock !== false)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
}

// Get related products (same category or similar price range)
function getRelatedProducts(productId, limit = 4) {
  const allProducts = Object.values(PRODUCTS_DATABASE).flat();
  const currentProduct = allProducts.find(p => p.id === productId);

  if (!currentProduct) return [];

  return allProducts
    .filter(p => p.id !== productId && p.inStock !== false)
    .map(p => ({
      ...p,
      relevance: calculateRelevance(currentProduct, p)
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

function calculateRelevance(product1, product2) {
  let score = 0;

  // Same category gets highest score
  if (getProductCategory(product1) === getProductCategory(product2)) {
    score += 10;
  }

  // Similar price range
  const priceDiff = Math.abs(product1.price - product2.price);
  const priceScore = Math.max(0, 5 - (priceDiff / 10));
  score += priceScore;

  // Same availability status
  if (product1.availability === product2.availability) {
    score += 2;
  }

  return score;
}

function getProductCategory(product) {
  // Determine category based on product ID ranges
  if (product.id >= 1 && product.id < 10) return 'netflix';
  if (product.id >= 10 && product.id < 20) return 'spotify';
  if (product.id >= 20 && product.id < 30) return 'canva';
  if (product.id >= 30 && product.id < 40) return 'shahid';
  if (product.id >= 40 && product.id < 50) return 'capcut';
  if (product.id >= 50 && product.id < 60) return 'pc';
  if (product.id >= 60 && product.id < 70) return 'console';
  if (product.id >= 70 && product.id < 80) return 'mobile';
  if (product.id >= 80 && product.id < 90) return 'programming';
  if (product.id >= 90 && product.id < 100) return 'design';
  if (product.id >= 110 && product.id < 120) return 'business';
  if (product.id >= 120 && product.id < 130) return 'mobile_apps';
  if (product.id >= 130 && product.id < 140) return 'software';
  if (product.id >= 150 && product.id < 160) return 'steam';
  if (product.id >= 160 && product.id < 170) return 'epic_games';
  if (product.id >= 170 && product.id < 180) return 'ea_games';
  if (product.id >= 180) return 'xbox_pc';
  return 'unknown';
}

function getProductBroadCategory(product) {
  // Map detailed categories to broad categories
  const category = getProductCategory(product);
  
  if (['netflix', 'spotify', 'canva', 'shahid', 'capcut'].includes(category)) {
    return 'subscriptions';
  }
  if (['steam', 'epic_games', 'ea_games', 'xbox_pc', 'pc', 'console', 'mobile'].includes(category)) {
    return 'games';
  }
  if (['programming', 'design', 'business'].includes(category)) {
    return 'courses';
  }
  return 'unknown';
}

function sortProducts(products, sortType) {
  const sorted = [...products];
  
  switch(sortType) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'popular':
      return sorted.sort((a, b) => {
        if (a.popular === b.popular) return 0;
        return a.popular ? -1 : 1;
      });
    case 'relevance':
    default:
      return products;
  }
}

// ============ UTILITY FUNCTIONS ============

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(src);
    img.src = src;
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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

function applyLanguage(lang) {
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
  
  console.log(`Language changed to: ${lang}`);
}

function initializeLanguage() {
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

function createProductCard(product) {
  // Handle image with fallback
  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const imageHTML = imageSrc
    ? `<img src="${imageSrc}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
    : '';

  const noImageHTML = !imageSrc ? `<div class="no-image-card-message">🚫 No Image Available</div>` : '';

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

  return `
    <div class="product-card ${outOfStockClass}" onclick="viewProductDetails(${product.id})">
      ${badgesContainer}
      <div class="product-image-container">
        ${imageHTML}
        ${noImageHTML}
        ${outOfStockOverlay}
      </div>
      <h3>${product.name}</h3>
      ${priceHTML}
      ${ratingHTML}
      <p>${product.description}</p>
      <button class="details-button">View Details</button>
    </div>
  `;
}

function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with ID '${containerId}' not found`);
    return;
  }

  if (!Array.isArray(products)) {
    console.error('Products must be an array');
    container.innerHTML = '<p>Error loading products</p>';
    return;
  }

  if (products.length === 0) {
    container.innerHTML = '<p>No products available</p>';
    return;
  }

  try {
    container.innerHTML = products.map(product => createProductCard(product)).join('');
  } catch (error) {
    console.error('Error rendering products:', error);
    container.innerHTML = '<p>Error loading products</p>';
  }
}

// ============ NAVIGATION & MENU ============

document.addEventListener('DOMContentLoaded', function() {
  // Initialize language
  initializeLanguage();
  
  // Initialize product grids
  renderProducts('most-popular-grid', getAllPopularProducts());
  renderProducts('recommended-grid', getAllRecommendedProducts());

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
});

// ============ PRODUCT DETAILS & NAVIGATION ============

function viewProductDetails(productId) {
  if (!productId || (typeof productId !== 'number' && isNaN(parseInt(productId)))) {
    console.error('Invalid product ID:', productId);
    alert('Error: Invalid product selected');
    return;
  }

  try {
    // Store the product ID in localStorage to be retrieved on the product page
    localStorage.setItem('selectedProductId', parseInt(productId));
    window.location.href = 'product.html';
  } catch (error) {
    console.error('Error navigating to product details:', error);
    alert('Error: Could not load product details');
  }
}

function loadProductDetails() {
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
    const allProducts = Object.values(PRODUCTS_DATABASE).flat();
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
      <button onclick="window.location.href='index.html'" class="details-button">Back to Home</button>
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
        <button class="buy-button" onclick="handleBuyClick('${product.name}', ${product.price})">
          <i class="fas fa-shopping-cart"></i> Buy Now for ${product.price} TND
        </button>
      `;
    }


    



    // Use custom bottom description if available, otherwise use default
    const bottomText = product.extendedDescription || `Experience premium entertainment with ${product.name}. Enjoy unlimited access to thousands of shows, movies, and content.
        Instant delivery via email with activation instructions. Compatible with all devices.`;

    productInfo.innerHTML = `
      <h2>${product.name}</h2>
      ${priceDisplayHTML}
      <p class="availability ${statusClass}"><strong>Status:</strong> ${statusText}</p>
      <p class="description">
        ${product.description}
        <br><br>
        ${bottomText}
      </p>
      ${buttonHTML}
    `;
  }

  // Generate thumbnail images with better error handling
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
        thumbImg.dataset.full = imgSrc;
        if (index === 0) thumbImg.classList.add('active');

        // Add error handling for thumbnails
        thumbImg.onerror = function() {
          this.style.display = 'none';
        };

        thumbImg.onclick = function() {
          if (mainImageElement) {
            mainImageElement.src = this.dataset.full || this.src;
            mainImageElement.style.display = 'block';
          }
          // Update active state
          document.querySelectorAll('.thumbnails img').forEach(t => t.classList.remove('active'));
          this.classList.add('active');
        };

        thumbnails.appendChild(thumbImg);
      });
      thumbnails.style.display = 'flex';
    } else if (product.image) {
      // Single image - show only one thumbnail
      const thumbImg = document.createElement('img');
      thumbImg.src = product.image;
      thumbImg.alt = 'Image 1';
      thumbImg.dataset.full = product.image;
      thumbImg.classList.add('active');

      thumbImg.onerror = function() {
        this.style.display = 'none';
      };

      thumbImg.onclick = function() {
        if (mainImageElement) {
          mainImageElement.src = this.dataset.full || this.src;
          mainImageElement.style.display = 'block';
        }
      };

      thumbnails.appendChild(thumbImg);
      thumbnails.style.display = 'flex';
    } else {
      // No images available - hide thumbnails completely
      thumbnails.style.display = 'none';
    }
  }
}

// ============ PRODUCT DESCRIPTION UPDATE ============

function updateProductDescription(productId, newBottomDescription) {
  if (!productId || !newBottomDescription) {
    console.error('Invalid product ID or description');
    return false;
  }

  const allProducts = Object.values(PRODUCTS_DATABASE).flat();
  const product = allProducts.find(p => p.id === productId);

  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return false;
  }

  product.extendedDescription = newBottomDescription.trim();
  console.log(`Bottom description updated for product ${productId}: ${product.name}`);
  return true;
}

function handleBuyClick(productName, price) {
  if (!productName || !price) {
    alert('Error: Product information is missing.');
    return;
  }

  // Get the product ID from localStorage
  const productId = localStorage.getItem('selectedProductId');
  if (productId) {
    const allProducts = Object.values(PRODUCTS_DATABASE).flat();
    const product = allProducts.find(p => p.id === parseInt(productId));
    
    if (product && product.inStock === false) {
      alert('⚠️ This product is currently out of stock and cannot be purchased.');
      return;
    }

    // Add to cart instead of directly purchasing
    addToCart(product);
  }
}

// Load product details when on product page
if (document.querySelector('.product-detail-container')) {
  document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    // Load related products after a short delay to ensure main product is loaded
    setTimeout(() => {
      const productId = localStorage.getItem('selectedProductId');
      if (productId) {
        const relatedProducts = getRelatedProducts(parseInt(productId));
        renderProducts('related-products-grid', relatedProducts);
      }
    }, 100);
  });
}

// ============ UNIVERSAL PAGE LOADING ============

// Catalog metadata: titles, subtitles, and icons for each type
const CATALOG_METADATA = {
  netflix: {
    title: 'Netflix Subscriptions',
    subtitle: 'Choose the perfect Netflix plan for your entertainment needs'
  },
  spotify: {
    title: 'Spotify Subscriptions',
    subtitle: 'Stream unlimited music and podcasts with Spotify Premium'
  },
  canva: {
    title: 'Canva Subscriptions',
    subtitle: 'Enjoy templates, AI tools, and design benefits with Canva Pro'
  },
  shahid: {
    title: 'Shahid Subscriptions',
    subtitle: 'Watch exclusive Arab shows and movies on Shahid Plus'
  },
  capcut: {
    title: 'CapCut Subscriptions',
    subtitle: 'Professional video editing with CapCut Pro'
  },
  steam: {
    title: 'Steam Gift Cards',
    subtitle: 'Enjoy premium games on Steam'
  },
  epic_games: {
    title: 'Epic Games Store',
    subtitle: 'Digital gift cards for Epic Games Store and free games'
  },
  ea_games: {
    title: 'EA Play',
    subtitle: 'Access EA\'s extensive library of games with EA Play subscription'
  },
  xbox_pc: {
    title: 'Xbox Game Pass PC',
    subtitle: 'Access hundreds of games on PC with Xbox Game Pass'
  }
};

// ============ UNIFIED BROWSE PAGE HANDLER ============

function loadBrowsePage() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return false; // Not on browse page

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'subscriptions';
  const type = urlParams.get('type') || 'netflix';

  const products = PRODUCTS_DATABASE[type] || [];
  productsGrid.innerHTML = products
    .map(product => createProductCard(product))
    .join('');

  // Title and subtitle configuration
  const categoryTitles = {
    subscriptions: 'Premium Subscriptions',
    games: 'Games & Digital Content',
    courses: 'Online Learning',
    apps: 'Applications & Software'
  };

  const typeConfig = {
    // Subscriptions
    netflix: { title: 'Netflix Subscriptions', subtitle: 'Choose the perfect Netflix plan for your entertainment needs' },
    spotify: { title: 'Spotify Subscriptions', subtitle: 'Stream unlimited music and podcasts with Spotify Premium' },
    canva: { title: 'Canva Subscriptions', subtitle: 'Enjoy templates, AI tools, and design benefits with Canva Pro' },
    shahid: { title: 'Shahid Subscriptions', subtitle: 'Watch exclusive Arab shows and movies on Shahid Plus' },
    // Games
    pc: { title: 'PC Games', subtitle: 'Choose from the best PC games and digital content' },
    console: { title: 'Console Games', subtitle: 'Browse console games for PlayStation and Xbox' },
    mobile: { title: 'Mobile Games', subtitle: 'Download premium mobile games' },
    steam: { title: 'Steam Gift Cards', subtitle: 'Enjoy premium games on Steam' },
    epic_games: { title: 'Epic Games Store', subtitle: 'Digital gift cards for Epic Games Store and free games' },
    ea_games: { title: 'EA Play', subtitle: 'Access EA\'s extensive library of games with EA Play subscription' },
    xbox_pc: { title: 'Xbox Game Pass PC', subtitle: 'Access hundreds of games on PC with Xbox Game Pass' },
    // Courses
    programming: { title: 'Programming Courses', subtitle: 'Learn programming and development skills' },
    design: { title: 'Design Courses', subtitle: 'Master design tools and creativity' },
    business: { title: 'Business Courses', subtitle: 'Develop your business and leadership skills' },
    // Apps
    software: { title: 'Software', subtitle: 'Premium software solutions for your computer' }
  };

  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');

  if (typeConfig[type]) {
    if (pageTitle) pageTitle.textContent = typeConfig[type].title;
    if (pageSubtitle) pageSubtitle.textContent = typeConfig[type].subtitle;
  } else {
    if (pageTitle) pageTitle.textContent = categoryTitles[category] || 'Browse Products';
    if (pageSubtitle) pageSubtitle.textContent = 'Discover amazing digital products';
  }

  // Show platforms section only for PC games
  const platformsSection = document.getElementById('platforms-section');
  if (platformsSection) {
    platformsSection.style.display = (category === 'games') ? 'block' : 'none';
  }

  console.log(`Loaded ${products.length} products for category: ${category}, type: ${type}`);
  return true;
}

// Generic loader: handles any grid with data-category attribute (subscriptions, games, courses, etc.)
document.addEventListener('DOMContentLoaded', () => {
  // 0. Load unified browse page (browse.html?category=games&type=pc)
  if (loadBrowsePage()) return;

  // 1. Load catalog page (catalog.html?type=netflix, etc.)
  const catalogGrid = document.getElementById('catalog-grid');
  if (catalogGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    
    if (type) {
      const products = PRODUCTS_DATABASE[type] || [];
      const metadata = CATALOG_METADATA[type];
      
      if (metadata) {
        const titleElement = document.getElementById('catalog-title');
        const subtitleElement = document.getElementById('catalog-subtitle');
        if (titleElement) {
          titleElement.innerHTML = `<i class="${metadata.icon}"></i> ${metadata.title}`;
        }
        if (subtitleElement) {
          subtitleElement.textContent = metadata.subtitle;
        }
      }
      
      catalogGrid.innerHTML = products
        .map(product => createProductCard(product))
        .join('');
      console.log(`Loaded ${products.length} products for type: ${type}`);
    }
    return;
  }

  // 2. Load any product grid with data-category attribute (legacy support)
  const gridWithCategory = document.querySelector('.product-grid[data-category]');
  if (gridWithCategory) {
    const category = gridWithCategory.dataset.category;
    const products = PRODUCTS_DATABASE[category] || [];
    gridWithCategory.innerHTML = products
      .map(product => createProductCard(product))
      .join('');
    console.log(`Loaded ${products.length} products for category: ${category}`);
    return;
  }

  // 3. Load pages with specific IDs (games-grid, courses-grid, apps-grid)
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type');
  
  if (type) {
    const products = PRODUCTS_DATABASE[type] || [];
    
    // Try different grid IDs
    let gridElement = document.getElementById('games-grid') || 
                     document.getElementById('courses-grid') || 
                     document.getElementById('apps-grid');
    
    if (gridElement) {
      gridElement.innerHTML = products
        .map(product => createProductCard(product))
        .join('');
      console.log(`Loaded ${products.length} products for type: ${type}`);
    }

    // Update dynamic titles
    const titleMaps = {
      'games-title': {
        pc: 'PC Games',
        console: 'Console Games',
        mobile: 'Mobile Games'
      },
      'courses-title': {
        programming: 'Programming Courses',
        design: 'Design Courses',
        business: 'Business Courses'
      },
      'apps-title': {
        mobile: 'Mobile Apps',
        software: 'Software',
      }
    };

    // Update dynamic subtitles
    const subtitleMaps = {
      'games-subtitle': {
        pc: 'Choose from the best PC games and digital content',
        console: 'Browse console games for PlayStation and Xbox',
        mobile: 'Download premium mobile games'
      },
      'courses-subtitle': {
        programming: 'Learn programming and development skills',
        design: 'Master design tools and creativity',
        business: 'Develop your business and leadership skills'
      },
      'apps-subtitle': {
        mobile: 'Discover essential mobile applications',
        software: 'Premium software solutions for your computer',
      }
    };

    for (const [titleId, titleMap] of Object.entries(titleMaps)) {
      const titleElement = document.getElementById(titleId);
      if (titleElement && titleMap[type]) {
        titleElement.textContent = titleMap[type];
      }
    }

    for (const [subtitleId, subtitleMap] of Object.entries(subtitleMaps)) {
      const subtitleElement = document.getElementById(subtitleId);
      if (subtitleElement && subtitleMap[type]) {
        subtitleElement.textContent = subtitleMap[type];
      }
    }

    // Show PC platforms section only for PC games
    const platformsSection = document.getElementById('pc-platforms');
    if (platformsSection) {
      platformsSection.style.display = type === 'pc' ? 'block' : 'none';
    }
  }
});

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

// database 

async function sendOrder(productId){
  try {
    const order = {
      productId: productId,
      date: new Date(),
      timestamp: Date.now()
    }

    // For local development, use a mock response
    let data;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Mock response for local testing
      console.log("Running in local mode - using mock order response");
      data = {
        success: true,
        message: "Order received successfully (local mock)",
        orderId: `ORDER-${Date.now()}`,
        data: order
      };
      console.log("Order response:", data);
    } else {
      // Production: use real API
      console.log("📤 Sending order to API:", order);
      console.log("🌐 Making fetch request to:", "/api/order");
      
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      console.log("📬 API Response Status:", response.status);
      console.log("📬 API Response Headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      data = await response.json();
      console.log("✅ Order response received:", data);
    }
    
    alert(`✅ Purchase initiated!\n\nThank you for choosing DIMA Deals!\n\n📧 A confirmation email will be sent to you shortly with delivery instructions.\n\n💡 Your subscription will be activated within 24 hours.`);
  } catch (error) {
    console.error("Error sending order:", error);
    alert(`❌ Error: Could not process order. ${error.message}\n `);
  }
}

// ============ CART MANAGEMENT SYSTEM ============

// Initialize cart in localStorage
function initializeCart() {
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

// Get cart items
function getCart() {
  initializeCart();
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Add product to cart
function addToCart(product, quantity = 1) {
  const cart = getCart();
  
  // Check if product already in cart
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: quantity
    });
  }
  
  saveCart(cart);
  alert(`✅ ${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  displayCart();
}

// Update item quantity
function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
      displayCart();
    }
  }
}

// Clear cart
function clearCart() {
  localStorage.setItem('cart', JSON.stringify([]));
  updateCartCount();
}

// Get cart total
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in header
function updateCartCount() {
  const cart = getCart();
  const countElements = document.querySelectorAll('#cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countElements.forEach(el => {
    el.textContent = totalItems;
  });
}

// Display cart on cart page
function displayCart() {
  const cartItems = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const emptCartMsg = document.getElementById('empty-cart');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartItemsContainer) return;
  
  if (cartItems.length === 0) {
    cartItemsContainer.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'none';
    if (emptCartMsg) emptCartMsg.style.display = 'flex';
    return;
  }
  
  // Clear container
  cartItemsContainer.innerHTML = '';
  if (cartSummary) cartSummary.style.display = 'block';
  if (emptCartMsg) emptCartMsg.style.display = 'none';
  
  // Display each item
  cartItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <div class="item-image">
        <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}" onerror="this.src='images/placeholder.png'">
      </div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-price">${item.price} TND</p>
      </div>
      <div class="item-quantity">
        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <div class="item-total">
        ${(item.price * item.quantity).toFixed(2)} TND
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    `;
    cartItemsContainer.appendChild(itemElement);
  });
  
  // Update summary
  const subtotal = getCartTotal();
  const tax = 0;
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' TND';
  document.getElementById('tax').textContent = tax.toFixed(2) + ' TND';
  document.getElementById('total').textContent = total.toFixed(2) + ' TND';
}

// Go to checkout
function goToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  window.location.href = 'checkout.html';
}

// Display checkout summary
function displayCheckoutSummary() {
  const cartItems = getCart();
  const orderItemsContainer = document.getElementById('order-items');
  
  if (!orderItemsContainer) return;
  
  if (cartItems.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  orderItemsContainer.innerHTML = '';
  
  cartItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    itemElement.innerHTML = `
      <div class="order-item-info">
        <span class="order-item-name">${item.name}</span>
        <span class="order-item-qty">x${item.quantity}</span>
      </div>
      <div class="order-item-price">
        ${(item.price * item.quantity).toFixed(2)} TND
      </div>
    `;
    orderItemsContainer.appendChild(itemElement);
  });
  
  const total = getCartTotal();
  document.getElementById('checkout-total').textContent = total.toFixed(2) + ' TND';
}

// Setup checkout form
function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const loader = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
      const formData = {
        email: document.getElementById('email').value.toLowerCase(),
        phone: document.getElementById('phone').value,
        fullname: document.getElementById('fullname').value,
        country: document.getElementById('country').value,
        items: getCart(),
        total: getCartTotal()
      };
      
      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      const phoneRegex = /^[0-9]{8}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        throw new Error('Phone must be 8 digits');
      }
      
      if (formData.fullname.trim().length < 3) {
        throw new Error('Full name must be at least 3 characters');
      }
      
      console.log('📤 Submitting checkout form...', formData);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Checkout failed');
      }
      
      console.log('✅ Checkout successful:', result);
      
      // Save order ID to localStorage for confirmation page
      localStorage.setItem('lastOrderId', result.orderId);
      localStorage.setItem('lastOrderEmail', formData.email);
      
      // Clear cart
      clearCart();
      
      // Redirect to confirmation
      window.location.href = `confirmation.html?orderId=${result.orderId}`;
      
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert(`Error: ${error.message}`);
      submitBtn.innerHTML = loader;
      submitBtn.disabled = false;
    }
  });
}

// Display confirmation page
function displayConfirmation() {
  const orderId = new URLSearchParams(window.location.search).get('orderId');
  const lastOrderId = localStorage.getItem('lastOrderId');
  const finalOrderId = orderId || lastOrderId;
  
  if (!finalOrderId) {
    window.location.href = 'index.html';
    return;
  }
  
  const confirmationInfo = document.getElementById('confirmation-info');
  const confirmationItemsList = document.getElementById('confirmation-items-list');
  
  if (!confirmationInfo || !confirmationItemsList) return;
  
  // Display from localStorage (cart items before clearing)
  const storedOrderData = localStorage.getItem('lastOrderData');
  const cart = getCart();
  
  // If cart is empty, we can save order data before clearing
  if (storedOrderData) {
    const orderData = JSON.parse(storedOrderData);
    
    // Display order info
    confirmationInfo.innerHTML = `
      <div class="info-row">
        <span class="label">Order ID:</span>
        <span class="value"><strong>${finalOrderId}</strong></span>
      </div>
      <div class="info-row">
        <span class="label">Email:</span>
        <span class="value">${orderData.email}</span>
      </div>
      <div class="info-row">
        <span class="label">Name:</span>
        <span class="value">${orderData.fullname}</span>
      </div>
      <div class="info-row">
        <span class="label">Phone:</span>
        <span class="value">+216 ${orderData.phone}</span>
      </div>
      <div class="info-row">
        <span class="label">Date:</span>
        <span class="value">${new Date().toLocaleDateString()}</span>
      </div>
    `;
    
    // Display items
    confirmationItemsList.innerHTML = '';
    orderData.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'confirmation-item-row';
      itemElement.innerHTML = `
        <span>${item.name} x${item.quantity}</span>
        <span>${(item.price * item.quantity).toFixed(2)} TND</span>
      `;
      confirmationItemsList.appendChild(itemElement);
    });
  }
  
  // Clean up
  localStorage.removeItem('lastOrderId');
  localStorage.removeItem('lastOrderEmail');
  localStorage.removeItem('lastOrderData');
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeCart();
  updateCartCount();
});
