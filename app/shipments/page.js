
"use client";

import { useState } from "react";

import { supabase } from "../../lib/supabaseClient";
export default function Shipments() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    shipment_no: "",
    company_id: "",
    order_id: "",
    supplier_id: "",
    customer_id: "",
    product_description: "",
    quantity: "",
    unity: "",
    weight: "",
    weight_unit: "",
    container_no: "",
    bl_no: "",
    vessel_flight: "",
    port_of_loading: "",
    destination_port: "",
    etd: "",
    eta: "",
    current_location: "",
    status: "Pending",
    assigned_clearing_agent: "",
    port_of_entry: "",
    arrival_date: "",
    clearance_date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.shipment_no.trim()) {
      setMessage("Please enter Shipment Number.");
      return;
    }

    const { error } = await supabase
      .from("shipments")
      .insert([
        {
          shipment_no: formData.shipment_no,
          company_id: formData.company_id || null,
          order_id: formData.order_id || null,
          supplier_id: formData.supplier_id || null,
          customer_id: formData.customer_id || null,
          product_description: formData.product_description || null,
          quantity: formData.quantity
            ? Number(formData.quantity)
            : null,
          unity: formData.unity || null,
          weight: formData.weight
            ? Number(formData.weight)
            : null,
          weight_unit: formData.weight_unit || null,
          container_no: formData.container_no || null,
          bl_no: formData.bl_no || null,
          vessel_flight: formData.vessel_flight || null,
          port_of_loading: formData.port_of_loading || null,
          destination_port: formData.destination_port || null,
          etd: formData.etd || null,
          eta: formData.eta || null,
          current_location: formData.current_location || null,
          status: formData.status,
          assigned_clearing_agent:
            formData.assigned_clearing_agent || null,
          port_of_entry: formData.port_of_entry || null,
          arrival_date: formData.arrival_date || null,
          clearance_date: formData.clearance_date || null,
        },
      ]);

    if (error) {
      console.error(error);
      setMessage("Error saving shipment: " + error.message);
      return;
    }

    setMessage("Shipment saved successfully.");

    setFormData({
      shipment_no: "",
      company_id: "",
      order_id: "",
      supplier_id: "",
      customer_id: "",
      product_description: "",
      quantity: "",
      unity: "",
      weight: "",
      weight_unit: "",
      container_no: "",
      bl_no: "",
      vessel_flight: "",
      port_of_loading: "",
      destination_port: "",
      etd: "",
      eta: "",
      current_location: "",
      status: "Pending",
      assigned_clearing_agent: "",
      port_of_entry: "",
      arrival_date: "",
      clearance_date: "",
    });

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

          {message && <p>{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              name="shipment_no"
              placeholder="Shipment Number"
              value={formData.shipment_no}
              onChange={handleChange}
              required
            />

            <input
              name="company_id"
              placeholder="Company ID"
              value={formData.company_id}
              onChange={handleChange}
            />

            <input
              name="order_id"
              placeholder="Order ID"
              value={formData.order_id}
              onChange={handleChange}
            />

            <input
              name="supplier_id"
              placeholder="Supplier ID"
              value={formData.supplier_id}
              onChange={handleChange}
            />

            <input
              name="customer_id"
              placeholder="Customer ID"
              value={formData.customer_id}
              onChange={handleChange}
            />

            <input
              name="product_description"
              placeholder="Product Description"
              value={formData.product_description}
              onChange={handleChange}
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
            />

            <input
              name="unity"
              placeholder="Unit"
              value={formData.unity}
              onChange={handleChange}
            />

            <input
              type="number"
              step="any"
              name="weight"
              placeholder="Weight"
              value={formData.weight}
              onChange={handleChange}
            />

            <input
              name="weight_unit"
              placeholder="Weight Unit"
              value={formData.weight_unit}
              onChange={handleChange}
            />

            <input
              name="container_no"
              placeholder="Container Number"
              value={formData.container_no}
              onChange={handleChange}
            />

            <input
              name="bl_no"
              placeholder="Bill of Lading (B/L)"
              value={formData.bl_no}
              onChange={handleChange}
            />

            <input
              name="vessel_flight"
              placeholder="Vessel / Flight"
              value={formData.vessel_flight}
              onChange={handleChange}
            />

            <input
              name="port_of_loading"
              placeholder="Port of Loading"
              value={formData.port_of_loading}
              onChange={handleChange}
            />

            <input
              name="destination_port"
              placeholder="Destination Port"
              value={formData.destination_port}
              onChange={handleChange}
            />

            <label>ETD</label>
            <input
              type="date"
              name="etd"
              value={formData.etd}
              onChange={handleChange}
            />

            <label>ETA</label>
            <input
              type="date"
              name="eta"
              value={formData.eta}
              onChange={handleChange}
            />

            <input
              name="current_location"
              placeholder="Current Location"
              value={formData.current_location}
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

            <input
              name="assigned_clearing_agent"
              placeholder="Assigned Clearing Agent"
              value={formData.assigned_clearing_agent}
              onChange={handleChange}
            />

            <input
              name="port_of_entry"
              placeholder="Port of Entry"
              value={formData.port_of_entry}
              onChange={handleChange}
            />

            <label>Arrival Date</label>
            <input
              type="date"
              name="arrival_date"
              value={formData.arrival_date}
              onChange={handleChange}
            />

            <label>Clearance Date</label>
            <input
              type="date"
              name="clearance_date"
              value={formData.clearance_date}
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
