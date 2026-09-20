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
  const [shipments, setShipments] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // LOAD SHIPMENTS
  // =========================

  async function loadShipments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading shipments: " + error.message);
    } else {
      setShipments(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadShipments();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =========================
  // SAVE / UPDATE
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const shipmentData = {
      shipment_no: form.shipment_no || null,
      company_id: form.company_id || null,
      order_id: form.order_id || null,
      supplier_id: form.supplier_id || null,
      customer_id: form.customer_id || null,
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
      status: form.status,
      assigned_clearing_agent:
        form.assigned_clearing_agent || null,
      port_of_entry: form.port_of_entry || null,
      arrival_date: form.arrival_date || null,
      clearance_date: form.clearance_date || null,
    };

    let result;

    if (editingId) {
      result = await supabase
        .from("shipments")
        .update(shipmentData)
        .eq("id", editingId);
    } else {
      result = await supabase
        .from("shipments")
        .insert([shipmentData]);
    }

    if (result.error) {
      setMessage(
        `Error saving shipment: ${result.error.message}`
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

    await loadShipments();

    setSaving(false);
  }

  // =========================
  // EDIT
  // =========================

  function handleEdit(shipment) {
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

    setEditingId(shipment.id);
    setShowView(false);
    setShowForm(true);
    setMessage("");
  }

  // =========================
  // VIEW
  // =========================

  function handleView(shipment) {
    setSelectedShipment(shipment);
    setShowView(true);
    setShowForm(false);
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shipment?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("shipments")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Error deleting shipment: " + error.message);
      return;
    }

    setMessage("Shipment deleted successfully.");
    await loadShipments();
  }

  // =========================
  // FILTER
  // =========================

  const filteredShipments = shipments.filter((shipment) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (shipment.shipment_no || "")
        .toLowerCase()
        .includes(searchText) ||
      (shipment.container_no || "")
        .toLowerCase()
        .includes(searchText) ||
      (shipment.bl_no || "")
        .toLowerCase()
        .includes(searchText) ||
      (shipment.vessel_flight || "")
        .toLowerCase()
        .includes(searchText) ||
      (shipment.product_description || "")
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // FORM FIELD
  // =========================

  function Field({
    label,
    name,
    type = "text",
    required = false,
  }) {
    return (
      <div className="field">
        <label>
          {label}
          {required && " *"}
        </label>

        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={required}
        />
      </div>
    );
  }

  return (
    <main className="page">
      <div className="header">
        <div>
          <h1>Shipments</h1>
          <p>Manage shipments and import cargo.</p>
        </div>

        <button
          className="primary"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
            setShowView(false);
            setMessage("");
          }}
        >
          + Add Shipment
        </button>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* SEARCH AND FILTER */}

      <div className="toolbar">
        <input
          className="search"
          type="text"
          placeholder="Search shipment, container, BL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Arrived">Arrived</option>
          <option value="Cleared">Cleared</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* FORM */}

      {showForm && (
        <section className="card">
          <div className="cardHeader">
            <h2>
              {editingId
                ? "Edit Shipment"
                : "Shipment Details"}
            </h2>

            <button
              className="close"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              ✕
            </button>
          </div>

          <p>Enter shipment and cargo information.</p>

          <form onSubmit={handleSubmit}>
            <h3>Basic Information</h3>

            <div className="grid">
              <Field
                label="Shipment Number"
                name="shipment_no"
                required
              />

              <Field
                label="Company ID"
                name="company_id"
              />

              <Field
                label="Order ID"
                name="order_id"
              />

              <Field
                label="Supplier ID"
                name="supplier_id"
              />

              <Field
                label="Customer ID"
                name="customer_id"
              />
            </div>

            <h3>Cargo Information</h3>

            <div className="grid">
              <Field
                label="Product Description"
                name="product_description"
              />

              <Field
                label="Quantity"
                name="quantity"
                type="number"
              />

              <Field
                label="Unit"
                name="unity"
              />

              <Field
                label="Weight"
                name="weight"
                type="number"
              />

              <Field
                label="Weight Unit"
                name="weight_unit"
              />
            </div>

            <h3>Shipping Information</h3>

            <div className="grid">
              <Field
                label="Container Number"
                name="container_no"
              />

              <Field
                label="Bill of Lading"
                name="bl_no"
              />

              <Field
                label="Vessel / Flight"
                name="vessel_flight"
              />

              <Field
                label="Port of Loading"
                name="port_of_loading"
              />

              <Field
                label="Destination Port"
                name="destination_port"
              />

              <Field
                label="ETD"
                name="etd"
                type="date"
              />

              <Field
                label="ETA"
                name="eta"
                type="date"
              />

              <Field
                label="Current Location"
                name="current_location"
              />
            </div>

            <h3>Clearance Information</h3>

            <div className="grid">
              <div className="field">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
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

              <Field
                label="Assigned Clearing Agent"
                name="assigned_clearing_agent"
              />

              <Field
                label="Port of Entry"
                name="port_of_entry"
              />

              <Field
                label="Arrival Date"
                name="arrival_date"
                type="date"
              />

              <Field
                label="Clearance Date"
                name="clearance_date"
                type="date"
              />
            </div>

            <button
              className="primary saveButton"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Shipment"
                : "Save Shipment"}
            </button>
          </form>
        </section>
      )}

      {/* VIEW */}

      {showView && selectedShipment && (
        <section className="card">
          <div className="cardHeader">
            <h2>Shipment Details</h2>

            <button
              className="close"
              onClick={() => setShowView(false)}
            >
              ✕
            </button>
          </div>

          <div className="details">
            {Object.entries(selectedShipment).map(
              ([key, value]) => (
                <div className="detail" key={key}>
                  <strong>
                    {key.replaceAll("_", " ")}
                  </strong>
                  <span>
                    {value === null ||
                    value === ""
                      ? "-"
                      : String(value)}
                  </span>
                </div>
              )
            )}
          </div>

          <button
            className="primary"
            onClick={() =>
              handleEdit(selectedShipment)
            }
          >
            Edit Shipment
          </button>
        </section>
      )}

      {/* SHIPMENTS TABLE */}

      <section className="card">
        <div className="cardHeader">
          <h2>Shipment List</h2>
          <span>
            {filteredShipments.length} shipment(s)
          </span>
        </div>

        {loading ? (
          <p>Loading shipments...</p>
        ) : filteredShipments.length === 0 ? (
          <p>No shipments found.</p>
        ) : (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Shipment No.</th>
                  <th>Container</th>
                  <th>Bill of Lading</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredShipments.map(
                  (shipment) => (
                    <tr key={shipment.id}>
                      <td>
                        {shipment.shipment_no || "-"}
                      </td>

                      <td>
                        {shipment.container_no || "-"}
                      </td>

                      <td>
                        {shipment.bl_no || "-"}
                      </td>

                      <td>
                        {shipment.destination_port ||
                          "-"}
                      </td>

                      <td>
                        <span className="status">
                          {shipment.status ||
                            "Pending"}
                        </span>
                      </td>

                      <td className="actions">
                        <button
                          onClick={() =>
                            handleView(shipment)
                          }
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleEdit(shipment)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="danger"
                          onClick={() =>
                            handleDelete(
                              shipment.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style jsx>{`
        .page {
          padding: 24px;
          max-width: 1400px;
          margin: auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        h1 {
          margin: 0;
        }

        h2 {
          margin: 0;
        }

        h3 {
          margin-top: 28px;
        }

        p {
          color: #666;
        }

        .primary {
          background: #111827;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
        }

        .primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          padding: 12px;
          background: #f3f4f6;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search {
          flex: 1;
        }

        input,
        select {
          width: 100%;
          padding: 11px;
          border: 1px solid #d1d5db;
          border-radius: 7px;
          box-sizing: border-box;
          background: white;
        }

        .toolbar select {
          max-width: 200px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .cardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .close {
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(220px, 1fr)
          );
          gap: 16px;
        }

        .field label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .saveButton {
          margin-top: 25px;
        }

        .tableWrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        th,
        td {
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          background: #f9fafb;
        }

        .status {
          padding: 5px 9px;
          border-radius: 20px;
          background: #f3f4f6;
          font-size: 13px;
        }

        .actions {
          display: flex;
          gap: 6px;
        }

        .actions button {
          border: 1px solid #d1d5db;
          background: white;
          padding: 7px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .actions .danger {
          color: #dc2626;
        }

        .details {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(220px, 1fr)
          );
          gap: 15px;
          margin: 20px 0;
        }

        .detail {
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .detail strong {
          display: block;
          text-transform: capitalize;
          margin-bottom: 5px;
        }

        @media (max-width: 600px) {
          .page {
            padding: 14px;
          }

          .header {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar {
            flex-direction: column;
          }

          .toolbar select {
            max-width: none;
          }

          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
