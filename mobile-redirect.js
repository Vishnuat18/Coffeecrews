(function () {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 900;
    const pathname = window.location.pathname.toLowerCase();
    const isAppPath = pathname.includes('/app/');

    if (isMobile && !isAppPath) {
        // Normalize: Get the last part of the path, removing trailing slashes
        let page = pathname.split('/').filter(Boolean).pop() || 'index.html';

        // If it doesn't have an extension, assume .html for mapping purposes
        if (!page.includes('.')) {
            page += '.html';
        }

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

        if (map[page]) {
            // Use root-relative path for redirection
            window.location.href = '/' + map[page];
        }
    }
})();
