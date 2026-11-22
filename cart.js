// Cart functionality
let cart = []

// Load cart from localStorage on page load
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", () => {
    loadCart()
    // Wait a bit for header to be injected
    setTimeout(updateCartUI, 500)
  })
} else {
  // If DOM is already loaded
  loadCart()
  setTimeout(updateCartUI, 500)
}

function loadCart() {
  const savedCart = localStorage.getItem("cart") || localStorage.getItem("luxuryCart")
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart)
      // Validate cart structure
      if (!Array.isArray(cart)) {
        cart = []
      } else {
        // Clean up corrupted items (e.g. price 0 from old static HTML)
        const originalLength = cart.length;
        cart = cart.filter(item => item.price && !isNaN(item.price) && item.price > 0);
        if (cart.length !== originalLength) {
          saveCart();
          console.log("Cart cleaned: removed items with 0 or invalid price.");
        }
      }
      console.log("Cart loaded from localStorage:", cart)
    } catch (e) {
      console.error("Error parsing cart from localStorage:", e)
      cart = []
      localStorage.removeItem("luxuryCart")
      localStorage.removeItem("cart")
    }
  } else {
    console.log("No cart found in localStorage, starting with empty cart")
  }
}

function saveCart() {
  // Save to both keys for compatibility with header
  localStorage.setItem("luxuryCart", JSON.stringify(cart))
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Generate unique product ID based on name and price
function generateProductId(name, price) {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${String(price).replace(/[^0-9]/g, '')}`
}

function addToCart(nameOrProduct, price, image, quantity = 1) {
  let product
  
  // Support both object and string arguments
  if (typeof nameOrProduct === 'object') {
    product = nameOrProduct
  } else {
    // Ensure price is a number
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price
    
    // Generate ID if not provided
    const productId = generateProductId(nameOrProduct, numPrice)
    product = {
      id: productId,
      name: nameOrProduct,
      price: numPrice,
      image: image,
      quantity: Math.max(1, parseInt(quantity) || 1)
    }
  }

  // Ensure quantity is valid
  if (!product.quantity || product.quantity < 1) {
    product.quantity = 1
  }

  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += product.quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: product.quantity,
    })
  }

  saveCart()
  
  // Update UI
  updateCartUI()
  
  // ALSO force update the badge immediately in case updateCartUI didn't catch it
  updateCartBadgeOnly()

  const quantityText = product.quantity > 1 ? `${product.quantity} items` : 'Item'
  if (typeof window.showNotification === "function") {
    window.showNotification(`${quantityText} added to cart!`, "success")
  }
}

// New function: Only update the cart badge, nothing else
function updateCartBadgeOnly() {
  const cartCount = document.getElementById("cartCount")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
    cartCount.textContent = totalItems
    cartCount.style.display = "flex"
    console.log(`Badge updated: ${totalItems}`)
  } else {
    // If badge doesn't exist yet, try again in 100ms
    setTimeout(updateCartBadgeOnly, 100)
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  updateCartUI()
  updateCartBadgeOnly()
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      saveCart()
      updateCartUI()
      updateCartBadgeOnly()
    }
  }
}

function updateCartUI() {
  // Always fresh query for cart count element
  const cartCount = document.getElementById("cartCount")
  const cartEmpty = document.getElementById("cartEmpty")
  const cartContent = document.getElementById("cartContent")
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
  
  console.log(`updateCartUI called: cart has ${cart.length} items, total quantity: ${totalItems}`)

  // Update cart count badge - ALWAYS update even if element might not exist yet
  if (cartCount) {
    cartCount.textContent = totalItems
    cartCount.style.display = "flex"
    console.log(`Updated cartCount to: ${totalItems}`)
  } else {
    console.log(`WARNING: cartCount element not found, will retry`)
    // Retry in a moment if element doesn't exist
    setTimeout(updateCartUI, 200)
    return
  }

  // Show empty or filled cart
  if (cartEmpty && cartContent && cartItems) {
    if (cart.length === 0) {
      cartEmpty.style.display = "flex"
      cartContent.style.display = "none"
    } else {
      cartEmpty.style.display = "none"
      cartContent.style.display = "block"

      cartItems.innerHTML = cart
        .map(
          (item) => {
            const safeId = item.id.replace(/'/g, "\\'");
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity('${safeId}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${safeId}', 1)">+</button>
                            <button class="cart-item-remove" onclick="removeFromCart('${safeId}')">&times;</button>
                        </div>
                    </div>
                </div>
            `;
          }
        )
        .join("")
    }
  }

  // Update total
  if (cartTotal) {
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0)
    cartTotal.textContent = `$${total.toFixed(2)}`
  }

  // Update cart footer buttons dynamically
  const cartFooter = document.querySelector(".cart-footer");
  if (cartFooter) {
    // Remove existing buttons
    cartFooter.querySelectorAll("button").forEach(btn => btn.remove());
    
    if (cart.length > 0) {
      cartFooter.insertAdjacentHTML('beforeend', '<button class="cart-checkout-btn" onclick="proceedToCheckout()" style="width:100%;padding:14px;background:#fff;color:#000;border:none;border-radius:6px;font-weight:600;font-size:1rem;cursor:pointer;margin-top:10px;transition:all 0.3s ease;">Proceed to Checkout</button>');
    } else {
      cartFooter.insertAdjacentHTML('beforeend', '<button class="cart-continue-btn" onclick="closeCart()" style="width:100%;padding:14px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;font-weight:600;font-size:1rem;cursor:pointer;margin-top:10px;transition:all 0.3s ease;">Continue Shopping</button>');
    }
  }
}

function clearCart() {
  cart = []
  saveCart()
  updateCartUI()
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before checking out.");
    return;
  }
  
  const btn = document.querySelector('.cart-checkout-btn');
  if(btn) btn.innerHTML = 'Syncing...';
  
  const formData = new FormData();
  formData.append('action', 'sync_js_cart');
  formData.append('cart_data', JSON.stringify(cart));
  
  window.location.href = '/checkout/';
}

// Auto-open cart if requested via URL
if (window.location.search.includes('open_cart=1')) {
    setTimeout(() => {
        if (typeof toggleCart === 'function') toggleCart();
    }, 500);
}

window.addToCart = addToCart
window.removeFromCart = removeFromCart
window.updateQuantity = updateQuantity
window.clearCart = clearCart
window.proceedToCheckout = proceedToCheckout

// Debug function to clear corrupted cart data
window.resetCart = function() {
  localStorage.removeItem("luxuryCart")
  cart = []
  updateCartUI()
  console.log("Cart reset and localStorage cleared")
}

// Debug function to check cart status
window.checkCart = function() {
  console.log("=== CART DEBUG INFO ===")
  console.log("Cart items:", cart)
  console.log("Total items in cart:", cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0))
  console.log("Cart from localStorage:", localStorage.getItem("luxuryCart"))
  const cartCountElement = document.getElementById("cartCount")
  console.log("Cart badge element:", cartCountElement)
  console.log("Cart badge text:", cartCountElement ? cartCountElement.textContent : "NOT FOUND")
  console.log("Header element:", document.querySelector("header"))
  return {
    cartItems: cart,
    totalQuantity: cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0),
    badgeText: cartCountElement ? cartCountElement.textContent : "NOT FOUND"
  }
}

// Force update cart badge immediately when this script loads
setTimeout(() => {
  const cartCount = document.getElementById("cartCount")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
    cartCount.textContent = totalItems
    cartCount.style.display = "flex"
    console.log("Cart badge updated on script load:", totalItems)
  }
}, 300)

// Watch for header being injected and update badge when it appears
const cartMutationObserver = new MutationObserver(() => {
  const cartCount = document.getElementById("cartCount")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
    cartCount.textContent = totalItems
    cartCount.style.display = "flex"
    console.log("Header detected, badge updated to:", totalItems)
    // Stop observing once header is found
    cartMutationObserver.disconnect()
  }
})

cartMutationObserver.observe(document.body, { childList: true, subtree: true })

// Stop observing after 5 seconds to avoid performance issues
setTimeout(() => {
  cartMutationObserver.disconnect()
  console.log("Stopped watching for header injection")
}, 5000)
