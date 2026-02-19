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
        description: "Specialist in Node.js and Java backends. Creator of SmartCart and complex Management Systems. 'Write Once, Run Anywhere.'",
        image: "/assets/kiran.jpeg",
        accent: "#ff003c",
        contact: {
            phone: "+918610641610",
            email: "kiranbalasopatil33@gmail.com",
            portfolio: "https://kiranpatil05.netlify.app/",
            linkedin: "https://www.linkedin.com/in/kiran-balaso-patil-851a43351",
            github: "https://github.com/KiranBalasoPatil3052006"
        }
    },
    {
        id: "rohith",
        ccCode: "2244",
        name: "Rohith S",
        role: "Front end Dev",
        description: "Focus on Front-End Design and Interactive Experiences. Creating visually engaging, responsive layouts that wow users.",
        image: "/assets/rohith.png",
        accent: "#0aff0a",
        contact: {
            phone: "+917530019229",
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
        description: "Visionary leader driving the strategic direction of CoffeeCrews. Fostering innovation and building the future of tech.",
        image: "/assets/prasanna.jpeg",
        accent: "#ffd700",
        access: "admin",
        contact: {
            phone: "+916382920103",
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
        description: "Creative Web Designer focusing on intuitive user interfaces and modern aesthetics. Crafting digital experiences that inspire.",
        image: "/assets/senthil.png",
        accent: "#ff5722",
        contact: {
            phone: "+919345639455",
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
        description: "Optimizing systems and driving growth. Bridging the gap between engineering excellence and strategic vision.",
        image: "/assets/dharani.png",
        accent: "#ffd700",
        access: "admin",
        contact: {
            phone: "+917010971323",
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
        description: "Master of Data management. Ensuring the integrity and availability of our most critical information assets.",
        image: "/assets/gk.png",
        accent: "#44efab",
        contact: {
            phone: "+917639013065",
            email: "gc2005.kk@gmail.com",
            portfolio: "#",
            linkedin: "https://www.linkedin.com/in/gowdhama-chandhran-k",
            github: "https://github.com/gc2005kk"
        }
    },
    {
        id: "gokul",
        ccCode: "3021",
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
        id: "santhosh",
        ccCode: "7642",
        name: "Santhosh",
        role: "Prompt Engineer",
        description: "Specializing in iterative prompt design and behavior fine-tuning for complex digital assistants.",
        image: "/assets/favicon.png",
        accent: "#b71b4d",
        contact: {
            phone: "#",
            email: "#"
        }
    },
    {
        id: "nithish",
        ccCode: "5521",
        name: "Nithish",
        role: "Prompt Engineer",
        description: "Synthesizing data-driven insights with creative linguistic patterns to enhance AI reasoning capabilities.",
        image: "/assets/nithish.png",
        accent: "#8fd222",
        contact: {
            phone: "#",
            email: "#"
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
            phone: "#",
            email: "#"
        }
    }
];

class DataManager {
    static STORAGE_KEY = 'coffeecrews_id_cards';

    static getAllMembers() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) {
                this.saveAllMembers(INITIAL_MEMBERS);
                return INITIAL_MEMBERS;
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
