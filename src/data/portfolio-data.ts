import carRentalImage from '../assets/images/carRental.png';
import mizanWatchImage from '../assets/images/mizan.jpg';
import marketBioImage from '../assets/images/marketBio.png';
import portfolioImage from '../assets/images/portfolio.png';
import ecomerceImage from '../assets/images/ecomerce.png';
import choufFlix from '../assets/images/chofFlix.png';
import financeFlowImage from '../assets/images/financeFlow.png';

export interface ProjectItem {
  id: string;
  title: string;
  company: string;
  date: string;
  badge: string;
  desc: string;
  highlights: string[];
  techTags: string[];
  isPrivate?: boolean;
  link?: string;
  icon?: string;
  gradient?: string;
  imageUrl?: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'finance-flow',
    title: 'FinanceFlow — Full-Stack SaaS Financial Management Platform',
    company: 'SAAS PLATFORM · FULL-STACK',
    date: '2025 – PRESENT',
    badge: 'FINTECH SAAS',
    desc: 'Architected and developed a full-stack, enterprise-grade Finance Management SaaS application designed for multi-account wealth tracking, real-time cash flow analytics, and ledger management.',
    highlights: [
      'Interactive Analytics Dashboard: Built with React 18 & TypeScript featuring financial health summaries, monthly net worth telemetry, and category-level spending distribution.',
      'Real-time Ledger & Account Management: Developed responsive transaction tracking, instant account syncing (Checking, Savings, Credit, Investments), and quick-transfer capabilities.',
      'Robust RESTful Backend: Engineered a modular Express & TypeScript REST API with centralized error handling, CORS security, and environment-driven configuration.',
      'Relational Data Modeling: Designed PostgreSQL schemas and migration pipelines using Prisma ORM with strict type-safety across relational entities (Users, Accounts, Transactions).',
      'Enterprise Monorepo Architecture: Structured as an npm workspace monorepo separating client and server codebases for streamlined builds and developer workflow.'
    ],
    techTags: ['React 18', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'Tailwind CSS', 'Vite'],
    isPrivate: false,
    link: 'https://github.com/Skikri01/FinanceFlow',
    icon: 'wallet',
    imageUrl: financeFlowImage,
    gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(99, 102, 241, 0.35), rgba(168, 85, 247, 0.2))'
  },
  {
    id: 'chouflix',
    title: 'ChoufFlix — Movie Streaming & Discovery Web Platform',
    company: 'INDEPENDENT PROJECT · FULL-STACK',
    date: '2025 – PRESENT',
    badge: 'REACT',
    desc: 'A modern, responsive web application for discovering trending movies, exploring detailed film analytics, watching official trailers, and managing personal watchlists.',
    highlights: [
      'Integrated the TMDB API with a dual-layer fetch architecture and mock dataset fallback for reliable movie discovery.',
      'Built a marquee and dark-theme design system with responsive grid layouts and custom typography.',
      'Implemented watchlist persistence with Context API and LocalStorage, interactive toast feedback, and offline-friendly state.',
      'Added embedded HD YouTube trailer modals, cast details, recommendations, and multi-filter search with genre and rating selectors.'
    ],
    techTags: ['React.js', 'TypeScript', 'Vite', 'React Router', 'REST APIs', 'Lucide Icons', 'LocalStorage'],
    isPrivate: false,
    link: 'https://github.com/Skikri01/movie-explorer',
    icon: 'film',
    imageUrl: choufFlix,
    gradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(127, 29, 29, 0.7), rgba(217, 164, 65, 0.25))'
  },
  {
    id: 'car-rental',
    title: 'Car Rental Management System',
    company: "SUP'MANAGEMENT · MEKNES, MOROCCO",
    date: '2025 – PRESENT',
    badge: 'FULL-STACK',
    desc: 'A full-stack car rental management system designed to streamline vehicle booking for users and provide administrative control for platform managers.',
    highlights: [
      'Developing real-time vehicle browsing, filtering, and booking workflows with an admin dashboard for fleet management.',
      'Designing backend validation algorithms to eliminate concurrent double-booking edge cases.',
      'Implementing Role-Based Access Control (RBAC) with JWT authentication and Cloudinary image pipelines.'
    ],
    techTags: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'Tailwind CSS', 'JWT', 'Cloudinary'],
    isPrivate: false,
    link: 'https://github.com/Skikri-mohammed/Car-Rental-management-system-Full-stack',
    icon: 'car',
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.25), rgba(192, 132, 252, 0.15))',
  
    imageUrl: mizanWatchImage
  },
  {
    id: 'mizan-watch',
    title: 'MIZAN — Luxury Watch E-Commerce Platform',
    company: 'INDEPENDENT PROJECT · FULL-STACK',
    date: 'FEB 2025 – PRESENT',
    badge: 'E-COMMERCE',
    desc: 'A full-stack, responsive luxury watch e-commerce application focused on high-performance aesthetics, intuitive UX, and real-time inventory management.',
    highlights: [
      'Creating a luxury dark glassmorphism design system featuring smooth micro-animations and clean typography.',
      'Architecting instant search and real-time category filtering for collections, movement types, and horology brands.',
      'Building slide-over cart drawer workflows with real-time price calculation and multi-step checkout process.'
    ],
    techTags: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Multer', 'Tailwind CSS'],
    isPrivate: false,
    link: 'https://github.com/Skikri-mohammed/Mizan-Luxury-Watch-Store-Full-Stack',
    icon: 'time',
    gradient: 'linear-gradient(135deg, rgba(217, 164, 65, 0.2), rgba(168, 85, 247, 0.25), rgba(59, 130, 246, 0.15))',
     imageUrl: carRentalImage,
  },
  {
    id: 'market-bio',
    title: 'Market Bio — Bilingual Inventory & E-Commerce',
    company: 'ENTERPRISE SOLUTION · MOROCCO',
    date: '2024 – 2025',
    badge: 'LARAVEL',
    desc: 'A specialized e-commerce and inventory management platform for bio-compound products featuring a bilingual (Arabic-primary) interface.',
    highlights: [
      'Engineered a customized Arabic-primary frontend layout tailored for organic product listings and dynamic pricing.',
      'Integrated real-time sales tracking, stock replenishment alerts, and inventory control dashboards.',
      'Implemented secure authentication, cart workflows, and full administrative store controls.'
    ],
    techTags: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'Tailwind CSS'],
    isPrivate: false,
    link: 'https://github.com/Skikri-mohammed/Market-Bio',
    icon: 'leaf',
    gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2), rgba(14, 165, 233, 0.15))',
    imageUrl: marketBioImage
  },
  {
    id: 'portfolio',
    title: 'Interactive Portfolio & Glassmorphic Engine',
    company: 'PERSONAL DEVELOPMENT',
    date: '2025',
    badge: 'PORTFOLIO',
    desc: 'Dynamic developer portfolio showcasing software engineering projects, technical stack, and academic background with an immersive layout.',
    highlights: [
      'Built custom dark theme system with GSAP ScrollTrigger timeline animations and interactive spotlight effects.',
      'Designed responsive timeline architecture showcasing engineering roles, skills, and full-stack projects.',
      'Optimized asset loading and cross-browser rendering performance for high frame-rate animations.'
    ],
    techTags: ['React.js', 'TypeScript', 'GSAP', 'HTML5', 'CSS3'],
    isPrivate: false,
    link: 'https://github.com/Skikri01/Portfolio',
    icon: 'code',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.2))',
    imageUrl: portfolioImage
  },
  {
    id: 'fullstack-ecom',
    title: 'Enterprise Marketplace Platform',
    company: 'OFPPT INTERNSHIP · MEKNES',
    date: '2024',
    badge: 'PFE',
    desc: 'A full-featured marketplace developed during internship, implementing business requirement execution and professional development workflows.',
    highlights: [
      'Developed role-based access control and secure user authentication pipelines for multi-tier user profiles.',
      'Architected product catalog with full CRUD operations, category filtering, and instant search mechanics.',
      'Built integrated shopping cart, order management, and centralized admin metrics panel.'
    ],
    techTags: ['Laravel', 'PHP', 'MySQL', 'Blade', 'Tailwind CSS', 'UML'],
    isPrivate: true,
    link: '#',
    icon: 'briefcase',
    gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2), rgba(168, 85, 247, 0.15))',
    imageUrl: ecomerceImage
  }
];

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  items: string[];
}

export const SKILLS: SkillCategory[] = [
  {
    id: 'lang',
    name: 'Programming Languages',
    icon: '⚡',
    description: 'Core languages for full-stack software development, database queries, and web standards.',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'PHP', 'SQL', 'HTML5', 'CSS3']
  },
  {
    id: 'fw',
    name: 'Frameworks & Libraries',
    icon: '🚀',
    description: 'Modern libraries and backend frameworks used for building robust, scalable applications.',
    items: ['React.js', 'Laravel', 'Express.js', 'Node.js', 'Tailwind CSS', 'Bootstrap']
  },
  {
    id: 'db',
    name: 'Databases & Storage',
    icon: '💾',
    description: 'Relational databases, document stores, and cloud media management pipelines.',
    items: ['PostgreSQL', 'Prisma ORM', 'MongoDB', 'MySQL', 'Oracle Database', 'Mongoose', 'Cloudinary']
  },
  {
    id: 'devops',
    name: 'Tools & Ecosystem',
    icon: '🛠️',
    description: 'Version control, API authentication, build systems, and architectural modeling.',
    items: ['Git', 'GitHub', 'REST APIs', 'JWT', 'Multer', 'Vite', 'UML']
  }
];

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  techTags: string[];
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Full-Stack Developer',
    company: "Sup'Management",
    techTags: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT', 'Cloudinary']
  },
  {
    id: 'exp-2',
    role: 'Frontend & UI Specialist',
    company: 'MIZAN Luxury Store',
    techTags: ['React.js', 'JavaScript', 'Node.js', 'Express.js', 'MySQL', 'Multer', 'Tailwind CSS', 'HTML5', 'CSS3']
  },
  {
    id: 'exp-3',
    role: 'Laravel Developer',
    company: 'Market Bio',
    techTags: ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'Tailwind CSS', 'SQL']
  },
  {
    id: 'exp-4',
    role: 'Web Development Intern',
    company: 'OFPPT Marketplace',
    techTags: ['PHP', 'Laravel', 'MySQL', 'HTML5', 'CSS3', 'UML', 'Git']
  }
];
