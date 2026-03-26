// ============ PRODUCT DATABASE — Dynamic (loaded from API) ============

import { showToast } from './utils.js';

export let PRODUCTS_DATABASE = {}; // Will be populated from API

export async function loadProductsFromAPI() {
  try {
    const res = await fetch("/api/products");

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Invalid JSON from API:", text);
      showToast('Failed to load products. Please refresh the page.', 'error');
      return false;
    }
    
    if (data && data.success && Array.isArray(data.products)) {
      // Rebuild category-keyed structure
      PRODUCTS_DATABASE = {};
      data.products.forEach(prod => {
        if (!PRODUCTS_DATABASE[prod.category]) {
          PRODUCTS_DATABASE[prod.category] = [];
        }
        PRODUCTS_DATABASE[prod.category].push(prod);
      });
      _allProductsCache = null;
      return true;
    } else {
      PRODUCTS_DATABASE = {};
      _allProductsCache = null;
    }
  } catch (e) {
  console.error("API failed:", e);
  showToast('Failed to load products. Please refresh the page.', 'error');
  PRODUCTS_DATABASE = {};
  _allProductsCache = null;
}
  // Use fallback if API responds but no products
  return false;
}

// Cached flattened product list — invalidated when PRODUCTS_DATABASE changes
let _allProductsCache = null;

export function getAllProducts() {
  if (!_allProductsCache) {
    _allProductsCache = Object.values(PRODUCTS_DATABASE).flat();
  }
  return _allProductsCache;
}
