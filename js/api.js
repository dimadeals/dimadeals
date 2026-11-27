// ============ PRODUCT DATABASE — Dynamic (loaded from API) ============

import { showToast } from './utils.js';

export let PRODUCTS_DATABASE = {}; // populated from /api/products

// Cached flattened product list — invalidated whenever the database changes
let _allProductsCache = null;

// Older Redis records may still point at image variants that are no longer
// shipped. Map those paths to the compressed assets that remain.
const LEGACY_IMAGE_MAP = {
  'images/arc-raiders.png': 'images/Arc_Raiders3.png',
  'images/Arc_Raiders2.png': 'images/Arc_Raiders3.png',
  'images/Cyberpunk2077-2.png': 'images/Cyberpunk2077.png',
  'images/Cyberpunk2077-3.png': 'images/Cyberpunk2077.png',
  'images/elden-ring-2.png': 'images/elden-ring-3.png',
  'images/fc-26.png': 'images/fc-26-2.png',
  'images/helldivers-2.png': 'images/helldivers-2-2.png',
  'images/nioh-3.png': 'images/nioh-3-2.png',
  'images/no-man-s-sky.png': 'images/no-man-s-sky-3.png',
};

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return [...new Set(
    images
      .filter((img) => typeof img === 'string' && img.trim())
      .map((img) => LEGACY_IMAGE_MAP[img] || img)
  )];
}

function normalizeProduct(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const idNumber = Number(raw.id);
  const id = Number.isFinite(idNumber) ? idNumber : raw.id;
  if (id === undefined || id === null || id === '') return null;

  const price = Number(raw.price);
  const rating = Number(raw.rating);

  return {
    ...raw,
    id,
    name: String(raw.name ?? ''),
    price: Number.isFinite(price) ? price : 0,
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0,
    description: String(raw.description ?? ''),
    category: String(raw.category ?? '').toLowerCase(),
    images: normalizeImages(raw.images),
    mainCategories: Array.isArray(raw.mainCategories) ? raw.mainCategories : [],
    popular: Boolean(raw.popular),
    recommended: Boolean(raw.recommended),
    inStock: raw.inStock !== false,
  };
}

function rebuildDatabase(products) {
  const next = {};
  for (const product of products) {
    const normalized = normalizeProduct(product);
    if (!normalized) continue;
    if (!next[normalized.category]) next[normalized.category] = [];
    next[normalized.category].push(normalized);
  }
  PRODUCTS_DATABASE = next;
  _allProductsCache = null;
}

export async function loadProductsFromAPI() {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Invalid JSON from /api/products:', text.slice(0, 300));
      showToast('Failed to load products. Please refresh the page.', 'error');
      return false;
    }

    if (!res.ok || !data || data.success !== true || !Array.isArray(data.products)) {
      console.error('Products API error:', data);
      showToast('Failed to load products. Please refresh the page.', 'error');
      PRODUCTS_DATABASE = {};
      _allProductsCache = null;
      return false;
    }

    rebuildDatabase(data.products);
    return true;
  } catch (error) {
    console.error('API failed:', error);
    showToast('Failed to load products. Please check your connection and refresh.', 'error');
    PRODUCTS_DATABASE = {};
    _allProductsCache = null;
    return false;
  }
}

export function getAllProducts() {
  if (!_allProductsCache) {
    _allProductsCache = Object.values(PRODUCTS_DATABASE).flat();
  }
  return _allProductsCache;
}

export function getProductById(id) {
  const target = String(id);
  return getAllProducts().find((product) => String(product.id) === target) || null;
}
