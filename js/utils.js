// ============ PRODUCT IMAGE PLACEHOLDERS ============

export const PRODUCT_IMAGE_SKELETON = '<span class="product-image-skeleton" aria-hidden="true"></span>';

export const PRODUCT_IMAGE_FALLBACK = `
  <span class="product-image-fallback" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
      <circle cx="8.5" cy="10" r="1.4"></circle>
      <path d="m21 15-5-5L5 21"></path>
    </svg>
  </span>`;

export const PRODUCT_IMAGE_LOAD_ATTR = `onload="this.classList.add('loaded');this.closest('.product-image-shell')?.classList.add('is-loaded')"`;

export const PRODUCT_IMAGE_ERROR_ATTR = `onerror="this.classList.remove('loaded');this.classList.add('is-failed');this.closest('.product-image-shell')?.classList.add('is-failed');this.closest('.product-image-shell')?.classList.remove('is-loaded')"`;

// ============ LOADING SKELETONS ============

export function showSkeletons(containerId, count = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const card = `<div class="skeleton-card">
    <div class="skeleton skeleton-img"></div>
    <div class="skeleton-card-body">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-btn"></div>
    </div>
  </div>`;
  container.innerHTML = card.repeat(count);
}

// ============ TOAST NOTIFICATIONS ============

export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = window.DimaI18n ? window.DimaI18n.t(message) : message;
  container.appendChild(toast);
  // trigger enter animation
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// ============ HTML ESCAPING ============

export function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============ UTILITY FUNCTIONS ============

export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(src);
    img.src = src;
  });
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    clearTimeout(timeout);
    // Preserve the caller's `this` (event handlers in strict ES modules
    // otherwise receive undefined) and only run after the quiet period.
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
