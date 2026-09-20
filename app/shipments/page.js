
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

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

export default function Shipments() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchShipments();
  }, []);

  async function fetchShipments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage("Error loading shipments: " + error.message);
    } else {
      setShipments(data || []);
    }

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function saveShipment(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const shipmentData = {
      shipment_no: form.shipment_no || null,
      company_id: form.company_id ? Number(form.company_id) : null,
      order_id: form.order_id ? Number(form.order_id) : null,
      supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
      customer_id: form.customer_id ? Number(form.customer_id) : null,

      product_description: form.product_description || null,
      quantity: form.quantity ? Number(form.quantity) : null,
      unity: form.unity || null,
      weight: form.weight ? Number(form.weight) : null,
      weight_unit: form.weight_unit || null,

      container_no: form.container_no || null,
      bl_no: form.bl_no || null,
      vessel_flight: form.vessel_flight || null,
      port_of_loading: form.port_of_loading || null,
      destination_port: form.destination_port || null,

      etd: form.etd || null,
      eta: form.eta || null,
      current_location: form.current_location || null,

      status: form.status || "Pending",

      assigned_clearing_agent:
        form.assigned_clearing_agent || null,

      port_of_entry: form.port_of_entry || null,
      arrival_date: form.arrival_date || null,
      clearance_date: form.clearance_date || null,
    };

    const { error } = await supabase
      .from("shipments")
      .insert([shipmentData]);

    if (error) {
      setMessage("Error saving shipment: " + error.message);
      setSaving(false);
      return;
    }

    setMessage("Shipment saved successfully.");

    setForm(emptyForm);
    setShowForm(false);

    await fetchShipments();

    setSaving(false);
  }

  async function updateStatus(id, newStatus) {
    setMessage("");

    const { error } = await supabase
      .from("shipments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      setMessage("Error updating shipment: " + error.message);
      return;
    }

    setMessage("Shipment updated successfully.");

    await fetchShipments();
  }

  return (
    <main
      style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "8px" }}>Shipments</h1>

          <p style={{ margin: 0, color: "#666" }}>
            Manage shipments and import cargo.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setMessage("");
          }}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#111827",
            color: "white",
            fontWeight: "600",
          }}
        >
          + Add Shipment
        </button>
      </div>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 15px",
            borderRadius: "8px",
            background: "#f3f4f6",
            color: "#111827",
          }}
        >
          {message}
        </div>
      )}

      {showForm && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
            background: "white",
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
              <h2 style={{ marginBottom: "5px" }}>
                Shipment Details
              </h2>

              <p style={{ margin: 0, color: "#666" }}>
                Enter shipment and cargo information.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(emptyForm);
                setMessage("");
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Close
            </button>
          </div>

          <form onSubmit={saveShipment}>
            <h3>Basic Information</h3>

            <div style={gridStyle}>
              <Input
                label="Shipment Number *"
                name="shipment_no"
                value={form.shipment_no}
                onChange={handleChange}
                required
              />

              <Input
                label="Company ID"
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                type="number"
              />

              <Input
                label="Order ID"
                name="order_id"
                value={form.order_id}
                onChange={handleChange}
                type="number"
              />

              <Input
                label="Supplier ID"
                name="supplier_id"
                value={form.supplier_id}
                onChange={handleChange}
                type="number"
              />

              <Input
                label="Customer ID"
                name="customer_id"
                value={form.customer_id}
                onChange={handleChange}
                type="number"
              />
            </div>

            <h3 style={{ marginTop: "30px" }}>
              Cargo Information
            </h3>

            <div style={gridStyle}>
              <Input
                label="Product Description"
                name="product_description"
                value={form.product_description}
                onChange={handleChange}
              />

              <Input
                label="Quantity"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                type="number"
              />

              <Input
                label="Unit"
                name="unity"
                value={form.unity}
                onChange={handleChange}
              />

              <Input
                label="Weight"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                type="number"
              />

              <Input
                label="Weight Unit"
                name="weight_unit"
                value={form.weight_unit}
                onChange={handleChange}
              />
            </div>

            <h3 style={{ marginTop: "30px" }}>
              Shipping Information
            </h3>

            <div style={gridStyle}>
              <Input
                label="Container Number"
                name="container_no"
                value={form.container_no}
                onChange={handleChange}
              />

              <Input
                label="Bill of Lading"
                name="bl_no"
                value={form.bl_no}
                onChange={handleChange}
              />

              <Input
                label="Vessel / Flight"
                name="vessel_flight"
                value={form.vessel_flight}
                onChange={handleChange}
              />

              <Input
                label="Port of Loading"
                name="port_of_loading"
                value={form.port_of_loading}
                onChange={handleChange}
              />

              <Input
                label="Destination Port"
                name="destination_port"
                value={form.destination_port}
                onChange={handleChange}
              />

              <Input
                label="ETD"
                name="etd"
                value={form.etd}
                onChange={handleChange}
                type="date"
              />

              <Input
                label="ETA"
                name="eta"
                value={form.eta}
                onChange={handleChange}
                type="date"
              />

              <Input
                label="Current Location"
                name="current_location"
                value={form.current_location}
                onChange={handleChange}
              />

              <div>
                <label style={labelStyle}>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Arrived">Arrived</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <Input
                label="Assigned Clearing Agent"
                name="assigned_clearing_agent"
                value={form.assigned_clearing_agent}
                onChange={handleChange}
              />

              <Input
                label="Port of Entry"
                name="port_of_entry"
                value={form.port_of_entry}
                onChange={handleChange}
              />

              <Input
                label="Arrival Date"
                name="arrival_date"
                value={form.arrival_date}
                onChange={handleChange}
                type="date"
              />

              <Input
                label="Clearance Date"
                name="clearance_date"
                value={form.clearance_date}
                onChange={handleChange}
                type="date"
              />
            </div>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "12px 25px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#111827",
                  color: "white",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                {saving ? "Saving..." : "Save Shipment"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                }}
                style={{
                  padding: "12px 25px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2>Shipment List</h2>

        {loading ? (
          <p>Loading shipments...</p>
        ) : shipments.length === 0 ? (
          <p>No shipments found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "900px",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Shipment No.</th>
                  <th style={thStyle}>Container</th>
                  <th style={thStyle}>Bill of Lading</th>
                  <th style={thStyle}>Destination</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td style={tdStyle}>
                      {shipment.shipment_no || "-"}
                    </td>

                    <td style={tdStyle}>
                      {shipment.container_no || "-"}
                    </td>

                    <td style={tdStyle}>
                      {shipment.bl_no || "-"}
                    </td>

                    <td style={tdStyle}>
                      {shipment.destination_port || "-"}
                    </td>

                    <td style={tdStyle}>
                      <select
                        value={shipment.status || "Pending"}
                        onChange={(e) =>
                          updateStatus(
                            shipment.id,
                            e.target.value
                          )
                        }
                        style={{
                          padding: "7px",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Transit">
                          In Transit
                        </option>
                        <option value="Arrived">Arrived</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Delivered">
                          Delivered
                        </option>
                      </select>
                    </td>

                    <td style={tdStyle}>
                      <span style={{ color: "#666" }}>
                        Shipment #{shipment.id}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "18px",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "11px",
  borderRadius: "7px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  background: "white",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  background: "#f8f8f8",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

                
