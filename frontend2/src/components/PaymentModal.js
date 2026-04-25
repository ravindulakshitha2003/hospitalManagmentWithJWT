import React, { useState } from "react";
import "../styles/PaymentModal.css";

const PaymentModal = ({ bill, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePay = () => {
    if (form.cardNumber.length < 16) {
      setStatus("Invalid card number");
      return;
    }

    setStatus("Processing...");

    // simulate API call
    setTimeout(() => {
      setStatus("✅ Payment Successful");
      onSuccess(bill.id); // mark as paid in parent
      setTimeout(onClose, 1200);
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h3>Pay Bill</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="bill-summary">
          <p><strong>{bill.desc}</strong></p>
          <p>LKR {bill.amount.toLocaleString()}</p>
        </div>

        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          maxLength="16"
          value={form.cardNumber}
          onChange={handleChange}
        />

        <div className="row">
          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={handleChange}
          />

          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            maxLength="4"
            value={form.cvv}
            onChange={handleChange}
          />
        </div>

        <button className="pay-btn" onClick={handlePay}>
          Pay Now
        </button>

        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
};

export default PaymentModal;