import { ImageResponse } from "next/og";
import {
  getProjectBySlug,
  getPublishedProjectSlugs,
} from "@/lib/queries/public";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const title = project?.title ?? "Selected Work";
  const subtitle =
    project?.summary ?? project?.overview ?? "Software engineering case study.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#0a0a0a",
          padding: 80,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#737373",
          }}
        >
          Selected Work
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              fontFamily: "Arial, Helvetica, sans-serif",
              color: "#404040",
              display: "flex",
            }}
          >
            {subtitle.slice(0, 140)}
          </div>
        </div>
        <div
          style={{
            fontSize: 24,
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#737373",
          }}
        >
          Adi Alfian Hafis
        </div>
      </div>
    ),
    { ...size },
  );
}
