/**
 * ID Card System Data Layer
 * Handles member data persistence using Firebase Realtime Database
 */

// Firebase Configuration (Provided by User)
const firebaseConfig = {
    apiKey: "AIzaSyDbxQG0iDolgrx9atUxe5jTodEBMlSd3oc",
    authDomain: "sympo-94600.firebaseapp.com",
    databaseURL: "https://sympo-94600-default-rtdb.firebaseio.com",
    projectId: "sympo-94600",
    storageBucket: "sympo-94600.firebasestorage.app",
    messagingSenderId: "725689848789",
    appId: "1:725689848789:web:d85e9788a41a0478fc235c",
    measurementId: "G-MXYD91NP5K"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

/**
 * TacticalUI
 * Premium UI system for notifications and confirmation modals
 */
class TacticalUI {
    static init() {
        if (document.getElementById('cc-ui-container')) return;

        const container = document.createElement('div');
        container.id = 'cc-ui-container';
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            #cc-ui-container {
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 99999;
                font-family: 'Rajdhani', sans-serif;
            }
            .cc-toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .cc-toast {
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 243, 255, 0.3);
                color: #fff;
                padding: 12px 20px;
                border-radius: 10px;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                transform: translateX(120%);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: auto;
                min-width: 280px;
            }
            .cc-toast.show { transform: translateX(0); }
            .cc-toast.success { border-color: #3cff7d; }
            .cc-toast.success i { color: #3cff7d; }
            .cc-toast.error { border-color: #ff003c; }
            .cc-toast.error i { color: #ff003c; }
            .cc-toast.warning { border-color: #ffb300; }
            .cc-toast.warning i { color: #ffb300; }

            .cc-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: auto;
                opacity: 0;
                transition: 0.3s;
            }
            .cc-modal-overlay.show { opacity: 1; }
            .cc-modal {
                background: #0f172a;
                border: 1px solid rgba(0, 243, 255, 0.2);
                border-radius: 20px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 0 50px rgba(0, 243, 255, 0.1);
                transform: scale(0.8);
                transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .cc-modal-overlay.show .cc-modal { transform: scale(1); }
            .cc-modal-title {
                font-family: 'Orbitron';
                font-size: 1rem;
                color: var(--accent-primary, #00f3ff);
                margin-bottom: 15px;
                letter-spacing: 2px;
            }
            .cc-modal-content {
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9rem;
                line-height: 1.6;
                margin-bottom: 25px;
            }
            .cc-modal-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }
            .cc-btn {
                padding: 10px 25px;
                border-radius: 8px;
                font-family: 'Orbitron';
                font-size: 0.7rem;
                cursor: pointer;
                transition: 0.3s;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: transparent;
                color: #fff;
            }
            .cc-btn-primary {
                background: var(--accent-primary, #00f3ff);
                color: #000;
                border: none;
            }
            .cc-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);

        const toastContainer = document.createElement('div');
        toastContainer.className = 'cc-toast-container';
        container.appendChild(toastContainer);
    }

    static toast(message, type = 'info', duration = 4000) {
        this.init();
        const container = document.querySelector('.cc-toast-container');
        const toast = document.createElement('div');
        toast.className = `cc-toast ${type}`;

        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-triangle';
        if (type === 'warning') icon = 'fa-lock';

        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    static async confirm(title, message, confirmText = "CONFIRM", cancelText = "CANCEL") {
        this.init();
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'cc-modal-overlay';
            overlay.innerHTML = `
                <div class="cc-modal">
                    <div class="cc-modal-title">${title.toUpperCase()}</div>
                    <div class="cc-modal-content">${message}</div>
                    <div class="cc-modal-actions">
                        <button class="cc-btn" id="modal-cancel">${cancelText}</button>
                        <button class="cc-btn cc-btn-primary" id="modal-confirm">${confirmText}</button>
                    </div>
                </div>
            `;
            document.getElementById('cc-ui-container').appendChild(overlay);
            setTimeout(() => overlay.classList.add('show'), 10);

            const cleanup = (result) => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
                resolve(result);
            };

            overlay.querySelector('#modal-confirm').onclick = () => cleanup(true);
            overlay.querySelector('#modal-cancel').onclick = () => cleanup(false);
        });
    }

    static async alert(title, message, btnText = "UNDERSTOOD") {
        this.init();
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'cc-modal-overlay';
            overlay.innerHTML = `
                <div class="cc-modal">
                    <div class="cc-modal-title">${title.toUpperCase()}</div>
                    <div class="cc-modal-content">${message}</div>
                    <div class="cc-modal-actions">
                        <button class="cc-btn cc-btn-primary" id="modal-ok">${btnText}</button>
                    </div>
                </div>
            `;
            document.getElementById('cc-ui-container').appendChild(overlay);
            setTimeout(() => overlay.classList.add('show'), 10);

            overlay.querySelector('#modal-ok').onclick = () => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
                resolve();
            };
        });
    }
    static async prompt(title, message, placeholder = "", btnText = "SUBMIT") {
        this.init();
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'cc-modal-overlay';
            overlay.innerHTML = `
                <div class="cc-modal">
                    <div class="cc-modal-title">${title.toUpperCase()}</div>
                    <div class="cc-modal-content">${message}</div>
                    <input type="text" id="modal-input" class="cc-input" placeholder="${placeholder}" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-family: 'Rajdhani'; outline: none;">
                    <div class="cc-modal-actions">
                        <button class="cc-btn" id="modal-cancel">CANCEL</button>
                        <button class="cc-btn cc-btn-primary" id="modal-submit">${btnText}</button>
                    </div>
                </div>
            `;
            document.getElementById('cc-ui-container').appendChild(overlay);
            const input = overlay.querySelector('#modal-input');
            setTimeout(() => {
                overlay.classList.add('show');
                input.focus();
            }, 10);

            const cleanup = (result) => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
                resolve(result);
            };

            overlay.querySelector('#modal-submit').onclick = () => cleanup(input.value);
            overlay.querySelector('#modal-cancel').onclick = () => cleanup(null);
            input.onkeypress = (e) => { if (e.key === 'Enter') cleanup(input.value); };
        });
    }
}

// Global Exports
window.showToast = (msg, type, dur) => TacticalUI.toast(msg, type, dur);
window.ccConfirm = (title, msg, conf, canc) => TacticalUI.confirm(title, msg, conf, canc);
window.ccAlert = (title, msg, btn) => TacticalUI.alert(title, msg, btn);
window.ccPrompt = (title, msg, placeholder, btn) => TacticalUI.prompt(title, msg, placeholder, btn);

const INITIAL_MEMBERS = [
    {
        id: "vishnu",
        ccCode: "1418",
        passcode: "1418",
        name: "Vishnu R",
        role: "Full stack Dev",
        bloodGroup: "O+",
        description: "Engineering Student & Developer passionate about crafting robust, scalable web applications. Expert in Java systems and Secure Web Architectures.",
        image: "/assets/vishnu.jpeg",
        accent: "#00f3ff",
        access: "admin",
        contact: {
            phone: "+916379000598",
            email: "vishnurajan24766@gmail.com",
            portfolio: "https://v-portfolio-drab.vercel.app/",
            linkedin: "https://www.linkedin.com/in/vishnu-r-a41884300",
            github: "https://github.com/Vishnuat18"
        }
    },
    {
        id: "kiran",
        ccCode: "0000",
        passcode: "0000",
        name: "Kiran Balaso Patil",
        role: "Full Stack Dev",
        bloodGroup: "AB+",
        description: "Specialist in Node.js and Java backends. Creator of SmartCart and complex Management Systems. 'Write Once, Run Anywhere.'",
        image: "/assets/kiran.jpeg",
        accent: "#ff003c",
        contact: {
            phone: "8610641610",
            email: "kiranbalasopatil33@gmail.com",
            portfolio: "https://kiranpatil05.netlify.app",
            linkedin: "https://www.linkedin.com/in/kiran-balaso-patil-851a43351",
            github: "https://github.com/KiranBalasoPatil3052006"
        }
    },
    {
        id: "rohith",
        ccCode: "2244",
        passcode: "2244",
        name: "Rohith S",
        role: "Front end Dev",
        bloodGroup: "B+",
        description: "Focus on Front-End Design and Interactive Experiences. Creating visually engaging, responsive layouts that wow users.",
        image: "/assets/rohith.png",
        accent: "#0aff0a",
        contact: {
            phone: "7530019229",
            email: "rohithsathish701@gmail.com",
            portfolio: "https://rohith22s.github.io/portfolio-2.0/",
            linkedin: "https://www.linkedin.com/in/rohith-s-7a1208345",
            github: "https://github.com/Rohith22s"
        }
    },
    {
        id: "prasanna",
        ccCode: "9089",
        passcode: "9089",
        name: "Prasanna Ramana S",
        role: "Founder & CEO",
        bloodGroup: "O+",
        description: "Visionary leader driving the strategic direction of CoffeeCrews. Fostering innovation and building the future of tech.",
        image: "/assets/prasanna.jpeg",
        accent: "#ffd700",
        access: "admin",
        contact: {
            phone: "6382920103",
            email: "prasannaramana2005@gmail.com",
            portfolio: "https://rohith22s.github.io/prasanna-portfolio/",
            linkedin: "https://www.linkedin.com/in/prasanna-ramana-82541a351",
            github: "https://github.com/PrasannaRamana"
        }
    },
    {
        id: "senthil",
        ccCode: "9883",
        passcode: "9883",
        name: "Senthilnathan L M",
        role: "UI/UX Designer",
        bloodGroup: "B+",
        description: "Creative Web Designer focusing on intuitive user interfaces and modern aesthetics. Crafting digital experiences that inspire.",
        image: "/assets/senthil.png",
        accent: "#ff5722",
        contact: {
            phone: "9345639455",
            email: "senthilloganathan30@gmail.com",
            portfolio: "https://senthilprofile.netlify.app/",
            linkedin: "https://www.linkedin.com/in/senthilnathan-l-m-361661351",
            github: "https://github.com/SenthilLoganathan30"
        }
    },
    {
        id: "dharani",
        ccCode: "9858",
        passcode: "9858",
        name: "Dharanitharan P",
        role: "Founder & CEO",
        bloodGroup: "A+",
        description: "Optimizing systems and driving growth. Bridging the gap between engineering excellence and strategic vision.",
        image: "/assets/dharani.png",
        accent: "#ffd700",
        access: "admin",
        contact: {
            phone: "7010971323",
            email: "dharanitharanprakash06@gmail.com",
            portfolio: "https://rohith22s.github.io/dr/",
            linkedin: "https://www.linkedin.com/in/dharanitharan-p-ab0ab5351",
            github: "https://github.com/dharani2404"
        }
    },
    {
        id: "gc",
        ccCode: "0109",
        passcode: "0109",
        name: "Gowdhama Chandhran K",
        role: "DB Manager",
        bloodGroup: "AB+",
        description: "Master of Data management. Ensuring the integrity and availability of our most critical information assets.",
        image: "/assets/gk.png",
        accent: "#44efab",
        contact: {
            phone: "7639013065",
            email: "gc2005.kk@gmail.com",
            portfolio: "#",
            linkedin: "https://www.linkedin.com/in/gowdhama-chandhran-k",
            github: "https://github.com/gc2005kk"
        }
    },
    {
        id: "gokul",
        ccCode: "3021",
        passcode: "3021",
        name: "Gokul",
        role: "Video Editor",
        description: "Master of Motion and Visual Storytelling. Bringing static concepts to life through animation and design.",
        image: "/assets/gokul.jpeg",
        accent: "#ff00ff",
        contact: {
            phone: "#",
            email: "#",
            portfolio: "#",
            linkedin: "#",
            github: "#"
        }
    },
    {
        id: "nithish",
        ccCode: "5521",
        passcode: "5521",
        name: "Nithish",
        role: "Prompt Engineer",
        description: "Synthesizing data-driven insights with creative linguistic patterns to enhance AI reasoning capabilities.",
        image: "/assets/nithish.png",
        accent: "#8fd222",
        contact: {
            phone: "9043420472",
            email: "nithishk6500@gmil.com"
        }
    },
    {
        id: "akshaya",
        ccCode: "1029",
        passcode: "1029",
        name: "Akshaya",
        role: "Web Designer",
        description: "UI/UX Designer creating intuitive, human-centric interfaces. Merging pixel perfection with user empathy.",
        image: "/assets/akshaya.png",
        accent: "#f472b6",
        contact: {
            phone: "63817 61876",
            email: "akshayaakshaya2005@gmail.com"
        }
    }
];

class DataManager {
    static STORAGE_KEY = 'coffeecrews_id_cards';
    static CHAT_KEY = 'coffeecrews_chats';
    static REQUESTS_KEY = 'coffeecrews_passcode_requests';
    static ATTENDANCE_KEY = 'attendance';
    static DATA_VERSION = '2.0'; // Updated for Firebase

    static async getAllMembers() {
        try {
            const snapshot = await db.ref('members').once('value');
            const data = snapshot.val();

            if (!data) {
                // Initialize Firebase with defaults if empty
                await this.saveAllMembers(INITIAL_MEMBERS);
                return INITIAL_MEMBERS;
            }

            // Convert object to array if needed
            return Array.isArray(data) ? data : Object.values(data);
        } catch (e) {
            console.error("Firebase access failed:", e);
            return INITIAL_MEMBERS;
        }
    }

    static async getMemberById(id) {
        if (!id) return null;
        const members = await this.getAllMembers();
        return members.find(m => m.id.toLowerCase() === id.toLowerCase());
    }

    static async saveAllMembers(members) {
        await db.ref('members').set(members);
    }

    static async updateMember(id, updatedData) {
        const members = await this.getAllMembers();
        const index = members.findIndex(m => m.id === id);
        if (index !== -1) {
            const newMemberData = { ...members[index], ...updatedData };
            await db.ref(`members/${index}`).update(updatedData);
            window.dispatchEvent(new CustomEvent('coffeecrews_data_update', { detail: { id } }));
            return true;
        }
        return false;
    }

    static async blockMember(id, days) {
        const until = Date.now() + (days * 24 * 60 * 60 * 1000);
        return await this.updateMember(id, { blockedUntil: until });
    }

    static async unblockMember(id) {
        return await this.updateMember(id, { blockedUntil: null });
    }

    static async deleteMember(id) {
        const members = await this.getAllMembers();
        const filtered = members.filter(m => m.id !== id);
        if (members.length !== filtered.length) {
            await this.saveAllMembers(filtered);
            window.dispatchEvent(new CustomEvent('coffeecrews_data_update', { detail: { id } }));
            return true;
        }
        return false;
    }

    // --- CHAT SYSTEM (REAL-TIME) ---

    static async getChatStore() {
        const snapshot = await db.ref('chats').once('value');
        const store = snapshot.val() || { threads: {}, global: [], statusFeed: [] };
        return store;
    }

    static async saveChatStore(store) {
        await db.ref('chats').set(store);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    static getThreadId(id1, id2) {
        return [id1, id2].sort().join('_').toLowerCase();
    }

    static async getMessages(threadId) {
        try {
            const snapshot = await db.ref(`chats/threads/${threadId}`).once('value');
            const data = snapshot.val();
            if (!data) return [];
            return Array.isArray(data) ? data : Object.values(data);
        } catch (e) {
            console.error("Firebase getMessages failed:", e);
            return [];
        }
    }

    static async sendMessage(senderId, receiverId, text, image = null) {
        const threadId = this.getThreadId(senderId, receiverId);

        const message = {
            id: Date.now(),
            senderId: senderId,
            text,
            image,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };

        await db.ref(`chats/threads/${threadId}`).push(message);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
        return message;
    }

    static async sendGlobalMessage(senderId, senderName, text, image = null) {
        const message = {
            id: Date.now(),
            senderId,
            senderName,
            text,
            image,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };

        await db.ref('chats/global').push(message);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
        return message;
    }

    static async getGlobalMessages() {
        try {
            const snapshot = await db.ref('chats/global').limitToLast(50).once('value');
            const data = snapshot.val();
            if (!data) return [];
            return Array.isArray(data) ? data : Object.values(data);
        } catch (e) {
            console.error("Firebase getGlobalMessages failed:", e);
            return [];
        }
    }

    static async commitStatus(senderId, senderName, text, senderImage, statusImage = null) {
        const statusUpdate = {
            id: Date.now(),
            senderId,
            senderName,
            senderImage,
            text,
            image: statusImage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };

        await db.ref('chats/statusFeed').push(statusUpdate);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
        return statusUpdate;
    }

    static async getStatusFeed() {
        const snapshot = await db.ref('chats/statusFeed').limitToLast(20).once('value');
        const val = snapshot.val();
        return val ? Object.values(val).reverse() : [];
    }

    static async sendBroadcast(adminName, text) {
        return this.sendGlobalMessage('HQ', adminName, `[HQ DIRECTIVE] ${text}`);
    }

    static async markAttendance(id) {
        const member = await this.getMemberById(id);
        if (!member) return false;

        const today = new Date().toISOString().split('T')[0];
        const log = {
            memberId: id,
            memberName: member.name,
            timestamp: Date.now(),
            time: new Date().toLocaleTimeString()
        };

        await db.ref(`attendance/${today}/${id}`).set(log);
        // Firebase listeners will handle the UI update
        return true;
    }

    static async getDailyAttendance(date = null) {
        const today = date || new Date().toISOString().split('T')[0];
        const snapshot = await db.ref(`attendance/${today}`).once('value');
        const val = snapshot.val();
        return val ? Object.values(val) : [];
    }

    // --- RECRUITMENT & APPLICATIONS ---

    static async submitApplication(appData) {
        const id = 'APP' + Date.now();
        const application = {
            ...appData,
            id,
            status: 'pending',
            timestamp: new Date().toLocaleString(),
            epoch: Date.now()
        };
        await db.ref(`applications/${id}`).set(application);
        // Update local only for legacy support
        const local = JSON.parse(localStorage.getItem('cc_applications') || '[]');
        local.push(application);
        localStorage.setItem('cc_applications', JSON.stringify(local));
        return application;
    }

    static async getApplications() {
        const snapshot = await db.ref('applications').once('value');
        const val = snapshot.val();
        return val ? Object.values(val).sort((a, b) => b.epoch - a.epoch) : [];
    }

    static async deleteApplication(id) {
        await db.ref(`applications/${id}`).remove();
        // Sync local
        let local = JSON.parse(localStorage.getItem('cc_applications') || '[]');
        local = local.filter(a => a.id !== id);
        localStorage.setItem('cc_applications', JSON.stringify(local));
    }

    // --- SECURITY & PASSCODE REQUESTS ---

    static async getPasscodeRequests() {
        const snapshot = await db.ref('requests').once('value');
        const val = snapshot.val();
        return val ? Object.values(val).reverse() : [];
    }

    static async savePasscodeRequests(requests) {
        await db.ref('requests').set(requests);
        window.dispatchEvent(new CustomEvent('cc_security_update'));
    }

    static async submitPasscodeRequest(memberId, memberName, currentPass, newPass) {
        const member = await this.getMemberById(memberId);
        const validPass = member.passcode || member.ccCode; // Fallback for legacy
        if (!member || validPass !== currentPass) {
            return { success: false, message: "Verification failed: Current CC Code is incorrect." };
        }

        const newRequest = {
            id: Date.now(),
            memberId,
            memberName,
            currentPass,
            newPass,
            status: 'pending',
            timestamp: Date.now(),
            date: new Date().toLocaleDateString()
        };

        await db.ref('requests').push(newRequest);
        window.dispatchEvent(new CustomEvent('cc_security_update'));
        return { success: true, message: "Passcode change request submitted to HQ." };
    }

    static async approvePasscodeRequest(requestId) {
        const snapshot = await db.ref('requests').once('value');
        const requests = snapshot.val() || {};

        let foundKey = null;
        let req = null;

        for (const [key, value] of Object.entries(requests)) {
            if (value.id === requestId) {
                foundKey = key;
                req = value;
                break;
            }
        }

        if (foundKey && req.status === 'pending') {
            const updated = await this.updateMember(req.memberId, { passcode: req.newPass });
            if (updated) {
                await db.ref(`requests/${foundKey}`).update({ status: 'approved' });
                window.dispatchEvent(new CustomEvent('cc_security_update'));
                return { success: true, message: "Request approved. Passcode updated." };
            }
        }
        return { success: false, message: "Approval failed." };
    }

    static async rejectPasscodeRequest(requestId) {
        const snapshot = await db.ref('requests').once('value');
        const requests = snapshot.val() || {};

        let foundKey = null;
        for (const [key, value] of Object.entries(requests)) {
            if (value.id === requestId) {
                foundKey = key;
                break;
            }
        }

        if (foundKey) {
            await db.ref(`requests/${foundKey}`).update({ status: 'rejected' });
            window.dispatchEvent(new CustomEvent('cc_security_update'));
            return { success: true, message: "Request rejected." };
        }
        return { success: false, message: "Rejection failed." };
    }

    static subscribeToChat(threadId, callback) {
        const ref = db.ref(`chats/threads/${threadId}`);
        const listener = (snapshot) => {
            const data = snapshot.val();
            const messages = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
            callback(messages);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static subscribeToGlobalChat(callback) {
        const ref = db.ref('chats/global');
        const listener = (snapshot) => {
            const data = snapshot.val();
            const messages = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
            callback(messages);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static subscribeToStatusFeed(callback) {
        const ref = db.ref('chats/statusFeed');
        const listener = (snapshot) => {
            const data = snapshot.val();
            const feed = data ? Object.values(data).reverse() : [];
            callback(feed);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static subscribeToMembers(callback) {
        const ref = db.ref('members');
        const listener = (snapshot) => {
            const data = snapshot.val();
            const list = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
            callback(list);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static subscribeToApplications(callback) {
        const ref = db.ref('applications');
        const listener = (snapshot) => {
            const data = snapshot.val();
            const list = data ? Object.values(data).sort((a, b) => b.epoch - a.epoch) : [];
            callback(list);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static subscribeToDailyAttendance(callback, date = null) {
        const today = date || new Date().toISOString().split('T')[0];
        const ref = db.ref(`attendance/${today}`);
        const listener = (snapshot) => {
            const data = snapshot.val();
            const list = data ? Object.values(data) : [];
            callback(list);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static subscribeToPasscodeRequests(callback) {
        const ref = db.ref('requests');
        const listener = (snapshot) => {
            const data = snapshot.val();
            const list = data ? Object.values(data).reverse() : [];
            callback(list);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static subscribeToAllThreads(callback) {
        const ref = db.ref('chats/threads');
        const listener = (snapshot) => {
            const data = snapshot.val();
            callback(data || {});
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }
    static async syncPermanentCodes() {
        try {
            const snapshot = await db.ref('members').once('value');
            const firebaseMembers = snapshot.val();

            if (!firebaseMembers) {
                await this.saveAllMembers(INITIAL_MEMBERS);
                return;
            }

            const membersArray = Array.isArray(firebaseMembers) ? firebaseMembers : Object.values(firebaseMembers);
            let updated = false;

            // Update existing members with codes from INITIAL_MEMBERS
            membersArray.forEach((m, idx) => {
                const source = INITIAL_MEMBERS.find(im => im.id.toLowerCase() === m.id.toLowerCase());
                if (source) {
                    // Force ccCode to match INITIAL_MEMBERS as it's "permanent"
                    if (m.ccCode !== source.ccCode) {
                        m.ccCode = source.ccCode;
                        // Also reset passcode to match for initial workable state if it was old
                        m.passcode = source.ccCode;
                        updated = true;
                    }
                }
            });

            if (updated) {
                await this.saveAllMembers(membersArray);
                console.log("Permanent CC Codes synced with database.");
            }
        } catch (e) {
            console.error("Sync failed:", e);
        }
    }
}

// Global sync on load
DataManager.syncPermanentCodes();

// Export for use in other scripts
window.DataManager = DataManager;
