import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f2440, #1b3a5c)",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: "#c8a84e",
          }}
        >
          SA
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
