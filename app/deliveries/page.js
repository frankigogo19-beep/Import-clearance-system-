"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  delivery_number: "",
  company_id: "",
  shipment_id: "",
  truck_id: "",
  customer_id: "",
  driver_name: "",
  truck_number: "",
  pickup_location: "",
  delivery_location: "",
  pickup_date: "",
  expected_delivery_date: "",
  actual_delivery_date: "",
  delivery_date: "",
  status: "Pending",
  remarks: "",
  notes: "",
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
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
        .select("id, name")
        .order("name", { ascending: true }),

      supabase
        .from("shipments")
        .select("id, shipment_no")
        .order("id", { ascending: false }),

      supabase
        .from("trucks")
        .select("id, registration_no, driver_name")
        .order("id", { ascending: false }),

      supabase
        .from("customers")
        .select("id, name")
        .order("name", { ascending: true }),
    ]);

    if (deliveriesResult.error) {
      setMessage(
        "Error loading deliveries: " + deliveriesResult.error.message
      );
    }

    if (companiesResult.error) {
      console.log("Companies error:", companiesResult.error.message);
    }

    if (shipmentsResult.error) {
      console.log("Shipments error:", shipmentsResult.error.message);
    }

    if (trucksResult.error) {
      console.log("Trucks error:", trucksResult.error.message);
    }

    if (customersResult.error) {
      console.log("Customers error:", customersResult.error.message);
    }

    setDeliveries(deliveriesResult.data || []);
    setCompanies(companiesResult.data || []);
    setShipments(shipmentsResult.data || []);
    setTrucks(trucksResult.data || []);
    setCustomers(customersResult.data || []);

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Automatically fill truck number and driver name
    // when a truck is selected.
    if (name === "truck_id") {
      const selectedTruck = trucks.find(
        (truck) => String(truck.id) === String(value)
      );

      if (selectedTruck) {
        setForm((previous) => ({
          ...previous,
          truck_id: value,
          truck_number: selectedTruck.registration_no || "",
          driver_name: selectedTruck.driver_name || "",
        }));
      }
    }
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

      driver_name: form.driver_name || null,
      truck_number: form.truck_number || null,

      pickup_location: form.pickup_location || null,
      delivery_location: form.delivery_location || null,

      pickup_date: form.pickup_date || null,
      expected_delivery_date: form.expected_delivery_date || null,
      actual_delivery_date: form.actual_delivery_date || null,
      delivery_date: form.delivery_date || null,

      status: form.status || "Pending",

      remarks: form.remarks || null,
      notes: form.notes || null,
    };

    const { error } = await supabase
      .from("deliveries")
      .insert([payload]);

    if (error) {
      setMessage("Error saving delivery: " + error.message);
      setSaving(false);
      return;
    }

    setMessage("Delivery saved successfully.");

    setForm(emptyForm);

    await loadData();

    setSaving(false);
  }

  function getCompanyName(companyId) {
    const company = companies.find(
      (item) => String(item.id) === String(companyId)
    );

    return company?.name || "-";
  }

  function getShipmentName(shipmentId) {
    const shipment = shipments.find(
      (item) => String(item.id) === String(shipmentId)
    );

    return shipment?.shipment_no || "-";
  }

  function getCustomerName(customerId) {
    const customer = customers.find(
      (item) => String(item.id) === String(customerId)
    );

    return customer?.name || "-";
  }

  function getTruckName(truckId, truckNumber) {
    const truck = trucks.find(
      (item) => String(item.id) === String(truckId)
    );

    if (truck) {
      return truck.registration_no || "-";
    }

    return truckNumber || "-";
  }

  return (
    <main style={pageStyle}>
      <h1>Deliveries</h1>

      <p style={subtitleStyle}>
        Manage delivery orders, transport details and delivery status.
      </p>

      <section style={cardStyle}>
        <h2>Add Delivery</h2>

        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>

            <div>
              <label style={labelStyle}>Delivery Number</label>
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
              <label style={labelStyle}>Company</label>
              <select
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Company</option>

                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Shipment</label>
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

            <div>
              <label style={labelStyle}>Customer</label>
              <select
                name="customer_id"
                value={form.customer_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Customer</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Truck</label>
              <select
                name="truck_id"
                value={form.truck_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Truck</option>

                {trucks.map((truck) => (
                  <option key={truck.id} value={truck.id}>
                    {truck.registration_no}
                    {truck.driver_name
                      ? ` - ${truck.driver_name}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Driver Name</label>
              <input
                type="text"
                name="driver_name"
                value={form.driver_name}
                onChange={handleChange}
                placeholder="Driver name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Truck Number</label>
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
              <label style={labelStyle}>Pickup Location</label>
              <input
                type="text"
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                placeholder="Dar es Salaam Port"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Delivery Location</label>
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
              <label style={labelStyle}>Pickup Date</label>
              <input
                type="date"
                name="pickup_date"
                value={form.pickup_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Expected Delivery Date</label>
              <input
                type="date"
                name="expected_delivery_date"
                value={form.expected_delivery_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Actual Delivery Date</label>
              <input
                type="date"
                name="actual_delivery_date"
                value={form.actual_delivery_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Delivery Date</label>
              <input
                type="date"
                name="delivery_date"
                value={form.delivery_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Status</label>
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

            <div>
              <label style={labelStyle}>Remarks</label>
              <input
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Remarks"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Notes</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
                style={inputStyle}
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

        {message && (
          <p style={messageStyle}>
            {message}
          </p>
        )}
      </section>

      <section style={cardStyle}>
        <h2>Delivery List</h2>

        {loading ? (
          <p>Loading deliveries...</p>
        ) : deliveries.length === 0 ? (
          <p>No delivery records found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
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
                      {getTruckName(
                        delivery.truck_id,
                        delivery.truck_number
                      )}
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
                      {delivery.delivery_date || "-"}
                    </td>

                    <td style={tdStyle}>
                      {delivery.status || "-"}
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

const pageStyle = {
  padding: "24px",
  maxWidth: "1400px",
  margin: "0 auto",
};

const subtitleStyle = {
  color: "#666",
  marginBottom: "24px",
};

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  marginBottom: "24px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "16px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "12px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const messageStyle = {
  marginTop: "15px",
  fontWeight: "600",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1100px",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  whiteSpace: "nowrap",
};

