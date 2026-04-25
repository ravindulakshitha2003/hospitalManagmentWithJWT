import "../styles/Sidebar.css";

export default function Sidebar({ doctor, activeTab, setActiveTab, availability, setAvailability, setSelectedPatient, setChatPatientId }) {
  const navItems = [
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "patients", label: "Patients", icon: "👤" },
    { id: "labs", label: "Lab Reports", icon: "🧪" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setSelectedPatient(null);
    setChatPatientId(null);
  };

  const Avatar = ({ name, size = 36 }) => {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["#1D9E75","#378ADD","#D85A30","#7F77DD","#BA7517","#D4537E","#639922"];
    let hash = 0;
    for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;
    const bgColor = colors[Math.abs(hash)];
    return (
      <div className="sidebar-avatar" style={{ width: size, height: size, background: bgColor }}>
        {initials}
      </div>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Avatar name={doctor.name} size={42} />
        <div className="doctor-info">
          <div className="doctor-name">{doctor.name}</div>
          <div className="doctor-specialty">{doctor.specialization}</div>
        </div>
        <div
          onClick={() => setAvailability(v => !v)}
          className={`availability-badge ${availability ? "available" : "offline"}`}
        >
          <div className={`availability-dot ${availability ? "available" : "offline"}`} />
          <span>{availability ? "Available" : "Offline"}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="hospital-name">{doctor.hospital}</div>
        <div className="today-date">
          Today: {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </div>
    </aside>
  );
}