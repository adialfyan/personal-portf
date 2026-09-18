import type { MetadataRoute } from "next";
import {
  getPublishedProjectSlugs,
  getPublishedWritingSlugs,
} from "@/lib/queries/public";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [projectSlugs, writingSlugs] = await Promise.all([
    getPublishedProjectSlugs(),
    getPublishedWritingSlugs(),
  ]);
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${siteUrl}/writing`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${siteUrl}/shelf`, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...projectSlugs.map((slug) => ({
      url: `${siteUrl}/work/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...writingSlugs.map((slug) => ({
      url: `${siteUrl}/writing/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
