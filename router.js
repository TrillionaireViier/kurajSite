// Simple client-side router to handle clean URLs without .html extensions

(function() {
    // Map of clean URLs to actual file paths
    const routes = {
        '/kuraj': '/index_static.html',
        '/': '/index_static.html',
        '/checkout': '/checkout.html',
        '/cart': '/cart/cart.html',
        '/shop': '/shop.html',
        '/for-her': '/for-her.html',
        '/for-him': '/for-him.html',
        '/about': '/about.html',
        '/contact': '/contact.html',
        '/all-products': '/all-products.html',
        '/admin': '/admin.html',
        '/profile': '/users.html',
        '/vip': '/dashboard.html',
        '/dashboard': '/dashboard.html',
        '/collections/timepieces': '/collections/timepieces.html',
        '/collections/jewelry': '/collections/jewelry.html',
        '/collections/handbags': '/collections/handbags.html',
        '/collections/accessories': '/collections/accessories.html',
        '/collections/clothing': '/collections/clothing.html',
        '/collections/home-decor': '/collections/home-decor.html',
        '/collections/gifts': '/collections/gifts.html',
        '/collections/limited-drops': '/collections/limited-drops.html',
        '/collections/womens-watches': '/collections/womens-watches.html',
        '/product-category/womens-watches': '/collections/womens-watches.html',
        '/product-category/womens-watches/': '/collections/womens-watches.html'
    };

    // Intercept all link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href]');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Only handle internal navigation (no protocol, not external)
        if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('mailto') && !href.startsWith('tel')) {
            // Extract the path without query params or hash
            const path = href.split('?')[0].split('#')[0];
            const hash = href.includes('#') ? href.substring(href.indexOf('#')) : '';
            
            // If it has a hash or if the path is empty (e.g., just query params), let the browser handle it natively
            if (hash || !path) {
                return;
            }
            
            // If it's a mapped route OR a dynamic WordPress route OR a collection route
            if (routes[path] || path.includes('/legal/') || path.includes('/contact') || path.includes('/about') || path.includes('/collections/')) {
                e.preventDefault();
                const search = href.includes('?') ? href.substring(href.indexOf('?')).split('#')[0] : '';
                window.history.pushState({ path }, '', path + search);
                navigateTo(path);
            } else if (path.endsWith('.html') && routes[path.replace('.html', '')]) {
                // If someone clicks a link with .html, redirect to clean URL
                e.preventDefault();
                const cleanPath = path.replace('.html', '');
                const search = href.includes('?') ? href.substring(href.indexOf('?')).split('#')[0] : '';
                window.history.pushState({ path: cleanPath }, '', cleanPath + search);
                navigateTo(cleanPath);
            }
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        const path = e.state?.path || window.location.pathname;
        navigateTo(path);
    });

    // Navigate to a path
    function navigateTo(path) {
        let filePath = routes[path];
        
        // Dynamic route handling for WordPress pages
        if (!filePath) {
            // Remove .html if it exists for WP lookups
            const cleanPath = path.replace(/\.html$/, '');
            if (cleanPath.includes('/legal/')) {
                // Fetch via query param to avoid WP canonical redirects and MAMP rewrite bugs
                filePath = '/?pagename=' + cleanPath.replace('/legal/', '');
            } else if (cleanPath.includes('/contact')) {
                filePath = '/?pagename=contact';
            } else if (cleanPath.includes('/about')) {
                filePath = '/?pagename=about';
            }
        }
        
        if (!filePath) {
            // Fallback: try adding .html unless it ends with a slash or is empty
            if (path && !path.endsWith('/')) {
                window.location.href = path + '.html';
            } else {
                window.location.href = path || window.location.pathname;
            }
            return;
        }

        // Add cache-busting timestamp to prevent serving cached HTML in development
        const cacheBustPath = filePath + (filePath.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
        fetch(cacheBustPath)
            .then(response => {
                if (!response.ok) throw new Error('Not found');
                return response.text();
            })
            .then(html => {
                // Replace page content
                document.documentElement.innerHTML = html;
                
                // Ensure base tag exists for correct relative path resolution
                let baseTag = document.querySelector('base');
                if (!baseTag) {
                    baseTag = document.createElement('base');
                    baseTag.href = '/';
                    document.head.insertBefore(baseTag, document.head.firstChild);
                } else {
                    baseTag.href = '/';
                }
                
                // Execute all scripts in the new content
                const scripts = document.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    // Skip router.js and hash-router.js to prevent infinite loops
                    if (oldScript.src && (oldScript.src.includes('router.js') || oldScript.src.includes('hash-router.js') || oldScript.src.includes('header-loader.js') || oldScript.src.includes('footer-injector.js'))) {
                        return;
                    }
                    const newScript = document.createElement('script');
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
                
                // Scroll to top
                window.scrollTo(0, 0);
                // Re-inject header and footer after content is loaded
                setTimeout(() => {
                    // Re-inject header
                    if (typeof loadHeader === 'function') {
                        loadHeader();
                    }
                    // Re-inject footer
                    if (typeof loadFooter === 'function') {
                        loadFooter();
                    }
                    // Re-attach router to new content
                    initRouter();
                }, 100);
            })
            .catch(error => {
                console.error('Navigation failed:', error);
                // Fallback to normal load
                if (path && !path.endsWith('.html') && !path.endsWith('/')) {
                    window.location.href = path + '.html';
                } else {
                    window.location.href = path || window.location.pathname;
                }
            });
    }

    // Handle initial load
    const currentPath = window.location.pathname;
    
    // If we loaded a .html URL, clean it up
    if (currentPath.endsWith('.html')) {
        const cleanPath = currentPath.replace('.html', '');
        const search = window.location.search;
        window.history.replaceState({ path: cleanPath }, '', cleanPath + search);
    } else if (currentPath !== '/' && currentPath !== '/kuraj') {
        // If we landed on a clean URL (e.g. /collections/timepieces) directly, 
        // WordPress served index.php (the homepage). We need to fetch the actual page content.
        let isKnownRoute = false;
        
        // Check if it's a known route
        if (routes[currentPath] || routes[currentPath.replace(/\/$/, '')]) {
            isKnownRoute = true;
        } else if (currentPath.includes('/legal/') || currentPath.includes('/contact') || currentPath.includes('/about')) {
            isKnownRoute = true;
        }
        
        if (isKnownRoute) {
            // Wait for DOM to be ready, then navigate
            if (document.readyState === 'loading') {
                window.addEventListener('DOMContentLoaded', () => {
                    navigateTo(currentPath);
                });
            } else {
                navigateTo(currentPath);
            }
        }
    }

    // Initialize router on page load
    function initRouter() {
        // Re-attach click handlers for new links
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                const path = href.split('?')[0].split('#')[0];
                
                if (routes[path] || path.includes('/legal/') || path.includes('/contact') || path.includes('/about')) {
                    e.preventDefault();
                    window.history.pushState({ path }, '', path);
                    navigateTo(path);
                }
            }
        });
    }

    // Initialize on page load
    initRouter();
})();
