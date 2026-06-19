// client/src/data/careerData.js — Single Source of Truth
// All career path data lives here. Every page imports from this file.

// ─── SCHEDULE ──────────────────────────────────────────────────────────────────

export const CATEGORIES = {
  health:    { label: 'Gym / Health',      color: '#22C55E', bg: 'rgba(34,197,94,0.10)' },
  fullstack: { label: 'Full Stack Dev',    color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  analytics: { label: 'Data Analytics',   color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' },
  project:   { label: 'Project Work',      color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)' },
  jobs:      { label: 'Jobs / LinkedIn',   color: '#06B6D4', bg: 'rgba(6,182,212,0.10)' },
  break:     { label: 'Break / Meals',     color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)' },
  sleep:     { label: 'Sleep',             color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
  blocked:   { label: 'Blocked',           color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
};

export const WEEKDAY = [
  { time: '10:00 PM – 06:00 AM', label: 'Sleep',        cat: 'sleep',     duration: '8h' },
  { time: '06:00 – 10:00 AM',    label: 'Gym + Travel', cat: 'health',    duration: '4h' },
  { time: '10:00 – 10:30 AM',    label: 'Breakfast',    cat: 'break' },
  { time: '10:30 AM – 01:00 PM', label: 'Block 1 — Full Stack (React/JS)', cat: 'fullstack', duration: '2.5h' },
  { time: '01:00 – 02:00 PM',    label: 'Lunch',        cat: 'break',     duration: '1h' },
  { time: '02:00 – 05:00 PM',    label: 'Block 2 — Backend (Node.js)',     cat: 'fullstack', duration: '3h' },
  { time: '05:00 – 05:30 PM',    label: 'Tea Break',    cat: 'break' },
  { time: '05:30 – 07:00 PM',    label: 'Block 3 — Data Analytics',       cat: 'analytics', duration: '1.5h' },
  { time: '07:00 – 09:00 PM',    label: 'Projects',     cat: 'project',   duration: '2h' },
  { time: '09:00 – 09:30 PM',    label: 'Dinner',       cat: 'break' },
  { time: '09:30 – 10:00 PM',    label: 'LinkedIn + Apply', cat: 'jobs' },
];

export const SATURDAY = [
  { time: '10:00 PM – 06:00 AM', label: 'Sleep',               cat: 'sleep',     duration: '8h' },
  { time: '06:00 – 10:00 AM',    label: 'Gym + Travel',        cat: 'health',    duration: '4h' },
  { time: '10:30 AM – 01:00 PM', label: 'Project Sprint',      cat: 'project',   duration: '2.5h' },
  { time: '02:00 – 05:00 PM',    label: 'Revision + DSA',      cat: 'fullstack', duration: '3h' },
  { time: '06:00 – 08:00 PM',    label: 'DA Revision',         cat: 'analytics', duration: '2h' },
];

export const SUNDAY = [
  { time: '10:00 PM – 06:00 AM', label: 'Sleep',               cat: 'sleep',     duration: '8h' },
  { time: '06:00 – 10:00 AM',    label: 'Gym + Rest',          cat: 'health',    duration: '4h' },
  { time: '10:30 AM – 01:00 PM', label: 'Weekly Review',       cat: 'project',   duration: '2.5h' },
  { time: '02:00 – 04:00 PM',    label: 'Market Trip',         cat: 'blocked',   duration: '2h' },
  { time: '05:00 – 08:00 PM',    label: 'Light Study / Rest',  cat: 'break',     duration: '3h' },
];

// ── Evening Gym Mode ────────────────────────────────────────────────────────
// Gym shifts to 6:30–9:00 PM; all study/work blocks are completed earlier in
// the day so the evening stays free for gym + dinner + wind-down.

export const EVENING_WEEKDAY = [
  { time: '12:00 – 08:30 AM',    label: 'Sleep',                            cat: 'sleep',     duration: '8.5h' },
  { time: '08:30 – 09:00 AM',    label: 'Breakfast',                       cat: 'break' },
  { time: '09:00 AM – 12:00 PM', label: 'Block 1 — Full Stack (React/JS)', cat: 'fullstack', duration: '3h' },
  { time: '12:00 – 01:00 PM',    label: 'Lunch',                           cat: 'break',     duration: '1h' },
  { time: '01:00 – 04:00 PM',    label: 'Block 2 — Backend (Node.js)',     cat: 'fullstack', duration: '3h' },
  { time: '04:00 – 04:30 PM',    label: 'Tea Break',                       cat: 'break' },
  { time: '04:30 – 06:00 PM',    label: 'Block 3 — Data Analytics',        cat: 'analytics', duration: '1.5h' },
  { time: '06:00 – 06:30 PM',    label: 'LinkedIn + Apply',                cat: 'jobs' },
  { time: '06:30 – 09:00 PM',    label: 'Gym',                             cat: 'health',    duration: '2.5h' },
  { time: '09:00 – 09:30 PM',    label: 'Travel + Shower',                 cat: 'break' },
  { time: '09:30 – 10:00 PM',    label: 'Dinner',                          cat: 'break' },
  { time: '10:00 – 11:00 PM',    label: 'Light Revision / Projects',       cat: 'project',   duration: '1h' },
  { time: '11:00 PM – 12:00 AM', label: 'Wind Down',                       cat: 'sleep' },
];

export const EVENING_SATURDAY = [
  { time: '09:30 AM – 12:30 PM', label: 'Revision + DSA', cat: 'fullstack', duration: '3h' },
  { time: '01:30 – 04:30 PM',    label: 'Project Sprint', cat: 'project',   duration: '3h' },
  { time: '05:00 – 06:30 PM',    label: 'DA Revision',    cat: 'analytics', duration: '1.5h' },
  { time: '06:30 – 09:00 PM',    label: 'Gym',            cat: 'health',    duration: '2.5h' },
  { time: '09:30 – 10:00 PM',    label: 'Dinner',         cat: 'break' },
];

export const EVENING_SUNDAY = [
  { time: '08:30 – 09:30 AM',    label: 'Free Morning',            cat: 'break',   duration: '1h' },
  { time: '09:30 AM – 12:30 PM', label: 'Weekly Review',           cat: 'project', duration: '3h' },
  { time: '01:30 – 04:00 PM',    label: 'Portfolio / GitHub Work', cat: 'project', duration: '2.5h' },
  { time: '04:30 – 05:30 PM',    label: 'Market Trip',             cat: 'blocked', duration: '1h' },
  { time: '05:30 – 06:15 PM',    label: 'Plan Next Week',          cat: 'project' },
  { time: '06:30 – 09:00 PM',    label: 'Gym',                     cat: 'health',  duration: '2.5h' },
  { time: '09:30 – 10:00 PM',    label: 'Dinner',                  cat: 'break' },
];

// dayOfWeek: 0=Sun, 1=Mon … 6=Sat · mode: 'morning' | 'evening'
export function getSchedule(dayOfWeek, mode = 'morning') {
  if (mode === 'evening') {
    if (dayOfWeek === 0) return EVENING_SUNDAY;
    if (dayOfWeek === 6) return EVENING_SATURDAY;
    return EVENING_WEEKDAY;
  }
  if (dayOfWeek === 0) return SUNDAY;
  if (dayOfWeek === 6) return SATURDAY;
  return WEEKDAY;
}

// ─── FULL STACK TRACK ──────────────────────────────────────────────────────────

export const FS_MONTHS = [
  {
    num: 1, title: 'Foundation Rebuild',
    color: '#A3DC19', bg: 'rgba(163,220,25,0.08)',
    goal: '1 deployed React project live',
    milestones: [
      'HTML/CSS/JS refresh (ES6+, async/await, Promises)',
      'React: hooks, context, React Router v6, Vite',
      'Git + GitHub daily commits established',
      'Project 1: React portfolio/clone app deployed (Netlify/Vercel)',
    ],
  },
  {
    num: 2, title: 'Backend & Databases',
    color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',
    goal: '1 full stack project on GitHub + deployed',
    milestones: [
      'Node.js + Express.js mastered',
      'REST APIs — CRUD, middleware, JWT authentication',
      'MongoDB + Mongoose (or PostgreSQL + Prisma)',
      'Project 2: Full stack MERN app with auth + CRUD',
    ],
  },
  {
    num: 3, title: 'Polish + Applications',
    color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',
    goal: 'Resume ready, 3 projects live, actively applying',
    milestones: [
      'AWS basics / Render / Railway deployment',
      'Project 3: E-commerce or SaaS clone',
      'Resume + LinkedIn optimization complete',
      'Applying 5–10 applications/day',
      'Mock interviews: DSA basics, system design intro',
    ],
  },
  {
    num: 4, title: 'Interview Mode',
    color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',
    goal: 'First job offer received',
    milestones: [
      'DSA: Arrays, strings, linked lists (LeetCode easy/medium)',
      'System Design basics (URL shortener, Twitter feed)',
      'TypeScript fundamentals learned',
      '50+ company applications submitted',
    ],
  },
  {
    num: 5, title: 'First Offer',
    color: '#EC4899', bg: 'rgba(236,72,153,0.08)',
    goal: '₹5–6.5 LPA Full Stack role accepted',
    milestones: [
      'Continuing interview process actively',
      'Salary negotiated successfully',
      'Target: ₹5–6.5 LPA Full Stack role',
    ],
  },
  {
    num: 6, title: 'Employed + Growth',
    color: '#06B6D4', bg: 'rgba(6,182,212,0.08)',
    goal: 'Settled in job, planning 12-month raise',
    milestones: [
      'Joined company and onboarded',
      'Open source contributions started',
      'AI-integrated projects built on weekends',
      'Plan for salary jump at 12 months',
    ],
  },
];

// For dashboard progress bars (subject name must match timer subject key)
export const FS_SUBJECTS = [
  { name: 'JavaScript (ES6+)', target: 40, color: '#D1FF05' },
  { name: 'React',             target: 35, color: '#61DAFB' },
  { name: 'Node.js',           target: 30, color: '#68A063' },
  { name: 'DSA',               target: 50, color: '#8B5CF6' },
  { name: 'System Design',     target: 20, color: '#3B82F6' },
];

// For profile stack bars
export const STACK_FS = [
  { label: 'JavaScript ES6+', key: 'JavaScript (ES6+)', target: 40 },
  { label: 'React',           key: 'React',             target: 35 },
  { label: 'Node.js',         key: 'Node.js',           target: 30 },
  { label: 'System Design',   key: 'System Design',     target: 20 },
  { label: 'DBMS',            key: 'DBMS',              target: 10 },
  { label: 'OS',              key: 'Operating System',  target: 10 },
  { label: 'Networks',        key: 'Computer Networks', target: 10 },
];

// Full curriculum for Subjects page (track: 'fs')
export const FS_CURRICULUM = [
  {
    id: 'javascript', name: 'JavaScript', color: '#D1FF05', track: 'fs',
    timerSubject: 'JavaScript (ES6+)',
    beginner: [
      'Variables, let/const/var', 'Data Types & Type Coercion', 'Functions & Arrow Functions',
      'Arrays & Array Methods', 'Objects & Destructuring', 'DOM Manipulation',
      'Events & Event Listeners', 'Loops & Iteration', 'Conditionals & Switch',
    ],
    intermediate: [
      'Closures & Lexical Scope', 'Prototypes & Prototype Chain', 'this keyword & Binding',
      'ES6+ Features (Spread, Rest, Optional Chaining)', 'Promises & Async/Await',
      'Event Loop & Call Stack', 'Modules (import/export)', 'Error Handling (try/catch)',
      'LocalStorage & SessionStorage',
    ],
    advanced: [
      'Design Patterns (Module, Factory, Observer)', 'Performance & Memory Management',
      'Web Workers', 'Service Workers', 'Generators & Iterators',
      'Proxy & Reflect', 'WeakMap / WeakSet', 'Currying & Partial Application',
    ],
  },
  {
    id: 'react', name: 'React', color: '#61DAFB', track: 'fs',
    timerSubject: 'React',
    courseUrl: 'https://namastedev.com/learn/namaste-react', courseLabel: 'NamasteDev',
    beginner: [
      'JSX Syntax', 'Functional Components', 'Props & PropTypes',
      'useState Hook', 'Event Handling', 'Conditional Rendering',
      'List Rendering & Keys', 'Basic Forms',
    ],
    intermediate: [
      'useEffect Hook', 'useContext & Context API', 'Custom Hooks',
      'React Router v6', 'Controlled vs Uncontrolled Forms',
      'Lifting State Up', 'Component Composition', 'Error Boundaries',
    ],
    advanced: [
      'useReducer', 'useMemo & useCallback', 'React.memo',
      'Code Splitting & Lazy Loading', 'Concurrent Features', 'Suspense',
      'State Management (Zustand/Redux)', 'Testing (React Testing Library)',
    ],
  },
  {
    id: 'nodejs', name: 'Node.js', color: '#68A063', track: 'fs',
    timerSubject: 'Node.js',
    courseUrl: 'https://www.youtube.com/playlist?list=PL78RhpUUKSwfeSOOwfE9x6l5jTjn5LbY3',
    courseLabel: 'YouTube',
    beginner: [
      'Node.js Architecture & Event Loop', 'CommonJS Modules', 'npm & package.json',
      'File System (fs module)', 'Path module', 'HTTP module basics',
    ],
    intermediate: [
      'Express.js Fundamentals', 'Middleware & Request Pipeline', 'REST API Design',
      'JWT Authentication', 'Environment Variables (.env)', 'Error Handling in Express',
      'CORS & Security Headers', 'Async patterns in Node',
    ],
    advanced: [
      'Streams & Buffers', 'Cluster & Worker Threads', 'WebSockets (Socket.io)',
      'Rate Limiting & Throttling', 'Caching (Redis)', 'Microservices Basics',
      'Docker & Containerization', 'CI/CD Pipelines',
    ],
  },
  {
    id: 'systemdesign', name: 'System Design', color: '#3B82F6', track: 'fs',
    timerSubject: 'System Design',
    courseUrl: 'https://www.youtube.com/watch?v=SqcXvc3ZmRU&list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX',
    courseLabel: 'YouTube',
    beginner: [
      'Client-Server Architecture', 'HTTP & HTTPS', 'DNS & How Browsers Work',
      'REST vs GraphQL', 'Databases: SQL vs NoSQL', 'Basic Scalability Concepts',
    ],
    intermediate: [
      'Load Balancing', 'Caching Strategies (CDN, Redis)', 'Database Sharding & Replication',
      'CAP Theorem', 'Message Queues (Kafka, RabbitMQ)', 'API Gateway',
      'Rate Limiting', 'SQL vs NoSQL Trade-offs',
    ],
    advanced: [
      'Design URL Shortener', 'Design Twitter/Feed', 'Design WhatsApp',
      'Design Netflix', 'Consistent Hashing', 'Distributed Transactions (Saga Pattern)',
      'Service Mesh & Observability', 'Event-Driven Architecture',
    ],
  },
  {
    id: 'dbms', name: 'DBMS', color: '#EC4899', track: 'fs',
    timerSubject: 'DBMS',
    courseUrl: 'https://www.geeksforgeeks.org/batch/cip-1?tab=Resources', courseLabel: 'GFG',
    beginner: [
      'What is DBMS?', 'DBMS vs File System', 'Types of Databases',
      'ER Diagrams', 'Relational Model', 'Keys (Primary, Foreign, Candidate)',
    ],
    intermediate: [
      'Normalization (1NF, 2NF, 3NF, BCNF)', 'Transactions & ACID Properties',
      'Concurrency Control', 'Deadlocks & Prevention', 'Indexing (B-Tree, Hash)',
      'Query Processing & Optimization',
    ],
    advanced: [
      'Recovery Techniques (Checkpointing, Logging)', 'Distributed Databases',
      'NoSQL Data Models (Document, Key-Value, Graph, Column)', 'Consistency Models',
      'Two-Phase Commit', 'OLAP vs OLTP',
    ],
  },
  {
    id: 'os', name: 'Operating System', color: '#06B6D4', track: 'fs',
    timerSubject: 'Operating System',
    beginner: [
      'What is an OS?', 'Process vs Thread', 'Types of OS',
      'System Calls', 'Memory Layout of a Process', 'File System Basics',
    ],
    intermediate: [
      'Process Scheduling (FCFS, SJF, Round Robin, Priority)',
      "Deadlock (Conditions, Prevention, Banker's Algorithm)",
      'Memory Management (Paging, Segmentation)', 'Virtual Memory & Page Replacement',
      'Inter-Process Communication (Pipes, Semaphores, Shared Memory)',
      'Mutex vs Semaphore',
    ],
    advanced: [
      'Thrashing & Working Set Model', 'File System Internals (inode, FAT, ext4)',
      'I/O Scheduling', 'Kernel Architecture (Monolithic vs Microkernel)',
      'Concurrency & Race Conditions', 'Memory-Mapped Files',
    ],
  },
  {
    id: 'cn', name: 'Computer Networks', color: '#8B5CF6', track: 'fs',
    timerSubject: 'Computer Networks',
    beginner: [
      'OSI Model (7 Layers)', 'TCP/IP Model', 'IP Addressing & Subnetting',
      'DNS & DHCP', 'HTTP vs HTTPS', 'MAC Address & ARP',
    ],
    intermediate: [
      'TCP vs UDP', 'TCP 3-Way Handshake', 'Routing Protocols (OSPF, BGP)',
      'NAT & Port Forwarding', 'Firewalls & Proxy', 'SSL/TLS Handshake',
      'WebSockets vs HTTP', 'CDN & Load Balancing',
    ],
    advanced: [
      'HTTP/2 & HTTP/3 (QUIC)', 'HTTPS Internals & Certificate Pinning',
      'BGP & Internet Routing', 'SDN (Software Defined Networking)',
      'Network Security (DDoS, MITM, etc.)', 'gRPC vs REST vs GraphQL',
    ],
  },
  {
    id: 'english', name: 'English', color: '#10B981', track: 'fs',
    timerSubject: 'English',
    courseUrl: 'https://www.udemy.com/course/complete-english-course-master-native-english-for-beginners/learn/lecture/31810926',
    beginner: [
      'Parts of Speech (Noun, Verb, Adjective, Adverb)', 'Sentence Structure & Word Order',
      'Present Tense (Simple & Continuous)', 'Past Tense (Simple & Continuous)',
      'Articles (a, an, the)', 'Prepositions of Time & Place',
      'Common Vocabulary (Greetings, Numbers, Colors)', 'Pronunciation Basics & Phonics',
    ],
    intermediate: [
      'Future Tenses (will, going to, Present Continuous)', 'Perfect Tenses (Present & Past Perfect)',
      'Modal Verbs (can, could, should, would, must)', 'Conditional Sentences (Zero, First, Second)',
      'Passive Voice', 'Relative Clauses', 'Linking Words & Connectors',
      'Reported Speech & Indirect Questions',
    ],
    advanced: [
      'Idiomatic Expressions & Phrasal Verbs', 'Business English & Email Writing',
      'Advanced Conditionals (Third & Mixed)', 'Inversion & Emphatic Structures',
      'Discourse Markers & Cohesion', 'Native-Level Fluency & Colloquialisms',
      'Presentation & Public Speaking Skills', 'Technical Writing for Developers',
    ],
  },
  {
    id: 'dsa', name: 'DSA', color: '#8B5CF6', track: 'fs',
    timerSubject: 'DSA',
    courseUrl: 'https://namastedev.com/learn/namaste-dsa', courseLabel: 'NamasteDev',
    beginner: [
      'Arrays & Strings', 'Linked Lists', 'Stacks & Queues',
      'Hashing & HashMaps', 'Binary Search', 'Recursion Basics',
      'Sorting (Bubble, Selection, Insertion)',
    ],
    intermediate: [
      'Two Pointers & Sliding Window', 'Trees (BFS, DFS, BST)', 'Heaps & Priority Queue',
      'Graphs (Adjacency List/Matrix)', 'Dynamic Programming Basics',
      'Backtracking', 'Merge Sort & Quick Sort', 'Tries',
    ],
    advanced: [
      'Advanced DP (Knapsack, LCS, LIS)', 'Graph Algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall)',
      'Union-Find / Disjoint Set', 'Segment Trees & BIT', 'Topological Sort',
      'Advanced Graph (SCC, Bridges, Articulation Points)', 'KMP & Rabin-Karp',
    ],
  },
];

// Practice sets for Full Stack
export const FS_PRACTICE_SETS = [
  {
    id: 's1', label: 'Set 1', title: 'HTML + CSS Basics', subtitle: 'Structure & Styling', color: '#60A5FA',
    projects: [
      'Responsive navigation bar (hamburger menu on mobile).',
      'Tribute page for your favorite person/thing.',
      'Product card with hover effects.',
      'Pricing table (3 columns with "most popular" highlight).',
      'Survey/Form page with proper labels and inputs.',
      'Photo gallery grid using CSS Grid.',
      'Landing page hero section with background image.',
      'Testimonial carousel (pure CSS if possible).',
      'Responsive sidebar layout (collapsible).',
      'Blog post layout with article, aside, and footer.',
    ],
  },
  {
    id: 's2', label: 'Set 2', title: 'CSS Advanced', subtitle: 'Flexbox, Grid, Animations', color: '#818CF8',
    projects: [
      'CSS-only accordion (click to expand).',
      'Image hover overlay with text and icon.',
      'Responsive dashboard layout using Grid.',
      'Animated progress bars.',
      'Flip card effect (front/back on hover).',
      'Sticky navbar that changes on scroll.',
      'CSS-only tabs.',
      'Parallax scrolling effect (simple version).',
      'Neumorphism or Glassmorphism card design.',
      'Dark/Light mode toggle with CSS variables.',
    ],
  },
  {
    id: 's3', label: 'Set 3', title: 'JavaScript Basics', subtitle: 'DOM Manipulation', color: '#34D399',
    projects: [
      'Range slider controlling opacity (interview classic).',
      'Counter (increase / decrease / reset) with buttons.',
      'Todo List (add, delete, mark complete).',
      'Simple Calculator ( +, −, ×, ÷ ).',
      'Random quote generator (array of quotes).',
      'Password generator with options (length, symbols, etc.).',
      'Color palette generator (random hex colors).',
      'Digital clock (live updating).',
      'Form validation (email, password match, required fields).',
      'Modal popup (open / close with overlay).',
    ],
  },
  {
    id: 's4', label: 'Set 4', title: 'Intermediate JS', subtitle: 'Interactivity', color: '#FBBF24',
    projects: [
      'Expense Tracker (add income/expense, show balance, list).',
      'Quiz App with multiple questions and score.',
      'Weather App (use a free API like OpenWeatherMap).',
      'Notes App with localStorage (save notes).',
      'Drag and Drop task board (like Trello mini).',
      'Searchable list/filter (e.g., list of countries).',
      'Infinite scroll mock (load more items on scroll).',
      'Image slider/carousel with next/prev + auto-play.',
      'BMI Calculator with categories (underweight, normal, etc.).',
      'Tip Calculator for restaurants.',
    ],
  },
  {
    id: 's5', label: 'Set 5', title: 'Advanced Mini Projects', subtitle: 'Combine Everything', color: '#F472B6',
    projects: [
      'Movie search app (use TMDB or OMDB API).',
      'E-commerce product page with cart (add to cart, localStorage).',
      'Chat UI mock (send messages, fake replies).',
      'Pomodoro Timer (25 min work + break).',
      'Recipe finder (search by ingredient).',
      'Memory matching game (flip cards).',
      'Rock Paper Scissors with score tracking.',
      'Markdown previewer (live preview as you type).',
      'URL shortener UI (mock functionality).',
      'Personal portfolio website (combine many things above).',
    ],
  },
];

// ─── DATA ANALYTICS TRACK ──────────────────────────────────────────────────────

export const DA_MONTHS = [
  {
    num: 1, title: 'Excel + SQL Basics',
    color: '#A3DC19', bg: 'rgba(163,220,25,0.08)',
    goal: 'Excel fundamentals + SQL basics mastered',
    milestones: [
      'Excel: formulas, Pivot Tables, VLOOKUP/INDEX-MATCH',
      'Excel: charts, conditional formatting, dashboards',
      'SQL: SELECT, JOIN, GROUP BY, subqueries',
      'SQL: Aggregate functions, indexes, transactions',
    ],
  },
  {
    num: 2, title: 'SQL Advanced + Statistics',
    color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',
    goal: 'Advanced SQL + statistics foundations',
    milestones: [
      'SQL: Window functions (ROW_NUMBER, RANK, LAG/LEAD)',
      'SQL: CTEs, query optimization, EXPLAIN',
      'Statistics: Mean, median, mode, standard deviation',
      'Statistics: Hypothesis testing, A/B testing, distributions',
    ],
  },
  {
    num: 3, title: 'Python for Data',
    color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',
    goal: 'Python data analysis pipeline complete',
    milestones: [
      'Python basics: lists, dicts, functions, Jupyter',
      'NumPy arrays + Pandas DataFrames',
      'Data cleaning: handling nulls, duplicates, outliers',
      'Matplotlib + Seaborn visualizations',
    ],
  },
  {
    num: 4, title: 'Power BI + Data Viz',
    color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',
    goal: '1 published Power BI dashboard on resume',
    milestones: [
      'Power BI: connect data, Power Query transformations',
      'Power BI: DAX basics (CALCULATE, FILTER, SUMX)',
      'Power BI: relationships, drill-through, slicers',
      'DA Project: end-to-end dashboard for portfolio',
    ],
  },
  {
    num: 5, title: 'Tableau + Portfolio',
    color: '#EC4899', bg: 'rgba(236,72,153,0.08)',
    goal: '2 portfolio DA projects published',
    milestones: [
      'Tableau: basic charts, calculated fields, filters',
      'Tableau: LOD expressions, dashboard design',
      'Portfolio Project 1: SQL + Python + Power BI end-to-end',
      'Portfolio Project 2: Tableau dashboard published to Tableau Public',
    ],
  },
  {
    num: 6, title: 'DA Job Hunt + First Role',
    color: '#06B6D4', bg: 'rgba(6,182,212,0.08)',
    goal: 'First Data Analyst role landed',
    milestones: [
      'Resume + LinkedIn optimized for DA roles',
      'Interview prep: SQL problems, statistics questions, case studies',
      '50+ DA job applications submitted',
      'First Data Analyst role accepted',
    ],
  },
];

// For dashboard progress bars
export const DA_SUBJECTS = [
  { name: 'SQL',        target: 25, color: '#F59E0B' },
  { name: 'Python',     target: 30, color: '#3B82F6' },
  { name: 'Power BI',   target: 20, color: '#FDC800' },
  { name: 'Excel',      target: 15, color: '#22C55E' },
  { name: 'Statistics', target: 15, color: '#EC4899' },
  { name: 'Tableau',    target: 15, color: '#06B6D4' },
];

// For profile stack bars
export const STACK_DA = [
  { label: 'SQL',        key: 'SQL',        target: 25 },
  { label: 'Python',     key: 'Python',     target: 30 },
  { label: 'Power BI',   key: 'Power BI',   target: 20 },
  { label: 'Excel',      key: 'Excel',      target: 15 },
  { label: 'Statistics', key: 'Statistics', target: 15 },
  { label: 'Tableau',    key: 'Tableau',    target: 15 },
];

// Full curriculum for Subjects page (track: 'da')
export const DA_CURRICULUM = [
  {
    id: 'sql', name: 'SQL', color: '#F59E0B', track: 'da',
    timerSubject: 'SQL',
    courseUrl: 'https://www.geeksforgeeks.org/batch/cip-1?tab=Resources', courseLabel: 'GFG',
    beginner: [
      'SELECT, FROM, WHERE', 'INSERT, UPDATE, DELETE', 'ORDER BY & LIMIT',
      'Data Types', 'Primary Key & Foreign Key', 'Basic Joins (INNER JOIN)',
    ],
    intermediate: [
      'LEFT / RIGHT / FULL OUTER JOIN', 'GROUP BY & HAVING', 'Subqueries',
      'Aggregate Functions', 'Indexes & Performance', 'Transactions & ACID',
      'Views', 'Stored Procedures & Functions',
    ],
    advanced: [
      'Window Functions (ROW_NUMBER, RANK, LEAD/LAG)', 'CTEs (WITH clause)',
      'Query Optimization & EXPLAIN', 'Partitioning', 'Database Normalization (1NF–3NF)',
      'Locking & Concurrency', 'Replication & High Availability',
    ],
  },
  {
    id: 'excel', name: 'Excel', color: '#22C55E', track: 'da',
    timerSubject: 'Excel',
    beginner: [
      'Cells, rows, columns, basic navigation',
      'Formatting: fonts, colors, borders, alignment',
      'Basic formulas: SUM, COUNT, AVERAGE, MIN, MAX',
      'Charts: bar, line, pie basics',
      'Data entry + auto-fill + number formats',
    ],
    intermediate: [
      'VLOOKUP & HLOOKUP', 'INDEX + MATCH',
      'IF, AND, OR nested formulas',
      'Pivot Tables + Pivot Charts',
      'Conditional Formatting', 'Data Validation',
      'COUNTIF / SUMIF / AVERAGEIF', 'Text functions (LEFT, RIGHT, MID, TRIM)',
    ],
    advanced: [
      'Array formulas + XLOOKUP', 'Power Query (Get & Transform)',
      'Macro basics (record + run)', 'Dashboard creation in Excel',
      'Data consolidation + What-if analysis',
      'Dynamic arrays (FILTER, SORT, UNIQUE)',
    ],
  },
  {
    id: 'python_da', name: 'Python (Data)', color: '#3B82F6', track: 'da',
    timerSubject: 'Python',
    beginner: [
      'Python basics: variables, lists, dicts, tuples',
      'Loops (for, while) & conditional logic',
      'Functions, modules, file I/O',
      'Jupyter Notebook setup & workflow',
      'Installing pandas/numpy with pip',
    ],
    intermediate: [
      'NumPy: arrays, operations, broadcasting',
      'Pandas: Series, DataFrames, read_csv/read_excel',
      'Data cleaning: dropna, fillna, drop_duplicates',
      'Filtering, groupby, merge, pivot_table',
      'Matplotlib: line, bar, scatter, histogram',
      'Seaborn: heatmaps, boxplots, pairplots',
    ],
    advanced: [
      'Advanced pandas (multi-index, rolling, resample)',
      'Scikit-learn basics: regression, classification',
      'Web scraping (requests + BeautifulSoup)',
      'APIs: pulling data via REST + JSON parsing',
      'Statistical testing with scipy.stats',
    ],
  },
  {
    id: 'statistics', name: 'Statistics', color: '#EC4899', track: 'da',
    timerSubject: 'Statistics',
    beginner: [
      'Mean, Median, Mode', 'Range, Variance, Standard Deviation',
      'Normal distribution & bell curve',
      'Probability basics (events, outcomes)',
      'Types of data: nominal, ordinal, interval, ratio',
    ],
    intermediate: [
      'Hypothesis testing (null vs alternative)',
      'p-value, significance level (α), Type I/II error',
      'z-test vs t-test', 'Chi-square test',
      'Pearson correlation coefficient',
      'Simple linear regression',
    ],
    advanced: [
      'Multiple regression', 'ANOVA',
      'A/B testing design & analysis',
      'Confidence intervals & margin of error',
      'Bayesian basics', 'Time series decomposition',
    ],
  },
  {
    id: 'powerbi', name: 'Power BI', color: '#FDC800', track: 'da',
    timerSubject: 'Power BI',
    beginner: [
      'Connecting to data sources (Excel, CSV, SQL)',
      'Power Query: filter, rename, change type, remove columns',
      'Creating basic visuals: bar, line, card, table',
      'Slicers, filters, cross-filtering',
    ],
    intermediate: [
      'DAX: CALCULATE, SUM, COUNT, FILTER',
      'DAX: SUMX, AVERAGEX, DIVIDE',
      'Relationships between tables (1:M, M:M)',
      'Drill-through pages + bookmarks',
      'Row-level security (RLS)',
    ],
    advanced: [
      'Advanced DAX: ALLEXCEPT, USERELATIONSHIP',
      'Time intelligence: DATEADD, SAMEPERIODLASTYEAR',
      'Performance optimization (star schema)',
      'Publishing to Power BI Service',
      'Embedding reports + scheduled refresh',
    ],
  },
  {
    id: 'tableau', name: 'Tableau', color: '#06B6D4', track: 'da',
    timerSubject: 'Tableau',
    beginner: [
      'Connect to Excel / CSV / database',
      'Dimensions vs Measures, blue vs green pills',
      'Basic charts: bar, line, scatter, pie, map',
      'Filters: dimension, measure, table calculation',
    ],
    intermediate: [
      'Calculated fields (IF, CASE, string/date functions)',
      'Level of Detail (LOD) expressions: FIXED, INCLUDE, EXCLUDE',
      'Dashboard design: layout containers, actions',
      'Parameters + dynamic reference lines',
      'Dual-axis charts, combo charts',
    ],
    advanced: [
      'Table calculations (WINDOW_SUM, RUNNING_TOTAL)',
      'Tableau Prep for data cleaning',
      'Publishing to Tableau Public / Tableau Server',
      'Custom SQL + data blending',
      'Storytelling with data (Story Points)',
    ],
  },
  {
    id: 'datacleaning', name: 'Data Cleaning', color: '#F97316', track: 'da',
    timerSubject: 'Data Cleaning',
    beginner: [
      'Identifying dirty data (missing values, duplicates, typos)',
      'Excel: remove duplicates, trim spaces, find & replace',
      'Understanding data types and format issues',
    ],
    intermediate: [
      'Pandas: dropna, fillna strategies',
      'String cleaning: strip, lower, replace regex',
      'Outlier detection: IQR method, z-score',
      'Data type conversion: astype, to_datetime',
      'Reshaping: melt, pivot, stack/unstack',
    ],
    advanced: [
      'Automated data validation pipelines',
      'Schema enforcement with pandera / Great Expectations',
      'ETL basics: Extract, Transform, Load',
      'Handling large datasets with chunking',
    ],
  },
  {
    id: 'dataviz', name: 'Data Visualization', color: '#8B5CF6', track: 'da',
    timerSubject: 'Data Visualization',
    beginner: [
      'Choosing the right chart type for data',
      'Principles: simplicity, clarity, honesty',
      'Color theory for data (sequential, diverging, categorical)',
      'Basic storytelling with data structure',
    ],
    intermediate: [
      'Matplotlib + Seaborn: styling, themes, subplots',
      'Interactive charts with Plotly Express',
      'Dashboard layout principles',
      'Annotating charts: titles, labels, callouts',
    ],
    advanced: [
      'D3.js basics for custom web visuals',
      'Custom visuals in Power BI',
      'Building infographic-style dashboards',
      'Tableau advanced storytelling',
    ],
  },
];

// Practice sets for Data Analytics
export const DA_PRACTICE_SETS = [
  {
    id: 'da1', label: 'DA Set 1', title: 'Excel Projects', subtitle: 'Data wrangling + dashboards', color: '#22C55E',
    projects: [
      'Sales dashboard with Pivot Table, slicers, and chart.',
      'Budget tracker: categories, monthly totals, conditional formatting.',
      'Student grade calculator with IF/AND + letter grades.',
      'Product inventory with stock alerts (conditional formatting).',
      'HR dataset: employee age/salary stats with AVERAGEIF/COUNTIF.',
    ],
  },
  {
    id: 'da2', label: 'DA Set 2', title: 'SQL Practice', subtitle: 'Queries, joins, aggregations', color: '#F59E0B',
    projects: [
      'Query a retail DB: top 10 best-selling products by revenue.',
      'Find all customers who placed orders in the last 30 days.',
      'Calculate month-over-month growth rate using window functions.',
      'Identify duplicate email addresses in a users table.',
      'Rank employees by salary within each department (DENSE_RANK).',
      'Write a CTE to find 3rd highest salary without LIMIT.',
    ],
  },
  {
    id: 'da3', label: 'DA Set 3', title: 'Python Data Analysis', subtitle: 'pandas + matplotlib projects', color: '#3B82F6',
    projects: [
      "Load a CSV, clean nulls, describe the dataset with .describe().",
      'Plot a bar chart of top 5 categories by count using matplotlib.',
      'Merge two DataFrames and compute a derived metric.',
      'Group by month and plot a trend line for total sales.',
      'Detect and remove outliers using IQR method.',
      'Create a correlation heatmap with seaborn for a numeric dataset.',
    ],
  },
  {
    id: 'da4', label: 'DA Set 4', title: 'Power BI Projects', subtitle: 'Dashboards + DAX', color: '#FDC800',
    projects: [
      'Connect to Excel sales data + create a bar chart and KPI card.',
      'Build a date table and use DATEADD for month-over-month comparison.',
      'Add a slicer + sync it across multiple pages.',
      'Use CALCULATE + FILTER to show sales excluding returns.',
      'Publish a report to Power BI Service and share the link.',
    ],
  },
  {
    id: 'da5', label: 'DA Set 5', title: 'End-to-End DA Projects', subtitle: 'Portfolio-ready case studies', color: '#8B5CF6',
    projects: [
      'End-to-end: SQL → Python → Power BI sales analysis pipeline.',
      'Tableau Public: publish an interactive dashboard on a real dataset.',
      'Python EDA: Titanic / HR / Sales dataset — 5 insight summary.',
      'A/B test analysis: calculate p-value + write a conclusion report.',
      'Time series: plot monthly revenue trend + identify seasonality.',
    ],
  },
];

// All subjects combined (for Subjects page)
export const ALL_SUBJECTS = [...FS_CURRICULUM, ...DA_CURRICULUM];

// ─── PROFILE DATA ──────────────────────────────────────────────────────────────

export const DAILY_SCHEDULE = [
  { time: '10:00 PM – 06:00 AM', label: 'Sleep',      desc: '8 hours — non-negotiable',              type: 'off' },
  { time: '06:00 – 10:00 AM',    label: 'Gym',        desc: 'Gym + travel + post-workout',           type: 'break', duration: '4h' },
  { time: '10:00 – 10:30 AM',    label: 'Breakfast',  desc: 'Meal + freshen up',                     type: 'break' },
  { time: '10:30 AM – 01:00 PM', label: 'Block 1',    desc: 'Full Stack Dev — React / JS',           type: 'study', duration: '2.5h' },
  { time: '01:00 – 02:00 PM',    label: 'Lunch',      desc: 'Meal + rest',                           type: 'break' },
  { time: '02:00 – 05:00 PM',    label: 'Block 2',    desc: 'Backend / Node.js',                     type: 'study', duration: '3h' },
  { time: '05:00 – 05:30 PM',    label: 'Tea Break',  desc: 'Tea + walk',                            type: 'break' },
  { time: '05:30 – 07:00 PM',    label: 'Block 3',    desc: 'Data Analytics — SQL / Power BI',       type: 'study', duration: '1.5h' },
  { time: '07:00 – 09:00 PM',    label: 'Projects',   desc: 'Build projects + GitHub commits',       type: 'study', duration: '2h' },
  { time: '09:00 – 09:30 PM',    label: 'Dinner',     desc: 'Meal',                                  type: 'break' },
  { time: '09:30 – 10:00 PM',    label: 'LinkedIn',   desc: 'LinkedIn + job applications',           type: 'prep' },
];

export const EVENING_DAILY_SCHEDULE = [
  { time: '12:00 – 08:30 AM',    label: 'Sleep',      desc: '8.5 hours — non-negotiable',            type: 'off' },
  { time: '08:30 – 09:00 AM',    label: 'Breakfast',  desc: 'Meal + freshen up',                     type: 'break' },
  { time: '09:00 AM – 12:00 PM', label: 'Block 1',    desc: 'Full Stack Dev — React / JS',           type: 'study', duration: '3h' },
  { time: '12:00 – 01:00 PM',    label: 'Lunch',      desc: 'Meal + rest',                           type: 'break' },
  { time: '01:00 – 04:00 PM',    label: 'Block 2',    desc: 'Backend / Node.js',                     type: 'study', duration: '3h' },
  { time: '04:00 – 04:30 PM',    label: 'Tea Break',  desc: 'Tea + walk',                            type: 'break' },
  { time: '04:30 – 06:00 PM',    label: 'Block 3',    desc: 'Data Analytics — SQL / Power BI',       type: 'study', duration: '1.5h' },
  { time: '06:00 – 06:30 PM',    label: 'LinkedIn',   desc: 'LinkedIn + job applications',           type: 'prep' },
  { time: '06:30 – 09:00 PM',    label: 'Gym',        desc: 'Gym workout',                           type: 'break', duration: '2.5h' },
  { time: '09:00 – 09:30 PM',    label: 'Travel',     desc: 'Travel back + rest + shower',           type: 'break' },
  { time: '09:30 – 10:00 PM',    label: 'Dinner',     desc: 'Meal',                                  type: 'break' },
  { time: '10:00 – 11:00 PM',    label: 'Revision',   desc: 'Light project work / revision',         type: 'study', duration: '1h' },
  { time: '11:00 PM – 12:00 AM', label: 'Wind Down',  desc: 'Sleep prep',                            type: 'prep' },
];

export const MONTHLY_PLAN = [
  {
    month: 1, title: 'Foundation Rebuild', color: '#A3DC19',
    weeks: [
      { week: 1, subject: 'JavaScript (ES6+)', topic: 'ES6+, async/await, Promises, DOM' },
      { week: 2, subject: 'React',             topic: 'Hooks, Context, React Router, Vite' },
      { week: 3, subject: 'SQL',               topic: 'SELECT, JOINs, GROUP BY, subqueries' },
      { week: 4, subject: 'Excel',             topic: 'Pivot Tables, VLOOKUP, dashboards' },
    ],
  },
  {
    month: 2, title: 'Backend & SQL Advanced', color: '#3B82F6',
    weeks: [
      { week: 5, subject: 'Node.js',     topic: 'Express, REST APIs, JWT Auth, Middleware' },
      { week: 6, subject: 'Node.js',     topic: 'MongoDB/PostgreSQL, Mongoose/Prisma, CRUD' },
      { week: 7, subject: 'SQL',         topic: 'Window functions, CTEs, query optimization' },
      { week: 8, subject: 'Statistics',  topic: 'Hypothesis testing, regression, A/B tests' },
    ],
  },
  {
    month: 3, title: 'Polish + Python for Data', color: '#8B5CF6',
    weeks: [
      { week: 9,  subject: 'Python',    topic: 'pandas, NumPy, data cleaning' },
      { week: 10, subject: 'Python',    topic: 'matplotlib, seaborn, EDA' },
      { week: 11, subject: 'Projects',  topic: 'Project 3: full stack or E-commerce clone' },
      { week: 12, subject: 'Power BI',  topic: 'Power Query, DAX basics, dashboards' },
    ],
  },
  {
    month: 4, title: 'Interview Mode + Power BI', color: '#F59E0B',
    weeks: [
      { week: 13, subject: 'DSA',      topic: 'Arrays, Linked Lists, Stacks, Binary Search' },
      { week: 14, subject: 'DSA',      topic: 'Trees, Graphs, Dynamic Programming basics' },
      { week: 15, subject: 'Power BI', topic: 'Advanced DAX, time intelligence, publish' },
      { week: 16, subject: 'Projects', topic: 'DA portfolio project + job applications' },
    ],
  },
  {
    month: 5, title: 'First Offer + Tableau', color: '#EC4899',
    weeks: [
      { week: 17, subject: 'Tableau',    topic: 'Charts, LOD, dashboards, Tableau Public' },
      { week: 18, subject: 'Projects',   topic: 'Final FS portfolio project + 50+ applications' },
      { week: 19, subject: 'Interviews', topic: 'Mock interviews, salary negotiation, offers' },
      { week: 20, subject: 'Interviews', topic: 'Continue applying, evaluate and accept offer' },
    ],
  },
  {
    month: 6, title: 'Employed + Growth', color: '#06B6D4',
    weeks: [
      { week: 21, subject: 'Work',        topic: 'Join company + onboard' },
      { week: 22, subject: 'Open Source', topic: 'Contribute to OSS + build AI projects' },
      { week: 23, subject: 'DA Course',   topic: 'Complete remaining DA modules on weekends' },
      { week: 24, subject: 'Growth',      topic: 'Plan for 12-month salary jump' },
    ],
  },
];

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

export const START_DATE = new Date('2026-06-01');

export function getCurrentMonth() {
  const diff = Date.now() - START_DATE.getTime();
  return Math.max(1, Math.min(6, Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)) + 1));
}

// localStorage key for persisting active path selection
export const PATH_STORAGE_KEY = 'hustler_career_path';

export function getStoredPath() {
  return localStorage.getItem(PATH_STORAGE_KEY) || 'fs';
}
export function setStoredPath(path) {
  localStorage.setItem(PATH_STORAGE_KEY, path);
}

// localStorage key for persisting the active gym mode ('morning' | 'evening')
export const GYM_MODE_STORAGE_KEY = 'hustler_gym_mode';
// fired on window after the stored gym mode changes, so other open pages can re-sync
export const GYM_MODE_CHANGE_EVENT = 'hustler-gym-mode-change';

export function getStoredGymMode() {
  return localStorage.getItem(GYM_MODE_STORAGE_KEY) === 'evening' ? 'evening' : 'morning';
}
export function setStoredGymMode(mode) {
  localStorage.setItem(GYM_MODE_STORAGE_KEY, mode);
}

// ─── COMBINED EXPORT ───────────────────────────────────────────────────────────

export const CAREER_PATHS = {
  fs: {
    id: 'fs', label: 'Full Stack Dev',
    months: FS_MONTHS, subjects: FS_SUBJECTS,
    curriculum: FS_CURRICULUM, practice: FS_PRACTICE_SETS, stack: STACK_FS,
    dsaTarget: 150,
  },
  da: {
    id: 'da', label: 'Data Analyst',
    months: DA_MONTHS, subjects: DA_SUBJECTS,
    curriculum: DA_CURRICULUM, practice: DA_PRACTICE_SETS, stack: STACK_DA,
  },
};
