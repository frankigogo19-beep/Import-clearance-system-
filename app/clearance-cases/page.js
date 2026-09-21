
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
  customs_office: "",
  port_of_entry: "",
  clearance_status: "Pending",
  inspection_status: "Pending",
  assessment_status: "Pending",
  payment_status: "Pending",
  release_status: "Pending",
  inspection_date: "",
  assessment_date: "",
  payment_date: "",
  release_date: "",
  remarks: "",
};

export default function ClearanceCasesPage() {
  const [form, setForm] = useState(emptyForm);
  const [cases, setCases] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    await Promise.all([
      fetchCases(),
      fetchShipments(),
      fetchCompanies(),
    ]);
  }

  async function fetchCases() {
    const { data, error } = await supabase
      .from("clearance_cases")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage("Error loading clearance cases: " + error.message);
      return;
    }

    setCases(data || []);
  }

  async function fetchShipments() {
    const { data, error } = await supabase
      .from("shipments")
      .select("id, shipment_no")
      .order("id", { ascending: false });

    if (error) {
      console.log("Shipment loading error:", error.message);
      return;
    }

    setShipments(data || []);
  }

  async function fetchCompanies() {
    const { data, error } = await supabase
      .from("companies")
      .select("id, name")
      .order("id", { ascending: false });

    if (error) {
      console.log("Company loading error:", error.message);
      return;
    }

    setCompanies(data || []);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const payload = {
      case_number: form.case_number || null,

      shipment_id: form.shipment_id
        ? Number(form.shipment_id)
        : null,

      company_id: form.company_id
        ? Number(form.company_id)
        : null,

      declaration_no: form.declaration_no || null,
      declaration_number: form.declaration_number || null,
      customs_entry_number: form.customs_entry_number || null,
      customs_reference: form.customs_reference || null,
      tin: form.tin || null,
      importer_name: form.importer_name || null,
      clearing_agent: form.clearing_agent || null,
      customs_office: form.customs_office || null,
      port_of_entry: form.port_of_entry || null,

      clearance_status:
        form.clearance_status || "Pending",

      inspection_status:
        form.inspection_status || "Pending",

      assessment_status:
        form.assessment_status || "Pending",

      payment_status:
        form.payment_status || "Pending",

      release_status:
        form.release_status || "Pending",

      inspection_date:
        form.inspection_date || null,

      assessment_date:
        form.assessment_date || null,

      payment_date:
        form.payment_date || null,

      release_date:
        form.release_date || null,

      remarks: form.remarks || null,
    };

    const { error } = await supabase
      .from("clearance_cases")
      .insert([payload]);

    setLoading(false);

    if (error) {
      setMessage(
        "Error saving clearance case: " +
          error.message
      );
      return;
    }

    setMessage(
      "Clearance case saved successfully."
    );

    setForm(emptyForm);

    await fetchCases();
  }

  function getShipmentName(shipmentId) {
    if (!shipmentId) return "-";

    const shipment = shipments.find(
      (item) => Number(item.id) === Number(shipmentId)
    );

    if (!shipment) {
      return `Shipment ID ${shipmentId}`;
    }

    return shipment.shipment_no
      ? shipment.shipment_no
      : `Shipment ID ${shipment.id}`;
  }

  function getCompanyName(companyId) {
    if (!companyId) return "-";

    const company = companies.find(
      (item) => Number(item.id) === Number(companyId)
    );

    if (!company) {
      return `Company ID ${companyId}`;
    }

    return company.name
      ? company.name
      : `Company ID ${company.id}`;
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px",
      }}
    >
      <h1>Clearance Cases</h1>

      <p style={{ color: "#666" }}>
        Manage customs clearance cases and track
        the clearance process.
      </p>

      {message && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "#f1f1f1",
          }}
        >
          {message}
        </div>
      )}

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h2>Add Clearance Case</h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "15px",
            }}
          >
            <label>
              Case Number *
              <input
                name="case_number"
                value={form.case_number}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Shipment
              <select
                name="shipment_id"
                value={form.shipment_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Shipment
                </option>

                {shipments.map((shipment) => (
                  <option
                    key={shipment.id}
                    value={shipment.id}
                  >
                    {shipment.shipment_no ||
                      `Shipment ${shipment.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Company
              <select
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Company
                </option>

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name ||
                      `Company ${company.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Declaration No
              <input
                name="declaration_no"
                value={form.declaration_no}
                onChange={handleChange}
              />
            </label>

            <label>
              Declaration Number
              <input
                name="declaration_number"
                value={form.declaration_number}
                onChange={handleChange}
              />
            </label>

            <label>
              Customs Entry Number
              <input
                name="customs_entry_number"
                value={form.customs_entry_number}
                onChange={handleChange}
              />
            </label>

            <label>
              Customs Reference
              <input
                name="customs_reference"
                value={form.customs_reference}
                onChange={handleChange}
              />
            </label>

            <label>
              TIN
              <input
                name="tin"
                value={form.tin}
                onChange={handleChange}
              />
            </label>

            <label>
              Importer Name
              <input
                name="importer_name"
                value={form.importer_name}
                onChange={handleChange}
              />
            </label>

            <label>
              Clearing Agent
              <input
                name="clearing_agent"
                value={form.clearing_agent}
                onChange={handleChange}
              />
            </label>

            <label>
              Customs Office
              <input
                name="customs_office"
                value={form.customs_office}
                onChange={handleChange}
              />
            </label>

            <label>
              Port of Entry
              <input
                name="port_of_entry"
                value={form.port_of_entry}
                onChange={handleChange}
              />
            </label>

            <label>
              Clearance Status
              <select
                name="clearance_status"
                value={form.clearance_status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Rejected</option>
                <option>Cancelled</option>
              </select>
            </label>

            <label>
              Inspection Status
              <select
                name="inspection_status"
                value={form.inspection_status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Scheduled</option>
                <option>Inspected</option>
                <option>Not Required</option>
              </select>
            </label>

            <label>
              Assessment Status
              <select
                name="assessment_status"
                value={form.assessment_status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Completed</option>
                <option>Not Required</option>
              </select>
            </label>

            <label>
              Payment Status
              <select
                name="payment_status"
                value={form.payment_status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Partially Paid</option>
                <option>Not Required</option>
              </select>
            </label>

            <label>
              Release Status
              <select
                name="release_status"
                value={form.release_status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Released</option>
                <option>Not Released</option>
              </select>
            </label>

            <label>
              Inspection Date
              <input
                type="date"
                name="inspection_date"
                value={form.inspection_date}
                onChange={handleChange}
              />
            </label>

            <label>
              Assessment Date
              <input
                type="date"
                name="assessment_date"
                value={form.assessment_date}
                onChange={handleChange}
              />
            </label>

            <label>
              Payment Date
              <input
                type="date"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
              />
            </label>

            <label>
              Release Date
              <input
                type="date"
                name="release_date"
                value={form.release_date}
                onChange={handleChange}
              />
            </label>
          </div>

          <label
            style={{
              display: "block",
              marginTop: "15px",
            }}
          >
            Remarks

            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows="4"
              style={{
                width: "100%",
                marginTop: "5px",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Saving..."
              : "Save Clearance Case"}
          </button>
        </form>
      </section>

      <section>
        <h2>Clearance Case List</h2>

        {cases.length === 0 ? (
          <p>No clearance cases found.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1100px",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Case Number</th>
                  <th>Shipment</th>
                  <th>Company</th>
                  <th>Declaration No</th>
                  <th>TIN</th>
                  <th>Importer</th>
                  <th>Clearance</th>
                  <th>Inspection</th>
                  <th>Payment</th>
                  <th>Release</th>
                </tr>
              </thead>

              <tbody>
                {cases.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>

                    <td>
                      {item.case_number || "-"}
                    </td>

                    <td>
                      {getShipmentName(
                        item.shipment_id
                      )}
                    </td>

                    <td>
                      {getCompanyName(
                        item.company_id
                      )}
                    </td>

                    <td>
                      {item.declaration_no || "-"}
                    </td>

                    <td>{item.tin || "-"}</td>

                    <td>
                      {item.importer_name || "-"}
                    </td>

                    <td>
                      {item.clearance_status ||
                        "Pending"}
                    </td>

                    <td>
                      {item.inspection_status ||
                        "Pending"}
                    </td>

                    <td>
                      {item.payment_status ||
                        "Pending"}
                    </td>

                    <td>
                      {item.release_status ||
                        "Pending"}
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
