import { showToast, escapeHTML } from './utils.js';
import { getProductById } from './api.js';

// ============ CART MANAGEMENT SYSTEM ============

const MAX_QUANTITY = 99;

function normalizeCartItem(item) {
  if (!item || item.id === undefined || item.id === null) return null;

  const id = Number(item.id);
  const price = Number(item.price);
  if (!Number.isFinite(id) || !Number.isFinite(price) || price < 0) return null;

  const quantity = Math.min(
    MAX_QUANTITY,
    Math.max(1, Math.trunc(Number(item.quantity) || 1))
  );

  return {
    id,
    name: String(item.name || 'Product'),
    price,
    image: typeof item.image === 'string' ? item.image : '',
    quantity,
  };
}

// Initialize cart in localStorage
export function initializeCart() {
  if (!localStorage.getItem('cart')) {
    try { localStorage.setItem('cart', JSON.stringify([])); } catch { /* storage unavailable */ }
  }
}

// Get cart items
export function getCart() {
  initializeCart();
  try {
    const parsed = JSON.parse(localStorage.getItem('cart'));
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeCartItem).filter(Boolean);
  } catch (error) {
    console.error('Cart data was corrupted and has been reset:', error);
    try { localStorage.setItem('cart', JSON.stringify([])); } catch { /* ignore */ }
    return [];
  }
}

// Save cart to localStorage
export function saveCart(cart) {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Could not save cart:', error);
    showToast('Could not save your cart. Storage may be full.', 'error');
  }
  updateCartCount();
}

// Add product to cart
export function addToCart(product, quantity = 1) {
  if (!product || product.id === undefined) {
    showToast('Product not found. Please refresh and try again.', 'error');
    return;
  }

  const cart = getCart();
  const existingItem = cart.find(item => String(item.id) === String(product.id));
  const amount = Math.max(1, Math.trunc(Number(quantity) || 1));

  if (existingItem) {
    existingItem.quantity = Math.min(MAX_QUANTITY, existingItem.quantity + amount);
  } else {
    cart.push({
      id: Number(product.id),
      name: String(product.name || 'Product'),
      price: Number(product.price) || 0,
      image: product.images?.[0] || product.image || '',
      quantity: Math.min(MAX_QUANTITY, amount),
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}

// Remove item from cart
export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => String(item.id) !== String(productId));
  saveCart(cart);
  displayCart();
}

// Update item quantity
export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => String(item.id) === String(productId));
  if (!item) return;

  const next = Math.trunc(Number(quantity));
  if (!Number.isFinite(next) || next <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = Math.min(MAX_QUANTITY, next);
  saveCart(cart);
  displayCart();
}

// Clear cart
export function clearCart() {
  try { localStorage.setItem('cart', JSON.stringify([])); } catch { /* ignore */ }
  updateCartCount();
}

// Get cart total
export function getCartTotal() {
  const total = getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return Math.round(total * 100) / 100;
}

// Update cart count in header
export function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count, .cart-count').forEach(el => {
    el.textContent = totalItems;
  });
}

// Display cart on cart page
export function displayCart() {
  const cartItems = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartMsg = document.getElementById('empty-cart');
  const cartSummary = document.getElementById('cart-summary');

  if (!cartItemsContainer) return;

  if (cartItems.length === 0) {
    cartItemsContainer.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'none';
    if (emptyCartMsg) emptyCartMsg.style.display = 'flex';
    return;
  }

  cartItemsContainer.innerHTML = '';
  cartItemsContainer.style.display = '';
  if (cartSummary) cartSummary.style.display = 'block';
  if (emptyCartMsg) emptyCartMsg.style.display = 'none';

  cartItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    const image = item.image || 'images/placeholder.png';
    itemElement.innerHTML = `
      <div class="item-image">
        <img src="${escapeHTML(image)}" alt="${escapeHTML(item.name)}" onerror="this.src='images/placeholder.png'">
      </div>
      <div class="item-details">
        <h3>${escapeHTML(item.name)}</h3>
        <p class="item-price">${item.price.toFixed(2)} TND</p>
      </div>
      <div class="item-quantity">
        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" aria-label="Decrease quantity">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" aria-label="Increase quantity">+</button>
      </div>
      <div class="item-total">
        ${(item.price * item.quantity).toFixed(2)} TND
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove ${escapeHTML(item.name)}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  const subtotal = getCartTotal();
  const tax = 0;
  const total = subtotal + tax;

  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');
  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + ' TND';
  if (taxEl) taxEl.textContent = tax.toFixed(2) + ' TND';
  if (totalEl) totalEl.textContent = total.toFixed(2) + ' TND';
}

// Go to checkout
export function goToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  window.location.href = '/checkout';
}

// Display checkout summary
export function displayCheckoutSummary() {
  const cartItems = getCart();
  const orderItemsContainer = document.getElementById('order-items');

  if (!orderItemsContainer) return;

  if (cartItems.length === 0) {
    window.location.href = '/cart';
    return;
  }

  orderItemsContainer.innerHTML = '';

  cartItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    itemElement.innerHTML = `
      <div class="order-item-info">
        <span class="order-item-name">${escapeHTML(item.name)}</span>
        <span class="order-item-qty">x${item.quantity}</span>
      </div>
      <div class="order-item-price">
        ${(item.price * item.quantity).toFixed(2)} TND
      </div>
    `;
    orderItemsContainer.appendChild(itemElement);
  });

  const checkoutTotal = document.getElementById('checkout-total');
  if (checkoutTotal) checkoutTotal.textContent = getCartTotal().toFixed(2) + ' TND';
}

// Setup checkout form
export function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;
    const originalButton = submitBtn.innerHTML;

    try {
      const email = String(document.getElementById('email')?.value || '').trim().toLowerCase();
      const phone = String(document.getElementById('phone')?.value || '').trim();
      const fullname = String(document.getElementById('fullname')?.value || '').trim();
      const country = String(document.getElementById('country')?.value || '').trim();
      const terms = Boolean(document.getElementById('terms')?.checked);
      const items = getCart();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) throw new Error('Please enter a valid email address');
      if (!/^[0-9]{8}$/.test(phone.replace(/\D/g, ''))) throw new Error('Phone must be 8 digits');
      if (fullname.length < 3) throw new Error('Full name must be at least 3 characters');
      if (!country) throw new Error('Please select your country');
      if (!terms) throw new Error('Please accept the Terms of Service and Privacy Policy');
      if (items.length === 0) throw new Error('Your cart is empty');

      // Validate against the currently loaded catalog (server validates again).
      const unavailable = items.filter(item => !getProductById(item.id));
      if (unavailable.length > 0) {
        throw new Error('Some items in your cart are no longer available. Please clear your cart and re-add them.');
      }

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
      submitBtn.disabled = true;

      const formData = { email, phone, fullname, country, items, total: getCartTotal() };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let result;
      try { result = JSON.parse(text); } catch {
        throw new Error('The server returned an unexpected response. Please try again.');
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Checkout failed');
      }

      // Persist a display snapshot for the confirmation page; the page also
      // fetches the authoritative order from the API.
      sessionStorage.setItem('lastOrderId', result.orderId);
      sessionStorage.setItem('lastOrderEmail', email);
      sessionStorage.setItem('lastOrderData', JSON.stringify({
        orderId: result.orderId,
        email,
        fullname,
        phone: phone.replace(/\D/g, ''),
        country,
        items,
        total: result.total ?? formData.total,
        createdAt: new Date().toISOString(),
      }));

      clearCart();
      window.location.href = `/confirmation?orderId=${encodeURIComponent(result.orderId)}`;
    } catch (error) {
      console.error('❌ Checkout error:', error);
      showToast(`Error: ${error.message}`, 'error');
      submitBtn.innerHTML = originalButton;
      submitBtn.disabled = false;
    }
  });
}

// Display confirmation page
export async function displayConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const lastOrderId = sessionStorage.getItem('lastOrderId');
  const finalOrderId = orderId || lastOrderId;

  const confirmationInfo = document.getElementById('confirmation-info');
  const confirmationItemsList = document.getElementById('confirmation-items-list');
  if (!confirmationInfo || !confirmationItemsList) return;

  if (!finalOrderId) {
    window.location.href = '/';
    return;
  }

  // Try the API first (works after a refresh, in a new tab, or on another device
  // when the order link is shared). Fall back to the local session snapshot.
  let orderData = null;
  try {
    const response = await fetch(`/api/checkout?orderId=${encodeURIComponent(finalOrderId)}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data && data.orderId) orderData = data;
    }
  } catch (error) {
    console.error('Could not load order from API:', error);
  }

  if (!orderData) {
    try {
      const stored = sessionStorage.getItem('lastOrderData');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && String(parsed.orderId) === String(finalOrderId)) orderData = parsed;
      }
    } catch (error) {
      console.error('Could not read stored order:', error);
    }
  }

  if (!orderData) {
    confirmationInfo.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Order not found</h3>
        <p>We could not find this order. If you just placed it, please contact support.</p>
        <a href="/" class="cta-button">Back to Home</a>
      </div>`;
    confirmationItemsList.innerHTML = '';
    return;
  }

  const dateValue = orderData.createdAt ? new Date(orderData.createdAt) : new Date();
  const dateText = Number.isNaN(dateValue.getTime()) ? new Date().toLocaleString() : dateValue.toLocaleString();
  const phone = String(orderData.phone || '').replace(/\D/g, '');
  const items = Array.isArray(orderData.items) ? orderData.items : [];

  confirmationInfo.innerHTML = `
    <div class="info-row">
      <span class="label">Order ID:</span>
      <span class="value"><strong>${escapeHTML(orderData.orderId || finalOrderId)}</strong></span>
    </div>
    <div class="info-row">
      <span class="label">Email:</span>
      <span class="value">${escapeHTML(orderData.email || '')}</span>
    </div>
    <div class="info-row">
      <span class="label">Name:</span>
      <span class="value">${escapeHTML(orderData.fullname || '')}</span>
    </div>
    <div class="info-row">
      <span class="label">Phone:</span>
      <span class="value">${phone ? `+216 ${escapeHTML(phone)}` : '—'}</span>
    </div>
    <div class="info-row">
      <span class="label">Date:</span>
      <span class="value">${escapeHTML(dateText)}</span>
    </div>
    <div class="info-row">
      <span class="label">Total:</span>
      <span class="value"><strong>${Number(orderData.total || 0).toFixed(2)} TND</strong></span>
    </div>
  `;

  confirmationItemsList.innerHTML = '';
  if (items.length === 0) {
    confirmationItemsList.innerHTML = '<p class="muted">No items in this order.</p>';
    return;
  }

  items.forEach(item => {
    const name = String(item.name || 'Product');
    const quantity = Math.max(1, Math.trunc(Number(item.quantity) || 1));
    const price = Number(item.price) || 0;
    const itemElement = document.createElement('div');
    itemElement.className = 'confirmation-item-row';
    itemElement.innerHTML = `
      <span>${escapeHTML(name)} x${quantity}</span>
      <span>${(price * quantity).toFixed(2)} TND</span>
    `;
    confirmationItemsList.appendChild(itemElement);
  });
}
