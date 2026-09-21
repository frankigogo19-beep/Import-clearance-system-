"use client";

import { useState } from "react";

export default function DeliveriesPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("Delivery created successfully.");
  }

  return (
    <main style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      <h1>Deliveries</h1>

      <p>Manage deliveries and proof of delivery.</p>

      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      <h2>Add Delivery</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Number *</label>
          <br />
          <input
            type="text"
            placeholder="DEL-0001"
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Shipment ID *</label>
          <br />
          <input
            type="text"
            placeholder="SHP-0001"
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Customer Name</label>
          <br />
          <input
            type="text"
            placeholder="Customer name"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Address</label>
          <br />
          <input
            type="text"
            placeholder="Delivery address"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Date</label>
          <br />
          <input
            type="date"
            style={{ padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Status</label>
          <br />
          <select style={{ padding: "10px", width: "100%" }}>
            <option>Pending</option>
            <option>Dispatched</option>
            <option>Delivered</option>
            <option>Failed</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Save Delivery
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>Delivery List</h2>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Delivery Number</th>
            <th>Shipment</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>DEL-0001</td>
            <td>SHP-0001</td>
            <td>-</td>
            <td>-</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
