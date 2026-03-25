export default function Logo({ size = "md", theme = "light" }) {
  const isLight = theme === "light";
  const sizes = { sm: 28, md: 38, lg: 52 };
  const h = sizes[size] || sizes.md;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Map pin icon */}
      <svg height={h} viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 0C13.43 0 0 13.43 0 30c0 22.5 30 42 30 42s30-19.5 30-42C60 13.43 46.57 0 30 0z"
          fill={isLight ? "#0A2342" : "#ffffff"} />
        <ellipse cx="30" cy="30" rx="19" ry="19" fill={isLight ? "#F4F4F4" : "#F4F4F4"} />
        {/* Phone */}
        <path d="M22 22c0 0 1.5-1.5 3-1 1.5.5 3 3 3 3s.5 1.5-.5 2.5c-1 1 0 2.5 2 4.5s3.5 3 4.5 2c1-1 2.5-.5 2.5-.5s2.5 1.5 3 3c.5 1.5-1 3-1 3-2 2-6 1-10-3s-5-8-3-10z"
          fill="#FF8C00" />
        {/* Bar chart */}
        <rect x="33" y="26" width="3" height="8" rx="1" fill="#A1A0A5" />
        <rect x="37" y="23" width="3" height="11" rx="1" fill="#A1A0A5" />
        <rect x="41" y="20" width="3" height="14" rx="1" fill="#A1A0A5" />
      </svg>

      {/* Wordmark */}
      <div style={{ lineHeight: 1.1 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: h * 0.42,
          letterSpacing: 1,
          color: isLight ? "#0A2342" : "#ffffff",
          textTransform: "uppercase",
        }}>
          RENTAL
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: h * 0.42,
          letterSpacing: 1,
          color: "#FF8C00",
          textTransform: "uppercase",
          marginTop: -2,
        }}>
          MARKETING
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: h * 0.42,
          letterSpacing: 1,
          color: isLight ? "#0A2342" : "#ffffff",
          textTransform: "uppercase",
          marginTop: -2,
        }}>
          PROS
        </div>
      </div>
    </div>
  );
}
