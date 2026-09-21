"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProofOfDeliveryPage() {
  const [pods, setPods] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

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

  async function loadData() {
    setLoadingOptions(true);

    const [podsResult, deliveriesResult, shipmentsResult] =
      await Promise.all([
        supabase
          .from("proof_of_delivery")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("deliveries")
          .select("*")
          .order("id", { ascending: false }),

        supabase
          .from("shipments")
          .select("*")
          .order("id", { ascending: false }),
      ]);

    if (podsResult.error) {
      console.error("POD Error:", podsResult.error);
    } else {
      setPods(podsResult.data || []);
    }

    if (deliveriesResult.error) {
      console.error("Deliveries Error:", deliveriesResult.error);
    } else {
      setDeliveries(deliveriesResult.data || []);
    }

    if (shipmentsResult.error) {
      console.error("Shipments Error:", shipmentsResult.error);
    } else {
      setShipments(shipmentsResult.data || []);
    }

    setLoadingOptions(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleDeliveryChange(e) {
    const deliveryId = e.target.value;

    const selectedDelivery = deliveries.find(
      (delivery) => String(delivery.id) === String(deliveryId)
    );

    setForm({
      ...form,
      delivery_id: deliveryId,
      customer_name:
        selectedDelivery?.customer_name ||
        selectedDelivery?.receiver_name ||
        selectedDelivery?.customer ||
        "",
      delivery_address:
        selectedDelivery?.delivery_address ||
        selectedDelivery?.address ||
        "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!form.delivery_id) {
      alert("Please select a Delivery ID.");
      setLoading(false);
      return;
    }

    if (!form.shipment_id) {
      alert("Please select a Shipment ID.");
      setLoading(false);
      return;
    }

    const podData = {
      pod_number: form.pod_number,
      delivery_id: Number(form.delivery_id),
      shipment_id: Number(form.shipment_id),
      customer_name: form.customer_name || null,
      delivery_date: form.delivery_date || null,
      received_by: form.received_by || null,
      receiver_phone: form.receiver_phone || null,
      status: form.status,
      delivery_address: form.delivery_address || null,
      notes: form.notes || null,
    };

    const { error } = await supabase
      .from("proof_of_delivery")
      .insert([podData]);

    setLoading(false);

    if (error) {
      console.error(error);
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

    loadData();
  }

  return (
    <main
      style={{
        padding: "30px",
        maxWidth: "1100px",
        margin: "auto",
      }}
    >
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
          placeholder="Example: POD-0001"
          required
        />

        <br />
        <br />

        <label>Delivery ID *</label>
        <select
          name="delivery_id"
          value={form.delivery_id}
          onChange={handleDeliveryChange}
          required
        >
          <option value="">
            {loadingOptions
              ? "Loading deliveries..."
              : "Select Delivery ID"}
          </option>

          {deliveries.map((delivery) => (
            <option key={delivery.id} value={delivery.id}>
              Delivery #{delivery.id}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Shipment ID *</label>
        <select
          name="shipment_id"
          value={form.shipment_id}
          onChange={handleChange}
          required
        >
          <option value="">
            {loadingOptions
              ? "Loading shipments..."
              : "Select Shipment ID"}
          </option>

          {shipments.map((shipment) => (
            <option key={shipment.id} value={shipment.id}>
              {shipment.shipment_no
                ? `${shipment.shipment_no} (ID: ${shipment.id})`
                : `Shipment #${shipment.id}`}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Customer Name</label>
        <input
          name="customer_name"
          value={form.customer_name}
          onChange={handleChange}
          placeholder="Customer name"
        />

        <br />
        <br />

        <label>Delivery Date</label>
        <input
          type="date"
          name="delivery_date"
          value={form.delivery_date}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Received By</label>
        <input
          name="received_by"
          value={form.received_by}
          onChange={handleChange}
          placeholder="Name of person receiving goods"
        />

        <br />
        <br />

        <label>Receiver Phone</label>
        <input
          name="receiver_phone"
          value={form.receiver_phone}
          onChange={handleChange}
          placeholder="Phone number"
        />

        <br />
        <br />

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

        <br />
        <br />

        <label>Delivery Address</label>
        <textarea
          name="delivery_address"
          value={form.delivery_address}
          onChange={handleChange}
          placeholder="Delivery address"
          rows="3"
        />

        <br />
        <br />

        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Additional notes"
          rows="3"
        />

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : "Save Proof of Delivery"}
        </button>
      </form>

      <h2 style={{ marginTop: "40px" }}>
        Proof of Delivery List
      </h2>

      {pods.length === 0 ? (
        <p>No proof of delivery records found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="8"
            style={{ width: "100%" }}
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
s

              
