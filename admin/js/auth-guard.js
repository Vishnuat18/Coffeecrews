/**
 * Admin Authentication Guard
 * Enforces session-based authentication across all admin pages.
 */
(function () {
    const session = JSON.parse(sessionStorage.getItem('cc_session') || '{}');
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html') || path.endsWith('/login') || path.endsWith('/login/');

    const validateSession = () => {
        if (!session.timestamp || !session.id) return false;

        // Session valid for 24 hours
        const ONE_DAY = 1000 * 60 * 60 * 24;
        if (Date.now() - session.timestamp > ONE_DAY) {
            sessionStorage.removeItem('cc_session');
            return false;
        }
        return true;
    };

    if (!isLoginPage) {
        if (!validateSession()) {
            console.warn("[AUTH] Session invalid or missing. Redirecting.");
            const currentPath = window.location.pathname;
            const returnTo = new URLSearchParams(window.location.search).get('id') || '';
            window.location.href = `/admin/id-card/login.html?return_to=${encodeURIComponent(currentPath)}&id=${returnTo}`;
            return;
        }

        // --- Parameter Hijacking Protection (v3.1) ---
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');

        if (urlId) {
            const normalizedUrlId = urlId.toLowerCase();
            const normalizedSessionId = (session.id || '').toLowerCase();

            if (normalizedUrlId !== normalizedSessionId) {
                // Identity check: Only permit ID switching on specific Administrative Management tools
                const isAdminTool =
                    path.includes('edit.html') ||
                    path.includes('display.html');

                const isAuthorized = session.role === 'admin' && isAdminTool;

                if (!isAuthorized) {
                    console.error("[SECURITY] Identity mismatch or unauthorized override attempt.", { session: session.id, requested: urlId });
                    // Immediate revocation and redirect
                    window.location.href = `/admin/id-card/login.html?error=integrity_violation&id=${urlId}`;
                    return;
                }
            }
        }

        // Specific page role requirements
        if (path.includes('index.html') || path.includes('applications.html') || path.includes('reports.html')) {
            if (session.role !== 'admin') {
                console.warn("[AUTH] Insufficient clearance for sector.");
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
