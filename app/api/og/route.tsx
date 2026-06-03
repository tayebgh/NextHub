// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "NextHub";
  const description =
    searchParams.get("description") || "Curated Web Directory";
  const type = searchParams.get("type") || "default";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "60px",
          backgroundColor: "#0f1117",
          backgroundImage:
            "radial-gradient(at 20% 20%, #5B4CF6 0px, transparent 50%), radial-gradient(at 80% 80%, #8B5CF6 0px, transparent 50%)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#5B4CF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            ⚡
          </div>
          <span
            style={{ color: "white", fontSize: 28, fontWeight: 700 }}
          >
            NextHub
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: type === "blog" ? 48 : 56,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 16,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
