
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    document_name: "",
    document_type: "",
    document_number: "",
    shipment_id: "",
    description: "",
    status: "Pending",
  });

  useEffect(() => {
    loadDocuments();
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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function saveDocument(e) {
    e.preventDefault();
    setMessage("");

    if (!form.document_name) {
      setMessage("Document Name is required.");
      return;
    }

    const { error } = await supabase.from("documents").insert([
      {
        document_name: form.document_name,
        document_type: form.document_type || null,
        document_number: form.document_number || null,
        shipment_id: form.shipment_id || null,
        description: form.description || null,
        status: form.status,
      },
    ]);

    if (error) {
      setMessage("Error saving document: " + error.message);
      return;
    }

    setMessage("Document created successfully.");

    setForm({
      document_name: "",
      document_type: "",
      document_number: "",
      shipment_id: "",
      description: "",
      status: "Pending",
    });

    loadDocuments();
  }

  return (
    <main style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <h1>Documents</h1>

      <p>Manage import, shipping and clearance documents.</p>

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
                <option value="Commercial Invoice">Commercial Invoice</option>
                <option value="Packing List">Packing List</option>
                <option value="Bill of Lading">Bill of Lading</option>
                <option value="Certificate of Origin">
                  Certificate of Origin
                </option>
                <option value="Import Declaration">Import Declaration</option>
                <option value="Delivery Order">Delivery Order</option>
                <option value="Authorization Letter">
                  Authorization Letter
                </option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Document Number
              <input
                name="document_number"
                value={form.document_number}
                onChange={handleChange}
                placeholder="Enter document number"
                style={inputStyle}
              />
            </label>

            <label>
              Shipment ID
              <input
                name="shipment_id"
                value={form.shipment_id}
                onChange={handleChange}
                placeholder="Enter shipment ID"
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

            <button
              type="submit"
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Save Document
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
                  <th style={thStyle}>Document Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Number</th>
                  <th style={thStyle}>Shipment</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td style={tdStyle}>{doc.document_name || "-"}</td>
                    <td style={tdStyle}>{doc.document_type || "-"}</td>
                    <td style={tdStyle}>{doc.document_number || "-"}</td>
                    <td style={tdStyle}>{doc.shipment_id || "-"}</td>
                    <td style={tdStyle}>{doc.status || "-"}</td>
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
