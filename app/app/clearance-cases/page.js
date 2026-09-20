
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  case_no: "",
  shipment_id: "",
  company_id: "",
  declaration_no: "",
  customs_entry_no: "",
  port_of_entry: "",
  clearance_status: "Pending",
  assigned_agent: "",
  inspection_required: false,
  inspection_date: "",
  release_date: "",
  notes: "",
};

const statuses = [
  "Pending",
  "Declaration Submitted",
  "Under Review",
  "Inspection",
  "Customs Assessment",
  "Duty Paid",
  "Released",
  "Closed",
];

export default function ClearanceCasesPage() {
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    setLoading(true);

    const { data, error } = await supabase
      .from("clearance_cases")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage("Error loading clearance cases: " + error.message);
    } else {
      setCases(data || []);
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

  function openNewForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setShowForm(true);
  }

  function editCase(item) {
    setEditingId(item.id);

    setForm({
      case_no: item.case_no || "",
      shipment_id: item.shipment_id || "",
      company_id: item.company_id || "",
      declaration_no: item.declaration_no || "",
      customs_entry_no: item.customs_entry_no || "",
      port_of_entry: item.port_of_entry || "",
      clearance_status: item.clearance_status || "Pending",
      assigned_agent: item.assigned_agent || "",
      inspection_required: item.inspection_required || false,
      inspection_date: item.inspection_date || "",
      release_date: item.release_date || "",
      notes: item.notes || "",
    });

    setMessage("");
    setShowForm(true);
  }

  async function saveCase(e) {
    e.preventDefault();
    setMessage("");

    const payload = {
      case_no: form.case_no || null,
      shipment_id: form.shipment_id
        ? Number(form.shipment_id)
        : null,
      company_id: form.company_id
        ? Number(form.company_id)
        : null,
      declaration_no: form.declaration_no || null,
      customs_entry_no: form.customs_entry_no || null,
      port_of_entry: form.port_of_entry || null,
      clearance_status: form.clearance_status,
      assigned_agent: form.assigned_agent || null,
      inspection_required: form.inspection_required,
      inspection_date: form.inspection_date || null,
      release_date: form.release_date || null,
      notes: form.notes || null,
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

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);

    loadCases();
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
    loadCases();
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "8px" }}>Clearance Cases</h1>
          <p style={{ margin: 0, color: "#666" }}>
            Manage customs clearance cases and cargo release.
          </p>
        </div>

        <button
          onClick={openNewForm}
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#111827",
            color: "white",
            fontWeight: "600",
          }}
        >
          + Add Clearance Case
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
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px",
            background: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0 }}>
              {editingId ? "Edit Clearance Case" : "New Clearance Case"}
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "white",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          <form onSubmit={saveCase}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label>Case Number *</label>
                <input
                  name="case_no"
                  value={form.case_no}
                  onChange={handleChange}
                  required
                  placeholder="CC-0001"
                />
              </div>

              <div>
                <label>Shipment ID</label>
                <input
                  name="shipment_id"
                  type="number"
                  value={form.shipment_id}
                  onChange={handleChange}
                  placeholder="Shipment ID"
                />
              </div>

              <div>
                <label>Company ID</label>
                <input
                  name="company_id"
                  type="number"
                  value={form.company_id}
                  onChange={handleChange}
                  placeholder="Company ID"
                />
              </div>

              <div>
                <label>Declaration Number</label>
                <input
                  name="declaration_no"
                  value={form.declaration_no}
                  onChange={handleChange}
                  placeholder="Declaration number"
                />
              </div>

              <div>
                <label>Customs Entry Number</label>
                <input
                  name="customs_entry_no"
                  value={form.customs_entry_no}
                  onChange={handleChange}
                  placeholder="Customs entry number"
                />
              </div>

              <div>
                <label>Port of Entry</label>
                <input
                  name="port_of_entry"
                  value={form.port_of_entry}
                  onChange={handleChange}
                  placeholder="e.g. Dar es Salaam Port"
                />
              </div>

              <div>
                <label>Clearance Status</label>
                <select
                  name="clearance_status"
                  value={form.clearance_status}
                  onChange={handleChange}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Assigned Clearing Agent</label>
                <input
                  name="assigned_agent"
                  value={form.assigned_agent}
                  onChange={handleChange}
                  placeholder="Agent name"
                />
              </div>

              <div>
                <label>Inspection Date</label>
                <input
                  name="inspection_date"
                  type="date"
                  value={form.inspection_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Release Date</label>
                <input
                  name="release_date"
                  type="date"
                  value={form.release_date}
                  onChange={handleChange}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "25px",
                }}
              >
                <input
                  name="inspection_required"
                  type="checkbox"
                  checked={form.inspection_required}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px" }}
                />
                <label style={{ margin: 0 }}>
                  Inspection Required
                </label>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional clearance notes"
                rows="4"
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#111827",
                color: "white",
                fontWeight: "600",
              }}
            >
              {editingId ? "Update Clearance Case" : "Save Clearance Case"}
            </button>
          </form>
        </section>
      )}

      <section>
        <h2>Clearance Case List</h2>

        {loading ? (
          <p>Loading clearance cases...</p>
        ) : cases.length === 0 ? (
          <p>No clearance cases found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr>
                  <th>Case No.</th>
                  <th>Shipment ID</th>
                  <th>Company ID</th>
                  <th>Declaration</th>
                  <th>Port of Entry</th>
                  <th>Status</th>
                  <th>Agent</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {cases.map((item) => (
                  <tr key={item.id}>
                    <td>{item.case_no || "-"}</td>
                    <td>{item.shipment_id || "-"}</td>
                    <td>{item.company_id || "-"}</td>
                    <td>{item.declaration_no || "-"}</td>
                    <td>{item.port_of_entry || "-"}</td>
                    <td>{item.clearance_status || "-"}</td>
                    <td>{item.assigned_agent || "-"}</td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() => editCase(item)}
                          style={{
                            padding: "7px 10px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            background: "white",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteCase(item.id)}
                          style={{
                            padding: "7px 10px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#dc2626",
                            color: "white",
                            cursor: "pointer",
                          }}
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
      </section>
    </main>
  );
