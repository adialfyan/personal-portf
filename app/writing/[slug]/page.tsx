import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/public/json-ld";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { ReadingProgress } from "@/components/public/reading-progress";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import {
  getPublishedWritingSlugs,
  getSiteProfile,
  getVisibleSocialLinks,
  getWritingBySlug,
} from "@/lib/queries/public";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedWritingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const writing = await getWritingBySlug(slug);
  if (!writing) return { title: "Document Not Found" };

  const description = writing.summary ?? writing.subtitle ?? "Technical whitepaper & systems monograph.";

  return {
    title: `${writing.title} — Writing`,
    description,
    alternates: {
      canonical: `/writing/${slug}`,
    },
    openGraph: {
      title: `${writing.title} — Writing`,
      description,
      type: "article",
      publishedTime: writing.published_at ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${writing.title} — Writing`,
      description,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  paper: "Paper",
  architecture: "Architecture",
  essay: "Essay",
  note: "Field Note",
};

export default async function WritingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const writing = await getWritingBySlug(slug);

  if (!writing) {
    notFound();
  }

  const profile = await getSiteProfile();
  const socialLinks = await getVisibleSocialLinks(profile?.id ?? null);
  const name = profile?.full_name || "Adi Alfian Hafis";

  const dateStr = writing.published_at
    ? new Date(writing.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const categoryLabel =
    CATEGORY_LABELS[writing.category] ?? writing.category;

  const siteUrl = getSiteUrl();

  return (
    <div className="flex min-h-full flex-1 flex-col" suppressHydrationWarning>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: writing.title,
            description:
              writing.summary ??
              writing.subtitle ??
              "Technical whitepaper & systems monograph.",
            url: `${siteUrl}/writing/${slug}`,
            author: { "@type": "Person", name },
            ...(writing.published_at
              ? { datePublished: writing.published_at }
              : {}),
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
                name: "Writing",
                item: `${siteUrl}/writing`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: writing.title,
                item: `${siteUrl}/writing/${slug}`,
              },
            ],
          },
        ]}
      />
      <ReadingProgress />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-[1440px] px-6 pt-12 pb-24 md:px-10 md:pt-20 md:pb-32">
          
          {/* Breadcrumb & Metadata Header */}
          <div className="max-w-4xl">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-8">
              <Link href="/writing" className="hover:text-foreground transition-colors">
                Writing
              </Link>
              <span className="mx-2.5">&mdash;</span>
              <span className="text-foreground">{categoryLabel}</span>
            </p>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[-0.02em] leading-[1.08] text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {writing.title}
            </h1>

            {writing.subtitle && (
              <p className="mt-6 text-xl sm:text-2xl text-muted font-normal leading-relaxed">
                {writing.subtitle}
              </p>
            )}

            {/* Meta Strip */}
            <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs font-medium tracking-[0.18em] uppercase text-muted">
              <div className="flex flex-wrap items-center gap-3">
                {dateStr && <span>{dateStr}</span>}
                {dateStr && <span>&bull;</span>}
                <span>{writing.reading_time_minutes} min read</span>
              </div>

              {writing.tags && writing.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {writing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-border/80 px-2.5 py-1 text-[10px] tracking-wider text-muted rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Academic Publication Callout (For Peer-Reviewed Research) */}
          {slug === "securing-educational-financial-data-hybrid-blockchain" && (
            <div className="mt-12 p-6 sm:p-8 bg-gradient-to-b from-white via-neutral-50/70 to-neutral-100/40 border border-neutral-300/80 rounded-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_6px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] max-w-3xl flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono uppercase tracking-[0.16em] text-muted">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" aria-hidden="true" />
                  <span>Peer-Reviewed Academic Publication</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-neutral-900 text-white text-[10px] tracking-wider font-sans font-medium rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.15)]">
                  SINTA 2 Accredited
                </span>
              </div>

              <div>
                <p className="text-base font-semibold text-foreground tracking-tight">
                  Journal of Information Systems and Informatics (JournalISI)
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Vol. 8, No. 4, August 2026, pp. 4159–4183 &bull; ISSN 2656-4882 &bull; Indexed in SINTA 2, DOAJ, Crossref, Dimensions, BASE
                </p>
                <p className="text-xs text-muted mt-1">
                  Authors: Adi Alfian Hafis, Soiful Hadi &bull; Universitas Semarang
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-200/80">
                <a
                  href="https://journal-isi.org/index.php/isi/article/view/1719/933"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[3px] bg-neutral-900 text-white text-xs font-medium tracking-[0.14em] uppercase border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.15)] hover:bg-neutral-800 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.18)] active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all cursor-pointer group"
                >
                  <span>Download Official PDF</span>
                  <span className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
                </a>
                <a
                  href="https://doi.org/10.63158/journalisi.v8i4.1719"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[3px] bg-white text-foreground text-xs font-medium tracking-[0.14em] uppercase border border-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_3px_rgba(0,0,0,0.06)] hover:bg-neutral-50 hover:border-neutral-400 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] transition-all cursor-pointer group"
                >
                  <span>View via DOI</span>
                  <span className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
                </a>
                <a
                  href="https://sinta.kemdiktisaintek.go.id/journals/profile/7045"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[3px] border border-neutral-200 bg-neutral-50/80 text-muted hover:text-foreground hover:bg-neutral-100 hover:border-neutral-300 active:translate-y-[1px] transition-all text-xs font-medium tracking-[0.12em] uppercase group"
                >
                  <span>SINTA 2 Index</span>
                  <span className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          )}

          {/* Article Markdown Body */}
          <div className="mt-16 pt-12 border-t border-border/60 max-w-3xl">
            <MarkdownRenderer content={writing.content} />
          </div>

          {/* Back Navigation */}
          <div className="mt-20 pt-10 border-t border-border max-w-3xl">
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-foreground transition-colors"
            >
              <span>&larr;</span>
              <span>All Writings</span>
            </Link>
          </div>

        </article>
      </main>

      <SiteFooter
        email={profile?.email ?? null}
        socialLinks={socialLinks}
      />
    </div>
  );
}
