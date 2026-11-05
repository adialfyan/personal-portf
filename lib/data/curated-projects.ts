import type { ProjectDetail } from "@/lib/queries/types";

export const CURATED_PROJECTS: ProjectDetail[] = [
  {
    id: "proj-01-simman",
    title: "SIMMAN E-Budgeting",
    slug: "simman-e-budgeting",
    summary:
      "Institution-grade financial ERP with real-time Host-to-Host (H2H) Virtual Account banking clearing, automated student syahriyah reconciliation, and strict division RKA expenditure enforcement.",
    project_type: "Enterprise Financial ERP",
    role: "Lead Full-Stack Engineer & ERP Architect",
    client: "MAN 1 Kota Semarang",
    year: "2025 - Present",
    duration: "Active Production",
    status: "published",
    is_featured: true,
    sort_order: 1,
    cover_image_path: "/projects/simman-dashboard.jpg",
    live_url: "https://man1kotasemarang.sch.id/sim/",
    repository_url: "https://github.com/adialfyan/keuanganman",
    overview:
      "SIMMAN E-Budgeting is a centralized financial operating system engineered for MAN 1 Kota Semarang. It unifies high-throughput student education fee transactions, automated Host-to-Host (H2H) banking Virtual Account reconciliation, and rigorous division-level budget allocations under a single real-time general ledger.",
    problem:
      "Managing institutional cash flow across thousands of students carries severe administrative overhead. The legacy workflow relied on manual bank statement verifications for education fees, paper-based budget requests by Vice Principals, and error-prone end-of-month reconciliations. The institution required an absolute, automated ledger system to prevent financial anomalies and eliminate human error.",
    approach:
      "We architected an enterprise-grade financial core handling everything from department-level RKA (Work Plan & Budget) ceiling locks to real-time clearance of student syahriyah fees via direct Host-to-Host (H2H) bank Virtual Account webhooks with strict transactional atomicity.",
    technical_decisions:
      `01 — Key Engineering Highlights:

01. Host-to-Host (H2H) Virtual Account Banking Integration
Direct webhook synchronization communicating with core banking partner systems. Each student is assigned a static Virtual Account (VA). When parents pay via ATM, Mobile Banking, or e-Wallet, transactions clear invoices instantly and update the immutable general ledger in milliseconds without human intervention.

02. Strict RKA Budgeting Engine
Total digitization of the institution's Work Plan and Budget. The system hard-locks operational expenditures for each Vice Principal division, programmatically rejecting disbursements that exceed approved ceilings.

03. Automated Bank Reconciliation
Smart comparison pipeline that balances internal system transactions against daily external bank mutation statements, isolating discrepancies instantly.

04. Dynamic Financial Reporting
Programmatic PDF/Excel reporting engine for cash mutations, RKA realization, and arrear audits featuring multi-tier hierarchical approvals and dynamic digital signatures.

05. Automated CI/CD Deployment
Code pushes pass through automated linting, test suites, and Dockerized build runners, deploying directly to the institution's independent production VPS.`,
    outcome:
      `01 — Measurable Impact:

01. Eliminated 100% of manual teller payment verification through direct Host-to-Host banking webhooks.
02. Programmatically hard-locked division spending ceilings, preventing budgetary over-expenditures.
03. Accelerated end-of-month financial audit close times from days to instant automated ledger queries.
04. Delivered tamper-proof audit trails compliant with state institutional accounting standards.`,
    reflection:
      "Architecting financial infrastructure for a public institution demands an uncompromising stance on data integrity and transactional atomicity. Designing strict programmatic constraints around budget ceilings and banking webhooks eliminates human error entirely, transforming bureaucratic friction into effortless auditability.",
    published_at: "2025-01-01T00:00:00Z",
    technologies: [
      { id: "tech-laravel", name: "Laravel", slug: "laravel" },
      { id: "tech-psql", name: "PostgreSQL", slug: "postgresql" },
      { id: "tech-redis", name: "Redis", slug: "redis" },
      { id: "tech-bank", name: "Bank H2H API", slug: "bank-h2h" },
      { id: "tech-docker", name: "Docker", slug: "docker" },
      { id: "tech-ghactions", name: "GitHub Actions", slug: "github-actions" },
    ],
    links: [],
    media: [
      {
        id: "media-simman-01",
        project_id: "proj-01-simman",
        image_path: "/projects/simman-landing.jpg",
        caption: "Official institutional portal for student syahriyah and tuition fee verification.",
        sort_order: 1,
      },
      {
        id: "media-simman-03",
        project_id: "proj-01-simman",
        image_path: "/projects/simman-va-portal.jpg",
        caption: "Integrated student syahriyah portal with direct Host-to-Host (H2H) Virtual Account clearing.",
        sort_order: 2,
      },
    ],
  },
  {
    id: "proj-02-acrylico",
    title: "Acrylico Manufacturing ERP",
    slug: "acrylico-app",
    summary:
      "Manufacturing resource planning platform with on-device face biometric clock-in, real-time shop floor workstation queues, and order lifecycle billing.",
    project_type: "Industrial ERP & AI Biometrics",
    role: "Lead Full-Stack Engineer",
    client: "Acrylico Industrial Fabrication",
    year: "2026",
    duration: "Production Deployed",
    status: "published",
    is_featured: true,
    sort_order: 2,
    cover_image_path: "/projects/acrylico-workshop-screen.png",
    live_url: "https://acrylico.id/login",
    repository_url: "https://github.com/adialfyan/acrylic-erp",
    overview:
      "Acrylico ERP is a custom industrial operating system built for commercial acrylic fabrication. It orchestrates real-time workstation ticket queues, operator milestone tracking, on-device AI face recognition attendance, and progressive project invoice reconciliation.",
    problem:
      "Custom industrial manufacturing faces unpredictable shop-floor bottlenecks, paper job-tickets, and buddy-punching in worker attendance. Traditional ERPs are too generic to track multi-stage cutting, bending, engraving, and assembly pipelines with accurate milestone proofs.",
    approach:
      "Engineered an Inertia.js & Vue 3 command center backed by on-device `@vladmandic/face-api` tensor models for instant biometric clock-in without sending raw video feeds to external clouds, paired with real-time shop floor Kanban telemetry.",
    technical_decisions:
      `01 — Key Engineering Highlights:

01. On-Device Edge Biometrics
Integrated client-side face detection using 128-dimensional facial embedding vectors. Verifies worker attendance within 400ms entirely in-browser, guaranteeing privacy and offline resilience.

02. Shop Floor Command Center
Live workshop display boards and operator ticket queues tracking cutting, laser engraving, assembly, and QC inspection in real-time.

03. Progressive Down Payment & Billing Ledger
Two-phase down payment verification system synchronizing quotation generation, purchase orders, material procurement costs, and final balance invoices.

04. Playwright End-to-End Test Suite
Automated headless browser test suites validating worker biometric recognition, invoice status transitions, and role-based permissions on every release.`,
    outcome:
      `01 — Measurable Impact:

01. 100% elimination of manual worker timecard tampering via edge facial biometrics.
02. Real-time shop floor visibility cutting order turnaround delays across production workstations.
03. Seamless financial synchronization between sales deposits and floor material disbursements.`,
    reflection:
      "Blending edge machine learning into enterprise web applications requires careful balancing of client-side performance, model bundle sizes, and reliable fallback states. The result is a fast, reliable operational tool for factory workers.",
    published_at: "2025-03-01T00:00:00Z",
    technologies: [
      { id: "tech-vue", name: "Vue 3", slug: "vue" },
      { id: "tech-inertia", name: "Inertia.js", slug: "inertia" },
      { id: "tech-laravel", name: "Laravel", slug: "laravel" },
      { id: "tech-faceapi", name: "Face-API (TensorFlow)", slug: "face-api" },
      { id: "tech-playwright", name: "Playwright", slug: "playwright" },
      { id: "tech-tailwind", name: "Tailwind CSS", slug: "tailwind" },
    ],
    links: [],
    media: [
      {
        id: "media-acrylico-01",
        project_id: "proj-02-acrylico",
        image_path: "/projects/acrylico-dashboard-screen.png",
        caption: "Executive operational and financial dashboard tracking active fabrication milestones, invoice aging, and order pipelines.",
        sort_order: 1,
      },
      {
        id: "media-acrylico-02",
        project_id: "proj-02-acrylico",
        image_path: "/projects/acrylico-portal-screen.png",
        caption: "Dedicated multi-role authentication portal for factory management, workshop floor operators, and engineering staff.",
        sort_order: 2,
      },
    ],
  },
  {
    id: "proj-06-natacode",
    title: "Nata Code Digital Agency",
    slug: "natacode",
    summary:
      "Creative software house and digital agency platform engineered with Laravel 13, Inertia.js 2.0, custom GPU GLSL shaders, and smooth Locomotive Scroll motion physics.",
    project_type: "Creative Tech & Agency Platform",
    role: "Lead Creative Technologist & UI/UX Architect",
    client: "Nata Code Agency",
    year: "2026",
    duration: "Active Production",
    status: "published",
    is_featured: true,
    sort_order: 3,
    cover_image_path: "/projects/natacode-hero.png",
    live_url: "https://natacode.id/",
    repository_url: "https://github.com/adialfyan/natacode",
    overview:
      "Nata Code is a contemporary software house and digital product agency platform built on international creative engineering standards (Cuberto × Locomotive × Basic Agency). It features hybrid SPA architecture with zero-delay routing, custom procedural GLSL shaders, and hardware-adaptive 60fps motion choreography.",
    problem:
      "Traditional creative agency websites often suffer from heavy WebGL assets that stutter on mid-tier mobile devices, disconnected CMS backends that require redeploying for content updates, and sluggish SPA routing that degrades user engagement.",
    approach:
      "Architected a unified Laravel 13 and Inertia.js 2.0 system powered by React 18 and Vite. Implemented custom GLSL Simplex Noise shaders with branchless Bayer matrix dithering, paired with a hardware tier profiler (useDeviceTier) that adapts animation budgets dynamically to guarantee 60fps across all screens.",
    technical_decisions:
      `01 — Key Engineering Highlights:

01. Hybrid SPA Architecture (Inertia 2.0 & Laravel 13)
Zero-API boilerplate routing connecting Laravel 13 controllers with React 18 components, providing instant client-side page transitions without page reloads.

02. Custom GLSL Shader Background & Bayer Dithering
Procedural 2D Simplex Noise shader responding dynamically to real-time cursor coordinates, optimized with branchless 4x4 Bayer Matrix dithering to eliminate GPU branching penalties.

03. Hardware Tier Profiling Engine
Dynamic scoring pipeline (useDeviceTier) assessing device RAM, CPU core concurrency, and network latency to intelligently scale animation complexity between high, mid, and low tiers.

04. Iris Radial Ink Preloader
Canvas 2D radial expansion simulation mimicking natural ink diffusion in water, synchronized with background asset hydration and progress-driven state machines.

05. Bezier Curve Dome Transitions
Custom SVG Quadratic Bezier dome page wipe transition enhanced with retro-computational Bayer dither overlays maintaining visual continuity during route changes.

06. Modular SaaS & Portfolio CMS
Database-driven content management console for agency service offerings, portfolio project case studies, and SaaS product tiers with dynamic pricing models.`,
    outcome:
      `01 — Measurable Impact:

01. Sustained locked 60fps rendering across desktop and mobile devices via intelligent hardware tier degradation.
02. Reduced perceived page transition latency to zero through Inertia.js hybrid SPA routing.
03. Eliminated GPU branch stalls using branchless 4x4 Bayer matrix shader dithering.
04. Delivered a unified CMS console managing creative services, portfolio items, and SaaS product tiers.`,
    reflection:
      "Balancing international-grade motion design with strict computational performance requires treating frame budgets as first-class constraints. Designing procedural shaders that degrade gracefully across hardware tiers proves that high-end aesthetics and speed can coexist effortlessly.",
    published_at: "2025-05-01T00:00:00Z",
    technologies: [
      { id: "tech-laravel", name: "Laravel 13", slug: "laravel" },
      { id: "tech-inertia", name: "Inertia.js", slug: "inertia" },
      { id: "tech-react", name: "React", slug: "react" },
      { id: "tech-gsap", name: "GSAP Motion", slug: "gsap" },
      { id: "tech-webgl", name: "WebGL / GLSL", slug: "webgl" },
      { id: "tech-locomotive", name: "Locomotive Scroll", slug: "locomotive-scroll" },
      { id: "tech-tailwind", name: "Tailwind CSS", slug: "tailwind" },
    ],
    links: [],
    media: [
      {
        id: "media-natacode-01",
        project_id: "proj-06-natacode",
        image_path: "/projects/natacode-services.png",
        caption: "Interactive digital solutions directory featuring animated accordion drawers and polished micro-states.",
        sort_order: 1,
      },
      {
        id: "media-natacode-02",
        project_id: "proj-06-natacode",
        image_path: "/projects/natacode-portfolio.png",
        caption: "Dual-mode portfolio catalog (List & Grid view) with dynamic hover-triggered project thumbnail previews.",
        sort_order: 2,
      },
      {
        id: "media-natacode-03",
        project_id: "proj-06-natacode",
        image_path: "/projects/natacode-outro.png",
        caption: "High-contrast brand finale and conversion outro with colossal typographic layout and location metadata.",
        sort_order: 3,
      },
    ],
  },
  {
    id: "proj-03-projectteams",
    title: "Timnas Production ERP",
    slug: "projectteams",
    summary:
      "Enterprise operations platform combining multi-basis margin financial ledgers, GPS-tagged field activity monitoring, and SPG personnel dispatch.",
    project_type: "Operations & Financial ERP",
    role: "Lead Full-Stack Engineer",
    client: "PT Nastiti Utama Mandiri (Timnas Production)",
    year: "2026",
    duration: "Production Deployed",
    status: "published",
    is_featured: true,
    sort_order: 4,
    cover_image_path: "/projects/projectteams-dashboard.jpg",
    live_url: null,
    repository_url: "https://github.com/adialfyan/ProjectTeams",
    overview:
      "Timnas Production ERP is an integrated enterprise operations platform engineered for PT Nastiti Utama Mandiri. It bridges executive financial margin auditing, multi-basis profit-and-loss reports, real-time field activity telemetry, and regional brand ambassador (SPG) dispatch management under a unified real-time dashboard.",
    problem:
      "Regional production campaigns and field marketing activities suffered from disconnected reporting pipelines. Supervisors tracked field teams across unverified chat groups, while finance calculated margins retrospectively from static spreadsheets, creating reconciliation lags and revenue leakage across client projects.",
    approach:
      "Architected a unified Laravel & Inertia.js platform integrating real-time margin realization engines, interactive Leaflet location dispatching, before/after site inspection verifications, and hierarchical approval workflows for purchase orders and client billing.",
    technical_decisions:
      `01 — Key Engineering Highlights:

01. Multi-Basis Financial Margin Engine
Configurable financial calculation pipeline supporting dynamic management fee formulas (deduction vs. markup), real-time contracted revenue tracking, and automated Net Margin realization.

02. Interactive Field Mapping & Dispatch Telemetry
Integrated geospatial Leaflet map interfaces tracking regional project locations, active field staff check-ins, and on-site delivery verification across Central Java.

03. Structured Before/After Inspection Pipeline
Atomic media upload pipeline enforcing baseline and completion verification photo pairs with client-side compression and GPS timestamp hashing.

04. Multi-Tenant Role & Permission Isolation
Fine-grained authorization architecture via Spatie permissions segregating Super Admin, Finance, Project Managers, and Field Staff consoles.`,
    outcome:
      `01 — Measurable Impact:

01. Unified multi-project financial margin tracking and operational field logs into a single centralized command center.
02. Accelerated invoice generation, client PO reconciliation, and budget realization auditing from weeks to real-time.
03. Eliminated operational discrepancies through programmatic before/after grouping and location-tagged site inspections.`,
    reflection:
      "Building internal ERPs for dynamic operational agencies demands a tight coupling between financial ledger precision and frictionless field worker UX. When operational telemetry directly feeds the general ledger, business clarity replaces administrative friction.",
    published_at: "2024-11-01T00:00:00Z",
    technologies: [
      { id: "tech-laravel", name: "Laravel", slug: "laravel" },
      { id: "tech-inertia", name: "Inertia.js", slug: "inertia" },
      { id: "tech-react", name: "React", slug: "react" },
      { id: "tech-leaflet", name: "Leaflet Maps", slug: "leaflet" },
      { id: "tech-mysql", name: "MySQL", slug: "mysql" },
      { id: "tech-tailwind", name: "Tailwind CSS", slug: "tailwind" },
    ],
    links: [],
    media: [
      {
        id: "media-projteam-01",
        project_id: "proj-03-projectteams",
        image_path: "/projects/projectteams-order-detail.jpg",
        caption: "Project lifecycle management console with real-time margin financials, document compliance, and geospatial site locations.",
        sort_order: 1,
      },
      {
        id: "media-projteam-02",
        project_id: "proj-03-projectteams",
        image_path: "/projects/projectteams-financial-reports.jpg",
        caption: "Realized margin calculation engine featuring multi-basis project reporting, cash flow analysis, and automated PDF export.",
        sort_order: 2,
      },
    ],
  },
  {
    id: "proj-04-jejaklab",
    title: "JEJAK-Lab DLT Network",
    slug: "jejaklab",
    summary:
      "Permissioned enterprise blockchain testbed on Hyperledger Fabric 2.5 for anti-tampering laboratory asset provenance, CCAAS chaincodes, and IoT telemetry.",
    project_type: "Distributed Ledger & Blockchain",
    role: "Blockchain Engineer & Distributed Systems Lead",
    client: "Research Consortium (USM & MAN 2)",
    year: "2026",
    duration: "In Active Research (Soon)",
    status: "published",
    is_featured: true,
    sort_order: 5,
    cover_image_path: "/projects/jejaklab-dashboard.jpg",
    live_url: null,
    repository_url: null,
    overview:
      "JEJAK-Lab is an immutable laboratory asset tracking and chemical provenance testbed powered by Hyperledger Fabric 2.5. It enforces a strict multi-organization endorsement policy (`AND('USMMSP.peer', 'MAN2MSP.peer')`), Raft crash fault-tolerant ordering, and Chaincode-as-a-Service (CCAAS) containers for verifiable asset lifecycles.",
    problem:
      "High-value laboratory equipment, reagents, and hazardous chemical logs are prone to retroactive ledger alterations, unauthorized write-offs, and compliance fraud when managed via conventional centralized relational databases.",
    approach:
      "Architected a permissioned consortium DLT network spanning dual hosts with custom Go chaincodes enforcing First-Expired, First-Out (FEFO) chemical dispensing and physical ESP32 IoT scanning stations.",
    technical_decisions:
      `01 — Key Engineering Highlights:

01. Dual-Organization Endorsement Policy
Transactions require cryptographic consensus from both USM and MAN 2 peer nodes before committing to the shared Raft ledger, eliminating single-point authority manipulation.

02. Chaincode-as-a-Service (CCAAS) in Go
Isolated microservice chaincode containers handling chemical inventory, apparatus calibration, and student practicum ledger events independently from peer nodes.

03. Physical Label Verification & QR Pipeline
Automated SVG/PNG high-density cryptographic label generator tying physical chemical containers directly to their on-chain immutable hashes.

04. Hardware ESP32 & PWA Terminal Integration
Low-latency TCP API bridges linking physical IoT barcode scanners and a lightweight mobile Progressive Web App for laboratory assistants.`,
    outcome:
      `01 — Objectives & Impact:

01. Guaranteed non-repudiation and anti-tamper security for state educational lab assets.
02. Automated hazardous chemical expiry tracking through deterministic on-chain FEFO logic.
03. Validated multi-host distributed deployment across separate physical network nodes.`,
    reflection:
      "Enterprise distributed ledgers shine where mutual trust between independent entities must be mathematically enforced rather than administratively assumed. Designing deterministic chaincode logic requires rigorous defensive programming.",
    published_at: "2026-10-01T00:00:00Z",
    technologies: [
      { id: "tech-fabric", name: "Hyperledger Fabric", slug: "hyperledger-fabric" },
      { id: "tech-go", name: "Go (Golang)", slug: "go" },
      { id: "tech-docker", name: "Docker Compose", slug: "docker" },
      { id: "tech-iot", name: "ESP32 IoT", slug: "esp32" },
      { id: "tech-pwa", name: "PWA / TypeScript", slug: "pwa" },
    ],
    links: [],
    media: [
      {
        id: "media-jejaklab-01",
        project_id: "proj-04-jejaklab",
        image_path: "/projects/jejaklab-reagents.jpg",
        caption: "Laboratory reagent inventory catalog with storage shelf tracking and hazardous chemical expiration telemetry.",
        sort_order: 1,
      },
      {
        id: "media-jejaklab-02",
        project_id: "proj-04-jejaklab",
        image_path: "/projects/jejaklab-telemetry.jpg",
        caption: "IoT sensor time-series telemetry tracking real-time air quality, room temperature, and lab humidity.",
        sort_order: 2,
      },
    ],
  },
  {
    id: "proj-05-ascii-koi",
    title: "ASCII Nishikigoi Pond",
    slug: "ascii-koi",
    summary:
      "Autonomous 60fps creative computing simulation of living Japanese koi using Reynolds flocking boids, soft kinematic body waves, and monospace canvas rendering.",
    project_type: "Creative Tech & Generative Math",
    role: "Creator & Systems Engineer",
    client: "Open Source Creative Computing",
    year: "2026",
    duration: "Live Artifact",
    status: "published",
    is_featured: true,
    sort_order: 6,
    cover_image_path: "/projects/ascii-koi.jpg",
    live_url: "/shelf#ascii-aquarium",
    repository_url: "https://github.com/adialfyan/ascii-koi-",
    overview:
      "ASCII Nishikigoi Pond is an interactive, browser-based generative ecosystem simulating a living Japanese koi sanctuary. Rendered strictly in monospace characters on an HTML5 canvas, it features Reynolds flocking algorithmics, autonomous kinematic spine physics, and authentic Sumi-e watercolor dissipation.",
    problem:
      "Most web visual art either relies on heavy 3D rendering engines (Three.js) that consume excessive battery and GPU resources or degenerates into generic static illustrations devoid of life.",
    approach:
      "Engineered a zero-dependency procedural simulation in TypeScript. The engine solves multi-agent steering behaviors, spatial hash grid partitioning, and trigonometric spine wave propagation directly onto monospace typography at 60fps.",
    technical_decisions:
      `01 — Key Engineering Highlights:

01. Autonomous Kinematic Spine Waves
Each Nishikigoi consists of 20 discrete articulated nodes following a lead heading. Sinusoidal phase propagation generates lifelike body swishing, pectorals, and tail undulations.

02. Spatial Hash Grid Partitioning
Replaced O(N^2) boid neighbor distance calculations with a spatial hash bucket grid, allowing over 150 background fish and predator-prey dynamics to run under 2ms per frame.

03. Multi-Breed Procedural Patterns
Mathematical generation of authentic Nishikigoi patterns: Kohaku (coral red plates), Tancho (circular crown spot), Butterfly (flowing veil fins), and Benigoi (deep crimson).

04. Monochromatic Sumi-e Shading
Custom ASCII character density gradient mapped to Japanese calligraphy aesthetics, featuring multi-stop perimeter watercolor dissipation without oval halos.`,
    outcome:
      `01 — Measurable Impact:

01. Sustained 60fps performance across both desktop and mobile web browsers with zero external libraries.
02. Interactive touch/click ripples triggering boid flee reflexes and food-seeking behavior.
03. Open-sourced on GitHub as a standalone creative computing experiment.`,
    reflection:
      "Constraints breed elegance. Confining a living ecological simulation to the text characters of a monospace terminal forces precision in motion mathematics, turning computational geometry into quiet poetry.",
    published_at: "2026-10-15T00:00:00Z",
    technologies: [
      { id: "tech-ts", name: "TypeScript", slug: "typescript" },
      { id: "tech-canvas", name: "Canvas API", slug: "canvas-api" },
      { id: "tech-math", name: "Generative Physics", slug: "math-physics" },
      { id: "tech-nextjs", name: "Next.js", slug: "nextjs" },
    ],
    links: [],
    media: [],
  },
];
