import type { Metadata } from "next";
import Link from "next/link";
import { BouncyLine } from "@/components/public/bouncy-line";
import {
  MagazineDropCap,
  MagazineDossierTable,
  MagazinePortrait,
} from "@/components/public/magazine-elements";
import { Reveal } from "@/components/public/reveal";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteProfile, getVisibleSocialLinks } from "@/lib/queries/public";
import { getMediaUrl } from "@/lib/supabase/storage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About — Profile",
  description:
    "Background, experience, and projects of full-stack developer Adi Alfian Hafis.",
  alternates: {
    canonical: "/about",
  },
};

interface DisciplineItem {
  number: string;
  title: string;
  description: string;
}

const DISCIPLINES: DisciplineItem[] = [
  {
    number: "01",
    title: "Interactive Frontend",
    description:
      "Responsive user interfaces, clean component structures, and fluid interactions using React, Next.js, and TypeScript.",
  },
  {
    number: "02",
    title: "Kinetic Motion & Physics",
    description:
      "Procedural shaders, canvas simulations (60fps), GSAP timelines, and tactile viewport micro-interactions.",
  },
  {
    number: "03",
    title: "Full-Stack Architecture",
    description:
      "End-to-end web architectures powered by Laravel, Inertia.js, and RESTful APIs connecting client to server.",
  },
  {
    number: "04",
    title: "Creative Technology",
    description:
      "Experimental canvas rendering, procedural visual generation, and mathematical animation physics.",
  },
  {
    number: "05",
    title: "Interface Craft & Polish",
    description:
      "Clear typographic hierarchy, accessible semantic layouts, and precision tactile micro-interactions.",
  },
  {
    number: "06",
    title: "Testing & Systems Reliability",
    description:
      "Playwright end-to-end automation, client-side biometrics, CI/CD pipelines, and multi-device tier profiling.",
  },
];

interface CoreTechGroup {
  category: string;
  skills: string[];
}

const CORE_REPERTOIRE: CoreTechGroup[] = [
  {
    category: "Frontend & Motion",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Inertia.js",
      "Tailwind CSS",
      "GSAP",
      "Canvas API",
      "WebGL / GLSL",
      "Vue 3",
    ],
  },
  {
    category: "Full-Stack & Backend",
    skills: [
      "Laravel",
      "PHP 8+",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "REST & Webhook APIs",
      "Go",
      "Docker",
    ],
  },
  {
    category: "Architecture & Tools",
    skills: [
      "Tactile UI Design",
      "On-Device Biometrics",
      "Relational Data Modeling",
      "Playwright Testing",
      "Git & GitHub Actions",
      "Linux VPS Management",
    ],
  },
];

interface CaseReferenceItem {
  title: string;
  slug: string;
  tag: string;
  description: string;
}

const CASE_REFERENCES: CaseReferenceItem[] = [
  {
    title: "SIMMAN E-Budgeting",
    slug: "simman-e-budgeting",
    tag: "Banking Webhooks",
    description: "Centralized institutional budgeting & direct Host-to-Host Virtual Account clearing.",
  },
  {
    title: "Acrylico ERP",
    slug: "acrylico-app",
    tag: "Workshop Queues",
    description: "Industrial fabrication operations, station Kanban queues & edge face biometrics.",
  },
  {
    title: "Nata Code",
    slug: "natacode",
    tag: "Interactive Web",
    description: "Digital agency platform combining WebGL shaders, smooth motion & custom transitions.",
  },
];

export default async function AboutPage() {
  const profile = await getSiteProfile();
  const socialLinks = await getVisibleSocialLinks(profile?.id ?? null);

  const name = profile?.full_name || "Adi Alfian Hafis";
  const portraitUrl =
    getMediaUrl(profile?.portrait_path) || "/portrait.jpg";

  const dossierItems = [
    {
      label: "Discipline",
      value: "Full-Stack Developer",
    },
    {
      label: "Core Focus",
      value: "Web Applications, Internal Tools & APIs",
    },
    {
      label: "Timezone",
      value: profile?.timezone ? `UTC+7 (${profile.timezone})` : "UTC+7 (WIB)",
    },
    {
      label: "Availability",
      value: (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium tracking-[0.14em] uppercase rounded-[3px] border border-neutral-200/90 bg-white text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
          <span>{profile?.availability_text ?? "Available for work"}</span>
        </span>
      ),
    },
    {
      label: "Official Dispatch",
      value: profile?.email ? (
        <a
          href={`mailto:${profile.email}`}
          className="hover:underline transition-all"
        >
          {profile.email}
        </a>
      ) : (
        "adialfianhafiz@gmail.com"
      ),
    },
    ...(profile?.resume_url
      ? [
          {
            label: "Curriculum Vitae",
            value: (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium tracking-[0.14em] uppercase rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px] transition-all cursor-pointer"
              >
                <span>Download PDF</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground" suppressHydrationWarning>
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ——— Header (Consistent with Writing, Shelf & Portfolio) ——— */}
        <section className="border-b border-border bg-background pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <p
              className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              About &bull; Profile
            </p>
            <h1
              className="max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-[-0.02em] leading-[1.04] text-foreground text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Frontend &amp; full-stack developer building responsive web products &amp; tactile experiences.
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted font-normal leading-relaxed text-balance">
              Working across modern React component architectures, kinetic motion physics, and dependable Laravel backend foundations.
            </p>
          </div>
        </section>

        {/* ——— Two-Wing Magazine Spread (Balanced Layout — No Empty Voids) ——— */}
        <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Wing (5 Columns): Portrait + Technical Dossier Table */}
            <div className="lg:col-span-5 space-y-8">
              {/* Portrait with Tactile Toggle Button & Margin Credit */}
              <MagazinePortrait
                src={portraitUrl}
                alt={name}
                caption="Frontend & full-stack developer building tactile web applications and creative digital systems."
                credit="PHOTOGRAPHY &bull; EDITORIAL ARCHIVE"
              />

              {/* Dossier Table */}
              <div>
                <div className="flex items-center justify-between pb-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground">
                  <span>Technical Dossier</span>
                  <span className="text-muted font-normal">Summary</span>
                </div>
                <MagazineDossierTable items={dossierItems} />
              </div>
            </div>

            {/* Right Wing (7 Columns): Story Spread + 2-Column Features + Case Studies Ledger */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-10">
              {/* Lead Story with Classic Drop Cap */}
              <Reveal>
                <MagazineDropCap letter="I">
                  <p className="text-lg sm:text-xl font-normal leading-relaxed text-foreground">
                    am a frontend-focused full-stack developer who builds tactile web applications, interactive creative experiences, and dependable digital systems. Over the past few years, I have developed software across client digital platforms, manufacturing fabrication, and education finance.
                  </p>
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted font-normal">
                    My work centers on building polished, responsive systems: modern React component structures that feel tactile and fluid, kinetic motion systems that run at locked frame rates, and solid backend services that keep records consistent.
                  </p>
                </MagazineDropCap>
              </Reveal>

              {/* Two-Column Editorial Story Grid (Fills Vertical Space Cleanly) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-6">
                {/* Column A: Financial & Industrial Work */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-foreground">
                      <span>01</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>Financial Tools &amp; Bank Webhooks</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted font-normal">
                      At MAN 1 Kota Semarang, I developed SIMMAN E-Budgeting to manage institutional finances and fee transactions. The system connects directly to bank partner APIs via Host-to-Host (H2H) Virtual Account webhooks, recording payments into the general ledger automatically without manual teller verification. It also enforces division budget limits programmatically and runs daily reconciliation routines against bank mutation statements.
                    </p>
                  </div>

                  <div className="border-t border-border/70 pt-6">
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-foreground">
                      <span>02</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>Manufacturing &amp; Edge Biometrics</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted font-normal">
                      For Acrylico, a commercial fabrication workshop, I built Acrylico ERP to replace paper job tickets with a live workstation queue across cutting, bending, assembly, and quality control stations. To handle worker attendance tracking quickly while keeping biometric data private, I added on-device face recognition that processes check-ins directly in the browser in under 400 milliseconds, without uploading camera feeds to external cloud servers.
                    </p>
                  </div>
                </div>

                {/* Column B: Interactive Platforms & Distributed Systems */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-foreground">
                      <span>03</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>Interactive Web Platforms</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted font-normal">
                      For Nata Code, I built an interactive agency platform and portfolio CMS. The project combines React, Inertia, GSAP, and WebGL animations with smooth viewport transitions, designed to maintain responsive performance and fluid interactions across mobile and desktop devices.
                    </p>
                  </div>

                  <div className="border-t border-border/70 pt-6">
                    <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-foreground">
                      <span>04</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>Distributed Ledgers &amp; Provenance</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted font-normal">
                      In research and laboratory tracking, I worked on JEJAK-Lab, an asset provenance testbed built on Hyperledger Fabric 2.5 with multi-organization Raft consensus and Go chaincodes. The system provides an immutable audit trail for laboratory reagent consumption and telemetry tracking across distributed nodes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Balanced Ledger: Case Studies with Tactile Buttons (Fills Bottom Void) */}
              <div className="border border-border p-6 bg-surface/40 rounded-[2px]">
                <div className="flex items-center justify-between pb-3.5 border-b border-border/70 mb-4">
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground">
                    Selected Case Studies
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-medium tracking-[0.16em] uppercase rounded-[2px] border border-neutral-200/90 bg-white text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                    <span>03 Featured Works</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {CASE_REFERENCES.map((caseItem) => (
                    <div
                      key={caseItem.slug}
                      className="border border-border/80 p-3.5 bg-background flex flex-col justify-between hover:border-foreground transition-colors group"
                    >
                      <div>
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-medium tracking-[0.14em] uppercase rounded-[2px] border border-neutral-200/90 bg-neutral-50/80 text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                            {caseItem.tag}
                          </span>
                        </div>
                        <h3 className="text-xs font-semibold tracking-tight text-foreground group-hover:underline">
                          {caseItem.title}
                        </h3>
                        <p className="mt-1.5 text-[11px] text-muted leading-relaxed font-normal line-clamp-2">
                          {caseItem.description}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-2 border-t border-border/60">
                        <Link
                          href={`/work/${caseItem.slug}`}
                          className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.14em] uppercase text-foreground hover:text-muted transition-colors"
                        >
                          <span>View Study</span>
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <BouncyLine className="w-full" />

        {/* ——— Disciplines & Capabilities Monograph (6-Grid) ——— */}
        <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10">
            <div>
              <p
                className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Areas of Discipline
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Capabilities
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase rounded-[3px] border border-neutral-200/90 bg-white text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
              <span>06 Areas of Discipline</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {DISCIPLINES.map((d) => (
              <div
                key={d.number}
                className="border border-border p-6 flex flex-col justify-between hover:border-foreground transition-colors bg-background"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-foreground">
                    <span>{d.title}</span>
                    <span className="text-muted font-normal">{d.number}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
                    {d.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BouncyLine className="w-full" />

        {/* ——— Technical Field Kit ——— */}
        <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="mb-10">
            <p
              className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Field Kit &bull; Stack
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Technical Repertoire
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_REPERTOIRE.map((group) => (
              <div key={group.category} className="border-t border-border pt-4">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-4">
                  {group.category}
                </h3>
                <ul className="divide-y divide-border/60">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-muted hover:text-foreground transition-colors flex items-center justify-between"
                    >
                      <span>{skill}</span>
                      <span className="text-[10px] text-muted/60">&bull;</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <BouncyLine className="w-full" />

        {/* ——— Colophon & Inquiries with Tactile Buttons ——— */}
        <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="border border-border p-8 md:p-12 bg-surface/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] uppercase rounded-[3px] border border-neutral-200/90 bg-white text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
                  <span>Colophon &bull; Inquiries</span>
                </span>
              </div>
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Open for collaborations and engineering roles.
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
                If you have a project in mind, need assistance with software architecture, or want to discuss full-stack development, feel free to reach out.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-shrink-0 w-full md:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase rounded-[3px] border border-neutral-900 bg-[#0a0a0a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.12)] hover:bg-neutral-800 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all cursor-pointer"
              >
                <span>Initiate Inquiry</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/#work"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
              >
                View Selected Work
              </Link>
            </div>
          </div>

          {/* Issue Page Marker Footer */}
          <div className="mt-8 flex items-center justify-between text-[11px] font-medium tracking-[0.2em] uppercase text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span>Adi Alfian Hafis</span>
              <span>&bull;</span>
              <span>Portfolio Dossier</span>
            </span>
            <span>Page 04 &bull; About</span>
          </div>
        </section>
      </main>

      <SiteFooter
        email={profile?.email ?? "adialfianhafiz@gmail.com"}
        socialLinks={socialLinks}
      />
    </div>
  );
}
