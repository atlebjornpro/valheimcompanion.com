import { ImageResponse } from "next/og";

export const alt =
  "Enshrouded Companion — guides and tools for surviving Embervale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color: "#f8fafc",
          background:
            "radial-gradient(circle at 75% 35%, #354e9b 0%, #18213e 26%, #0b0e17 68%)",
          padding: "76px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "90px",
            top: "55px",
            width: "320px",
            height: "500px",
            display: "flex",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, #8fa6ff 0%, #5876f4 18%, rgba(88,118,244,.22) 52%, transparent 72%)",
            filter: "blur(2px)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "790px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
              color: "#9aabff",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Guides · Calculators · Checklists
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "78px",
              lineHeight: 0.96,
              fontWeight: 900,
              letterSpacing: "-4px",
            }}
          >
            <span style={{ color: "#7790ff" }}>Enshrouded</span>
            <span>Companion</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "30px",
              color: "#cbd5e1",
              fontSize: "28px",
              lineHeight: 1.35,
            }}
          >
            Practical help for mastering Embervale.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
