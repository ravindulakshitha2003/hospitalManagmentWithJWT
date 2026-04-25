// App.js
import { useState ,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PaymentModal from "../components/PaymentModal";
import appointmentService from "../services/appointmentService";
import "../styles/Userdashbord.css";

// Data
const patient = {
  name: "Ashan Perera",
  dob: "1990-03-15",
  age: 34,
  gender: "Male",
  blood: "B+",
  phone: "+94 77 123 4567",
  email: "ashan.perera@email.com",
  address: "45 Galle Road, Colombo 03",
  emergency: { name: "Nimal Perera", relation: "Brother", phone: "+94 71 987 6543" },
  avatar: "AP",
};




// var  upcomingAppts = [
//   { id: 1, doctor: "Dr. Samantha Silva", dept: "Cardiology", date: "2026-04-28", time: "10:00 AM", status: "confirmed", online: false },
//   { id: 2, doctor: "Dr. Rohan Fernando", dept: "Neurology", date: "2026-05-05", time: "02:30 PM", status: "pending", online: false },
//   { id: 3, doctor: "Dr. Priya Wijesinghe", dept: "Dermatology", date: "2026-05-12", time: "11:00 AM", status: "confirmed", online: false },
// ];

const pastAppts = [
  { id: 1, doctor: "Dr. Samantha Silva", dept: "Cardiology", date: "2026-04-10", diagnosis: "Hypertension Stage 1", prescription: "Amlodipine 5mg, Losartan 50mg" },
  { id: 2, doctor: "Dr. Kavitha Nair", dept: "General Medicine", date: "2026-03-22", diagnosis: "Viral Upper Respiratory Infection", prescription: "Paracetamol 500mg, Cetirizine 10mg" },
  { id: 3, doctor: "Dr. Rohan Fernando", dept: "Neurology", date: "2026-02-14", diagnosis: "Tension Headache", prescription: "Ibuprofen 400mg, Amitriptyline 10mg" },
];

const medications = [
  { id: 1, name: "Amlodipine", dose: "5mg", freq: "Once daily", duration: "Ongoing", instruction: "After meals", reminder: true, color: "#185FA5" },
  { id: 2, name: "Losartan", dose: "50mg", freq: "Once daily", duration: "Ongoing", instruction: "Morning", reminder: true, color: "#0F6E56" },
  { id: 3, name: "Vitamin D3", dose: "1000 IU", freq: "Once daily", duration: "3 months", instruction: "After breakfast", reminder: false, color: "#854F0B" },
  { id: 4, name: "Omega-3", dose: "1000mg", freq: "Twice daily", duration: "6 months", instruction: "With meals", reminder: false, color: "#993556" },
];

const labReports = [
  { id: 1, test: "Complete Blood Count", date: "2026-04-10", status: "completed", doctor: "Dr. Samantha Silva" },
  { id: 2, test: "Lipid Profile", date: "2026-04-10", status: "completed", doctor: "Dr. Samantha Silva" },
  { id: 3, test: "HbA1c", date: "2026-04-15", status: "pending", doctor: "Dr. Kavitha Nair" },
  { id: 4, test: "Thyroid Function Test", date: "2026-04-20", status: "completed", doctor: "Dr. Rohan Fernando" },
  { id: 5, test: "Urine Analysis", date: "2026-04-22", status: "processing", doctor: "Dr. Priya Wijesinghe" },
];

const bills = [
  { id: "INV-2026-001", date: "2026-04-10", desc: "Cardiology Consultation + CBC", amount: 6500, paid: true },
  { id: "INV-2026-002", date: "2026-03-22", desc: "General Medicine + Medication", amount: 3200, paid: true },
  { id: "INV-2026-003", date: "2026-02-14", desc: "Neurology Consultation", amount: 5000, paid: false },
  { id: "INV-2026-004", date: "2026-04-22", desc: "Dermatology Screening", amount: 4500, paid: false },
];

const notifications = [
  { id: 1, type: "appointment", msg: "Appointment with Dr. Samantha Silva on Apr 28 at 10:00 AM", time: "2h ago", read: false },
  { id: 2, type: "report", msg: "Your Thyroid Function Test results are ready", time: "5h ago", read: false },
  { id: 3, type: "medication", msg: "Time to take your Amlodipine 5mg", time: "8h ago", read: true },
  { id: 4, type: "message", msg: "Dr. Rohan Fernando sent you a message", time: "1d ago", read: true },
  { id: 5, type: "billing", msg: "Payment of LKR 3,200 confirmed", time: "2d ago", read: true },
];

const vitals = [
  { label: "Blood Pressure", value: "128/82", unit: "mmHg", trend: "stable", icon: "♥" },
  { label: "Heart Rate", value: "74", unit: "bpm", trend: "normal", icon: "⚡" },
  { label: "BMI", value: "24.2", unit: "kg/m²", trend: "normal", icon: "◉" },
  { label: "Blood Sugar", value: "98", unit: "mg/dL", trend: "normal", icon: "◈" },
];

const statusColors = {
  confirmed: { bg: "#EAF3DE", text: "#3B6D11", label: "Confirmed" },
  pending: { bg: "#FAEEDA", text: "#854F0B", label: "Pending" },
  cancelled: { bg: "#FCEBEB", text: "#A32D2D", label: "Cancelled" },
  completed: { bg: "#E1F5EE", text: "#0F6E56", label: "Completed" },
  processing: { bg: "#E6F1FB", text: "#185FA5", label: "Processing" },
};

const SECTIONS = ["overview", "appointments", "history", "medications", "reports", "billing", "profile"];

const navItems = [
  { key: "overview", label: "Overview", icon: "⊞" },
  { key: "appointments", label: "Appointments", icon: "📅" },
  { key: "history", label: "History", icon: "📋" },
  { key: "medications", label: "Medications", icon: "💊" },
  { key: "reports", label: "Lab Reports", icon: "🧪" },
  { key: "billing", label: "Billing", icon: "💳" },
  { key: "profile", label: "Profile", icon: "👤" },
];

// Utility Components
function Badge({ status }) {
  const c = statusColors[status] || statusColors.pending;
  return (
    <span className="badge" style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  );
}

function Avatar({ initials, size = 40, bg = "#185FA5", color = "#fff" }) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: bg,
        color,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
}

function SectionTitle({ title, action }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && (
        <button onClick={action.onClick} className="section-action">
          {action.label}
        </button>
      )}
    </div>
  );
}

// Main Component
export default function UserDashboard() {
  const [paymentOpen, setPaymentOpen] = useState(false);
const [selectedBill, setSelectedBill] = useState(null);
   const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications2, setNotifications2] = useState(notifications);
  const [respondAppoinmnt ,setrespondAppoinmnt ] = useState({})
  const [appts, setAppts] = useState({});
  const [meds, setMeds] = useState(medications);
  const [reminderMsg, setReminderMsg] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({ ...patient });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { from: "doctor", text: "Good morning! How are you feeling today?" },
  ]);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookForm, setBookForm] = useState({ doctor: "", dept: "", date: "", time: "", type: "in-person" });

  const unreadCount = notifications2.filter(n => !n.read).length;
  const totalBilled = bills.reduce((a, b) => a + b.amount, 0);
  const totalPaid = bills.filter(b => b.paid).reduce((a, b) => a + b.amount, 0);
  const totalUnpaid = totalBilled - totalPaid;
  

  var  upcomingAppts5 = [
  { id: 1, doctor: "Dr. Samantha Silva", dept: "Cardiology", date: "2026-04-28", time: "10:00 AM", status: "confirmed", online: false },
  { id: 2, doctor: "Dr. Rohan Fernando", dept: "Neurology", date: "2026-05-05", time: "02:30 PM", status: "pending", online: false },
  { id: 3, doctor: "Dr. Priya Wijesinghe", dept: "Dermatology", date: "2026-05-12", time: "11:00 AM", status: "confirmed", online: false },
];
  
  // fetch allapoinmnet data 


   
  
    useEffect(() => {
      const fetchappointment = async () => {
        try {
          const data = await appointmentService.allappoinment("ravindu");
           setrespondAppoinmnt(data);
          const mapped = data.map(item => ({
            id: item.id,
            doctor: item.docter,          // backend typo fixed here
            dept: "General",              // or map if backend has it
            date: item.date || "N/A",    // handle null safely
            time: item.time,
            status: item.status ? "confirmed" : "pending",
            online: item.visitType === "online"

      }
      
    )
  );
      setAppts(mapped)
      console.log(mapped)




        } catch (error) {
          console.error(error);
        }
      };
  
      fetchappointment();
        }, []);




  function markAllRead() {
    setNotifications2(prev => prev.map(n => ({ ...n, read: true })));
  }

  function cancelAppt(id) {
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
  }

  function toggleReminder(id) {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, reminder: !m.reminder } : m));
    const med = meds.find(m => m.id === id);
    setReminderMsg(med ? (med.reminder ? `Reminder disabled for ${med.name}` : `Reminder enabled for ${med.name}`) : null);
    setTimeout(() => setReminderMsg(null), 2500);
  }

  function sendChat() {
    if (!chatMsg.trim()) return;
    setChatHistory(prev => [...prev, { from: "patient", text: chatMsg }]);
    setChatMsg("");
    setTimeout(() => {
      setChatHistory(prev => [...prev, { from: "doctor", text: "Thank you for your message. I'll review and get back to you shortly." }]);
    }, 1200);
  }

  function bookAppt() {
    if (!bookForm.doctor || !bookForm.date || !bookForm.time) return;
    const newAppt = {
      id: Date.now(),
      doctor: bookForm.doctor,
      dept: bookForm.dept || "General Medicine",
      date: bookForm.date,
      time: bookForm.time,
      status: "pending",
      online: bookForm.type === "online",
    };
    setAppts(prev => [newAppt, ...prev]);
    setBookOpen(false);
    setBookForm({ doctor: "", dept: "", date: "", time: "", type: "in-person" });
    setSection("appointments");
  }

  return (
    
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo">H</div>
          {sidebarOpen && <span>MediCare HMS</span>}
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`nav-item ${section === item.key ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
         
        </nav>
        <button onClick={() => setSidebarOpen(p => !p)} className="sidebar-toggle">
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* Main content */}
      <div className="main-container">
        {/* Top bar */}
        <div className="top-bar">
          <div>
            <h1 className="page-title">{navItems.find(n => n.key === section)?.label}</h1>
            <p className="page-date">Patient Portal — {new Date().toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="top-actions">
             <button onClick={() =>  navigate('/MedicalReport')} className="btn-primary">+ create report</button>
            <button onClick={() =>  navigate('/CreateAppointment')} className="btn-primary">
              + Book Appointment
            </button>
            <button onClick={() => setChatOpen(p => !p)} className="btn-secondary">
              💬 Chat
            </button>
            <div className="notif-wrapper">
              <button onClick={() => setNotifOpen(p => !p)} className="btn-secondary">
                🔔
              </button>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </div>
            <Avatar initials={patient.avatar} size={36} />
          </div>
        </div>

        {/* Notification Dropdown */}
        {notifOpen && (
          <div className="notif-dropdown">
            <div className="notif-header">
              <span>Notifications</span>
              <button onClick={markAllRead} className="notif-mark-read">Mark all read</button>
            </div>
            {notifications2.map(n => (
              <div
                key={n.id}
                onClick={() => setNotifications2(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                className={`notif-item ${!n.read ? "unread" : ""}`}
              >
                <p>{n.msg}</p>
                <p className="notif-time">{n.time}</p>
              </div>
            ))}
          </div>
        )}

        {paymentOpen && selectedBill && (
  <PaymentModal
    bill={selectedBill}
    onClose={() => setPaymentOpen(false)}
    onSuccess={(billId) => {
      // update bill as paid
      
      
    }}
  />
)}

        {/* Chat Panel */}
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <span>Dr. Samantha Silva</span>
              <button onClick={() => setChatOpen(false)} className="chat-close">✕</button>
            </div>
            <div className="chat-messages">
              {chatHistory.map((m, i) => (
                <div key={i} className={`chat-message ${m.from === "patient" ? "outgoing" : "incoming"}`}>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="chat-input-area">
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Type a message..."
              />
              <button onClick={sendChat} className="btn-primary">Send</button>
            </div>
          </div>
        )}

        {/* Book Appointment Modal */}
        {bookOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Book Appointment</h3>
                <button onClick={() =>  navigate('/CreateAppointment')} className="modal-close">✕</button>
              </div>
              {[
                { label: "Doctor Name", key: "doctor", type: "text", placeholder: "Dr. ..." },
                { label: "Department", key: "dept", type: "text", placeholder: "e.g. Cardiology" },
                { label: "Date", key: "date", type: "date" },
                { label: "Time", key: "time", type: "time" },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder || ""}
                    value={bookForm[f.key]}
                    onChange={e => setBookForm(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Consultation Type</label>
                <select value={bookForm.type} onChange={e => setBookForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="in-person">In-person</option>
                  <option value="online">Online / Telemedicine</option>
                </select>
              </div>
              <button onClick={bookAppt} className="btn-primary full-width">Confirm Booking</button>
            </div>
          </div>
        )}

        {/* Toast */}
        {reminderMsg && <div className="toast">{reminderMsg}</div>}

        {/* Scrollable body */}
        <div className="content-area">
          {/* OVERVIEW */}
          {section === "overview" && (
            <div>
              <Card className="patient-bar">
                <Avatar initials={patient.avatar} size={52} bg="#185FA5" />
                <div className="patient-info">
                  <p className="patient-name">{patient.name}</p>
                  <p className="patient-details">Age {patient.age} · {patient.gender} · Blood: <strong>{patient.blood}</strong></p>
                </div>
                <div className="vitals-list">
                  {vitals.map(v => (
                    <div key={v.label} className="vital-item">
                      <p>{v.label}</p>
                      <p>{v.value} <span>{v.unit}</span></p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="stats-grid">
                {/* {[
                  { label: "Upcoming Appts", value: appts.filter(a => a.status !== "cancelled").length, color: "#185FA5", bg: "#E6F1FB" },
                  { label: "Active Meds", value: meds.length, color: "#0F6E56", bg: "#E1F5EE" },
                  { label: "Pending Reports", value: labReports.filter(r => r.status !== "completed").length, color: "#854F0B", bg: "#FAEEDA" },
                  { label: "Unpaid Bills", value: `LKR ${totalUnpaid.toLocaleString()}`, color: "#A32D2D", bg: "#FCEBEB" },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{ background: s.bg, borderColor: `${s.color}22` }}>
                    <p style={{ color: s.color }}>{s.label}</p>
                    <p style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))} */}
              </div>

              <div className="two-columns">
                <Card>
                  <SectionTitle title="Upcoming Appointments" action={{ label: "View all →", onClick: () => setSection("appointments") }} />
                  {/* {appts.filter(a => a.status !== "cancelled").slice(0, 2).map(a => (
                    <div key={a.id} className="appt-item">
                      <div className="appt-date">
                        <span>{new Date(a.date).toLocaleDateString("en", { day: "2-digit" })}</span>
                        <span>{new Date(a.date).toLocaleDateString("en", { month: "short" })}</span>
                      </div>
                      <div className="appt-details">
                        <p>{a.doctor}</p>
                        <p>{a.dept} · {a.time}</p>
                        <Badge status={a.status} />
                      </div>
                    </div>
                  ))} */}
                </Card>

                <Card>
                  <SectionTitle title="Current Medications" action={{ label: "View all →", onClick: () => setSection("medications") }} />
                  {meds.slice(0, 3).map(m => (
                    <div key={m.id} className="med-item">
                      <div className="med-dot" style={{ background: m.color }} />
                      <div className="med-info">
                        <p>{m.name} <span>{m.dose}</span></p>
                        <p>{m.freq} · {m.instruction}</p>
                      </div>
                      {m.reminder && <span className="reminder-badge">🔔 On</span>}
                    </div>
                  ))}
                </Card>
              </div>

              <Card>
                <SectionTitle title="Recent Alerts" action={{ label: "Mark all read", onClick: markAllRead }} />
                {notifications2.filter(n => !n.read).slice(0, 3).map(n => (
                  <div key={n.id} className="alert-item">
                    <span>{n.type === "appointment" ? "📅" : n.type === "report" ? "🧪" : n.type === "medication" ? "💊" : n.type === "billing" ? "💳" : "✉️"}</span>
                    <div>
                      <p>{n.msg}</p>
                      <p>{n.time}</p>
                    </div>
                  </div>
                ))}
                {notifications2.filter(n => !n.read).length === 0 && <p className="empty-message">No new notifications.</p>}
              </Card>
            </div>
          )}

          {/* APPOINTMENTS */}
          {section === "appointments" && (
            <div>
              <div className="section-actions">
                <button onClick={() =>  navigate('/CreateAppointment')} className="btn-primary">+ Book New Appointment</button>
              </div>
              
              <div className="appointments-list">
                {appts.map(a => (
                  <Card key={a.id} className="appointment-card">
                    <div className="appointment-date-box">
                       {/* <span>{new Date(a.date).toLocaleDateString("en", { day: "2-digit" })}</span> */}
                     <span>
                      {new Date(`1970-01-01T${a.time}`).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    </div>
                    <div className="appointment-info">
                      <p>{a.doctor}</p>
                      <p>{a.dept} · {a.time} {a.online && "· Online"}</p>
                      <Badge status={a.status} />
                    </div>
                    <div className="appointment-actions">
                      {a.online && a.status === "confirmed" && (
                        <button className="btn-primary small">Join Consultation</button>
                      )}
                      {a.status !== "cancelled" && (
                        <button onClick={() => cancelAppt(a.id)} className="btn-secondary small">Cancel</button>
                      )}
                      <button className="btn-secondary small">Reschedule</button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* HISTORY */}
          {section === "history" && (
            <div className="history-list">
              {pastAppts.map(a => (
                <Card key={a.id}>
                  <div className="history-header">
                    <div>
                      <p>{a.doctor}</p>
                      <p>{a.dept} · {new Date(a.date).toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <Badge status="completed" />
                  </div>
                  <div className="diagnosis-box">
                    <p>Diagnosis</p>
                    <p>{a.diagnosis}</p>
                  </div>
                  <div className="prescription-box">
                    <p>Prescription</p>
                    <p>{a.prescription}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* MEDICATIONS */}
          {section === "medications" && (
            <div>
              {reminderMsg && <div className="reminder-toast">{reminderMsg}</div>}
              <div className="medications-grid">
                {meds.map(m => (
                  <Card key={m.id} className="medication-card" style={{ borderLeftColor: m.color }}>
                    <div className="medication-header">
                      <div>
                        <p style={{ color: m.color }}>{m.name}</p>
                        <p>{m.dose}</p>
                      </div>
                      <button onClick={() => toggleReminder(m.id)} className={`reminder-toggle ${m.reminder ? "on" : "off"}`}>
                        🔔 {m.reminder ? "On" : "Off"}
                      </button>
                    </div>
                    <div className="medication-details">
                      <div>
                        <p>Frequency</p>
                        <p>{m.freq}</p>
                      </div>
                      <div>
                        <p>Duration</p>
                        <p>{m.duration}</p>
                      </div>
                      <div>
                        <p>Instructions</p>
                        <p>{m.instruction}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* LAB REPORTS */}
          {section === "reports" && (
            <div className="reports-list">
              {labReports.map(r => (
                <Card key={r.id} className="report-card">
                  <div className="report-icon">🧪</div>
                  <div className="report-info">
                    <p>{r.test}</p>
                    <p>{r.doctor} · {new Date(r.date).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <Badge status={r.status} />
                  {r.status === "completed" && (
                    <button className="download-btn">⬇ Download PDF</button>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* BILLING */}
          {section === "billing" && (
            <div>
              <div className="billing-summary">
                {[
                  { label: "Total Billed", value: `LKR ${totalBilled.toLocaleString()}`, bg: "#E6F1FB", text: "#185FA5" },
                  { label: "Total Paid", value: `LKR ${totalPaid.toLocaleString()}`, bg: "#EAF3DE", text: "#3B6D11" },
                  { label: "Outstanding", value: `LKR ${totalUnpaid.toLocaleString()}`, bg: "#FCEBEB", text: "#A32D2D" },
                ].map(s => (
                  <div key={s.label} className="summary-card" style={{ background: s.bg }}>
                    <p style={{ color: s.text }}>{s.label}</p>
                    <p style={{ color: s.text }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bills-list">
                {bills.map(b => (
                  <Card key={b.id} className="bill-card">
                    <div className="bill-info">
                      <p>{b.desc}</p>
                      <p>{b.id} · {new Date(b.date).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <p className="bill-amount">LKR {b.amount.toLocaleString()}</p>
                    <Badge status={b.paid ? "completed" : "pending"} />
                    <div className="bill-actions">
                      {!b.paid && <button
  className="btn-primary small"
  onClick={() => {
    setSelectedBill(b);
    setPaymentOpen(true);
  }}
>
  Pay Now
</button>}
                      <button className="btn-secondary small">⬇ Invoice</button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {section === "profile" && (
            <div className="profile-grid">
              <Card>
                <div className="profile-header">
                  <h2>Personal Information</h2>
                  <button onClick={() => setEditProfile(p => !p)} className="edit-btn">{editProfile ? "Save" : "Edit"}</button>
                </div>
                <div className="profile-avatar-area">
                  <Avatar initials={patient.avatar} size={60} />
                  <div>
                    <p>{profileData.name}</p>
                    <p>Patient ID: HMS-2026-0042</p>
                  </div>
                </div>
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Date of Birth", key: "dob" },
                  { label: "Gender", key: "gender" },
                  { label: "Blood Group", key: "blood" },
                  { label: "Phone", key: "phone" },
                  { label: "Email", key: "email" },
                  { label: "Address", key: "address" },
                ].map(f => (
                  <div key={f.key} className="profile-field">
                    <label>{f.label}</label>
                    {editProfile
                      ? <input value={profileData[f.key]} onChange={e => setProfileData(p => ({ ...p, [f.key]: e.target.value }))} />
                      : <p>{profileData[f.key]}</p>}
                  </div>
                ))}
              </Card>
              <div className="profile-sidebar">
                <Card>
                  <h2>Emergency Contact</h2>
                  {[
                    { label: "Name", value: patient.emergency.name },
                    { label: "Relation", value: patient.emergency.relation },
                    { label: "Phone", value: patient.emergency.phone },
                  ].map(f => (
                    <div key={f.label} className="contact-field">
                      <p>{f.label}</p>
                      <p>{f.value}</p>
                    </div>
                  ))}
                </Card>
                <Card>
                  <h2>Health Summary</h2>
                  {[
                    { label: "Chronic Conditions", value: "Hypertension Stage 1" },
                    { label: "Allergies", value: "None known" },
                    { label: "Last Checkup", value: "April 10, 2026" },
                  ].map(f => (
                    <div key={f.label} className="health-field">
                      <p>{f.label}</p>
                      <p>{f.value}</p>
                    </div>
                  ))}
                </Card>
                <Card>
                  <h2>Account Settings</h2>
                  <button className="settings-btn">🔒 Change Password</button>
                  <button className="settings-btn">📤 Upload Medical Records</button>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}