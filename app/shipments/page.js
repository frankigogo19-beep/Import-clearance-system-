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
  const [showView, setShowView] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [selectedShipment, setSelectedShipment] = useState(null);

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

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setShowView(false);
    setShowForm(true);
  }

  function openEditForm(shipment) {
    setEditingId(shipment.id);

    setForm({
      shipment_no: shipment.shipment_no || "",
      company_id: shipment.company_id || "",
      order_id: shipment.order_id || "",
      supplier_id: shipment.supplier_id || "",
      customer_id: shipment.customer_id || "",
      product_description: shipment.product_description || "",
      quantity: shipment.quantity || "",
      unity: shipment.unity || "",
      weight: shipment.weight || "",
      weight_unit: shipment.weight_unit || "",
      container_no: shipment.container_no || "",
      bl_no: shipment.bl_no || "",
      vessel_flight: shipment.vessel_flight || "",
      port_of_loading: shipment.port_of_loading || "",
      destination_port: shipment.destination_port || "",
      etd: shipment.etd || "",
      eta: shipment.eta || "",
      current_location: shipment.current_location || "",
      status: shipment.status || "Pending",
      assigned_clearing_agent:
        shipment.assigned_clearing_agent || "",
      port_of_entry: shipment.port_of_entry || "",
      arrival_date: shipment.arrival_date || "",
      clearance_date: shipment.clearance_date || "",
    });

    setShowView(false);
    setMessage("");
    setShowForm(true);
  }

  function openView(shipment) {
    setSelectedShipment(shipment);
    setShowForm(false);
    setShowView(true);
    setMessage("");
  }

  async function saveShipment(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const shipmentData = {
      shipment_no: form.shipment_no || null,
      company_id: form.company_id
        ? Number(form.company_id)
        : null,
      order_id: form.order_id
        ? Number(form.order_id)
        : null,
      supplier_id: form.supplier_id
        ? Number(form.supplier_id)
        : null,
      customer_id: form.customer_id
        ? Number(form.customer_id)
        : null,

      product_description:
        form.product_description || null,

      quantity: form.quantity
        ? Number(form.quantity)
        : null,

      unity: form.unity || null,

      weight: form.weight
        ? Number(form.weight)
        : null,

      weight_unit: form.weight_unit || null,

      container_no: form.container_no || null,
      bl_no: form.bl_no || null,
      vessel_flight: form.vessel_flight || null,
      port_of_loading: form.port_of_loading || null,
      destination_port: form.destination_port || null,

      etd: form.etd || null,
      eta: form.eta || null,
      current_location:
        form.current_location || null,

      status: form.status || "Pending",

      assigned_clearing_agent:
        form.assigned_clearing_agent || null,

      port_of_entry:
        form.port_of_entry || null,

      arrival_date:
        form.arrival_date || null,

      clearance_date:
        form.clearance_date || null,
    };

    let error;

    if (editingId) {
      const result = await supabase
        .from("shipments")
        .update(shipmentData)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("shipments")
        .insert([shipmentData]);

      error = result.error;
    }

    if (error) {
      setMessage(
        "Error saving shipment: " + error.message
      );
      setSaving(false);
      return;
    }

    setMessage(
      editingId
        ? "Shipment updated successfully."
        : "Shipment saved successfully."
    );

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);

    await fetchShipments();

    setSaving(false);
  }

  async function updateStatus(id, newStatus) {
    setMessage("");

    const { error } = await supabase
      .from("shipments")
      .update({
        status: newStatus,
      })
      .eq("id", id);

    if (error) {
      setMessage(
        "Error updating shipment: " +
          error.message
      );
      return;
    }

    setMessage("Shipment updated successfully.");

    await fetchShipments();
  }

  async function deleteShipment(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shipment?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const { error } = await supabase
      .from("shipments")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(
        "Error deleting shipment: " +
          error.message
      );
      return;
    }

    setMessage("Shipment deleted successfully.");

    setShowView(false);
    setSelectedShipment(null);

    await fetchShipments();
  }

  function closePanels() {
    setShowForm(false);
    setShowView(false);
    setEditingId(null);
    setSelectedShipment(null);
    setForm(emptyForm);
    setMessage("");
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
          <h1 style={{ marginBottom: "8px" }}>
            Shipments
          </h1>

          <p
            style={{
              margin: 0,
              color: "#666",
            }}
          >
            Manage shipments and import cargo.
          </p>
        </div>

        <button
          onClick={openAddForm}
          style={primaryButton}
        >
          + Add Shipment
        </button>
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      {showView && selectedShipment && (
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={{ marginBottom: "5px" }}>
                Shipment Details
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#666",
                }}
              >
                Complete shipment information
              </p>
            </div>

            <button
              onClick={closePanels}
              style={closeButton}
            >
              Close
            </button>
          </div>

          <div style={detailsGrid}>
            <Detail
              label="Shipment Number"
              value={selectedShipment.shipment_no}
            />

            <Detail
              label="Company ID"
              value={selectedShipment.company_id}
            />

            <Detail
              label="Order ID"
              value={selectedShipment.order_id}
            />

            <Detail
              label="Supplier ID"
              value={selectedShipment.supplier_id}
            />

            <Detail
              label="Customer ID"
              value={selectedShipment.customer_id}
            />

            <Detail
              label="Product Description"
              value={
                selectedShipment.product_description
              }
            />

            <Detail
              label="Quantity"
              value={selectedShipment.quantity}
            />

            <Detail
              label="Unit"
              value={selectedShipment.unity}
            />

            <Detail
              label="Weight"
              value={selectedShipment.weight}
            />

            <Detail
              label="Weight Unit"
              value={selectedShipment.weight_unit}
            />

            <Detail
              label="Container Number"
              value={selectedShipment.container_no}
            />

            <Detail
              label="Bill of Lading"
              value={selectedShipment.bl_no}
            />

            <Detail
              label="Vessel / Flight"
              value={selectedShipment.vessel_flight}
            />

            <Detail
              label="Port of Loading"
              value={selectedShipment.port_of_loading}
            />

            <Detail
              label="Destination Port"
              value={selectedShipment.destination_port}
            />

            <Detail
              label="ETD"
              value={selectedShipment.etd}
            />

            <Detail
              label="ETA"
              value={selectedShipment.eta}
            />

            <Detail
              label="Current Location"
              value={selectedShipment.current_location}
            />

            <Detail
              label="Status"
              value={selectedShipment.status}
            />

            <Detail
              label="Clearing Agent"
              value={
                selectedShipment.assigned_clearing_agent
              }
            />

            <Detail
              label="Port of Entry"
              value={selectedShipment.port_of_entry}
            />

            <Detail
              label="Arrival Date"
              value={selectedShipment.arrival_date}
            />

            <Detail
              label="Clearance Date"
              value={
                selectedShipment.clearance_date
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() =>
                openEditForm(selectedShipment)
              }
              style={editButton}
            >
              Edit Shipment
            </button>

            <button
              onClick={() =>
                deleteShipment(selectedShipment.id)
              }
              style={deleteButton}
            >
              Delete Shipment
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={{ marginBottom: "5px" }}>
                {editingId
                  ? "Edit Shipment"
                  : "Shipment Details"}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#666",
                }}
              >
                {editingId
                  ? "Update shipment information."
                  : "Enter shipment and cargo information."}
              </p>
            </div>

            <button
              type="button"
              onClick={closePanels}
              style={closeButton}
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
                <label style={labelStyle}>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Transit">
                    In Transit
                  </option>

                  <option value="Arrived">
                    Arrived
                  </option>

                  <option value="Cleared">
                    Cleared
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>
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
                style={primaryButton}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Shipment"
                  : "Save Shipment"}
              </button>

              <button
                type="button"
                onClick={closePanels}
                style={secondaryButton}
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
                minWidth: "950px",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>
                    Shipment No.
                  </th>

                  <th style={thStyle}>
                    Container
                  </th>

                  <th style={thStyle}>
                    Bill of Lading
                  </th>

                  <th style={thStyle}>
                    Destination
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                  <th style={thStyle}>
                    Actions
                  </th>
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
                        value={
                          shipment.status ||
                          "Pending"
                        }
                        onChange={(e) =>
                          updateStatus(
                            shipment.id,
                            e.target.value
                          )
                        }
                        style={{
                          padding: "7px",
                          borderRadius: "6px",
                          border:
                            "1px solid #ddd",
                        }}
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Transit">
                          In Transit
                        </option>

                        <option value="Arrived">
                          Arrived
                        </option>

                        <option value="Cleared">
                          Cleared
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>
                      </select>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "7px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() =>
                            openView(shipment)
                          }
                          style={viewButton}
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            openEditForm(shipment)
                          }
                          style={editButton}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteShipment(
                              shipment.id
                            )
                          }
                          style={deleteButton}
                        >
                          Delete
                        </button>
                      </div>
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
      <label style={labelStyle}>
        {label}
      </label>

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

function Detail({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "8px",
        padding: "12px",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#666",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: "600",
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "18px",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "15px",
};

const panelStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "25px",
  marginBottom: "30px",
  background: "white",
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  gap: "15px",
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

const primaryButton = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#111827",
  color: "white",
  fontWeight: "600",
};

const secondaryButton = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};

const closeButton = {
  padding: "8px 15px",
  borderRadius: "7px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};

const viewButton = {
  padding: "7px 12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};

const editButton = {
  padding: "7px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#e5e7eb",
  color: "#111827",
  cursor: "pointer",
};

const deleteButton = {
  padding: "7px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const messageStyle = {
  marginBottom: "20px",
  padding: "12px 15px",
  borderRadius: "8px",
  background: "#f3f4f6",
  color: "#111827",
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

                
