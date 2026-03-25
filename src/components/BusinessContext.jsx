"use client";

export default function BusinessContext({ business }) {
  if (!business) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(10,35,66,0.05)", border: "1px solid rgba(10,35,66,0.12)", borderRadius: "var(--radius)", padding: "12px 16px", marginTop: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange)", marginTop: 5, flexShrink: 0 }} />
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 10px" }}>
        <span style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14 }}>{business.name}</span>
        {business.address && <span style={{ fontSize: 13, color: "var(--gray)" }}>{business.address}</span>}
        {business.category && (
          <span style={{ fontSize: 11, fontFamily: "monospace", background: "var(--orange-dim)", color: "var(--orange)", border: "1px solid var(--orange-glow)", borderRadius: 20, padding: "2px 9px", textTransform: "capitalize", letterSpacing: 0.3 }}>
            {business.category}
          </span>
        )}
      </div>
    </div>
  );
}
