"use client";

import { useEffect, useState } from "react";

function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(false);
  const r = 28, circ = 2 * Math.PI * r;
  const fill = animated ? (score / 100) * circ : 0;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "var(--orange)" : "#ef4444";
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
      <svg width="70" height="70" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(10,35,66,0.1)" strokeWidth="6" />
        <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${fill} ${circ}`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'Barlow Condensed', sans-serif" }}>{score}</span>
        <span style={{ fontSize: 8, color: "var(--gray)", letterSpacing: 1 }}>/ 100</span>
      </div>
    </div>
  );
}

function Tag({ children, variant }) {
  const c = variant === "green"
    ? { bg: "rgba(34,197,94,0.1)", color: "#16a34a", border: "rgba(34,197,94,0.25)" }
    : { bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.2)" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {children}
    </span>
  );
}

export default function AnalysisCard({ analysis }) {
  if (!analysis) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(10,35,66,0.1)", borderRadius: "var(--radius-lg)", padding: "16px", marginBottom: 20, animation: "fadeUp 0.4s ease forwards", boxShadow: "0 2px 12px rgba(10,35,66,0.06)" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <ScoreRing score={analysis.score} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--navy)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Description Score
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--gray)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{analysis.charCount} chars</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {analysis.strengths?.map((s, i) => <Tag key={i} variant="green">✓ {s}</Tag>)}
            {analysis.weaknesses?.map((w, i) => <Tag key={i} variant="red">✗ {w}</Tag>)}
          </div>
        </div>
      </div>
    </div>
  );
}
