import { useState, useRef, useEffect } from "react";

function initials(name) {
  return name.replace("Dr. ", "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <span key={i} style={{ color: "#667eea", fontWeight: 600 }}>{p}</span>
          : p
      )}
    </>
  );
}

export default function DoctorSuggest({ doctors = [], value, onChange }) {
  const [query, setQuery]       = useState(value || "");
  const [open, setOpen]         = useState(false);
  const [activeIdx, setActive]  = useState(-1);
  const [selected, setSelected] = useState(null);
  const inputRef = useRef();

  // deduplicate the string array
  const unique = [...new Set(doctors)];

  const filtered = unique.filter(name =>
    name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => { setActive(-1); }, [query]);

  function select(name) {
    setSelected(name);
    setQuery(name);
    setOpen(false);
    onChange(name);
  }

  function clear() {
    setSelected(null);
    setQuery("");
    onChange("");
    inputRef.current.focus();
  }

  function handleKey(e) {
    if (!open || !filtered.length) return;
    if (e.key === "ArrowDown")    { e.preventDefault(); setActive(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); select(filtered[activeIdx]); }
    else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className="form-group" style={{ position: "relative" }}>
      <label>Doctor Name</label>

      <input
        ref={inputRef}
        type="text"
        placeholder="Type a doctor name..."
        autoComplete="off"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); setSelected(null); onChange(e.target.value); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKey}
      />

      {open && query && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "white", border: "1px solid #667eea", borderTop: "none",
          borderRadius: "0 0 4px 4px", zIndex: 100,
          maxHeight: 220, overflowY: "auto",
          boxShadow: "0 4px 12px rgba(102,126,234,0.15)"
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "14px 12px", fontSize: 13, color: "#999", textAlign: "center" }}>
              No doctors found
            </div>
          ) : filtered.map((name, i) => (
            <div
              key={`${name}-${i}`}
              onMouseDown={() => select(name)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", cursor: "pointer",
                background: i === activeIdx ? "#f0f0ff" : "white",
                borderBottom: "1px solid #f0f0f0"
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#667eea", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, flexShrink: 0
              }}>
                {initials(name)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>
                <Highlight text={name} query={query} />
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginTop: 8, padding: "8px 12px",
          background: "#f0f0ff", borderRadius: 4, border: "1px solid #d0d0ff"
        }}>
          <span style={{ fontSize: 13, color: "#667eea", fontWeight: 500, flex: 1 }}>
            {selected}
          </span>
          <button type="button" onClick={clear} style={{
            fontSize: 11, color: "#999", background: "none",
            border: "none", cursor: "pointer", padding: "2px 6px"
          }}>✕ clear</button>
        </div>
      )}
    </div>
  );
}