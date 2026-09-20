"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const emptyForm = {
  shipment_id: "",
  case_number: "",
  declaration_number: "",
  customs_entry_number: "",
  clearance_type: "Import",
  status: "Pending",
  customs_station: "",
  port_of_entry: "",
  clearing_agent: "",
  declared_value: "",
  currency: "USD",
  customs_duty: "",
  import_vat: "",
  other_charges: "",
  declaration_date: "",
  assessment_date: "",
  payment_date: "",
  release_date: "",
  inspection_required: false,
  inspection_date: "",
  remarks: "",
};

const statuses = [
  "Pending",
  "Declaration Submitted",
  "Under Customs Review",
  "Inspection",
  "Duty Assessment",
  "Duty Paid",
  "Released",
  "Completed",
  "Cancelled",
];

export default function ClearanceCases() {
  const [cases, setCases] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [casesResult, shipmentsResult] = await Promise.all([
      supabase
        .from("clearance_cases")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("shipments")
        .select("id, shipment_no")
        .order("created_at", { ascending: false }),
    ]);

    if (casesResult.error) {
      setMessage("Error loading clearance cases: " + casesResult.error.message);
    } else {
      setCases(casesResult.data || []);
    }

    if (!shipmentsResult.error) {
      setShipments(shipmentsResult.data || []);
    }

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function calculateTotal() {
    const duty = Number(form.customs_duty) || 0;
    const vat = Number(form.import_vat) || 0;
    const other = Number(form.other_charges) || 0;

    return duty + vat + other;
  }

  function openAddForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      case_number: `CC-${Date.now()}`,
    });
    setMessage("");
    setShowForm(true);
  }

  function openEdit(item) {
    setEditingId(item.id);

    setForm({
      shipment_id: item.shipment_id || "",
      case_number: item.case_number || "",
      declaration_number: item.declaration_number || "",
      customs_entry_number: item.customs_entry_number || "",
      clearance_type: item.clearance_type || "Import",
      status: item.status || "Pending",
      customs_station: item.customs_station || "",
      port_of_entry: item.port_of_entry || "",
      clearing_agent: item.clearing_agent || "",
      declared_value: item.declared_value || "",
      currency: item.currency || "USD",
      customs_duty: item.customs_duty || "",
      import_vat: item.import_vat || "",
      other_charges: item.other_charges || "",
      declaration_date: item.declaration_date || "",
      assessment_date: item.assessment_date || "",
      payment_date: item.payment_date || "",
      release_date: item.release_date || "",
      inspection_required: item.inspection_required || false,
      inspection_date: item.inspection_date || "",
      remarks: item.remarks || "",
    });

    setMessage("");
    setShowForm(true);
  }

  async function saveCase(e) {
    e.preventDefault();
    setMessage("");

    if (!form.case_number.trim()) {
      setMessage("Case Number is required.");
      return;
    }

    const payload = {
      shipment_id: form.shipment_id ? Number(form.shipment_id) : null,
      case_number: form.case_number.trim(),
      declaration_number: form.declaration_number || null,
      customs_entry_number: form.customs_entry_number || null,
      clearance_type: form.clearance_type,
      status: form.status,
      customs_station: form.customs_station || null,
      port_of_entry: form.port_of_entry || null,
      clearing_agent: form.clearing_agent || null,
      declared_value: form.declared_value
        ? Number(form.declared_value)
        : null,
      currency: form.currency || "USD",
      customs_duty: form.customs_duty
        ? Number(form.customs_duty)
        : 0,
      import_vat: form.import_vat
        ? Number(form.import_vat)
        : 0,
      other_charges: form.other_charges
        ? Number(form.other_charges)
        : 0,
      total_charges: calculateTotal(),
      declaration_date: form.declaration_date || null,
      assessment_date: form.assessment_date || null,
      payment_date: form.payment_date || null,
      release_date: form.release_date || null,
      inspection_required: form.inspection_required,
      inspection_date: form.inspection_date || null,
      remarks: form.remarks || null,
      updated_at: new Date().toISOString(),
    };

    let result;

    if (editingId) {
      result = await supabase
        .from("clearance_cases")
        .update(payload)
        .eq("id", editingId);
    } else {
      result = await supabase
        .from("clearance_cases")
        .insert([payload]);
    }

    if (result.error) {
      setMessage("Error saving clearance case: " + result.error.message);
      return;
    }

    setMessage(
      editingId
        ? "Clearance case updated successfully."
        : "Clearance case created successfully."
    );

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);

    await loadData();
  }

  async function deleteCase(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this clearance case?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("clearance_cases")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Error deleting clearance case: " + error.message);
      return;
    }

    setMessage("Clearance case deleted successfully.");
    await loadData();
  }

  function viewCase(item) {
    setSelectedCase(item);
    setShowView(true);
  }

  function getShipmentNo(shipmentId) {
    const shipment = shipments.find(
      (item) => item.id === shipmentId
    );

    return shipment ? shipment.shipment_no : "-";
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
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "8px" }}>Clearance Cases</h1>
          <p style={{ color: "#666" }}>
            Manage customs clearance and import declaration cases.
          </p>
        </div>

        <button
          onClick={openAddForm}
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Clearance Case
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px 15px",
            borderRadius: "8px",
            background: "#f1f5f9",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          marginTop: "25px",
          overflowX: "auto",
        }}
      >
        <h2>Clearance Case List</h2>

        {loading ? (
          <p>Loading clearance cases...</p>
        ) : cases.length === 0 ? (
          <p>No clearance cases found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Case Number</th>
                <th style={thStyle}>Shipment</th>
                <th style={thStyle}>Declaration</th>
                <th style={thStyle}>Port of Entry</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Total Charges</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.case_number}</td>

                  <td style={tdStyle}>
                    {getShipmentNo(item.shipment_id)}
                  </td>

                  <td style={tdStyle}>
                    {item.declaration_number || "-"}
                  </td>

                  <td style={tdStyle}>
                    {item.port_of_entry || "-"}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "5px 9px",
                        borderRadius: "20px",
                        background: "#f1f5f9",
                        fontSize: "13px",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    {item.total_charges ?? 0} {item.currency || "USD"}
                  </td>

                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => viewCase(item)}
                        style={actionButton}
                      >
                        View
                      </button>

                      <button
                        onClick={() => openEdit(item)}
                        style={actionButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCase(item.id)}
                        style={actionButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>
                {editingId
                  ? "Edit Clearance Case"
                  : "Clearance Case Details"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveCase}>
              <div style={sectionTitle}>Basic Information</div>

              <div style={gridStyle}>
                <Field
                  label="Case Number *"
                  name="case_number"
                  value={form.case_number}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label>Shipment</label>
                  <select
                    name="shipment_id"
                    value={form.shipment_id}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Select Shipment</option>

                    {shipments.map((shipment) => (
                      <option key={shipment.id} value={shipment.id}>
                        {shipment.shipment_no}
                      </option>
                    ))}
                  </select>
                </div>

                <Field
                  label="Declaration Number"
                  name="declaration_number"
                  value={form.declaration_number}
                  onChange={handleChange}
                />

                <Field
                  label="Customs Entry Number"
                  name="customs_entry_number"
                  value={form.customs_entry_number}
                  onChange={handleChange}
                />

                <div>
                  <label>Clearance Type</label>
                  <select
                    name="clearance_type"
                    value={form.clearance_type}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="Import">Import</option>
                    <option value="Transit">Transit</option>
                    <option value="Re-export">Re-export</option>
                  </select>
                </div>

                <div>
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={sectionTitle}>Customs Information</div>

              <div style={gridStyle}>
                <Field
                  label="Customs Station"
                  name="customs_station"
                  value={form.customs_station}
                  onChange={handleChange}
                />

                <Field
                  label="Port of Entry"
                  name="port_of_entry"
                  value={form.port_of_entry}
                  onChange={handleChange}
                />

                <Field
                  label="Clearing Agent"
                  name="clearing_agent"
                  value={form.clearing_agent}
                  onChange={handleChange}
                />

                <Field
                  label="Declared Value"
                  name="declared_value"
                  type="number"
                  value={form.declared_value}
                  onChange={handleChange}
                />

                <div>
                  <label>Currency</label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="USD">USD</option>
                    <option value="TZS">TZS</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div style={sectionTitle}>Charges</div>

              <div style={gridStyle}>
                <Field
                  label="Customs Duty"
                  name="customs_duty"
                  type="number"
                  value={form.customs_duty}
                  onChange={handleChange}
                />

                <Field
                  label="Import VAT"
                  name="import_vat"
                  type="number"
                  value={form.import_vat}
                  onChange={handleChange}
                />

                <Field
                  label="Other Charges"
                  name="other_charges"
                  type="number"
                  value={form.other_charges}
                  onChange={handleChange}
                />

                <div>
                  <label>Total Charges</label>
                  <input
                    value={calculateTotal()}
                    readOnly
                    style={{
                      ...inputStyle,
                      background: "#f1f5f9",
                    }}
                  />
                </div>
              </div>

              <div style={sectionTitle}>Dates</div>

              <div style={gridStyle}>
                <Field
                  label="Declaration Date"
                  name="declaration_date"
                  type="date"
                  value={form.declaration_date}
                  onChange={handleChange}
                />

                <Field
                  label="Assessment Date"
                  name="assessment_date"
                  type="date"
                  value={form.assessment_date}
                  onChange={handleChange}
                />

                <Field
                  label="Payment Date"
                  name="payment_date"
                  type="date"
                  value={form.payment_date}
                  onChange={handleChange}
                />

                <Field
                  label="Release Date"
                  name="release_date"
                  type="date"
                  value={form.release_date}
                  onChange={handleChange}
                />
              </div>

              <div style={sectionTitle}>Inspection</div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                }}
              >
                <input
                  type="checkbox"
                  name="inspection_required"
                  checked={form.inspection_required}
                  onChange={handleChange}
                />
                Inspection Required
              </label>

              {form.inspection_required && (
                <Field
                  label="Inspection Date"
                  name="inspection_date"
                  type="date"
                  value={form.inspection_date}
                  onChange={handleChange}
                />
              )}

              <div style={{ marginTop: "15px" }}>
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows="4"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "25px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={secondaryButton}
                >
                  Cancel
                </button>

                <button type="submit" style={primaryButton}>
                  {editingId ? "Update Case" : "Save Case"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showView && selectedCase && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Clearance Case Details</h2>

              <button
                onClick={() => setShowView(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={detailsGrid}>
              <Detail label="ID" value={selectedCase.id} />

              <Detail
                label="Case Number"
                value={selectedCase.case_number}
              />

              <Detail
                label="Shipment"
                value={getShipmentNo(selectedCase.shipment_id)}
              />

              <Detail
                label="Declaration Number"
                value={selectedCase.declaration_number}
              />

              <Detail
                label="Customs Entry"
                value={selectedCase.customs_entry_number}
              />

              <Detail
                label="Clearance Type"
                value={selectedCase.clearance_type}
              />

              <Detail
                label="Status"
                value={selectedCase.status}
              />

              <Detail
                label="Customs Station"
                value={selectedCase.customs_station}
              />

              <Detail
                label="Port of Entry"
                value={selectedCase.port_of_entry}
              />

              <Detail
                label="Clearing Agent"
                value={selectedCase.clearing_agent}
              />

              <Detail
                label="Declared Value"
                value={
                  selectedCase.declared_value
                    ? `${selectedCase.declared_value} ${selectedCase.currency}`
                    : "-"
                }
              />

              <Detail
                label="Customs Duty"
                value={selectedCase.customs_duty}
              />

              <Detail
                label="Import VAT"
                value={selectedCase.import_vat}
              />

              <Detail
                label="Other Charges"
                value={selectedCase.other_charges}
              />

              <Detail
                label="Total Charges"
                value={`${selectedCase.total_charges || 0} ${
                  selectedCase.currency || "USD"
                }`}
              />

              <Detail
                label="Inspection Required"
                value={
                  selectedCase.inspection_required ? "Yes" : "No"
                }
              />

              <Detail
                label="Inspection Date"
                value={selectedCase.inspection_date}
              />

              <Detail
                label="Declaration Date"
                value={selectedCase.declaration_date}
              />

              <Detail
                label="Assessment Date"
                value={selectedCase.assessment_date}
              />

              <Detail
                label="Payment Date"
                value={selectedCase.payment_date}
              />

              <Detail
                label="Release Date"
                value={selectedCase.release_date}
              />

              <Detail
                label="Remarks"
                value={selectedCase.remarks}
              />

              <Detail
                label="Created At"
                value={selectedCase.created_at}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "25px",
              }}
            >
              <button
                onClick={() => setShowView(false)}
                style={primaryButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label>{label}</label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
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
        padding: "10px 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <strong
        style={{
          display: "block",
          marginBottom: "5px",
        }}
      >
        {label}
      </strong>

      <span>{value || "-"}</span>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  boxSizing: "border-box",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
  marginBottom: "20px",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "700",
  margin: "25px 0 15px",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #ddd",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};

const actionButton = {
  padding: "7px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  background: "white",
  cursor: "pointer",
};

const primaryButton = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "600",
};

const secondaryButton = {
  padding: "10px 16px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  background: "white",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 1000,
};

const modalBox = {
  background: "white",
  width: "100%",
  maxWidth: "1100px",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "12px",
  padding: "25px",
  boxSizing: "border-box",
};

