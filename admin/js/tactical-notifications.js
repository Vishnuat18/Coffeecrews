/**
 * CoffeeCrews Tactical Notifications System
 * Version: 1.0
 * Purpose: Premium replacement for browser alerts.
 */

const TacticalNotifications = {
    init() {
        if (document.getElementById('cc-notification-container')) return;

        const container = document.createElement('div');
        container.id = 'cc-notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            pointer-events: none;
        `;
        document.body.appendChild(container);

        // Add Styles
        const style = document.createElement('style');
        style.textContent = `
            .cc-toast {
                min-width: 320px;
                max-width: 450px;
                background: rgba(10, 10, 15, 0.9);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(0, 243, 255, 0.2);
                border-left: 4px solid var(--toast-accent, #00f3ff);
                color: #fff;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                gap: 15px;
                pointer-events: auto;
                cursor: pointer;
                animation: cc-toast-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                transition: all 0.3s ease;
            }
            .cc-toast:hover {
                transform: translateX(-5px);
                background: rgba(20, 20, 25, 0.95);
            }
            .cc-toast.fade-out {
                opacity: 0;
                transform: translateX(50px);
            }
            .cc-toast-icon {
                font-size: 1.2rem;
                color: var(--toast-accent, #00f3ff);
            }
            .cc-toast-content {
                flex-grow: 1;
            }
            .cc-toast-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.75rem;
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 4px;
                text-transform: uppercase;
                opacity: 0.9;
            }
            .cc-toast-message {
                font-family: 'Rajdhani', sans-serif;
                font-size: 0.95rem;
                line-height: 1.4;
                opacity: 0.7;
            }
            @keyframes cc-toast-in {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    },

    show(message, type = 'info', title = null) {
        this.init();
        const container = document.getElementById('cc-notification-container');
        const toast = document.createElement('div');
        toast.className = 'cc-toast';

        const params = {
            info: { icon: 'fa-info-circle', color: '#00f3ff', title: 'SYSTEM INFO' },
            success: { icon: 'fa-check-circle', color: '#3cff7d', title: 'MISSION SUCCESS' },
            warning: { icon: 'fa-exclamation-triangle', color: '#ffd700', title: 'WARNING' },
            error: { icon: 'fa-radiation', color: '#ff003c', title: 'CRITICAL ERROR' },
            directive: { icon: 'fa-tower-broadcast', color: '#7b3fe4', title: 'HQ DIRECTIVE' }
        };

        const config = params[type] || params.info;
        toast.style.setProperty('--toast-accent', config.color);

        toast.innerHTML = `
            <div class="cc-toast-icon"><i class="fas ${config.icon}"></i></div>
            <div class="cc-toast-content">
                <div class="cc-toast-title">${title || config.title}</div>
                <div class="cc-toast-message">${message}</div>
            </div>
        `;

        toast.onclick = () => this.hide(toast);

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => this.hide(toast), 6000);
    },

    hide(toast) {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400);
    }
};

// Global Exposure
window.showTacticalNotification = (msg, type, title) => TacticalNotifications.show(msg, type, title);

// Override native alert (optional, but requested implicitly)
window.alert = (msg) => {
    // Determine type based on message content if possible
    let type = 'info';
    if (msg.toLowerCase().includes('success') || msg.toLowerCase().includes('authorized')) type = 'success';
    else if (msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('error') || msg.toLowerCase().includes('unauthorized')) type = 'error';
    else if (msg.toLowerCase().includes('warning') || msg.toLowerCase().includes('confirm')) type = 'warning';

    TacticalNotifications.show(msg, type);
};
