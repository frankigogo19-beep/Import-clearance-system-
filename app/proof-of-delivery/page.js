"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProofOfDeliveryPage() {
  const [podList, setPodList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pod_number: "",
    delivery_id: "",
    shipment_id: "",
    customer_name: "",
    delivery_date: "",
    received_by: "",
    receiver_phone: "",
    status: "Pending",
    delivery_address: "",
    notes: "",
  });

  async function loadPods() {
    const { data, error } = await supabase
      .from("proof_of_deliveries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading POD:", error);
      return;
    }

    setPodList(data || []);
  }

  useEffect(() => {
    loadPods();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("proof_of_deliveries")
      .insert([form]);

    if (error) {
      alert("Error saving proof of delivery: " + error.message);
      console.error(error);
      setLoading(false);
      return;
    }

    alert("Proof of Delivery saved successfully.");

    setForm({
      pod_number: "",
      delivery_id: "",
      shipment_id: "",
      customer_name: "",
      delivery_date: "",
      received_by: "",
      receiver_phone: "",
      status: "Pending",
      delivery_address: "",
      notes: "",
    });

    await loadPods();
    setLoading(false);
  }

  return (
    <main style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Proof of Delivery</h1>

      <p>
        Manage proof of delivery records and delivery confirmations.
      </p>

      <hr />

      <h2>Add Proof of Delivery</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "12px" }}>

          <label>
            POD Number *
            <input
              name="pod_number"
              value={form.pod_number}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <label>
            Delivery ID *
            <input
              name="delivery_id"
              value={form.delivery_id}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <label>
            Shipment ID
            <input
              name="shipment_id"
              value={form.shipment_id}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Customer Name
            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Delivery Date
            <input
              type="date"
              name="delivery_date"
              value={form.delivery_date}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Received By
            <input
              name="received_by"
              value={form.received_by}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Receiver Phone
            <input
              name="receiver_phone"
              value={form.receiver_phone}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>

          <label>
            Delivery Address
            <textarea
              name="delivery_address"
              value={form.delivery_address}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Saving..." : "Save Proof of Delivery"}
          </button>

        </div>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>Proof of Delivery List</h2>

      {podList.length === 0 ? (
        <p>No proof of delivery records found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>POD Number</th>
                <th>Delivery ID</th>
                <th>Shipment ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Received By</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {podList.map((pod) => (
                <tr key={pod.id}>
                  <td>{pod.pod_number}</td>
                  <td>{pod.delivery_id}</td>
                  <td>{pod.shipment_id || "-"}</td>
                  <td>{pod.customer_name || "-"}</td>
                  <td>{pod.delivery_date || "-"}</td>
                  <td>{pod.received_by || "-"}</td>
                  <td>{pod.status || "-"}</td>
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
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "12px 20px",
  cursor: "pointer",
  fontWeight: "bold",
};

              
