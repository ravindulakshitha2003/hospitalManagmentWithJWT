import React from 'react';
export default function ReportsList({ reports, onSelect }) {
  const shortId = (id) => "#" + id.slice(-6).toUpperCase();

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAEDF0", overflow: "hidden" }}>
      {reports.map((r, i) => (
        <div
          key={r.id}
          onClick={() => onSelect(r)}
          style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #F5F5F5", cursor: "pointer" }}
        >
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EBF4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#378ADD", flexShrink: 0 }}>
            {r.patientName[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>
              {r.patientName} <span style={{ fontWeight: 400, color: "#888", fontSize: 12 }}>· {r.gender}, {r.age}y</span>
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.diagnosis}
            </div>
          </div>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "#EBF4FF", color: "#378ADD", fontWeight: 500 }}>
            {r.department}
          </span>
          <span style={{ fontSize: 12, color: "#aaa" }}>{shortId(r.id)}</span>
          <span style={{ color: "#ccc" }}>›</span>
        </div>
      ))}
    </div>
  );
}