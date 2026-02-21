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

        // --- ID LOCKDOWN PROTOCOL (Security Update v2.9) ---
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';

        // 1. Enforce ID matching for non-admins (Prevent URL parameters tampering)
        if (session.role !== 'admin' && urlId && urlId.toLowerCase() !== session.id.toLowerCase()) {
            console.error(`ID Lockdown: Security breach blocked. ${session.id} attempted to access ${urlId}.`);
            window.location.href = window.location.pathname + '?id=' + session.id;
            return;
        }

        // 2. Enforce Sector Access (Prevent URL jumping to Admin Tools)
        const adminSectors = ['index.html', 'applications.html', 'reports.html'];
        if (session.role !== 'admin' && adminSectors.includes(currentFile)) {
            console.error("Sector Lockdown: Insufficient clearance for administrative HQ.");
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
