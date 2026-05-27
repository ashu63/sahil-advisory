import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage() {
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
        {/* Decorative circles */}
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
            position: "absolute",
            bottom: -120,
            left: -60,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            display: "flex",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            width: "100%",
            height: 6,
            background: "linear-gradient(90deg, #c8a84e, #dfc575, #c8a84e)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "60px 80px",
            flex: 1,
          }}
        >
          {/* Left side - Text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 700,
            }}
          >
            {/* Logo mark */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #c8a84e, #dfc575)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#0f2440",
                }}
              >
                SA
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: 1,
                  }}
                >
                  SAHIL ADVISORY
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: 4,
                    textTransform: "uppercase",
                  }}
                >
                  Cost Accountants
                </span>
              </div>
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.2,
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Compliance Today,</span>
              <span style={{ color: "#c8a84e" }}>Secure Tomorrow.</span>
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.5,
                display: "flex",
              }}
            >
              Tax · Audit · Accounting · Business Consultancy · MSME & Startup Advisory
            </div>
          </div>

          {/* Right side - Service badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "flex-end",
            }}
          >
            {[
              "Income Tax & GST",
              "Company Registration",
              "Audit & Assurance",
              "MSME & Startup",
              "Govt Tender & GeM",
            ].map((service) => (
              <div
                key={service}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "12px 24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#c8a84e",
                    display: "flex",
                  }}
                />
                <span
                  style={{
                    fontSize: 18,
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 500,
                  }}
                >
                  {service}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 80px",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.5)",
              display: "flex",
            }}
          >
            Advise · Analyze · Achieve
          </span>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.5)",
                display: "flex",
              }}
            >
              Chandigarh & Panchkula
            </span>
            <span
              style={{
                fontSize: 15,
                color: "#c8a84e",
                fontWeight: 600,
                display: "flex",
              }}
            >
              +91 78884 12302
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
