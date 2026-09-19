"use client";

import { useState } from "react";

export default function Shipments() {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    shipmentNumber: "",
    company: "",
    supplier: "",
    shippingLine: "",
    billOfLading: "",
    containerNumber: "",
    vessel: "",
    portOfLoading: "",
    portOfDischarge: "",
    eta: "",
    status: "Pending",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Shipment saved successfully");
    setShowForm(false);
  };

  return (
    <main style={{ padding: "30px" }}>
      <h1>Shipments</h1>
      <p>Manage shipments and import cargo.</p>

      {!showForm ? (
        <button onClick={() => setShowForm(true)}>
          Add Shipment
        </button>
      ) : (
        <section style={{ marginTop: "25px" }}>
          <button onClick={() => setShowForm(false)}>
            Close
          </button>

          <h2>Shipment Details</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="shipmentNumber"
              placeholder="Shipment Number"
              value={formData.shipmentNumber}
              onChange={handleChange}
            />

            <input
              name="company"
              placeholder="Company / Importer"
              value={formData.company}
              onChange={handleChange}
            />

            <input
              name="supplier"
              placeholder="Supplier"
              value={formData.supplier}
              onChange={handleChange}
            />

            <input
              name="shippingLine"
              placeholder="Shipping Line"
              value={formData.shippingLine}
              onChange={handleChange}
            />

            <input
              name="billOfLading"
              placeholder="Bill of Lading (B/L)"
              value={formData.billOfLading}
              onChange={handleChange}
            />

            <input
              name="containerNumber"
              placeholder="Container Number"
              value={formData.containerNumber}
              onChange={handleChange}
            />

            <input
              name="vessel"
              placeholder="Vessel"
              value={formData.vessel}
              onChange={handleChange}
            />

            <input
              name="portOfLoading"
              placeholder="Port of Loading"
              value={formData.portOfLoading}
              onChange={handleChange}
            />

            <input
              name="portOfDischarge"
              placeholder="Port of Discharge"
              value={formData.portOfDischarge}
              onChange={handleChange}
            />

            <input
              type="date"
              name="eta"
              value={formData.eta}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>In Transit</option>
              <option>Arrived</option>
              <option>Cleared</option>
              <option>Delivered</option>
            </select>

            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
            />

            <br />

            <button type="submit">
              Save Shipment
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
