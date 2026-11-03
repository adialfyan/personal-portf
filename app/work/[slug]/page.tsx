import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BouncyLine } from "@/components/public/bouncy-line";
import { JsonLd } from "@/components/public/json-ld";
import { Reveal } from "@/components/public/reveal";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getPublishedProjectSlugs,
  getSiteProfile,
  getVisibleSocialLinks,
} from "@/lib/queries/public";
import { getSiteUrl } from "@/lib/site";
import { getMediaUrl } from "@/lib/supabase/storage";
import {
  parseOutcomeHighlights,
  parseTechnicalHighlights,
} from "@/lib/work-parser";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const description =
    project.summary ??
    project.overview ??
    "Selected software engineering case study.";
  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title: `${project.title} — Selected Work`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Selected Work`,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [profile, adjacent] = await Promise.all([
    getSiteProfile(),
    getAdjacentProjects(slug),
  ]);
  const socialLinks = await getVisibleSocialLinks(profile?.id ?? null);

  const name = profile?.full_name || "Adi Alfian Hafis";
  const coverUrl = getMediaUrl(project.cover_image_path);

  const normPath = (p: string | null | undefined) =>
    (p ?? "").trim().toLowerCase().replace(/^[/\\]+/, "");
  const coverNorm = normPath(project.cover_image_path);
  const galleryMedia = project.media.filter(
    (m) => normPath(m.image_path) !== coverNorm,
  );

  const siteUrl = getSiteUrl();
  const technicalHighlights = parseTechnicalHighlights(
    project.technical_decisions,
  );
  const outcomeHighlights = parseOutcomeHighlights(project.outcome);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description:
              project.summary ??
              project.overview ??
              "Selected software engineering case study.",
            url: `${siteUrl}/work/${slug}`,
            author: { "@type": "Person", name },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Work",
                item: `${siteUrl}/#work`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: project.title,
                item: `${siteUrl}/work/${slug}`,
              },
            ],
          },
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ——— Monograph Hero ——— */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-12 md:px-10 md:pt-20">
          <nav
            aria-label="Breadcrumb navigation"
            className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase text-muted"
          >
            <Link
              href="/#work"
              className="hover:text-foreground transition-colors"
            >
              Work
            </Link>
            <span className="text-border">•</span>
            <span className="text-foreground">
              {project.project_type || "Case Study"}
            </span>
            {project.duration && (
              <>
                <span className="text-border">•</span>
                <span className="text-muted">{project.duration}</span>
              </>
            )}
          </nav>

          <h1
            className="mt-5 sm:mt-6 max-w-6xl text-[clamp(2.25rem,7vw,6.5rem)] font-normal leading-[0.95] tracking-tight text-foreground break-words"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h1>

          {project.summary && (
            <p className="mt-6 sm:mt-8 max-w-3xl text-lg sm:text-xl font-light leading-relaxed text-foreground/85 md:text-2xl">
              {project.summary}
            </p>
          )}

          {/* Architectural Spec Plate */}
          <div className="mt-8 sm:mt-12 border-y border-border py-6 sm:py-8">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 sm:gap-8 text-xs uppercase tracking-[0.2em]">
              {project.role && (
                <div>
                  <dt className="text-muted font-medium text-[11px] sm:text-xs">Role & Lead</dt>
                  <dd className="mt-2 font-normal normal-case tracking-normal text-foreground text-sm leading-snug">
                    {project.role}
                  </dd>
                </div>
              )}
              {project.client && (
                <div>
                  <dt className="text-muted font-medium text-[11px] sm:text-xs">Client / Context</dt>
                  <dd className="mt-2 font-normal normal-case tracking-normal text-foreground text-sm leading-snug">
                    {project.client}
                  </dd>
                </div>
              )}
              {project.technologies.length > 0 && (
                <div>
                  <dt className="text-muted font-medium text-[11px] sm:text-xs">Stack Core</dt>
                  <dd className="mt-2 font-normal normal-case tracking-normal text-foreground text-sm leading-relaxed">
                    {project.technologies.map((t) => t.name).join(" • ")}
                  </dd>
                </div>
              )}
              {(project.live_url ||
                project.repository_url ||
                project.links.length > 0) && (
                <div>
                  <dt className="text-muted font-medium text-[11px] sm:text-xs">Links</dt>
                  <dd className="mt-2 flex flex-col gap-2 font-normal normal-case tracking-normal text-sm">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-foreground hover:underline"
                      >
                        <span>Live deployment</span>
                        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          ↗
                        </span>
                      </a>
                    )}
                    {project.repository_url && (
                      <a
                        href={project.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-foreground hover:underline"
                      >
                        <span>Source repository</span>
                        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          ↗
                        </span>
                      </a>
                    )}
                    {project.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-foreground hover:underline"
                      >
                        <span>{link.label ?? link.type ?? "External link"}</span>
                        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          ↗
                        </span>
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        {/* ——— Primary Plate (Cover Visual — Zero Crop) ——— */}
        {coverUrl && (
          <section className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10">
            <Reveal>
              <div className="group relative overflow-hidden border border-border bg-[#fafafa]">
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={coverUrl}
                    alt={project.title}
                    width={1800}
                    height={1125}
                    className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.012]"
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    priority
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5 sm:px-5 sm:py-3 text-[11px] font-medium tracking-[0.2em] uppercase text-muted">
                  <span>Plate 01 — Overview</span>
                  <span className="truncate max-w-[200px] sm:max-w-none">{project.title}</span>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ——— Executive Summary & Architectural Overview ——— */}
        {project.overview && (
          <section className="mx-auto max-w-[1440px] px-5 sm:px-6 py-12 sm:py-16 md:px-10 md:py-24">
            <Reveal>
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-4">
                  <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                    01 — Purpose & Context
                  </span>
                  <h2
                    className="mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl font-normal tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    System Mission
                  </h2>
                </div>
                <div className="md:col-span-8">
                  <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-foreground/90 whitespace-pre-line">
                    {project.overview}
                  </p>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ——— Challenge & Strategy (Dual Asymmetric Spread) ——— */}
        {(project.problem || project.approach) && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-6 py-12 sm:py-16 md:px-10 md:py-24">
              <Reveal>
                <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 md:gap-16">
                  {project.problem && (
                    <div className="border-l-2 sm:border-l border-border pl-4 sm:pl-6 md:pl-8">
                      <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                        02 — The Challenge
                      </span>
                      <h3
                        className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-normal tracking-tight text-foreground"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Operational Friction
                      </h3>
                      <div className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-foreground/80 whitespace-pre-line">
                        {project.problem}
                      </div>
                    </div>
                  )}
                  {project.approach && (
                    <div className="border-l-2 sm:border-l border-border pl-4 sm:pl-6 md:pl-8">
                      <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                        03 — The Strategy
                      </span>
                      <h3
                        className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-normal tracking-tight text-foreground"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Architectural Execution
                      </h3>
                      <div className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-foreground/80 whitespace-pre-line">
                        {project.approach}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ——— Key Technical Highlights (Modular Swiss Cards) ——— */}
        {technicalHighlights.length > 0 ? (
          <section className="border-t border-border bg-[#fafafa]">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-6 py-12 sm:py-16 md:px-10 md:py-24">
              <Reveal>
                <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                      04 — Architecture & Engineering
                    </span>
                    <h2
                      className="mt-2 text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-foreground"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Technical Decisions
                    </h2>
                  </div>
                  <span className="text-xs tracking-[0.2em] uppercase text-muted">
                    {String(technicalHighlights.length).padStart(2, "0")} Modules
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {technicalHighlights.map((item) => (
                    <div
                      key={item.number}
                      className="group relative flex flex-col justify-between border border-border bg-background p-6 sm:p-8 transition-colors duration-300 hover:border-foreground"
                    >
                      <div>
                        <span className="text-xs font-medium tracking-[0.25em] text-muted">
                          {item.number}
                        </span>
                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium tracking-tight text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-foreground/75">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-border/50 flex items-center justify-between text-[11px] tracking-[0.2em] uppercase text-muted">
                        <span>Specification</span>
                        <span>•</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        ) : (
          project.technical_decisions && (
            <section className="border-t border-border">
              <div className="mx-auto max-w-[1440px] px-5 sm:px-6 py-12 sm:py-16 md:px-10 md:py-24">
                <Reveal>
                  <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                    04 — Technical Architecture
                  </span>
                  <div className="mt-5 sm:mt-6 max-w-3xl text-base sm:text-lg leading-relaxed whitespace-pre-line text-foreground/90">
                    {project.technical_decisions}
                  </div>
                </Reveal>
              </div>
            </section>
          )
        )}

        {/* ——— Gallery & Documentation (Museum Plate Presentation — Zero Crop) ——— */}
        {galleryMedia.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-6 py-12 sm:py-16 md:px-10 md:py-24">
              <Reveal>
                <div className="mb-8 sm:mb-12">
                  <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                    Documentation & Artifacts
                  </span>
                  <h2
                    className="mt-2 text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Interface Plates
                  </h2>
                </div>

                <div className="space-y-10 sm:space-y-16">
                  {galleryMedia.map((m, idx) => {
                    const url = getMediaUrl(m.image_path);
                    if (!url) return null;
                    const plateNumber = String(idx + 2).padStart(2, "0");
                    return (
                      <figure key={m.id} className="group">
                        <div className="relative overflow-hidden border border-border bg-[#fafafa]">
                          <div className="relative w-full overflow-hidden">
                            <Image
                              src={url}
                              alt={m.caption ?? project.title}
                              width={1800}
                              height={1125}
                              className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.012]"
                              sizes="(max-width: 1440px) 100vw, 1440px"
                            />
                          </div>
                        </div>
                        {m.caption && (
                          <figcaption className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 border-b border-border pb-3 sm:pb-4 text-xs tracking-normal text-muted">
                            <span className="font-medium uppercase tracking-[0.2em] text-foreground shrink-0">
                              Plate {plateNumber}
                            </span>
                            <span className="text-xs sm:text-sm font-normal text-foreground/80 sm:text-right">
                              {m.caption}
                            </span>
                          </figcaption>
                        )}
                      </figure>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ——— Measurable Impact & Objectives ——— */}
        {outcomeHighlights.length > 0 ? (
          <section className="border-t border-border">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-6 py-12 sm:py-16 md:px-10 md:py-24">
              <Reveal>
                <div className="mb-8 sm:mb-12">
                  <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                    05 — Results & Verification
                  </span>
                  <h2
                    className="mt-2 text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Measurable Impact
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {outcomeHighlights.map((item) => (
                    <div
                      key={item.number}
                      className="flex flex-col justify-between border border-border bg-background p-5 sm:p-6 transition-colors duration-300 hover:border-foreground"
                    >
                      <span className="text-xs font-medium tracking-[0.25em] text-muted">
                        {item.number}
                      </span>
                      <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed font-normal text-foreground">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        ) : (
          project.outcome && (
            <section className="border-t border-border">
              <div className="mx-auto max-w-[1440px] px-5 sm:px-6 py-12 sm:py-16 md:px-10 md:py-24">
                <Reveal>
                  <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                    05 — Measurable Impact
                  </span>
                  <div className="mt-5 sm:mt-6 max-w-3xl text-base sm:text-lg leading-relaxed whitespace-pre-line text-foreground/90">
                    {project.outcome}
                  </div>
                </Reveal>
              </div>
            </section>
          )
        )}

        {/* ——— Curatorial Reflection / Colophon ——— */}
        {project.reflection && (
          <section className="border-t border-border bg-[#fafafa]">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-6 py-14 sm:py-20 md:px-10 md:py-28 text-center">
              <Reveal>
                <div className="mx-auto max-w-3xl">
                  <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted">
                    Engineering Reflection
                  </span>
                  <blockquote
                    className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl italic leading-relaxed text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    &ldquo;{project.reflection}&rdquo;
                  </blockquote>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Interactive String Divider */}
        <BouncyLine />

        {/* ——— Grand Awwwards Next Project Transition Portal ——— */}
        <nav
          aria-label="Project Navigation"
          className="border-b border-border bg-background"
        >
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-2">
            <div className="border-b border-border md:border-b-0 md:border-r p-6 sm:p-8 md:p-14">
              {adjacent.previous ? (
                <Link
                  href={`/work/${adjacent.previous.slug}`}
                  className="group block"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-muted group-hover:text-foreground transition-colors">
                    <span>←</span> Previous Project
                  </span>
                  <span
                    className="mt-3 sm:mt-4 block text-xl sm:text-2xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground group-hover:underline transition-all"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {adjacent.previous.title}
                  </span>
                </Link>
              ) : (
                <Link href="/#work" className="group block">
                  <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-muted group-hover:text-foreground transition-colors">
                    <span>←</span> Index
                  </span>
                  <span
                    className="mt-3 sm:mt-4 block text-xl sm:text-2xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground group-hover:underline transition-all"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Selected Works
                  </span>
                </Link>
              )}
            </div>
            <div className="p-6 sm:p-8 md:p-14 md:text-right">
              {adjacent.next ? (
                <Link
                  href={`/work/${adjacent.next.slug}`}
                  className="group block"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-muted group-hover:text-foreground transition-colors md:justify-end">
                    Next Project <span>→</span>
                  </span>
                  <span
                    className="mt-3 sm:mt-4 block text-xl sm:text-2xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground group-hover:underline transition-all"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {adjacent.next.title}
                  </span>
                </Link>
              ) : (
                <Link href="/#work" className="group block">
                  <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-muted group-hover:text-foreground transition-colors md:justify-end">
                    Index <span>→</span>
                  </span>
                  <span
                    className="mt-3 sm:mt-4 block text-xl sm:text-2xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground group-hover:underline transition-all"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Back to All Works
                  </span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </main>

      <SiteFooter
        email={profile?.email ?? null}
        socialLinks={socialLinks}
      />
    </div>
  );
}
