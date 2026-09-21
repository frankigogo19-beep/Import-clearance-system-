
"use client";
import { useEffect, useState } from "react"; import { supabase } from "../../lib/supabaseClient";
export default function ProofOfDeliveryPage() { const [form, setForm] = useState({ pod_number: "", delivery_id: "", shipment_id: "", customer_name: "", delivery_date: "", received_by: "", receiver_phone: "", status: "Pending", delivery_address: "", notes: "", });
const [pods, setPods] = useState([]); const [message, setMessage] = useState(""); const [error, setError] = useState("");
async function loadPODs() { const { data, error } = await supabase .from("proof_of_delivery") .select("*") .order("id", { ascending: false });
if (error) {
  setError("Error loading proof of delivery: " + error.message);
  return;
}

setPods(data || []);
}
useEffect(() => { loadPODs(); }, []);
function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value, }); }
async function handleSubmit(e) { e.preventDefault();
setMessage("");
setError("");

if (!form.pod_number || !form.delivery_id) {
  setError("POD Number and Delivery ID are required.");
  return;
}

const { error } = await supabase
  .from("proof_of_delivery")
  .insert([
    {
      pod_number: form.pod_number,
      delivery_id: form.delivery_id,
      shipment_id: form.shipment_id || null,
      customer_name: form.customer_name || null,
      delivery_date: form.delivery_date || null,
      received_by: form.received_by || null,
      receiver_phone: form.receiver_phone || null,
      status: form.status,
      delivery_address: form.delivery_address || null,
      notes: form.notes || null,
    },
  ]);

if (error) {
  setError("Error saving proof of delivery: " + error.message);
  return;
}

setMessage("Proof of delivery saved successfully.");

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
return ( <main style={{ padding: "24px", maxWidth: "1100px", margin: "auto" }}> Proof of Delivery
<p>Manage proof of delivery records and delivery confirmations.</p>

  {message && (
    <p style={{ color: "green", fontWeight: "bold" }}>
      {message}
    </p>
  )}

  {error && (
    <p style={{ color: "red", fontWeight: "bold" }}>
      {error}
    </p>
  )}

  <h2>Add Proof of Delivery</h2>

  <form onSubmit={handleSubmit}>
    <div style={{ display: "grid", gap: "12px" }}>
      <label>
        POD Number *
        <input
          name="pod_number"
          value={form.pod_number}
          onChange={handleChange}
          placeholder="POD-0001"
          required
        />
      </label>

      <label>
        Delivery ID *
        <input
          name="delivery_id"
          value={form.delivery_id}
          onChange={handleChange}
          placeholder="DEL-0001"
          required
        />
      </label>

      <label>
        Shipment ID
        <input
          name="shipment_id"
          value={form.shipment_id}
          onChange={handleChange}
          placeholder="SHP-0001"
        />
      </label>

      <label>
        Customer Name
        <input
          name="customer_name"
          value={form.customer_name}
          onChange={handleChange}
          placeholder="Customer name"
        />
      </label>

      <label>
        Delivery Date
        <input
          type="date"
          name="delivery_date"
          value={form.delivery_date}
          onChange={handleChange}
        />
      </label>

      <label>
        Received By
        <input
          name="received_by"
          value={form.received_by}
          onChange={handleChange}
          placeholder="Receiver name"
        />
      </label>

      <label>
        Receiver Phone
        <input
          name="receiver_phone"
          value={form.receiver_phone}
          onChange={handleChange}
          placeholder="Phone number"
        />
      </label>

      <label>
        Status
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
      </label>

      <label>
        Delivery Address
        <textarea
          name="delivery_address"
          value={form.delivery_address}
          onChange={handleChange}
          placeholder="Delivery address"
        />
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Additional notes"
        />
      </label>

      <button type="submit">
        Save Proof of Delivery
      </button>
    </div>
  </form>

  <h2 style={{ marginTop: "32px" }}>
    Proof of Delivery List
  </h2>

  {pods.length === 0 ? (
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
            <th>Delivery</th>
            <th>Shipment</th>
            <th>Customer</th>
            <th>Received By</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {pods.map((pod) => (
            <tr key={pod.id}>
              <td>{pod.pod_number}</td>
              <td>{pod.delivery_id || "-"}</td>
              <td>{pod.shipment_id || "-"}</td>
              <td>{pod.customer_name || "-"}</td>
              <td>{pod.received_by || "-"}</td>
              <td>{pod.delivery_date || "-"}</td>
              <td>{pod.status || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</main>
); }
