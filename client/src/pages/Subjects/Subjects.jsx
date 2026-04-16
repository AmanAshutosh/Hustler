// src/pages/Subjects/Subjects.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronRight, CheckCircle2, Circle,
  Play, ExternalLink
} from 'lucide-react';
import './Subjects.css';

// ── Subject data ──────────────────────────────────────────────────────────────
const SUBJECTS = [
  {
    id: 'javascript',
    name: 'JavaScript',
    color: '#D1FF05',
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
    id: 'react',
    name: 'React',
    color: '#61dafb',
    timerSubject: 'React',
    courseUrl: 'https://namastedev.com/learn/namaste-react',
    courseLabel: 'NamasteDev',
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
    id: 'nodejs',
    name: 'Node.js',
    color: '#68a063',
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
    id: 'systemdesign',
    name: 'System Design',
    color: '#3b82f6',
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
    id: 'sql',
    name: 'SQL',
    color: '#f59e0b',
    timerSubject: 'SQL',
    courseUrl: 'https://www.geeksforgeeks.org/batch/cip-1?tab=Resources',
    courseLabel: 'GFG',
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
    id: 'dbms',
    name: 'DBMS',
    color: '#ec4899',
    timerSubject: 'DBMS',
    courseUrl: 'https://www.geeksforgeeks.org/batch/cip-1?tab=Resources',
    courseLabel: 'GFG',
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
    id: 'os',
    name: 'Operating System',
    color: '#06b6d4',
    timerSubject: 'Operating System',
    beginner: [
      'What is an OS?', 'Process vs Thread', 'Types of OS',
      'System Calls', 'Memory Layout of a Process', 'File System Basics',
    ],
    intermediate: [
      'Process Scheduling (FCFS, SJF, Round Robin, Priority)', 'Deadlock (Conditions, Prevention, Banker\'s Algorithm)',
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
    id: 'cn',
    name: 'Computer Networks',
    color: '#a855f7',
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
    id: 'english',
    name: 'English',
    color: '#10b981',
    timerSubject: 'English',
    courseUrl: 'https://www.udemy.com/course/complete-english-course-master-native-english-for-beginners/learn/lecture/31810926?start=0#overview',
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
    id: 'dsa',
    name: 'DSA',
    color: '#a855f7',
    timerSubject: 'DSA',
    courseUrl: 'https://namastedev.com/learn/namaste-dsa',
    courseLabel: 'NamasteDev',
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

const STORAGE_KEY = 'hustler_subject_progress';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Subjects() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(loadProgress);
  const [expanded, setExpanded] = useState({});
  const [levelOpen, setLevelOpen] = useState({});

  useEffect(() => { saveProgress(progress); }, [progress]);

  function toggleTopic(subjectId, level, topic) {
    const key = `${subjectId}.${level}.${topic}`;
    setProgress(p => ({ ...p, [key]: !p[key] }));
  }

  function toggleSubject(id) {
    setExpanded(e => ({ ...e, [id]: !e[id] }));
  }

  function toggleLevel(subjectId, level) {
    const key = `${subjectId}.${level}`;
    setLevelOpen(l => ({ ...l, [key]: !l[key] }));
  }

  function studyNow(subject, topic) {
    navigate('/timer', { state: { subject: subject.timerSubject, topic } });
  }

  function getSubjectStats(subject) {
    const all = [...subject.beginner, ...subject.intermediate, ...subject.advanced];
    const done = all.filter(t => progress[`${subject.id}.beginner.${t}`] ||
      progress[`${subject.id}.intermediate.${t}`] || progress[`${subject.id}.advanced.${t}`]).length;
    return { done, total: all.length };
  }

  function getLevelStats(subject, level) {
    const topics = subject[level];
    const done = topics.filter(t => progress[`${subject.id}.${level}.${t}`]).length;
    return { done, total: topics.length };
  }

  return (
    <div className="subjects-page">
      <div className="page-header">
        <h2>Subjects</h2>
        <p>Track your progress across every topic — Beginner to Advanced</p>
      </div>

      {/* Overview pills */}
      <div className="subject-overview">
        {SUBJECTS.map(s => {
          const { done, total } = getSubjectStats(s);
          const pct = Math.round((done / total) * 100);
          return (
            <button
              key={s.id}
              className="overview-pill"
              style={{ '--pill-color': s.color }}
              onClick={() => { toggleSubject(s.id); document.getElementById(`subj-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
            >
              <span className="pill-name">{s.name}</span>
              <span className="pill-pct">{pct}%</span>
              <div className="pill-bar">
                <div className="pill-fill" style={{ width: `${pct}%`, background: s.color }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Subject cards */}
      {SUBJECTS.map(subject => {
        const { done, total } = getSubjectStats(subject);
        const pct = Math.round((done / total) * 100);
        const isOpen = expanded[subject.id];

        return (
          <div className="subject-card" key={subject.id} id={`subj-${subject.id}`}>
            {/* Header */}
            <button className="subject-header" onClick={() => toggleSubject(subject.id)}>
              <div className="subject-title-row">
                <div className="subject-dot" style={{ background: subject.color }} />
                <span className="subject-name">{subject.name}</span>
                {subject.courseUrl && (
                  <a
                    href={subject.courseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="course-link-badge"
                    onClick={e => e.stopPropagation()}
                    title={`Open ${subject.courseLabel || 'course'}`}
                  >
                    <ExternalLink size={10} /> {subject.courseLabel || 'Course'}
                  </a>
                )}
                <span className="subject-stats">{done}/{total} topics</span>
              </div>
              <div className="subject-right">
                <div className="subject-bar-wrap">
                  <div className="subject-bar-track">
                    <div className="subject-bar-fill" style={{ width: `${pct}%`, background: subject.color }} />
                  </div>
                  <span className="subject-pct">{pct}%</span>
                </div>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>

            {/* Levels */}
            {isOpen && (
              <div className="subject-body">
                {['beginner', 'intermediate', 'advanced'].map(level => {
                  const { done: ld, total: lt } = getLevelStats(subject, level);
                  const levelKey = `${subject.id}.${level}`;
                  const isLevelOpen = levelOpen[levelKey] !== false; // default open

                  return (
                    <div className="level-section" key={level}>
                      <button className="level-header" onClick={() => toggleLevel(subject.id, level)}>
                        <div className="level-left">
                          <span className={`level-badge level-${level}`}>{level}</span>
                          <span className="level-count">{ld}/{lt}</span>
                        </div>
                        {isLevelOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>

                      {isLevelOpen && (
                        <ul className="topic-list">
                          {subject[level].map(topic => {
                            const key = `${subject.id}.${level}.${topic}`;
                            const done = !!progress[key];
                            return (
                              <li key={topic} className={`topic-item${done ? ' done' : ''}`}>
                                <button
                                  className="topic-check"
                                  onClick={() => toggleTopic(subject.id, level, topic)}
                                  aria-label={done ? 'Mark undone' : 'Mark done'}
                                >
                                  {done
                                    ? <CheckCircle2 size={16} className="check-done" />
                                    : <Circle size={16} className="check-empty" />
                                  }
                                </button>
                                <span className="topic-name">{topic}</span>
                                <button
                                  className="study-btn"
                                  onClick={() => studyNow(subject, topic)}
                                  title="Start timer for this topic"
                                >
                                  <Play size={11} /> Study
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
