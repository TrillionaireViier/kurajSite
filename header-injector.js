// Inject shared header into all pages

window.loadHeader = function() {
    // Prevent multiple injections
    if (document.getElementById('mainHeader')) return;

    const headerHTML = `
    <header class="header" id="mainHeader">
<div class="top-announcement-bar" style="background: #000; color: #fff; text-align: center; padding: 4px 15px; font-size: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.2); width: 100%; z-index: 1000; position: relative;">
    <span class="banner-text"> Join Our Exclusive Club | Get Up to 90% Off Luxury Items &amp; VIP Benefits</span>
    <a href="/dashboard?tab=login" style="color: #fff; text-decoration: underline; margin-left: 15px; font-weight: bold; white-space: nowrap;">Sign In to Account</a>
    <span style="color: #fff; margin: 0 4px;">or</span>
    <a href="/dashboard?tab=register" style="color: #fff; text-decoration: underline; font-weight: bold; white-space: nowrap;">Sign Up</a>
</div>

<nav class="navbar">
<div class="nav-container">
<div class="nav-logo">
<a class="brand-text" href="/">KURAJ FASHION</a>
</div>
<ul class="nav-menu" id="navMenu">
<li class="nav-item"><a class="nav-link" href="/about">About Us</a></li>
<li class="nav-item dropdown">
<a class="nav-link dropdown-toggle" href="javascript:void(0)">Our Collections</a>
<ul class="dropdown-menu">
<li class="dropdown-submenu">
<a class="dropdown-item" href="/collections/watches">Watches ›</a>
<ul class="dropdown-menu">
<li><a href="/collections/mens-watches">For Him</a></li>
<li><a href="/collections/womens-watches">For Her</a></li>
</ul>
</li>
<li class="dropdown-submenu">
<a class="dropdown-item" href="/collections/jewelry">Jewelry ›</a>
<ul class="dropdown-menu">
<li><a href="/collections/mens-jewelry">For Him</a></li>
<li><a href="/collections/womens-jewelry">For Her</a></li>
</ul>
</li>
<li class="dropdown-submenu">
<a class="dropdown-item" href="/collections/handbags">Handbags ›</a>
<ul class="dropdown-menu">
<li><a href="/collections/mens-bags">For Him</a></li>
<li><a href="/collections/womens-handbags">For Her</a></li>
</ul>
</li>
<li class="dropdown-submenu">
<a class="dropdown-item" href="/collections/accessories">Accessories ›</a>
<ul class="dropdown-menu">
<li><a href="/collections/mens-accessories">For Him</a></li>
<li><a href="/collections/womens-accessories">For Her</a></li>
</ul>
</li>
<li class="dropdown-submenu">
<a class="dropdown-item" href="/collections/clothing">Clothing ›</a>
<ul class="dropdown-menu">
<li><a href="/collections/mens-apparel">For Him</a></li>
<li><a href="/collections/womens-apparel">For Her</a></li>
</ul>
</li>
<li class="dropdown-submenu">
<a class="dropdown-item" href="/collections/gifts">Gifts ›</a>
<ul class="dropdown-menu">
<li><a href="/collections/mens-gifts">For Him</a></li>
<li><a href="/collections/womens-gifts">For Her</a></li>
</ul>
</li>
<li><a class="dropdown-item" href="/collections/limited-drops">Limited Drops</a></li>
<li><a class="dropdown-item" href="/all-products" style="font-weight: bold; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; margin-top: 5px;">All Products</a></li>
</ul>
</li>
<li class="nav-item dropdown">
<a class="nav-link dropdown-toggle" href="/all-products">For Her / For Him</a>
<ul class="dropdown-menu">
<li class="dropdown-submenu">
<a class="dropdown-item" href="/for-her">For Her ›</a>
<ul class="dropdown-menu">
<li><a href="/collections/womens-watches">Watches</a></li>
<li><a href="/collections/womens-jewelry">Jewelry</a></li>
<li><a href="/collections/womens-handbags">Handbags</a></li>
<li><a href="/collections/womens-accessories">Accessories</a></li>
<li><a href="/collections/womens-apparel">Apparel</a></li>
<li><a href="/collections/womens-gifts">Gifts</a></li>
</ul>
</li>
<li class="dropdown-submenu">
<a class="dropdown-item" href="/for-him">For Him ›</a>
<ul class="dropdown-menu">
<li><a href="/collections/mens-watches">Watches</a></li>
<li><a href="/collections/mens-jewelry">Jewelry</a></li>
<li><a href="/collections/mens-bags">Bags</a></li>
<li><a href="/collections/mens-accessories">Accessories</a></li>
<li><a href="/collections/mens-apparel">Apparel</a></li>
<li><a href="/collections/mens-gifts">Gifts</a></li>
</ul>
</li>
</ul>
</li>
<li class="nav-item"><a class="nav-link" href="/dashboard">Membership</a></li>
<li class="nav-item"><a class="nav-link" href="/contact">Contact Us</a></li>
</ul>
<div class="nav-actions">

<div class="wishlist-icon-container" onclick="window.toggleWishlist()" title="Wishlist">
<svg class="wishlist-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
<span class="wishlist-badge" id="wishlistCount">0</span>
</div>
<div class="cart-icon-container" onclick="toggleCart()" title="Shopping Cart">
<svg class="cart-icon" fill="none" height="24" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
<span class="cart-badge" id="cartCount">0</span>
</div>
<a class="nav-auth-btn sign-in" href="/dashboard" id="profileBtn" style="display:none;">My Account</a>
<a class="nav-auth-btn sign-in" href="/dashboard?tab=login" id="signInBtn">Sign In</a>
<a class="nav-auth-btn sign-up" href="/dashboard?tab=register" id="signUpBtn">Sign Up</a>
</div>
<div class="nav-toggle" id="mobile-menu" onclick="window.toggleMobileMenu(event)">
<span class="bar"></span><span class="bar"></span><span class="bar"></span>
</div>
</div>
</nav>
</header>
    `;
    
    // Ultra-robust header replacement
    // First, remove ALL existing headers to prevent duplicates or merges
    const existingHeaders = document.querySelectorAll('header.header, #mainHeader');
    existingHeaders.forEach(h => h.remove());
    
    // Now safely insert the new header
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Update auth buttons based on login status
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
        try {
            const user = JSON.parse(currentUserStr);
            const signInBtn = document.getElementById('signInBtn');
            const signUpBtn = document.getElementById('signUpBtn');
            if (signInBtn && signUpBtn) {
                // Change "Sign In" to "Dashboard"
                signInBtn.textContent = 'Dashboard';
                signInBtn.href = '/dashboard';
                
                // Change "Sign Up" to "Logout"
                signUpBtn.textContent = 'Logout';
                signUpBtn.href = '#';
                signUpBtn.style.backgroundColor = 'transparent';
                signUpBtn.style.color = '#ff6464';
                signUpBtn.style.border = '1px solid #ff6464';
                signUpBtn.onclick = function(e) {
                    e.preventDefault();
                    if (window.showConfirm) {
                        window.showConfirm('Are you sure you want to logout?', () => {
                            localStorage.removeItem('currentUser');
                            window.location.href = '/';
                        });
                    } else {
                        if (confirm('Are you sure you want to logout?')) {
                            localStorage.removeItem('currentUser');
                            window.location.href = '/';
                        }
                    }
                };
            }
            
            // Update top banner text if logged in
            const bannerText = document.querySelector('.top-announcement-bar .banner-text');
            const bannerLink = document.querySelector('.top-announcement-bar a');
            if (bannerText && bannerLink) {
                bannerText.textContent = 'Welcome back, ' + (user.name || 'VIP Member') + '! ';
                bannerLink.textContent = 'Go to Dashboard';
                bannerLink.href = '/dashboard';
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }


    // Always inject fresh sidebars, cleaning up old hardcoded ones
    ['cartSidebar', 'cartOverlay', 'wishlistSidebar', 'wishlistOverlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });


// --- Cleanup existing hardcoded sidebars to prevent ID conflicts ---
['cartSidebar', 'cartOverlay', 'wishlistSidebar', 'wishlistOverlay'].forEach(id => {
    const els = document.querySelectorAll('#' + id);
    els.forEach(el => el.remove());
});

const sidebarsHTML = `
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
<div class="cart-sidebar" id="cartSidebar">
    <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="cart-close" onclick="closeCart()">×</button>
    </div>
    <div class="cart-body">
        <div class="cart-empty" id="cartEmpty">
            <div class="cart-empty-icon">◇</div>
            <p>Your cart is empty</p>
            <button class="cta-button" onclick="closeCart()">Continue Shopping</button>
        </div>
        <div class="cart-content" id="cartContent" style="display:none;">
            <div class="cart-items" id="cartItems"></div>
        </div>
    </div>
    <div class="cart-footer">
        <div class="cart-total">
            <span class="cart-total-label">Total:</span>
            <span class="cart-total-amount" id="cartTotal">$0.00</span>
        </div>
        <button class="cart-continue" onclick="proceedToCheckout()" style="width:100%;padding:14px;background:#fff;color:#000;border:none;border-radius:6px;font-weight:600;font-size:1rem;cursor:pointer;margin-top:10px;">Proceed to Checkout</button>
        <div style="display:flex; gap:10px; margin-top:10px;">
            <button onclick="if(window.quickPay) window.quickPay('apple'); else alert('Quick pay initializing...');" style="flex:1; padding:12px; background:#000; color:#fff; border:1px solid #333; border-radius:6px; font-weight:600; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                <svg width="18" height="18" viewBox="0 0 384 512" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg> Pay
            </button>
            <button onclick="if(window.quickPay) window.quickPay('google'); else alert('Quick pay initializing...');" style="flex:1; padding:12px; background:#fff; color:#000; border:1px solid #ddd; border-radius:6px; font-weight:600; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M43.6 20H24v8.5h11.8C34 33 29.8 36 24 36c-7.4 0-13.6-5.8-13.6-13s6.2-13 13.6-13c3.4 0 6.5 1.3 8.9 3.4l6.4-6.4C35.2 3.1 29.9 1 24 1 11.3 1 1 11.3 1 24s10.3 23 23 23c12 0 21.6-9.6 21.6-21.6 0-1.8-.3-3.7-.8-5.4z"/><path fill="#34A853" d="M24 47c11.6 0 21-9.2 21.6-20.7h-11.6c-.9 3.5-3.8 6.4-7.5 7.4v9.6C35.6 41 41 33.7 41 24h6c0 12.7-10.3 23-23 23z"/><path fill="#FBBC05" d="M10.4 33c-.7-1.8-1.2-3.8-1.2-5.8s.4-3.9 1.2-5.8v-9.6C6.6 15.6 4.3 19.6 4.3 24s2.3 8.4 6.1 12.2L10.4 33z"/><path fill="#EA4335" d="M24 8.5c3.5 0 6.6 1.4 9.1 3.5l6.4-6.4C35.2 1.6 29.9-.5 24-.5 13.2-.5 4.3 6.6.6 16.2l9.8 9.6C12.4 17.5 17.7 12 24 12v-3.5z"/></svg> Pay
            </button>
        </div>
    </div>
</div>

<div class="wishlist-overlay" id="wishlistOverlay" onclick="closeWishlistSidebar()"></div>
<div class="wishlist-sidebar" id="wishlistSidebar">
    <div class="wishlist-header">
        <h2>Your Wishlist</h2>
        <button class="wishlist-close" onclick="closeWishlistSidebar()">×</button>
    </div>
    <div class="wishlist-body">
        <div class="wishlist-empty" id="wishlistEmpty">
            <div class="wishlist-empty-icon">♡</div>
            <p>Your wishlist is empty</p>
            <button class="cta-button" onclick="closeWishlistSidebar()">Discover Products</button>
        </div>
        <div class="wishlist-content" id="wishlistContent" style="display:none;">
            <div class="wishlist-items" id="wishlistItems"></div>
        </div>
    </div>
</div>
        `;
        document.body.insertAdjacentHTML('beforeend', sidebarsHTML);
        // Force cart-sync to re-render now that sidebars exist
        if (typeof renderCart === 'function') renderCart();
        if (typeof renderWishlist === 'function') renderWishlist();

}; // Close window.loadHeader

// Dynamic header offset adjustment to prevent any fixed-header overlap
window.adjustHeaderOffset = function() {
    const header = document.getElementById('mainHeader') || document.querySelector('.header');
    if (header) {
        document.body.style.paddingTop = header.offsetHeight + 'px';
    }
};
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.adjustHeaderOffset);
} else {
    window.adjustHeaderOffset();
}
window.addEventListener('resize', window.adjustHeaderOffset);
window.addEventListener('load', window.adjustHeaderOffset);
setTimeout(window.adjustHeaderOffset, 150);

// Execute immediately if DOM is ready, else wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadHeader);
} else {
    window.loadHeader();
}

// Toggle mobile menu without darkening overlay
window.__lastHeaderToggle = window.__lastHeaderToggle || 0;
window.toggleMobileMenu = function(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const now = Date.now();
    if (now - window.__lastHeaderToggle < 250) return;
    window.__lastHeaderToggle = now;
    const navMenu = document.getElementById('navMenu');
    const mobileMenu = document.getElementById('mobile-menu');
    const isActive = navMenu && navMenu.classList.toggle('active');
    if (mobileMenu) mobileMenu.classList.toggle('active', isActive);
};

// Dropdown click handlers for mobile
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 900) {
        const dropdownToggle = e.target.closest('.dropdown > .dropdown-toggle');
        if (dropdownToggle) {
            e.preventDefault();
            const parent = dropdownToggle.closest('.dropdown');
            if (parent) parent.classList.toggle('active');
            return;
        }
        const submenuToggle = e.target.closest('.dropdown-submenu > a');
        if (submenuToggle && submenuToggle.textContent.includes('›')) {
            e.preventDefault();
            const parent = submenuToggle.closest('.dropdown-submenu');
            if (parent) parent.classList.toggle('active');
            return;
        }
    }
    const navMenu = document.getElementById('navMenu');
    const mobileMenu = document.getElementById('mobile-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && (!mobileMenu || !mobileMenu.contains(e.target))) {
            navMenu.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            const overlay = document.getElementById('mobileMenuOverlay');
            if (overlay) overlay.style.display = "none";
        }
    }
});

// Inject Favicon if not present
if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = '/favicon.svg';
    document.head.appendChild(favicon);
}
