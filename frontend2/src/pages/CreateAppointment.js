import React, {  useState, useCallback } from 'react';
import "../styles/Appoinment.css"
import appointmentService from '../services/appointmentService';


// Inject the provided stylesheet + extra appointment styles


const VISIT_TYPES = ["In-Person", "Telemedicine", "Follow-Up", "Emergency", "Consultation", "Routine"];

export default function CreateAppointment() {
  // Mock useAuth — replace with your real hook
  const appoinet = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentService.createAppointment(data.patient, data.docter, data.price, data.status, data.reason, data.visitType)
      return { success: true, message: response.message || 'Appoinment successful' };
    } catch (err) {
      const errorMessage = err.error || err.message || 'Appoinment failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);


  const [form, setForm] = useState({
    patient: "",
    docter: "",
    price: "",
    status: false,
    reason: "",
    visitType: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.patient.trim()) return setError("Patient name is required.");
    if (!form.docter.trim()) return setError("Doctor name is required.");
    if (!form.visitType) return setError("Please select a visit type.");
    if (!form.reason.trim()) return setError("Reason for visit is required.");

    const payload = {
      patient: form.patient.trim(),
      docter: form.docter.trim(),
      price: form.price ? parseFloat(form.price) : null,
      status: form.status,
      reason: form.reason.trim(),
      visitType: form.visitType,
    };

    setLoading(true);
    try {
      await appoinet(payload);
      setSuccess("Appointment created successfully!");
      setForm({ patient: "", docter: "", price: "", status: false, reason: "", visitType: "" });
    } catch (err) {
      setError(err?.message || "Failed to create appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isReady = form.patient && form.docter && form.visitType && form.reason;

  return (
    <>
      
      <div className="auth-container">
        <div className="auth-card">
          <h1>MediBook</h1>
          <h2>New Appointment</h2>

          {error && <div className="error-message">⚠ {error}</div>}
          {success && <div className="success-message">✓ {success}</div>}

          {/* Patient & Doctor */}
          <div className="section-divider">Parties</div>
          <div className="form-row">
            <div className="form-group">
              <label>Patient <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Full name"
                value={form.patient}
                onChange={set("patient")}
              />
            </div>
            <div className="form-group">
              <label>Doctor <span className="required">*</span></label>
              <se
                type="text"
                placeholder="Dr. Last name"
                value={form.docter}
                onChange={set("docter")}
              />
            </div>
          </div>

          {/* Visit type */}
          <div className="section-divider">Visit Type <span className="required" style={{color:"#e05"}}>*</span></div>
          <div className="visit-type-grid">
            {VISIT_TYPES.map((v) => (
              <div
                key={v}
                className={`visit-pill${form.visitType === v ? " selected" : ""}`}
                onClick={() => setForm((p) => ({ ...p, visitType: v }))}
              >
                {v}
              </div>
            ))}
          </div>

          {/* Reason */}
          <div className="section-divider">Details</div>
          <div className="form-group">
            <label>Reason for Visit <span className="required">*</span></label>
            <textarea
              placeholder="Describe the reason for this appointment…"
              value={form.reason}
              onChange={set("reason")}
            />
          </div>

          {/* Price & Status */}
          <div className="form-row">
            <div className="form-group">
              <label>Consultation Fee</label>
              <div className="price-wrapper">
                <span className="currency">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={set("price")}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Appointment Status</label>
              <div
                className={`status-toggle${form.status ? " active" : ""}`}
                onClick={() => setForm((p) => ({ ...p, status: !p.status }))}
              >
                <div className={`toggle-switch${form.status ? " on" : ""}`} />
                <span className={`toggle-label${form.status ? " on" : ""}`}>
                  {form.status ? "Confirmed" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Summary preview */}
          {isReady && (
            <div className="summary-box">
              <strong>{form.patient}</strong> with <strong>Dr. {form.docter}</strong>
              {" · "}<strong>{form.visitType}</strong>
              {form.price ? ` · $${parseFloat(form.price).toFixed(2)}` : ""}
              {" · "}{form.status ? "✓ Confirmed" : "⏳ Pending"}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading || !isReady}
            style={{ marginTop: 20 }}
          >
            {loading ? "Creating…" : "Create Appointment"}
          </button>
        </div>
      </div>
    </>
  );
}