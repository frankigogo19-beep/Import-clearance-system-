"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  company_id: "",
  shipment_id: "",
  container_id: "",
  document_type: "Commercial Invoice",
  document_name: "",
  document_number: "",
  file_url: "",
  file_path: "",
  version: "1",
  status: "Active",
  issued_date: "",
  expiry_date: "",
  uploaded_by: "",
  description: "",
};

const documentTypes = [
  "Commercial Invoice",
  "Packing List",
  "Bill of Lading",
  "Air Waybill",
  "Certificate of Origin",
  "Import Declaration",
  "Customs Entry",
  "Delivery Order",
  "Authorization Letter",
  "Insurance Certificate",
  "Inspection Certificate",
  "Tax Clearance",
  "Other",
];

const statuses = [
  "Active",
  "Pending",
  "Expired",
  "Cancelled",
  "Archived",
];

export default function DocumentsPage() {
  const [form, setForm] = useState(emptyForm);

  const [documents, setDocuments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [containers, setContainers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await Promise.all([
      fetchDocuments(),
      fetchCompanies(),
      fetchShipments(),
      fetchContainers(),
    ]);
  }

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage(
        "Error loading documents: " + error.message
      );
      return;
    }

    setDocuments(data || []);
  }

  async function fetchCompanies() {
    const { data, error } = await supabase
      .from("companies")
      .select("id, name")
      .order("id", { ascending: false });

    if (error) {
      console.log(
        "Company loading error:",
        error.message
      );
      return;
    }

    setCompanies(data || []);
  }

  async function fetchShipments() {
    const { data, error } = await supabase
      .from("shipments")
      .select("id, shipment_no")
      .order("id", { ascending: false });

    if (error) {
      console.log(
        "Shipment loading error:",
        error.message
      );
      return;
    }

    setShipments(data || []);
  }

  async function fetchContainers() {
    const { data, error } = await supabase
      .from("containers")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(
        "Container loading error:",
        error.message
      );
      return;
    }

    setContainers(data || []);
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
      company_id: form.company_id
        ? Number(form.company_id)
        : null,

      shipment_id: form.shipment_id
        ? Number(form.shipment_id)
        : null,

      container_id: form.container_id
        ? Number(form.container_id)
        : null,

      document_type:
        form.document_type || "Other",

      document_name:
        form.document_name.trim(),

      document_number:
        form.document_number.trim() || null,

      file_url:
        form.file_url.trim() || null,

      file_path:
        form.file_path.trim() || null,

      version: form.version
        ? Number(form.version)
        : 1,

      status:
        form.status || "Active",

      issued_date:
        form.issued_date || null,

      expiry_date:
        form.expiry_date || null,

      uploaded_by: form.uploaded_by
        ? Number(form.uploaded_by)
        : null,

      description:
        form.description.trim() || null,
    };

    if (!payload.document_name) {
      setLoading(false);
      setMessage(
        "Document Name is required."
      );
      return;
    }

    const { error } = await supabase
      .from("documents")
      .insert([payload]);

    setLoading(false);

    if (error) {
      setMessage(
        "Error saving document: " +
          error.message
      );
      return;
    }

    setMessage(
      "Document saved successfully."
    );

    setForm(emptyForm);

    await fetchDocuments();
  }

  function getCompanyName(companyId) {
    if (!companyId) return "-";

    const company = companies.find(
      (item) =>
        Number(item.id) === Number(companyId)
    );

    return company?.name ||
      `Company ID ${companyId}`;
  }

  function getShipmentName(shipmentId) {
    if (!shipmentId) return "-";

    const shipment = shipments.find(
      (item) =>
        Number(item.id) === Number(shipmentId)
    );

    return shipment?.shipment_no ||
      `Shipment ID ${shipmentId}`;
  }

  function getContainerName(containerId) {
    if (!containerId) return "-";

    const container = containers.find(
      (item) =>
        Number(item.id) === Number(containerId)
    );

    if (!container) {
      return `Container ID ${containerId}`;
    }

    return (
      container.container_no ||
      container.container_number ||
      container.number ||
      `Container ID ${container.id}`
    );
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px",
      }}
    >
      <h1>Documents</h1>

      <p style={{ color: "#666" }}>
        Manage shipment, customs, clearance,
        and logistics documents.
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
        <h2>Add Document</h2>

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
              Container
              <select
                name="container_id"
                value={form.container_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Container
                </option>

                {containers.map((container) => (
                  <option
                    key={container.id}
                    value={container.id}
                  >
                    {container.container_no ||
                      container.container_number ||
                      container.number ||
                      `Container ${container.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Document Type *
              <select
                name="document_type"
                value={form.document_type}
                onChange={handleChange}
                required
              >
                {documentTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Document Name *
              <input
                name="document_name"
                value={form.document_name}
                onChange={handleChange}
                placeholder="e.g. Invoice TATI 001"
                required
              />
            </label>

            <label>
              Document Number
              <input
                name="document_number"
                value={form.document_number}
                onChange={handleChange}
                placeholder="e.g. INV-2026-001"
              />
            </label>

            <label>
              File URL
              <input
                name="file_url"
                value={form.file_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <label>
              File Path
              <input
                name="file_path"
                value={form.file_path}
                onChange={handleChange}
                placeholder="documents/invoice.pdf"
              />
            </label>

            <label>
              Version
              <input
                type="number"
                min="1"
                name="version"
                value={form.version}
                onChange={handleChange}
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Issued Date
              <input
                type="date"
                name="issued_date"
                value={form.issued_date}
                onChange={handleChange}
              />
            </label>

            <label>
              Expiry Date
              <input
                type="date"
                name="expiry_date"
                value={form.expiry_date}
                onChange={handleChange}
              />
            </label>

            <label>
              Uploaded By
              <input
                type="number"
                name="uploaded_by"
                value={form.uploaded_by}
                onChange={handleChange}
                placeholder="User ID"
              />
            </label>
          </div>

          <label
            style={{
              display: "block",
              marginTop: "15px",
            }}
          >
            Description

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Document description..."
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
              : "Save Document"}
          </button>
        </form>
      </section>

      <section>
        <h2>Document List</h2>

        {documents.length === 0 ? (
          <p>No documents found.</p>
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
                minWidth: "1200px",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Number</th>
                  <th>Company</th>
                  <th>Shipment</th>
                  <th>Container</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Issued</th>
                  <th>Expiry</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>

                    <td>
                      {item.document_name}
                    </td>

                    <td>
                      {item.document_type}
                    </td>

                    <td>
                      {item.document_number ||
                        "-"}
                    </td>

                    <td>
                      {getCompanyName(
                        item.company_id
                      )}
                    </td>

                    <td>
                      {getShipmentName(
                        item.shipment_id
                      )}
                    </td>

                    <td>
                      {getContainerName(
                        item.container_id
                      )}
                    </td>

                    <td>
                      {item.version || 1}
                    </td>

                    <td>
                      {item.status || "Active"}
                    </td>

                    <td>
                      {item.issued_date || "-"}
                    </td>

                    <td>
                      {item.expiry_date || "-"}
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
