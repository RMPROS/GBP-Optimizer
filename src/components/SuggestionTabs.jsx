"use client";

import { useState } from "react";

const PREVIEW_LIMIT = 250;

function CharBar({ count }) {
  const pct = Math.min((count / 750) * 100, 100);
  const color = count > 750 ? "var(--danger)" : count > 650 ? "var(--success)" : "var(--orange)";
  return (
    <div style={{ marginTop: 4, height: 3, background: "var(--gray-xlight)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.3s ease" }} />
    </div>
  );
}

const card = { background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", overflow: "hidden", marginBottom: "1.25rem" };
const cardHeader = { background: "var(--navy)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 12 };
const iconBox = { width: 32, height: 32, background: "rgba(255,140,0,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const cardTitle = { fontFamily: "var(--font-cond)", fontWeight: 700, fontSize: 16, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" };
const cardSub = { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 };

export default function SuggestionTabs({ suggestions }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(null);
  if (!suggestions?.length) return null;
  const cur = suggestions[active];

  const copy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={card}>
      <div className="rmp-card-header" style={cardHeader}>
        <div style={iconBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <div>
          <h2 style={cardTitle}>Optimized Descriptions</h2>
          <p style={cardSub}>3 alternatives — click to preview, copy to use</p>
        </div>
      </div>

      <div className="rmp-card-body" style={{ padding: "1.25rem" }}>
        <style>{`
          @media (max-width: 480px) {
            .tab-label-text { display: none !important; }
          }
        `}</style>

        {/* Tab row */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1rem", background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 5 }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: active === i ? "var(--navy)" : "transparent",
              color: active === i ? "white" : "var(--gray)",
              border: "none", padding: "8px 6px",
              fontFamily: "var(--font)", cursor: "pointer", borderRadius: 8,
              transition: "all 0.15s", textAlign: "center",
            }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: active === i ? "rgba(255,140,0,0.3)" : "rgba(10,35,66,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontFamily: "var(--font-cond)", fontWeight: 700, color: active === i ? "var(--orange)" : "var(--gray)" }}>{i + 1}</span>
              <span className="tab-label-text" style={{ fontSize: 10, lineHeight: 1.3, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", maxWidth: 120 }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Active description */}
        <div style={{ background: "var(--off-white)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {/* Mini header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 14px", background: "var(--navy-light)", gap: 10 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: "var(--font-cond)", fontWeight: 700, fontSize: 13, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" }}>{cur.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1, fontFamily: "monospace" }}>{cur.charCount} / 750 chars</div>
              <CharBar count={cur.charCount} />
            </div>
            <button onClick={() => copy(cur.description, active)} style={{
              background: copied === active ? "rgba(22,163,74,0.2)" : "rgba(255,140,0,0.15)",
              border: `1px solid ${copied === active ? "rgba(22,163,74,0.4)" : "rgba(255,140,0,0.35)"}`,
              color: copied === active ? "var(--success)" : "var(--orange-light)",
              borderRadius: 7, padding: "6px 14px", fontSize: 12,
              fontFamily: "var(--font)", fontWeight: 700, cursor: "pointer", flexShrink: 0,
              letterSpacing: "0.04em", textTransform: "uppercase", transition: "all 0.15s",
            }}>
              {copied === active ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <div style={{ padding: "14px" }}>
            <p style={{ margin: "0 0 14px", lineHeight: 1.75, fontSize: 14, color: "var(--navy)" }}>{cur.description}</p>

            {/* 250 preview */}
            <div style={{ background: "var(--info-bg)", border: "1px solid var(--info-border)", borderRadius: "var(--radius)", padding: "10px 12px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "var(--info-text)", letterSpacing: "0.08em", fontFamily: "var(--font-cond)", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>Preview — first 250 chars shown before "More"</div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--navy)", lineHeight: 1.6, opacity: 0.75 }}>{cur.description.slice(0, PREVIEW_LIMIT)}<span style={{ color: "var(--orange)" }}>…</span></p>
            </div>

            <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-cond)", fontWeight: 700, display: "block", marginBottom: 4 }}>Why This Works</span>
              <p style={{ margin: 0, fontSize: 12, color: "var(--gray)", lineHeight: 1.6 }}>{cur.rationale}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
