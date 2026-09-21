
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ProofOfDeliveryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({
    delivery_id: "",
    received_by: "",
    delivery_status: "Delivered",
    delivery_notes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDeliveries();
  }, []);

  async function loadDeliveries() {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading deliveries: " + error.message);
      return;
    }

    setDeliveries(data || []);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function savePOD(e) {
    e.preventDefault();
    setMessage("");

    if (!form.delivery_id) {
      setMessage("Please select a delivery.");
      return;
    }

    const { error } = await supabase
      .from("deliveries")
      .update({
        status: form.delivery_status,
        customer_name: form.received_by || null,
      })
      .eq("id", form.delivery_id);

    if (error) {
      setMessage("Error saving POD: " + error.message);
      return;
    }

    setMessage("Proof of Delivery saved successfully.");

    setForm({
      delivery_id: "",
      received_by: "",
      delivery_status: "Delivered",
      delivery_notes: "",
    });

    loadDeliveries();
  }

  return (
    <main style={{ padding: "24px", maxWidth: "1000px", margin: "auto" }}>
      <h1>Proof of Delivery</h1>

      <p>Manage delivery confirmation and proof of delivery records.</p>

      {message && (
        <div
          style={{
            padding: "12px",
            margin: "15px 0",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          {message}
        </div>
      )}

      <h2>Record Proof of Delivery</h2>

      <form onSubmit={savePOD}>
        <div style={{ marginBottom: "15px" }}>
          <label>Delivery *</label>
          <br />
          <select
            name="delivery_id"
            value={form.delivery_id}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="">Select Delivery</option>

            {deliveries.map((delivery) => (
              <option key={delivery.id} value={delivery.id}>
                {delivery.delivery_number || `Delivery ${delivery.id}`}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Received By</label>
          <br />
          <input
            type="text"
            name="received_by"
            value={form.received_by}
            onChange={handleChange}
            placeholder="Customer or receiver name"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Status</label>
          <br />
          <select
            name="delivery_status"
            value={form.delivery_status}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Delivery Notes</label>
          <br />
          <textarea
            name="delivery_notes"
            value={form.delivery_notes}
            onChange={handleChange}
            placeholder="Enter delivery notes"
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
          Save Proof of Delivery
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>Delivery Records</h2>

      {deliveries.length === 0 ? (
        <p>No deliveries found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Delivery Number
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Customer
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Address
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {delivery.delivery_number || "-"}
                </td>

                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {delivery.customer_name || "-"}
                </td>

                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {delivery.delivery_address || "-"}
                </td>

                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {delivery.status || "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
