
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    delivery_number: "",
    shipment_id: "",
    delivery_date: "",
    delivery_address: "",
    recipient_name: "",
    recipient_phone: "",
    status: "Pending",
    notes: "",
  });

  useEffect(() => {
    loadDeliveries();
    loadShipments();
  }, []);

  async function loadDeliveries() {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage("Error loading deliveries: " + error.message);
      return;
    }

    setDeliveries(data || []);
  }

  async function loadShipments() {
    const { data, error } = await supabase
      .from("shipments")
      .select("id, shipment_no")
      .order("id", { ascending: false });

    if (!error) {
      setShipments(data || []);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase
      .from("deliveries")
      .insert([
        {
          delivery_number: form.delivery_number,
          shipment_id: form.shipment_id || null,
          delivery_date: form.delivery_date || null,
          delivery_address: form.delivery_address,
          recipient_name: form.recipient_name,
          recipient_phone: form.recipient_phone,
          status: form.status,
          notes: form.notes,
        },
      ]);

    if (error) {
      setMessage("Error saving delivery: " + error.message);
      return;
    }

    setMessage("Delivery created successfully.");

    setForm({
      delivery_number: "",
      shipment_id: "",
      delivery_date: "",
      delivery_address: "",
      recipient_name: "",
      recipient_phone: "",
      status: "Pending",
      notes: "",
    });

    loadDeliveries();
  }

  return (
    <main style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Deliveries</h1>

      <p>Manage shipment deliveries and delivery information.</p>

      {message && (
        <p style={{ fontWeight: "bold" }}>
          {message}
        </p>
      )}

      <hr />

      <h2>Add Delivery</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Number *</label>
          <br />
          <input
            type="text"
            name="delivery_number"
            value={form.delivery_number}
            onChange={handleChange}
            placeholder="DEL-0001"
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Shipment</label>
          <br />
          <select
            name="shipment_id"
            value={form.shipment_id}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="">Select Shipment</option>

            {shipments.map((shipment) => (
              <option key={shipment.id} value={shipment.id}>
                {shipment.shipment_no}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Date</label>
          <br />
          <input
            type="date"
            name="delivery_date"
            value={form.delivery_date}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Address</label>
          <br />
          <input
            type="text"
            name="delivery_address"
            value={form.delivery_address}
            onChange={handleChange}
            placeholder="Enter delivery address"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Recipient Name</label>
          <br />
          <input
            type="text"
            name="recipient_name"
            value={form.recipient_name}
            onChange={handleChange}
            placeholder="Recipient name"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Recipient Phone</label>
          <br />
          <input
            type="text"
            name="recipient_phone"
            value={form.recipient_phone}
            onChange={handleChange}
            placeholder="Phone number"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="Pending">Pending</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Notes</label>
          <br />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional notes"
            rows="4"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          Save Delivery
        </button>
      </form>

      <hr />

      <h2>Delivery List</h2>

      {deliveries.length === 0 ? (
        <p>No deliveries found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Delivery Number</th>
                <th>Shipment</th>
                <th>Delivery Date</th>
                <th>Recipient</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td>{delivery.delivery_number || "-"}</td>
                  <td>
                    {shipments.find(
                      (s) => s.id === delivery.shipment_id
                    )?.shipment_no || "-"}
                  </td>
                  <td>{delivery.delivery_date || "-"}</td>
                  <td>{delivery.recipient_name || "-"}</td>
                  <td>{delivery.recipient_phone || "-"}</td>
                  <td>{delivery.status || "-"}</td>
                  <td>{delivery.delivery_address || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
