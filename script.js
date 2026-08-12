/**
 * ==========================================================================
 * WALKIFY — PREMIUM VINTAGE SHOE STORE
 * Main Application Logic (script.js)
 * Features: Auth (localStorage), Cart, Wishlist, Search, Filter, Sort,
 * Product Details, Size Guard, Checkout, COD Payment & Order Confirmation.
 * ==========================================================================
 */

// Global App State
const WALKIFY = {
  products: [
    {
      id: 1,
      name: "WALKIFY Pro Marathon Runner",
      category: "Sneakers",
      shortDesc: "High-performance marathon running shoe with responsive cushioning and breathable knit upper.",
      originalPrice: 2500,
      salePrice: 2200,
      badge: "BEST SELLER",
      badgeClass: "badge-new",
      image: "images/shoe1.jpg",
      sizes: [39, 40, 41, 42, 43, 44],
      rating: 4.9,
      isNew: false,
      isPopular: true
    },
    {
      id: 2,
      name: "WALKIFY Cross-Trainer Sport",
      category: "Casual",
      shortDesc: "Athletic cross-training shoe engineered for agility, endurance, and lateral support.",
      originalPrice: 2500,
      salePrice: 2200,
      badge: "NEW ARRIVAL",
      badgeClass: "badge-gold",
      image: "images/shoe2.jpg",
      sizes: [39, 40, 41, 42, 43, 44],
      rating: 5.0,
      isNew: true,
      isPopular: false
    },
    {
      id: 3,
      name: "WALKIFY Urban High-Top Court",
      category: "Sneakers",
      shortDesc: "High-top basketball sports sneaker featuring modern air cushioning and ankle lock.",
      originalPrice: 2500,
      salePrice: 2200,
      badge: "TRENDING",
      badgeClass: "badge-gold",
      image: "images/shoe3.jpg",
      sizes: [39, 40, 41, 42, 43, 44],
      rating: 4.8,
      isNew: true,
      isPopular: true
    },
    {
      id: 4,
      name: "WALKIFY All-Terrain Trail Runner",
      category: "Streetwear",
      shortDesc: "Rugged trail running sports shoe with deep tread rubber sole and weather resistance.",
      originalPrice: 2500,
      salePrice: 2200,
      badge: "POPULAR",
      badgeClass: "badge-new",
      image: "images/shoe4.jpg",
      sizes: [39, 40, 41, 42, 43, 44],
      rating: 4.7,
      isNew: false,
      isPopular: true
    },
    {
      id: 5,
      name: "WALKIFY Aeroflex Knit Trainer",
      category: "Casual",
      shortDesc: "Ultra-lightweight slip-on sports training shoe in breathable flexible mesh.",
      originalPrice: 2500,
      salePrice: 2200,
      badge: "NEW ARRIVAL",
      badgeClass: "badge-gold",
      image: "images/shoe5.jpg",
      sizes: [39, 40, 41, 42, 43, 44],
      rating: 4.9,
      isNew: true,
      isPopular: false
    },
    {
      id: 6,
      name: "WALKIFY Apex Streetwear Air Runner",
      category: "Streetwear",
      shortDesc: "High-tech streetwear performance sneaker with visible air bubble cushioning.",
      originalPrice: 2500,
      salePrice: 2200,
      badge: "TRENDING",
      badgeClass: "badge-gold",
      image: "images/shoe6.jpg",
      sizes: [39, 40, 41, 42, 43, 44],
      rating: 4.8,
      isNew: true,
      isPopular: true
    },
    {
      id: 7,
      name: "WALKIFY Velocity Court Sport",
      category: "Premium",
      shortDesc: "Sleek athletic tennis court sports shoe built for precision movement and maximum grip.",
      originalPrice: 2500,
      salePrice: 2200,
      badge: "LIMITED EDITION",
      badgeClass: "badge-sale",
      image: "images/shoe7.jpg",
      sizes: [39, 40, 41, 42, 43, 44],
      rating: 5.0,
      isNew: false,
      isPopular: true
    },
    {
      id: 8,
      name: "WALKIFY Nitro Speed Sprint Runner",
      category: "Casual",
      shortDesc: "Aerodynamic speed running sports shoe with carbon fibre plate technology.",
      originalPrice: 2500,
      salePrice: 2200,
      badge: "BEST SELLER",
      badgeClass: "badge-new",
      image: "images/shoe8.jpg",
      sizes: [39, 40, 41, 42, 43, 44],
      rating: 4.9,
      isNew: false,
      isPopular: true
    }
  ],

  // Storage Keys
  STORAGE_KEYS: {
    USERS: "walkify_users",
    CURRENT_USER: "walkify_current_user",
    CART: "walkify_cart",
    WISHLIST: "walkify_wishlist",
    ORDERS: "walkify_orders"
  },

  // Active State variables
  currentCategory: "All",
  searchQuery: "",
  sortBy: "popular",
  activeProductDetail: null,
  selectedDetailSize: null,
  detailQuantity: 1,

  // Flat Delivery Rate in PKR
  DELIVERY_FEE: 250
};

/* ==========================================================================
   DOM INITIALIZATION & LISTENERS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize LocalStorage Data
  initLocalStorage();

  // Render Core UI Components
  checkAuthState();
  renderProducts();
  renderNewArrivals();
  updateCartUI();
  updateWishlistUI();

  // Attach Event Listeners
  setupEventListeners();
});

/* ==========================================================================
   LOCAL STORAGE SETUP
   ========================================================================== */
function initLocalStorage() {
  if (!localStorage.getItem(WALKIFY.STORAGE_KEYS.USERS)) {
    localStorage.setItem(WALKIFY.STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(WALKIFY.STORAGE_KEYS.CART)) {
    localStorage.setItem(WALKIFY.STORAGE_KEYS.CART, JSON.stringify([]));
  }
  if (!localStorage.getItem(WALKIFY.STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(WALKIFY.STORAGE_KEYS.WISHLIST, JSON.stringify([]));
  }
  if (!localStorage.getItem(WALKIFY.STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(WALKIFY.STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
}

/* ==========================================================================
   1. AUTHENTICATION & USER MANAGEMENT
   ========================================================================== */
function checkAuthState() {
  const currentUser = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CURRENT_USER));
  const authOverlay = document.getElementById("authOverlay");
  const userGreetingNav = document.getElementById("userGreetingNav");

  if (currentUser) {
    if (authOverlay) authOverlay.classList.add("hidden");
    if (userGreetingNav) {
      userGreetingNav.innerHTML = `<i class="fa-solid fa-user text-gold"></i> ${currentUser.name.split(" ")[0]}`;
    }
  } else {
    // Keep auth overlay visible if user hasn't logged in or skipped
    const isGuestSkipped = sessionStorage.getItem("walkify_guest_mode");
    if (isGuestSkipped && authOverlay) {
      authOverlay.classList.add("hidden");
    } else if (authOverlay) {
      authOverlay.classList.remove("hidden");
    }
    if (userGreetingNav) {
      userGreetingNav.innerHTML = `<i class="fa-solid fa-user-lock"></i> Account`;
    }
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("loginRemember").checked;

  const users = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.USERS)) || [];
  const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (matchedUser) {
    localStorage.setItem(WALKIFY.STORAGE_KEYS.CURRENT_USER, JSON.stringify(matchedUser));
    showToast(`Welcome back, ${matchedUser.name}!`);
    document.getElementById("authOverlay").classList.add("hidden");
    checkAuthState();
  } else {
    // For demo convenience, allow initial login if no users registered yet
    if (users.length === 0 && email && password) {
      const newUser = { name: "Valued Customer", email, password };
      users.push(newUser);
      localStorage.setItem(WALKIFY.STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(WALKIFY.STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      showToast(`Welcome to WALKIFY, ${newUser.name}!`);
      document.getElementById("authOverlay").classList.add("hidden");
      checkAuthState();
    } else {
      showToast("Invalid email or password. Please try again.", "warning");
    }
  }
}

function handleSignUp(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPass = document.getElementById("signupConfirmPassword").value;

  if (password !== confirmPass) {
    showToast("Passwords do not match!", "warning");
    return;
  }

  const users = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.USERS)) || [];
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    showToast("An account with this email already exists.", "warning");
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem(WALKIFY.STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(WALKIFY.STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

  showToast(`Account created successfully! Welcome, ${name}.`);
  document.getElementById("authOverlay").classList.add("hidden");
  checkAuthState();
}

function handleLogout() {
  localStorage.removeItem(WALKIFY.STORAGE_KEYS.CURRENT_USER);
  sessionStorage.removeItem("walkify_guest_mode");
  showToast("Logged out successfully.");
  checkAuthState();
  // Show auth overlay
  document.getElementById("authOverlay").classList.remove("hidden");
}

function skipAuthGuest() {
  sessionStorage.setItem("walkify_guest_mode", "true");
  document.getElementById("authOverlay").classList.add("hidden");
  showToast("Exploring WALKIFY Store as Guest.");
}

function toggleAuthMode(mode) {
  const loginForm = document.getElementById("loginFormContainer");
  const signupForm = document.getElementById("signupFormContainer");
  const forgotForm = document.getElementById("forgotFormContainer");

  if (mode === "signup") {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    forgotForm.style.display = "none";
  } else if (mode === "forgot") {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
    forgotForm.style.display = "block";
  } else {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    forgotForm.style.display = "none";
  }
}

function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value.trim();
  if (email) {
    showToast(`Password reset link sent to ${email}`);
    toggleAuthMode('login');
  }
}

/* ==========================================================================
   2. PRODUCT RENDERING, SEARCH, FILTER & SORT
   ========================================================================== */
function calculateDiscount(original, sale) {
  return Math.round(((original - sale) / original) * 100);
}

function getFilteredProducts() {
  let list = [...WALKIFY.products];

  // Category Filter
  if (WALKIFY.currentCategory !== "All") {
    list = list.filter(p => p.category.toLowerCase() === WALKIFY.currentCategory.toLowerCase());
  }

  // Search Filter
  if (WALKIFY.searchQuery) {
    const q = WALKIFY.searchQuery.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.shortDesc.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (WALKIFY.sortBy === "price-low") {
    list.sort((a, b) => a.salePrice - b.salePrice);
  } else if (WALKIFY.sortBy === "price-high") {
    list.sort((a, b) => b.salePrice - a.salePrice);
  } else if (WALKIFY.sortBy === "newest") {
    list.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
  } else {
    // Popularity default
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function renderProducts() {
  const container = document.getElementById("productsGrid");
  if (!container) return;

  const products = getFilteredProducts();
  const wishlist = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.WISHLIST)) || [];

  if (products.length === 0) {
    container.innerHTML = `
      <div class="no-products-msg">
        <i class="fa-solid fa-shoe-prints"></i>
        <h3>No WALKIFY shoes found.</h3>
        <p>Try clearing your search query or selecting a different category filter.</p>
        <button class="btn-primary" style="margin-top:1rem;" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const isWishlisted = wishlist.some(id => id === product.id);
    const discount = calculateDiscount(product.originalPrice, product.salePrice);

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image-container">
          <span class="badge ${product.badgeClass} product-badge">${product.badge}</span>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id}, event)" title="Save to Wishlist">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='images/shoe' + product.id + '.jpg';">
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-short-desc">${product.shortDesc}</p>
          <div class="product-pricing">
            <span class="price-sale">Rs. ${product.salePrice.toLocaleString()}</span>
            <span class="price-original">Rs. ${product.originalPrice.toLocaleString()}</span>
            <span class="discount-tag">${discount}% OFF</span>
          </div>
          <div class="product-actions">
            <button class="btn-card-action btn-outline" onclick="openProductDetail(${product.id})">
              <i class="fa-regular fa-eye"></i> Details
            </button>
            <button class="btn-card-action btn-primary" onclick="openProductDetail(${product.id})">
              <i class="fa-solid fa-bag-shopping"></i> Select Size
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderNewArrivals() {
  const container = document.getElementById("newArrivalsGrid");
  if (!container) return;

  const newItems = WALKIFY.products.filter(p => p.isNew || p.badge === "NEW ARRIVAL" || p.badge === "TRENDING").slice(0, 4);

  container.innerHTML = newItems.map(product => {
    const discount = calculateDiscount(product.originalPrice, product.salePrice);
    return `
      <div class="product-card">
        <div class="product-image-container">
          <span class="badge badge-gold product-badge">${product.badge}</span>
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='images/shoe' + product.id + '.jpg';">
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-pricing">
            <span class="price-sale">Rs. ${product.salePrice.toLocaleString()}</span>
            <span class="price-original">Rs. ${product.originalPrice.toLocaleString()}</span>
            <span class="discount-tag">${discount}% OFF</span>
          </div>
          <button class="btn-primary" style="width:100%; margin-top:0.5rem;" onclick="openProductDetail(${product.id})">
            Shop New Arrival
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function filterCategory(cat) {
  WALKIFY.currentCategory = cat;
  
  // Update UI tabs
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === cat);
  });

  renderProducts();
  
  // Smooth scroll to shop section
  const shopEl = document.getElementById("shop");
  if (shopEl) {
    shopEl.scrollIntoView({ behavior: "smooth" });
  }
}

function resetFilters() {
  WALKIFY.currentCategory = "All";
  WALKIFY.searchQuery = "";
  WALKIFY.sortBy = "popular";
  
  const searchInput = document.getElementById("shopSearchInput");
  if (searchInput) searchInput.value = "";

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === "All");
  });

  renderProducts();
}

/* ==========================================================================
   3. PRODUCT DETAIL MODAL & SIZE SELECTION GUARD
   ========================================================================== */
function openProductDetail(productId) {
  const product = WALKIFY.products.find(p => p.id === productId);
  if (!product) return;

  WALKIFY.activeProductDetail = product;
  WALKIFY.selectedDetailSize = null; // Reset size on opening detail modal
  WALKIFY.detailQuantity = 1;

  const modal = document.getElementById("productDetailModal");
  const discount = calculateDiscount(product.originalPrice, product.salePrice);

  document.getElementById("detailImg").src = product.image;
  document.getElementById("detailTitle").innerText = product.name;
  document.getElementById("detailCategory").innerText = `${product.category} COLLECTION`;
  document.getElementById("detailSalePrice").innerText = `Rs. ${product.salePrice.toLocaleString()}`;
  document.getElementById("detailOriginalPrice").innerText = `Rs. ${product.originalPrice.toLocaleString()}`;
  document.getElementById("detailDiscountBadge").innerText = `${discount}% OFF`;
  document.getElementById("detailDescription").innerText = product.shortDesc;
  document.getElementById("detailQtyInput").value = 1;

  // Render Size Options
  const sizeContainer = document.getElementById("detailSizeOptions");
  sizeContainer.innerHTML = product.sizes.map(size => `
    <button class="size-btn" onclick="selectDetailSize(${size}, this)">${size}</button>
  `).join("");

  modal.classList.add("active");
}

function closeProductDetail() {
  const modal = document.getElementById("productDetailModal");
  if (modal) modal.classList.remove("active");
}

function selectDetailSize(size, element) {
  WALKIFY.selectedDetailSize = size;
  
  document.querySelectorAll("#detailSizeOptions .size-btn").forEach(btn => {
    btn.classList.remove("selected");
  });
  element.classList.add("selected");
}

function adjustDetailQty(amount) {
  let newQty = WALKIFY.detailQuantity + amount;
  if (newQty < 1) newQty = 1;
  WALKIFY.detailQuantity = newQty;
  document.getElementById("detailQtyInput").value = newQty;
}

function addDetailToCart(buyNow = false) {
  // STRICT SIZE GUARD REQUIREMENT
  if (!WALKIFY.selectedDetailSize) {
    showToast("⚠️ Please select a shoe size (39, 40, 41, 42, 43, 44) before proceeding!", "warning");
    return;
  }

  const item = {
    id: `${WALKIFY.activeProductDetail.id}-${WALKIFY.selectedDetailSize}`,
    productId: WALKIFY.activeProductDetail.id,
    name: WALKIFY.activeProductDetail.name,
    price: WALKIFY.activeProductDetail.salePrice,
    originalPrice: WALKIFY.activeProductDetail.originalPrice,
    size: WALKIFY.selectedDetailSize,
    quantity: WALKIFY.detailQuantity,
    image: WALKIFY.activeProductDetail.image
  };

  addToCartStorage(item);
  closeProductDetail();

  if (buyNow) {
    openCheckoutModal();
  } else {
    toggleCartDrawer(true);
    showToast(`Added ${item.name} (Size ${item.size}) to cart!`);
  }
}

/* ==========================================================================
   4. SHOPPING CART MANAGEMENT
   ========================================================================== */
function addToCartStorage(item) {
  let cart = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CART)) || [];
  const existingIndex = cart.findIndex(ci => ci.id === item.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem(WALKIFY.STORAGE_KEYS.CART, JSON.stringify(cart));
  updateCartUI();
}

function updateCartQty(cartItemId, amount) {
  let cart = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CART)) || [];
  const item = cart.find(ci => ci.id === cartItemId);

  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      cart = cart.filter(ci => ci.id !== cartItemId);
    }
    localStorage.setItem(WALKIFY.STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartUI();
  }
}

function removeCartItem(cartItemId) {
  let cart = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CART)) || [];
  cart = cart.filter(ci => ci.id !== cartItemId);
  localStorage.setItem(WALKIFY.STORAGE_KEYS.CART, JSON.stringify(cart));
  updateCartUI();
  showToast("Item removed from cart.");
}

function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CART)) || [];
  const countBadge = document.getElementById("cartItemCounter");
  const cartItemsContainer = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");

  // Counter badge
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countBadge) countBadge.innerText = totalCount;

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-view">
        <i class="fa-solid fa-bag-shopping empty-cart-icon"></i>
        <h3>YOUR CART IS EMPTY</h3>
        <p style="margin-top:0.5rem; margin-bottom:1.5rem;">Discover our vintage luxury shoe collection.</p>
        <button class="btn-primary" onclick="toggleCartDrawer(false); filterCategory('All');">CONTINUE SHOPPING</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.innerText = "Rs. 0";
    if (totalEl) totalEl.innerText = "Rs. 0";
    return;
  }

  // Calculate Subtotal and Total with Rs. 250 Delivery
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + WALKIFY.DELIVERY_FEE;

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='images/shoe' + item.productId + '.jpg';">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-meta">Size: <strong>${item.size}</strong></div>
        <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
        <div class="quantity-control" style="margin-top:0.5rem; margin-bottom:0;">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span class="qty-input">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <i class="fa-solid fa-trash-can cart-item-remove" onclick="removeCartItem('${item.id}')" title="Remove item"></i>
    </div>
  `).join("");

  if (subtotalEl) subtotalEl.innerText = `Rs. ${subtotal.toLocaleString()}`;
  if (totalEl) totalEl.innerText = `Rs. ${total.toLocaleString()}`;
}

function toggleCartDrawer(open) {
  const overlay = document.getElementById("cartDrawerOverlay");
  if (overlay) {
    if (open) overlay.classList.add("active");
    else overlay.classList.remove("active");
  }
}

/* ==========================================================================
   5. WISHLIST SYSTEM
   ========================================================================== */
function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();

  let wishlist = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.WISHLIST)) || [];
  const index = wishlist.indexOf(productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Removed from Wishlist.");
  } else {
    wishlist.push(productId);
    showToast("Added to Wishlist! ♥");
  }

  localStorage.setItem(WALKIFY.STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  renderProducts();
  updateWishlistUI();
}

function updateWishlistUI() {
  const wishlist = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.WISHLIST)) || [];
  const countBadge = document.getElementById("wishlistCounter");
  if (countBadge) countBadge.innerText = wishlist.length;
}

function openWishlistModal() {
  const wishlistIds = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.WISHLIST)) || [];
  const modal = document.getElementById("wishlistModal");
  const container = document.getElementById("wishlistModalGrid");

  const wishlistedProducts = WALKIFY.products.filter(p => wishlistIds.includes(p.id));

  if (wishlistedProducts.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <i class="fa-regular fa-heart" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem;"></i>
        <h3>Your Wishlist is Empty</h3>
        <p>Save your favorite vintage shoes by clicking the heart icon on any product.</p>
      </div>
    `;
  } else {
    container.innerHTML = wishlistedProducts.map(product => `
      <div class="product-card">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="price-sale">Rs. ${product.salePrice.toLocaleString()}</div>
          <button class="btn-primary" style="margin-top:1rem; width:100%;" onclick="closeModal('wishlistModal'); openProductDetail(${product.id});">
            View & Select Size
          </button>
        </div>
      </div>
    `).join("");
  }

  modal.classList.add("active");
}

/* ==========================================================================
   6. CHECKOUT & ORDER CONFIRMATION
   ========================================================================== */
function openCheckoutModal() {
  const cart = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CART)) || [];
  if (cart.length === 0) {
    showToast("Your cart is empty!", "warning");
    return;
  }

  toggleCartDrawer(false);

  // Pre-fill user data if logged in
  const currentUser = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CURRENT_USER));
  if (currentUser) {
    if (document.getElementById("checkoutName")) document.getElementById("checkoutName").value = currentUser.name || "";
    if (document.getElementById("checkoutEmail")) document.getElementById("checkoutEmail").value = currentUser.email || "";
  }

  renderCheckoutSummary();
  document.getElementById("checkoutModal").classList.add("active");
}

function renderCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CART)) || [];
  const summaryContainer = document.getElementById("checkoutOrderSummaryList");
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + WALKIFY.DELIVERY_FEE;

  summaryContainer.innerHTML = cart.map(item => `
    <div style="display:flex; justify-content:space-between; margin-bottom:0.8rem; font-size:0.85rem;">
      <div>
        <strong>${item.name}</strong> (Size ${item.size}) × ${item.quantity}
      </div>
      <div>Rs. ${(item.price * item.quantity).toLocaleString()}</div>
    </div>
  `).join("");

  document.getElementById("checkoutSubtotal").innerText = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById("checkoutDelivery").innerText = `Rs. ${WALKIFY.DELIVERY_FEE.toLocaleString()}`;
  document.getElementById("checkoutTotal").innerText = `Rs. ${total.toLocaleString()}`;
}

function processCheckoutOrder(e) {
  e.preventDefault();

  const name = document.getElementById("checkoutName").value.trim();
  const email = document.getElementById("checkoutEmail").value.trim();
  const phone = document.getElementById("checkoutPhone").value.trim();
  const address = document.getElementById("checkoutAddress").value.trim();
  const city = document.getElementById("checkoutCity").value.trim();
  const province = document.getElementById("checkoutProvince").value.trim();
  const postal = document.getElementById("checkoutPostal").value.trim();

  if (!name || !email || !phone || !address || !city) {
    showToast("Please fill in all required customer details.", "warning");
    return;
  }

  const cart = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.CART)) || [];
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + WALKIFY.DELIVERY_FEE;

  // Generate Unique Order Number e.g. #WK-2026-48291
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderNum = `WK-2026-${randomNum}`;

  const orderData = {
    orderNumber: orderNum,
    date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
    customer: { name, email, phone, address, city, province, postal },
    items: cart,
    subtotal: subtotal,
    deliveryFee: WALKIFY.DELIVERY_FEE,
    total: total,
    paymentMethod: "Cash on Delivery"
  };

  // Save Order to LocalStorage
  const orders = JSON.parse(localStorage.getItem(WALKIFY.STORAGE_KEYS.ORDERS)) || [];
  orders.push(orderData);
  localStorage.setItem(WALKIFY.STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  // Clear Cart
  localStorage.setItem(WALKIFY.STORAGE_KEYS.CART, JSON.stringify([]));
  updateCartUI();

  // Close Checkout Modal & Show Order Confirmation Screen
  closeModal('checkoutModal');
  showOrderConfirmation(orderData);
}

function showOrderConfirmation(order) {
  document.getElementById("confirmOrderNum").innerText = `#${order.orderNumber}`;
  document.getElementById("confirmCustomerName").innerText = order.customer.name;
  document.getElementById("confirmTotalAmount").innerText = `Rs. ${order.total.toLocaleString()}`;
  document.getElementById("confirmDeliveryAddress").innerText = `${order.customer.address}, ${order.customer.city}, ${order.customer.province}`;
  
  document.getElementById("orderConfirmationModal").classList.add("active");
}

/* ==========================================================================
   7. EVENT LISTENERS & UI HELPERS
   ========================================================================== */
function setupEventListeners() {
  // Mobile Nav Hamburger Toggle
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileOverlay = document.getElementById("mobileNavOverlay");
  const mobileClose = document.getElementById("mobileNavClose");

  if (hamburger) {
    hamburger.addEventListener("click", () => mobileOverlay.classList.add("active"));
  }
  if (mobileClose) {
    mobileClose.addEventListener("click", () => mobileOverlay.classList.remove("active"));
  }

  // Shop Search Input
  const searchInput = document.getElementById("shopSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      WALKIFY.searchQuery = e.target.value.trim();
      renderProducts();
    });
  }

  // Sort Dropdown
  const sortSelect = document.getElementById("shopSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      WALKIFY.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Contact Form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Thank you for reaching out! A WALKIFY representative will respond shortly.");
      contactForm.reset();
    });
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toastAlert");
  const msgEl = document.getElementById("toastMessage");
  
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  toast.className = `toast-alert active ${type}`;

  setTimeout(() => {
    toast.classList.remove("active");
  }, 4000);
}
