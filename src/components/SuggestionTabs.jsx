"use client";

import { useState } from "react";

const PREVIEW_LIMIT = 250;

function CharBar({ count }) {
  const pct = Math.min((count / 750) * 100, 100);
  const color = count > 750 ? "#ef4444" : count > 650 ? "#22c55e" : "var(--orange)";
  return (
    <div style={{ marginTop: 4, height: 3, background: "rgba(10,35,66,0.1)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.3s ease" }} />
    </div>
  );
}

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
    <div style={{ animation: "fadeUp 0.4s ease 0.1s both" }}>
      {/* Tab row */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "rgba(10,35,66,0.04)", border: "1px solid rgba(10,35,66,0.1)", borderRadius: "var(--radius)", padding: 6 }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: active === i ? "var(--navy)" : "none",
            color: active === i ? "#fff" : "var(--gray)",
            border: "none", padding: "10px 8px",
            fontFamily: "'Barlow', sans-serif", cursor: "pointer", borderRadius: 8,
            transition: "all 0.15s", textAlign: "center",
          }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: active === i ? "rgba(255,140,0,0.3)" : "rgba(10,35,66,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: active === i ? "var(--orange)" : "var(--gray)" }}>{i + 1}</span>
            <span style={{ fontSize: 11, lineHeight: 1.3, fontWeight: 600 }}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Card */}
      <div style={{ background: "#fff", border: "1px solid rgba(10,35,66,0.1)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "0 2px 12px rgba(10,35,66,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 24px", background: "var(--navy)", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff", textTransform: "uppercase", letterSpacing: 0.5 }}>{cur.label}</div>
            <div style={{ fontSize: 12, color: "var(--gray)", marginTop: 2, fontFamily: "monospace" }}>{cur.charCount} / 750 characters</div>
            <CharBar count={cur.charCount} />
          </div>
          <button onClick={() => copy(cur.description, active)} style={{
            background: copied === active ? "rgba(34,197,94,0.2)" : "rgba(255,140,0,0.15)",
            border: `1px solid ${copied === active ? "rgba(34,197,94,0.4)" : "rgba(255,140,0,0.4)"}`,
            color: copied === active ? "#4ade80" : "var(--orange)",
            borderRadius: 7, padding: "6px 16px", fontSize: 12,
            fontFamily: "'Barlow', sans-serif", fontWeight: 700,
            cursor: "pointer", transition: "all 0.15s", flexShrink: 0, letterSpacing: 0.5,
          }}>
            {copied === active ? "✓ COPIED" : "COPY"}
          </button>
        </div>

        <div style={{ padding: "22px 24px" }}>
          <p style={{ margin: "0 0 20px", lineHeight: 1.75, fontSize: 15, color: "var(--navy)" }}>{cur.description}</p>

          <div style={{ background: "rgba(255,140,0,0.06)", border: "1px solid rgba(255,140,0,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: "var(--orange)", letterSpacing: 1.5, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Preview — first 250 chars shown before More</div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--navy)", lineHeight: 1.6, opacity: 0.7 }}>{cur.description.slice(0, PREVIEW_LIMIT)}<span style={{ color: "var(--orange)" }}>…</span></p>
          </div>

          <div style={{ paddingTop: 16, borderTop: "1px solid rgba(10,35,66,0.08)" }}>
            <span style={{ fontSize: 10, color: "var(--gray)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, display: "block", marginBottom: 6 }}>Why This Works</span>
            <p style={{ margin: 0, fontSize: 13, color: "var(--navy)", lineHeight: 1.6, opacity: 0.75 }}>{cur.rationale}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
