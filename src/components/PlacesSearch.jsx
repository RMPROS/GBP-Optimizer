"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PlacesSearch — Places API (New)
 *
 * Uses PlaceAutocompleteElement (Web Component) — the current Google standard
 * as of March 2025. The legacy google.maps.places.Autocomplete class is no
 * longer available to new customers.
 *
 * Key differences vs legacy:
 *  - PlaceAutocompleteElement is a Web Component with its own shadow DOM input
 *  - Session tokens are managed automatically (better for billing)
 *  - Fields are fetched via fetchFields() at selection — only pay for what you use
 *  - Event is "gmp-select" with event.placePrediction (not "place_changed")
 *
 * Google Cloud Console: Enable "Places API (New)" — NOT the legacy Places API.
 */
export default function PlacesSearch({ onBusinessSelect, apiKey }) {
  const containerRef = useRef(null);
  const elementRef = useRef(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!apiKey || !containerRef.current) return;

    const run = async () => {
      setStatus("loading");
      try {
        await loadMapsSDK(apiKey);
        initWidget();
      } catch (err) {
        console.error("Places load error:", err);
        setStatus("error");
      }
    };

    run();

    return () => {
      if (elementRef.current && containerRef.current) {
        try { containerRef.current.removeChild(elementRef.current); } catch (_) {}
        elementRef.current = null;
      }
    };
  }, [apiKey]);

  const initWidget = () => {
    if (!containerRef.current || elementRef.current) return;

    const el = new window.google.maps.places.PlaceAutocompleteElement({
      includedPrimaryTypes: ["establishment"],
    });

    el.style.width = "100%";
    el.style.display = "block";

    el.addEventListener("gmp-select", async (event) => {
      try {
        const place = event.placePrediction.toPlace();
        // fetchFields triggers the billable Place Details call.
        // Only request what we actually need to minimize cost.
        await place.fetchFields({
          fields: ["displayName", "formattedAddress", "primaryType"],
        });
        onBusinessSelect({
          name: place.displayName ?? "",
          address: place.formattedAddress ?? "",
          category: (place.primaryType ?? "").replace(/_/g, " "),
          placeId: place.id ?? "",
        });
      } catch (err) {
        console.error("fetchFields error:", err);
      }
    });

    containerRef.current.appendChild(el);
    elementRef.current = el;
    setStatus("ready");
  };

  const handleClear = () => {
    if (elementRef.current) elementRef.current.value = "";
    onBusinessSelect(null);
  };

  if (!apiKey) {
    return (
      <div style={styles.missingKey}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Add{" "}
          <code style={styles.code}>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          to <code style={styles.code}>.env.local</code> to enable business lookup.
        </span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        gmp-place-autocomplete,
        gmp-basic-place-autocomplete {
          --gmp-input-padding: 13px 18px 13px 44px;
          --gmp-input-font-size: 15px;
          --gmp-input-font-family: 'DM Sans', sans-serif;
          --gmp-input-border-radius: 12px;
          --gmp-input-border-color: rgba(255,255,255,0.1);
          --gmp-input-background: rgba(255,255,255,0.04);
          --gmp-input-color: #e8eaf0;
          --gmp-input-placeholder-color: rgba(255,255,255,0.25);
          --gmp-list-background-color: #151827;
          --gmp-list-border-radius: 12px;
          width: 100%;
          display: block;
        }
      `}</style>

      <div style={styles.wrapper}>
        <div style={styles.inputWrap}>
          <svg style={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div ref={containerRef} style={{ width: "100%" }} />
          <button onClick={handleClear} style={styles.clearBtn} title="Clear" aria-label="Clear">
            ✕
          </button>
        </div>
        {status === "loading" && <p style={styles.hint}>Loading Places…</p>}
        {status === "error" && (
          <p style={{ ...styles.hint, color: "var(--red)" }}>
            Failed to load. Check your API key and that Places API (New) is enabled in Google Cloud Console.
          </p>
        )}
      </div>
    </>
  );
}

function loadMapsSDK(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places?.PlaceAutocompleteElement) {
      resolve();
      return;
    }
    const id = "gmp-sdk";
    if (!document.getElementById(id)) {
      window.__gmpReady = resolve;
      const s = document.createElement("script");
      s.id = id;
      s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__gmpReady&loading=async`;
      s.async = true;
      s.onerror = reject;
      document.head.appendChild(s);
    } else {
      const poll = setInterval(() => {
        if (window.google?.maps?.places?.PlaceAutocompleteElement) {
          clearInterval(poll);
          resolve();
        }
      }, 100);
      setTimeout(() => { clearInterval(poll); reject(new Error("timeout")); }, 10000);
    }
  });
}

const styles = {
  wrapper: { width: "100%" },
  missingKey: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "var(--radius)",
    padding: "12px 16px",
  },
  code: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
    background: "rgba(255,255,255,0.08)",
    padding: "1px 5px",
    borderRadius: 4,
    color: "var(--accent)",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  icon: {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    width: 16, height: 16, color: "rgba(255,255,255,0.25)", pointerEvents: "none", zIndex: 1,
  },
  clearBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "rgba(255,255,255,0.35)",
    cursor: "pointer", fontSize: 13, padding: "4px 6px", lineHeight: 1, zIndex: 1,
  },
  hint: { fontSize: 12, color: "var(--text-faint)", marginTop: 6 },
};
