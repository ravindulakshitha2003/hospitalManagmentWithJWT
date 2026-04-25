import { useState } from "react";
import docterService from "../services/docterService";
import "../styles/MedicalReport.css";
  import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const departments = [
  "General Medicine", "Cardiology", "Neurology", "Orthopedics",
  "Pediatrics", "Dermatology", "ENT", "Ophthalmology", "Psychiatry"
];

const defaultForm = {
  patientName: "Ravindu Lakshitha",
  age: "24",
  gender: "Male",
  patientId: "HMS-2026-0042",
  date: "2026-04-25",
  doctorName: "Dr. Sarah Chen",
  department: "General Medicine",
  complaint: "Headache and mild fever for 2 days",
  temperature: "37.8",
  bloodPressure: "120/80",
  pulseRate: "78",
  diagnosis: "Viral Fever (Mild)",
  prescription: "Paracetamol 500mg – 2 times daily (after meals)\nDrink plenty of fluids\nRest for 2–3 days",
  notes: "If fever persists more than 3 days, revisit hospital\nAvoid cold drinks",
  followUp: "",
  severity: "mild",
};




export default function MedicalReport() {
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [report ,setReport] = useState({ });
    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setReport({
          patientName: form.patientName,
          age: parseInt(form.age),
          gender: form.gender,
          docter: form.doctorName,
          department: form.department,
          complaint:  form.complaint ,
          diagnosis: form.diagnosis,
              prescription: [],
          notes:  []
    })
  };

const showAlert = () => {toast.success("Appointment created successfully!");};
const showErrorAlert = () => {toast.error("there is an error");};


const submitReport = async () => {  
     try {
      const reqest = await docterService.createReport(report);
          if(reqest)showAlert()
          navigate('/doctor-dashboard');
        } catch (err) {showErrorAlert()};
   }
  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
     setReport({
          patientName: form.patientName,
          age: parseInt(form.age),
          gender: form.gender,
          docter: form.doctorName,
          department: form.department,
          complaint:  form.complaint ,
          diagnosis: form.diagnosis,
              prescription: [],
          notes:  []
    })
    setSubmitted(true);

    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };



  const sendReportDate = ()=>{
      submitReport(report);

  }


  const handleReset = () => {
    setSubmitted(false);
    setForm(defaultForm);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => window.print();

  if (submitted) {
    return (
      <div className="hms-root">
        <header className="hms-header">
          <div className="hms-header-inner">
            <div className="hms-logo">
              <span className="hms-logo-cross">✚</span>
              <div>
                <span className="hms-logo-title">MediCore HMS</span>
                <span className="hms-logo-sub">Hospital Management System</span>
              </div>
            </div>
            <div className="hms-header-actions">
              <button className="hms-btn hms-btn-ghost" onClick={handleReset}>← New Report</button>
              <button className="hms-btn hms-btn-primary" onClick={handlePrint}>⊞ Print / PDF</button>
            </div>
          </div>
        </header>

        <main className="hms-report-view">
          <div className="hms-report-card">
            <div className="hms-report-hero">
              <div className="hms-report-hero-text">
                <h1>Medical Report</h1>
                <p>Report submitted on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <div className={`hms-severity-badge `}>
                "sdsd"
              </div>
            </div>

            <div className="hms-report-grid">
              <section className="hms-report-section">
                <h2 className="hms-section-title"><span className="hms-icon">👤</span> Patient Information</h2>
                <div className="hms-info-grid">
                  <div className="hms-info-item"><span>Name</span><strong>{report.patientName}</strong></div>
                  <div className="hms-info-item"><span>Age</span><strong>{report.age} yrs</strong></div>
                  <div className="hms-info-item"><span>Gender</span><strong>{report.gender}</strong></div>
                  <div className="hms-info-item"><span>Patient ID</span><strong className="hms-id">{null}</strong></div>
                  <div className="hms-info-item"><span>Date</span><strong>{null}</strong></div>
                </div>
              </section>

              <section className="hms-report-section">
                <h2 className="hms-section-title"><span className="hms-icon">🩺</span> Doctor Information</h2>
                <div className="hms-info-grid">
                  <div className="hms-info-item"><span>Doctor</span><strong>{report.doctorName}</strong></div>
                  <div className="hms-info-item"><span>Department</span><strong>{report.department}</strong></div>
                </div>
              </section>

              <section className="hms-report-section hms-full-width">
                <h2 className="hms-section-title"><span className="hms-icon">📋</span> Chief Complaint</h2>
                <p className="hms-complaint-text">{report.complaint}</p>
              </section>

              <section className="hms-report-section">
                <h2 className="hms-section-title"><span className="hms-icon">🔍</span> Examination Findings</h2>
                <div className="hms-vitals-grid">
                  <div className="hms-vital-card">
                    <span className="hms-vital-icon">🌡️</span>
                    <span className="hms-vital-value">°C</span>
                    <span className="hms-vital-label">Temperature</span>
                  </div>
                  <div className="hms-vital-card">
                    <span className="hms-vital-icon">❤️</span>
                    <span className="hms-vital-value">{10}</span>
                    <span className="hms-vital-label">Blood Pressure</span>
                  </div>
                  <div className="hms-vital-card">
                    <span className="hms-vital-icon">💓</span>
                    <span className="hms-vital-value">{10} bpm</span>
                    <span className="hms-vital-label">Pulse Rate</span>
                  </div>
                </div>
              </section>

              <section className="hms-report-section">
                <h2 className="hms-section-title"><span className="hms-icon">🧪</span> Diagnosis</h2>
                <div className="hms-diagnosis-box">{report.diagnosis}</div>
              </section>

              <section className="hms-report-section hms-full-width">
                <h2 className="hms-section-title"><span className="hms-icon">💊</span> Prescription</h2>
                <ul className="hms-prescription-list">
                  {report.prescription.filter(Boolean).map((rx, i) => (
                    <li key={i}>{rx}</li>
                  ))}
                </ul>
              </section>

              {form.notes && (
                <section className="hms-report-section hms-full-width">
                  <h2 className="hms-section-title"><span className="hms-icon">🧾</span> Additional Notes</h2>
                  <ul className="hms-notes-list">
                    {report.notes.filter(Boolean).map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </section>
              )}

              {form.followUp && (
                <section className="hms-report-section hms-full-width">
                  <h2 className="hms-section-title"><span className="hms-icon">📅</span> Follow-up</h2>
                  <p className="hms-followup-text">Next visit: <strong>{form.followUp}</strong></p>
                </section>
              )}
            </div>

            <div className="hms-report-footer">
              <div className="hms-signature">
                <div className="hms-sig-line"></div>
                <p>{report.doctorName}</p>
                <p>{report.department}</p>
              </div>
              <div className="hms-stamp">
                <div className="hms-stamp-inner">
                  <span>✚</span>
                  <span>VERIFIED</span>
                  <span>MediCore HMS</span>
                </div>
              </div>
            </div>
            
          </div>
          <button  className="btn-primary"  onClick={sendReportDate} >Submit report</button>
        </main>
         
      </div>
    );
  }

  return (
    <div className="hms-root">
      <header className="hms-header">
        <div className="hms-header-inner">
          <div className="hms-logo">
            <span className="hms-logo-cross">✚</span>
            <div>
              <span className="hms-logo-title">MediCore HMS</span>
              <span className="hms-logo-sub">Hospital Management System</span>
            </div>
          </div>
          <div className="hms-header-meta">
            <span className="hms-status-dot"></span>
            <span>Doctor Portal</span>
          </div>
        </div>
      </header>

      <main className="hms-form-main">
        <div className="hms-form-intro">
          <h1>Submit Medical Report</h1>
          <p>Complete all sections and submit to generate the official patient report.</p>
        </div>

        <form className="hms-form" onSubmit={handleSubmit}>

          {/* Patient Information */}
          <div className={`hms-form-section ${activeSection === "patient" ? "hms-active" : ""}`}
            onClick={() => setActiveSection("patient")}>
            <div className="hms-form-section-header">
              <span className="hms-form-section-icon">👤</span>
              <h2>Patient Information</h2>
            </div>
            <div className="hms-form-grid">
              <div className="hms-field">
                <label>Full Name *</label>
                <input name="patientName" value={form.patientName} onChange={handleChange} required placeholder="Patient full name" />
              </div>
              <div className="hms-field">
                <label>Age *</label>
                <input name="age" type="number" value={form.age} onChange={handleChange} required placeholder="Years" min="0" max="120" />
              </div>
              <div className="hms-field">
                <label>Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="hms-field">
                <label>Patient ID *</label>
                <input name="patientId" value={form.patientId} onChange={handleChange} required placeholder="HMS-YYYY-XXXX" />
              </div>
              <div className="hms-field">
                <label>Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className={`hms-form-section ${activeSection === "doctor" ? "hms-active" : ""}`}
            onClick={() => setActiveSection("doctor")}>
            <div className="hms-form-section-header">
              <span className="hms-form-section-icon">🩺</span>
              <h2>Doctor Information</h2>
            </div>
            <div className="hms-form-grid">
              <div className="hms-field">
                <label>Doctor Name *</label>
                <input name="doctorName" value={form.doctorName} onChange={handleChange} required placeholder="Dr. Full Name" />
              </div>
              <div className="hms-field">
                <label>Department *</label>
                <select name="department" value={form.department} onChange={handleChange} required>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Clinical Details */}
          <div className={`hms-form-section ${activeSection === "clinical" ? "hms-active" : ""}`}
            onClick={() => setActiveSection("clinical")}>
            <div className="hms-form-section-header">
              <span className="hms-form-section-icon">📋</span>
              <h2>Clinical Details</h2>
            </div>
            <div className="hms-form-grid hms-form-grid-1">
              <div className="hms-field">
                <label>Chief Complaint *</label>
                <input name="chiefComplaint" value={form.chiefComplaint} onChange={handleChange} required placeholder="Primary reason for visit" />
              </div>
            </div>
          </div>

          {/* Examination */}
          <div className={`hms-form-section ${activeSection === "exam" ? "hms-active" : ""}`}
            onClick={() => setActiveSection("exam")}>
            <div className="hms-form-section-header">
              <span className="hms-form-section-icon">🔍</span>
              <h2>Examination Findings</h2>
            </div>
            <div className="hms-form-grid">
              <div className="hms-field">
                <label>Temperature (°C)</label>
                <input name="temperature" value={form.temperature} onChange={handleChange} placeholder="e.g. 37.8" />
              </div>
              <div className="hms-field">
                <label>Blood Pressure (mmHg)</label>
                <input name="bloodPressure" value={form.bloodPressure} onChange={handleChange} placeholder="e.g. 120/80" />
              </div>
              <div className="hms-field">
                <label>Pulse Rate (bpm)</label>
                <input name="pulseRate" value={form.pulseRate} onChange={handleChange} placeholder="e.g. 78" />
              </div>
              <div className="hms-field">
                <label>Severity</label>
                <select name="severity" value={form.severity} onChange={handleChange}>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Diagnosis & Prescription */}
          <div className={`hms-form-section ${activeSection === "rx" ? "hms-active" : ""}`}
            onClick={() => setActiveSection("rx")}>
            <div className="hms-form-section-header">
              <span className="hms-form-section-icon">💊</span>
              <h2>Diagnosis &amp; Prescription</h2>
            </div>
            <div className="hms-form-grid hms-form-grid-1">
              <div className="hms-field">
                <label>Diagnosis *</label>
                <input name="diagnosis" value={form.diagnosis} onChange={handleChange} required placeholder="Primary diagnosis" />
              </div>
              <div className="hms-field">
                <label>Prescription *</label>
                <textarea name="prescription" value={form.prescription} onChange={handleChange} required placeholder="Each line = one prescription item" rows={4} />
              </div>
            </div>
          </div>

          {/* Notes & Follow-up */}
          <div className={`hms-form-section ${activeSection === "notes" ? "hms-active" : ""}`}
            onClick={() => setActiveSection("notes")}>
            <div className="hms-form-section-header">
              <span className="hms-form-section-icon">🧾</span>
              <h2>Notes &amp; Follow-up</h2>
            </div>
            <div className="hms-form-grid hms-form-grid-1">
              <div className="hms-field">
                <label>Additional Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Each line = one note" rows={3} />
              </div>
              <div className="hms-field hms-field-half">
                <label>Follow-up Date</label>
                <input name="followUp" type="date" value={form.followUp} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="hms-form-actions">
            <button type="button" className="hms-btn hms-btn-ghost" onClick={handleReset}>Reset</button>
            <button  className="hms-btn hms-btn-submit">Submit Report →</button>
          </div>
        </form>
      </main>
    </div>
  );
}