"use client";

import { useState } from "react";
import PlacesSearch from "./components/PlacesSearch";
import BusinessContext from "./components/BusinessContext";
import AnalysisCard from "./components/AnalysisCard";
import SuggestionTabs from "./components/SuggestionTabs";

const CHAR_LIMIT = 750;
const PREVIEW_LIMIT = 250;

export default function Home() {
  const [business, setBusiness] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const charCount = description.length;
  const charColor =
    charCount > CHAR_LIMIT ? "var(--red)" :
    charCount > 600 ? "var(--amber)" : "var(--green)";

  const analyze = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, businessContext: business }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setDescription("");
    setBusiness(null);
    setError(null);
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.badge}>GBP OPTIMIZER</div>
        <h1 style={styles.title}>
          Google Business Description<br />Optimizer
        </h1>
        <p style={styles.subtitle}>
          Find your business, paste your current description, and get 3 AI-optimized alternatives
          scored against Google&apos;s best practices.
        </p>
      </header>

      <main style={styles.main}>
        {/* Input card */}
        <div style={styles.card}>
          {/* Step 1: Places search */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>1 — Find Your Business</label>
            <PlacesSearch
              apiKey={apiKey}
              onBusinessSelect={setBusiness}
            />
            <BusinessContext business={business} />
          </div>

          {/* Step 2: Description */}
          <div style={{ ...styles.section, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label style={styles.sectionLabel}>2 — Paste Your Current Description</label>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: charColor, fontWeight: 500 }}>
                {charCount} / {CHAR_LIMIT}
              </span>
            </div>

            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste your current Google Business Profile description here…"
              maxLength={800}
            />

            {/* Preview bar */}
            <div style={{ marginTop: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>
                <span>First 250 chars (visible before &quot;More&quot;)</span>
                <span>{Math.min(charCount, PREVIEW_LIMIT)} / {PREVIEW_LIMIT}</span>
              </div>
              <div style={styles.previewTrack}>
                <div style={{
                  ...styles.previewFill,
                  width: `${Math.min((charCount / PREVIEW_LIMIT) * 100, 100)}%`,
                }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={analyze}
                disabled={loading || charCount < 10}
                style={{ ...styles.analyzeBtn, ...(loading || charCount < 10 ? styles.analyzeBtnDisabled : {}) }}
              >
                {loading ? (
                  <span className="animate-pulse">Analyzing…</span>
                ) : "✦  Optimize Description"}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div style={styles.loadingBox}>
            <div className="animate-spin" style={{ fontSize: 22, display: "inline-block" }}>⟳</div>
            <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
              Reviewing against 7 GBP optimization criteria…
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            <AnalysisCard analysis={result.analysis} />
            <SuggestionTabs suggestions={result.suggestions} />
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button onClick={reset} style={styles.resetBtn}>
                ← Start over
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    paddingBottom: 80,
  },
  header: {
    background: "linear-gradient(180deg, rgba(79,142,247,0.07) 0%, transparent 100%)",
    borderBottom: "1px solid var(--border)",
    padding: "40px 24px 36px",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex", alignItems: "center",
    background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.25)",
    borderRadius: 20, padding: "4px 14px", marginBottom: 20,
    fontSize: 11, color: "var(--accent)",
    letterSpacing: 1.5, fontWeight: 600, fontFamily: "'DM Mono', monospace",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(28px, 5vw, 44px)",
    fontWeight: 800,
    margin: "0 0 12px",
    background: "linear-gradient(135deg, #fff 30%, #7c9ef5 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1.15,
  },
  subtitle: {
    color: "var(--text-muted)",
    fontSize: 15,
    margin: "0 auto",
    maxWidth: 480,
  },
  main: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "40px 24px 0",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    marginBottom: 28,
  },
  section: { padding: "24px 28px" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-muted)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontFamily: "'DM Mono', monospace",
    display: "block",
    marginBottom: 12,
  },
  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    lineHeight: 1.65,
    padding: "16px 18px",
    resize: "vertical",
    minHeight: 150,
    outline: "none",
  },
  previewTrack: {
    height: 3,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 2,
    overflow: "hidden",
  },
  previewFill: {
    height: "100%",
    background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
    borderRadius: 2,
    transition: "width 0.3s ease",
  },
  analyzeBtn: {
    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px 30px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: 0.3,
    transition: "opacity 0.2s, transform 0.1s",
  },
  analyzeBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  errorBox: {
    background: "rgba(239,68,68,0.09)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "var(--radius)",
    padding: "14px 18px",
    color: "#fca5a5",
    fontSize: 14,
    marginBottom: 24,
  },
  loadingBox: {
    textAlign: "center",
    padding: "48px 0",
    color: "var(--text-faint)",
  },
  resetBtn: {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--text-muted)",
    borderRadius: 8,
    padding: "10px 24px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
  },
};
