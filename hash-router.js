// Hash-based router for single-page app navigation
// Handles routes like #vip, #admin, #profile

(function() {
    const hashRoutes = {
        '#vip': '/dashboard.html',
        '#admin': '/admin.html',
        '#profile': '/users.html',
        '#dashboard': '/dashboard.html'
    };

    function loadHashRoute() {
        const hash = window.location.hash;
        const routePath = hashRoutes[hash];

        if (routePath) {
            // Load the corresponding page
            fetch(routePath)
                .then(response => {
                    if (!response.ok) throw new Error('Not found');
                    return response.text();
                })
                .then(html => {
                    // Replace entire page content
                    document.documentElement.innerHTML = html;
                    // Scroll to top
                    window.scrollTo(0, 0);
                })
                .catch(error => {
                    console.error('Hash route failed:', error);
                });
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', loadHashRoute);

    // Check for hash on page load
    window.addEventListener('load', function() {
        if (window.location.hash) {
            loadHashRoute();
        }
    });

    // Also check immediately if hash exists
    if (window.location.hash) {
        loadHashRoute();
    }
})();
