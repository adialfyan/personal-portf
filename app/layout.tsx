import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import { SmoothScroll } from "@/components/public/smooth-scroll";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600"],
  display: "swap",
  preload: true,
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Adi Alfian Hafis — Portfolio",
    template: "%s | Adi Alfian Hafis",
  },
  description:
    "Software developer portfolio — selected work, about, and contact.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Adi Alfian Hafis",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-dark focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:tracking-[0.2em] focus:text-ivory focus:uppercase"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
