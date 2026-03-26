"use client";

import { useState, useEffect } from "react";
import Logo from "../../components/Logo";

export default function Dashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchLogs = async (pwd) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/logs?password=${encodeURIComponent(pwd)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unauthorized");
      setData(json);
      setAuthed(true);
    } catch (err) {
      setError(err.message);
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchLogs(password);
  };

  const formatDate = (ts) => {
    return new Date(ts).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ marginBottom: 32 }}>
          <Logo size="md" theme="dark" />
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-lg)", padding: "32px 36px", width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>
            Usage Dashboard
          </h2>
          <p style={{ color: "var(--gray)", fontSize: 13, margin: "0 0 24px" }}>Enter your dashboard password to continue.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius)", color: "#fff", fontFamily: "'Barlow', sans-serif", fontSize: 15, padding: "12px 16px", outline: "none", marginBottom: 12, boxSizing: "border-box" }}
            />
            {error && <p style={{ color: "#fca5a5", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: "var(--orange)", color: "#fff", border: "none", borderRadius: "var(--radius)", padding: "13px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}
            >
              {loading ? "Loading…" : "View Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--offwhite)", paddingBottom: 60 }}>
      <div style={{ background: "var(--navy)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, borderBottom: "3px solid var(--orange)" }}>
        <Logo size="sm" theme="dark" />
        <a href="/" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: "var(--gray)", letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>
          ← Back to Tool
        </a>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 0" }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: "var(--navy)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 28px" }}>
          Usage Dashboard
        </h1>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Uses", value: data.stats.total },
            { label: "Last 7 Days", value: data.stats.thisWeek },
            { label: "Last 24 Hours", value: data.stats.today },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid rgba(10,35,66,0.1)", borderRadius: "var(--radius-lg)", padding: "20px 24px", boxShadow: "0 2px 12px rgba(10,35,66,0.06)" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: "var(--gray)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 40, color: "var(--navy)", lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Log table */}
        <div style={{ background: "#fff", border: "1px solid rgba(10,35,66,0.1)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "0 2px 12px rgba(10,35,66,0.06)" }}>
          <div style={{ background: "var(--navy)", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, color: "#fff", textTransform: "uppercase", letterSpacing: 0.5 }}>Recent Uses</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--gray)" }}>{data.logs.length} records</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(10,35,66,0.08)" }}>
                  {["Date & Time", "Business Name", "Address", "Category", "Chars", "Description"].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "10px 16px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: "var(--gray)", letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.logs.map((log, i) => (
                  <>
                    <tr
                      key={log.id}
                      onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                      style={{ borderBottom: expanded === log.id ? "none" : "1px solid rgba(10,35,66,0.06)", background: i % 2 === 0 ? "#fff" : "rgba(10,35,66,0.02)", cursor: log.description_text ? "pointer" : "default" }}
                    >
                      <td style={{ padding: "10px 16px", color: "var(--gray)", whiteSpace: "nowrap", fontFamily: "monospace", fontSize: 12 }}>{formatDate(log.created_at)}</td>
                      <td style={{ padding: "10px 16px", color: "var(--navy)", fontWeight: 600 }}>{log.business_name || "—"}</td>
                      <td style={{ padding: "10px 16px", color: "var(--gray)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.business_address || "—"}</td>
                      <td style={{ padding: "10px 16px" }}>
                        {log.business_category
                          ? <span style={{ background: "rgba(255,140,0,0.1)", color: "var(--orange)", border: "1px solid rgba(255,140,0,0.25)", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, textTransform: "capitalize", whiteSpace: "nowrap" }}>{log.business_category}</span>
                          : <span style={{ color: "var(--gray)" }}>—</span>
                        }
                      </td>
                      <td style={{ padding: "10px 16px", color: "var(--navy)", fontFamily: "monospace" }}>{log.description_length}</td>
                      <td style={{ padding: "10px 16px", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--gray)" }}>
                        {log.description_text
                          ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.description_text}</span>
                              <span style={{ flexShrink: 0, fontSize: 10, color: "var(--orange)", fontWeight: 700 }}>{expanded === log.id ? "▲" : "▼"}</span>
                            </span>
                          : "—"
                        }
                      </td>
                    </tr>
                    {expanded === log.id && log.description_text && (
                      <tr key={`${log.id}-exp`} style={{ borderBottom: "1px solid rgba(10,35,66,0.06)", background: i % 2 === 0 ? "#fff" : "rgba(10,35,66,0.02)" }}>
                        <td colSpan={6} style={{ padding: "0 16px 16px 16px" }}>
                          <div style={{ background: "rgba(255,140,0,0.05)", border: "1px solid rgba(255,140,0,0.2)", borderRadius: 8, padding: "14px 16px", fontSize: 13, color: "var(--navy)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                            {log.description_text}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {data.logs.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "var(--gray)" }}>No uses logged yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{ marginTop: 12, fontSize: 12, color: "var(--gray)", textAlign: "right" }}>Click any row to expand the full description.</p>
      </div>
    </div>
  );
}
