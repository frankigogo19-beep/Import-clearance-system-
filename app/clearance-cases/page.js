
"use client";
import { useEffect, useState } from "react"; import { supabase } from "../../lib/supabaseClient";
const emptyForm = { case_number: "", shipment_id: "", company_id: "", declaration_no: "", declaration_number: "", customs_entry_number: "", customs_reference: "", tin: "", importer_name: "", clearing_agent: "", hs_code: "", goods_description: "", quantity: "", weight: "", customs_value: "", duty_amount: "", tax_amount: "", other_charges: "", total_charges: "", inspection_status: "Pending", payment_status: "Pending", release_status: "Pending", current_stage: "Declaration", status: "Open", customs_station: "", port_of_entry: "", currency: "USD", assessment_date: "", declaration_date: "", payment_date: "", release_date: "", inspection_required: false, inspection_date: "", remarks: "", };
export default function ClearanceCases() { const [cases, setCases] = useState([]); const [form, setForm] = useState(emptyForm); const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState(null); const [loading, setLoading] = useState(true); const [message, setMessage] = useState("");
useEffect(() => { loadCases(); }, []);
async function loadCases() { setLoading(true);
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
function handleChange(e) { const { name, value, type, checked } = e.target;
setForm((prev) => ({
  ...prev,
  [name]: type === "checkbox" ? checked : value,
}));
}
function openAddForm() { setEditingId(null);
setForm({
  ...emptyForm,
  declaration_date: new Date()
    .toISOString()
    .split("T")[0],
});

setMessage("");
setShowForm(true);
}
function openEditForm(item) { setEditingId(item.id);
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
  inspection_status:
    item.inspection_status || "Pending",
  payment_status:
    item.payment_status || "Pending",
  release_status:
    item.release_status || "Pending",
  current_stage:
    item.current_stage || "Declaration",
  status: item.status || "Open",
  customs_station: item.customs_station || "",
  port_of_entry: item.port_of_entry || "",
  currency: item.currency || "USD",
  assessment_date: item.assessment_date || "",
  declaration_date: item.declaration_date || "",
  payment_date: item.payment_date || "",
  release_date: item.release_date || "",
  inspection_required:
    item.inspection_required || false,
  inspection_date: item.inspection_date || "",
  remarks: item.remarks || "",
});

setMessage("");
setShowForm(true);
}
function closeForm() { setShowForm(false); setEditingId(null); setForm(emptyForm); }
function numberOrNull(value) { if ( value === "" || value === null || value === undefined ) { return null; }
const number = Number(value);

return Number.isNaN(number) ? null : number;
}
async function handleSubmit(e) { e.preventDefault(); setMessage("");
if (!form.case_number.trim()) {
  setMessage("Please enter Case Number.");
  return;
}

const payload = {
  case_number: form.case_number.trim(),

  shipment_id:
    form.shipment_id !== ""
      ? Number(form.shipment_id)
      : null,

  company_id:
    form.company_id !== ""
      ? Number(form.company_id)
      : null,

  declaration_no:
    form.declaration_no.trim() || null,

  declaration_number:
    form.declaration_number.trim() || null,

  customs_entry_number:
    form.customs_entry_number.trim() || null,

  customs_reference:
    form.customs_reference.trim() || null,

  tin:
    form.tin.trim() || null,

  importer_name:
    form.importer_name.trim() || null,

  clearing_agent:
    form.clearing_agent.trim() || null,

  hs_code:
    form.hs_code.trim() || null,

  goods_description:
    form.goods_description.trim() || null,

  quantity: numberOrNull(form.quantity),
  weight: numberOrNull(form.weight),
  customs_value: numberOrNull(form.customs_value),
  duty_amount: numberOrNull(form.duty_amount),
  tax_amount: numberOrNull(form.tax_amount),
  other_charges: numberOrNull(form.other_charges),
  total_charges: numberOrNull(form.total_charges),

  inspection_status:
    form.inspection_status || "Pending",

  payment_status:
    form.payment_status || "Pending",

  release_status:
    form.release_status || "Pending",

  current_stage:
    form.current_stage || "Declaration",

  status:
    form.status || "Open",

  customs_station:
    form.customs_station.trim() || null,

  port_of_entry:
    form.port_of_entry.trim() || null,

  currency:
    form.currency.trim() || "USD",

  assessment_date:
    form.assessment_date || null,

  declaration_date:
    form.declaration_date || null,

  payment_date:
    form.payment_date || null,

  release_date:
    form.release_date || null,

  inspection_required:
    Boolean(form.inspection_required),

  inspection_date:
    form.inspection_date || null,

  remarks:
    form.remarks.trim() || null,

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
async function deleteCase(id) { const confirmed = window.confirm( "Are you sure you want to delete this clearance case?" );
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
return ( <main style={{ padding: "24px", maxWidth: "1500px", margin: "0 auto", }} > <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "20px", }} >  <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700", }} > Clearance Cases 
<p
        style={{
          marginTop: "8px",
          color: "#666",
        }}
      >
        Manage customs clearance cases and related
        customs information.
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
          <Field
            label="Case Number *"
            name="case_number"
            value={form.case_number}
            onChange={handleChange}
            placeholder="CC-0001"
            required
          />

          <Field
            label="Shipment ID"
            name="shipment_id"
            value={form.shipment_id}
            onChange={handleChange}
            type="number"
            placeholder="Shipment ID"
          />

          <Field
            label="Company ID"
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            type="number"
            placeholder="Company ID"
          />

          <Field
            label="Declaration No."
            name="declaration_no"
            value={form.declaration_no}
            onChange={handleChange}
            placeholder="Declaration No."
          />

          <Field
            label="Declaration Number"
            name="declaration_number"
            value={form.declaration_number}
            onChange={handleChange}
            placeholder="Declaration Number"
          />

          <Field
            label="Customs Entry Number"
            name="customs_entry_number"
            value={form.customs_entry_number}
            onChange={handleChange}
            placeholder="Customs Entry Number"
          />

          <Field
            label="Customs Reference"
            name="customs_reference"
            value={form.customs_reference}
            onChange={handleChange}
            placeholder="Customs Reference"
          />

          <Field
            label="TIN"
            name="tin"
            value={form.tin}
            onChange={handleChange}
            placeholder="TIN"
          />

          <Field
            label="Importer Name"
            name="importer_name"
            value={form.importer_name}
            onChange={handleChange}
            placeholder="Importer Name"
          />

          <Field
            label="Clearing Agent"
            name="clearing_agent"
            value={form.clearing_agent}
            onChange={handleChange}
            placeholder="Clearing Agent"
          />

          <Field
            label="HS Code"
            name="hs_code"
            value={form.hs_code}
            onChange={handleChange}
            placeholder="HS Code"
          />

          <Field
            label="Goods Description"
            name="goods_description"
            value={form.goods_description}
            onChange={handleChange}
            placeholder="Goods Description"
          />

          <Field
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
          />

          <Field
            label="Weight"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
          />

          <Field
            label="Customs Value"
            name="customs_value"
            value={form.customs_value}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
          />

          <Field
            label="Duty Amount"
            name="duty_amount"
            value={form.duty_amount}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
          />

          <Field
            label="Tax Amount"
            name="tax_amount"
            value={form.tax_amount}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
          />

          <Field
            label="Other Charges"
            name="other_charges"
            value={form.other_charges}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
          />

          <Field
            label="Total Charges"
            name="total_charges"
            value={form.total_charges}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
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
              <option value="Pending">Pending</option>
              <option value="Cleared">Cleared</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label>Current Stage</label>

            <select
              name="current_stage"
              value={form.current_stage}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Declaration">
                Declaration
              </option>
              <option value="Assessment">
                Assessment
              </option>
              <option value="Payment">Payment</option>
              <option value="Inspection">
                Inspection
              </option>
              <option value="Release">Release</option>
              <option value="Completed">
                Completed
              </option>
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
              <option value="Scheduled">
                Scheduled
              </option>
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
            <label>Payment Status</label>

            <select
              name="payment_status"
              value={form.payment_status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Pending">Pending</option>
              <option value="Partially Paid">
                Partially Paid
              </option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div>
            <label>Release Status</label>

            <select
              name="release_status"
              value={form.release_status}
              onChange={handleChange}
              style={inputStyle}
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
            onChange={handleChange}
            placeholder="Customs Station"
          />

          <Field
            label="Port of Entry"
            name="port_of_entry"
            value={form.port_of_entry}
            onChange={handleChange}
            placeholder="Port of Entry"
          />

          <Field
            label="Assessment Date"
            name="assessment_date"
            value={form.assessment_date}
            onChange={handleChange}
            type="date"
          />

          <Field
            label="Declaration Date"
            name="declaration_date"
            value={form.declaration_date}
            onChange={handleChange}
            type="date"
          />

          <Field
            label="Payment Date"
            name="payment_date"
            value={form.payment_date}
            onChange={handleChange}
            type="date"
          />

          <Field
            label="Release Date"
            name="release_date"
            value={form.release_date}
            onChange={handleChange}
            type="date"
          />

          <Field
            label="Inspection Date"
            name="inspection_date"
            value={form.inspection_date}
            onChange={handleChange}
            type="date"
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              paddingTop: "28px",
            }}
          >
            <input
              type="checkbox"
              name="inspection_required"
              checked={form.inspection_required}
              onChange={handleChange}
              id="inspection_required"
            />

            <label htmlFor="inspection_required">
              Inspection Required
            </label>
          </div>

          <div
            style={{
              gridColumn: "1 / -1",
            }}
          >
            <label>Remarks</label>

            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Additional remarks..."
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
            minWidth: "1500px",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={thStyle}>Case Number</th>
              <th style={thStyle}>Shipment ID</th>
              <th style={thStyle}>Company ID</th>
              <th style={thStyle}>Importer</th>
              <th style={thStyle}>Declaration</th>
              <th style={thStyle}>Customs Station</th>
              <th style={thStyle}>Port of Entry</th>
              <th style={thStyle}>Clearing Agent</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Inspection</th>
              <th style={thStyle}>Payment</th>
              <th style={thStyle}>Release</th>
              <th style={thStyle}>Total Charges</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cases.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>
                  {item.case_number || "-"}
                </td>

                <td style={tdStyle}>
                  {item.shipment_id ?? "-"}
                </td>

                <td style={tdStyle}>
                  {item.company_id ?? "-"}
                </td>

                <td style={tdStyle}>
                  {item.importer_name || "-"}
                </td>

                <td style={tdStyle}>
                  {item.declaration_no ||
                    item.declaration_number ||
                    "-"}
                </td>

                <td style={tdStyle}>
                  {item.customs_station || "-"}
                </td>

                <td style={tdStyle}>
                  {item.port_of_entry || "-"}
                </td>

                <td style={tdStyle}>
                  {item.clearing_agent || "-"}
                </td>

                <td style={tdStyle}>
                  {item.status || "-"}
                </td>

                <td style={tdStyle}>
                  {item.inspection_status || "-"}
                </td>

                <td style={tdStyle}>
                  {item.payment_status || "-"}
                </td>

                <td style={tdStyle}>
                  {item.release_status || "-"}
                </td>

                <td style={tdStyle}>
                  {item.total_charges ?? "-"}
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
); }
function Field({ label, name, value, onChange, type = "text", placeholder = "", required = false, }) { return (  {label}
<input
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    placeholder={placeholder}
    required={required}
    style={inputStyle}
  />
</div>
); }
const inputStyle = { width: "100%", marginTop: "6px", padding: "10px 12px", border: "1px solid #ccc", borderRadius: "7px", boxSizing: "border-box", fontSize: "14px", };
const thStyle = { padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd", whiteSpace: "nowrap", };
const tdStyle = { padding: "12px", borderBottom: "1px solid #eee", whiteSpace: "nowrap", };
