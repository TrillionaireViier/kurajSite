
// Hash Redirector for old URLs
if (window.location.hash && window.location.hash.startsWith('#')) {
    const hashContent = window.location.hash.substring(1);
    if (hashContent.includes('/') || hashContent === 'collections' || hashContent.startsWith('collections/')) {
        window.location.href = '/' + hashContent;
    }
}

function throttle(func, delay) {
  let timeoutId
  let lastRan
  return function (...args) {
    
    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => {
          if (Date.now() - lastRan >= delay) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        delay - (Date.now() - lastRan),
      )
    }
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

function scrollToInvitation() {
  const target = document.querySelector("#contact")
  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Form submission handling
const invitationForm = document.getElementById("invitationForm")
if (invitationForm) {
  invitationForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const formData = new FormData(this)
    const formObject = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      membershipType: formData.get("membershipType"),
      country: formData.get("country"),
      promoCode: formData.get("promoCode"),
      referralSource: formData.get("referralSource"),
      interests: formData.getAll("interests"),
      message: formData.get("message"),
      newsletter: formData.get("newsletter") === "yes",
    }

    console.log("[v0] Form submission data:", formObject)

    let successMessage = "Thank you for your interest! We will review your application and get back to you soon."

    if (formObject.promoCode) {
      successMessage = `Thank you! Your promo code "${formObject.promoCode}" has been applied. We'll review your VIP application and contact you within 24 hours.`
    }

    // Show success message
    showNotification(successMessage, "success")

    // Reset form
    this.reset()
  })
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content" style="display: flex; justify-content: space-between; align-items: center; gap: 15px;">
            <span style="font-weight: 500;">${message}</span>
            <button class="notification-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #000000; padding: 0; line-height: 1;">&times;</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ffffff;
        color: #000000;
        border: 1px solid #000000;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      notification.style.animation = "slideOut 0.3s ease"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    })
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }
  }, 5000)
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`
document.head.appendChild(style)

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const scrollAnimationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".collection-item, .craft-item, .earn-item, .vip-benefit, .testimonial",
  )

  animateElements.forEach((el) => {
    // Disabled fade-in animation to fix elements hiding when scrolling
    // el.style.opacity = "0"
    // el.style.transform = "translateY(30px)"
    // el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    // scrollAnimationObserver.observe(el)
  })
})

// Badge rotation animation
// document.addEventListener("DOMContentLoaded", () => {
//   const badge = document.querySelector(".badge-circle")
//   if (badge) {
//     let rotation = 0
//     setInterval(() => {
//       rotation += 0.5
//       badge.style.transform = `rotate(${rotation}deg)`
//     }, 50)
//   }
// })

// Parallax effect disabled to prevent hero from sliding down and occluding the featured products on scroll
// const parallaxEffect = throttle(() => {
//   requestAnimationFrame(() => {
//     const scrolled = window.pageYOffset
//     const hero = document.querySelector(".hero")
//     if (hero && scrolled < hero.offsetHeight) {
//       // Only apply parallax when hero is visible
//       hero.style.transform = `translateY(${scrolled * 0.3}px)`
//     }
//   })
// }, 16) // ~60fps

// window.addEventListener("scroll", parallaxEffect, { passive: true })

document.querySelectorAll("button, .cta-button, .vip-button, .view-collection").forEach((button) => {
  button.addEventListener("click", function (e) {
    if (this.querySelector(".ripple-effect")) return

    const ripple = document.createElement("span")
    ripple.className = "ripple-effect"
    const rect = this.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `

    this.style.position = "relative"
    this.style.overflow = "hidden"
    this.appendChild(ripple)

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove()
      }
    }, 600)
  })
})

// Add ripple animation CSS
const rippleStyle = document.createElement("style")
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`
document.head.appendChild(rippleStyle)

// Mobile navigation toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = document.getElementById("mobile-menu")
  const navMenu = document.querySelector(".nav-menu")

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener("click", (e) => {
      e.stopPropagation()
      if (typeof window.toggleMobileMenu === "function") {
        window.toggleMobileMenu(e)
      } else {
        mobileMenu.classList.toggle("active")
        navMenu.classList.toggle("active")
      }
    })

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
        mobileMenu.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })
  }
})

function toggleCart() {
  const overlay = document.getElementById("cartOverlay")
  const sidebar = document.getElementById("cartSidebar")
  if (overlay && sidebar) {
    overlay.classList.add("active")
    sidebar.classList.add("active")
  }
}

function closeCart() {
  const overlay = document.getElementById("cartOverlay")
  const sidebar = document.getElementById("cartSidebar")
  if (overlay && sidebar) {
    overlay.classList.remove("active")
    sidebar.classList.remove("active")
  }
}

function proceedToCheckout() {
  alert("Proceeding to checkout... (This feature is under development)")
}

// Private Club Popup and Banner Functions
function showClubPopup() {
  const popup = document.getElementById("clubPopup")
  const overlay = document.getElementById("clubPopupOverlay")
  const banner = document.getElementById("stickyBanner")
  if (popup && overlay) {
    popup.classList.add("show")
    overlay.classList.add("show")
    // Hide banner when popup is shown
    if (banner) {
      banner.style.display = "none"
    }
  }
}

function closeClubPopup() {
  const popup = document.getElementById("clubPopup")
  const overlay = document.getElementById("clubPopupOverlay")
  const banner = document.getElementById("stickyBanner")
  if (popup && overlay) {
    popup.classList.remove("show")
    overlay.classList.remove("show")
    // Show banner again when popup is closed
    if (banner && banner.classList.contains("show")) {
      banner.style.display = "flex"
    }
  }
}

function showStickyBanner() {
  const banner = document.getElementById("stickyBanner")
  if (banner) {
    banner.classList.add("show")
    banner.style.display = "flex"
  }
}

function closeStickyBanner() {
  const banner = document.getElementById("stickyBanner")
  if (banner) {
    banner.classList.remove("show")
    banner.style.display = "none"
  }
}

// Initialize popup and banner on page load
document.addEventListener("DOMContentLoaded", function() {
  // Show sticky banner immediately
  setTimeout(function() {
    showStickyBanner()
  }, 300)
  
  // Show popup after 2 seconds
  setTimeout(function() {
    showClubPopup()
  }, 2000)
  
  // Auto-close popup after 10 seconds
  setTimeout(function() {
    const popup = document.getElementById("clubPopup")
    const banner = document.getElementById("stickyBanner")
    if (popup && popup.classList.contains("show")) {
      popup.classList.remove("show")
      document.getElementById("clubPopupOverlay").classList.remove("show")
      // Show banner again
      if (banner && banner.classList.contains("show")) {
        banner.style.display = "flex"
      }
    }
  }, 10000)
})

// Add to Cart with Quantity Selector
function openQuantitySelector(productName, productPrice, productImage) {
  const quantity = prompt(`How many "${productName}" would you like to add to your cart?\n\nPrice: $${productPrice}`, "1")
  
  if (quantity !== null && quantity !== "") {
    const qty = parseInt(quantity)
    if (qty > 0) {
      addToCart(productName, productPrice, productImage, qty)
    } else {
      showNotification("Please enter a valid quantity", "error")
    }
  }
}

// Make function available globally
window.openQuantitySelector = openQuantitySelector
window.showNotification = showNotification

// Auto-inject Wishlist Buttons on Product Cards
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (addToCartBtn && !card.querySelector('.wishlist-product-card-btn')) {
      const wishlistBtn = document.createElement('button');
      wishlistBtn.className = 'wishlist-product-card-btn';
      wishlistBtn.title = 'Add to Wishlist';
      wishlistBtn.innerHTML = '♡';
      wishlistBtn.style.cssText = 'background: transparent; color: var(--primary-color, #fff); border: 1px solid var(--primary-color, #fff); border-radius: 4px; font-size: 1.2rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; width: 45px; flex-shrink: 0;';
      
      wishlistBtn.onmouseover = () => { wishlistBtn.style.background = 'rgba(255, 255, 255, 0.1)'; };
      wishlistBtn.onmouseout = () => { wishlistBtn.style.background = 'transparent'; };

      const onclickAttr = addToCartBtn.getAttribute('onclick');
      if (onclickAttr) {
        const match = onclickAttr.match(/addToCart\s*\(\s*['"](.+?)['"]\s*,\s*['"](.+?)['"]\s*,\s*['"](.+?)['"]/);
        if (match) {
          const title = match[1];
          const price = match[2];
          const img = match[3];
          wishlistBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.addToWishlist) window.addToWishlist(title, price, img);
          };
        } else {
            wishlistBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const title = card.querySelector('.product-title')?.innerText || '';
                const price = card.querySelector('.current-price')?.innerText || '';
                const img = card.querySelector('.product-image img')?.src || '';
                if (window.addToWishlist) window.addToWishlist(title, price, img);
            };
        }
      }

      const parent = addToCartBtn.parentNode;
      if (!parent.classList.contains('product-actions-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'product-actions-wrapper';
        wrapper.style.display = 'flex';
        wrapper.style.gap = '10px';
        wrapper.style.width = '100%';
        wrapper.style.marginTop = '10px';
        
        parent.insertBefore(wrapper, addToCartBtn);
        addToCartBtn.style.flex = '1';
        addToCartBtn.style.margin = '0';
        wrapper.appendChild(addToCartBtn);
        wrapper.appendChild(wishlistBtn);
      } else {
        parent.appendChild(wishlistBtn);
      }
    }
  });
});


// Global view product handler
window.viewProduct = function(title, price, image) {
    if (typeof price === 'number') {
        price = '$' + price.toLocaleString();
    }
    sessionStorage.setItem('currentProductTitle', title);
    sessionStorage.setItem('currentProductPrice', price);
    sessionStorage.setItem('currentProductImage', image);
    
    // Also use URL parameters so the link is shareable and the URL doesn't look identical for all products
    const params = new URLSearchParams();
    params.set('title', title);
    params.set('price', price);
    params.set('image', image);
    
    window.location.href = '/product?' + params.toString();
};