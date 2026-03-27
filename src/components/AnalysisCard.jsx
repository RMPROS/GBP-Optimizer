"use client";

import { useEffect, useState } from "react";

function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(false);
  const r = 26, circ = 2 * Math.PI * r;
  const fill = animated ? (score / 100) * circ : 0;
  const color = score >= 75 ? "var(--success)" : score >= 50 ? "var(--orange)" : "var(--danger)";
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
      <svg width="68" height="68" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(10,35,66,0.1)" strokeWidth="5" />
        <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${fill} ${circ}`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "var(--font-cond)" }}>{score}</span>
        <span style={{ fontSize: 9, color: "var(--gray)", letterSpacing: 1 }}>/ 100</span>
      </div>
    </div>
  );
}

function Tag({ children, variant }) {
  const c = variant === "green"
    ? { bg: "var(--success-bg)", color: "var(--success)", border: "var(--success-border)" }
    : { bg: "var(--danger-bg)", color: "var(--danger)", border: "var(--danger-border)" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {children}
    </span>
  );
}

const card = { background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", overflow: "hidden", marginBottom: "1.25rem" };
const cardHeader = { background: "var(--navy)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 12 };
const iconBox = { width: 32, height: 32, background: "rgba(255,140,0,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const cardTitle = { fontFamily: "var(--font-cond)", fontWeight: 700, fontSize: 16, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" };
const cardSub = { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 };

export default function AnalysisCard({ analysis }) {
  if (!analysis) return null;
  return (
    <div style={card}>
      <div className="rmp-card-header" style={cardHeader}>
        <div style={iconBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <h2 style={cardTitle}>Description Analysis</h2>
          <p style={cardSub}>Scored against Google&apos;s 7 best-practice criteria</p>
        </div>
      </div>
      <div className="rmp-card-body" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <ScoreRing score={analysis.score} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-cond)", fontWeight: 700, fontSize: 13, color: "var(--navy)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Current Score
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--gray)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{analysis.charCount} chars</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {analysis.strengths?.map((s, i) => <Tag key={i} variant="green">✓ {s}</Tag>)}
              {analysis.weaknesses?.map((w, i) => <Tag key={i} variant="red">✗ {w}</Tag>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
