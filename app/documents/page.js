"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    document_name: "",
    document_type: "",
    document_number: "",
    shipment_id: "",
    container_id: "",
    file_url: "",
    file_path: "",
    version: "1",
    status: "Pending",
    issued_date: "",
    expiry_date: "",
    uploaded_by: "",
    description: "",
  });

  useEffect(() => {
    loadDocuments();
    loadShipments();
  }, []);

  async function loadDocuments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading documents: " + error.message);
    } else {
      setDocuments(data || []);
    }

    setLoading(false);
  }

  async function loadShipments() {
    const { data, error } = await supabase
      .from("shipments")
      .select("id, shipment_no")
      .order("id", { ascending: false });

    if (error) {
      setMessage("Error loading shipments: " + error.message);
      return;
    }

    setShipments(data || []);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function saveDocument(e) {
    e.preventDefault();
    setMessage("");

    if (!form.document_name.trim()) {
      setMessage("Document Name is required.");
      return;
    }

    setSaving(true);

    const documentData = {
      document_name: form.document_name.trim(),
      document_type: form.document_type || null,
      document_number: form.document_number || null,
      shipment_id: form.shipment_id
        ? Number(form.shipment_id)
        : null,
      container_id: form.container_id
        ? Number(form.container_id)
        : null,
      file_url: form.file_url || null,
      file_path: form.file_path || null,
      version: form.version
        ? Number(form.version)
        : 1,
      status: form.status || "Pending",
      issued_date: form.issued_date || null,
      expiry_date: form.expiry_date || null,
      uploaded_by: form.uploaded_by || null,
      description: form.description || null,
    };

    const { error } = await supabase
      .from("documents")
      .insert([documentData]);

    setSaving(false);

    if (error) {
      console.error(error);
      setMessage("Error saving document: " + error.message);
      return;
    }

    setMessage("Document created successfully.");

    setForm({
      document_name: "",
      document_type: "",
      document_number: "",
      shipment_id: "",
      container_id: "",
      file_url: "",
      file_path: "",
      version: "1",
      status: "Pending",
      issued_date: "",
      expiry_date: "",
      uploaded_by: "",
      description: "",
    });

    loadDocuments();
  }

  function getShipmentNumber(shipmentId) {
    const shipment = shipments.find(
      (item) => String(item.id) === String(shipmentId)
    );

    return shipment?.shipment_no || shipmentId || "-";
  }

  return (
    <main
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <h1>Documents</h1>

      <p>
        Manage import, shipping and clearance documents.
      </p>

      {message && (
        <div
          style={{
            padding: "12px",
            margin: "15px 0",
            background: "#f3f4f6",
            borderRadius: "8px",
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
          marginTop: "20px",
        }}
      >
        <h2>Add Document</h2>

        <form onSubmit={saveDocument}>
          <div style={{ display: "grid", gap: "15px" }}>

            <label>
              Document Name *
              <input
                name="document_name"
                value={form.document_name}
                onChange={handleChange}
                placeholder="e.g. Commercial Invoice"
                required
                style={inputStyle}
              />
            </label>

            <label>
              Document Type
              <select
                name="document_type"
                value={form.document_type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Type</option>
                <option value="Commercial Invoice">
                  Commercial Invoice
                </option>
                <option value="Packing List">
                  Packing List
                </option>
                <option value="Bill of Lading">
                  Bill of Lading
                </option>
                <option value="Certificate of Origin">
                  Certificate of Origin
                </option>
                <option value="Import Declaration">
                  Import Declaration
                </option>
                <option value="Delivery Order">
                  Delivery Order
                </option>
                <option value="Authorization Letter">
                  Authorization Letter
                </option>
                <option value="Customs Declaration">
                  Customs Declaration
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </label>

            <label>
              Document Number
              <input
                name="document_number"
                value={form.document_number}
                onChange={handleChange}
                placeholder="e.g. INV-0001"
                style={inputStyle}
              />
            </label>

            <label>
              Shipment
              <select
                name="shipment_id"
                value={form.shipment_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Shipment
                </option>

                {shipments.map((shipment) => (
                  <option
                    key={shipment.id}
                    value={shipment.id}
                  >
                    {shipment.shipment_no
                      ? `${shipment.shipment_no} (ID: ${shipment.id})`
                      : `Shipment #${shipment.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Container ID
              <input
                name="container_id"
                type="number"
                value={form.container_id}
                onChange={handleChange}
                placeholder="Optional container ID"
                style={inputStyle}
              />
            </label>

            <label>
              Version
              <input
                name="version"
                type="number"
                min="1"
                value={form.version}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Pending">Pending</option>
                <option value="Received">Received</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>

            <label>
              Issued Date
              <input
                type="date"
                name="issued_date"
                value={form.issued_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>

            <label>
              Expiry Date
              <input
                type="date"
                name="expiry_date"
                value={form.expiry_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>

            <label>
              Uploaded By
              <input
                name="uploaded_by"
                value={form.uploaded_by}
                onChange={handleChange}
                placeholder="Name of uploader"
                style={inputStyle}
              />
            </label>

            <label>
              File URL
              <input
                name="file_url"
                value={form.file_url}
                onChange={handleChange}
                placeholder="Optional file URL"
                style={inputStyle}
              />
            </label>

            <label>
              File Path
              <input
                name="file_path"
                value={form.file_path}
                onChange={handleChange}
                placeholder="Optional file path"
                style={inputStyle}
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Document description"
                rows="4"
                style={inputStyle}
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {saving ? "Saving..." : "Save Document"}
            </button>

          </div>
        </form>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2>Document List</h2>

        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents found.</p>
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
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Document Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Number</th>
                  <th style={thStyle}>Shipment</th>
                  <th style={thStyle}>Version</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Issued</th>
                  <th style={thStyle}>Expiry</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td style={tdStyle}>
                      {doc.id}
                    </td>

                    <td style={tdStyle}>
                      {doc.document_name || "-"}
                    </td>

                    <td style={tdStyle}>
                      {doc.document_type || "-"}
                    </td>

                    <td style={tdStyle}>
                      {doc.document_number || "-"}
                    </td>

                    <td style={tdStyle}>
                      {getShipmentNumber(doc.shipment_id)}
                    </td>

                    <td style={tdStyle}>
                      {doc.version || "-"}
                    </td>

                    <td style={tdStyle}>
                      {doc.status || "-"}
                    </td>

                    <td style={tdStyle}>
                      {doc.issued_date || "-"}
                    </td>

                    <td style={tdStyle}>
                      {doc.expiry_date || "-"}
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
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

