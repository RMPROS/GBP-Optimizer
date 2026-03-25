"use client";

import { useState } from "react";

const PREVIEW_LIMIT = 250;

function CharBar({ count, limit = 750 }) {
  const pct = Math.min((count / limit) * 100, 100);
  const color = count > limit ? "var(--red)" : count > 650 ? "var(--green)" : "var(--accent)";
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: color, borderRadius: 2,
          transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

export default function SuggestionTabs({ suggestions }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(null);

  if (!suggestions?.length) return null;

  const current = suggestions[active];

  const copy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease 0.1s both" }}>
      <div style={styles.tabRow}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{ ...styles.tab, ...(active === i ? styles.tabActive : {}) }}
          >
            <span style={styles.tabNumber}>{i + 1}</span>
            <span style={{ fontSize: 12, lineHeight: 1.3 }}>{s.label}</span>
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <div style={styles.label}>{current.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
              {current.charCount} / 750 characters
            </div>
            <CharBar count={current.charCount} />
          </div>
          <button
            onClick={() => copy(current.description, active)}
            style={{ ...styles.copyBtn, ...(copied === active ? styles.copyBtnCopied : {}) }}
          >
            {copied === active ? "copied" : "copy"}
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.description}>{current.description}</p>

          <div style={styles.previewBox}>
            <div style={styles.previewLabel}>PREVIEW — first 250 chars (shown before More)</div>
            <p style={styles.previewText}>
              {current.description.slice(0, PREVIEW_LIMIT)}
              <span style={{ color: "rgba(124,92,252,0.7)" }}>…</span>
            </p>
          </div>

          <div style={styles.rationale}>
            <span style={styles.rationaleLabel}>Why this works</span>
            <p style={styles.rationaleText}>{current.rationale}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  tabRow: {
    display: "flex", gap: 6, marginBottom: 14,
    background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: 6,
  },
  tab: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    gap: 4, background: "none", border: "none", padding: "10px 8px",
    fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)",
    cursor: "pointer", borderRadius: 8, transition: "all 0.15s", textAlign: "center",
  },
  tabActive: { background: "rgba(79,142,247,0.15)", color: "var(--accent)" },
  tabNumber: {
    width: 22, height: 22, borderRadius: "50%",
    background: "rgba(255,255,255,0.06)", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
  },
  card: {
    background: "var(--surface)", border: "1px solid rgba(79,142,247,0.2)",
    borderRadius: "var(--radius-lg)", overflow: "hidden",
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "18px 24px", background: "rgba(79,142,247,0.05)",
    borderBottom: "1px solid var(--border)", gap: 12,
  },
  label: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)" },
  copyBtn: {
    background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
    color: "var(--text-muted)", borderRadius: 7, padding: "6px 14px",
    fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer",
    transition: "all 0.15s", flexShrink: 0, letterSpacing: 0.3,
  },
  copyBtnCopied: { background: "rgba(16,185,129,0.12)", borderColor: "var(--green)", color: "var(--green)" },
  body: { padding: "22px 24px" },
  description: { margin: "0 0 20px", lineHeight: 1.75, fontSize: 15, color: "#dde1ef" },
  previewBox: {
    background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.18)",
    borderRadius: 10, padding: "12px 16px", marginBottom: 18,
  },
  previewLabel: {
    fontSize: 10, color: "rgba(124,92,252,0.75)", letterSpacing: 1.2,
    fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 8,
  },
  previewText: { margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 },
  rationale: { paddingTop: 16, borderTop: "1px solid var(--border)" },
  rationaleLabel: {
    fontSize: 10, color: "var(--text-faint)", letterSpacing: 1.2,
    textTransform: "uppercase", fontFamily: "'DM Mono', monospace", display: "block", marginBottom: 6,
  },
  rationaleText: { margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 },
};
