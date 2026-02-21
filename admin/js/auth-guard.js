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
            const searchParams = new URLSearchParams(window.location.search);
            const returnToId = searchParams.get('id') || '';
            window.location.href = `/admin/id-card/login.html?return_to=${encodeURIComponent(currentPath)}&id=${returnToId}`;
            return;
        }

        const path = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const urlId = searchParams.get('id');

        // 1. Strict ID Validation (Kill session if hijacking attempted)
        if (urlId && session.role !== 'admin') {
            if (urlId.toLowerCase() !== session.id.toLowerCase()) {
                console.error("ID Mismatch Protocol: Session Terminated.");
                sessionStorage.removeItem('cc_session');
                localStorage.removeItem('cc_session');
                window.location.href = '/admin/id-card/login.html?error=id_mismatch';
                return;
            }
        }

        // 2. Sector Role Requirements
        const adminSectors = ['/admin/index.html', '/admin/applications.html', '/admin/id-card/reports.html', '/admin/'];
        const currentIsAdminSector = adminSectors.some(sector => path.endsWith(sector) || path === sector);

        if (currentIsAdminSector && session.role !== 'admin') {
            console.error("Insufficient clearance for this sector. Re-routing to personnel workspace.");
            window.location.href = `/admin/id-card/verify.html?id=${session.id}`;
            return;
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
