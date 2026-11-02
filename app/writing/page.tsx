import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { WritingsFilterList } from "@/components/public/writings-filter-list";
import {
  getAllPublishedWritings,
  getSiteProfile,
  getVisibleSocialLinks,
} from "@/lib/queries/public";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Writing — Essays, Papers & Architecture Notes",
  description:
    "Technical whitepapers, systems engineering monographs, and essays on durable software architecture.",
  alternates: {
    canonical: "/writing",
  },
  openGraph: {
    title: "Writing — Essays, Papers & Architecture Notes",
    description:
      "Technical whitepapers, systems engineering monographs, and essays on durable software architecture.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing — Essays, Papers & Architecture Notes",
    description:
      "Technical whitepapers, systems engineering monographs, and essays on durable software architecture.",
  },
};

export default async function WritingPage() {
  const profile = await getSiteProfile();
  const socialLinks = await getVisibleSocialLinks(profile?.id ?? null);
  const writings = await getAllPublishedWritings();

  return (
    <div className="flex min-h-full flex-1 flex-col" suppressHydrationWarning>
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ——— Header ——— */}
        <section className="border-b border-border bg-background pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <p
              className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Writing &bull; Archive
            </p>
            <h1
              className="max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-[-0.02em] leading-[1.04] text-foreground text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Architecture whitepapers, systems engineering &amp; essays.
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted font-normal leading-relaxed text-balance">
              Technical examinations of double-entry ledgers, banking clearing pipelines, and reflections on durable software craft.
            </p>
          </div>
        </section>

        {/* ——— Articles List with 3D Tactile Category Filtering ——— */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <WritingsFilterList writings={writings} />
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
