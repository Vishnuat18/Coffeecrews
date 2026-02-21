(function () {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 900;
    const isAppPath = window.location.pathname.includes('/app/');

    if (isMobile && !isAppPath) {
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
            'login.html': 'app/login.html',
            'verify.html': 'app/workspace.html',
            'crew.html': 'app/crew.html',
            'apply.html': 'app/apply.html'
        };

        if (map[page]) {
            window.location.href = "/" + map[page];
        }
    }
})();
