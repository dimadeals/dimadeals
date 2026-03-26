import { PRODUCTS_DATABASE, getAllProducts } from './api.js';

// ============ CATALOG METADATA ============

export const CATALOG_METADATA = {
  // Subscriptions
  netflix:      { title: 'Netflix Subscriptions',   subtitle: 'Choose the perfect Netflix plan for your entertainment needs' },
  spotify:      { title: 'Spotify Subscriptions',   subtitle: 'Stream unlimited music and podcasts with Spotify Premium' },
  canva:        { title: 'Canva Subscriptions',     subtitle: 'Enjoy templates, AI tools, and design benefits with Canva Pro' },
  shahid:       { title: 'Shahid Subscriptions',    subtitle: 'Watch exclusive Arab shows and movies on Shahid Plus' },
  capcut:       { title: 'CapCut Subscriptions',    subtitle: 'Professional video editing with CapCut Pro' },
  // Games
  pc:           { title: 'PC Games',                subtitle: 'Choose from the best PC games and digital content' },
  console:      { title: 'Console Games',           subtitle: 'Browse console games for PlayStation and Xbox' },
  mobile:       { title: 'Mobile Games',            subtitle: 'Download premium mobile games' },
  steam:        { title: 'Steam Gift Cards',        subtitle: 'Enjoy premium games on Steam' },
  epic_games:   { title: 'Epic Games Store',        subtitle: 'Digital gift cards for Epic Games Store and free games' },
  ea_games:     { title: 'EA Play',                 subtitle: 'Access EA\'s extensive library of games with EA Play subscription' },
  xbox_pc:      { title: 'Xbox Game Pass PC',       subtitle: 'Access hundreds of games on PC with Xbox Game Pass' },
  // Courses
  programming:  { title: 'Programming Courses',     subtitle: 'Learn programming and development skills' },
  design:       { title: 'Design Courses',          subtitle: 'Master design tools and creativity' },
  business:     { title: 'Business Courses',        subtitle: 'Develop your business and leadership skills' },
  // Apps
  software:     { title: 'Software',                subtitle: 'Premium software solutions for your computer' }
};

// ============ PRODUCT HELPERS ============

// Deterministic daily shuffle — stable within a page session, changes each day
function _seededShuffle(arr) {
  const seed = Math.floor(Date.now() / 86400000); // changes once per day
  const out  = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.abs(((seed * (i + 1) * 2654435761) >>> 0) % (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Get all popular products
export function getAllPopularProducts() {
  if (!PRODUCTS_DATABASE || Object.keys(PRODUCTS_DATABASE).length === 0) {
    return [];
  }
  const allProducts = getAllProducts();
  return _seededShuffle(allProducts.filter(p => p && p.popular && p.inStock !== false)).slice(0, 8);
}

// Get all recommended products
export function getAllRecommendedProducts() {
  if (!PRODUCTS_DATABASE || Object.keys(PRODUCTS_DATABASE).length === 0) {
    return [];
  }
  const allProducts = getAllProducts();
  return _seededShuffle(allProducts.filter(p => p && p.recommended && p.inStock !== false)).slice(0, 8);
}

// Get related products (same category or similar price range)
export function getRelatedProducts(productId, limit = 4) {
  if (!PRODUCTS_DATABASE || Object.keys(PRODUCTS_DATABASE).length === 0) {
    return [];
  }
  const allProducts = getAllProducts();
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

export function getProductCategory(product) {
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
  if (product.id >= 100 && product.id < 110) return 'business';
  if (product.id >= 120 && product.id < 130) return 'mobile_apps';
  if (product.id >= 130 && product.id < 140) return 'software';
  if (product.id >= 150 && product.id < 160) return 'steam';
  if (product.id >= 160 && product.id < 170) return 'epic_games';
  if (product.id >= 170 && product.id < 180) return 'ea_games';
  if (product.id >= 180) return 'xbox_pc';
  return 'unknown';
}

export function getProductBroadCategory(product) {
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

export function sortProducts(products, sortType) {
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
