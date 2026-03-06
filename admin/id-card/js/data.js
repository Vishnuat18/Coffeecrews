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
 * ToastManager
 * Premium notification system for tactical feedback
 */
class ToastManager {
    static init() {
        if (document.getElementById('cc-toast-container')) return;
        const container = document.createElement('div');
        container.id = 'cc-toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .cc-toast {
                background: rgba(10, 10, 15, 0.95);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                color: #fff;
                padding: 15px 25px;
                border-radius: 12px;
                font-family: 'Rajdhani', sans-serif;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.6);
                transform: translateY(-20px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                pointer-events: auto;
                min-width: 280px;
                border-left: 3px solid #00f3ff;
            }
            .cc-toast.show { transform: translateY(0); opacity: 1; }
            .cc-toast i { font-size: 1.2rem; }
            .cc-toast.success { border-left-color: #3cff7d; }
            .cc-toast.success i { color: #3cff7d; }
            .cc-toast.error { border-left-color: #ff003c; }
            .cc-toast.error i { color: #ff003c; }
            .cc-toast.info { border-left-color: #ffd700; }
            .cc-toast.info i { color: #ffd700; }
        `;
        document.head.appendChild(style);
    }

    static show(message, type = 'info', duration = 4000) {
        this.init();
        const container = document.getElementById('cc-toast-container');
        const toast = document.createElement('div');
        toast.className = `cc-toast ${type}`;

        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-triangle';
        if (message.toLowerCase().includes('restricted') || message.toLowerCase().includes('blocked')) icon = 'fa-lock';

        toast.innerHTML = `<i class="fas ${icon}"></i> <span style="letter-spacing: 0.5px;">${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }
}
window.showToast = (msg, type, dur) => ToastManager.show(msg, type, dur);

/**
 * ModalManager
 * Premium tactical dialog system for confirmations and inputs
 */
class ModalManager {
    static init() {
        if (document.getElementById('cc-modal-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'cc-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            font-family: 'Rajdhani', sans-serif;
        `;
        overlay.innerHTML = `
            <div id="cc-modal" class="cc-modal">
                <div id="cc-modal-title" class="cc-modal-title">SYSTEM ALERT</div>
                <div id="cc-modal-msg" class="cc-modal-msg">Initializing secure terminal...</div>
                <div id="cc-modal-input-container" style="display: none;">
                    <input type="text" id="cc-modal-input" class="cc-modal-input">
                </div>
                <div class="cc-modal-actions">
                    <button id="cc-modal-cancel" class="cc-modal-btn btn-cancel">CANCEL</button>
                    <button id="cc-modal-ok" class="cc-modal-btn btn-confirm">CONFIRM</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = `
            .cc-modal {
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid rgba(0, 243, 255, 0.3);
                width: 90%;
                max-width: 450px;
                padding: 35px;
                border-radius: 24px;
                box-shadow: 0 0 60px rgba(0, 243, 255, 0.15);
                transform: translateY(20px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .cc-modal.show { transform: translateY(0); opacity: 1; }
            .cc-modal-title { font-family: 'Orbitron', sans-serif; font-size: 1.1rem; color: #00f3ff; margin-bottom: 20px; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; }
            .cc-modal-msg { font-size: 1rem; color: #cbd5e1; margin-bottom: 30px; line-height: 1.6; }
            .cc-modal-input { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 15px; border-radius: 12px; margin-bottom: 25px; outline: none; font-family: 'Orbitron'; font-size: 0.9rem; }
            .cc-modal-input:focus { border-color: #00f3ff; box-shadow: 0 0 15px rgba(0, 243, 255, 0.2); }
            .cc-modal-actions { display: flex; gap: 15px; justify-content: flex-end; }
            .cc-modal-btn { padding: 12px 28px; border-radius: 50px; font-family: 'Orbitron', sans-serif; font-size: 0.7rem; cursor: pointer; transition: 0.3s; font-weight: 700; letter-spacing: 1px; }
            .btn-confirm { background: rgba(0, 243, 255, 0.1); border: 1px solid #00f3ff; color: #00f3ff; }
            .btn-confirm:hover { background: #00f3ff; color: #000; box-shadow: 0 0 25px rgba(0,243,255,0.4); }
            .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); }
            .btn-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }
        `;
        document.head.appendChild(style);
    }

    static async show(config) {
        this.init();
        const overlay = document.getElementById('cc-modal-overlay');
        const modal = document.getElementById('cc-modal');
        const title = document.getElementById('cc-modal-title');
        const msg = document.getElementById('cc-modal-msg');
        const inputContainer = document.getElementById('cc-modal-input-container');
        const input = document.getElementById('cc-modal-input');
        const okBtn = document.getElementById('cc-modal-ok');
        const cancelBtn = document.getElementById('cc-modal-cancel');

        title.textContent = config.title || 'SYSTEM NOTIFICATION';
        msg.textContent = config.message;
        inputContainer.style.display = config.showInput ? 'block' : 'none';
        if (config.showInput) {
            input.value = '';
            input.placeholder = config.placeholder || config.defaultValue || '';
        }
        cancelBtn.style.display = config.showCancel ? 'block' : 'none';
        okBtn.textContent = config.okText || 'CONFIRM';

        overlay.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);

        return new Promise((resolve) => {
            const cleanup = (value) => {
                modal.classList.remove('show');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    resolve(value);
                }, 400);
            };

            okBtn.onclick = () => {
                let val = config.showInput ? input.value : true;
                if (config.showInput && !val && (config.placeholder || config.defaultValue)) {
                    val = config.placeholder || config.defaultValue;
                }
                cleanup(val);
            };
            cancelBtn.onclick = () => cleanup(null);
            overlay.onclick = (e) => { if (e.target === overlay && !config.forceResponse) cleanup(null); };
        });
    }

    static alert(message, title = 'SYSTEM ALERT') {
        return this.show({ message, title, showCancel: false, okText: 'Confirm' });
    }

    static confirm(message, title = 'SYSTEM CONFIRMATION') {
        return this.show({ message, title, showCancel: true, okText: 'Confirm' });
    }

    static prompt(message, defaultValue = '', title = 'DATA INPUT REQUIRED') {
        return this.show({ message, title, showCancel: true, showInput: true, defaultValue, okText: 'SUBMIT' });
    }
}

window.tacticalAlert = (msg, title) => ModalManager.alert(msg, title);
window.tacticalConfirm = (msg, title) => ModalManager.confirm(msg, title);
window.tacticalPrompt = (msg, def, title) => ModalManager.prompt(msg, def, title);

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
        access: "admin",
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
            email: "nithishk6500@gmil.com",
            portfolio: "https://rohith22s.github.io/laila/"
        }
    },
    {
        id: "bhavana",
        ccCode: "0207",
        passcode: "0207",
        name: "Bhavana C P",
        role: "Content creator",
        bloodGroup: "O+",
        description: "Creative content strategist specializing in digital storytelling and brand engagement for the CoffeeCrews ecosystem.",
        image: "/assets/favicon.png",
        accent: "#d946ef",
        contact: {
            phone: "8248890779",
            email: "cpbhava2006@gmail.com",
            github: "https://github.com/cpbhava2006-ship-it",
            linkedin: "https://www.linkedin.com/in/bhavana-c-p-1702512b4"
        }
    },
    {
        id: "santhosh",
        ccCode: "2209",
        passcode: "2209",
        name: "Santhosh G",
        role: "prompt engineer",
        bloodGroup: "B+",
        description: "Innovative prompt engineer optimizing AI interactions and developing advanced linguistic frameworks for next-gen agents.",
        image: "/assets/santhosh.png",
        accent: "#f97316",
        contact: {
            phone: "7845295779",
            email: "santhoshgovindan2006@gmail.com",
            portfolio: "https://santhoshprofile.netlify.app",
            github: "https://github.com/santhosh0822",
            linkedin: "https://www.linkedin.com/in/santhosh-g-895434351"
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

            // Return as array, ensuring consistency
            const members = Array.isArray(data) ? data : Object.values(data);
            return members.filter(m => m && m.id);
        } catch (e) {
            console.error("Firebase access failed:", e);
            return INITIAL_MEMBERS;
        }
    }

    static async getMemberById(id) {
        if (!id) return null;
        const searchId = id.toString().toLowerCase();

        // Try direct keyed access first
        const snapshot = await db.ref(`members/${searchId}`).once('value');
        const keyedData = snapshot.val();

        // If it's a complete record, return it
        if (keyedData && keyedData.name) return keyedData;

        // Fallback: search in all members (handles array structure or partial records)
        const all = await this.getAllMembers();
        const found = all.find(m => m && m.id && m.id.toString().toLowerCase() === searchId);

        // If we found a full record elsewhere but have partial keyed data, merge them
        if (found && keyedData) return { ...found, ...keyedData };
        return found || keyedData;
    }

    static async saveAllMembers(members) {
        // Convert array to object keyed by ID to prevent numeric array indices
        const obj = {};
        members.forEach(m => {
            if (m && m.id) obj[m.id.toLowerCase()] = m;
        });
        await db.ref('members').set(obj);
    }

    // Non-destructive seed: patches base fields from INITIAL_MEMBERS into Firebase
    // Preserves dynamic fields: attendance, achievements, driveLinks, etc.
    static async seedMembersToFirebase() {
        const snapshot = await db.ref('members').once('value');
        const data = snapshot.val() || {};

        let updatedCount = 0;

        // Canonicalize current data to an object keyed by ID
        const current = {};
        if (Array.isArray(data)) {
            data.forEach(m => { if (m && m.id) current[m.id.toLowerCase()] = m; });
        } else {
            Object.keys(data).forEach(key => {
                const m = data[key];
                // Record might be indexed by numeric key or string ID
                const id = (m && m.id) ? m.id.toLowerCase() : (isNaN(key) ? key.toLowerCase() : null);
                if (id) {
                    current[id] = { ...(current[id] || {}), ...m };
                }
            });
        }

        // Fields that come from INITIAL_MEMBERS (base config)
        // NOTE: 'passcode' removed from BASE_FIELDS to prevent resetting user changes
        const BASE_FIELDS = ['id', 'ccCode', 'name', 'role', 'bloodGroup',
            'access', 'description', 'image', 'accent', 'contact'];

        const updates = {};

        // Match initial members to existing data (or create new)
        INITIAL_MEMBERS.forEach(source => {
            const safeId = source.id.toString().toLowerCase();
            const existing = current[safeId] || {};
            const patch = {};
            BASE_FIELDS.forEach(f => { if (source[f] !== undefined) patch[f] = source[f]; });

            // Merge existing dynamic data (achievements, streaks, customized passcodes) with source base data
            // Maintain existing passcode if it exists
            const passcode = existing.passcode || source.passcode;
            updates[safeId] = { ...existing, ...patch, id: safeId, passcode };
            updatedCount++;
        });

        // Use .set() to replace the entire collection with the standardized keyed object (removes numeric indices)
        await db.ref('members').set(updates);
        return { seeded: 0, updated: updatedCount, msg: `Standardized ${updatedCount} personnel records.` };
    }

    static async updateMember(id, updatedData) {
        if (!id) return false;

        const safeId = id.toString().toLowerCase();
        // Target specific ID directly in Firebase (enforce lowercase)
        await db.ref(`members/${safeId}`).update(updatedData);

        // --- REACTIVE ACHIEVEMENT CHECK (for passcode changes etc) ---
        // Prevent recursion if this update was triggered BY the achievement engine
        if (window.AchievementsEngine && !updatedData._skipAchievementCheck) {
            window.AchievementsEngine.checkAll(safeId);
        }

        window.dispatchEvent(new CustomEvent('coffeecrews_data_update', { detail: { id: safeId } }));
        return true;
    }

    static async blockMember(id, days) {
        const until = Date.now() + (days * 24 * 60 * 60 * 1000);
        return this.updateMember(id, { blockedUntil: until });
    }

    static async unblockMember(id) {
        return this.updateMember(id, { blockedUntil: null });
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
        const s1 = id1.toString().toLowerCase();
        const s2 = id2.toString().toLowerCase();
        return [s1, s2].sort().join('_');
    }

    static async getMessages(threadId) {
        try {
            const snapshot = await db.ref(`chats/threads/${threadId}`).once('value');
            const data = snapshot.val();
            if (!data) return [];
            // Attach the Firebase key to each message for edit/delete
            return Object.entries(data).map(([key, val]) => ({ ...val, _key: key }));
        } catch (e) {
            console.error("Firebase getMessages failed:", e);
            return [];
        }
    }

    // Real-time subscription for a peer/HQ thread — returns unsubscribe fn
    static subscribeToChat(threadId, callback) {
        const ref = db.ref(`chats/threads/${threadId}`);
        const handler = (snapshot) => {
            const data = snapshot.val();
            if (!data) { callback([]); return; }
            const msgs = Object.entries(data).map(([key, val]) => ({ ...val, _key: key }));
            callback(msgs);
        };
        ref.on('value', handler);
        return () => ref.off('value', handler); // unsubscribe fn
    }

    // Real-time subscription for global channel — returns unsubscribe fn
    static subscribeToGlobalChatLive(callback) {
        const ref = db.ref('chats/global');
        const handler = (snapshot) => {
            const data = snapshot.val();
            if (!data) { callback([]); return; }
            const msgs = Object.entries(data).map(([key, val]) => ({ ...val, _key: key }));
            callback(msgs);
        };
        ref.on('value', handler);
        return () => ref.off('value', handler); // unsubscribe fn
    }

    static async sendMessage(senderId, receiverId, text, image = null, extra = {}) {
        const threadId = this.getThreadId(senderId, receiverId);

        const message = {
            id: Date.now(),
            senderId: senderId,
            text: text || null,
            image: image || null,
            audioUrl: extra.audioUrl || null,
            fileUrl: extra.fileUrl || null,
            fileType: extra.fileType || null,
            fileName: extra.fileName || null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            replyTo: extra.replyTo || null,
            seenBy: { [senderId]: Date.now() } // Mark as seen by sender immediately
        };

        await db.ref(`chats/threads/${threadId}`).push(message);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
        return message;
    }

    static async sendGlobalMessage(senderId, senderName, text, image = null, extra = {}) {
        const message = {
            id: Date.now(),
            senderId,
            senderName,
            text: text || null,
            image: image || null,
            audioUrl: extra.audioUrl || null,
            fileUrl: extra.fileUrl || null,
            fileType: extra.fileType || null,
            fileName: extra.fileName || null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            replyTo: extra.replyTo || null,
            seenBy: { [senderId]: Date.now() }
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
            return Object.entries(data).map(([key, val]) => ({ ...val, _key: key }));
        } catch (e) {
            console.error("Firebase getGlobalMessages failed:", e);
            return [];
        }
    }

    // --- CHAT EDIT / DELETE / RESET ---

    static async editMessage(path, msgKey, newText) {
        // path: 'chats/threads/<threadId>' or 'chats/global'
        await db.ref(`${path}/${msgKey}`).update({ text: newText, edited: true });
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    static async deleteMessage(path, msgKey) {
        await db.ref(`${path}/${msgKey}`).remove();
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    static async resetPeerChat(threadId, userId) {
        // Remove only messages from this user in the thread
        const snapshot = await db.ref(`chats/threads/${threadId}`).once('value');
        const data = snapshot.val();
        if (!data) return;
        const updates = {};
        Object.entries(data).forEach(([key, msg]) => {
            if (msg.senderId === userId) updates[key] = null;
        });
        await db.ref(`chats/threads/${threadId}`).update(updates);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    static async resetGlobalChat(userId) {
        const snapshot = await db.ref('chats/global').once('value');
        const data = snapshot.val();
        if (!data) return;
        const updates = {};
        Object.entries(data).forEach(([key, msg]) => {
            if (msg.senderId === userId) updates[key] = null;
        });
        await db.ref('chats/global').update(updates);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    // Clear ENTIRE chat (all messages, all parties)
    static async clearPeerChat(threadId) {
        await db.ref(`chats/threads/${threadId}`).remove();
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    static async clearGlobalChat() {
        await db.ref('chats/global').remove();
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    static async commitStatus(userId, userName, text, userImage, extra = {}) {
        const item = {
            id: Date.now(),
            senderId: userId,
            senderName: userName,
            senderImage: userImage || '/assets/favicon.png',
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            milestone: extra.milestone || null
        };
        await db.ref('chats/statusFeed').push(item);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));

        // --- REACTIVE ACHIEVEMENT CHECK ---
        if (window.AchievementsEngine) {
            window.AchievementsEngine.checkAll(senderId);
        }

        return item;
    }

    static async markAsSeen(channel, threadIdOrKey, userId) {
        let path = '';
        if (channel === 'peer') path = `chats/threads/${threadIdOrKey}`;
        else if (channel === 'global') path = 'chats/global';
        else if (channel === 'status') path = 'chats/statusFeed';

        const snapshot = await db.ref(path).once('value');
        const data = snapshot.val();
        if (!data) return;

        const updates = {};
        Object.entries(data).forEach(([key, msg]) => {
            if (msg.senderId !== userId && (!msg.seenBy || !msg.seenBy[userId])) {
                updates[`${key}/seenBy/${userId}`] = Date.now();
            }
        });

        if (Object.keys(updates).length > 0) {
            await db.ref(path).update(updates);
        }
    }

    static async getMessageInfo(channel, threadId, msgKey) {
        let path = '';
        if (channel === 'peer') path = `chats/threads/${threadId}/${msgKey}`;
        else if (channel === 'global') path = `chats/global/${msgKey}`;
        else if (channel === 'status') path = `chats/statusFeed/${msgKey}`;

        const snapshot = await db.ref(path).once('value');
        return snapshot.val();
    }

    static subscribeToStatusFeedLive(callback) {
        const ref = db.ref('chats/statusFeed');
        const handler = (snapshot) => {
            const data = snapshot.val();
            if (!data) { callback([]); return; }
            const msgs = Object.entries(data).map(([key, val]) => ({ ...val, _key: key }));
            callback(msgs.reverse()); // Latest first
        };
        ref.on('value', handler);
        return () => ref.off('value', handler);
    }

    static async sendBroadcast(adminName, text) {
        return this.sendGlobalMessage('HQ', adminName, `[HQ DIRECTIVE] ${text}`);
    }

    static async markAttendance(userId) {
        try {
            const safeId = userId.toString().toLowerCase();
            const member = await this.getMemberById(safeId);
            if (!member) return false;

            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // 2. Identify Status
            let status = 'present';
            const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0'); // Ensure HH:MM format
            const [hh, mm] = timeStr.split(':').map(Number);
            const totalMinutes = hh * 60 + mm;

            if (totalMinutes >= 570 && totalMinutes <= 600) { // 09:30 - 10:00
                status = 'late';
            }


            // 1. Update Global Daily Node (for Mission Log daily view)
            const log = {
                memberId: userId,
                memberName: member.name,
                status: status,
                timestamp: Date.now(),
                time: time
            };
            await db.ref(`attendance/${today}/${safeId}`).set(log);

            // 2. Update Member's Personal Node (for Streaks & Milestones)
            let attendance = {};
            if (Array.isArray(member.attendance)) {
                // Migrate legacy array data
                member.attendance.forEach(d => {
                    if (d && typeof d === 'string') {
                        attendance[d] = { status: 'present', time: '09:00 AM', migrated: true };
                    }
                });
            } else if (member.attendance && typeof member.attendance === 'object') {
                attendance = member.attendance;
            }

            if (!attendance[today]) {
                attendance[today] = { status, time, timestamp: Date.now() };
                await db.ref(`members/${safeId}`).update({ attendance });

                // --- REACTIVE ACHIEVEMENT CHECK ---
                if (window.AchievementsEngine) {
                    window.AchievementsEngine.checkAll(safeId);
                }
            }

            window.dispatchEvent(new CustomEvent('coffeecrews_data_update', { detail: { id: safeId } }));
            return true;
        } catch (e) {
            console.error("Failed to mark attendance:", e);
            return false;
        }
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
        if (!val) return [];
        // Handle both array (legacy) and object (keyed) formats
        const arr = Array.isArray(val) ? val : Object.values(val);
        return arr.filter(r => r && r.id).reverse();
    }

    static async savePasscodeRequests(requests) {
        // Save as an object keyed by request id to avoid Firebase array corruption
        const obj = {};
        requests.forEach(r => { if (r && r.id) obj[r.id] = r; });
        await db.ref('requests').set(obj);
        window.dispatchEvent(new CustomEvent('cc_security_update'));
    }

    static async submitPasscodeRequest(memberId, memberName, currentPass, newPass) {
        const member = await this.getMemberById(memberId);
        if (!member) return { success: false, message: "Member not found." };

        const storedPass = member.passcode || member.ccCode;
        if (storedPass !== currentPass) return { success: false, message: "Current passcode is incorrect." };

        const safeId = memberId.toString().toLowerCase();

        // 1. Immediately update the passcode in Firebase so login works right away
        await db.ref(`members/${safeId}/passcode`).set(newPass);

        // 2. Log the request for HQ records
        const reqId = 'REQ-' + Math.floor(Math.random() * 90000 + 10000);
        const newReq = {
            id: reqId,
            memberId,
            memberName,
            currentPass,
            newPass,
            status: 'approved',  // Auto-approved since passcode is already changed
            date: new Date().toLocaleString()
        };
        await db.ref(`requests/${reqId}`).set(newReq);

        // 3. Mark flag on member record (Unlocks "Rule Breaker" achievement)
        await db.ref(`members/${safeId}/passcodeChanged`).set(true);

        // Trigger achievement check instantly after submission
        if (window.AchievementsEngine) {
            window.AchievementsEngine.checkAll(safeId);
        }

        return { success: true, message: "Passcode updated successfully! You can now login with your new code." };
    }

    static async approvePasscodeRequest(requestId) {
        const requests = await this.getPasscodeRequests();
        const req = requests.find(r => r.id === requestId);

        if (req) {
            // Update the member using the direct ID-keyed update (corrected persist path)
            const success = await this.updateMember(req.memberId, { passcode: req.newPass });

            if (success) {
                req.status = 'approved';
                await this.savePasscodeRequests(requests);
                window.dispatchEvent(new CustomEvent('coffeecrews_security_update'));
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
            const messages = data ? Object.entries(data).map(([k, v]) => ({ ...v, _key: k })) : [];
            callback(messages);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static subscribeToGlobalChat(callback) {
        const ref = db.ref('chats/global');
        const listener = (snapshot) => {
            const data = snapshot.val();
            const messages = data ? Object.entries(data).map(([k, v]) => ({ ...v, _key: k })) : [];
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
            // Filter out any null/invalid entries (e.g. Firebase array remnants without name/id)
            const valid = list.filter(m => m && m.id && m.name && m.name !== 'undefined');
            callback(valid);
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

    // ─── ADMIN GROUP CHAT ────────────────────────────────────────────────────
    static async sendAdminGroupMessage(senderId, senderName, senderImage, text, extra = {}) {
        const message = {
            id: Date.now(),
            senderId,
            senderName,
            senderImage: senderImage || '/assets/favicon.png',
            text: text || null,
            image: extra.image || null,
            audioUrl: extra.audioUrl || null,
            fileUrl: extra.fileUrl || null,
            fileType: extra.fileType || null,
            fileName: extra.fileName || null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            replyTo: extra.replyTo || null,
            seenBy: { [senderId]: Date.now() }
        };
        await db.ref('chats/admin').push(message);
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
        return message;
    }

    static subscribeToAdminChat(callback) {
        const ref = db.ref('chats/admin');
        const listener = (snapshot) => {
            const data = snapshot.val();
            if (!data) { callback([]); return; }
            const msgs = Object.entries(data).map(([key, val]) => ({ ...val, _key: key }));
            callback(msgs);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }

    static async clearAdminChat() {
        await db.ref('chats/admin').remove();
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    // ─── CC LIVE FEED ───────────────────────────────────────────────────────
    // Push a message/directive to the shared live feed (Home tab)
    static async pushToLiveFeed(entry) {
        const item = {
            id: Date.now(),
            senderId: entry.senderId || 'HQ',
            senderName: entry.senderName || 'HQ COMMAND',
            text: entry.text || null,
            image: entry.image || null,
            audioUrl: entry.audioUrl || null,
            type: entry.type || 'directive', // 'directive' | 'broadcast' | 'status'
            recipientId: entry.recipientId || null, // null = global
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };
        await db.ref('chats/liveFeed').push(item);
        return item;
    }

    static subscribeToLiveFeed(callback) {
        const ref = db.ref('chats/liveFeed').orderByChild('timestamp').limitToLast(50);
        const listener = (snapshot) => {
            const data = snapshot.val();
            if (!data) { callback([]); return; }
            const items = Object.entries(data)
                .map(([key, val]) => ({ ...val, _key: key }))
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            callback(items);
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

    // ─── MILESTONES / ACHIEVEMENTS GATING ────────────────────────────────────
    /**
     * Permanent unlock for full release.
     * Replaces old time-gate and setting-flag logic.
     */
    static async checkMilestonesUnlockStatus() {
        // Feature is now live for all users permanently
        return true;
    }

    /**
     * Mark milestones as unlocked in global settings.
     * Legacy support for launch button (can be called but now checkMilestonesUnlockStatus overrides it).
     */
    static async unlockMilestones() {
        try {
            await db.ref('settings/milestonesUnlocked').set(true);
            return true;
        } catch (e) {
            console.error("Failed to unlock milestones:", e);
            return false;
        }
    }
}

// Global sync on load
DataManager.syncPermanentCodes();

// Export for use in other scripts
window.DataManager = DataManager;

// ─── EMAIL NOTIFIER (Web3Forms — free, no EmailJS) ────────────────────────────
// Register at https://web3forms.com to get your ACCESS KEY
// The key is tied to your email — all notifications will be sent from/to it.
const WEB3FORMS_ACCESS_KEY = '9488a5c6-f018-425d-887d-89b55d406a38';

class EmailNotifier {
    // Send an email notification to a single recipient email
    static async sendEmail({ toEmail, toName, subject, message }) {
        if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
            console.warn('[EmailNotifier] Web3Forms access key not set. Skipping email.');
            return false;
        }
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    to: toEmail,
                    name: toName || 'CoffeeCrews Member',
                    subject: subject || '📡 CoffeeCrews HQ Notification',
                    message: message
                })
            });
            const data = await res.json();
            return data.success === true;
        } catch (e) {
            console.error('[EmailNotifier] Email failed:', e);
            return false;
        }
    }

    // Notify ALL crew members with an email on file
    static async notifyAll({ subject, message, senderName }) {
        const members = await DataManager.getAllMembers();
        const emailMembers = members.filter(m => m.contact?.email && m.contact.email !== '#');
        const body = `${message}\n\n— Sent by: ${senderName || 'HQ Command'}\nCoffeeCrews Platform`;
        const promises = emailMembers.map(m => this.sendEmail({
            toEmail: m.contact.email,
            toName: m.name,
            subject,
            message: `Hi ${m.name},\n\n${body}`
        }));
        const results = await Promise.allSettled(promises);
        const sent = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
        console.log(`[EmailNotifier] Sent to ${sent}/${emailMembers.length} members`);
        return sent;
    }

    // Notify a specific member by their member ID
    static async notifyMember(memberId, { subject, message, senderName }) {
        const member = await DataManager.getMemberById(memberId);
        if (!member || !member.contact?.email || member.contact.email === '#') return false;
        return this.sendEmail({
            toEmail: member.contact.email,
            toName: member.name,
            subject,
            message: `Hi ${member.name},\n\n${message}\n\n— ${senderName || 'HQ Command'}\nCoffeeCrews Platform`
        });
    }

    // Notify all admins only
    static async notifyAdmins({ subject, message, senderName }) {
        const members = await DataManager.getAllMembers();
        const adminIds = ['vishnu', 'prasanna', 'dharani', 'kiran'];
        const admins = members.filter(m =>
            (m.access === 'admin' || adminIds.includes(m.id)) &&
            m.contact?.email && m.contact.email !== '#'
        );
        const body = `${message}\n\n— ${senderName || 'Admin Group'}\nCoffeeCrews Admin Channel`;
        const promises = admins.map(m => this.sendEmail({
            toEmail: m.contact.email,
            toName: m.name,
            subject,
            message: `Hi ${m.name},\n\n${body}`
        }));
        const results = await Promise.allSettled(promises);
        return results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    }
}

window.EmailNotifier = EmailNotifier;


/**
 * Gamification & Achievement Engine
 * Analyzes mathematical milestones and pushes unlock events
 */
const ACHIEVEMENT_DEFINITIONS = {
    // ---- ATTENDANCE STREAKS ----
    'streak_25': { category: 'streak', title: 'Relentless Base', desc: 'Maintain a 25-day continuous attendance streak.', icon: 'fa-fire', color: '#ff6600', target: 25, statKey: 'streak' },
    'streak_50': { category: 'streak', title: 'Unbroken Rhythm', desc: 'Maintain a 50-day continuous attendance streak.', icon: 'fa-bolt', color: '#ff9900', target: 50, statKey: 'streak' },
    'streak_100': { category: 'streak', title: 'The Century Mark', desc: 'Maintain a 100-day continuous attendance streak.', icon: 'fa-medal', color: '#ffd700', target: 100, statKey: 'streak' },
    'streak_200': { category: 'streak', title: 'Iron Will', desc: 'Maintain a 200-day continuous attendance streak.', icon: 'fa-dumbbell', color: '#ffb300', target: 200, statKey: 'streak' },

    // ---- TENURE (LOYALTY) ----
    'tenure_1yr': { category: 'tenure', title: 'Veteran Bean', desc: 'Active CoffeeCrews member for 1 Year.', icon: 'fa-award', color: '#ff003c', target: 1, statKey: 'tenure' },
    'tenure_2yr': { category: 'tenure', title: 'Caffeine Elder', desc: 'Active CoffeeCrews member for 2 Years.', icon: 'fa-crown', color: '#ff003c', target: 2, statKey: 'tenure' },

    // ---- DRAFTING (MESSAGES) ----
    'draft_1': { category: 'drafting', title: 'Breaking the Ice', desc: 'Drafted your first Status Feed update.', icon: 'fa-comment-dots', color: '#3cff7d', target: 1, statKey: 'vocalistCount' },
    'draft_10': { category: 'drafting', title: 'Chatterbox', desc: 'Sent 10 updates to the Status Feed.', icon: 'fa-bullhorn', color: '#3cff7d', target: 10, statKey: 'vocalistCount' },
    'draft_20': { category: 'drafting', title: 'Active Reporter', desc: 'Sent 20 updates to the Status Feed.', icon: 'fa-paper-plane', color: '#3cff7d', target: 20, statKey: 'vocalistCount' },
    'draft_50': { category: 'drafting', title: 'Vocal Operator', desc: 'Sent 50 Status Updates.', icon: 'fa-walkie-talkie', color: '#00f3ff', target: 50, statKey: 'vocalistCount' },
    'draft_75': { category: 'drafting', title: 'Signal Master', desc: 'Sent 75 Status Updates.', icon: 'fa-broadcast-tower', color: '#00f3ff', target: 75, statKey: 'vocalistCount' },
    'draft_100': { category: 'drafting', title: 'Keyboard Warrior', desc: 'Drafted 100 Status Updates.', icon: 'fa-keyboard', color: '#ffd700', target: 100, statKey: 'vocalistCount' },
    'draft_150': { category: 'drafting', title: 'Information Hub', desc: 'Sent 150 Status Updates.', icon: 'fa-network-wired', color: '#ffd700', target: 150, statKey: 'vocalistCount' },
    'draft_200': { category: 'drafting', title: 'Ops Architect', desc: 'Sent 200 Status Updates.', icon: 'fa-microchip', color: '#ffd700', target: 200, statKey: 'vocalistCount' },
    'draft_300': { category: 'drafting', title: 'System Pulse', desc: 'Sent 300 Status Updates.', icon: 'fa-heartbeat', color: '#ff003c', target: 300, statKey: 'vocalistCount' },
    'draft_400': { category: 'drafting', title: 'Core Processor', desc: 'Sent 400 Status Updates.', icon: 'fa-brain', color: '#ff003c', target: 400, statKey: 'vocalistCount' },
    'draft_500': { category: 'drafting', title: 'The Oracle', desc: 'Drafted 500 Status Updates.', icon: 'fa-eye', color: '#9d00ff', target: 500, statKey: 'vocalistCount' },

    // ---- MONTHLY PERFECT ----
    'monthly_perfect': { category: 'monthly', title: 'Flawless Month', desc: 'Attended every single day in a previous calendar month.', icon: 'fa-calendar-check', color: '#0aff78', target: 1, statKey: 'monthly' },
    'march_2026_perfect': { category: 'monthly', title: 'Flawless March', desc: 'Attended every single day in March 2026.', icon: 'fa-clover', color: '#00ffcc', target: 31, statKey: 'march2026' },

    // ---- INFAMOUS (LATE LOGINS) ----
    'late_5': { category: 'late', title: 'Lazy Master (Initiate)', desc: 'Logged in late 5 times.', icon: 'fa-bed', color: '#ff003c', target: 5, statKey: 'lateCount' },
    'late_10': { category: 'late', title: 'Lazy Master (Expert)', desc: 'Logged in late 10 times.', icon: 'fa-bed-pulse', color: '#ff003c', target: 10, statKey: 'lateCount' },
    'late_20': { category: 'late', title: 'Lazy Master (Veteran)', desc: 'Logged in late 20 times.', icon: 'fa-couch', color: '#ff003c', target: 20, statKey: 'lateCount' },
    'late_50': { category: 'late', title: 'Ultimate Lazy Master', desc: 'Logged in late 50 times.', icon: 'fa-ghost', color: '#ff003c', target: 50, statKey: 'lateCount' },

    // ---- SECURITY ----
    'passcode_change': { category: 'security', title: 'Rule Breaker', desc: 'Changed your initial secure passcode.', icon: 'fa-user-secret', color: '#3cff7d', target: 1, statKey: 'passcode' }
};

class AchievementsEngine {

    static async checkAllMembers() {
        const members = await DataManager.getAllMembers();
        const promises = members.map(m => this.checkAll(m.id));
        await Promise.allSettled(promises);
        console.log("Achievements synced for all members.");
        return true;
    }

    static async checkAll(userId) {
        if (!userId) return null;
        const safeId = userId.toString().toLowerCase();

        try {
            const member = await DataManager.getMemberById(safeId);
            if (!member) return null;

            const earnedIds = member.achievements || [];
            let newUnlocks = [];

            // --- GATHER STATS ---
            let attendanceObj = {};
            if (Array.isArray(member.attendance)) {
                member.attendance.forEach(d => { if (typeof d === 'string') attendanceObj[d] = { status: 'present' }; });
            } else if (member.attendance && typeof member.attendance === 'object') {
                attendanceObj = member.attendance;
            }

            const attendances = Object.values(attendanceObj);
            const attendanceDates = Object.keys(attendanceObj).sort();
            const lateLogins = attendances.filter(a => a.status === 'late').length;

            // 1. Longest Streak Calculation
            let currentStreak = 0;
            let maxStreak = 0;
            if (attendanceDates.length > 0) {
                let prev = new Date(attendanceDates[0]);
                currentStreak = 1;
                maxStreak = 1;
                for (let i = 1; i < attendanceDates.length; i++) {
                    let curr = new Date(attendanceDates[i]);
                    let diff = (curr - prev) / (1000 * 60 * 60 * 24);
                    if (diff === 1) {
                        currentStreak++;
                    } else if (diff > 1) {
                        currentStreak = 1;
                    }
                    if (currentStreak > maxStreak) maxStreak = currentStreak;
                    prev = curr;
                }
            }

            // 2. Monthly Perfection Check
            const now = new Date();
            const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const pmYear = prevMonthDate.getFullYear();
            const pmMonth = prevMonthDate.getMonth();
            const daysInPrevMonth = new Date(pmYear, pmMonth + 1, 0).getDate();

            let perfectCount = 0;
            for (let d = 1; d <= daysInPrevMonth; d++) {
                const dayStr = `${pmYear}-${String(pmMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                if (attendanceObj[dayStr]) perfectCount++;
            }
            const isPrevMonthPerfect = perfectCount === daysInPrevMonth;

            // 2b. Current Month (March 2026) Perfection Check
            let march2026Count = 0;
            const isMarch2026 = now.getFullYear() === 2026 && now.getMonth() === 2; // March is 2
            if (isMarch2026) {
                for (let d = 1; d <= now.getDate(); d++) {
                    const dayStr = `2026-03-${String(d).padStart(2, '0')}`;
                    if (attendanceObj[dayStr]) march2026Count++;
                }
            } else if (now.getFullYear() > 2026 || (now.getFullYear() === 2026 && now.getMonth() > 2)) {
                // If past March, check if it was perfect
                for (let d = 1; d <= 31; d++) {
                    const dayStr = `2026-03-${String(d).padStart(2, '0')}`;
                    if (attendanceObj[dayStr]) march2026Count++;
                }
            }
            const isMarchPerfect = march2026Count === 31;

            // 3. Drafting Count (Sync with Analytics - Status Feed + HQ Transmissions)
            let drafts = 0;
            try {
                // Count status feed updates
                const statusFeedRaw = await db.ref('chats/statusFeed').once('value');
                if (statusFeedRaw.exists()) {
                    const statuses = Object.values(statusFeedRaw.val());
                    drafts += statuses.filter(s => s.senderId && s.senderId.toString().toLowerCase() === safeId).length;
                }

                // Count messages sent to HQ (Private Threads)
                const threadId = DataManager.getThreadId(safeId, 'HQ');
                const hqThreadRaw = await db.ref(`chats/threads/${threadId}`).once('value');
                if (hqThreadRaw.exists()) {
                    const messages = Object.values(hqThreadRaw.val());
                    // Only count messages SENT by the user, not HQ responses
                    drafts += messages.filter(m => m.senderId && m.senderId.toString().toLowerCase() === safeId).length;
                }
            } catch (err) {
                console.warn("Drafting count partial failure:", err);
            }

            // 4. Tenure Math
            const joinedAt = member.joinDate ? new Date(member.joinDate) : new Date(member.timestamp || Date.now());
            const yearsActive = (Date.now() - joinedAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

            // --- EVALUATE UNLOCKS ---
            const tryUnlock = (id, condition) => {
                if (condition && !earnedIds.includes(id)) {
                    earnedIds.push(id);
                    newUnlocks.push(id);
                }
            };

            tryUnlock('streak_25', maxStreak >= 25);
            tryUnlock('streak_50', maxStreak >= 50);
            tryUnlock('streak_100', maxStreak >= 100);
            tryUnlock('streak_200', maxStreak >= 200);

            tryUnlock('tenure_1yr', yearsActive >= 1);
            tryUnlock('tenure_2yr', yearsActive >= 2);

            tryUnlock('draft_1', drafts >= 1);
            tryUnlock('draft_10', drafts >= 10);
            tryUnlock('draft_20', drafts >= 20);
            tryUnlock('draft_50', drafts >= 50);
            tryUnlock('draft_75', drafts >= 75);
            tryUnlock('draft_100', drafts >= 100);
            tryUnlock('draft_150', drafts >= 150);
            tryUnlock('draft_200', drafts >= 200);
            tryUnlock('draft_300', drafts >= 300);
            tryUnlock('draft_400', drafts >= 400);
            tryUnlock('draft_500', drafts >= 500);

            tryUnlock('late_5', lateLogins >= 5);
            tryUnlock('late_10', lateLogins >= 10);
            tryUnlock('late_20', lateLogins >= 20);
            tryUnlock('late_50', lateLogins >= 50);

            tryUnlock('monthly_perfect', isPrevMonthPerfect);
            tryUnlock('march_2026_perfect', isMarchPerfect);
            tryUnlock('passcode_change', member.passcodeChanged === true);

            // --- PERSIST STATS & UNLOCKS ---
            const stats = {
                streak: maxStreak,
                vocalistCount: drafts,
                lateCount: lateLogins,
                tenure: yearsActive,
                march2026: march2026Count,
                achievements: earnedIds,
                _skipAchievementCheck: true // CRITICAL: Stop infinite recursion
            };

            // Use DataManager to persist to the main 'members' node
            await DataManager.updateMember(safeId, stats);

            // --- DISPATCH UNLOCKS (with persistent guard) ---
            if (newUnlocks.length > 0) {
                const storageKey = `cc_milestone_notified_${safeId}`;
                const notified = JSON.parse(localStorage.getItem(storageKey) || '[]');

                newUnlocks.forEach(id => {
                    // Only pop if NOT already notified
                    if (!notified.includes(id)) {
                        const def = ACHIEVEMENT_DEFINITIONS[id];
                        // Dispatch with userId and achievementId for listener filtering
                        window.dispatchEvent(new CustomEvent('cc_achievement_unlocked', {
                            detail: {
                                userId: safeId,
                                achievementId: id,
                                ...def
                            }
                        }));
                        notified.push(id);
                    }
                });

                localStorage.setItem(storageKey, JSON.stringify(notified));
            }

            return stats;

        } catch (e) {
            console.error("Achievement Engine Failed:", e);
            return null;
        }
    }
}

window.ACHIEVEMENT_DEFINITIONS = ACHIEVEMENT_DEFINITIONS;
window.AchievementsEngine = AchievementsEngine;
