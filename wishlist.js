// Wishlist functionality for KURAJ FASHION
(function() {
  let wishlist = [];

  function loadWishlist() {
    try {
      const saved = localStorage.getItem('kurajWishlist');
      wishlist = saved ? JSON.parse(saved) : [];
    } catch(e) { wishlist = []; }
  }

  function saveWishlist() {
    localStorage.setItem('kurajWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
  }

  function updateWishlistBadge() {
    const badge = document.getElementById('wishlistCount');
    if (badge) {
      badge.textContent = wishlist.length;
      badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  window.addToWishlist = function(name, price, image) {
    loadWishlist();
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (!wishlist.find(i => i.id === id)) {
      wishlist.push({ id, name, price, image });
      saveWishlist();
      if (window.showNotification) showNotification(name + ' added to wishlist!', 'success');
    } else {
      if (window.showNotification) showNotification(name + ' is already in your wishlist.', 'info');
    }
  };

  window.removeFromWishlist = function(id) {
    loadWishlist();
    wishlist = wishlist.filter(i => i.id !== id);
    saveWishlist();
  };

  window.getWishlist = function() { return wishlist; };

  // Init
  loadWishlist();
  document.addEventListener('DOMContentLoaded', updateWishlistBadge);
})();
