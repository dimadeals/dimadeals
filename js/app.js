/* =========================================================
   CONFIG
========================================================= */

const CART_KEY = "emm_cart"

/* =========================================================
   PRODUCT DATABASE
========================================================= */

const PRODUCTS = [
  { id: 1, name: "Blue Gem Bracelet", price: 6, image: "images/gem_blue.JPG" },
  { id: 2, name: "Purple Gem Bracelet", price: 6, image: "images/gem_purple.JPG" },
  { id: 3, name: "Dumbbell Necklace", price: 10, image: "images/dumbneck(small).jpg" },
  { id: 4, name: "Superman Ring", price: 7, image: "images/superman.jpg" },
  { id: 5, name: "Grey Gem Bracelet", price: 6, image: "images/gem_grey.JPG" },
  { id: 6, name: "Pink Gem Bracelet", price: 6, image: "images/gem_pink.JPG" }
]

/* =========================================================
   CART CORE
========================================================= */

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  updateCartCount()
}

function updateCartCount() {
  const cart = getCart()
  const count = cart.reduce((sum, item) => sum + item.qty, 0)
  const el = document.getElementById("cart-count")
  if (el) el.textContent = count
}

/* =========================================================
   CART ACTIONS
========================================================= */

function addToCart(productId) {
  const cart = getCart()
  const product = PRODUCTS.find(p => p.id === productId)
  if (!product) return

  const existing = cart.find(item => item.id === productId)

  if (existing) existing.qty++
  else cart.push({ ...product, qty: 1 })

  saveCart(cart)
  notify("Added to cart")
}

function removeItem(index) {
  const cart = getCart()
  cart.splice(index, 1)
  saveCart(cart)
  renderCart()
}

function changeQty(index, value) {
  const cart = getCart()
  cart[index].qty = Math.max(1, Number(value))
  saveCart(cart)
  renderCart()
}

function clearCart() {
  localStorage.removeItem(CART_KEY)
  updateCartCount()
  renderCart()
}

/* =========================================================
   PRODUCT RENDERING
========================================================= */

function renderProducts(list = PRODUCTS) {
  const container = document.getElementById("products")
  if (!container) return

  container.innerHTML = list.map(p => `
    <article class="card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} dt</p>
      <button onclick="addToCart(${p.id})">Add to cart</button>
    </article>
  `).join("")
}

/* =========================================================
   CART PAGE
========================================================= */

function renderCart() {
  const container = document.getElementById("cart-items")
  const totalEl = document.getElementById("total")
  if (!container || !totalEl) return

  const cart = getCart()
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>"
    totalEl.textContent = "0 dt"
    return
  }

  let total = 0

  container.innerHTML = cart.map((item, index) => {
    const subtotal = item.price * item.qty
    total += subtotal

    return `
      <div class="cart-row">
        <img src="${item.image}">
        <span>${item.name}</span>
        <input type="number" min="1" value="${item.qty}"
          onchange="changeQty(${index}, this.value)">
        <span>${subtotal} dt</span>
        <button onclick="removeItem(${index})">✕</button>
      </div>
    `
  }).join("")

  totalEl.textContent = `${total} dt`
}

/* =========================================================
   SEARCH
========================================================= */

function initSearch() {
  const input = document.getElementById("search-input")
  if (!input) return

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase()
    renderProducts(PRODUCTS.filter(p => p.name.toLowerCase().includes(value)))
  })
}

/* =========================================================
   UI FEEDBACK
========================================================= */

function notify(text) {
  const toast = document.createElement("div")
  toast.textContent = text
  toast.style.position = "fixed"
  toast.style.bottom = "20px"
  toast.style.right = "20px"
  toast.style.background = "#1db954"
  toast.style.color = "#000"
  toast.style.padding = "10px 16px"
  toast.style.borderRadius = "6px"
  toast.style.fontWeight = "700"
  toast.style.zIndex = "9999"
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 1500)
}

/* =========================================================
   BACKEND AUTH HELPERS
========================================================= */

async function getSessionUser() {
  const res = await fetch("/api/me", { credentials: "include" })
  if (!res.ok) return null
  return res.json()
}

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
  location.href = "index.html"
}

/* =========================================================
   PROFILE
========================================================= */

async function initProfile() {
  const profilePage = document.querySelector(".profile-overview")
  if (!profilePage) return

  const user = await getSessionUser()
  if (!user) {
    location.href = "auth.html"
    return
  }

  document.getElementById("profile-name").textContent = user.name
  document.getElementById("profile-email").textContent = user.email
  document.getElementById("account-status").textContent = "Active Member"

  const btn = document.getElementById("profile-action-btn")
  btn.textContent = "Log out"
  btn.onclick = handleLogout
}

/* =========================================================
   NAV AUTH
========================================================= */

async function initNavAuth() {
  const profile = document.getElementById("nav-profile")
  const login = document.getElementById("nav-login")
  if (!profile || !login) return

  const user = await getSessionUser()
  profile.hidden = !user
  login.hidden = !!user
}

/* =========================================================
   AUTH FORMS
========================================================= */

function showForm(formId, titleText) {
  const forms = [
    "login-form",
    "register-form",
    "forgot-form",
    "reset-form"
  ];

  forms.forEach(id => {
    const form = document.getElementById(id);
    if (form) form.hidden = true;
  });

  const active = document.getElementById(formId);
  if (active) active.hidden = false;

  if (titleText) {
    const title = document.getElementById("auth-title");
    if (title) title.textContent = titleText;
  }
}



/* LOGIN */
document.getElementById("login-form")?.addEventListener("submit", async e => {
  e.preventDefault()
  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value


  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  })




  const data = await res.json()
  if (!res.ok) return notify(data.error || "Error")
  location.href = "profile.html"
})

/* REGISTER */
document.getElementById("register-form")?.addEventListener("submit", async e => {
  e.preventDefault()

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",


    body: JSON.stringify({
  name: document.getElementById("register-name").value,
  email: document.getElementById("register-email").value,
  password: document.getElementById("register-password").value 
    
    })
  })

  const data = await res.json()
  if (!res.ok) return notify(data.error || "Registration failed")

  notify("Check your email")
  showForm("login-form", "Sign In")
})

/* FORGOT */
document.getElementById("forgot-form")?.addEventListener("submit", async e => {
  e.preventDefault()

  const res = await fetch("/api/auth/forgot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email: document.getElementById("forgot-email").value
    })
  })

  if (!res.ok) return notify("Email not found")
  notify("Reset code sent")
  showForm("reset-form", "Reset Password")
})


/* RESET — FIXED */
document.getElementById("reset-form")?.addEventListener("submit", async e => {
  e.preventDefault()

  const res = await fetch("/api/auth/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      code: document.getElementById("reset-code").value,
      password: document.getElementById("reset-password").value
    })
  })

  if (!res.ok) return notify("Invalid or expired code")
  notify("Password updated")
  showForm("login-form", "Sign In")
})


/* =========================================================
   CHECKOUT
========================================================= */

async function handleCheckout() {
  const user = await getSessionUser()
  if (!user) {
    notify("Please log in to checkout")
    return location.href = "auth.html"
  }

  const cart = getCart()
  if (!cart.length) return notify("Cart is empty")

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ items: cart })
  })

  if (!res.ok) return notify("Order failed")
  clearCart()
  notify("Order placed")
  location.href = "profile.html"
}

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  if (document.getElementById("products")) renderProducts()
  if (document.getElementById("cart-items")) renderCart()
  initSearch()
  initProfile()
  initNavAuth()

  const checkoutBtn = document.getElementById("checkout-btn")
  if (checkoutBtn) checkoutBtn.onclick = handleCheckout
})

document.addEventListener('DOMContentLoaded', () => {
  showForm('login-form');
});


document.addEventListener("DOMContentLoaded", () => {
  showForm("login-form", "Sign In")

  document.getElementById("go-register")?.addEventListener("click", e => {
    e.preventDefault()
    showForm("register-form", "Create Account")
  })

  document.getElementById("go-forgot")?.addEventListener("click", e => {
    e.preventDefault()
    showForm("forgot-form", "Reset Password")
  })

  document.getElementById("go-login-from-register")?.addEventListener("click", e => {
    e.preventDefault()
    showForm("login-form", "Sign In")
  })

  document.getElementById("go-login-from-forgot")?.addEventListener("click", e => {
    e.preventDefault()
    showForm("login-form", "Sign In")
  })

  document.getElementById("go-login-from-reset")?.addEventListener("click", e => {
    e.preventDefault()
    showForm("login-form", "Sign In")
  })
})

