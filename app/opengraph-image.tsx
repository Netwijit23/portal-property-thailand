import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Portal Property Thailand — Bangkok Condos & Houses for Rent and Sale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide default OG/Twitter card image. Any route can override this by
// passing `image` into buildMetadata() — see lib/seo.ts. Pure CSS/JSX
// rendered to PNG at request time; no static asset to keep in sync.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #14141a 45%, #0A0A0A 100%)",
          position: "relative",
        }}
      >
        {/* Gold radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(184,147,90,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            PORTAL
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 300,
              color: "#E5C795",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            PROPERTY
          </span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 28,
            fontWeight: 300,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: 1,
          }}
        >
          Bangkok Condos &amp; Houses for Rent and Sale
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            gap: 6,
          }}
        >
          <div style={{ width: 32, height: 1, background: "#B8935A", marginTop: 8 }} />
          <span style={{ fontSize: 14, letterSpacing: 3, color: "#B8935A", textTransform: "uppercase" }}>
            Bangkok Real Estate
          </span>
          <div style={{ width: 32, height: 1, background: "#B8935A", marginTop: 8 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
