import type { Metadata } from "next";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteProfile, getVisibleSocialLinks } from "@/lib/queries/public";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Curriculum Vitae — Full-Stack Software Engineer",
  description:
    "Curriculum vitae of a full-stack software engineer: enterprise ERP systems, banking webhook integrations, edge biometrics, and production web platforms.",
  alternates: {
    canonical: "/cv",
  },
};

/** Bolds the parts of a bullet wrapped in double asterisks. */
const bold = (text: string) =>
  text
    .split("**")
    .map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part,
    );

const SUMMARY =
  "Results-driven Full-Stack Software Engineer and Computer Science graduate (GPA 3.97/4.00) with hands-on experience engineering high-reliability web applications, operational ERPs, and distributed services. Architected institutional financial systems processing bank Virtual Account webhooks with 100% automated ledger reconciliation, and engineered client-side AI biometrics with sub-400ms verification. Proficient in TypeScript, React, Next.js, Laravel, and PostgreSQL with a strong focus on clean architecture, performance optimization, and reliable delivery.";

const SKILLS: { label: string; items: string }[] = [
  {
    label: "Languages",
    items:
      "TypeScript, JavaScript (ES6+), PHP (8+), SQL, HTML5, CSS3, Go (Basic)",
  },
  {
    label: "Frontend",
    items:
      "React.js, Next.js, Inertia.js, Vue.js (Vue 3), Tailwind CSS, Canvas API, GSAP Motion",
  },
  {
    label: "Backend & APIs",
    items:
      "Laravel, Node.js, RESTful APIs, Webhooks, Redis, Microservices Fundamentals, Spatie RBAC",
  },
  {
    label: "Databases & Storage",
    items:
      "PostgreSQL, MySQL, Database Indexing, Relational Modeling, Transactional Atomicity",
  },
  {
    label: "DevOps & Testing",
    items:
      "Git/GitHub, Docker, Linux VPS Deployment, Playwright E2E Testing, Vite, CI/CD Actions",
  },
];

const EXPERIENCE: {
  company: string;
  role: string;
  period: string;
  location: string;
  points: string[];
  stack: string;
}[] = [
  {
    company: "Acrylico Art & Signage",
    role: "Full-Stack Software Engineer",
    period: "August 2026 — October 2026",
    location: "Semarang, Indonesia",
    points: [
      "Engineered custom **Acrylico ERP** to digitize manufacturing workflows, replacing legacy paper job-tickets with real-time operational boards.",
      "Implemented edge facial recognition clock-in utilizing @vladmandic/face-api (128-d tensor embeddings), verifying worker attendance in under 400ms entirely client-side without streaming sensitive biometrics to external clouds.",
      "Built interactive shop floor Kanban ticket boards providing real-time production telemetry across cutting, bending, engraving, and QC workstations.",
      "Architected progressive billing engine synchronizing quotations, purchase orders, material costs, and down-payment status transitions.",
      "Authored automated end-to-end test suites using Playwright, validating authentication, attendance biometrics, and invoice states on every release.",
    ],
    stack:
      "Vue 3, Inertia.js, Laravel, MySQL, TensorFlow/Face-API, Playwright, Tailwind CSS",
  },
  {
    company: "Nata Code",
    role: "Front End Developer",
    period: "July 2026 — October 2026",
    location: "Semarang, Indonesia",
    points: [
      "Architected hybrid SPA client applications using React 18, Inertia.js 2.0, and Laravel, eliminating full-page reload latencies and reducing route transitions to zero.",
      "Integrated custom WebGL/GLSL shader backgrounds and kinetic viewport motion systems (GSAP ScrollTrigger, Parallax) with smooth frame rates.",
      "Developed dynamic hardware tier profiling engine (useDeviceTier) assessing device RAM and concurrency to scale animation budgets, sustaining locked 60fps motion across mobile devices.",
      "Engineered modular service catalog and case-study CMS with instant live search and theme persistence.",
    ],
    stack:
      "React 18, TypeScript, Inertia.js, Laravel, GSAP, Canvas API, WebGL, Tailwind CSS, Vite",
  },
  {
    company: "CV Nastiti Utama Mandiri (Timnas Production)",
    role: "Full-Stack Software Engineer",
    period: "January 2026 — March 2026",
    location: "Semarang, Indonesia",
    points: [
      "Co-developed **Timnas Production ERP**, a centralized operations management platform for regional event campaigns and field personnel.",
      "Designed dynamic profit margin calculation engine supporting dual management fee formulas (deduction and markup), accelerating financial report generation from weeks to real-time.",
      "Implemented geospatial Leaflet GPS mapping for live field team dispatching, site location tracking, and attendance verification across Central Java.",
      "Built structured before/after photo inspection pipeline with client-side image compression, reducing upload bandwidth while ensuring tamper-resistant site logs.",
      "Configured granular role-based access control (RBAC) using Spatie Laravel Permission, isolating Super Admin, Finance, PM, and Field Staff consoles.",
    ],
    stack: "Laravel, Inertia.js, React.js, Leaflet Maps, MySQL, Tailwind CSS, Git",
  },
  {
    company: "MAN 1 Kota Semarang",
    role: "Full-Stack Software Engineer",
    period: "March 2025 — September 2026",
    location: "Semarang, Indonesia",
    points: [
      "Architected and deployed **SIMMAN E-Budgeting**, an institutional financial ERP managing fee collections and budgets across thousands of students.",
      "Integrated direct Host-to-Host (H2H) banking webhook pipelines, automating 100% of student Virtual Account (VA) payment reconciliation directly into the general ledger without manual human intervention.",
      "Engineered automated RKA budgeting engine that programmatically enforced hard-locks on departmental spending ceilings, eliminating operational over-expenditures.",
      "Developed automated bank reconciliation pipeline balancing internal ledger records against daily bank mutation statements, accelerating month-end audit closings from days to instant queries.",
      "Automated multi-tier PDF and Excel financial audit reports with programmatic validation and hierarchical digital approval workflows.",
    ],
    stack: "Laravel, PostgreSQL, Redis, RESTful Webhooks, Docker, Linux VPS",
  },
];

const EDUCATION = {
  school: "Universitas Semarang (USM)",
  degree: "Bachelor of Computer Science (S1 Teknik Informatika)",
  period: "2022 — 2026",
  location: "Semarang, Indonesia",
  points: [
    "**Cumulative GPA:** 3.97 / 4.00 (Cum Laude / Highest Distinction)",
    "**Academic Scholarship (YAU USM):** Recipient of the Academic Achievement Scholarship from Yayasan Alumni Undip & USM for achieving a semester GPA of 3.99.",
    '**Peer-Reviewed Research (SINTA 2):** First author of "Securing Educational Financial Data Against Insider Threats: A Hybrid Blockchain Approach with Merkle Tree Aggregation" published in Journal of Information Systems and Informatics (August 2026).',
  ],
};

const CERTIFICATIONS: {
  name: string;
  issuer?: string;
  period: string;
  credential?: string;
  detail?: string;
}[] = [
  {
    name: "MLOps: A Multiple Case Study in Industry",
    issuer: "LPKL FTIK Universitas Semarang",
    period: "Nov 2026",
    credential: "1488/USM.H4.FTIK/I/2026",
    detail:
      "Intensive training covering automated data pipelines, model testing, versioning, containerized deployment, and industrial AI integration.",
  },
  {
    name: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    period: "April 2023 — July 2023",
    detail:
      "Network architecture, IPv4/IPv6 addressing, subnetting, Ethernet switching, and routing protocols.",
  },
  {
    name: "32-hour Business English Course (Grade A / Score 85-100)",
    issuer: "BBJ Universitas Semarang",
    period: "July 2023 — August 2023",
    detail:
      "Professional workplace English communication, presentations, and technical documentation.",
  },
  {
    name: "Prediction Test of TOEFL (Score 427) & 32-hour Preparation Course",
    issuer: "BBJ Universitas Semarang",
    period: "2023",
  },
];

const SECTION_TITLE =
  "mb-5 border-b border-border pb-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground";

const BUTTON_PRIMARY =
  "inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase rounded-[3px] border border-neutral-900 bg-[#0a0a0a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.12)] hover:bg-neutral-800 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all cursor-pointer";

const BUTTON_SECONDARY =
  "inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer";

export default async function CvPage() {
  const profile = await getSiteProfile();
  const socialLinks = await getVisibleSocialLinks(profile?.id ?? null);
  const email = profile?.email ?? "adialfianhafiz@gmail.com";

  return (
    <div
      className="flex min-h-full flex-1 flex-col bg-background text-foreground"
      suppressHydrationWarning
    >
      <div className="print:hidden">
        <SiteHeader />
      </div>

      <main id="main-content" className="flex-1">
        {/* ——— Masthead (screen only) ——— */}
        <section className="bg-background pt-12 pb-10 md:pt-16 md:pb-12 print:hidden">
          <div className="mx-auto max-w-[880px] px-6">
            <p
              className="mb-6 text-xs font-medium tracking-[0.2em] uppercase text-muted"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Curriculum Vitae &bull; Full-Stack Software Engineer
            </p>
            <h1
              className="text-4xl font-normal tracking-[-0.02em] leading-[1.04] text-foreground sm:text-6xl md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Curriculum Vitae
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Production work across institutional finance, industrial
              fabrication, and agency web platforms. Enterprise ERP systems,
              banking integrations, and interfaces built to stay fast under
              load.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/cv/CV_Adi_Alfian_Hafis.pdf"
                download
                className={BUTTON_PRIMARY}
              >
                <span>Download PDF</span>
                <span aria-hidden="true">&darr;</span>
              </a>
              <a
                href="/cv/CV_Adi_Alfian_Hafis.docx"
                download
                className={BUTTON_SECONDARY}
              >
                <span>Download DOCX</span>
                <span aria-hidden="true">&darr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* ——— Document ——— */}
        <section className="mx-auto max-w-[880px] px-6 pb-16 pt-6 md:pb-20 md:pt-8 print:p-0">
          <article className="cv-doc text-[13px] leading-[1.65] text-neutral-700">
            {/* Identity */}
            <header className="cv-header border-b border-foreground pb-5 print:pb-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Adi Alfian Hafis
              </h2>
              <p className="mt-1 text-[12px] font-medium tracking-[0.14em] uppercase text-muted">
                Full-Stack Software Engineer
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                Semarang, Indonesia (Open to Remote / Relocation)
                <span className="mx-1.5" aria-hidden="true">
                  &bull;
                </span>
                <a
                  href={`mailto:${email}`}
                  className="whitespace-nowrap hover:text-foreground hover:underline"
                >
                  {email}
                </a>
                <span className="mx-1.5" aria-hidden="true">
                  &bull;
                </span>
                <a
                  href="https://linkedin.com/in/adialfianhafis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap hover:text-foreground hover:underline"
                >
                  linkedin.com/in/adialfianhafis
                </a>
                <span className="mx-1.5" aria-hidden="true">
                  &bull;
                </span>
                <a
                  href="https://github.com/adialfyan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap hover:text-foreground hover:underline"
                >
                  github.com/adialfyan
                </a>
                <span className="mx-1.5" aria-hidden="true">
                  &bull;
                </span>
                <a
                  href="https://adiallllllll.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap hover:text-foreground hover:underline"
                >
                  adiallllllll.vercel.app
                </a>
              </p>
            </header>

            {/* Summary */}
            <section className="mt-10 print:mt-6">
              <h3 className={SECTION_TITLE}>Professional Summary</h3>
              <p>{SUMMARY}</p>
            </section>

            {/* Skills */}
            <section className="mt-10 print:mt-6">
              <h3 className={SECTION_TITLE}>Technical Skills</h3>
              <dl className="divide-y divide-border/70">
                {SKILLS.map((group) => (
                  <div
                    key={group.label}
                    className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[170px_1fr] sm:gap-4"
                  >
                    <dt className="text-[11px] font-semibold tracking-[0.14em] uppercase text-foreground">
                      {group.label}
                    </dt>
                    <dd className="text-neutral-700">{group.items}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Experience */}
            <section className="mt-10 print:mt-6">
              <h3 className={SECTION_TITLE}>Work &amp; Project Experience</h3>
              <div className="space-y-8 print:space-y-5">
                {EXPERIENCE.map((item) => (
                  <div key={item.company} className="cv-entry">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <h4 className="text-[13.5px] font-semibold tracking-tight text-foreground">
                        {item.company}
                        <span className="font-normal text-muted"> — {item.role}</span>
                      </h4>
                      <span className="shrink-0 text-[10.5px] font-medium tracking-[0.12em] uppercase text-muted sm:text-right">
                        {item.period} &bull; {item.location}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {item.points.map((point) => (
                        <li key={point} className="relative pl-4">
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-[0.68em] h-px w-2 bg-neutral-400"
                          />
                          {bold(point)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[11.5px] italic text-muted">
                      Technologies: {item.stack}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="mt-10 print:mt-6">
              <h3 className={SECTION_TITLE}>Education &amp; Honors</h3>
              <div className="cv-entry">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h4 className="text-[13.5px] font-semibold tracking-tight text-foreground">
                    {EDUCATION.school}
                    <span className="font-normal text-muted"> — {EDUCATION.degree}</span>
                  </h4>
                  <span className="shrink-0 text-[10.5px] font-medium tracking-[0.12em] uppercase text-muted sm:text-right">
                    {EDUCATION.period} &bull; {EDUCATION.location}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {EDUCATION.points.map((point) => (
                    <li key={point} className="relative pl-4">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.68em] h-px w-2 bg-neutral-400"
                      />
                      {bold(point)}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Certifications */}
            <section className="mt-10 print:mt-6">
              <h3 className={SECTION_TITLE}>Certifications &amp; Technical Training</h3>
              <div className="space-y-5 print:space-y-4">
                {CERTIFICATIONS.map((cert) => (
                  <div key={cert.name} className="cv-entry">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <h4 className="text-[13px] font-semibold tracking-tight text-foreground">
                        {cert.name}
                        {cert.issuer && (
                          <span className="font-normal text-muted"> — {cert.issuer}</span>
                        )}
                      </h4>
                      <span className="shrink-0 text-[10.5px] font-medium tracking-[0.12em] uppercase text-muted sm:text-right">
                        {cert.period}
                      </span>
                    </div>
                    {cert.credential && (
                      <p className="mt-0.5 text-[11.5px] text-muted">
                        Credential: {cert.credential}
                      </p>
                    )}
                    {cert.detail && (
                      <p className="mt-1 text-[12px] text-neutral-700">{cert.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </article>
        </section>
      </main>

      <div className="print:hidden">
        <SiteFooter email={profile?.email ?? null} socialLinks={socialLinks} />
      </div>
    </div>
  );
}
