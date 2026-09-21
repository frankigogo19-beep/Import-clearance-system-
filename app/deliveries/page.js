"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  delivery_number: "",
  company_id: "",
  shipment_id: "",
  truck_id: "",
  customer_id: "",
  pickup_location: "",
  delivery_location: "",
  pickup_date: "",
  expected_delivery_date: "",
  actual_delivery_date: "",
  delivery_date: "",
  status: "Pending",
  driver_name: "",
  truck_number: "",
  remarks: "",
  notes: "",
};

export default function DeliveriesPage() {
  const [form, setForm] = useState(emptyForm);
  const [deliveries, setDeliveries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setMessage("");

    const [
      deliveriesResult,
      companiesResult,
      shipmentsResult,
      trucksResult,
      customersResult,
    ] = await Promise.all([
      supabase
        .from("deliveries")
        .select("*")
        .order("id", { ascending: false }),

      supabase
        .from("companies")
        .select("*")
        .order("id", { ascending: false }),

      supabase
        .from("shipments")
        .select("*")
        .order("id", { ascending: false }),

      supabase
        .from("trucks")
        .select("*")
        .order("id", { ascending: false }),

      supabase
        .from("customers")
        .select("*")
        .order("id", { ascending: false }),
    ]);

    if (deliveriesResult.error) {
      setMessage(
        "Error loading deliveries: " + deliveriesResult.error.message
      );
    } else {
      setDeliveries(deliveriesResult.data || []);
    }

    if (!companiesResult.error) {
      setCompanies(companiesResult.data || []);
    }

    if (!shipmentsResult.error) {
      setShipments(shipmentsResult.data || []);
    }

    if (!trucksResult.error) {
      setTrucks(trucksResult.data || []);
    }

    if (!customersResult.error) {
      setCustomers(customersResult.data || []);
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

  function getCompanyName(companyId) {
    const company = companies.find(
      (item) => String(item.id) === String(companyId)
    );

    if (!company) return companyId || "-";

    return (
      company.company_name ||
      company.name ||
      company.business_name ||
      `Company #${company.id}`
    );
  }

  function getShipmentName(shipmentId) {
    const shipment = shipments.find(
      (item) => String(item.id) === String(shipmentId)
    );

    if (!shipment) return shipmentId || "-";

    return (
      shipment.shipment_no ||
      shipment.shipment_number ||
      shipment.bl_no ||
      `Shipment #${shipment.id}`
    );
  }

  function getTruckName(truckId) {
    const truck = trucks.find(
      (item) => String(item.id) === String(truckId)
    );

    if (!truck) return truckId || "-";

    return (
      truck.truck_number ||
      truck.registration_number ||
      truck.plate_number ||
      truck.number ||
      `Truck #${truck.id}`
    );
  }

  function getCustomerName(customerId) {
    const customer = customers.find(
      (item) => String(item.id) === String(customerId)
    );

    if (!customer) return customerId || "-";

    return (
      customer.customer_name ||
      customer.name ||
      customer.company_name ||
      customer.full_name ||
      `Customer #${customer.id}`
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      delivery_number: form.delivery_number || null,

      company_id: form.company_id
        ? Number(form.company_id)
        : null,

      shipment_id: form.shipment_id
        ? Number(form.shipment_id)
        : null,

      truck_id: form.truck_id
        ? Number(form.truck_id)
        : null,

      customer_id: form.customer_id
        ? Number(form.customer_id)
        : null,

      pickup_location: form.pickup_location || null,
      delivery_location: form.delivery_location || null,

      pickup_date: form.pickup_date || null,

      expected_delivery_date:
        form.expected_delivery_date || null,

      actual_delivery_date:
        form.actual_delivery_date || null,

      delivery_date: form.delivery_date || null,

      status: form.status || "Pending",

      driver_name: form.driver_name || null,
      truck_number: form.truck_number || null,

      remarks: form.remarks || null,
      notes: form.notes || null,
    };

    const { error } = await supabase
      .from("deliveries")
      .insert([payload]);

    if (error) {
      setMessage("Error saving delivery: " + error.message);
    } else {
      setMessage("Delivery saved successfully.");

      setForm({
        ...emptyForm,
        delivery_number: `DEL-${Date.now()}`,
      });

      await loadAll();
    }

    setSaving(false);
  }

  return (
    <main
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>Deliveries</h1>

      <p style={{ marginBottom: "24px", color: "#666" }}>
        Manage delivery orders, transport details and delivery status.
      </p>

      {message && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: message.toLowerCase().includes("error")
              ? "#ffe5e5"
              : "#e7f7ed",
            color: message.toLowerCase().includes("error")
              ? "#b00020"
              : "#137333",
          }}
        >
          {message}
        </div>
      )}

      <section
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Add Delivery</h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <label>Delivery Number</label>
              <input
                type="text"
                name="delivery_number"
                value={form.delivery_number}
                onChange={handleChange}
                placeholder="DEL-0001"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Company</label>
              <select
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Company</option>

                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {getCompanyName(company.id)}
                  </option>
                ))}
              </select>
            </div>

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
                    {getShipmentName(shipment.id)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Customer</label>
              <select
                name="customer_id"
                value={form.customer_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Customer</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {getCustomerName(customer.id)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Truck</label>
              <select
                name="truck_id"
                value={form.truck_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Truck</option>

                {trucks.map((truck) => (
                  <option key={truck.id} value={truck.id}>
                    {getTruckName(truck.id)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Driver Name</label>
              <input
                type="text"
                name="driver_name"
                value={form.driver_name}
                onChange={handleChange}
                placeholder="Driver full name"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Truck Number</label>
              <input
                type="text"
                name="truck_number"
                value={form.truck_number}
                onChange={handleChange}
                placeholder="T 123 ABC"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Pickup Location</label>
              <input
                type="text"
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                placeholder="Pickup location"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Delivery Location</label>
              <input
                type="text"
                name="delivery_location"
                value={form.delivery_location}
                onChange={handleChange}
                placeholder="Delivery destination"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Pickup Date</label>
              <input
                type="date"
                name="pickup_date"
                value={form.pickup_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Expected Delivery Date</label>
              <input
                type="date"
                name="expected_delivery_date"
                value={form.expected_delivery_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Actual Delivery Date</label>
              <input
                type="date"
                name="actual_delivery_date"
                value={form.actual_delivery_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Delivery Date</label>
              <input
                type="date"
                name="delivery_date"
                value={form.delivery_date}
                onChange={handleChange}
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
                <option value="Pending">Pending</option>
                <option value="Picked Up">Picked Up</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Delivery remarks"
                rows="3"
                style={textareaStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes"
                rows="3"
                style={textareaStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={buttonStyle}
          >
            {saving ? "Saving..." : "Save Delivery"}
          </button>
        </form>
      </section>

      <section
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Delivery List
        </h2>

        {loading ? (
          <p>Loading deliveries...</p>
        ) : deliveries.length === 0 ? (
          <p>No delivery records found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1100px",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Delivery No.</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Shipment</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Truck</th>
                  <th style={thStyle}>Driver</th>
                  <th style={thStyle}>Pickup</th>
                  <th style={thStyle}>Destination</th>
                  <th style={thStyle}>Delivery Date</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>

              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td style={tdStyle}>{delivery.id}</td>

                    <td style={tdStyle}>
                      {delivery.delivery_number || "-"}
                    </td>

                    <td style={tdStyle}>
                      {getCompanyName(delivery.company_id)}
                    </td>

                    <td style={tdStyle}>
                      {getShipmentName(delivery.shipment_id)}
                    </td>

                    <td style={tdStyle}>
                      {getCustomerName(delivery.customer_id)}
                    </td>

                    <td style={tdStyle}>
                      {delivery.truck_number ||
                        getTruckName(delivery.truck_id)}
                    </td>

                    <td style={tdStyle}>
                      {delivery.driver_name || "-"}
                    </td>

                    <td style={tdStyle}>
                      {delivery.pickup_location || "-"}
                    </td>

                    <td style={tdStyle}>
                      {delivery.delivery_location || "-"}
                    </td>

                    <td style={tdStyle}>
                      {delivery.delivery_date ||
                        delivery.actual_delivery_date ||
                        "-"}
                    </td>

                    <td style={tdStyle}>
                      {delivery.status || "Pending"}
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
  padding: "10px 12px",
  marginTop: "6px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  boxSizing: "border-box",
  fontSize: "14px",
};

const textareaStyle = {
  width: "100%",
  padding: "10px 12px",
  marginTop: "6px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  boxSizing: "border-box",
  fontSize: "14px",
  resize: "vertical",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "12px 24px",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "600",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};
Sawa Draven 👍 Nimeangalia deliveries table yako. Schema iko clear, na company_id, shipment_id, truck_id, customer_id zote ni bigint, hivyo tutatumia Number() na null kwa sehemu zilizoachwa wazi ili kuepuka ile foreign-key error.
Sasa badilisha file:
app/deliveries/page.js
weka code hii yote:
JavaScript
Kitu muhimu
Code hii inatumia columns zako halisi:
delivery_number
company_id
shipment_id
truck_id
customer_id
pickup_location
delivery_location
pickup_date
expected_delivery_date
actual_delivery_date
delivery_date
status
remarks
driver_name
truck_number
notes
