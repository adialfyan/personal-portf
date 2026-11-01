import type { Metadata } from "next";
import Link from "next/link";
import { BouncyLine } from "@/components/public/bouncy-line";
import { CulturalShelfShowcase } from "@/components/public/cultural-shelf-showcase";
import { EditorialProjectIndex } from "@/components/public/editorial-project-index";
import { JsonLd } from "@/components/public/json-ld";
import { MorphText } from "@/components/public/morph-text";
import { Reveal } from "@/components/public/reveal";
import { SakuraCornerBranch } from "@/components/public/sakura-corner-branch";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import {
  getFavoriteShelfItems,
  getFeaturedProjects,
  getFeaturedWritings,
  getSiteProfile,
  getVisibleSocialLinks,
} from "@/lib/queries/public";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Full-stack Developer — Portfolio",
  description:
    "Selected work, background, and contact of a full-stack developer building thoughtful web products.",
  alternates: {
    canonical: "/",
  },
};

interface CapabilityItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    id: "product-dev",
    number: "01",
    title: "Product Development",
    description: "End-to-end execution from technical specifications to production-ready architecture.",
  },
  {
    id: "frontend-eng",
    number: "02",
    title: "Frontend Engineering",
    description: "Fluid tactile interactions, robust component systems, and modern Next.js foundations.",
  },
  {
    id: "backend-systems",
    number: "03",
    title: "Backend Systems",
    description: "Deterministic business logic, transactional data pipelines, and high-concurrency APIs.",
  },
  {
    id: "database-design",
    number: "04",
    title: "Database Design",
    description: "Normalized relational schemas, ACID integrity guarantees, and optimized query plans.",
  },
  {
    id: "interface-impl",
    number: "05",
    title: "Interface Implementation",
    description: "Editorial typographic hierarchy, precision micro-details, and seamless accessibility.",
  },
  {
    id: "deployment-maintenance",
    number: "06",
    title: "Deployment & Maintenance",
    description: "Continuous integration pipelines, automated environment hygiene, and deep telemetry.",
  },
];

export default async function Home() {
  const profile = await getSiteProfile();
  const socialLinks = await getVisibleSocialLinks(profile?.id ?? null);
  const projects = await getFeaturedProjects();
  const featuredWritings = await getFeaturedWritings();
  const favoriteShelf = await getFavoriteShelfItems();

  const name = profile?.full_name || "Adi Alfian Hafis";
  const title =
    profile?.professional_title || "Full-Stack Developer";
  const bio =
    profile?.short_intro ||
    "Building web applications, enterprise systems, and digital tools with a focus on clean architecture and reliable engineering.";

  const siteUrl = getSiteUrl();

  return (
    <div className="flex min-h-full flex-1 flex-col" suppressHydrationWarning>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name,
          jobTitle: title,
          description: bio,
          url: siteUrl,
          ...(profile?.email ? { email: `mailto:${profile.email}` } : {}),
          ...(socialLinks.length > 0
            ? { sameAs: socialLinks.map((link) => link.url) }
            : {}),
        }}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ——— Hero (Clean Editorial Statement — No Redundant TOC) ——— */}
        <section className="relative bg-background pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          {/* Japanese Sumi-e Sakura Branch (Hidden on mobile, blooms in desktop hero & in mobile drawer) */}
          <SakuraCornerBranch className="hidden md:block" />

          <div className="mx-auto max-w-[1440px] px-6 md:px-10 relative z-10">
            {/* Primary Headline (Newsreader Serif) */}
            <div className="max-w-5xl">
              <p
                className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Full-Stack Developer &bull; Portfolio
              </p>
              <h1
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-[-0.02em] leading-[1.04] text-foreground text-balance"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Building{" "}
                <MorphText
                  words={["reliable", "scalable", "resilient", "thoughtful"]}
                  intensity={12}
                  className="font-normal italic"
                />{" "}
                web applications and enterprise systems.
              </h1>
            </div>

            {/* Editorial Spread: Double-Column (About on Left, Table of Contents on Right) */}
            <BouncyLine className="mt-12 md:mt-16" />
            <div className="pt-10 grid grid-cols-1 md:grid-cols-12 gap-12">
              {/* Left Column: About & Craft */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <p
                    className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Introduction &bull; Bio
                  </p>
                  <div className="space-y-6 text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-foreground/90 max-w-2xl">
                    <p>{bio}</p>
                    <p className="text-base sm:text-lg text-muted font-normal leading-relaxed">
                      Specializing in full-stack architecture, high-reliability enterprise platforms, and thoughtful digital interfaces built with clean engineering.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Table of Contents Directory */}
              <div className="md:col-span-5 md:border-l md:border-border md:pl-10 flex flex-col justify-between">
                <div>
                  <p
                    className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Table of Contents
                  </p>
                  <ol className="space-y-3">
                    <li>
                      <Link
                        href="/#work"
                        className="group block pt-2.5 pb-2 transition-colors"
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-3 min-w-0 pr-4">
                            <span
                              className="text-xs text-muted/70 font-normal"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              01
                            </span>
                            <span
                              className="text-lg text-foreground group-hover:underline tracking-tight truncate"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              Selected Work
                            </span>
                          </div>
                          <span
                            className="text-sm text-muted/70 flex-shrink-0 font-normal group-hover:text-foreground transition-colors inline-flex items-center gap-1"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            <span>Production</span>
                            <span>&darr;</span>
                          </span>
                        </div>
                      </Link>
                      <BouncyLine />
                    </li>

                    <li>
                      <Link
                        href="/writing"
                        className="group block pt-2.5 pb-2 transition-colors"
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-3 min-w-0 pr-4">
                            <span
                              className="text-xs text-muted/70 font-normal"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              02
                            </span>
                            <span
                              className="text-lg text-foreground group-hover:underline tracking-tight truncate"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              Writing &bull; Papers
                            </span>
                          </div>
                          <span
                            className="text-sm text-muted/70 flex-shrink-0 font-normal group-hover:text-foreground transition-colors inline-flex items-center gap-1"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            <span>Essays</span>
                            <span>&rarr;</span>
                          </span>
                        </div>
                      </Link>
                      <BouncyLine />
                    </li>

                    <li>
                      <Link
                        href="/shelf"
                        className="group block pt-2.5 pb-2 transition-colors"
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-3 min-w-0 pr-4">
                            <span
                              className="text-xs text-muted/70 font-normal"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              03
                            </span>
                            <span
                              className="text-lg text-foreground group-hover:underline tracking-tight truncate"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              Cultural Shelf
                            </span>
                          </div>
                          <span
                            className="text-sm text-muted/70 flex-shrink-0 font-normal group-hover:text-foreground transition-colors inline-flex items-center gap-1"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            <span>Curations</span>
                            <span>&rarr;</span>
                          </span>
                        </div>
                      </Link>
                      <BouncyLine />
                    </li>

                    <li>
                      <Link
                        href="/contact"
                        className="group block pt-2.5 pb-2 transition-colors"
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-3 min-w-0 pr-4">
                            <span
                              className="text-xs text-muted/70 font-normal"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              04
                            </span>
                            <span
                              className="text-lg text-foreground group-hover:underline tracking-tight truncate"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              Get in Touch
                            </span>
                          </div>
                          <span
                            className="text-sm text-muted/70 flex-shrink-0 font-normal group-hover:text-foreground transition-colors inline-flex items-center gap-1"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            <span>Contact</span>
                            <span>↗</span>
                          </span>
                        </div>
                      </Link>
                      <BouncyLine />
                    </li>
                  </ol>
                </div>

                <div
                  className="pt-8 text-xs text-muted/70 flex items-center justify-between"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className="text-[11px] font-medium tracking-wider uppercase">Directory</span>
                  <span>4 sections</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <BouncyLine className="w-full" />

        {/* ——— Selected Work ——— */}
        <section
          id="work"
          className="scroll-mt-20 overflow-hidden"
        >
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <p
                  className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Work &bull; Production Systems
                </p>
                <h2
                  className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground font-normal"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Selected Projects
                </h2>
              </div>
            </div>
            <BouncyLine className="mb-10" />

            <EditorialProjectIndex projects={projects} />
          </div>
        </section>
        <BouncyLine className="w-full" />

        {/* ——— Practice & Capabilities ——— */}
        <section id="capabilities" className="scroll-mt-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-4 gap-8 px-6 py-16 md:grid-cols-12 md:px-10 md:py-24">
            <div className="col-span-4 md:col-span-3">
              <p
                className="text-xs font-medium tracking-[0.2em] uppercase text-muted"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Practice &bull; Capabilities
              </p>
            </div>
            <div className="col-span-4 md:col-span-9">
              <Reveal>
                <p
                  className="max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tight font-normal text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  I build web experiences that balance clarity, character, and
                  systems.
                </p>
              </Reveal>

              {/* Editorial Ledger Grid for 6 Capabilities */}
              <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {CAPABILITIES.map((c) => (
                  <div key={c.id} className="group flex flex-col justify-between">
                    <div>
                      <BouncyLine className="mb-4" />
                      <div className="flex items-baseline justify-between mb-2">
                        <span
                          className="text-xs text-muted/70 font-normal"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {c.number}
                        </span>
                        <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-foreground">
                          {c.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed font-normal">
                        {c.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase underline underline-offset-8 hover:text-muted transition-colors"
                >
                  <span>Full Biography & Background</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <span
                  className="text-xs text-muted/60 font-normal"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  06 Areas of Discipline
                </span>
              </div>
            </div>
          </div>
        </section>
        <BouncyLine className="w-full" />

        {/* ——— Selected Writings ——— */}
        <section>
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <p
                  className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Writing &bull; Monographs
                </p>
                <h2
                  className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground font-normal"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Whitepapers &amp; Systems Essays
                </h2>
              </div>
              <Link
                href="/writing"
                className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5"
              >
                <span>All Writings</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <BouncyLine className="mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {featuredWritings.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  href={`/writing/${item.slug}`}
                  className="group block border border-border p-6 md:p-8 hover:border-foreground transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-medium tracking-[0.18em] uppercase text-muted mb-4">
                    <span className="text-foreground">{item.category}</span>
                    <span>{item.reading_time_minutes} min read</span>
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground group-hover:underline"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed font-normal">
                      {item.summary}
                    </p>
                  )}
                  <div className="mt-6 text-xs font-medium tracking-[0.18em] uppercase text-foreground inline-flex items-center gap-1.5">
                    <span>Read Paper</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <BouncyLine className="w-full" />

        {/* ——— Cultural Shelf Teaser ——— */}
        <section>
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <p
                  className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Shelf &bull; Media Ledger
                </p>
                <h2
                  className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground font-normal"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Cinema, Records &amp; Readings
                </h2>
              </div>
              <Link
                href="/shelf"
                className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5"
              >
                <span>Full Archive</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <BouncyLine className="mb-10" />

            <CulturalShelfShowcase items={favoriteShelf.slice(0, 4)} />
          </div>
        </section>
        <BouncyLine className="w-full" />

        {/* ——— Contact CTA (inversion) ——— */}
        <section className="bg-dark text-ivory">
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-32">
            <Reveal>
              <p className="text-xs font-medium tracking-[0.2em] uppercase opacity-60">
                Have something interesting in mind?
              </p>
              <Link
                href="/contact"
                className="mt-6 block text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight transition-opacity hover:opacity-80"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Let&apos;s talk <span className="opacity-50">↗</span>
              </Link>
            </Reveal>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium tracking-[0.2em] uppercase opacity-70">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="transition-opacity hover:opacity-100"
                >
                  {profile.email}
                </a>
              )}
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-100"
                >
                  {link.label ?? link.platform} ↗
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        email={profile?.email ?? null}
        socialLinks={socialLinks}
      />
    </div>
  );
}
