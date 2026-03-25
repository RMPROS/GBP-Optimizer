"use client";

import { useEffect, useRef, useState } from "react";

export default function PlacesSearch({ onBusinessSelect, apiKey }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!apiKey) return;

    // Load Google Maps JS SDK if not already present
    if (window.google?.maps?.places) {
      setLoaded(true);
      return;
    }

    const scriptId = "google-maps-script";
    if (document.getElementById(scriptId)) {
      // Script tag exists but not loaded yet — wait
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          setLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  useEffect(() => {
    if (!loaded || !inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["establishment"], fields: ["name", "formatted_address", "types", "place_id"] }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.name) return;

      // Extract the most relevant category from types
      const ignoredTypes = ["point_of_interest", "establishment", "store"];
      const category = place.types?.find((t) => !ignoredTypes.includes(t)) ?? "";
      const readableCategory = category.replace(/_/g, " ");

      setValue(place.name);
      onBusinessSelect({
        name: place.name,
        address: place.formatted_address ?? "",
        category: readableCategory,
        placeId: place.place_id ?? "",
      });
    });
  }, [loaded, onBusinessSelect]);

  const handleClear = () => {
    setValue("");
    if (inputRef.current) inputRef.current.value = "";
    onBusinessSelect(null);
  };

  if (!apiKey) {
    return (
      <div style={styles.missingKey}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Google Maps API key not configured —{" "}
          <a href="#" style={{ color: "var(--accent)" }}>add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local</a>
        </span>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.inputWrap}>
        <svg style={styles.searchIcon} viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          style={styles.input}
          placeholder="Search your business name…"
          defaultValue={value}
          type="text"
        />
        {value && (
          <button onClick={handleClear} style={styles.clearBtn} title="Clear">
            ✕
          </button>
        )}
      </div>
      {!loaded && (
        <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>
          Loading Places…
        </p>
      )}
    </div>
  );
}

const styles = {
  wrapper: { width: "100%" },
  missingKey: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "var(--radius)",
    padding: "12px 16px",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    width: 16,
    height: 16,
    color: "var(--text-faint)",
    pointerEvents: "none",
    flexShrink: 0,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    padding: "13px 40px 13px 42px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  clearBtn: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    color: "var(--text-faint)",
    cursor: "pointer",
    fontSize: 13,
    padding: "4px 6px",
    lineHeight: 1,
  },
};
