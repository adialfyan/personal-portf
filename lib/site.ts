/**
 * Centralized site URL resolution.
 *
 * Priority: explicit NEXT_PUBLIC_SITE_URL → Vercel deployment URL →
 * local dev fallback. Never falls back to a placeholder domain so
 * sitemaps and Open Graph URLs are always real.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, "")}`;
  }
  const port = process.env.PORT?.trim() || "3000";
  return `http://localhost:${port}`;
}
