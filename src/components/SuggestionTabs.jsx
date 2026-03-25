"use client";

import { useState } from "react";

const PREVIEW_LIMIT = 250;

function CharBar({ count }) {
  const pct = Math.min((count / 750) * 100, 100);
  const color = count > 750 ? "var(--red)" : count > 650 ? "var(--green)" : "var(--accent)";
  return (
    <div style={{ marginTop: 4, height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
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
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 6 }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: active === i ? "rgba(79,142,247,0.15)" : "none", color: active === i ? "var(--accent)" : "var(--text-muted)", border: "none", padding: "10px 8px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", borderRadius: 8, transition: "all 0.15s", textAlign: "center" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{i + 1}</span>
            <span style={{ fontSize: 12, lineHeight: 1.3 }}>{s.label}</span>
          </button>
        ))}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid rgba(79,142,247,0.2)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 24px", background: "rgba(79,142,247,0.05)", borderBottom: "1px solid var(--border)", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{cur.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{cur.charCount} / 750 characters</div>
            <CharBar count={cur.charCount} />
          </div>
          <button onClick={() => copy(cur.description, active)}
            style={{ background: copied === active ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)", border: `1px solid ${copied === active ? "var(--green)" : "var(--border)"}`, color: copied === active ? "var(--green)" : "var(--text-muted)", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}>
            {copied === active ? "copied" : "copy"}
          </button>
        </div>

        <div style={{ padding: "22px 24px" }}>
          <p style={{ margin: "0 0 20px", lineHeight: 1.75, fontSize: 15, color: "#dde1ef" }}>{cur.description}</p>

          <div style={{ background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.18)", borderRadius: 10, padding: "12px 16px", marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: "rgba(124,92,252,0.75)", letterSpacing: 1.2, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>PREVIEW — first 250 chars shown before More</div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{cur.description.slice(0, PREVIEW_LIMIT)}<span style={{ color: "rgba(124,92,252,0.7)" }}>…</span></p>
          </div>

          <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", display: "block", marginBottom: 6 }}>Why this works</span>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{cur.rationale}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
