export default function ReportDetail({ report, onClose }) {
  if (!report) return null;

  const vitals = [
    { name: "Temperature", value: "38.2 °C", pct: 72, color: "#E24B4A", status: "High", statusStyle: { background: "#FCEBEB", color: "#791F1F" } },
    { name: "Blood pressure", value: "118/76 mmHg", pct: 58, color: "#378ADD", status: "Normal", statusStyle: { background: "#EAF3DE", color: "#27500A" } },
    { name: "Heart rate", value: "88 bpm", pct: 64, color: "#378ADD", status: "Normal", statusStyle: { background: "#EAF3DE", color: "#27500A" } },
    { name: "SpO₂", value: "97 %", pct: 97, color: "#1D9E75", status: "Normal", statusStyle: { background: "#EAF3DE", color: "#27500A" } },
    { name: "Respiratory rate", value: "18 / min", pct: 50, color: "#378ADD", status: "Normal", statusStyle: { background: "#EAF3DE", color: "#27500A" } },
  ];

  const labs = [
    { test: "WBC Count", result: "9.2 × 10³/µL", ref: "4.0 – 11.0", status: "Normal", s: { background: "#EAF3DE", color: "#27500A" } },
    { test: "Haemoglobin", result: "13.8 g/dL", ref: "13.5 – 17.5", status: "Normal", s: { background: "#EAF3DE", color: "#27500A" } },
    { test: "Platelet Count", result: "148 × 10³/µL", ref: "150 – 400", status: "Borderline", s: { background: "#FAEEDA", color: "#633806" } },
    { test: "CRP", result: "18.4 mg/L", ref: "< 10.0", status: "High", s: { background: "#FCEBEB", color: "#791F1F" } },
    { test: "NS1 Antigen (Dengue)", result: "Negative", ref: "Negative", status: "Normal", s: { background: "#EAF3DE", color: "#27500A" } },
    { test: "Random Blood Sugar", result: "102 mg/dL", ref: "70 – 140", status: "Normal", s: { background: "#EAF3DE", color: "#27500A" } },
  ];

  const rx = [
    { label: "Rx1", name: "Paracetamol 500 mg", detail: "2 tablets orally · Twice daily · After meals · 5 days" },
    { label: "Rx2", name: "ORS Oral Rehydration Sachets", detail: "1 sachet in 200 ml water · After each loose stool · Until fever subsides" },
    { label: "Rx3", name: "Cetirizine 10 mg", detail: "1 tablet orally · Once daily at night · 3 days" },
  ];

  const notes = [
    { type: "blue", text: "If fever persists beyond 3 days or rises above 39.5 °C, return immediately." },
    { type: "blue", text: "Drink minimum 2.5 litres of fluids daily." },
    { type: "blue", text: "Strict bed rest for 2–3 days. Avoid strenuous activity." },
    { type: "amber", text: "Avoid cold beverages and NSAIDs (risk of platelet drop)." },
    { type: "amber", text: "Repeat platelet count in 48 hrs due to borderline result." },
  ];

  const sectionTitle = (label) => (
    <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-background-primary)", borderRadius: 14, border: "0.5px solid var(--color-border-tertiary)", width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 500, color: "#0C447C", flexShrink: 0 }}>
            {report.patientName?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 500 }}>{report.patientName}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>
              {report.gender} · {report.age} years · DOB: 12 Mar 2001 · NIC: 200171234567V
            </div>
            <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[{ label: "Blood Group: B+", cls: "blue" }, { label: "Allergy: Penicillin", cls: "amber" }].map(b => (
                <span key={b.label} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, background: b.cls === "blue" ? "#E6F1FB" : "#FAEEDA", color: b.cls === "blue" ? "#0C447C" : "#633806", border: `0.5px solid ${b.cls === "blue" ? "#B5D4F4" : "#FAC775"}` }}>{b.label}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Report ID</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>#{report.id?.slice(-6).toUpperCase()}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>18 Jul 2025</div>
          </div>
          <button onClick={onClose} style={{ border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, padding: "4px 12px", background: "transparent", cursor: "pointer", fontSize: 12, alignSelf: "flex-start" }}>Close</button>
        </div>

        {/* Visit summary */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {sectionTitle("Visit summary")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {[["Department", report.department], ["Doctor", report.doctor_name], ["Visit type", "OPD — Out-patient"], ["Ward / Room", "OPD Block A, Room 04"]].map(([l, v]) => (
              <div key={l}><div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{l}</div><div style={{ fontSize: 13, marginTop: 4 }}>{v}</div></div>
            ))}
          </div>
        </div>

        {/* Complaint */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {sectionTitle("Chief complaint")}
          <div style={{ fontSize: 14, lineHeight: 1.6, background: "var(--color-background-secondary)", padding: "10px 14px", borderRadius: 8 }}>
            {report.complaint} — Onset sudden, frontal headache rated 5/10. Low-grade fever measured at home (37.8 °C). No chills, no vomiting. Dengue NS1 Ag negative.
          </div>
        </div>

        {/* Vitals */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {sectionTitle("Vital signs on admission")}
          {vitals.map(v => (
            <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)", minWidth: 140 }}>{v.name}</span>
              <div style={{ flex: 1, height: 6, background: "var(--color-background-secondary)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${v.pct}%`, background: v.color, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, minWidth: 130, textAlign: "right" }}>
                {v.value} <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 500, ...v.statusStyle }}>{v.status}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Diagnosis */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {sectionTitle("Diagnosis")}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{report.diagnosis} — ICD-10: A99</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 3 }}>Dengue fever ruled out. No bacterial infection indicated.</div>
            </div>
            <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 500, background: "#FAEEDA", color: "#633806" }}>Mild severity</span>
          </div>
        </div>

        {/* Labs */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {sectionTitle("Lab investigations")}
          <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "var(--color-background-secondary)", padding: "8px 12px", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)" }}>
              {["Test", "Result", "Reference", "Status"].map(h => <span key={h}>{h}</span>)}
            </div>
            {labs.map((l, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "8px 12px", fontSize: 12, borderTop: "0.5px solid var(--color-border-tertiary)", alignItems: "center" }}>
                <span>{l.test}</span>
                <span style={{ fontWeight: 500 }}>{l.result}</span>
                <span style={{ color: "var(--color-text-secondary)" }}>{l.ref}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 500, display: "inline-block", ...l.s }}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {sectionTitle("Prescription")}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(report.prescription?.length ? rx : [{ label: "—", name: "No prescription issued", detail: "" }]).map((r, i) => (
              <div key={i} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "#0C447C", flexShrink: 0 }}>{r.label}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{r.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {sectionTitle("Doctor's notes & advice")}
          {(report.notes?.length ? notes : [{ type: "blue", text: "No additional notes." }]).map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.type === "amber" ? "#BA7517" : "#378ADD", marginTop: 5, flexShrink: 0 }} />
              <span>{n.text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Issued by</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{report.doctor_name} · MBBS, MD (Internal Medicine)</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>City General Hospital · Reg No: SLMC-20845</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Next review</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#185FA5", marginTop: 2 }}>21 Jul 2025</div>
          </div>
        </div>

      </div>
    </div>
  );
}