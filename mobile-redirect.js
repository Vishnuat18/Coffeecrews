(function () {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 900;
    const isAppPath = window.location.pathname.includes('/app/');

    if (isMobile && !isAppPath) {
        const pathParts = window.location.pathname.split('/');
        const page = (pathParts.pop() || 'index.html').toLowerCase();
        const cleanPage = page.endsWith('.html') ? page : page + '.html';

        const map = {
            'index.html': 'app/home.html',
            'about.html': 'app/about.html',
            'products.html': 'app/portfolio.html',
            'projects.html': 'app/portfolio.html',
            'services.html': 'app/services.html',
            'careers.html': 'app/services.html',
            'contact.html': 'app/contact.html',
            'login.html': 'app/login.html',
            'verify.html': 'app/workspace.html',
            'crew.html': 'app/crew.html',
            'apply.html': 'app/apply.html'
        };

        if (map[cleanPage]) {
            // Calculate depth to find root
            const depth = pathParts.length - (window.location.host === "" ? 0 : 0); // Simplified for local dev
            // Actually, since it's a relative path to the root, we can just use the map directly if we know where we are.
            // But a more robust way is to just find the 'app' folder relative to current.

            let prefix = "";
            if (window.location.pathname.includes('/admin/id-card/')) prefix = "../../";
            else if (window.location.pathname.includes('/admin/')) prefix = "../";

            window.location.href = prefix + map[page] + window.location.search;
        }
    }
})();
