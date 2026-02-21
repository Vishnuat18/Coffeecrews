/**
 * Admin Authentication Guard
 * Enforces session-based authentication across all admin pages.
 */
(function () {
    const session = JSON.parse(sessionStorage.getItem('cc_session') || '{}');
    const getCleanPath = () => window.location.pathname.toLowerCase().replace('.html', '').replace(/\/$/, '');
    const cleanPath = getCleanPath();
    const isLoginPage = cleanPath.includes('/login');

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
        if (!urlId) return true;

        const sId = (session.id || '').toLowerCase();
        const uId = urlId.toLowerCase();

        if (uId !== sId) {
            const isAdminTool = cleanPath.includes('/edit') ||
                cleanPath.includes('/applications') ||
                cleanPath.includes('/reports') ||
                cleanPath.includes('/index');

            if (session.role === 'admin' && isAdminTool) return true;
            return false;
        }
        return true;
    };

    if (!isLoginPage) {
        if (!validateSession() || !checkParamIntegrity()) {
            console.warn("Unauthorized or insecure access. Lockdown initiated.");
            sessionStorage.removeItem('cc_session');
            localStorage.removeItem('cc_session');

            const currentId = new URLSearchParams(window.location.search).get('id') || '';
            window.location.href = `/admin/id-card/login.html?security_alert=true&id=${currentId}&from=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        const adminSectors = ['/admin/index', '/admin/applications', '/admin/reports', '/admin/edit'];
        const isSectorRestricted = adminSectors.some(path => cleanPath.includes(path));

        if (isSectorRestricted && session.role !== 'admin') {
            console.error("LEVEL 4 CLEARANCE REQUIRED.");
            window.location.href = `/admin/id-card/verify.html?id=${session.id}`;
        }
    }
    console.log("SECURE SESSION ACTIVE [v3.0]:", session.id);
})();

window.handleLogout = async function () {
    if (await tacticalConfirm("TERMINATE SECURE SESSION?", "LOGOUT SEQUENCE")) {
        sessionStorage.removeItem('cc_session');
        // Clear localStorage version just in case of old data
        localStorage.removeItem('cc_session');
        window.location.href = '/admin/id-card/login.html';
    }
};
