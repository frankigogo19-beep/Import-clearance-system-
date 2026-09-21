"use client";

import { useState } from "react";

export default function ProofOfDelivery() {
  const [pods, setPods] = useState([]);
  const [form, setForm] = useState({
    podNumber: "",
    deliveryId: "",
    shipmentId: "",
    customerName: "",
    deliveryDate: "",
    receivedBy: "",
    receiverPhone: "",
    deliveryAddress: "",
    status: "Pending",
    notes: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.podNumber || !form.deliveryId) {
      alert("Please enter POD Number and Delivery ID.");
      return;
    }

    setPods([...pods, form]);

    setForm({
      podNumber: "",
      deliveryId: "",
      shipmentId: "",
      customerName: "",
      deliveryDate: "",
      receivedBy: "",
      receiverPhone: "",
      deliveryAddress: "",
      status: "Pending",
      notes: "",
    });
  }

  return (
    <main
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1100px",
        margin: "auto",
      }}
    >
      <h1>Proof of Delivery</h1>

      <p>
        Manage proof of delivery records and delivery confirmations.
      </p>

      <h2 style={{ marginTop: "30px" }}>Add Proof of Delivery</h2>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <div>
            <label>POD Number *</label>
            <input
              type="text"
              name="podNumber"
              value={form.podNumber}
              onChange={handleChange}
              placeholder="POD-0001"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Delivery ID *</label>
            <input
              type="text"
              name="deliveryId"
              value={form.deliveryId}
              onChange={handleChange}
              placeholder="DEL-0001"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Shipment ID</label>
            <input
              type="text"
              name="shipmentId"
              value={form.shipmentId}
              onChange={handleChange}
              placeholder="SHP-0001"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Customer name"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Delivery Date</label>
            <input
              type="date"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label>Received By</label>
            <input
              type="text"
              name="receivedBy"
              value={form.receivedBy}
              onChange={handleChange}
              placeholder="Receiver name"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Receiver Phone</label>
            <input
              type="text"
              name="receiverPhone"
              value={form.receiverPhone}
              onChange={handleChange}
              placeholder="+255..."
              style={inputStyle}
            />
          </div>

          <div>
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Pending</option>
              <option>Delivered</option>
              <option>Confirmed</option>
              <option>Rejected</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label>Delivery Address</label>
            <textarea
              name="deliveryAddress"
              value={form.deliveryAddress}
              onChange={handleChange}
              placeholder="Delivery address"
              style={textareaStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              style={textareaStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Save Proof of Delivery
        </button>
      </form>

      <h2 style={{ marginTop: "40px" }}>Proof of Delivery List</h2>

      {pods.length === 0 ? (
        <p>No proof of delivery records found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>POD Number</th>
                <th style={thStyle}>Delivery</th>
                <th style={thStyle}>Shipment</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Received By</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {pods.map((pod, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{pod.podNumber}</td>
                  <td style={tdStyle}>{pod.deliveryId}</td>
                  <td style={tdStyle}>{pod.shipmentId || "-"}</td>
                  <td style={tdStyle}>{pod.customerName || "-"}</td>
                  <td style={tdStyle}>{pod.receivedBy || "-"}</td>
                  <td style={tdStyle}>{pod.deliveryDate || "-"}</td>
                  <td style={tdStyle}>{pod.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const textareaStyle = {
  width: "100%",
  minHeight: "80px",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};
