import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f2440 0%, #1b3a5c 50%, #2a5a8c 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(200, 168, 78, 0.15)",
            display: "flex",
          }}
        />

        <div
          style={{
            width: "100%",
            height: 6,
            background: "linear-gradient(90deg, #c8a84e, #dfc575, #c8a84e)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "40px 60px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #c8a84e, #dfc575)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              color: "#0f2440",
              marginBottom: 24,
            }}
          >
            SA
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            SAHIL ADVISORY
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 6,
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            Cost Accountants
          </span>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>Compliance Today,</span>
            <span style={{ color: "#c8a84e" }}>Secure Tomorrow.</span>
          </div>
          <span
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.6)",
              display: "flex",
            }}
          >
            Tax · Audit · Accounting · Business Consultancy
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px 80px",
            background: "rgba(0,0,0,0.2)",
            gap: 32,
          }}
        >
          <span style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", display: "flex" }}>
            Advise · Analyze · Achieve
          </span>
          <span style={{ fontSize: 15, color: "#c8a84e", fontWeight: 600, display: "flex" }}>
            +91 78884 12302
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
