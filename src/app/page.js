"use client";

import { useState } from "react";
import Script from "next/script";
import Logo from "../components/Logo";
import PlacesSearch from "../components/PlacesSearch";
import BusinessContext from "../components/BusinessContext";
import AnalysisCard from "../components/AnalysisCard";
import SuggestionTabs from "../components/SuggestionTabs";

export default function Home() {
  const [business, setBusiness] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const charCount = description.length;
  const charColor = charCount > 750 ? "#ef4444" : charCount > 600 ? "var(--orange)" : "#22c55e";
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

      // Fire usage log (non-blocking)
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
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const reset = () => { setResult(null); setDescription(""); setBusiness(null); setError(null); };

  return (
    <div style={{ minHeight: "100vh", background: "var(--offwhite)", paddingBottom: 80 }}>

      {/* Top header with share buttons */}
      <div style={{ background: "var(--navy)", borderBottom: "3px solid var(--orange)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, gap: 8 }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: "var(--gray)", letterSpacing: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Share This Tool
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

          {/* Facebook */}
          <a href="https://www.facebook.com/sharer/sharer.php?u=https://desc.rentalmarketingpros.com" target="_blank" rel="noopener noreferrer" title="Share on Facebook"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(24,119,242,0.3)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" title="Share on Instagram"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(225,48,108,0.3)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://desc.rentalmarketingpros.com`} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(10,102,194,0.3)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>

          {/* Email */}
          <a href="mailto:?subject=Free GBP Description Optimizer&body=Optimize your Google Business Profile description with this free tool: https://desc.rentalmarketingpros.com" title="Share via Email"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,140,0,0.3)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>

          {/* SMS */}
          <a href="sms:?body=Check out this free Google Business Profile description optimizer from Rental Marketing Pros: https://desc.rentalmarketingpros.com" title="Share via SMS"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.3)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </a>

        </div>
      </div>

      {/* Header with share links */}
      <div style={{ background: "var(--navy-dark, #071829)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 24px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: "var(--gray)", letterSpacing: 2, textTransform: "uppercase" }}>
          Share This Tool
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

          {/* Facebook */}
          <a href="https://www.facebook.com/sharer/sharer.php?u=https://desc.rentalmarketingpros.com" target="_blank" rel="noopener noreferrer" title="Share on Facebook"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.15s", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(24,119,242,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" title="Share on Instagram"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.15s", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(225,48,108,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="#ffffff" stroke="none"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://desc.rentalmarketingpros.com" target="_blank" rel="noopener noreferrer" title="Share on LinkedIn"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.15s", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(10,102,194,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>

          {/* Email */}
          <a href="mailto:?subject=Check out this free GBP Description Optimizer&body=I found this free tool that optimizes your Google Business Profile description. Check it out: https://desc.rentalmarketingpros.com" title="Share via Email"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.15s", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,140,0,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>

          {/* SMS */}
          <a href="sms:?body=Check out this free GBP Description Optimizer: https://desc.rentalmarketingpros.com" title="Share via SMS"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.15s", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </a>

        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "var(--navy)", padding: "0px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Subtle grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,140,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,0,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Centered large logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
            <img
              src="/logo_cropped.png"
              alt="Rental Marketing Pros"
              style={{ height: 350, width: "auto", objectFit: "contain" }}
            />
          </div>

          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5vw, 56px)", color: "#fff", lineHeight: 1.05, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>
            Google Business Profile
          </h1>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5vw, 56px)", color: "var(--orange)", lineHeight: 1.05, margin: "0 0 20px", textTransform: "uppercase", letterSpacing: 1 }}>
            Description Optimizer
          </h1>
          <p style={{ color: "var(--gray)", fontSize: 16, margin: "0 auto", maxWidth: 500, lineHeight: 1.6 }}>
            Find your business, paste your current description, and get 3 optimized alternatives scored against Google&apos;s 7 best-practice criteria.
          </p>
        </div>
      </div>

      {/* Orange accent stripe */}
      <div style={{ height: 4, background: "linear-gradient(90deg, var(--orange) 0%, #ffad33 50%, var(--orange) 100%)" }} />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 0" }}>

        {/* Input card */}
        <div style={{ background: "#fff", border: "1px solid rgba(10,35,66,0.1)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 28, boxShadow: "0 2px 16px rgba(10,35,66,0.07)" }}>

          {/* Step 1 */}
          <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(10,35,66,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 12, color: "var(--orange)" }}>1</span>
              </div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)", letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif" }}>
                Find Your Business
              </label>
            </div>
            <PlacesSearch apiKey={apiKey} onBusinessSelect={setBusiness} />
            <BusinessContext business={business} />
          </div>

          {/* Step 2 */}
          <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 12, color: "var(--orange)" }}>2</span>
                </div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)", letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Paste Current Description
                </label>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: charColor, fontWeight: 600 }}>{charCount} / 750</span>
            </div>

            <textarea
              style={{ width: "100%", background: "var(--offwhite)", border: "1.5px solid rgba(10,35,66,0.15)", borderRadius: "var(--radius)", color: "var(--navy)", fontFamily: "'Barlow', sans-serif", fontSize: 15, lineHeight: 1.65, padding: "14px 16px", resize: "vertical", minHeight: 140, outline: "none", transition: "border-color 0.2s" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste your current Google Business Profile description here…"
              maxLength={800}
              onFocus={e => e.target.style.borderColor = "var(--orange)"}
              onBlur={e => e.target.style.borderColor = "rgba(10,35,66,0.15)"}
            />

            {/* 250-char preview bar */}
            <div style={{ marginTop: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--gray)", marginBottom: 4, fontWeight: 600 }}>
                <span>FIRST 250 CHARS VISIBLE BEFORE &quot;MORE&quot;</span>
                <span>{Math.min(charCount, 250)} / 250</span>
              </div>
              <div style={{ height: 4, background: "rgba(10,35,66,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min((charCount / 250) * 100, 100)}%`, background: "linear-gradient(90deg, var(--navy), var(--orange))", borderRadius: 2, transition: "width 0.3s ease" }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={analyze} disabled={loading || charCount < 10}
                style={{ background: loading || charCount < 10 ? "var(--gray)" : "var(--orange)", color: "#fff", border: "none", borderRadius: "var(--radius)", padding: "13px 32px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, cursor: loading || charCount < 10 ? "not-allowed" : "pointer", letterSpacing: 1, textTransform: "uppercase", transition: "background 0.2s", boxShadow: loading || charCount < 10 ? "none" : "0 4px 14px rgba(255,140,0,0.35)" }}>
                {loading ? "Analyzing…" : "✦ Optimize Description"}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius)", padding: "14px 18px", color: "#dc2626", fontSize: 14, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div className="animate-pulse" style={{ fontSize: 24, display: "inline-block", color: "var(--orange)" }}>◆</div>
            <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--gray)", fontWeight: 600 }}>Reviewing against 7 GBP optimization criteria…</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            <AnalysisCard analysis={result.analysis} />
            <SuggestionTabs suggestions={result.suggestions} />
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button onClick={reset} style={{ background: "none", border: "2px solid rgba(10,35,66,0.15)", color: "var(--gray)", borderRadius: "var(--radius)", padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif", letterSpacing: 0.5, transition: "all 0.15s" }}>
                ← Start Over
              </button>
            </div>
          </>
        )}

      </main>

      {/* Booking Widget */}
      <div style={{ maxWidth: 900, margin: "60px auto 0", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,140,0,0.1)", border: "1px solid rgba(255,140,0,0.3)", borderRadius: 20, padding: "5px 16px", marginBottom: 14 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--orange)" }} />
            <span style={{ fontSize: 11, color: "var(--orange)", letterSpacing: 2, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
              Next Step
            </span>
          </div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3vw, 32px)", color: "var(--navy)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>
            Ready to Grow Your Rental Business?
          </h2>
          <p style={{ color: "var(--gray)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
            Book a free discovery call with our team and let&apos;s put your optimized profile to work.
          </p>
        </div>

        <div
          id="SOIDIV_rental-revenue-call"
          data-so-page="rental-revenue-call"
          data-height="550"
          data-style="border: 1px solid #d8d8d8; min-width: 290px; max-width: 900px;"
          data-psz="00"
        />
        <Script
          src="https://cdn.oncehub.com/mergedjs/so.js"
          strategy="lazyOnload"
        />
      </div>

      {/* Footer */}
      <footer style={{ marginTop: 80, background: "var(--navy)", padding: "24px", textAlign: "center", borderTop: "3px solid var(--orange)" }}>
        <Logo size="sm" theme="dark" />
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--gray)", letterSpacing: 0.5 }}>
          © {new Date().getFullYear()} Rental Marketing Pros. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
