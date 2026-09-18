"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted">
          Something broke
        </p>
        <h1
          className="mt-6 text-5xl tracking-tight md:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Signal lost.
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-muted">
          This page failed to load. Try again, or head back home.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs font-medium tracking-[0.2em] uppercase">
          <button
            type="button"
            onClick={reset}
            className="border border-border px-6 py-4 transition-colors hover:border-foreground"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-dark px-6 py-4 text-ivory transition-colors hover:bg-neutral-800"
          >
            Back home
          </Link>
        </div>
      </main>
      <SiteFooter email={null} socialLinks={[]} />
    </div>
  );
}
