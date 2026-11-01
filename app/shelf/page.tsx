import type { Metadata } from "next";
import { JsonLd } from "@/components/public/json-ld";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ShelfGrid } from "@/components/public/shelf-grid";
import { AsciiAquarium } from "@/components/public/ascii-ocean/ascii-aquarium";
import {
  getShelfItems,
  getSiteProfile,
  getVisibleSocialLinks,
} from "@/lib/queries/public";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shelf — Cinema, Records & Digital Artifacts",
  description:
    "A ledger of cinematic works, analog recordings, foundational literature, and interactive computational artifacts.",
  alternates: {
    canonical: "/shelf",
  },
  openGraph: {
    title: "Shelf — Cinema, Records & Digital Artifacts",
    description:
      "A ledger of cinematic works, analog recordings, foundational literature, and interactive computational artifacts.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelf — Cinema, Records & Digital Artifacts",
    description:
      "A ledger of cinematic works, analog recordings, foundational literature, and interactive computational artifacts.",
  },
};

export default async function ShelfPage() {
  const profile = await getSiteProfile();
  const socialLinks = await getVisibleSocialLinks(profile?.id ?? null);
  const items = await getShelfItems();

  const siteUrl = getSiteUrl();

  return (
    <div className="flex min-h-full flex-1 flex-col" suppressHydrationWarning>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Shelf — Cinema, Records & Digital Artifacts",
          description:
            "A ledger of cinematic works, analog recordings, foundational literature, and interactive computational artifacts.",
          url: `${siteUrl}/shelf`,
        }}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ——— Masthead ——— */}
        <section className="border-b border-border bg-background pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <p
              className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Shelf &bull; Curated Archive &amp; Artifacts
            </p>
            <h1
              className="max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-[-0.02em] leading-[1.04] text-foreground text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cinema, sound recordings &amp; digital artifacts.
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted font-normal leading-relaxed text-balance">
              A ledger of cinematic works, analog recordings, and foundational literature, alongside interactive computational artifacts. Exploring aesthetics, human psychology, and durable craft.
            </p>
          </div>
        </section>

        {/* ——— Shelf Ledger & Filter ——— */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <ShelfGrid items={items} />
          </div>
        </section>

        {/* ——— Digital Artifact: Interactive ASCII Aquarium ——— */}
        <AsciiAquarium />
      </main>

      <SiteFooter
        email={profile?.email ?? null}
        socialLinks={socialLinks}
      />
    </div>
  );
}
