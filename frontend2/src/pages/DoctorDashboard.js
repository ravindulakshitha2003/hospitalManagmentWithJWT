import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const DOCTOR = {
  name: "Dr. Arjun Mehta",
  specialization: "Cardiologist",
  available: true,
  avatar: "AM",
  hospital: "Apollo Heart Institute",
  todaySummary: { total: 12, completed: 5, pending: 7 },
};

const APPOINTMENTS = [
  { id: 1, patient: "Nalini Perera", time: "09:00 AM", type: "in-person", status: "completed", age: 52, gender: "F" },
  { id: 2, patient: "Rohan Silva", time: "10:30 AM", type: "online", status: "completed", age: 38, gender: "M" },
  { id: 3, patient: "Amara Wickramasinghe", time: "11:00 AM", type: "in-person", status: "waiting", age: 65, gender: "F" },
  { id: 4, patient: "Dev Jayasuriya", time: "12:00 PM", type: "online", status: "waiting", age: 44, gender: "M" },
  { id: 5, patient: "Priya Fernando", time: "02:00 PM", type: "in-person", status: "cancelled", age: 29, gender: "F" },
  { id: 6, patient: "Sameer Bandara", time: "03:30 PM", type: "in-person", status: "waiting", age: 71, gender: "M" },
];




const PATIENTS = [
  {
    id: 1, name: "Nalini Perera", age: 52, gender: "F", lastVisit: "Apr 25, 2026", condition: "Hypertension",
    history: [
      { date: "Apr 25, 2026", diagnosis: "Hypertension Stage II", notes: "BP elevated at 160/100. Advised medication adjustment." },
      { date: "Mar 10, 2026", diagnosis: "Routine Checkup", notes: "Stable condition. BP 145/90." },
    ],
    prescriptions: [
      { medicine: "Amlodipine", dosage: "5mg", duration: "30 days", instructions: "Once daily at night" },
      { medicine: "Losartan", dosage: "50mg", duration: "30 days", instructions: "Once daily morning" },
    ],
    allergies: ["Penicillin"],
    chronic: ["Hypertension", "Type 2 Diabetes"],
    labs: [
      { test: "Complete Blood Count", date: "Apr 25, 2026", status: "completed" },
      { test: "HbA1c", date: "Apr 20, 2026", status: "completed" },
      { test: "Lipid Panel", date: "Apr 28, 2026", status: "pending" },
    ],
  },
  {
    id: 2, name: "Rohan Silva", age: 38, gender: "M", lastVisit: "Apr 25, 2026", condition: "Arrhythmia",
    history: [
      { date: "Apr 25, 2026", diagnosis: "Paroxysmal AF", notes: "ECG confirmed. Starting anticoagulation therapy." },
    ],
    prescriptions: [
      { medicine: "Warfarin", dosage: "5mg", duration: "90 days", instructions: "Once daily, monitor INR weekly" },
    ],
    allergies: [],
    chronic: ["Atrial Fibrillation"],
    labs: [
      { test: "ECG", date: "Apr 25, 2026", status: "completed" },
      { test: "INR / PT", date: "Apr 25, 2026", status: "pending" },
    ],
  },
  {
    id: 3, name: "Amara Wickramasinghe", age: 65, gender: "F", lastVisit: "Apr 18, 2026", condition: "CHD",
    history: [
      { date: "Apr 18, 2026", diagnosis: "Coronary Heart Disease", notes: "Stable angina. Stress test ordered." },
      { date: "Feb 05, 2026", diagnosis: "Chest pain evaluation", notes: "No acute event. Medication continued." },
    ],
    prescriptions: [
      { medicine: "Aspirin", dosage: "81mg", duration: "Ongoing", instructions: "Once daily with food" },
      { medicine: "Metoprolol", dosage: "25mg", duration: "60 days", instructions: "Twice daily" },
    ],
    allergies: ["Sulfa drugs"],
    chronic: ["CHD", "Hyperlipidemia"],
    labs: [
      { test: "Stress Echocardiogram", date: "Apr 30, 2026", status: "pending" },
      { test: "Troponin I", date: "Apr 18, 2026", status: "completed" },
    ],
  },
  {
    id: 4, name: "Dev Jayasuriya", age: 44, gender: "M", lastVisit: "Mar 30, 2026", condition: "Hypertension",
    history: [
      { date: "Mar 30, 2026", diagnosis: "Essential Hypertension", notes: "New onset. Lifestyle modifications advised." },
    ],
    prescriptions: [
      { medicine: "Hydrochlorothiazide", dosage: "12.5mg", duration: "60 days", instructions: "Once daily morning" },
    ],
    allergies: [],
    chronic: ["Hypertension"],
    labs: [{ test: "Renal Function Test", date: "Apr 02, 2026", status: "completed" }],
  },
];

const NOTIFICATIONS = [
  { id: 1, type: "appointment", text: "New appointment request from Sameer Bandara", time: "2 min ago", unread: true },
  { id: 2, type: "lab", text: "Lab results ready for Nalini Perera — CBC", time: "15 min ago", unread: true },
  { id: 3, type: "message", text: "Message from Rohan Silva re: medication query", time: "1 hr ago", unread: true },
  { id: 4, type: "appointment", text: "Priya Fernando cancelled her 2:00 PM appointment", time: "2 hr ago", unread: false },
  { id: 5, type: "lab", text: "Echocardiogram report uploaded for Amara W.", time: "3 hr ago", unread: false },
];

const MESSAGES = {
  2: [
    { from: "patient", text: "Dr. Mehta, I've been feeling occasional palpitations even after taking the medication.", time: "10:15 AM" },
    { from: "doctor", text: "I understand. How frequent are these episodes? More than 3 times a day?", time: "10:22 AM" },
    { from: "patient", text: "About 2-3 times. Each lasting 30 seconds or so.", time: "10:25 AM" },
    { from: "doctor", text: "Noted. Please continue your current dose and we'll review your ECG at today's session.", time: "10:28 AM" },
  ],
  3: [
    { from: "patient", text: "Good morning Doctor. I'll be there for my 11 AM appointment.", time: "8:05 AM" },
    { from: "doctor", text: "Good morning Amara. Please bring your previous reports.", time: "8:30 AM" },
  ],
};

const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const avatarColor = (name) => {
  const colors = ["#1D9E75","#378ADD","#D85A30","#7F77DD","#BA7517","#D4537E","#639922"];
  let hash = 0;
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;
  return colors[Math.abs(hash)];
};

const Badge = ({ status }) => {
  const map = {
    waiting: { bg: "#FFF3CD", color: "#856404", label: "Waiting" },
    completed: { bg: "#D1EDDA", color: "#155724", label: "Completed" },
    cancelled: { bg: "#F8D7DA", color: "#721C24", label: "Cancelled" },
    pending: { bg: "#FFF3CD", color: "#856404", label: "Pending" },
    online: { bg: "#D1ECF1", color: "#0C5460", label: "Online" },
    "in-person": { bg: "#E9ECEF", color: "#495057", label: "In-Person" },
  };
  const s = map[status] || { bg: "#eee", color: "#333", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const Avatar = ({ name, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: avatarColor(name),
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
    letterSpacing: "0.03em",
  }}>
    {initials(name)}
  </div>
);

const TAB_STYLE = (active) => ({
  padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
  background: active ? "#0F6E56" : "transparent",
  color: active ? "#fff" : "#555",
  border: "none", transition: "all 0.15s",
});

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [availability, setAvailability] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatPatientId, setChatPatientId] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [activePatientTab, setActivePatientTab] = useState("history");
  const [prescribeModal, setPrescribeModal] = useState(null);
  const [newRx, setNewRx] = useState({ medicine: "", dosage: "", duration: "", instructions: "" });
  const [notes, setNotes] = useState({});
  const [labComments, setLabComments] = useState({});
  const [settingsMode, setSettingsMode] = useState(false);
     const navigate = useNavigate();
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const handleAppointmentAction = (id, action) => {
    setAppointments(prev => prev.map(a => {
      if (a.id !== id) return a;
      if (action === "complete") return { ...a, status: "completed" };
      if (action === "cancel") return { ...a, status: "cancelled" };
      return a;
    }));
  };

  const sendMessage = (patientId) => {
    if (!chatInput.trim()) return;
    setMessages(prev => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), { from: "doctor", text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }],
    }));
    setChatInput("");
  };

  const patient = selectedPatient ? PATIENTS.find(p => p.id === selectedPatient) : null;
  const chatPatient = chatPatientId ? PATIENTS.find(p => p.id === chatPatientId) : null;

  const navItems = [
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "patients", label: "Patients", icon: "👤" },
    { id: "labs", label: "Lab Reports", icon: "🧪" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const completed = appointments.filter(a => a.status === "completed").length;
  const waiting = appointments.filter(a => a.status === "waiting").length;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F4F6F9", fontSize: 14, color: "#1a1a2e", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={{ width: 220, background: "#0A3D2E", display: "flex", flexDirection: "column", padding: "0 0 16px", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar name={DOCTOR.name} size={42} />
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{DOCTOR.name}</div>
              <div style={{ color: "#5DCAA5", fontSize: 11 }}>{DOCTOR.specialization}</div>
            </div>
          </div>
          <div
            onClick={() => setAvailability(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "5px 10px", borderRadius: 20, background: availability ? "rgba(93,202,165,0.15)" : "rgba(255,255,255,0.08)", width: "fit-content" }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: availability ? "#5DCAA5" : "#aaa" }} />
            <span style={{ fontSize: 11, color: availability ? "#5DCAA5" : "#aaa", fontWeight: 500 }}>
              {availability ? "Available" : "Offline"}
            </span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedPatient(null); setChatPatientId(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
                cursor: "pointer", marginBottom: 2,
                background: activeTab === item.id ? "rgba(93,202,165,0.15)" : "transparent",
                color: activeTab === item.id ? "#5DCAA5" : "rgba(255,255,255,0.65)",
                fontWeight: activeTab === item.id ? 600 : 400,
                fontSize: 13, transition: "all 0.12s",
              }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{DOCTOR.hospital}</div>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginTop: 2 }}>Today: {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <header style={{ background: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EAEDF0", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#0A3D2E" }}>
              {navItems.find(n => n.id === activeTab)?.label || "Dashboard"}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>
              {completed} completed · {waiting} pending today
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                style={{ background: "none", border: "1.5px solid #ddd", borderRadius: 10, padding: "7px 12px", cursor: "pointer", fontSize: 16, position: "relative", color: "#333" }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: 3, right: 3, background: "#E24B4A", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: 46, width: 320, background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #EAEDF0", zIndex: 100 }}>
                  <div style={{ padding: "14px 16px 10px", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #EAEDF0", color: "#0A3D2E" }}>Notifications</div>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} style={{ padding: "10px 16px", display: "flex", gap: 10, alignItems: "flex-start", background: n.unread ? "#F7FBF9" : "transparent", borderBottom: "1px solid #F5F5F5" }}>
                      <div style={{ fontSize: 16 }}>{n.type === "appointment" ? "📅" : n.type === "lab" ? "🧪" : "💬"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#333", lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{n.time}</div>
                      </div>
                      {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1D9E75", flexShrink: 0, marginTop: 5 }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Avatar name={DOCTOR.name} size={36} />
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: 24 }}>

          {/* APPOINTMENTS */}
          {activeTab === "appointments" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total Today", val: appointments.length, color: "#0A3D2E" },
                  { label: "Completed", val: completed, color: "#1D9E75" },
                  { label: "Pending", val: waiting, color: "#BA7517" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #EAEDF0" }}>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAEDF0", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #EAEDF0", fontWeight: 600, fontSize: 14, color: "#0A3D2E" }}>Today's Schedule</div>
                {appointments.map(apt => (
                  <div key={apt.id} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #F5F5F5" }}>
                    <Avatar name={apt.patient} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{apt.patient}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{apt.time} · Age {apt.age} · {apt.gender === "F" ? "Female" : "Male"}</div>
                    </div>
                    <Badge status={apt.type} />
                    <Badge status={apt.status} />
                    <div style={{ display: "flex", gap: 8 }}>
                      {apt.status === "waiting" && (
                        <>
                          <button
                            onClick={() => { setChatPatientId(PATIENTS.find(p => p.name === apt.patient)?.id); setActiveTab("messages"); }}
                            style={{ padding: "5px 12px", borderRadius: 8, border: "1.5px solid #0F6E56", color: "#0F6E56", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                          >Start</button>
                          <button
                            onClick={() => handleAppointmentAction(apt.id, "complete")}
                            style={{ padding: "5px 12px", borderRadius: 8, border: "1.5px solid #1D9E75", color: "#fff", background: "#1D9E75", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                          >Complete</button>
                          <button
                            onClick={() => handleAppointmentAction(apt.id, "cancel")}
                            style={{ padding: "5px 12px", borderRadius: 8, border: "1.5px solid #E24B4A", color: "#E24B4A", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                          >Cancel</button>
                        </>
                      )}
                      <button
                        onClick={() => { setSelectedPatient(PATIENTS.find(p => p.name === apt.patient)?.id); setActiveTab("patients"); }}
                        style={{ padding: "5px 12px", borderRadius: 8, border: "1.5px solid #ddd", color: "#555", background: "transparent", cursor: "pointer", fontSize: 12 }}
                      >Record</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PATIENTS */}
          {activeTab === "patients" && !selectedPatient && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: "#0A3D2E" }}>All Patients ({PATIENTS.length})</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {PATIENTS.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatient(p.id)}
                    style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #EAEDF0", cursor: "pointer", transition: "box-shadow 0.15s", display: "flex", alignItems: "center", gap: 14 }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                  >
                    <Avatar name={p.name} size={44} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Age {p.age} · {p.gender === "F" ? "Female" : "Male"}</div>
                      <div style={{ fontSize: 12, color: "#0F6E56", marginTop: 3 }}>{p.condition}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#aaa" }}>Last visit</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 1 }}>{p.lastVisit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PATIENT DETAIL */}
          {activeTab === "patients" && selectedPatient && patient && (
            <div>
              <button onClick={() => setSelectedPatient(null)} style={{ background: "none", border: "none", color: "#0F6E56", cursor: "pointer", fontWeight: 600, fontSize: 13, marginBottom: 16, padding: 0 }}>
                ← Back to Patients
              </button>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAEDF0", marginBottom: 16, overflow: "hidden" }}>
                <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, background: "#F7FBF9" }}>
                  <Avatar name={patient.name} size={52} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{patient.name}</div>
                    <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>Age {patient.age} · {patient.gender === "F" ? "Female" : "Male"} · Last visit: {patient.lastVisit}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      {patient.chronic.map(c => <span key={c} style={{ background: "#D1EDDA", color: "#155724", fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>{c}</span>)}
                      {patient.allergies.map(a => <span key={a} style={{ background: "#F8D7DA", color: "#721C24", fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>⚠ {a}</span>)}
                    </div>
                  </div>
                  <button
                    onClick={() => { setChatPatientId(patient.id); setActiveTab("messages"); }}
                    style={{ padding: "7px 14px", borderRadius: 8, background: "#0A3D2E", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                  >Message Patient</button>
                </div>
                <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid #EAEDF0" }}>
                  {["history", "prescriptions", "labs"].map(t => (
                    <button key={t} onClick={() => setActivePatientTab(t)} style={{ ...TAB_STYLE(activePatientTab === t), marginRight: 4, marginTop: 8, marginBottom: 0, textTransform: "capitalize" }}>{t}</button>
                  ))}
                </div>
                <div style={{ padding: 20 }}>
                  {activePatientTab === "history" && (
                    <div>
                      {patient.history.map((h, i) => (
                        <div key={i} style={{ borderLeft: "3px solid #1D9E75", paddingLeft: 14, marginBottom: 16 }}>
                          <div style={{ fontSize: 12, color: "#888" }}>{h.date}</div>
                          <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{h.diagnosis}</div>
                          <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>{h.notes}</div>
                        </div>
                      ))}
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0A3D2E", marginBottom: 6 }}>Add session note</div>
                        <textarea
                          placeholder="Write consultation notes..."
                          value={notes[patient.id] || ""}
                          onChange={e => setNotes(n => ({ ...n, [patient.id]: e.target.value }))}
                          style={{ width: "100%", height: 80, borderRadius: 8, border: "1px solid #ddd", padding: 10, fontSize: 13, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                        />
                        <button style={{ marginTop: 6, padding: "6px 14px", background: "#0A3D2E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Save Note</button>
                      </div>
                    </div>
                  )}
                  {activePatientTab === "prescriptions" && (
                    <div>
                      {patient.prescriptions.map((rx, i) => (
                        <div key={i} style={{ background: "#F7FBF9", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #d4ede3" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>💊 {rx.medicine}</div>
                            <span style={{ background: "#D1EDDA", color: "#155724", fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>{rx.dosage}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#666", marginTop: 5 }}>{rx.instructions}</div>
                          <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Duration: {rx.duration}</div>
                        </div>
                      ))}
                      <button
                        onClick={() => setPrescribeModal(patient.id)}
                        style={{ padding: "8px 16px", background: "#0A3D2E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, marginTop: 4 }}
                      >+ New Prescription</button>
                    </div>
                  )}
                  {activePatientTab === "labs" && (
                    <div>
                      {patient.labs.map((lab, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
                          <div style={{ fontSize: 18 }}>🧪</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{lab.test}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>{lab.date}</div>
                            <input
                              placeholder="Add comment..."
                              value={labComments[`${patient.id}-${i}`] || ""}
                              onChange={e => setLabComments(c => ({ ...c, [`${patient.id}-${i}`]: e.target.value }))}
                              style={{ marginTop: 4, width: "100%", fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd", fontFamily: "inherit" }}
                            />
                          </div>
                          <Badge status={lab.status} />
                          {lab.status === "completed" && (
                            <button style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid #0F6E56", color: "#0F6E56", background: "transparent", cursor: "pointer", fontSize: 11 }}>View</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LAB REPORTS */}
          {activeTab === "labs" && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: "#0A3D2E" }}>All Lab Reports</div>
              <button onClick={()=>navigate("/MedicalReport")} className="btn-secondary">
                ADD REPOST
              </button>
              
            </div>
          )}

          {/* PRESCRIPTIONS */}
          {activeTab === "prescriptions" && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: "#0A3D2E" }}>All Prescriptions</div>
              {PATIENTS.map(p => p.prescriptions.length > 0 && (
                <div key={p.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAEDF0", marginBottom: 14, overflow: "hidden" }}>
                  <div style={{ padding: "12px 18px", borderBottom: "1px solid #EAEDF0", display: "flex", alignItems: "center", gap: 10, background: "#F7FBF9" }}>
                    <Avatar name={p.name} size={30} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: "#888" }}>Age {p.age}</span>
                  </div>
                  <div style={{ padding: "12px 18px" }}>
                    {p.prescriptions.map((rx, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < p.prescriptions.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                        <div style={{ fontSize: 18 }}>💊</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{rx.medicine} <span style={{ background: "#D1EDDA", color: "#155724", fontSize: 11, padding: "1px 7px", borderRadius: 20, fontWeight: 400, marginLeft: 4 }}>{rx.dosage}</span></div>
                          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{rx.instructions} · {rx.duration}</div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setPrescribeModal(p.id)}
                      style={{ marginTop: 8, padding: "5px 12px", borderRadius: 8, border: "1.5px solid #0F6E56", color: "#0F6E56", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 600 }}
                    >+ Add Prescription</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Patients Today", val: appointments.length, icon: "👤", color: "#0A3D2E" },
                  { label: "Consultations Done", val: completed, icon: "✅", color: "#1D9E75" },
                  { label: "Pending", val: waiting, icon: "⏳", color: "#BA7517" },
                  { label: "Lab Reports", val: PATIENTS.flatMap(p => p.labs).length, icon: "🧪", color: "#378ADD" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #EAEDF0" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #EAEDF0" }}>
                  <div style={{ fontWeight: 600, marginBottom: 14, color: "#0A3D2E" }}>Appointment Status</div>
                  {[
                    { label: "Completed", count: completed, color: "#1D9E75" },
                    { label: "Waiting", count: waiting, color: "#BA7517" },
                    { label: "Cancelled", count: appointments.filter(a => a.status === "cancelled").length, color: "#E24B4A" },
                  ].map(s => (
                    <div key={s.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span>{s.label}</span><span style={{ fontWeight: 600 }}>{s.count}</span>
                      </div>
                      <div style={{ height: 7, background: "#F0F0F0", borderRadius: 4 }}>
                        <div style={{ height: "100%", background: s.color, borderRadius: 4, width: `${(s.count / appointments.length) * 100}%`, transition: "width 0.4s" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #EAEDF0" }}>
                  <div style={{ fontWeight: 600, marginBottom: 14, color: "#0A3D2E" }}>Visit Type</div>
                  {[
                    { label: "In-Person", count: appointments.filter(a => a.type === "in-person").length, color: "#378ADD" },
                    { label: "Online", count: appointments.filter(a => a.type === "online").length, color: "#7F77DD" },
                  ].map(s => (
                    <div key={s.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span>{s.label}</span><span style={{ fontWeight: 600 }}>{s.count}</span>
                      </div>
                      <div style={{ height: 7, background: "#F0F0F0", borderRadius: 4 }}>
                        <div style={{ height: "100%", background: s.color, borderRadius: 4, width: `${(s.count / appointments.length) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #F0F0F0" }}>
                    <div style={{ fontSize: 12, color: "#888" }}>Patient demographics</div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#D4537E" }}>{PATIENTS.filter(p => p.gender === "F").length}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>Female</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#378ADD" }}>{PATIENTS.filter(p => p.gender === "M").length}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>Male</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && !chatPatientId && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: "#0A3D2E" }}>Patient Conversations</div>
              {PATIENTS.map(p => (
                <div
                  key={p.id}
                  onClick={() => setChatPatientId(p.id)}
                  style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #EAEDF0", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F7FBF9"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <Avatar name={p.name} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>
                      {messages[p.id]?.slice(-1)[0]?.text?.slice(0, 55) || "No messages yet"}...
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{messages[p.id]?.slice(-1)[0]?.time || ""}</div>
                </div>
              ))}
            </div>
          )}

          {/* CHAT */}
          {activeTab === "messages" && chatPatientId && chatPatient && (
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <button onClick={() => setChatPatientId(null)} style={{ background: "none", border: "none", color: "#0F6E56", cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0 }}>← Back</button>
                <Avatar name={chatPatient.name} size={32} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{chatPatient.name}</span>
                <Badge status="online" />
              </div>
              <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid #EAEDF0", padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                {(messages[chatPatientId] || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.from === "doctor" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "65%", padding: "9px 14px", borderRadius: m.from === "doctor" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                      background: m.from === "doctor" ? "#0A3D2E" : "#F0F0F0",
                      color: m.from === "doctor" ? "#fff" : "#333",
                      fontSize: 13, lineHeight: 1.5,
                    }}>
                      {m.text}
                      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: "right" }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage(chatPatientId)}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13, fontFamily: "inherit" }}
                />
                <button
                  onClick={() => sendMessage(chatPatientId)}
                  style={{ padding: "10px 20px", background: "#0A3D2E", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                >Send</button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div style={{ maxWidth: 500 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #EAEDF0", padding: 24 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#0A3D2E", marginBottom: 18 }}>Profile Settings</div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Full name</label>
                  <input defaultValue={DOCTOR.name} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Specialization</label>
                  <input defaultValue={DOCTOR.specialization} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Availability</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["Available", "Busy", "Offline"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setAvailability(opt === "Available")}
                        style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${(opt === "Available" && availability) || (opt !== "Available" && !availability && opt === "Offline") ? "#0F6E56" : "#ddd"}`, cursor: "pointer", fontSize: 12, background: "transparent", color: "#333" }}
                      >{opt}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>New password</label>
                  <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <button style={{ padding: "9px 22px", background: "#0A3D2E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Save Changes</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Prescription Modal */}
      {prescribeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#0A3D2E" }}>New Prescription</div>
            {[
              { field: "medicine", label: "Medicine name" },
              { field: "dosage", label: "Dosage (e.g. 10mg)" },
              { field: "duration", label: "Duration (e.g. 30 days)" },
              { field: "instructions", label: "Instructions" },
            ].map(f => (
              <div key={f.field} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>{f.label}</label>
                <input
                  value={newRx[f.field]}
                  onChange={e => setNewRx(r => ({ ...r, [f.field]: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                onClick={() => { setPrescribeModal(null); setNewRx({ medicine: "", dosage: "", duration: "", instructions: "" }); }}
                style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid #ddd", background: "transparent", cursor: "pointer", fontSize: 13 }}
              >Cancel</button>
              <button
                onClick={() => { setPrescribeModal(null); setNewRx({ medicine: "", dosage: "", duration: "", instructions: "" }); }}
                style={{ flex: 1, padding: "9px", borderRadius: 8, background: "#0A3D2E", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
              >Issue Prescription</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}