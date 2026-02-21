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

        // --- NEW: Parameter Hijacking Protection ---
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');

        if (urlId && urlId.toLowerCase() !== (session.id || '').toLowerCase()) {
            // Permission check: only 'admin' role can view other IDs on specific management pages
            const isManagementPage =
                window.location.pathname.includes('/admin/id-card/edit.html') ||
                window.location.pathname.includes('/admin/id-card/display.html');

            const isAuthorized = session.role === 'admin' && isManagementPage;

            if (!isAuthorized) {
                console.error("Session integrity violation: Identity mismatch.");
                // Boot to login for re-authentication
                window.location.href = `/admin/id-card/login.html?error=integrity_violation&id=${urlId}`;
                return;
            }
        }

        // Specific page role requirements
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

window.handleLogout = async function () {
    if (await tacticalConfirm("TERMINATE SECURE SESSION?", "LOGOUT SEQUENCE")) {
        sessionStorage.removeItem('cc_session');
        // Clear localStorage version just in case of old data
        localStorage.removeItem('cc_session');
        window.location.href = '/admin/id-card/login.html';
    }
};
