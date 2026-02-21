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

const INITIAL_MEMBERS = [
    {
        id: "vishnu",
        ccCode: "1418",
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
        ccCode: "1444",
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
        ccCode: "2713",
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

    // --- RECRUITMENT SYSTEM ---

    static async submitApplication(appData) {
        const id = 'app_' + Date.now();
        const application = {
            id,
            ...appData,
            timestamp: new Date().toLocaleString(),
            isoDate: new Date().toISOString()
        };
        await db.ref(`applications/${id}`).set(application);
        window.dispatchEvent(new CustomEvent('cc_applications_update'));
        return id;
    }

    static async getAllApplications() {
        const snapshot = await db.ref('applications').once('value');
        const data = snapshot.val();
        return data ? Object.values(data).sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate)) : [];
    }

    static async deleteApplication(id) {
        await db.ref(`applications/${id}`).remove();
        window.dispatchEvent(new CustomEvent('cc_applications_update'));
        return true;
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
        if (!member.attendance) member.attendance = [];

        if (member.attendance.includes(today)) return false;

        member.attendance.push(today);
        return this.updateMember(id, { attendance: member.attendance });
    }

    static async getAttendanceSummary() {
        const members = await this.getAllMembers();
        const today = new Date().toISOString().split('T')[0];

        return members.map(m => ({
            id: m.id,
            name: m.name,
            role: m.role,
            presentToday: (m.attendance || []).includes(today),
            totalDays: (m.attendance || []).length,
            lastSeen: m.attendance && m.attendance.length > 0 ? m.attendance[m.attendance.length - 1] : 'Never'
        }));
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
        if (!member || member.ccCode !== currentPass) {
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
            const updated = await this.updateMember(req.memberId, { ccCode: req.newPass });
            if (updated) {
                await db.ref(`requests/${foundKey}`).update({ status: 'approved' });
                window.dispatchEvent(new CustomEvent('cc_security_update'));
                return { success: true, message: "Request approved. CC Code updated." };
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
        const ref = db.ref('statusFeed');
        const listener = (snapshot) => {
            const data = snapshot.val();
            const feed = data ? Object.values(data).reverse() : [];
            callback(feed);
        };
        ref.on('value', listener);
        return () => ref.off('value', listener);
    }
}

// Export for use in other scripts
window.DataManager = DataManager;
