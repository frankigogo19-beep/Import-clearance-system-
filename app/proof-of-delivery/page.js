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
    delivery_id: "",
    shipment_id: "",
    receiver_name: "",
    receiver_phone: "",
    delivery_date: "",
    delivery_time: "",
    signature_url: "",
    photo_url: "",
    remarks: "",
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
      shipment_id: selectedDelivery?.shipment_id
        ? String(selectedDelivery.shipment_id)
        : form.shipment_id,
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
      delivery_id: Number(form.delivery_id),
      shipment_id: Number(form.shipment_id),
      receiver_name: form.receiver_name || null,
      receiver_phone: form.receiver_phone || null,
      delivery_date: form.delivery_date || null,
      delivery_time: form.delivery_time || null,
      signature_url: form.signature_url || null,
      photo_url: form.photo_url || null,
      remarks: form.remarks || null,
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
      delivery_id: "",
      shipment_id: "",
      receiver_name: "",
      receiver_phone: "",
      delivery_date: "",
      delivery_time: "",
      signature_url: "",
      photo_url: "",
      remarks: "",
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
        <label>Delivery ID *</label>
        <br />

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
              {delivery.delivery_number
                ? `${delivery.delivery_number} (ID: ${delivery.id})`
                : `Delivery #${delivery.id}`}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Shipment ID *</label>
        <br />

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

        <label>Receiver Name</label>
        <br />

        <input
          name="receiver_name"
          value={form.receiver_name}
          onChange={handleChange}
          placeholder="Name of person receiving goods"
        />

        <br />
        <br />

        <label>Receiver Phone</label>
        <br />

        <input
          name="receiver_phone"
          value={form.receiver_phone}
          onChange={handleChange}
          placeholder="0712345678"
        />

        <br />
        <br />

        <label>Delivery Date</label>
        <br />

        <input
          type="date"
          name="delivery_date"
          value={form.delivery_date}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Delivery Time</label>
        <br />

        <input
          type="time"
          name="delivery_time"
          value={form.delivery_time}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Signature URL</label>
        <br />

        <input
          name="signature_url"
          value={form.signature_url}
          onChange={handleChange}
          placeholder="Optional signature URL"
        />

        <br />
        <br />

        <label>Photo URL</label>
        <br />

        <input
          name="photo_url"
          value={form.photo_url}
          onChange={handleChange}
          placeholder="Optional delivery photo URL"
        />

        <br />
        <br />

        <label>Remarks</label>
        <br />

        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="Goods received in good condition and delivery confirmed by customer."
          rows="4"
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
                <th>ID</th>
                <th>Delivery ID</th>
                <th>Shipment ID</th>
                <th>Receiver</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {pods.map((pod) => (
                <tr key={pod.id}>
                  <td>{pod.id}</td>
                  <td>{pod.delivery_id}</td>
                  <td>{pod.shipment_id}</td>
                  <td>{pod.receiver_name || "-"}</td>
                  <td>{pod.receiver_phone || "-"}</td>
                  <td>{pod.delivery_date || "-"}</td>
                  <td>{pod.delivery_time || "-"}</td>
                  <td>{pod.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}



              
