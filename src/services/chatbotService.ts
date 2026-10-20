// Knowledge Base & Dual-Mode Chatbot Service for Mohammed Skikri's Portfolio

export interface ChatAction {
  label: string;
  url?: string;
  query?: string;
  scrollToId?: string; // Smooth scrolls to page section!
  icon?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actions?: ChatAction[];
  isGemini?: boolean;
}

export interface ChatSettings {
  useGemini: boolean;
  geminiApiKey: string;
  soundEnabled: boolean;
}

const SETTINGS_KEY = 'portfolio_chat_settings';

export const getChatSettings = (): ChatSettings => {
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        useGemini: !!parsed.useGemini && (!!parsed.geminiApiKey || !!envKey),
        geminiApiKey: parsed.geminiApiKey || envKey,
        soundEnabled: parsed.soundEnabled !== false,
      };
    }
  } catch (e) {
    console.error('Failed to parse chat settings', e);
  }
  return {
    useGemini: !!envKey,
    geminiApiKey: envKey,
    soundEnabled: true,
  };
};

export const saveChatSettings = (settings: Partial<ChatSettings>): ChatSettings => {
  const current = getChatSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save chat settings', e);
  }
  return updated;
};

// Mohammed's Profile Knowledge Base
export const MOHAMMED_CONTEXT = {
  name: 'Mohammed Skikri',
  title: 'Full-Stack Developer & Software Engineering Student',
  location: 'Meknes, Morocco',
  status: 'Open to new opportunities (Internships, Full-Time Roles, Freelance)',
  email: 'mohamedskikri44@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mohamed-skikri-467862299/',
  github: 'https://github.com/Skikri01',
  cvUrl: '/Mohammed_Skikri_CV.pdf',
  bio: `Mohammed Skikri is a passionate Full-Stack Developer and Software Engineering student currently pursuing a Licence Professionnelle en Génie Informatique at Sup'Management in Meknes, Morocco. He specializes in designing modern, scalable web applications with React.js, TypeScript, Node.js, Express, MongoDB, and Laravel/PHP.`,
  education: [
    {
      institution: "Sup'Management (Meknes, Morocco)",
      degree: 'Licence Professionnelle en Génie Informatique',
      period: '2025 — Present',
      details: 'Specializing in Oracle Database, Java OOP, Software Engineering, and Enterprise Architecture.'
    },
    {
      institution: "École Polytechnique des Génies (Fès, Morocco)",
      degree: "Stage Technique / Practical Engineering Internship",
      period: 'Mar 2025 — Apr 2025',
      details: 'Full-time, hybrid practical internship.'
    },
    {
      institution: 'OFPPT (Meknes, Morocco)',
      degree: 'Technicien Spécialisé en Développement Informatique (TSDI)',
      period: '2023 — 2025',
      details: 'Graduated in Web Development, Python, Tailwind CSS, Relational Databases, UML, and Agile.'
    }
  ],
  experience: [
    {
      role: 'Full-Stack Developer',
      company: "Sup'Management",
      period: '2025 – Present',
      details: 'Architecting web apps with React.js, Node.js, Express, MongoDB, JWT auth, and Cloudinary media pipelines.'
    },
    {
      role: 'Frontend & UI Specialist',
      company: 'MIZAN Luxury Store',
      period: '2025',
      details: 'Developed luxury watch e-commerce store with dark glassmorphism, instant search, slide-over cart, and MySQL backend.'
    },
    {
      role: 'Laravel Developer',
      company: 'Market Bio',
      period: '2024 – 2025',
      details: 'Engineered specialized bilingual inventory and e-commerce platform with Laravel, PHP, and MySQL.'
    },
    {
      role: 'Web Development Intern',
      company: 'OFPPT Marketplace (PFE)',
      period: '2024',
      details: 'Designed enterprise marketplace platform with role-based access control, catalog CRUD, and centralized admin panel.'
    }
  ],
  skills: {
    languages: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Java', 'PHP', 'SQL', 'HTML5', 'CSS3'],
    frontend: ['React.js', 'Vite', 'Tailwind CSS', 'Bootstrap', 'Framer Motion', 'GSAP', 'Responsive Design'],
    backend: ['Node.js', 'Express.js', 'Laravel', 'REST APIs', 'JWT Authentication', 'Multer'],
    databases: ['MongoDB', 'MySQL', 'Oracle Database', 'Mongoose', 'Cloudinary'],
    tools: ['Git', 'GitHub', 'Postman', 'Vite', 'UML', 'VS Code', 'Agile/Scrum']
  },
  languagesSpoken: [
    { language: 'Arabic', level: 'Native / Mother Tongue (100%)' },
    { language: 'French', level: 'Professional Working Proficiency' },
    { language: 'English', level: 'Professional Working Proficiency' }
  ],
  projects: [
    {
      name: 'ChoufFlix',
      category: 'Movie Streaming & Discovery Platform',
      tech: 'React.js, TypeScript, Vite, React Router, REST APIs, Lucide Icons',
      highlights: 'Live TMDB API integration with dual-layer fallback, dark modern aesthetic, watchlist persistence via LocalStorage, embedded HD YouTube trailers, and multi-filter genre search.',
      github: 'https://github.com/Skikri01/movie-explorer'
    },
    {
      name: 'Car Rental Management System',
      category: 'Full-Stack Fleet & Booking Platform',
      tech: 'Node.js, Express.js, MongoDB, React.js, Tailwind CSS, JWT, Cloudinary',
      highlights: 'Real-time vehicle booking, administrative fleet management, conflict-free booking logic, and Role-Based Access Control (RBAC).',
      github: 'https://github.com/Skikri-mohammed/Car-Rental-management-system-Full-stack'
    },
    {
      name: 'MIZAN — Luxury Watch E-Commerce',
      category: 'Full-Stack E-Commerce',
      tech: 'React.js, Node.js, Express.js, MySQL, Multer, Tailwind CSS',
      highlights: 'Glassmorphic luxury horology store, instant catalog search, real-time inventory management, slide-over cart drawer, and checkout workflows.',
      github: 'https://github.com/Skikri-mohammed/Mizan-Luxury-Watch-Store-Full-Stack'
    },
    {
      name: 'Market Bio',
      category: 'Bilingual Inventory & E-Commerce',
      tech: 'Laravel, PHP, MySQL, Bootstrap, Tailwind CSS',
      highlights: 'Bilingual (Arabic-primary) e-commerce system for bio-compounds, stock replenishment alerts, and full administrative store control.',
      github: 'https://github.com/Skikri-mohammed/Market-Bio'
    },
    {
      name: 'Interactive Glassmorphic Portfolio',
      category: 'Frontend & Interactive Engine',
      tech: 'React.js, TypeScript, GSAP, Framer Motion, HTML5, CSS3',
      highlights: 'Custom dark/light theme engine, GSAP timeline animations, responsive interactive layout, and integrated AI assistant.',
      github: 'https://github.com/Skikri01/Portfolio'
    }
  ]
};

// Normalize text for clean matching
const normalize = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove french accents
    .replace(/[?!.,;:'"()_\-#/@]/g, ' ')
    .trim();
};

// Precise and safe word matcher (Prevents short-word substring collisions like 'hire' matching 'hi'!)
const matchesWord = (word: string, target: string): boolean => {
  if (word === target) return true;
  // Short words (<= 3 chars) MUST be exact match!
  if (target.length <= 3 || word.length <= 3) {
    return word === target;
  }
  if (Math.abs(word.length - target.length) > 2) return false;

  // Levenshtein distance check for spelling variations/typos (e.g., 'projcet' -> 'project')
  let diff = 0;
  const minLen = Math.min(word.length, target.length);
  const maxLen = Math.max(word.length, target.length);
  for (let i = 0; i < minLen; i++) {
    if (word[i] !== target[i]) diff++;
  }
  diff += maxLen - minLen;
  return diff <= (target.length <= 5 ? 1 : 2);
};

const hasAnyWord = (tokens: string[], targets: string[]): boolean => {
  return tokens.some((token) => targets.some((t) => matchesWord(token, t)));
};

// Scored Intelligent Response Generator (Supports English, French, Arabic queries & typos)
export const generateLocalResponse = (query: string): { text: string; actions?: ChatAction[] } => {
  const norm = normalize(query);
  const tokens = norm.split(/\s+/).filter(Boolean);

  // 1. WHY HIRE MOHAMMED / STRENGTHS / VALUE (Check FIRST to never collide with greetings!)
  if (
    norm.includes('why hire') ||
    norm.includes('why should i hire') ||
    norm.includes('why mohammed') ||
    norm.includes('why should') ||
    norm.includes('pourquoi recruter') ||
    norm.includes('pourquoi embaucher') ||
    norm.includes('pourquoi mohammed') ||
    hasAnyWord(tokens, ['strengths', 'forces', 'qualities', 'avantages'])
  ) {
    return {
      text: `Here is why **Mohammed Skikri** is a standout hire for your engineering team:\n\n✨ **True Full-Stack Versatility**: Proven ability to architect both sleek modern frontends (*React 18, TypeScript, Tailwind, GSAP*) and resilient backends (*Node.js, Express, MongoDB, Laravel, MySQL*).\n🛡️ **Engineering Rigor**: Focus on clean architecture, eliminating concurrency bugs (like booking overlaps in the Car Rental system), and secure RBAC/JWT pipelines.\n⚡ **Fast Learner & Adaptable**: Consistently ranks at the top of academic challenges at Sup'Management & OFPPT, rapidly mastering new tools and frameworks.\n🤝 **Clear Communication**: Fluent in Arabic, French, and English, comfortable collaborating in cross-functional or international teams.`,
      actions: [
        { label: '📄 Download CV', query: 'Can I download your CV?' },
        { label: '🚀 View Projects', query: 'What are your top projects?', scrollToId: 'projects' },
        { label: '✉️ Get in Touch', query: 'How can I contact Mohammed?', scrollToId: 'contact' }
      ]
    };
  }

  // 2. HIRING / RECRUITMENT / AVAILABILITY / OPEN TO WORK
  if (
    hasAnyWord(tokens, ['hire', 'hiring', 'recruter', 'embaucher', 'freelance', 'recruitment', 'recrutez']) ||
    norm.includes('available') ||
    norm.includes('disponible') ||
    norm.includes('disponibilite') ||
    norm.includes('open to work') ||
    norm.includes('full time') ||
    norm.includes('part time') ||
    norm.includes('looking for job') ||
    norm.includes('looking for work') ||
    norm.includes('توظيف') ||
    norm.includes('متاح للعمل')
  ) {
    return {
      text: `Yes! Mohammed is currently **Open to new opportunities**:\n\n• 💼 **Internships (Stages PFE / Pré-embauche)**\n• 🚀 **Junior Full-Stack / Frontend / Backend Developer Roles**\n• 💻 **Freelance Projects & Custom Web Applications**\n• 📍 Available for on-site positions in Morocco or remote worldwide.\n\nFeel free to reach out via email or LinkedIn to discuss opportunities!`,
      actions: [
        { label: '✉️ Email Mohammed', url: `mailto:${MOHAMMED_CONTEXT.email}`, icon: 'bx-envelope' },
        { label: '💼 LinkedIn Profile', url: MOHAMMED_CONTEXT.linkedin, icon: 'bxl-linkedin' },
        { label: '⬇️ Contact Form', scrollToId: 'contact', icon: 'bx-down-arrow-alt' }
      ]
    };
  }

  // 3. CV / RESUME DOWNLOAD (EN, FR, AR)
  if (
    tokens.includes('cv') ||
    hasAnyWord(tokens, ['resume', 'curriculum', 'telecharger', 'download', 'pdf']) ||
    norm.includes('telecharger cv') ||
    norm.includes('ton cv') ||
    norm.includes('mon cv') ||
    norm.includes('see cv') ||
    norm.includes('get cv') ||
    norm.includes('سيرة')
  ) {
    return {
      text: `You can view or download Mohammed's official Curriculum Vitae directly:\n\n📄 **[Mohammed_Skikri_CV.pdf](${MOHAMMED_CONTEXT.cvUrl})**\n\nIt contains his verified academic degrees, full-stack tech stack, and comprehensive project history.`,
      actions: [
        { label: '📥 Download CV (PDF)', url: MOHAMMED_CONTEXT.cvUrl, icon: 'bx-download' },
        { label: '📬 Contact Mohammed', query: 'How can I contact Mohammed?', scrollToId: 'contact' },
        { label: '🚀 Top Projects', query: 'What are your top projects?', scrollToId: 'projects' }
      ]
    };
  }

  // 4. REMOTE WORK & RELOCATION
  if (
    hasAnyWord(tokens, ['remote', 'teletravail', 'relocate', 'relocation']) ||
    norm.includes('work remotely') ||
    norm.includes('travailler a distance')
  ) {
    return {
      text: `Yes! Mohammed is fully equipped and experienced with **remote work**:\n\n• 🌐 **Remote Collaboration**: Git/GitHub, Agile workflows, Slack, Discord, Zoom.\n• 📍 **Location**: Based in Meknes, Morocco (GMT+1).\n• ✈️ **Relocation**: Open to on-site opportunities across Morocco (Casablanca, Rabat, Fès, Tangier) and relocation abroad for the right opportunity.`,
      actions: [
        { label: '✉️ Reach Out', query: 'How can I contact Mohammed?', scrollToId: 'contact' },
        { label: '📄 Download CV', query: 'Can I download your CV?' }
      ]
    };
  }

  // 5. SPECIFIC TECH: REACT & FRONTEND
  if (tokens.includes('react') || tokens.includes('reactjs') || norm.includes('frontend') || norm.includes('front end')) {
    return {
      text: `Mohammed is highly proficient with **React.js & Modern Frontend Development**:\n\n• **Core Stack**: React 18, TypeScript, Vite, React Router, Context API, Custom Hooks\n• **Styling & Motion**: Tailwind CSS, CSS3 Glassmorphism, Framer Motion, GSAP animations\n• **Featured React Projects**:\n  - 🎬 **ChoufFlix**: Streaming platform with TMDB API & trailer integration\n  - ⌚ **MIZAN Store**: Luxury e-commerce with real-time cart and glassmorphism\n  - 🚗 **Car Rental Dashboard**: Real-time vehicle booking management\n  - ✨ **This Interactive Portfolio**: High-performance animations and custom theme system`,
      actions: [
        { label: '🎬 ChoufFlix Code', url: 'https://github.com/Skikri01/movie-explorer', icon: 'bxl-github' },
        { label: '⚡ All Skills', query: 'What are all your skills?', scrollToId: 'skills' },
        { label: '📄 Download CV', query: 'Can I download your CV?' }
      ]
    };
  }

  // 6. SPECIFIC TECH: NODE / EXPRESS / BACKEND / REST APIS
  if (tokens.includes('node') || tokens.includes('nodejs') || tokens.includes('express') || norm.includes('backend') || tokens.includes('api') || tokens.includes('jwt')) {
    return {
      text: `Mohammed builds scalable backend architectures with **Node.js & Express.js**:\n\n• **Architecture**: RESTful API design, MVC architecture, middleware pipelines\n• **Security & Auth**: JWT (JSON Web Tokens), bcrypt hashing, Role-Based Access Control (RBAC)\n• **Data Management**: MongoDB (Mongoose), MySQL relational models, Multer & Cloudinary media pipelines\n• **Production Implementations**: Car Rental Management System & MIZAN Luxury Watch Store`,
      actions: [
        { label: '🚗 Car Rental Repo', url: 'https://github.com/Skikri-mohammed/Car-Rental-management-system-Full-stack', icon: 'bxl-github' },
        { label: '⌚ Mizan Store Repo', url: 'https://github.com/Skikri-mohammed/Mizan-Luxury-Watch-Store-Full-Stack', icon: 'bxl-github' }
      ]
    };
  }

  // 7. SPECIFIC TECH: LARAVEL & PHP
  if (tokens.includes('laravel') || tokens.includes('php') || tokens.includes('blade')) {
    return {
      text: `Mohammed has solid experience with **PHP & Laravel**:\n\n• **Architecture**: MVC pattern, Eloquent ORM, Blade templating, authentication & RBAC\n• **Featured Projects**:\n  - 🌿 **Market Bio**: A specialized bilingual (Arabic-primary) e-commerce & inventory management platform for bio-compounds\n  - 🏢 **Enterprise Marketplace Platform (PFE)**: Internship project with complete catalog CRUD, cart workflows, and admin panel`,
      actions: [
        { label: '🌿 Market Bio Repo', url: 'https://github.com/Skikri-mohammed/Market-Bio', icon: 'bxl-github' },
        { label: '🚀 Other Projects', query: 'What are your other projects?', scrollToId: 'projects' }
      ]
    };
  }

  // 8. SPECIFIC TECH: DATABASES (MongoDB, MySQL, Oracle, SQL)
  if (hasAnyWord(tokens, ['database', 'databases', 'bdd', 'mongodb', 'mysql', 'sql', 'oracle', 'mongoose']) || tokens.includes('mongo')) {
    return {
      text: `Mohammed works with both relational and NoSQL databases:\n\n• 🍃 **MongoDB & Mongoose**: Document modeling, aggregations, and schema validation (Car Rental System)\n• 🐬 **MySQL**: Relational schemas, foreign keys, index optimization, complex joins (MIZAN, Market Bio, Enterprise Marketplace)\n• 🏛️ **Oracle Database & SQL**: Academic coursework and advanced SQL engineering at Sup'Management\n• ☁️ **Cloudinary**: Cloud storage pipeline for image and media asset management`,
      actions: [
        { label: '⚡ All Skills', query: 'What are all your skills?', scrollToId: 'skills' },
        { label: '📄 Download CV', query: 'Can I download your CV?' }
      ]
    };
  }

  // 9. SPECIFIC TECH: PYTHON / JAVA / TYPESCRIPT / JAVASCRIPT
  if (hasAnyWord(tokens, ['python', 'java', 'typescript', 'javascript']) || tokens.includes('js') || tokens.includes('ts')) {
    return {
      text: `Mohammed is proficient in several programming languages:\n\n• ⚡ **TypeScript & JavaScript**: His primary languages for full-stack web engineering (React, Node, Express)\n• 🐍 **Python**: Algorithms, OOP, scripting, and data handling learned during his TSDI degree at OFPPT\n• ☕ **Java**: Object-oriented software engineering and design patterns studied at Sup'Management\n• 🐘 **PHP**: Backend web development with Laravel and raw PHP`,
      actions: [
        { label: '🚀 View Projects', query: 'What are your top projects?', scrollToId: 'projects' },
        { label: '📄 Download CV', query: 'Can I download your CV?' }
      ]
    };
  }

  // 10. SPECIFIC PROJECT: CHOUFFLIX
  if (hasAnyWord(tokens, ['choufflix', 'chouf', 'flix', 'tmdb']) || norm.includes('chouf flix') || norm.includes('movie app') || norm.includes('streaming')) {
    const p = MOHAMMED_CONTEXT.projects[0];
    return {
      text: `🎬 **${p.name} — ${p.category}**\n\n• **Tech Stack**: ${p.tech}\n• **Key Features**:\n  - Dual-layer fetch architecture integrating the TMDB API with mock dataset fallback\n  - Watchlist persistence with React Context & LocalStorage\n  - Embedded HD YouTube trailer modals and detailed cast analytics\n  - Responsive dark-theme design with responsive genre filters`,
      actions: [
        { label: '🐙 View GitHub Code', url: p.github, icon: 'bxl-github' },
        { label: '🚗 Car Rental Project', query: 'Tell me about Car Rental system' },
        { label: '⌚ Mizan Project', query: 'Tell me about Mizan store' }
      ]
    };
  }

  // 11. SPECIFIC PROJECT: CAR RENTAL
  if (norm.includes('car rental') || norm.includes('location de voiture') || hasAnyWord(tokens, ['booking', 'fleet'])) {
    const p = MOHAMMED_CONTEXT.projects[1];
    return {
      text: `🚗 **${p.name} — ${p.category}**\n\n• **Tech Stack**: ${p.tech}\n• **Key Features**:\n  - Real-time vehicle browsing, filtering, and booking workflows\n  - Administrative dashboard for comprehensive fleet management\n  - Backend algorithms designed to eliminate concurrent double-booking conflicts\n  - Role-Based Access Control (RBAC) with JWT and Cloudinary image uploads`,
      actions: [
        { label: '🐙 View GitHub Code', url: p.github, icon: 'bxl-github' },
        { label: '🎬 ChoufFlix Project', query: 'Tell me about ChoufFlix' },
        { label: '⌚ Mizan Project', query: 'Tell me about Mizan store' }
      ]
    };
  }

  // 12. SPECIFIC PROJECT: MIZAN
  if (hasAnyWord(tokens, ['mizan', 'horology']) || norm.includes('luxury watch') || norm.includes('watch store') || norm.includes('montre')) {
    const p = MOHAMMED_CONTEXT.projects[2];
    return {
      text: `⌚ **${p.name} — ${p.category}**\n\n• **Tech Stack**: ${p.tech}\n• **Key Features**:\n  - Luxury dark glassmorphism design system with smooth micro-animations\n  - Instant search and real-time category filtering for movements and brands\n  - Slide-over cart drawer with live subtotal calculations and multi-step checkout\n  - Full-stack CRUD admin management powered by MySQL`,
      actions: [
        { label: '🐙 View GitHub Code', url: p.github, icon: 'bxl-github' },
        { label: '🚀 Other Projects', query: 'Show me other projects', scrollToId: 'projects' }
      ]
    };
  }

  // 13. GENERAL PROJECTS INQUIRY (EN, FR, AR)
  if (
    hasAnyWord(tokens, ['project', 'projects', 'projet', 'projets', 'portfolio', 'apps', 'travaux', 'realisations']) ||
    norm.includes('what did you build') ||
    norm.includes('what have you built') ||
    norm.includes('show work') ||
    norm.includes('مشاريع')
  ) {
    return {
      text: `Mohammed has built several prominent full-stack applications:\n\n1. 🎬 **ChoufFlix**: Movie streaming & discovery platform *(React, TypeScript, TMDB API)*\n2. 🚗 **Car Rental System**: Vehicle booking with fleet management *(Node.js, Express, MongoDB, React)*\n3. ⌚ **MIZAN**: Luxury watch e-commerce *(React, Node.js, Express, MySQL)*\n4. 🌿 **Market Bio**: Bilingual inventory & e-commerce platform *(Laravel, PHP, MySQL)*\n5. ✨ **Interactive Portfolio**: Glassmorphic animated developer showcase *(React, TypeScript, GSAP)*\n\nClick below to inspect any project or jump to the Projects section:`,
      actions: [
        { label: '🎬 ChoufFlix', query: 'Tell me about ChoufFlix' },
        { label: '🚗 Car Rental', query: 'Tell me about Car Rental system' },
        { label: '⌚ MIZAN Store', query: 'Tell me about Mizan luxury store' },
        { label: '⬇️ Scroll to Projects', scrollToId: 'projects', icon: 'bx-down-arrow-alt' },
        { label: '🐙 GitHub Profile', url: MOHAMMED_CONTEXT.github, icon: 'bxl-github' }
      ]
    };
  }

  // 14. GENERAL SKILLS / TECH STACK (EN, FR, AR)
  if (
    hasAnyWord(tokens, ['skill', 'skills', 'competence', 'competences', 'stack', 'technologies', 'tools', 'outils', 'framework', 'frameworks']) ||
    norm.includes('what can you do') ||
    norm.includes('what do you use') ||
    norm.includes('que sais tu faire') ||
    norm.includes('مهارات')
  ) {
    return {
      text: `Here is a summary of Mohammed's core technical proficiencies:\n\n⚡ **Languages**: JavaScript (ES6+), TypeScript, Python, Java, PHP, SQL, HTML5, CSS3\n🚀 **Frontend**: React.js, Tailwind CSS, Bootstrap, Framer Motion, GSAP, Responsive Design\n🛠️ **Backend**: Node.js, Express.js, Laravel, REST APIs, JWT Auth, Multer\n💾 **Databases**: MongoDB, MySQL, Oracle Database, Cloudinary\n⚙️ **Ecosystem**: Git, GitHub, Vite, Postman, UML, Agile\n\nHe is comfortable building complete end-to-end full-stack architectures.`,
      actions: [
        { label: '⬇️ View Skills on Page', scrollToId: 'skills', icon: 'bx-down-arrow-alt' },
        { label: '🚀 View Projects', query: 'What are your top projects?', scrollToId: 'projects' },
        { label: '📄 Download CV', query: 'Can I download your CV?' }
      ]
    };
  }

  // 15. WORK EXPERIENCE / CAREER / INTERNSHIP (EN, FR, AR)
  if (
    hasAnyWord(tokens, ['experience', 'experiences', 'career', 'parcours', 'internship', 'internships', 'stage', 'stages']) ||
    norm.includes('work history') ||
    norm.includes('ou as tu travaille') ||
    norm.includes('خبرة')
  ) {
    return {
      text: `Here is Mohammed's professional experience & internships:\n\n• 💼 **Full-Stack Developer** — *Sup'Management* (2025 – Present)\n  Developing web applications using React.js, Node.js, Express, MongoDB, and modern API architectures.\n\n• 🎨 **Frontend & UI Specialist** — *MIZAN Luxury Store* (2025)\n  Crafted an interactive luxury watch e-commerce experience with dark glassmorphism and real-time inventory.\n\n• 🌿 **Laravel Developer** — *Market Bio* (2024 – 2025)\n  Engineered a bilingual inventory & order management web solution.\n\n• 🏢 **Web Development Intern (PFE)** — *OFPPT Marketplace* (2024)\n  Built a multi-tier marketplace platform with RBAC and catalog controls.`,
      actions: [
        { label: '📄 Check Full CV', query: 'Can I download your CV?' },
        { label: '🚀 Top Projects', query: 'What are your top projects?', scrollToId: 'projects' },
        { label: '📬 Contact Mohammed', query: 'How can I contact Mohammed?', scrollToId: 'contact' }
      ]
    };
  }

  // 16. EDUCATION / DEGREES / STUDIES (EN, FR, AR)
  if (
    hasAnyWord(tokens, ['education', 'study', 'studies', 'etude', 'etudes', 'diploma', 'diplome', 'degree', 'degrees', 'university', 'universite', 'school', 'ecole', 'formation', 'licence', 'tsdi']) ||
    norm.includes('sup management') ||
    norm.includes('ofppt') ||
    norm.includes('تعليم')
  ) {
    return {
      text: `Here is Mohammed's academic background:\n\n🎓 **Sup'Management (Meknes, Morocco)** *(2025 – Present)*\n• **Degree**: Licence Professionnelle en Génie Informatique\n• Key subjects: Oracle Database, Java, Advanced Software Engineering\n\n💼 **École Polytechnique des Génies (Fès, Morocco)** *(Mar 2025 – Apr 2025)*\n• Technical Engineering Stage / Practical Internship\n\n🏫 **OFPPT (Meknes, Morocco)** *(2023 – 2025)*\n• **Degree**: Technicien Spécialisé en Développement Informatique (TSDI)\n• Web Development, Python, Tailwind CSS, SQL, and UML Modeling`,
      actions: [
        { label: '⬇️ Scroll to Education', scrollToId: 'education', icon: 'bx-down-arrow-alt' },
        { label: '📄 Download CV', query: 'Can I download your CV?' },
        { label: '⚡ Technical Skills', query: 'What are your skills?', scrollToId: 'skills' }
      ]
    };
  }

  // 17. CONTACT INFO & REACH OUT (EN, FR, AR)
  if (
    hasAnyWord(tokens, ['contact', 'email', 'phone', 'telephone', 'message', 'reach', 'contacter', 'joindre', 'linkedin', 'github']) ||
    tokens.includes('mail') ||
    norm.includes('how to contact') ||
    norm.includes('comment contacter') ||
    norm.includes('تواصل')
  ) {
    return {
      text: `You can easily reach Mohammed through any of these channels:\n\n• 📧 **Email**: [${MOHAMMED_CONTEXT.email}](mailto:${MOHAMMED_CONTEXT.email})\n• 💼 **LinkedIn**: [Mohamed Skikri](${MOHAMMED_CONTEXT.linkedin})\n• 🐙 **GitHub**: [@Skikri01](${MOHAMMED_CONTEXT.github})\n• 📍 **Location**: Meknes, Morocco\n\nYou can also use the contact form right on this page!`,
      actions: [
        { label: '✉️ Send Email', url: `mailto:${MOHAMMED_CONTEXT.email}`, icon: 'bx-envelope' },
        { label: '💼 Connect on LinkedIn', url: MOHAMMED_CONTEXT.linkedin, icon: 'bxl-linkedin' },
        { label: '⬇️ Go to Contact Form', scrollToId: 'contact', icon: 'bx-down-arrow-alt' }
      ]
    };
  }

  // 18. LOCATION / BASED IN / WHERE ARE YOU FROM
  if (
    hasAnyWord(tokens, ['location', 'morocco', 'maroc', 'meknes', 'fes']) ||
    norm.includes('where do you live') ||
    norm.includes('where are you based') ||
    norm.includes('where are you from') ||
    norm.includes('ou habites tu') ||
    norm.includes('ou vis tu') ||
    norm.includes('اين تسكن')
  ) {
    return {
      text: `Mohammed is based in **Meknes, Morocco 🇲🇦**.\n\nHe is open to:\n• On-site opportunities in Morocco (Meknes, Fès, Rabat, Casablanca, etc.)\n• Remote engineering positions worldwide.`,
      actions: [
        { label: '📬 Contact Mohammed', query: 'How can I contact Mohammed?', scrollToId: 'contact' },
        { label: '📄 Download CV', query: 'Can I download your CV?' }
      ]
    };
  }

  // 19. SPOKEN LANGUAGES
  if (
    hasAnyWord(tokens, ['language', 'languages', 'langue', 'langues', 'arabic', 'arabe', 'french', 'francais', 'english', 'anglais']) ||
    norm.includes('parles tu') ||
    norm.includes('what languages') ||
    norm.includes('do you speak')
  ) {
    return {
      text: `Mohammed communicates in three languages:\n\n🇲🇦 **Arabic**: Native / Mother Tongue (100%)\n🇫🇷 **French**: Professional Working Proficiency (Technical & Conversational)\n🇬🇧 **English**: Professional Working Proficiency (Technical & Conversational)`,
      actions: [
        { label: '📬 Contact Mohammed', query: 'How can I contact Mohammed?', scrollToId: 'contact' },
        { label: '📄 Download CV', query: 'Can I download your CV?' }
      ]
    };
  }

  // 20. WHO IS MOHAMMED / ABOUT / IDENTITY (EN, FR, AR)
  if (
    hasAnyWord(tokens, ['presentation', 'bio']) ||
    norm.includes('who are you') ||
    norm.includes('who is mohammed') ||
    norm.includes('who is mohamed') ||
    norm.includes('tell me about yourself') ||
    norm.includes('tell me about mohammed') ||
    norm.includes('qui es tu') ||
    norm.includes('qui est mohammed') ||
    norm.includes('qui est mohamed') ||
    norm.includes('من انت')
  ) {
    return {
      text: `**${MOHAMMED_CONTEXT.name}** is a ${MOHAMMED_CONTEXT.title} based in ${MOHAMMED_CONTEXT.location}.\n\nHe specializes in building clean, responsive user interfaces with **React & TypeScript** and high-reliability backends with **Node.js, Express, MongoDB, and Laravel/PHP**.\n\nHe is passionate about clean code, modern UI architectures, and creating impactful web software.`,
      actions: [
        { label: '🚀 Top Projects', query: 'What are your top projects?', scrollToId: 'projects' },
        { label: '⚡ Technical Skills', query: 'What are your skills?', scrollToId: 'skills' },
        { label: '📄 Download CV', query: 'Can I download your CV?' },
        { label: '📬 Contact Mohammed', query: 'How can I contact Mohammed?', scrollToId: 'contact' }
      ]
    };
  }

  // 21. FUN / EASTER EGG (Tell me a joke / Coffee)
  if (hasAnyWord(tokens, ['joke', 'blague', 'humor', 'coffee', 'cafe'])) {
    const jokes = [
      `Why do programmers prefer dark mode? Because light attracts bugs! 🐛`,
      `There are 10 types of people in the world: those who understand binary, and those who don't! 😄`,
      `A SQL query walks into a bar, walks up to two tables and asks: "Can I join you?" 🍹`
    ];
    return {
      text: jokes[Math.floor(Math.random() * jokes.length)],
      actions: [
        { label: '🚀 Now Show Me Projects', query: 'What are your top projects?', scrollToId: 'projects' },
        { label: '📄 Download CV', query: 'Can I download your CV?' }
      ]
    };
  }

  // 22. GRATITUDE / POLITE CLOSURES
  if (
    hasAnyWord(tokens, ['thank', 'thanks', 'merci', 'shukran', 'chokran', 'awesome', 'perfect', 'parfait', 'super'])
  ) {
    return {
      text: `You're very welcome! 😊 Feel free to ask anything else about Mohammed's work, or use the buttons below to reach out directly.`,
      actions: [
        { label: '🚀 Explore Projects', query: 'What are your top projects?', scrollToId: 'projects' },
        { label: '📄 Download CV', query: 'Can I download your CV?' },
        { label: '✉️ Send an Email', url: `mailto:${MOHAMMED_CONTEXT.email}`, icon: 'bx-envelope' }
      ]
    };
  }

  // 23. GREETINGS (English, French, Arabic) — SAFE CHECK (Only triggers for short greetings, not substantive questions)
  const isGreetingWord =
    tokens.includes('hi') ||
    tokens.includes('hello') ||
    tokens.includes('hey') ||
    tokens.includes('yo') ||
    tokens.includes('salut') ||
    tokens.includes('bonjour') ||
    tokens.includes('bonsoir') ||
    tokens.includes('coucou') ||
    tokens.includes('salam') ||
    tokens.includes('marhaba') ||
    tokens.includes('ahlan') ||
    norm.startsWith('good morning') ||
    norm.startsWith('good afternoon') ||
    norm.startsWith('good evening');

  if (isGreetingWord && tokens.length <= 4) {
    return {
      text: `Hello! 👋 I am **Mohammed Skikri's AI Assistant**.\n\nI can answer anything about Mohammed's **projects**, **skills**, **experience**, and **education**, or guide you to download his CV and contact him directly.\n\nWhat would you like to explore?`,
      actions: [
        { label: '🚀 Top Projects', query: 'What are your top projects?', scrollToId: 'projects' },
        { label: '⚡ Tech Stack', query: 'What technologies do you use?', scrollToId: 'skills' },
        { label: '📄 Download CV', query: 'Can I download your CV?' },
        { label: '📬 Contact Info', query: 'How can I contact Mohammed?', scrollToId: 'contact' }
      ]
    };
  }

  // 24. CONTEXT-AWARE INTELLIGENT FALLBACK
  return {
    text: `I'm Mohammed's portfolio assistant! While I couldn't find an exact match for *"${query}"*, here is what I can tell you about:\n\n• 🚀 **Projects**: ChoufFlix, Car Rental, MIZAN, Market Bio\n• ⚡ **Tech Stack**: React, TypeScript, Node.js, Express, MongoDB, Laravel, PHP\n• 🎓 **Education**: Sup'Management, OFPPT (TSDI), Internships\n• 💼 **Experience**: Full-stack engineering & web development\n• 📄 **Curriculum Vitae**: Instant PDF download\n• 📬 **Contact**: Email, LinkedIn, GitHub\n\nWhat would you like to explore?`,
    actions: [
      { label: '🚀 Top Projects', query: 'What are your top projects?', scrollToId: 'projects' },
      { label: '⚡ Skills & Stack', query: 'What are your skills?', scrollToId: 'skills' },
      { label: '📄 Download CV', query: 'Can I download your CV?' },
      { label: '📬 Contact Info', query: 'How can I contact Mohammed?', scrollToId: 'contact' }
    ]
  };
};

// Live Gemini API Integration (Optional / Configurable)
export const generateGeminiResponse = async (
  query: string,
  history: ChatMessage[],
  apiKey: string
): Promise<{ text: string; actions?: ChatAction[] }> => {
  if (!apiKey) {
    return generateLocalResponse(query);
  }

  const systemInstruction = `
You are the official interactive AI Assistant on Mohammed Skikri's developer portfolio website.
Your role is to represent Mohammed Skikri accurately, professionally, politely, and enthusiastically to potential employers, recruiters, and clients.

MOHAMMED'S INFORMATION:
- Name: Mohammed Skikri (also written Mohamed Skikri)
- Role: Full-Stack Developer & Software Engineering Student
- Location: Meknes, Morocco
- Status: Open to new opportunities (Internships, Full-Time, Freelance)
- Email: mohamedskikri44@gmail.com
- LinkedIn: https://www.linkedin.com/in/mohamed-skikri-467862299/
- GitHub: https://github.com/Skikri01
- CV/Resume URL: /Mohammed_Skikri_CV.pdf
- Education:
  * Sup'Management (Meknes, Morocco) - Licence Professionnelle en Génie Informatique (2025 - Present)
  * École Polytechnique des Génies (Fès) - Technical Stage (Mar 2025 - Apr 2025)
  * OFPPT (Meknes) - Technicien Spécialisé en Développement Informatique (2023 - 2025)
- Core Projects:
  1. ChoufFlix: Movie Streaming & Discovery (React.js, TypeScript, TMDB API, trailers, watchlists) - GitHub: https://github.com/Skikri01/movie-explorer
  2. Car Rental Management System: Full-stack vehicle booking, fleet admin, double-booking prevention (Node.js, Express, MongoDB, React, JWT) - GitHub: https://github.com/Skikri-mohammed/Car-Rental-management-system-Full-stack
  3. MIZAN: Luxury Watch E-Commerce (React, Node.js, Express, MySQL, glassmorphism) - GitHub: https://github.com/Skikri-mohammed/Mizan-Luxury-Watch-Store-Full-Stack
  4. Market Bio: Bilingual Inventory & E-Commerce (Laravel, PHP, MySQL, Arabic UI)
  5. Glassmorphic Portfolio: Modern developer portfolio (React, TypeScript, GSAP)
- Skills: JavaScript, TypeScript, Python, Java, PHP, SQL, React.js, Node.js, Express.js, Laravel, MongoDB, MySQL, Oracle, Git, Vite, Tailwind CSS, HTML5, CSS3.
- Spoken Languages: Arabic (Native), French (Professional Working Proficiency), English (Professional Working Proficiency).

INSTRUCTIONS:
- Reply in the SAME language the user asks in (English, French, or Arabic).
- Answer questions accurately, concisely, and friendly using clean markdown formatting (bullet points, bold text).
- If asked about CV or contact, give direct links: /Mohammed_Skikri_CV.pdf and mailto:mohamedskikri44@gmail.com.
`.trim();

  const recentHistory = history.slice(-6);
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemInstruction }]
    },
    {
      role: 'model',
      parts: [
        {
          text: "Understood! I am ready to act as Mohammed Skikri's professional portfolio AI assistant in English, French, or Arabic."
        }
      ]
    },
    ...recentHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user',
      parts: [{ text: query }]
    }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API call returned status:', response.status);
      return generateLocalResponse(query);
    }

    const data = await response.json();
    const botReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      generateLocalResponse(query).text;

    const actions: ChatAction[] = [];
    const lowerReply = botReply.toLowerCase();
    if (lowerReply.includes('cv') || lowerReply.includes('resume')) {
      actions.push({ label: '📥 Download CV', url: MOHAMMED_CONTEXT.cvUrl, icon: 'bx-download' });
    }
    if (lowerReply.includes('email') || lowerReply.includes('contact') || lowerReply.includes('hire') || lowerReply.includes('contacter')) {
      actions.push({ label: '✉️ Email Mohammed', url: `mailto:${MOHAMMED_CONTEXT.email}`, icon: 'bx-envelope' });
      actions.push({ label: '💼 LinkedIn', url: MOHAMMED_CONTEXT.linkedin, icon: 'bxl-linkedin' });
    }

    return { text: botReply, actions: actions.length > 0 ? actions : undefined };
  } catch (error) {
    console.warn('Gemini API error, falling back to local engine:', error);
    return generateLocalResponse(query);
  }
};
