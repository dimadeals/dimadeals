import { showToast, escapeHTML } from './utils.js';
import { getAllProducts } from './api.js';

// ============ CART MANAGEMENT SYSTEM ============

// Initialize cart in localStorage
export function initializeCart() {
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

// Get cart items
export function getCart() {
  initializeCart();
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Add product to cart
export function addToCart(product, quantity = 1) {
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
  showToast(`${product.name} added to cart!`);
}

// Remove item from cart
export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  displayCart();
}

// Update item quantity
export function updateQuantity(productId, quantity) {
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
export function clearCart() {
  localStorage.setItem('cart', JSON.stringify([]));
  updateCartCount();
}

// Get cart total
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in header
export function updateCartCount() {
  const cart = getCart();
  const countElements = document.querySelectorAll('#cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countElements.forEach(el => {
    el.textContent = totalItems;
  });
}

// Display cart on cart page
export function displayCart() {
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
        <img src="${escapeHTML(item.image) || 'images/placeholder.png'}" alt="${escapeHTML(item.name)}" onerror="this.src='images/placeholder.png'">
      </div>
      <div class="item-details">
        <h3>${escapeHTML(item.name)}</h3>
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
  
  const total = getCartTotal();
  document.getElementById('checkout-total').textContent = total.toFixed(2) + ' TND';
}

// Setup checkout form
export function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const loader = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
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

      // Validate cart items against currently loaded products
      const allProducts = getAllProducts();
      if (allProducts.length > 0) {
        const allProductIds = new Set(allProducts.map(p => String(p.id)));
        const invalidItems = formData.items.filter(item => !allProductIds.has(String(item.id)));
        if (invalidItems.length > 0) {
          throw new Error('Some items in your cart are no longer available. Please clear your cart and re-add items.');
        }
      }

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
      
      
      // Save order ID for confirmation page (sessionStorage survives refresh, cleans on tab close)
      sessionStorage.setItem('lastOrderId', result.orderId);
      sessionStorage.setItem('lastOrderEmail', formData.email);

      // Save order data for confirmation page display
      sessionStorage.setItem('lastOrderData', JSON.stringify({
        email: formData.email,
        fullname: formData.fullname,
        phone: formData.phone,
        country: formData.country,
        items: formData.items,
        total: formData.total
      }));

      // Clear cart
      clearCart();
      
      // Redirect to confirmation
      window.location.href = `/confirmation?orderId=${result.orderId}`;
      
    } catch (error) {
      console.error('❌ Checkout error:', error);
      showToast(`Error: ${error.message}`, 'error');
      submitBtn.innerHTML = loader;
      submitBtn.disabled = false;
    }
  });
}

// Display confirmation page
export function displayConfirmation() {
  const orderId = new URLSearchParams(window.location.search).get('orderId');
  const lastOrderId = sessionStorage.getItem('lastOrderId');
  const finalOrderId = orderId || lastOrderId;
  
  if (!finalOrderId) {
    window.location.href = '/';
    return;
  }
  
  const confirmationInfo = document.getElementById('confirmation-info');
  const confirmationItemsList = document.getElementById('confirmation-items-list');
  
  if (!confirmationInfo || !confirmationItemsList) return;
  
  // Display from localStorage (cart items before clearing)
  const storedOrderData = sessionStorage.getItem('lastOrderData');
  const cart = getCart();
  
  // If cart is empty, we can save order data before clearing
  if (storedOrderData) {
    const orderData = JSON.parse(storedOrderData);
    
    // Display order info
    confirmationInfo.innerHTML = `
      <div class="info-row">
        <span class="label">Order ID:</span>
        <span class="value"><strong>${escapeHTML(finalOrderId)}</strong></span>
      </div>
      <div class="info-row">
        <span class="label">Email:</span>
        <span class="value">${escapeHTML(orderData.email)}</span>
      </div>
      <div class="info-row">
        <span class="label">Name:</span>
        <span class="value">${escapeHTML(orderData.fullname)}</span>
      </div>
      <div class="info-row">
        <span class="label">Phone:</span>
        <span class="value">+216 ${escapeHTML(orderData.phone)}</span>
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
        <span>${escapeHTML(item.name)} x${item.quantity}</span>
        <span>${(item.price * item.quantity).toFixed(2)} TND</span>
      `;
      confirmationItemsList.appendChild(itemElement);
    });
  }
  
  // No immediate cleanup — sessionStorage auto-cleans when tab closes
  // Data survives page refreshes so the user can still see their order
}
