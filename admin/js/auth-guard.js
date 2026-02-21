/**
 * Admin Authentication Guard
 * Enforces session-based authentication across all admin pages.
 */
(function () {
    const session = JSON.parse(sessionStorage.getItem('cc_session') || '{}');
    const isLoginPage = window.location.pathname.endsWith('login.html');

    const validateSession = () => {
        if (!session.timestamp || !session.id) return false;
        const ONE_DAY = 1000 * 60 * 60 * 24;
        return (Date.now() - session.timestamp <= ONE_DAY);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('id');

    if (isLoginPage) {
        // If already logged in, skip login page
        if (validateSession()) {
            if (session.role === 'admin') {
                window.location.href = '/admin/index.html';
            } else {
                window.location.href = `/admin/id-card/verify.html?id=${session.id}`;
            }
        }
    } else {
        // Enforce valid session
        if (!validateSession()) {
            console.warn("Unauthorized access. Redirecting to login.");
            const currentPath = window.location.pathname;
            window.location.href = `/admin/id-card/login.html?return_to=${encodeURIComponent(currentPath)}`;
            return;
        }

        // --- STRICT ACL ENFORCEMENT ---

        // 1. Crew members are locked to their own ID
        if (session.role === 'crew') {
            // If on verify.html, ensure ?id matches session.id
            if (window.location.pathname.includes('verify.html')) {
                if (targetId && targetId !== session.id) {
                    console.error("Security violation: Identity mismatch.");
                    window.location.href = `/admin/id-card/verify.html?id=${session.id}`;
                    return;
                }
            }

            // Block crew from admin-only tools
            const adminTools = ['/admin/index.html', '/admin/applications.html', '/admin/id-card/reports.html', '/admin/id-card/edit.html'];
            if (adminTools.some(tool => window.location.pathname.includes(tool))) {
                console.error("Clearance denied.");
                window.location.href = `/admin/id-card/verify.html?id=${session.id}`;
                return;
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
