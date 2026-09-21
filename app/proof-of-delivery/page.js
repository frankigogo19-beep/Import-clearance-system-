"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProofOfDeliveryPage() {
  const [pods, setPods] = useState([]);
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

  async function loadPODs() {
    const { data, error } = await supabase
      .from("proof_of_delivery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPods(data || []);
  }

  useEffect(() => {
    loadPODs();
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
      .from("proof_of_delivery")
      .insert([form]);

    setLoading(false);

    if (error) {
      alert("Error saving POD: " + error.message);
      return;
    }

    alert("Proof of Delivery saved successfully!");

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

    loadPODs();
  }

  return (
    <main style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Proof of Delivery</h1>

      <p>
        Manage proof of delivery records and delivery confirmations.
      </p>

      <h2>Add Proof of Delivery</h2>

      <form onSubmit={handleSubmit}>
        <label>POD Number *</label>
        <input
          name="pod_number"
          value={form.pod_number}
          onChange={handleChange}
          required
        />

        <label>Delivery ID *</label>
        <input
          name="delivery_id"
          value={form.delivery_id}
          onChange={handleChange}
          required
        />

        <label>Shipment ID *</label>
        <input
          name="shipment_id"
          value={form.shipment_id}
          onChange={handleChange}
          required
        />

        <label>Customer Name</label>
        <input
          name="customer_name"
          value={form.customer_name}
          onChange={handleChange}
        />

        <label>Delivery Date</label>
        <input
          type="date"
          name="delivery_date"
          value={form.delivery_date}
          onChange={handleChange}
        />

        <label>Received By</label>
        <input
          name="received_by"
          value={form.received_by}
          onChange={handleChange}
        />

        <label>Receiver Phone</label>
        <input
          name="receiver_phone"
          value={form.receiver_phone}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Rejected">Rejected</option>
        </select>

        <label>Delivery Address</label>
        <textarea
          name="delivery_address"
          value={form.delivery_address}
          onChange={handleChange}
        />

        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Proof of Delivery"}
        </button>
      </form>

      <h2 style={{ marginTop: "40px" }}>
        Proof of Delivery List
      </h2>

      {pods.length === 0 ? (
        <p>No proof of delivery records found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table border="1" cellPadding="8" style={{ width: "100%" }}>
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
              {pods.map((pod) => (
                <tr key={pod.id}>
                  <td>{pod.pod_number}</td>
                  <td>{pod.delivery_id}</td>
                  <td>{pod.shipment_id}</td>
                  <td>{pod.customer_name || "-"}</td>
                  <td>{pod.delivery_date || "-"}</td>
                  <td>{pod.received_by || "-"}</td>
                  <td>{pod.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

              
