/**
 * ID Card System Data Layer
 * Handles member data persistence using localStorage
 */

const INITIAL_MEMBERS = [
    {
        id: "vishnu",
        name: "Vishnu R",
        role: "Full stack Dev",
        description: "Engineering Student & Developer passionate about crafting robust, scalable web applications. Expert in Java systems and Secure Web Architectures.",
        image: "../../assets/vishnu.jpeg",
        accent: "#00f3ff",
        contact: {
            phone: "+910000000000",
            email: "vishnu@example.com",
            portfolio: "https://v-portfolio-drab.vercel.app/",
            linkedin: "#",
            github: "#"
        }
    },
    {
        id: "kiran",
        name: "Kiran Patil",
        role: "Full Stack Dev",
        description: "Specialist in Node.js and Java backends. Creator of SmartCart and complex Management Systems. 'Write Once, Run Anywhere.'",
        image: "../../assets/kiran.jpeg",
        accent: "#ff003c",
        contact: {
            phone: "+910000000000",
            email: "kiran@example.com",
            portfolio: "https://kiranpatil05.netlify.app/",
            linkedin: "#",
            github: "#"
        }
    },
    {
        id: "rohith",
        name: "Rohith S",
        role: "Front end Dev",
        description: "Focus on Front-End Design and Interactive Experiences. Creating visually engaging, responsive layouts that wow users.",
        image: "../../assets/rohith.png",
        accent: "#0aff0a",
        contact: {
            phone: "+910000000000",
            email: "rohith@example.com",
            portfolio: "https://rohith22s.github.io/portfolio-2.0/",
            linkedin: "#",
            github: "#"
        }
    },
    {
        id: "prasanna",
        name: "Prasanna S",
        role: "Founder & CEO",
        description: "Visionary leader driving the strategic direction of CoffeeCrews. Fostering innovation and building the future of tech.",
        image: "../../assets/prasanna.jpeg",
        accent: "#ffd700",
        contact: {
            phone: "#",
            email: "#",
            portfolio: "#",
            linkedin: "#",
            github: "#"
        }
    },
    {
        id: "gokul",
        name: "Gokul",
        role: "Video Editor",
        description: "Master of Motion and Visual Storytelling. Bringing static concepts to life through animation and design.",
        image: "../../assets/gokul.jpeg",
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
        id: "senthil",
        name: "Senthilnathan",
        role: "UI/UX Designer",
        description: "Creative Web Designer focusing on intuitive user interfaces and modern aesthetics. Crafting digital experiences that inspire.",
        image: "../../assets/senthil.jpeg",
        accent: "#ff5722",
        contact: {
            phone: "#",
            email: "#",
            portfolio: "#",
            linkedin: "#",
            github: "#"
        }
    },
    {
        id: "dharani",
        name: "Dharanitharan",
        role: "Founder & CEO",
        description: "Optimizing systems and driving growth. Bridging the gap between engineering excellence and strategic vision.",
        image: "../../assets/dharani.png",
        accent: "#ffd700",
        contact: {
            phone: "#",
            email: "#"
        }
    },
    {
        id: "santhosh",
        name: "Santhosh",
        role: "Prompt Engineer",
        description: "Specializing in iterative prompt design and behavior fine-tuning for complex digital assistants.",
        image: "../../cyber_neural_brain_3d_1771137317306.png",
        accent: "#b71b4d",
        contact: {
            phone: "#",
            email: "#"
        }
    },
    {
        id: "nithish",
        name: "Nithish",
        role: "Prompt Engineer",
        description: "Synthesizing data-driven insights with creative linguistic patterns to enhance AI reasoning capabilities.",
        image: "../../assets/nithish.png",
        accent: "#8fd222",
        contact: {
            phone: "#",
            email: "#"
        }
    },
    {
        id: "gc",
        name: "Gowdhama Chandran",
        role: "DB Manager",
        description: "Master of Data management. Ensuring the integrity and availability of our most critical information assets.",
        image: "../../assets/gk.png",
        accent: "#44efab",
        contact: {
            phone: "#",
            email: "#"
        }
    },
    {
        id: "akshaya",
        name: "Akshaya",
        role: "Web Designer",
        description: "UI/UX Designer creating intuitive, human-centric interfaces. Merging pixel perfection with user empathy.",
        image: "../../assets/akshaya.png",
        accent: "#f472b6",
        contact: {
            phone: "#",
            email: "#"
        }
    }
];

class DataManager {
    static STORAGE_KEY = 'coffeecrews_id_cards';

    static getAllMembers() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            this.saveAllMembers(INITIAL_MEMBERS);
            return INITIAL_MEMBERS;
        }
        return JSON.parse(stored);
    }

    static getMemberById(id) {
        const members = this.getAllMembers();
        return members.find(m => m.id === id);
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
            return true;
        }
        return false;
    }

    static deleteMember(id) {
        const members = this.getAllMembers();
        const filtered = members.filter(m => m.id !== id);
        if (filtered.length !== members.length) {
            this.saveAllMembers(filtered);
            return true;
        }
        return false;
    }
}

// Export for use in other scripts
window.DataManager = DataManager;
