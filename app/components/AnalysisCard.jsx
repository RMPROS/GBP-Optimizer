"use client";

import { useEffect, useState } from "react";

function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(false);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = animated ? (score / 100) * circ : 0;
  const color =
    score >= 75 ? "var(--green)" : score >= 50 ? "var(--amber)" : "var(--red)";

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
      <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="40" cy="40" r={r}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"
        />
        <circle
          cx="40" cy="40" r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${fill} ${circ}`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>
          {score}
        </span>
        <span style={{ fontSize: 9, color: "var(--text-faint)", letterSpacing: 1 }}>/ 100</span>
      </div>
    </div>
  );
}

function Tag({ children, variant }) {
  const colors = {
    green: { bg: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "rgba(16,185,129,0.2)" },
    red:   { bg: "rgba(239,68,68,0.10)",  color: "#fca5a5", border: "rgba(239,68,68,0.2)"  },
  };
  const c = colors[variant];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 500,
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

export default function AnalysisCard({ analysis }) {
  if (!analysis) return null;

  return (
    <div style={styles.card}>
      <div style={styles.inner}>
        <ScoreRing score={analysis.score} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.heading}>
            Current Description Analysis
            <span style={styles.charBadge}>{analysis.charCount} chars</span>
          </div>
          <div style={styles.tags}>
            {analysis.strengths?.map((s, i) => (
              <Tag key={`s-${i}`} variant="green">✓ {s}</Tag>
            ))}
            {analysis.weaknesses?.map((w, i) => (
              <Tag key={`w-${i}`} variant="red">✗ {w}</Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "24px 28px",
    marginBottom: 24,
    animation: "fadeUp 0.4s ease forwards",
  },
  inner: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  heading: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    color: "var(--text)",
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  charBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    color: "var(--text-faint)",
    fontWeight: 400,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
};
