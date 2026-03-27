"use client";

import { useState } from "react";
import Script from "next/script";
import PlacesSearch from "../components/PlacesSearch";
import BusinessContext from "../components/BusinessContext";
import AnalysisCard from "../components/AnalysisCard";
import SuggestionTabs from "../components/SuggestionTabs";

const TOOL_URL = "https://desc.rentalmarketingpros.com";
const SHARE_TEXT = "Free GBP Description Optimizer for rental businesses — get Google-optimized business descriptions in minutes.";

const shareLinks = [
  {
    name: "Facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(TOOL_URL)}`,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    hoverBg: "rgba(24,119,242,0.85)",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
    hoverBg: "rgba(225,48,108,0.85)",
  },
  {
    name: "LinkedIn",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(TOOL_URL)}`,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    hoverBg: "rgba(10,102,194,0.85)",
  },
  {
    name: "Email",
    href: `mailto:?subject=${encodeURIComponent("Free GBP Description Optimizer")}&body=${encodeURIComponent(SHARE_TEXT + "\n\n" + TOOL_URL)}`,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    hoverBg: "var(--orange)",
  },
  {
    name: "SMS",
    href: `sms:?body=${encodeURIComponent(SHARE_TEXT + " " + TOOL_URL)}`,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    hoverBg: "rgba(34,197,94,0.85)",
  },
];

function handleShare(href, name) {
  if (name === "Email" || name === "SMS") {
    window.location.href = href;
  } else {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
  }
}

export default function Home() {
  const [business, setBusiness] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const charCount = description.length;
  const charColor = charCount > 750 ? "var(--danger)" : charCount > 600 ? "var(--orange)" : "var(--success)";
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const analyze = async () => {
    if (!description.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, businessContext: business }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business?.name || "",
          businessAddress: business?.address || "",
          businessCategory: business?.category || "",
          descriptionLength: description.length,
          descriptionText: description,
        }),
      }).catch(() => {});
    } catch (err) {
      setError("We are sorry the tool is not working right now. Please try again later.");
    } finally { setLoading(false); }
  };

  const reset = () => { setResult(null); setDescription(""); setBusiness(null); setError(null); };

  // Card style — exact match to GBP Services
  const card = { background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", overflow: "hidden", marginBottom: "1.25rem" };
  const cardHeader = { background: "var(--navy)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 12 };
  const iconBox = { width: 32, height: 32, background: "rgba(255,140,0,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
  const cardTitle = { fontFamily: "var(--font-cond)", fontWeight: 700, fontSize: 16, color: "white", textTransform: "uppercase", letterSpacing: "0.04em" };
  const cardSub = { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 };
  const inputStyle = { fontFamily: "var(--font)", fontSize: 14, color: "var(--navy)", background: "var(--off-white)", border: "1.5px solid var(--border-strong)", borderRadius: "var(--radius)", padding: "11px 14px", outline: "none", width: "100%", resize: "vertical", lineHeight: 1.65, WebkitAppearance: "none" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>

      {/* ── Header — exact match to GBP Services ── */}
      <header className="rmp-header" style={{
        background: "var(--navy)", borderBottom: "3px solid var(--orange)",
        height: 66, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100, gap: "1rem",
      }}>
        <div className="rmp-header-logo" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <img src="/logo_cropped.png" alt="Rental Marketing Pros"
            style={{ width: 200, height: 48, objectFit: "contain" }} />
        </div>

        <div className="rmp-share-section" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span className="rmp-share-label" style={{
            fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap",
          }}>
            Share this tool
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {shareLinks.map(link => (
              <button key={link.name} onClick={() => handleShare(link.href, link.name)}
                title={`Share on ${link.name}`}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--orange)";
                  e.currentTarget.style.borderColor = "var(--orange)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }}>
                {link.icon}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={{ background: "var(--navy)", padding: "2.5rem 1.5rem 3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,140,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,0,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className="rmp-page-title" style={{
            fontFamily: "var(--font-cond)", fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 40px)", textTransform: "uppercase",
            letterSpacing: "0.02em", lineHeight: 1.1,
            color: "var(--white)",
          }}>
            GBP Description <span style={{ color: "var(--orange)" }}>Optimizer</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, maxWidth: 520, margin: "10px auto 0", lineHeight: 1.6 }}>
            Find your business, paste your current description, and get 3 optimized alternatives scored against Google&apos;s 7 best-practice criteria.
          </p>
        </div>
      </div>

      {/* Orange stripe */}
      <div style={{ height: 4, background: "linear-gradient(90deg, var(--orange) 0%, var(--orange-light) 50%, var(--orange) 100%)" }} />

      {/* ── Main ── */}
      <main className="rmp-main" style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem 1rem 2rem" }}>

        {/* Step 1 card */}
        <div style={card}>
          <div className="rmp-card-header" style={cardHeader}>
            <div style={iconBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div>
              <h2 style={cardTitle}>Find Your Business</h2>
              <p style={cardSub}>Search for your Google Business Profile</p>
            </div>
          </div>
          <div className="rmp-card-body" style={{ padding: "1.25rem" }}>
            <PlacesSearch apiKey={apiKey} onBusinessSelect={setBusiness} />
            <BusinessContext business={business} />
          </div>
        </div>

        {/* Step 2 card */}
        <div style={card}>
          <div className="rmp-card-header" style={cardHeader}>
            <div style={iconBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <div>
              <h2 style={cardTitle}>Paste Current Description</h2>
              <p style={cardSub}>Your existing GBP description — up to 750 characters</p>
            </div>
          </div>
          <div className="rmp-card-body" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--gray)" }}>Description text</label>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: charColor, fontWeight: 600 }}>{charCount} / 750</span>
            </div>
            <textarea
              style={{ ...inputStyle, minHeight: 130 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste your current Google Business Profile description here…"
              maxLength={800}
              onFocus={e => e.target.style.borderColor = "var(--orange)"}
              onBlur={e => e.target.style.borderColor = "var(--border-strong)"}
            />
            <div style={{ marginTop: 8, marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--gray)", marginBottom: 4, fontWeight: 600, letterSpacing: "0.04em" }}>
                <span>FIRST 250 CHARS VISIBLE BEFORE "MORE"</span>
                <span>{Math.min(charCount, 250)} / 250</span>
              </div>
              <div style={{ height: 4, background: "var(--gray-xlight)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min((charCount / 250) * 100, 100)}%`, background: "linear-gradient(90deg, var(--navy), var(--orange))", borderRadius: 2, transition: "width 0.3s ease" }} />
              </div>
            </div>

            <div className="rmp-btn-row" style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={analyze} disabled={loading || charCount < 10}
                style={{
                  fontFamily: "var(--font)", fontSize: 14, fontWeight: 700,
                  padding: "13px 28px", borderRadius: "var(--radius)", border: "none",
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: loading || charCount < 10 ? "var(--gray-light)" : "var(--orange)",
                  color: loading || charCount < 10 ? "var(--gray)" : "white",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  cursor: loading || charCount < 10 ? "not-allowed" : "pointer",
                  boxShadow: loading || charCount < 10 ? "none" : "var(--shadow-md)",
                  transition: "all 0.15s",
                }}>
                {loading ? (
                  <>
                    <span className="animate-pulse">◆</span> Analyzing…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Optimize Description
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius)", padding: "11px 14px", color: "var(--danger)", fontSize: 13, marginBottom: "1.25rem", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-fadeUp">
            <AnalysisCard analysis={result.analysis} />
            <SuggestionTabs suggestions={result.suggestions} />
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button onClick={reset} style={{ background: "none", border: "1.5px solid var(--border-strong)", color: "var(--gray)", borderRadius: "var(--radius)", padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", letterSpacing: "0.04em", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--navy)"; e.currentTarget.style.color = "var(--navy)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--gray)"; }}>
                ← Start Over
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer — exact match to GBP Services ── */}
      <footer style={{ background: "var(--navy)", borderTop: "3px solid var(--orange)", marginTop: "3rem" }}>
        <div className="footer-body" style={{ maxWidth: 1060, margin: "0 auto", padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-cond)", fontWeight: 900, fontSize: "clamp(20px, 4vw, 30px)", color: "white", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 8 }}>
            Ready to Grow Your <span style={{ color: "var(--orange)" }}>Rental Business?</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: "1.75rem", maxWidth: 440, margin: "0 auto 1.75rem" }}>
            Book a free discovery call with our team and let&apos;s put your optimized profile to work.
          </p>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div id="SOIDIV_rental-revenue-call" data-so-page="rental-revenue-call" data-height="550"
              data-style="border: 1px solid rgba(255,255,255,0.15); min-width: 290px; max-width: 900px; border-radius: 10px; overflow: hidden;"
              data-psz="00" />
            <Script src="https://cdn.oncehub.com/mergedjs/so.js" strategy="lazyOnload" />
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "1.25rem 1.5rem" }}>
          <div className="rmp-footer-bar" style={{ maxWidth: 1060, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.875rem" }}>
            <img src="/logo_cropped.png" alt="Rental Marketing Pros" style={{ width: 160, height: 40, objectFit: "contain" }} />
            <a href="https://www.rentalmarketingpros.com" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--orange-light)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              rentalmarketingpros.com
            </a>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              © {new Date().getFullYear()} Rental Marketing Pros. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
