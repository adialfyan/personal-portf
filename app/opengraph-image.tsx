import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = "Adi Alfian Hafis — Portfolio";

export default async function Image() {
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
          Portfolio
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: -2 }}>
            Adi Alfian Hafis
          </div>
          <div
            style={{
              fontSize: 36,
              fontFamily: "Arial, Helvetica, sans-serif",
              color: "#404040",
            }}
          >
            Full-stack developer — selected work, writing, and contact.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#737373",
          }}
        >
          <span>Work — Writing — Shelf — About</span>
          <span>1200 × 630</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
