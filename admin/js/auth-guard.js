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

    const checkParamIntegrity = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');

        if (!urlId) return true; // No ID in URL, standard page load

        // STRICK LOCKDOWN: If URL ID does not match Session ID
        if (urlId !== session.id) {

            // Allow Admins to navigate purely administrative management tools (edit, reports)
            const isAdminTool = window.location.pathname.includes('/edit.html') ||
                window.location.pathname.includes('/applications.html') ||
                window.location.pathname.includes('/reports.html');

            if (session.role === 'admin' && isAdminTool) {
                return true; // Admins can manage others
            }

            // RED ALERT: Identity mismatch in private workspace or unauthorized access
            console.error("IDENTITY MISMATCH DETECTED. SECURITY LOCKDOWN INITIATED.");
            sessionStorage.removeItem('cc_session');
            localStorage.removeItem('cc_session');
            window.location.href = `/admin/id-card/login.html?security_alert=identity_mismatch&from=${encodeURIComponent(window.location.pathname)}`;
            return false;
        }
        return true;
    };

    if (!isLoginPage) {
        if (!validateSession() || !checkParamIntegrity()) {
            if (!window.location.pathname.endsWith('login.html')) {
                console.warn("Unauthorized or insecure access detected. Redirecting to login.");
                const currentPath = window.location.pathname;
                const returnTo = new URLSearchParams(window.location.search).get('id') || '';
                window.location.href = `/admin/id-card/login.html?return_to=${encodeURIComponent(currentPath)}&id=${returnTo}`;
                return;
            }
        }

        // Specific sector clearance requirements
        const adminSectors = ['/admin/index.html', '/admin/applications.html', '/admin/id-card/reports.html', '/admin/id-card/edit.html'];
        const isSectorRestricted = adminSectors.some(path => window.location.pathname.includes(path));

        if (isSectorRestricted && session.role !== 'admin') {
            console.error("Insufficient clearance for this sector.");
            window.location.href = `/admin/id-card/verify.html?id=${session.id}`;
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
