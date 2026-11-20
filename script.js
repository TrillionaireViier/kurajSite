// Products data with high-quality images and full specifications
const products = {
  clothing: [
    {
      id: 1,
      name: "Premium Silk Dress",
      price: 899,
      originalPrice: 1199,
      image: "images/silk-dress-elegant.png",
      thumbnails: [
        "images/silk-dress-elegant.png",
      ],
      category: "dresses",
      description:
        "Elegant silk dress crafted from the finest Italian silk with hand-finished seams and luxurious draping",
      badge: "New",
      sizes: ["XS", "S", "M", "L", "XL"],
      inStock: true,
    },
    {
      id: 2,
      name: "Luxury Cashmere Coat",
      price: 1599,
      originalPrice: 1999,
      image: "images/cashmere-coat-premium.png",
      thumbnails: [
        "images/cashmere-coat-premium.png",
      ],
      category: "jackets",
      description: "Premium cashmere coat with timeless design, featuring mother-of-pearl buttons and silk lining",
      badge: "Sale",
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
    },
    {
      id: 3,
      name: "Designer Suit",
      price: 2299,
      originalPrice: null,
      image: "images/designer-suit-charcoal.png",
      thumbnails: [
        "images/designer-suit-charcoal.png",
      ],
      category: "suits",
      description: "Handcrafted designer suit with perfect tailoring, made from premium wool with peak lapels",
      badge: null,
      sizes: ["S", "M", "L", "XL", "XXL"],
      inStock: true,
    },
    {
      id: 4,
      name: "Premium Cotton Shirt",
      price: 299,
      originalPrice: 399,
      image: "images/cotton-shirt-white.png",
      thumbnails: [
        "images/cotton-shirt-white.png",
      ],
      category: "shirts",
      description: "Luxury cotton shirt with mother-of-pearl buttons, French seams, and monogramming option",
      badge: null,
      sizes: ["XS", "S", "M", "L", "XL"],
      inStock: true,
    },
    {
      id: 5,
      name: "Leather Handbag",
      price: 799,
      originalPrice: null,
      image: "images/leather-handbag-black.png",
      thumbnails: [
        "images/leather-handbag-black.png",
      ],
      category: "accessories",
      description: "Handcrafted Italian leather handbag with gold-plated hardware and silk-lined interior",
      badge: "Limited",
      sizes: ["One Size"],
      inStock: true,
    },
    {
      id: 6,
      name: "Evening Gown",
      price: 1899,
      originalPrice: 2299,
      image: "images/evening-gown-beaded.png",
      thumbnails: [
        "images/evening-gown-beaded.png",
      ],
      category: "dresses",
      badge: "Exclusive",
      description: "Stunning evening gown with intricate hand-sewn beadwork and flowing train",
      sizes: ["XS", "S", "M", "L"],
      inStock: true,
    },
  ],
  watches: [
    {
      id: 7,
      name: "Classic Gold Watch",
      price: 15999,
      originalPrice: null,
      image: "images/gold-watch-classic.png",
      thumbnails: [
        "images/gold-watch-classic.png",
      ],
      category: "luxury",
      description: "18k gold automatic watch with Swiss movement, sapphire crystal, and alligator leather strap",
      badge: "Bestseller",
      brand: "rolex",
      movement: "automatic",
      material: "gold",
      inStock: true,
    },
    {
      id: 8,
      name: "Platinum Timepiece",
      price: 45999,
      originalPrice: null,
      image: "images/platinum-watch-diamonds.png",
      thumbnails: [
        "images/platinum-watch-diamonds.png",
      ],
      category: "luxury",
      description: "Exclusive platinum watch with diamond markers, perpetual calendar, and moon phase display",
      badge: "Limited",
      brand: "patek",
      movement: "manual",
      material: "platinum",
      inStock: true,
    },
    {
      id: 9,
      name: "Steel Sports Watch",
      price: 8999,
      originalPrice: 9999,
      image: "images/steel-diving-watch.png",
      thumbnails: [
        "images/steel-diving-watch.png",
      ],
      category: "sports",
      description: "Professional diving watch with steel case, unidirectional bezel, and 300m water resistance",
      badge: null,
      brand: "omega",
      movement: "automatic",
      material: "steel",
      inStock: true,
    },
    {
      id: 10,
      name: "Rose Gold Elegance",
      price: 22999,
      originalPrice: null,
      image: "images/rose-gold-dress-watch.png",
      thumbnails: [
        "images/rose-gold-dress-watch.png",
      ],
      category: "luxury",
      badge: "New",
      brand: "cartier",
      movement: "quartz",
      material: "gold",
      description: "Sophisticated rose gold watch with leather strap, Roman numerals, and ultra-thin profile",
      inStock: true,
    },
    {
      id: 11,
      name: "Titanium Aviator",
      price: 12999,
      originalPrice: 14999,
      image: "images/titanium-aviator-watch.png",
      thumbnails: [
        "images/titanium-aviator-watch.png",
      ],
      category: "aviation",
      description: "Lightweight titanium aviator watch with chronograph function and anti-magnetic properties",
      badge: "Sale",
      brand: "breitling",
      movement: "automatic",
      material: "titanium",
      inStock: true,
    },
    {
      id: 12,
      name: "Diamond Luxury",
      price: 89999,
      originalPrice: null,
      image: "images/diamond-luxury-watch.png",
      thumbnails: [
        "images/diamond-luxury-watch.png",
      ],
      category: "luxury",
      description: "Exquisite watch with diamond-encrusted bezel, mother-of-pearl dial, and 18k gold case",
      badge: "Exclusive",
      brand: "rolex",
      movement: "automatic",
      material: "gold",
      inStock: true,
    },
  ],
}

// Shopping Cart state
let cart = []
try {
  cart = JSON.parse(localStorage.getItem("kurajFashionCart")) || []
} catch (e) {
  cart = []
}

// DOM Elements
const cartBtn = document.querySelector(".cart-btn")
const cartModal = document.getElementById("cartModal")
const closeCartBtn = document.querySelector(".close-cart")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const cartCount = document.querySelector(".cart-count")

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI()
  loadPageContent()
  initializeEventListeners()
})

// Load page-specific content
function loadPageContent() {
  const currentPath = window.location.pathname
  const currentPage = currentPath.split("/").pop() || "index.html"

  if (currentPage === "index.html" || currentPage === "" || currentPath === "/") {
    loadFeaturedProducts()
  } else if (currentPage === "clothing.html" || currentPath.includes("clothing")) {
    loadClothingProducts()
    initFilters("clothing")
  } else if (currentPage === "watches.html" || currentPath.includes("watches")) {
    loadWatchProducts()
    initFilters("watches")
  } else if (currentPage === "product-detail.html" || currentPath.includes("product-detail")) {
    loadProductDetail()
  }
}

// Initialize event listeners
function initializeEventListeners() {
  // Cart modal toggle
  if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", () => {
      cartModal.classList.add("active")
    })
  }

  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener("click", () => {
      cartModal.classList.remove("active")
    })
  }

  // Close modal when clicking backdrop
  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove("active")
      }
    })
  }

  // Checkout button
  initializeCheckout()

  // Newsletter form
  const newsletterForm = document.getElementById("newsletterForm")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit)
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navMenu = document.querySelector(".nav-menu")
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Search button
  const searchBtn = document.querySelector(".search-btn")
  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch)
  }

  // Product detail page interactions
  initializeProductDetail()
}

// Load featured products for homepage
function loadFeaturedProducts() {
  const featuredContainer = document.getElementById("featuredProducts")
  if (!featuredContainer) return

  const featured = [...products.clothing.slice(0, 3), ...products.watches.slice(0, 3)]
  featuredContainer.innerHTML = featured.map((product) => createProductCard(product)).join("")
}

// Load clothing products
function loadClothingProducts() {
  const clothingContainer = document.getElementById("clothingProducts")
  if (!clothingContainer) return

  clothingContainer.innerHTML = products.clothing.map((product) => createProductCard(product)).join("")
  updateProductsCount(products.clothing.length)
}

// Load watch products
function loadWatchProducts() {
  const watchContainer = document.getElementById("watchProducts")
  if (!watchContainer) return

  watchContainer.innerHTML = products.watches.map((product) => createProductCard(product)).join("")
  updateProductsCount(products.watches.length)
}

// Create product card HTML
function createProductCard(product) {
  const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : ""
  const originalPriceHtml = product.originalPrice
    ? `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>`
    : ""

  return `
    <div class="product-card" onclick="viewProduct(${product.id})">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${badgeHtml}
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-price">
          <span class="current-price">$${product.price.toLocaleString()}</span>
          ${originalPriceHtml}
        </div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
          Add to Cart
        </button>
      </div>
    </div>
  `
}

// View product detail handler
function viewProduct(productId) {
  sessionStorage.setItem("selectedProductId", productId)
  window.location.href = `product-detail.html?id=${productId}`
}

// Load product detail on product-detail.html
function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search)
  const idFromUrl = Number.parseInt(urlParams.get("id"), 10)
  const idFromStorage = Number.parseInt(sessionStorage.getItem("selectedProductId"), 10)
  const productId = idFromUrl || idFromStorage || 1

  const allProducts = [...products.clothing, ...products.watches]
  const product = allProducts.find((p) => p.id === productId) || allProducts[0]
  if (!product) return

  const titleEl = document.getElementById("productTitle")
  const priceEl = document.getElementById("productPrice")
  const origPriceEl = document.getElementById("originalPrice")
  const descEl = document.getElementById("productDescription")
  const mainImg = document.getElementById("mainProductImage")
  const catLink = document.getElementById("categoryLink")
  const nameEl = document.getElementById("productName")
  const sizeOptions = document.getElementById("sizeOptions")

  if (titleEl) titleEl.textContent = product.name
  if (priceEl) priceEl.textContent = `$${product.price.toLocaleString()}`
  if (descEl) descEl.textContent = product.description
  if (mainImg) {
    mainImg.src = product.image
    mainImg.alt = product.name
  }

  if (origPriceEl) {
    if (product.originalPrice) {
      origPriceEl.textContent = `$${product.originalPrice.toLocaleString()}`
      origPriceEl.style.display = "inline"
    } else {
      origPriceEl.style.display = "none"
    }
  }

  // Thumbnails
  const thumbnailContainer = document.querySelector(".thumbnail-images")
  if (thumbnailContainer) {
    const rawThumbs = [product.image, ...(product.thumbnails || [])]
    const uniqueThumbs = [...new Set(rawThumbs)]
    thumbnailContainer.innerHTML = uniqueThumbs
      .map(
        (thumb, index) =>
          `<img src="${thumb}" alt="${product.name} view ${index + 1}" class="thumbnail ${index === 0 ? "active" : ""}" />`,
      )
      .join("")

    const allThumbs = thumbnailContainer.querySelectorAll(".thumbnail")
    allThumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        allThumbs.forEach((t) => t.classList.remove("active"))
        thumb.classList.add("active")
        if (mainImg) mainImg.src = thumb.src
      })
    })
  }

  // Sizes for clothing vs watches
  if (sizeOptions) {
    if (product.sizes && product.sizes.length > 0) {
      sizeOptions.style.display = "block"
      const sizeSelector = sizeOptions.querySelector(".size-selector")
      if (sizeSelector) {
        sizeSelector.innerHTML = product.sizes
          .map((s, idx) => `<button type="button" class="size-btn ${idx === 0 ? "active" : ""}">${s}</button>`)
          .join("")
        sizeSelector.querySelectorAll(".size-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            sizeSelector.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"))
            btn.classList.add("active")
          })
        })
      }
    } else {
      sizeOptions.style.display = "none"
    }
  }

  // Breadcrumbs
  const isClothing = products.clothing.some((p) => p.id === product.id)
  if (catLink) {
    catLink.href = isClothing ? "clothing.html" : "watches.html"
    catLink.textContent = isClothing ? "Clothing" : "Watches"
  }
  if (nameEl) nameEl.textContent = product.name

  // Related products
  loadRelatedProducts(product)
}

// Initialize product detail interactions
function initializeProductDetail() {
  // Quantity selector buttons
  const quantityInput = document.getElementById("quantity")
  const minusBtn = document.querySelector(".qty-btn.minus")
  const plusBtn = document.querySelector(".qty-btn.plus")

  if (minusBtn && quantityInput) {
    minusBtn.addEventListener("click", () => {
      const val = Number.parseInt(quantityInput.value, 10) || 1
      if (val > 1) quantityInput.value = val - 1
    })
  }

  if (plusBtn && quantityInput) {
    plusBtn.addEventListener("click", () => {
      const val = Number.parseInt(quantityInput.value, 10) || 1
      if (val < 10) quantityInput.value = val + 1
    })
  }

  // Add to cart from detail page
  const addToCartBtn = document.getElementById("addToCartBtn")
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const urlParams = new URLSearchParams(window.location.search)
      const productId =
        Number.parseInt(urlParams.get("id"), 10) ||
        Number.parseInt(sessionStorage.getItem("selectedProductId"), 10) ||
        1
      const qty = Number.parseInt(document.getElementById("quantity")?.value, 10) || 1
      const activeSizeBtn = document.querySelector(".size-btn.active")
      const selectedSize = activeSizeBtn ? activeSizeBtn.textContent.trim() : null

      addToCart(productId, qty, selectedSize)
    })
  }

  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabId = e.currentTarget.dataset.tab
      if (tabId) switchTab(tabId)
    })
  })
}

// Load related products
function loadRelatedProducts(currentProduct) {
  const relatedContainer = document.getElementById("relatedProducts")
  if (!relatedContainer) return

  const allProducts = [...products.clothing, ...products.watches]
  const related = allProducts
    .filter((p) => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4)

  if (related.length === 0) {
    const fallback = allProducts.filter((p) => p.id !== currentProduct.id).slice(0, 4)
    relatedContainer.innerHTML = fallback.map((p) => createProductCard(p)).join("")
  } else {
    relatedContainer.innerHTML = related.map((p) => createProductCard(p)).join("")
  }
}

// Switch tabs on detail page
function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"))

  const activeBtn = document.querySelector(`[data-tab="${tabId}"]`)
  const activePanel = document.getElementById(tabId)
  if (activeBtn) activeBtn.classList.add("active")
  if (activePanel) activePanel.classList.add("active")
}

// Filter system for clothing and watches pages
function initFilters(type) {
  const filterInputs = document.querySelectorAll(".filters-sidebar input[type='checkbox']")
  if (filterInputs.length === 0) return

  filterInputs.forEach((input) => {
    input.addEventListener("change", () => applyFilters(type))
  })
}

function applyFilters(type) {
  const activeFilters = {
    categories: [],
    priceRanges: [],
    sizes: [],
    brands: [],
    movements: [],
    materials: [],
  }

  document.querySelectorAll(".filters-sidebar input[type='checkbox']:checked").forEach((cb) => {
    const val = cb.value.toLowerCase()
    const groupTitle = cb.closest(".filter-group")?.querySelector("h3")?.textContent.trim().toLowerCase()
    if (groupTitle === "category") activeFilters.categories.push(val)
    else if (groupTitle === "price range") activeFilters.priceRanges.push(val)
    else if (groupTitle === "size") activeFilters.sizes.push(val.toUpperCase())
    else if (groupTitle === "brand") activeFilters.brands.push(val)
    else if (groupTitle === "movement") activeFilters.movements.push(val)
    else if (groupTitle === "case material") activeFilters.materials.push(val)
  })

  let list = type === "clothing" ? [...products.clothing] : [...products.watches]

  if (activeFilters.categories.length > 0) {
    list = list.filter((p) => activeFilters.categories.includes(p.category.toLowerCase()))
  }

  if (activeFilters.brands.length > 0) {
    list = list.filter((p) => p.brand && activeFilters.brands.includes(p.brand.toLowerCase()))
  }

  if (activeFilters.movements.length > 0) {
    list = list.filter((p) => p.movement && activeFilters.movements.includes(p.movement.toLowerCase()))
  }

  if (activeFilters.materials.length > 0) {
    list = list.filter((p) => p.material && activeFilters.materials.includes(p.material.toLowerCase()))
  }

  if (activeFilters.sizes.length > 0) {
    list = list.filter((p) => p.sizes && p.sizes.some((s) => activeFilters.sizes.includes(s.toUpperCase())))
  }

  if (activeFilters.priceRanges.length > 0) {
    list = list.filter((p) => {
      return activeFilters.priceRanges.some((range) => {
        if (range === "0-500") return p.price <= 500
        if (range === "500-1000") return p.price >= 500 && p.price <= 1000
        if (range === "1000-2000") return p.price >= 1000 && p.price <= 2000
        if (range === "2000+") return p.price >= 2000
        if (range === "5000-10000") return p.price >= 5000 && p.price <= 10000
        if (range === "10000-25000") return p.price >= 10000 && p.price <= 25000
        if (range === "25000-50000") return p.price >= 25000 && p.price <= 50000
        if (range === "50000+") return p.price >= 50000
        return true
      })
    })
  }

  const containerId = type === "clothing" ? "clothingProducts" : "watchProducts"
  const container = document.getElementById(containerId)
  if (container) {
    if (list.length === 0) {
      container.innerHTML =
        '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #888; font-size: 1.1rem;">No products match the selected filters.</div>'
    } else {
      container.innerHTML = list.map((product) => createProductCard(product)).join("")
    }
  }
  updateProductsCount(list.length)
}

// Cart operations
function addToCart(productId, quantity = 1, size = null) {
  const allProducts = [...products.clothing, ...products.watches]
  const product = allProducts.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId && item.size === size)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      size: size,
    })
  }

  saveCart()
  updateCartUI()
  showCartNotification(`${product.name} added to cart!`)
}

function removeFromCart(productId, size = null) {
  cart = cart.filter((item) => !(item.id === productId && item.size === size))
  saveCart()
  updateCartUI()
}

function updateCartQuantity(productId, size, newQuantity) {
  const item = cart.find((item) => item.id === productId && item.size === size)
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId, size)
    } else {
      item.quantity = newQuantity
      saveCart()
      updateCartUI()
    }
  }
}

function saveCart() {
  localStorage.setItem("kurajFashionCart", JSON.stringify(cart))
}

function updateCartUI() {
  updateCartCount()
  updateCartItems()
  updateCartTotal()
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0)
  if (cartCount) {
    cartCount.textContent = total
    cartCount.style.display = total > 0 ? "flex" : "none"
  }
}

function updateCartItems() {
  if (!cartItems) return

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart" style="text-align: center; padding: 2rem; color: #888;">Your cart is empty</div>'
    return
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            ${item.size ? `<div class="cart-item-size">Size: ${item.size}</div>` : ""}
            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
            <div class="cart-item-quantity">
              <button onclick="updateCartQuantity(${item.id}, ${item.size ? `'${item.size}'` : "null"}, ${item.quantity - 1})">-</button>
              <input type="number" value="${item.quantity}" min="1"
                     onchange="updateCartQuantity(${item.id}, ${item.size ? `'${item.size}'` : "null"}, parseInt(this.value) || 1)">
              <button onclick="updateCartQuantity(${item.id}, ${item.size ? `'${item.size}'` : "null"}, ${item.quantity + 1})">+</button>
            </div>
          </div>
          <button class="remove-item" onclick="removeFromCart(${item.id}, ${item.size ? `'${item.size}'` : "null"})">&times;</button>
        </div>
      `,
    )
    .join("")
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  if (cartTotal) {
    cartTotal.textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
}

function showCartNotification(msg = "Item added to cart!") {
  const existing = document.querySelector(".cart-notification")
  if (existing) existing.remove()

  const notification = document.createElement("div")
  notification.className = "cart-notification"
  notification.textContent = msg
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #ffd700;
    color: #000;
    padding: 1rem 1.8rem;
    border-radius: 6px;
    font-weight: 600;
    z-index: 3000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.25);
    animation: slideIn 0.3s ease;
  `
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 2800)
}

function updateProductsCount(count) {
  const countEl = document.getElementById("productsCount")
  if (countEl) countEl.textContent = `${count} Products`
}

function initializeCheckout() {
  const checkoutBtns = document.querySelectorAll(".checkout-btn")
  checkoutBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.")
        return
      }

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const confirmed = confirm(
        `Order Summary:\n\n${cart.map((i) => `• ${i.name} (x${i.quantity}) - $${(i.price * i.quantity).toLocaleString()}`).join("\n")}\n\nTotal: $${total.toLocaleString()}\n\nWould you like to complete this purchase?`,
      )

      if (confirmed) {
        cart = []
        saveCart()
        updateCartUI()
        if (cartModal) cartModal.classList.remove("active")
        alert("Thank you for your order! Your purchase has been confirmed.")
      }
    })
  })
}

function handleNewsletterSubmit(e) {
  e.preventDefault()
  const emailInput = e.target.querySelector('input[type="email"]')
  const email = emailInput ? emailInput.value : ""
  const submitBtn = e.target.querySelector("button")
  const originalText = submitBtn ? submitBtn.textContent : "Subscribe"

  if (submitBtn) {
    submitBtn.textContent = "Subscribing..."
    submitBtn.disabled = true
  }

  setTimeout(() => {
    alert(`Thank you for subscribing with ${email}!`)
    e.target.reset()
    if (submitBtn) {
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }
  }, 900)
}

function handleSearch() {
  const term = prompt("Search KURAJ FASHION collection:")
  if (!term || !term.trim()) return

  const cleanTerm = term.trim().toLowerCase()
  const allProducts = [...products.clothing, ...products.watches]
  const matched = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(cleanTerm) ||
      p.description.toLowerCase().includes(cleanTerm) ||
      p.category.toLowerCase().includes(cleanTerm),
  )

  if (matched.length === 0) {
    alert(`No products found matching "${term}".`)
  } else {
    viewProduct(matched[0].id)
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href")
    if (targetId && targetId !== "#") {
      const target = document.querySelector(targetId)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  })
})

// Add slide-in animation CSS for notifications
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`
document.head.appendChild(style)


// Global compatibility helpers for all pages
window.showNotification = function(msg, type) {
  showCartNotification(msg);
};

window.toggleCart = function() {
  const modal = document.getElementById("cartModal") || document.getElementById("cartSidebar");
  if (modal) modal.classList.add("active");
};

window.closeCart = function() {
  const modal = document.getElementById("cartModal") || document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  if (modal) modal.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
};
