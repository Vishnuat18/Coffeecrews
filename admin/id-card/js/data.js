/**
 * ID Card System Data Layer
 * Handles member data persistence using localStorage
 */

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
    static DATA_VERSION = '1.2'; // Increment to force data refreshes

    static getAllMembers() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            const version = localStorage.getItem(this.STORAGE_KEY + '_version');

            if (!stored || version !== this.DATA_VERSION) {
                // If version mismatch or new install, merge core roles but keep attendance
                let currentData = stored ? JSON.parse(stored) : [];

                // Force Update Core Admins
                const coreAdmins = ['vishnu', 'prasanna', 'dharani'];
                const updatedMembers = INITIAL_MEMBERS.map(initial => {
                    const existing = currentData.find(m => m.id === initial.id);
                    if (existing) {
                        // Keep attendance and other user-modified data, but update core roles/access
                        return { ...initial, attendance: existing.attendance || [] };
                    }
                    return initial;
                });

                this.saveAllMembers(updatedMembers);
                localStorage.setItem(this.STORAGE_KEY + '_version', this.DATA_VERSION);
                return updatedMembers;
            }
            return JSON.parse(stored);
        } catch (e) {
            console.error("LocalStorage access failed:", e);
            return INITIAL_MEMBERS;
        }
    }

    static getMemberById(id) {
        const members = this.getAllMembers();
        if (!id) return null;
        return members.find(m => m.id.toLowerCase() === id.toLowerCase());
    }

    static saveAllMembers(members) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(members));
    }

    static updateMember(id, updatedData) {
        const members = this.getAllMembers();
        const index = members.findIndex(m => m.id === id);
        if (index !== -1) {
            members[index] = { ...members[index], ...updatedData };
            this.saveAllMembers(members);
            window.dispatchEvent(new CustomEvent('coffeecrews_data_update', { detail: { id } }));
            return true;
        }
        return false;
    }

    static deleteMember(id) {
        const members = this.getAllMembers();
        const filtered = members.filter(m => m.id !== id);
        if (members.length !== filtered.length) {
            this.saveAllMembers(filtered);
            window.dispatchEvent(new CustomEvent('coffeecrews_data_update', { detail: { id } }));
            return true;
        }
        return false;
    }

    // --- CHAT SYSTEM (STABILIZED) ---

    static getChatStore() {
        return JSON.parse(localStorage.getItem(this.CHAT_KEY) || '{"threads": {}, "global": [], "statusFeed": []}');
    }

    static saveChatStore(store) {
        localStorage.setItem(this.CHAT_KEY, JSON.stringify(store));
        window.dispatchEvent(new CustomEvent('cc_chat_sync'));
    }

    /**
     * Get unique thread ID for two users (alphabetical order)
     */
    static getThreadId(id1, id2) {
        return [id1, id2].sort().join('_').toLowerCase();
    }

    /**
     * Fetch messages for a specific thread (Private or HQ)
     */
    static getMessages(threadId) {
        const store = this.getChatStore();
        return store.threads[threadId] || [];
    }

    /**
     * Send message to a targeted thread (supports text and image)
     */
    static sendMessage(senderId, receiverId, text, image = null) {
        const store = this.getChatStore();
        const threadId = this.getThreadId(senderId, receiverId);

        if (!store.threads[threadId]) store.threads[threadId] = [];

        const message = {
            id: Date.now(),
            senderId: senderId,
            text,
            image,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };

        store.threads[threadId].push(message);
        this.saveChatStore(store);
        return message;
    }

    /**
     * Send message to Global Operations channel
     */
    static sendGlobalMessage(senderId, senderName, text, image = null) {
        const store = this.getChatStore();
        const message = {
            id: Date.now(),
            senderId,
            senderName,
            text,
            image,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };

        store.global.push(message);
        // Keep only last 50 for performance
        if (store.global.length > 50) store.global.shift();

        this.saveChatStore(store);
        return message;
    }

    static getGlobalMessages() {
        return this.getChatStore().global;
    }

    /**
     * GLOBAL MISSION FEED: Commit a status update to the entire crew
     */
    static commitStatus(senderId, senderName, text, senderImage, statusImage = null) {
        const store = this.getChatStore();
        if (!store.statusFeed) store.statusFeed = [];

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

        store.statusFeed.unshift(statusUpdate); // Newest first
        if (store.statusFeed.length > 20) store.statusFeed.pop();

        this.saveChatStore(store);
        return statusUpdate;
    }

    static getStatusFeed() {
        return this.getChatStore().statusFeed || [];
    }

    /**
     * Admin Broadcast: Sends to Global channel as HQ
     */
    static sendBroadcast(adminName, text) {
        return this.sendGlobalMessage('HQ', adminName, `[HQ DIRECTIVE] ${text}`);
    }

    static markAttendance(id) {
        const member = this.getMemberById(id);
        if (!member) return false;

        const today = new Date().toISOString().split('T')[0];
        if (!member.attendance) member.attendance = [];

        if (member.attendance.includes(today)) return false;

        member.attendance.push(today);
        return this.updateMember(id, { attendance: member.attendance });
    }

    // --- SECURITY & PASSCODE REQUESTS ---

    static getPasscodeRequests() {
        return JSON.parse(localStorage.getItem(this.REQUESTS_KEY) || '[]');
    }

    static savePasscodeRequests(requests) {
        localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
        window.dispatchEvent(new CustomEvent('cc_security_update'));
    }

    static submitPasscodeRequest(memberId, memberName, currentPass, newPass) {
        const requests = this.getPasscodeRequests();

        // Basic validation
        const member = this.getMemberById(memberId);
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

        requests.unshift(newRequest);
        this.savePasscodeRequests(requests);
        return { success: true, message: "Passcode change request submitted to HQ." };
    }

    static approvePasscodeRequest(requestId) {
        const requests = this.getPasscodeRequests();
        const index = requests.findIndex(r => r.id === requestId);

        if (index !== -1 && requests[index].status === 'pending') {
            const req = requests[index];
            const updated = this.updateMember(req.memberId, { ccCode: req.newPass });

            if (updated) {
                requests[index].status = 'approved';
                this.savePasscodeRequests(requests);
                return { success: true, message: "Request approved. CC Code updated." };
            }
        }
        return { success: false, message: "Approval failed." };
    }

    static rejectPasscodeRequest(requestId) {
        const requests = this.getPasscodeRequests();
        const index = requests.findIndex(r => r.id === requestId);

        if (index !== -1 && requests[index].status === 'pending') {
            requests[index].status = 'rejected';
            this.savePasscodeRequests(requests);
            return { success: true, message: "Request rejected." };
        }
        return { success: false, message: "Rejection failed." };
    }
}

// Export for use in other scripts
window.DataManager = DataManager;
