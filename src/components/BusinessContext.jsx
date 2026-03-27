"use client";

export default function BusinessContext({ business }) {
  if (!business) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0.75rem 1rem", marginTop: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange)", marginTop: 5, flexShrink: 0 }} />
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 10px" }}>
        <span style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14, fontFamily: "var(--font-cond)", textTransform: "uppercase", letterSpacing: "0.03em" }}>{business.name}</span>
        {business.address && <span style={{ fontSize: 13, color: "var(--gray)" }}>{business.address}</span>}
        {business.category && (
          <span style={{ fontSize: 11, fontFamily: "var(--font-cond)", fontWeight: 700, background: "rgba(255,140,0,0.1)", color: "var(--orange)", border: "1px solid rgba(255,140,0,0.25)", borderRadius: 20, padding: "2px 9px", textTransform: "capitalize", letterSpacing: "0.03em" }}>
            {business.category}
          </span>
        )}
      </div>
    </div>
  );
}
