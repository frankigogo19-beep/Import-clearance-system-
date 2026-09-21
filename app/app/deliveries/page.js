"use client";

import { useState } from "react";

export default function DeliveriesPage() {
  const [message, setMessage] = useState("");

  return (
    <main style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      <h1>Deliveries</h1>

      <p>
        Manage deliveries, delivery orders and proof of delivery.
      </p>

      {message && (
        <p style={{ color: "green", marginTop: "15px" }}>
          {message}
        </p>
      )}

      <section
        style={{
          marginTop: "25px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2>Add Delivery</h2>

        <div style={{ marginTop: "15px" }}>
          <label>Delivery Number</label>
          <input
            type="text"
            placeholder="DEL-0001"
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "15px",
            }}
          />

          <label>Shipment ID</label>
          <input
            type="text"
            placeholder="SHP-0001"
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "15px",
            }}
          />

          <label>Customer</label>
          <input
            type="text"
            placeholder="Customer name"
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "15px",
            }}
          />

          <label>Delivery Address</label>
          <input
            type="text"
            placeholder="Delivery address"
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "15px",
            }}
          />

          <label>Status</label>
          <select
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "15px",
            }}
          >
            <option>Pending</option>
            <option>Scheduled</option>
            <option>In Transit</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          <button
            onClick={() => setMessage("Delivery form is ready.")}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Save Delivery
          </button>
        </div>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2>Delivery List</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Delivery Number
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Shipment
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Customer
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                DEL-0001
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                SHP-0001
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                Pending
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
