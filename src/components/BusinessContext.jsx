"use client";

export default function BusinessContext({ business }) {
  if (!business) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.dot} />
      <div style={styles.info}>
        <span style={styles.name}>{business.name}</span>
        {business.address && <span style={styles.detail}>{business.address}</span>}
        {business.category && <span style={styles.tag}>{business.category}</span>}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex", alignItems: "flex-start", gap: 10,
    background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)",
    borderRadius: "var(--radius)", padding: "12px 16px", marginTop: 10,
  },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", marginTop: 5, flexShrink: 0 },
  info: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 10px" },
  name: { fontWeight: 600, color: "var(--text)", fontSize: 14 },
  detail: { fontSize: 13, color: "var(--text-muted)" },
  tag: {
    fontSize: 11, fontFamily: "'DM Mono', monospace",
    background: "rgba(79,142,247,0.15)", color: "var(--accent)",
    border: "1px solid rgba(79,142,247,0.25)", borderRadius: 20,
    padding: "2px 9px", textTransform: "capitalize", letterSpacing: 0.3,
  },
};
