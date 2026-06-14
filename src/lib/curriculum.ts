export interface Task {
  id: string;
  title: string;
  scope: string;
  criteria: string;
}

export interface TrackInfo {
  id: 'PYTHON' | 'UI_UX' | 'CPP' | 'WEB_DEV' | 'REACT' | 'NEXT_JS' | 'MERN';
  title: string;
  desc: string;
  tasks: Task[];
}

export const tracks: Record<string, TrackInfo> = {
  PYTHON: {
    id: 'PYTHON',
    title: 'Python Development Specialization',
    desc: 'Focuses on asynchronous distributed systems, multi-threaded pipelines, automated crawlers, data normalizations, and high-performance services.',
    tasks: [
      {
        id: 'PY-01',
        title: 'Asynchronous Distributed Scraping Engine',
        scope: 'Build an elegant, high-throughput scraper using asyncio and aiohttp.',
        criteria: 'Implement sliding-window rate limiters, dynamic deep DOM tree queries, regex cleaners, and normalized JSON schemas. Must gracefully catch 5xx server issues and prevent IP bans.'
      },
      {
        id: 'PY-02',
        title: 'High-Throughput REST API Engine via FastAPI',
        scope: 'Develop a highly scalable FastAPI REST backend.',
        criteria: 'Implement relational localized SQLite tables, custom Pydantic schemas, and structured database migrations. Enforce speed optimizations under 45ms per response.'
      },
      {
        id: 'PY-03',
        title: 'Multi-Threaded Log Analysis Engine',
        scope: 'Construct a command-line interface map-reduce processor.',
        criteria: 'Execute safe heap multi-threading to scan multi-gigabyte log logs. Perform high-performance regex matching, calculate exception distributions, and report thread efficiency metrics.'
      },
      {
        id: 'PY-04',
        title: 'Data Engineering Pipeline via Pandas',
        scope: 'Map out automated ETL cleansers handling raw unformatted CSV sheets.',
        criteria: 'Perform vector transformations, execute outlier profiling, clean null matrices, group descriptive analytics, and export high-fidelity binary outputs.'
      },
      {
        id: 'PY-05',
        title: 'Asynchronous Task Worker Queue',
        scope: 'Build a raw thread-safe queue engine.',
        criteria: 'Implement priority handling, persistent disk-based fail safes, automated task retries on failure, and dynamic concurrency worker caps.'
      }
    ]
  },
  UI_UX: {
    id: 'UI_UX',
    title: 'Premium UI/UX Digital Product Design',
    desc: 'Specializes in high-fidelity luxury digital designs, variable-driven design grids, motion curves, micro-states, and high-conversion landing systems.',
    tasks: [
      {
        id: 'UI-01',
        title: 'Dark Luxury SaaS Control Center Panel',
        scope: 'Create a high-contrast obsidian digital dashboard tracking cloud computing streams.',
        criteria: 'Use #0b0f19 base Obsidian canvas, apply modern glassmorphism (1px border at 8% opacity), map precise 8px layout grids, cyan focal coordinates, and design responsive mobile layouts.'
      },
      {
        id: 'UI-02',
        title: 'Frictionless E-Commerce Checkout Pipeline',
        scope: 'Map candidate checkout experiences.',
        criteria: 'Present fully-wired Figma interactive prototype sheets detailing complex user payment states, inline validation errors, form prevention locks, and premium easing transitions.'
      },
      {
        id: 'UI-03',
        title: 'Atomic Enterprise Design System',
        scope: 'Construct a robust Figma component stylesheet catalog.',
        criteria: 'Detail typographic variable hierarchies, strict color ranges, component variant tokens, input state matrices, and versatile page layout grids.'
      },
      {
        id: 'UI-04',
        title: 'Conversion-Optimized SaaS Landing Design',
        scope: 'Formulate a high-impact SaaS marketing index page.',
        criteria: 'Integrate custom testimonial displays, structured product pricing blocks, fluid neon call-to-actions, and clear structural hierarchy satisfying AAA contrast requirements.'
      },
      {
        id: 'UI-05',
        title: 'Complex Interactive Component Specs',
        scope: 'Detail advanced motion interactions inside design frames.',
        criteria: 'Design custom side drawers, dynamic graph trackers, animated drawer selections, and compile explicit cubic-bezier speed definitions.'
      }
    ]
  },
  CPP: {
    id: 'CPP',
    title: 'C++ Advanced Systems Engineering',
    desc: 'Validates raw dynamic heap management, persistent binary database handlers, pathfinding mathematical vectors, and parallel thread safe algorithms.',
    tasks: [
      {
        id: 'CP-01',
        title: 'Custom Heap-Allocated Memory Vector Class',
        scope: 'Build a dynamic array template structure from scratch.',
        criteria: 'Manage dynamic heap pointers, design exact deep-copy and move operators, override array scaling parameters, and satisfy Valgrind audits with 0 memory leaks.'
      },
      {
        id: 'CP-02',
        title: 'Object-Oriented Database Engine',
        scope: 'Write a CLI records management database.',
        criteria: 'Process persistent binary disk files, read index nodes using pointer calculations, implement robust string query search, and catch bad inputs cleanly.'
      },
      {
        id: 'CP-03',
        title: 'Algorithmic Pathfinding Core Engine',
        scope: 'Construct highly optimized graph analysis engines (Dijkstra or A*).',
        criteria: 'Scan spatial grid parameters, optimize memory layout to avoid fragmentation, and export coordinates list to external trace formats.'
      },
      {
        id: 'CP-04',
        title: 'Parallel Multi-Threaded Matrix Engine',
        scope: 'Code accelerated matrix multiplier engines using native concurrency (std::thread).',
        criteria: 'Partition calculations dynamically, establish safe thread locks to prevent collisions, and output benchmark acceleration metrics.'
      },
      {
        id: 'CP-05',
        title: 'Cryptographic Bit-Manipulation File Tool',
        scope: 'Create a localized executable encoding binary structures.',
        criteria: 'Perform custom XOR block cipher operations, employ high-performance bit masks, buffer large streams cleanly, and report metrics.'
      }
    ]
  },
  WEB_DEV: {
    id: 'WEB_DEV',
    title: 'Core Web Development (HTML5, CSS3, Vanilla JS)',
    desc: 'Verifies extreme semantic accessibility, vanilla JavaScript DOM listeners, reactive localStorage state persistence, and native layout control.',
    tasks: [
      {
        id: 'WD-01',
        title: 'Semantic Accessible Agency Webpage',
        scope: 'Develop a responsive agency index webpage from scratch.',
        criteria: 'Satisfy absolute W3C validation, enforce structural grid styles, design fluid typography, and score >98% on accessibility audit matrices.'
      },
      {
        id: 'WD-02',
        title: 'Vanilla JS Kanban Task Workspace',
        scope: 'Create an interactive task boards planner application.',
        criteria: 'Use native JavaScript Event Listeners, manipulate DOM nodes dynamically, store task progress lists in localStorage, and manage element drop drag behaviors cleanly.'
      },
      {
        id: 'WD-03',
        title: 'Interactive Data/Financial Simulator',
        scope: 'Construct dynamic financial interest planners.',
        criteria: 'Capture input fields securely, calculate custom logarithmic equations, display numerical metrics inside stylized HTML bars, and reject empty/bad strings.'
      },
      {
        id: 'WD-04',
        title: 'Pure Layout Control System',
        scope: 'Build complex responsive application frames without using external CSS toolkits.',
        criteria: 'Employ modular CSS Grid and Flexbox rules, animate responsive drawers natively, and apply smooth transitions.'
      },
      {
        id: 'WD-05',
        title: 'Asynchronous API Data Display',
        scope: 'Design a dynamic search engine retrieving remote server details.',
        criteria: 'Query endpoint arrays via fetch(), incorporate offline state catch, perform array searching/sorting, and dynamically paint changes to the page.'
      }
    ]
  },
  REACT: {
    id: 'REACT',
    title: 'React.js Component Engineering',
    desc: 'Analyzes React state coordination, custom hook caches, responsive layout virtualizers, and rich interactive components.',
    tasks: [
      {
        id: 'RE-01',
        title: 'Global State Metric Control Board',
        scope: 'Build a multi-pane cloud monitoring layout.',
        criteria: 'Manage nested states via React Context or Redux Toolkit, coordinate batch data operations, map structured matrices, and prevent unwanted re-renders.'
      },
      {
        id: 'RE-02',
        title: 'Infinite Grid Visualizer Portal',
        scope: 'Implement a highly performant infinite scroll catalog.',
        criteria: 'Utilize raw IntersectionObserver API, serialize scroll coordinates in memory, implement virtual grid elements for large array loads, and design smooth skeleton loading panels.'
      },
      {
        id: 'RE-03',
        title: 'Custom Structural React Hook Suite',
        scope: 'Compile a reusable package of performance custom React hooks.',
        criteria: 'Code a complex form validator hook, and build custom async request caching hooks with built-in query debounce parameters.'
      },
      {
        id: 'RE-04',
        title: 'Interactive Drag Kanban Grid Component',
        scope: 'Design interactive component workspaces.',
        criteria: 'Handle state arrays, re-index items dynamically, support custom cursor contextual menus, and manage multi-list card transfers smoothly.'
      },
      {
        id: 'RE-05',
        title: 'Live Client Markdown Processor',
        scope: 'Construct a side-by-side markdown visual editor.',
        criteria: 'Parse strings into structured HTML elements, integrate strict sanitization filters against script injection, and synchronize scroll states across view panes.'
      }
    ]
  },
  NEXT_JS: {
    id: 'NEXT_JS',
    title: 'Next.js Production Architecture',
    desc: 'Targets hybrid SSR/SSG compilers, Serverless API routing, Incremental Static Regeneration hooks, and edge optimization rules.',
    tasks: [
      {
        id: 'NX-01',
        title: 'Static Publishing Engine with ISR Hooks',
        scope: 'Develop dynamic blog content architectures.',
        criteria: 'Parse markdown files, execute compile paths using generateStaticParams(), and configure hourly Incremental Static Regeneration revalidation.'
      },
      {
        id: 'NX-02',
        title: 'Server-Side Crypto Metric Dashboard',
        scope: 'Build server-rendered dashboard templates.',
        criteria: 'Fetch dynamic data inside React Server Components, apply React Suspense streaming layouts, and capture database latency errors.'
      },
      {
        id: 'NX-03',
        title: 'SEO-Optimized SaaS Conversion Platform',
        scope: 'Develop high-performance product indices pages.',
        criteria: 'Configure dynamic metadata generation metadata, apply next/image optimizations, structure semantic outline hierarchies, and maximize Core Web Vitals.'
      },
      {
        id: 'NX-04',
        title: 'Multi-Language Integration Framework',
        scope: 'Build automated routing translators.',
        criteria: 'Configure Next.js Middleware parsing languages path, fetch dictionary translation files, and persist selections across views.'
      },
      {
        id: 'NX-05',
        title: 'Optimized Media Management Pipeline',
        scope: 'Implement blurred placeholder media loaders.',
        criteria: 'Fetch images, generate dynamic base64 blur representations on the server, scale dynamic dimensions to prevent Cumulative Layout Shifts (CLS).'
      }
    ]
  },
  MERN: {
    id: 'MERN',
    title: 'Full Stack MERN Enterprise Ecosystems',
    desc: 'The ultimate specialization. Focuses on JWT httpOnly cookie authentications, WebSockets synchronization engines, dynamic server filtering, and Mongo aggregations.',
    tasks: [
      {
        id: 'ME-01',
        title: 'Cryptographically Secure Authentication System',
        scope: 'Create secure stateless and stateful authentication APIs.',
        criteria: 'Use bcrypt for password hashing. Configure volatile memory Access JWTs combined with secure, httpOnly, SameSite, long-lived Refresh JWT cookies. Enforce active database checks to allow token blacklisting.'
      },
      {
        id: 'ME-02',
        title: 'Real-Time Project Board via WebSockets',
        scope: 'Develop collaborative workspace maps using Socket.io and React.',
        criteria: 'Stream real-time card transitions, resolve multi-user synchronization lock conflicts, and commit coordinates to MongoDB.'
      },
      {
        id: 'ME-03',
        title: 'Product Engine with Advanced Filtering',
        scope: 'Write intensive inventory database query interfaces.',
        criteria: 'Parse REST options, run regex matching, configure numerical pagination, and implement debounced inputs in the React front-end.'
      },
      {
        id: 'ME-04',
        title: 'Cloud-Synced Collaborative Text Engine',
        scope: 'Construct unified synchronized text editing panes.',
        criteria: 'Record string changes, debounce upload requests to Express APIs, filter script injections, and resolve data editing race conditions.'
      },
      {
        id: 'ME-05',
        title: 'Analytical MongoDB Aggregation Pipeline',
        scope: 'Design massive data aggregation queries.',
        criteria: 'Compile complex pipeline stages ($match, $group, $sort, $project) to transform logs into metrics. Paint results inside custom React SVG charts.'
      }
    ]
  }
};

export const getTrackTitle = (trackKey: string): string => {
  return tracks[trackKey]?.title || trackKey;
};
export const getTrackDesc = (trackKey: string): string => {
  return tracks[trackKey]?.desc || '';
};
export const getTrackTasks = (trackKey: string): Task[] => {
  return tracks[trackKey]?.tasks || [];
};
