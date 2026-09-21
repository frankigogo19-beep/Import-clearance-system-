"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  case_number: "",
  shipment_id: "",
  company_id: "",
  declaration_no: "",
  declaration_number: "",
  customs_entry_number: "",
  customs_reference: "",
  tin: "",
  importer_name: "",
  clearing_agent: "",
  hs_code: "",
  goods_description: "",
  quantity: "",
  weight: "",
  customs_value: "",
  duty_amount: "",
  tax_amount: "",
  other_charges: "",
  total_charges: "",
  inspection_status: "Pending",
  payment_status: "Pending",
  release_status: "Pending",
  current_stage: "Declaration",
  status: "Open",
  customs_station: "",
  port_of_entry: "",
  currency: "USD",
  assessment_date: "",
  declaration_date: "",
  payment_date: "",
  release_date: "",
  inspection_required: false,
  inspection_date: "",
  remarks: "",
};

export default function ClearanceCasesPage() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("clearance_cases")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setError(`Error loading clearance cases: ${error.message}`);
      setCases([]);
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

  function openAddForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      declaration_date: new Date().toISOString().split("T")[0],
    });

    setError("");
    setShowForm(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);

    setForm({
      case_number: item.case_number || "",
      shipment_id: item.shipment_id ?? "",
      company_id: item.company_id ?? "",
      declaration_no: item.declaration_no || "",
      declaration_number: item.declaration_number || "",
      customs_entry_number: item.customs_entry_number || "",
      customs_reference: item.customs_reference || "",
      tin: item.tin || "",
      importer_name: item.importer_name || "",
      clearing_agent: item.clearing_agent || "",
      hs_code: item.hs_code || "",
      goods_description: item.goods_description || "",
      quantity: item.quantity ?? "",
      weight: item.weight ?? "",
      customs_value: item.customs_value ?? "",
      duty_amount: item.duty_amount ?? "",
      tax_amount: item.tax_amount ?? "",
      other_charges: item.other_charges ?? "",
      total_charges: item.total_charges ?? "",
      inspection_status: item.inspection_status || "Pending",
      payment_status: item.payment_status || "Pending",
      release_status: item.release_status || "Pending",
      current_stage: item.current_stage || "Declaration",
      status: item.status || "Open",
      customs_station: item.customs_station || "",
      port_of_entry: item.port_of_entry || "",
      currency: item.currency || "USD",
      assessment_date: item.assessment_date || "",
      declaration_date: item.declaration_date || "",
      payment_date: item.payment_date || "",
      release_date: item.release_date || "",
      inspection_required: item.inspection_required || false,
      inspection_date: item.inspection_date || "",
      remarks: item.remarks || "",
    });

    setError("");
    setShowForm(true);
  }

  function numberOrNull(value) {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const number = Number(value);
    return Number.isNaN(number) ? null : number;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.case_number.trim()) {
      setError("Case Number is required.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      case_number: form.case_number.trim(),

      shipment_id:
        form.shipment_id === "" ? null : Number(form.shipment_id),

      company_id:
        form.company_id === "" ? null : Number(form.company_id),

      declaration_no: form.declaration_no || null,
      declaration_number: form.declaration_number || null,
      customs_entry_number: form.customs_entry_number || null,
      customs_reference: form.customs_reference || null,
      tin: form.tin || null,
      importer_name: form.importer_name || null,
      clearing_agent: form.clearing_agent || null,
      hs_code: form.hs_code || null,
      goods_description: form.goods_description || null,

      quantity: numberOrNull(form.quantity),
      weight: numberOrNull(form.weight),
      customs_value: numberOrNull(form.customs_value),
      duty_amount: numberOrNull(form.duty_amount),
      tax_amount: numberOrNull(form.tax_amount),
      other_charges: numberOrNull(form.other_charges),
      total_charges: numberOrNull(form.total_charges),

      inspection_status: form.inspection_status || null,
      payment_status: form.payment_status || null,
      release_status: form.release_status || null,
      current_stage: form.current_stage || null,
      status: form.status || null,

      customs_station: form.customs_station || null,
      port_of_entry: form.port_of_entry || null,
      currency: form.currency || null,

      assessment_date: form.assessment_date || null,
      declaration_date: form.declaration_date || null,
      payment_date: form.payment_date || null,
      release_date: form.release_date || null,
      inspection_date: form.inspection_date || null,

      inspection_required: Boolean(form.inspection_required),

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
      console.error(result.error);
      setError(`Error saving clearance case: ${result.error.message}`);
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setSaving(false);

    await loadCases();
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
      setError(`Error deleting clearance case: ${error.message}`);
      return;
    }

    await loadCases();
  }

  function Field({ label, name, type = "text", value, placeholder = "" }) {
    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <input
          style={styles.input}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Clearance Cases</h1>
          <p style={styles.subtitle}>
            Manage customs clearance cases and related charges.
          </p>
        </div>

        <button style={styles.primaryButton} onClick={openAddForm}>
          + Add Clearance Case
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <section style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>
              {editingId ? "Edit Clearance Case" : "New Clearance Case"}
            </h2>

            <button
              style={styles.closeButton}
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setError("");
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.grid}>
              <Field
                label="Case Number *"
                name="case_number"
                value={form.case_number}
              />

              <Field
                label="Shipment ID"
                name="shipment_id"
                type="number"
                value={form.shipment_id}
              />

              <Field
                label="Company ID"
                name="company_id"
                type="number"
                value={form.company_id}
              />

              <Field
                label="Declaration No."
                name="declaration_no"
                value={form.declaration_no}
              />

              <Field
                label="Declaration Number"
                name="declaration_number"
                value={form.declaration_number}
              />

              <Field
                label="Customs Entry Number"
                name="customs_entry_number"
                value={form.customs_entry_number}
              />

              <Field
                label="Customs Reference"
                name="customs_reference"
                value={form.customs_reference}
              />

              <Field label="TIN" name="tin" value={form.tin} />

              <Field
                label="Importer Name"
                name="importer_name"
                value={form.importer_name}
              />

              <Field
                label="Clearing Agent"
                name="clearing_agent"
                value={form.clearing_agent}
              />

              <Field
                label="HS Code"
                name="hs_code"
                value={form.hs_code}
              />

              <Field
                label="Goods Description"
                name="goods_description"
                value={form.goods_description}
              />

              <Field
                label="Quantity"
                name="quantity"
                type="number"
                value={form.quantity}
              />

              <Field
                label="Weight"
                name="weight"
                type="number"
                value={form.weight}
              />

              <Field
                label="Customs Value"
                name="customs_value"
                type="number"
                value={form.customs_value}
              />

              <Field
                label="Duty Amount"
                name="duty_amount"
                type="number"
                value={form.duty_amount}
              />

              <Field
                label="Tax Amount"
                name="tax_amount"
                type="number"
                value={form.tax_amount}
              />

              <Field
                label="Other Charges"
                name="other_charges"
                type="number"
                value={form.other_charges}
              />

              <Field
                label="Total Charges"
                name="total_charges"
                type="number"
                value={form.total_charges}
              />

              <div style={styles.field}>
                <label style={styles.label}>Currency</label>
                <select
                  style={styles.input}
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD</option>
                  <option value="TZS">TZS</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.input}
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Current Stage</label>
                <select
                  style={styles.input}
                  name="current_stage"
                  value={form.current_stage}
                  onChange={handleChange}
                >
                  <option value="Declaration">Declaration</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Payment">Payment</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Release">Release</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Inspection Status</label>
                <select
                  style={styles.input}
                  name="inspection_status"
                  value={form.inspection_status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                  <option value="Not Required">Not Required</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Payment Status</label>
                <select
                  style={styles.input}
                  name="payment_status"
                  value={form.payment_status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Release Status</label>
                <select
                  style={styles.input}
                  name="release_status"
                  value={form.release_status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Released">Released</option>
                </select>
              </div>

              <Field
                label="Customs Station"
                name="customs_station"
                value={form.customs_station}
              />

              <Field
                label="Port of Entry"
                name="port_of_entry"
                value={form.port_of_entry}
              />

              <Field
                label="Assessment Date"
                name="assessment_date"
                type="date"
                value={form.assessment_date}
              />

              <Field
                label="Declaration Date"
                name="declaration_date"
                type="date"
                value={form.declaration_date}
              />

              <Field
                label="Payment Date"
                name="payment_date"
                type="date"
                value={form.payment_date}
              />

              <Field
                label="Release Date"
                name="release_date"
                type="date"
                value={form.release_date}
              />

              <Field
                label="Inspection Date"
                name="inspection_date"
                type="date"
                value={form.inspection_date}
              />

              <div style={styles.checkboxField}>
                <input
                  type="checkbox"
                  name="inspection_required"
                  checked={form.inspection_required}
                  onChange={handleChange}
                />
                <label>Inspection Required</label>
              </div>

              <div style={styles.fullWidth}>
                <label style={styles.label}>Remarks</label>
                <textarea
                  style={styles.textarea}
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter remarks..."
                />
              </div>
            </div>

            <div style={styles.formActions}>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Clearance Case"
                  : "Save Clearance Case"}
              </button>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section style={styles.listCard}>
        <h2 style={styles.listTitle}>Clearance Case List</h2>

        {loading ? (
          <p>Loading clearance cases...</p>
        ) : cases.length === 0 ? (
          <p>No clearance cases found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Case Number</th>
                  <th style={styles.th}>Shipment ID</th>
                  <th style={styles.th}>Company ID</th>
                  <th style={styles.th}>Importer</th>
                  <th style={styles.th}>Declaration</th>
                  <th style={styles.th}>Customs Station</th>
                  <th style={styles.th}>Port of Entry</th>
                  <th style={styles.th}>Clearing Agent</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Inspection</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Release</th>
                  <th style={styles.th}>Total Charges</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {cases.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.case_number || "-"}</td>
                    <td style={styles.td}>{item.shipment_id ?? "-"}</td>
                    <td style={styles.td}>{item.company_id ?? "-"}</td>
                    <td style={styles.td}>{item.importer_name || "-"}</td>
                    <td style={styles.td}>
                      {item.declaration_number ||
                        item.declaration_no ||
                        "-"}
                    </td>
                    <td style={styles.td}>
                      {item.customs_station || "-"}
                    </td>
                    <td style={styles.td}>
                      {item.port_of_entry || "-"}
                    </td>
                    <td style={styles.td}>
                      {item.clearing_agent || "-"}
                    </td>
                    <td style={styles.td}>{item.status || "-"}</td>
                    <td style={styles.td}>
                      {item.inspection_status || "-"}
                    </td>
                    <td style={styles.td}>
                      {item.payment_status || "-"}
                    </td>
                    <td style={styles.td}>
                      {item.release_status || "-"}
                    </td>
                    <td style={styles.td}>
                      {item.total_charges ?? "-"}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.editButton}
                          onClick={() => openEditForm(item)}
                        >
                          Edit
                        </button>

                        <button
                          style={styles.deleteButton}
                          onClick={() => deleteCase(item.id)}
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

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    marginTop: "8px",
    color: "#666",
  },

  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryButton: {
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
  },

  formCard: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
  },

  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  formTitle: {
    margin: 0,
    fontSize: "22px",
  },

  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: "28px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontWeight: "600",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontSize: "14px",
    resize: "vertical",
  },

  fullWidth: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  checkboxField: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingTop: "28px",
  },

  formActions: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    flexWrap: "wrap",
  },

  listCard: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
  },

  listTitle: {
    marginTop: 0,
    marginBottom: "18px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1400px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #ddd",
    background: "#f5f5f5",
    whiteSpace: "nowrap",
    fontSize: "13px",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  actionButtons: {
    display: "flex",
    gap: "8px",
  },

  editButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "7px 10px",
    cursor: "pointer",
  },

  deleteButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "7px 10px",
    cursor: "pointer",
  },
};
