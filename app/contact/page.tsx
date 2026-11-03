import type { Metadata } from "next";
import { BouncyLine } from "@/components/public/bouncy-line";
import { ContactForm } from "@/components/public/contact-form";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteProfile, getVisibleSocialLinks } from "@/lib/queries/public";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Project inquiries, engineering roles, and collaboration — start a conversation.",
  alternates: {
    canonical: "/contact",
  },
};

const BRIEF = [
  {
    number: "01",
    title: "What you want to build",
    detail: "The product, the workflow, or the problem that needs solving.",
  },
  {
    number: "02",
    title: "Timeline and scope",
    detail: "When it needs to be live, and how much of it exists already.",
  },
  {
    number: "03",
    title: "References that help",
    detail: "Repositories, designs, or links to anything relevant.",
  },
];

export default async function ContactPage() {
  const profile = await getSiteProfile();
  const socialLinks = await getVisibleSocialLinks(profile?.id ?? null);
  const email = profile?.email ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ——— Masthead ——— */}
        <section className="border-b border-border bg-background pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <p
              className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contact &bull; Correspondence
            </p>
            <h1
              className="max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-[-0.02em] leading-[1.04] text-foreground text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Start a conversation.
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted font-normal leading-relaxed text-balance">
              Project inquiries, engineering roles, or a second opinion on an
              architecture decision. Direct email is fastest — the form below
              reaches the same inbox.
            </p>
          </div>
        </section>

        {/* ——— Two-Wing Spread: Channels & Brief on the Left, Form on the Right ——— */}
        <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Wing (5 Columns) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Direct Channels Ledger */}
              <div>
                <div className="flex items-center justify-between pb-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground">
                  <span>Direct Channels</span>
                  <span className="text-muted font-normal">Preferred</span>
                </div>

                <div className="border-t border-border divide-y divide-border">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="group flex items-center justify-between gap-4 py-3.5 transition-colors"
                    >
                      <span className="min-w-0">
                        <span className="block text-[11px] font-medium tracking-[0.18em] uppercase text-muted">
                          Email
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-normal tracking-tight text-foreground">
                          {email}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 px-2.5 py-1 text-[11px] font-medium tracking-[0.16em] uppercase text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] transition-all group-hover:border-neutral-400/90 group-hover:bg-neutral-100 group-active:translate-y-[1px] group-active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
                      >
                        <span>Write</span>
                        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          &#8599;
                        </span>
                      </span>
                    </a>
                  )}

                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 py-3.5 transition-colors"
                    >
                      <span className="min-w-0">
                        <span className="block text-[11px] font-medium tracking-[0.18em] uppercase text-muted">
                          {link.platform}
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-normal tracking-tight text-foreground">
                          {link.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 px-2.5 py-1 text-[11px] font-medium tracking-[0.16em] uppercase text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] transition-all group-hover:border-neutral-400/90 group-hover:bg-neutral-100 group-active:translate-y-[1px] group-active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
                      >
                        <span>Open</span>
                        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          &#8599;
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Briefing Plate */}
              <div className="border border-border bg-surface/40 p-6">
                <div className="flex items-center justify-between border-b border-border/70 pb-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground">
                  <span>Before You Write</span>
                  <span className="text-muted font-normal">Three Notes</span>
                </div>

                <ol className="divide-y divide-border/60">
                  {BRIEF.map((item) => (
                    <li
                      key={item.number}
                      className="flex items-baseline gap-3 py-3.5"
                    >
                      <span
                        className="shrink-0 text-xs font-normal text-muted/70"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.number}
                      </span>
                      <span>
                        <span className="block text-xs font-semibold tracking-[0.04em] text-foreground">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted font-normal">
                          {item.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="text-xs leading-relaxed text-muted font-normal">
                Replies usually land within one business day. For anything
                time-sensitive, email directly.
              </p>
            </div>

            {/* Right Wing (7 Columns): Form Plate */}
            <div className="lg:col-span-7">
              <div className="border border-border bg-gradient-to-b from-white via-neutral-50/60 to-neutral-100/40 p-6 sm:p-8 rounded-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_6px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground">
                    Inquiry Form
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-neutral-200/90 bg-white px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] uppercase text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-[1px] bg-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    />
                    <span>Encrypted in transit</span>
                  </span>
                </div>

                <BouncyLine className="my-5" />

                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter email={email} socialLinks={socialLinks} />
    </div>
  );
}
