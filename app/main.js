/**
 * CoffeeCrews Mobile App - Main Logic
 */

window.App = {
    init: function () {
        this.checkDevice();
        this.setupTransitions();
        this.handleDeepLinks();
    },

    checkDevice: function () {
        // Simple mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 900;
        const isAppPath = window.location.pathname.includes('/app/');

        // If on a desktop page but is mobile, redirect to /app (if not already there)
        if (isMobile && !isAppPath) {
            const page = window.location.pathname.split('/').pop() || 'index.html';
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
                const target = map[page].startsWith('app/') ? map[page] : 'app/' + map[page];
                console.log("Mobile device detected. Funneling to App experience...");
                // Check if we are in a subdirectory (like /admin/id-card/)
                const depth = window.location.pathname.split('/').length - (window.location.pathname.endsWith('/') ? 1 : 2);
                let prefix = "";
                for (let i = 0; i < depth; i++) prefix += "../";
                window.location.href = prefix + map[page];
            }
        }
    },

    setupTransitions: function () {
        // Shared entrance animations for app cards
        gsap.utils.toArray('.glass').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 95%',
                },
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: i * 0.05,
                ease: 'power2.out'
            });
        });
    },

    handleDeepLinks: function () {
        // Handle tab switching in workspace from outside
        if (location.hash === '#chats' && window.nav) {
            window.nav('chats');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => window.App.init());
