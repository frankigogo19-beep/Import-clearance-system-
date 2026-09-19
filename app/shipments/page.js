"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Shipments() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const emptyForm = {
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
  };

  const [formData, setFormData] = useState(emptyForm);

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

    const { error } = await supabase.from("shipments").insert([
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
    setFormData(emptyForm);

    setTimeout(() => {
      setShowForm(false);
      setMessage("");
    }, 1200);
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#fff",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  };

  const fieldStyle = {
    marginBottom: "16px",
  };

  return (
    <main
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Shipments
          </h1>

          <p
            style={{
              marginTop: "7px",
              color: "#6b7280",
            }}
          >
            Manage shipments and import cargo.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "11px 18px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Add Shipment
          </button>
        )}
      </div>

      {showForm && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                }}
              >
                Shipment Details
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  marginTop: "5px",
                  fontSize: "14px",
                }}
              >
                Enter shipment and cargo information.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: "#f3f4f6",
                border: "none",
                borderRadius: "7px",
                padding: "9px 14px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          {message && (
            <div
              style={{
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                background: message.startsWith("Error")
                  ? "#fee2e2"
                  : "#dcfce7",
                color: message.startsWith("Error")
                  ? "#991b1b"
                  : "#166534",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h3>Basic Information</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <div style={fieldStyle}>
                <label style={labelStyle}>Shipment Number *</label>
                <input
                  style={inputStyle}
                  name="shipment_no"
                  placeholder="e.g. SHP-0001"
                  value={formData.shipment_no}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Company ID</label>
                <input
                  style={inputStyle}
                  name="company_id"
                  placeholder="Company ID"
                  value={formData.company_id}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Order ID</label>
                <input
                  style={inputStyle}
                  name="order_id"
                  placeholder="Order ID"
                  value={formData.order_id}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Supplier ID</label>
                <input
                  style={inputStyle}
                  name="supplier_id"
                  placeholder="Supplier ID"
                  value={formData.supplier_id}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Customer ID</label>
                <input
                  style={inputStyle}
                  name="customer_id"
                  placeholder="Customer ID"
                  value={formData.customer_id}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr style={{ margin: "15px 0 25px", border: 0, borderTop: "1px solid #e5e7eb" }} />

            <h3>Cargo Information</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <div style={fieldStyle}>
                <label style={labelStyle}>Product Description</label>
                <input
                  style={inputStyle}
                  name="product_description"
                  placeholder="Product description"
                  value={formData.product_description}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Quantity</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Unit</label>
                <input
                  style={inputStyle}
                  name="unity"
                  placeholder="e.g. Cartons, Bags, Pieces"
                  value={formData.unity}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Weight</label>
                <input
                  style={inputStyle}
                  type="number"
                  step="any"
                  name="weight"
                  placeholder="Weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Weight Unit</label>
                <input
                  style={inputStyle}
                  name="weight_unit"
                  placeholder="e.g. KG, TON"
                  value={formData.weight_unit}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr style={{ margin: "15px 0 25px", border: 0, borderTop: "1px solid #e5e7eb" }} />

            <h3>Shipping Information</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <div style={fieldStyle}>
                <label style={labelStyle}>Container Number</label>
                <input
                  style={inputStyle}
                  name="container_no"
                  placeholder="Container Number"
                  value={formData.container_no}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Bill of Lading</label>
                <input
                  style={inputStyle}
                  name="bl_no"
                  placeholder="B/L Number"
                  value={formData.bl_no}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Vessel / Flight</label>
                <input
                  style={inputStyle}
                  name="vessel_flight"
                  placeholder="Vessel or Flight"
                  value={formData.vessel_flight}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Port of Loading</label>
                <input
                  style={inputStyle}
                  name="port_of_loading"
                  placeholder="Port of Loading"
                  value={formData.port_of_loading}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Destination Port</label>
                <input
                  style={inputStyle}
                  name="destination_port"
                  placeholder="Destination Port"
                  value={formData.destination_port}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>ETD</label>
                <input
                  style={inputStyle}
                  type="date"
                  name="etd"
                  value={formData.etd}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>ETA</label>
                <input
                  style={inputStyle}
                  type="date"
                  name="eta"
                  value={formData.eta}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr style={{ margin: "15px 0 25px", border: 0, borderTop: "1px solid #e5e7eb" }} />

            <h3>Clearance & Delivery</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <div style={fieldStyle}>
                <label style={labelStyle}>Current Location</label>
                <input
                  style={inputStyle}
                  name="current_location"
                  placeholder="Current Location"
                  value={formData.current_location}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Status</label>
                <select
                  style={inputStyle}
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
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  Assigned Clearing Agent
                </label>
                <input
                  style={inputStyle}
                  name="assigned_clearing_agent"
                  placeholder="Clearing Agent"
                  value={formData.assigned_clearing_agent}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Port of Entry</label>
                <input
                  style={inputStyle}
                  name="port_of_entry"
                  placeholder="Port of Entry"
                  value={formData.port_of_entry}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Arrival Date</label>
                <input
                  style={inputStyle}
                  type="date"
                  name="arrival_date"
                  value={formData.arrival_date}
                  onChange={handleChange}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Clearance Date</label>
                <input
                  style={inputStyle}
                  type="date"
                  name="clearance_date"
                  value={formData.clearance_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                type="submit"
                style={{
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 22px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Save Shipment
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: "#f3f4f6",
                  color: "#111827",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 22px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
    }
