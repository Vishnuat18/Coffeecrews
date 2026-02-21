/**
 * Admin Authentication Guard
 * Enforces session-based authentication across all admin pages.
 */
(function () {
    const session = JSON.parse(sessionStorage.getItem('cc_session') || '{}');
    const isLoginPage = window.location.pathname.endsWith('login.html');

    const validateSession = () => {
        if (!session.timestamp) return false;

        // Session valid for 24 hours (though sessionStorage usually dies on tab close anyway)
        const ONE_DAY = 1000 * 60 * 60 * 24;
        if (Date.now() - session.timestamp > ONE_DAY) {
            sessionStorage.removeItem('cc_session');
            return false;
        }
        return true;
    };

    if (!isLoginPage) {
        if (!validateSession()) {
            console.warn("Unauthorized access detected. Redirecting to login.");
            const currentPath = window.location.pathname;
            const returnTo = new URLSearchParams(window.location.search).get('id') || '';
            window.location.href = `/admin/id-card/login.html?return_to=${encodeURIComponent(currentPath)}&id=${returnTo}`;
            return;
        }

        // Specific page role requirements (optional but recommended)
        if (window.location.pathname.includes('/admin/index.html') ||
            window.location.pathname.includes('/admin/applications.html') ||
            window.location.pathname.includes('/admin/id-card/reports.html')) {
            if (session.role !== 'admin') {
                console.error("Insufficient clearance for this sector.");
                window.location.href = `/admin/id-card/verify.html?id=${session.id}`;
            }
        }
    }
})();

window.handleLogout = function () {
    if (confirm("TERMINATE SECURE SESSION?")) {
        sessionStorage.removeItem('cc_session');
        // Clear localStorage version just in case of old data
        localStorage.removeItem('cc_session');
        window.location.href = '/admin/id-card/login.html';
    }
};
