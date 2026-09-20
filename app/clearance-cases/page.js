
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  case_no: "",
  shipment_id: "",
  company_id: "",
  declaration_no: "",
  customs_station: "",
  port_of_entry: "",
  assigned_agent: "",
  status: "Open",
  priority: "Normal",
  inspection_status: "Pending",
  storage_charges: "",
  inspection_charges: "",
  other_charges: "",
  opened_date: "",
  cleared_date: "",
  notes: "",
};

export default function ClearanceCases() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
      setMessage(`Error loading clearance cases: ${error.message}`);
    } else {
      setCases(data || []);
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
    setForm({
      ...emptyForm,
      opened_date: new Date().toISOString().split("T")[0],
    });
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);

    setForm({
      case_no: item.case_no || "",
      shipment_id: item.shipment_id || "",
      company_id: item.company_id || "",
      declaration_no: item.declaration_no || "",
      customs_station: item.customs_station || "",
      port_of_entry: item.port_of_entry || "",
      assigned_agent: item.assigned_agent || "",
      status: item.status || "Open",
      priority: item.priority || "Normal",
      inspection_status: item.inspection_status || "Pending",
      storage_charges: item.storage_charges ?? "",
      inspection_charges: item.inspection_charges ?? "",
      other_charges: item.other_charges ?? "",
      opened_date: item.opened_date || "",
      cleared_date: item.cleared_date || "",
      notes: item.notes || "",
    });

    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!form.case_no.trim()) {
      setMessage("Please enter Case Number.");
      return;
    }

    const payload = {
      case_no: form.case_no.trim(),
      shipment_id: form.shipment_id
        ? Number(form.shipment_id)
        : null,
      company_id: form.company_id
        ? Number(form.company_id)
        : null,
      declaration_no: form.declaration_no || null,
      customs_station: form.customs_station || null,
      port_of_entry: form.port_of_entry || null,
      assigned_agent: form.assigned_agent || null,
      status: form.status || "Open",
      priority: form.priority || "Normal",
      inspection_status: form.inspection_status || "Pending",
      storage_charges: form.storage_charges
        ? Number(form.storage_charges)
        : 0,
      inspection_charges: form.inspection_charges
        ? Number(form.inspection_charges)
        : 0,
      other_charges: form.other_charges
        ? Number(form.other_charges)
        : 0,
      opened_date: form.opened_date || null,
      cleared_date: form.cleared_date || null,
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
      setMessage(
        `Error saving clearance case: ${result.error.message}`
      );
      return;
    }

    setMessage(
      editingId
        ? "Clearance case updated successfully."
        : "Clearance case created successfully."
    );

    closeForm();
    await loadCases();
  }

  async function deleteCase(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this clearance case?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const { error } = await supabase
      .from("clearance_cases")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(
        `Error deleting clearance case: ${error.message}`
      );
      return;
    }

    setMessage("Clearance case deleted successfully.");
    await loadCases();
  }

  return (
    <main
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Clearance Cases
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#666",
            }}
          >
            Manage customs clearance cases and related charges.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            background: "#111827",
            color: "#fff",
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
            marginBottom: "20px",
            padding: "12px 14px",
            borderRadius: "8px",
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
          }}
        >
          {message}
        </div>
      )}

      {showForm && (
        <section
          style={{
            marginBottom: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fff",
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
              {editingId
                ? "Edit Clearance Case"
                : "New Clearance Case"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label>Case Number *</label>
                <input
                  name="case_no"
                  value={form.case_no}
                  onChange={handleChange}
                  placeholder="CC-0001"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Shipment ID</label>
                <input
                  name="shipment_id"
                  value={form.shipment_id}
                  onChange={handleChange}
                  type="number"
                  placeholder="Shipment ID"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Company ID</label>
                <input
                  name="company_id"
                  value={form.company_id}
                  onChange={handleChange}
                  type="number"
                  placeholder="Company ID"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Declaration Number</label>
                <input
                  name="declaration_no"
                  value={form.declaration_no}
                  onChange={handleChange}
                  placeholder="Declaration No."
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Customs Station</label>
                <input
                  name="customs_station"
                  value={form.customs_station}
                  onChange={handleChange}
                  placeholder="Customs Station"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Port of Entry</label>
                <input
                  name="port_of_entry"
                  value={form.port_of_entry}
                  onChange={handleChange}
                  placeholder="Port of Entry"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Assigned Agent</label>
                <input
                  name="assigned_agent"
                  value={form.assigned_agent}
                  onChange={handleChange}
                  placeholder="Assigned Agent"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">
                    In Progress
                  </option>
                  <option value="Pending">
                    Pending
                  </option>
                  <option value="Cleared">Cleared</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label>Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label>Inspection Status</label>
                <select
                  name="inspection_status"
                  value={form.inspection_status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">
                    In Progress
                  </option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                  <option value="Not Required">
                    Not Required
                  </option>
                </select>
              </div>

              <div>
                <label>Storage Charges</label>
                <input
                  name="storage_charges"
                  value={form.storage_charges}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Inspection Charges</label>
                <input
                  name="inspection_charges"
                  value={form.inspection_charges}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Other Charges</label>
                <input
                  name="other_charges"
                  value={form.other_charges}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Opened Date</label>
                <input
                  name="opened_date"
                  value={form.opened_date}
                  onChange={handleChange}
                  type="date"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Cleared Date</label>
                <input
                  name="cleared_date"
                  value={form.cleared_date}
                  onChange={handleChange}
                  type="date"
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional notes..."
                  rows="4"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#16a34a",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {editingId
                  ? "Update Clearance Case"
                  : "Save Clearance Case"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                style={{
                  padding: "12px 20px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 style={{ marginBottom: "16px" }}>
          Clearance Case List
        </h2>

        {loading ? (
          <p>Loading clearance cases...</p>
        ) : cases.length === 0 ? (
          <div
            style={{
              padding: "30px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            No clearance cases found.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #ddd",
              borderRadius: "10px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1200px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f3f4f6",
                  }}
                >
                  <th style={thStyle}>Case No.</th>
                  <th style={thStyle}>Shipment ID</th>
                  <th style={thStyle}>Company ID</th>
                  <th style={thStyle}>Declaration</th>
                  <th style={thStyle}>Customs Station</th>
                  <th style={thStyle}>Port of Entry</th>
                  <th style={thStyle}>Agent</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Inspection</th>
                  <th style={thStyle}>Opened</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {cases.map((item) => (
                  <tr key={item.id}>
                    <td style={tdStyle}>
                      {item.case_no || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.shipment_id || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.company_id || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.declaration_no || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.customs_station || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.port_of_entry || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.assigned_agent || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.status || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.priority || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.inspection_status || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.opened_date || "-"}
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(item)
                          }
                          style={{
                            padding: "7px 10px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            background: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteCase(item.id)
                          }
                          style={{
                            padding: "7px 10px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#dc2626",
                            color: "#fff",
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
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  boxSizing: "border-box",
  fontSize: "14px",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};
