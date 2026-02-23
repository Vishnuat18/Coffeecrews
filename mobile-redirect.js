(function () {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 900;
    const isAppPath = window.location.pathname.includes('/app/');
    // Admin area always uses the real workspace — never redirect to the app version
    const isAdminPath = window.location.pathname.includes('/admin/');

    if (isMobile && !isAppPath && !isAdminPath) {
        const pathParts = window.location.pathname.split('/');
        const page = pathParts.pop() || 'index.html';
        const map = {
            'index.html': 'app/home.html',
            'about.html': 'app/about.html',
            'products.html': 'app/portfolio.html',
            'projects.html': 'app/portfolio.html',
            'services.html': 'app/services.html',
            'careers.html': 'app/services.html',
            'contact.html': 'app/contact.html',
            'crew.html': 'app/crew.html',
            'apply.html': 'app/apply.html'
            // NOTE: login.html and verify.html are intentionally excluded —
            // the admin workspace uses the same Firebase endpoints on all devices.
        };

        if (map[page]) {
            let prefix = "";
            window.location.href = prefix + map[page];
        }
    }
})();
