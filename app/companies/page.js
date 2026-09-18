"use client";

import { useState } from "react";

export default function Companies() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    tin: "",
    phoneNumber: "",
    email: "",
    physicalAddress: "",
    city: "",
    country: "",
    contactPerson: "",
    notes: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = [
      "companyName",
      "registrationNumber",
      "tin",
      "phoneNumber",
      "email",
      "physicalAddress",
      "city",
      "country",
      "contactPerson",
    ];

    const hasMissingFields = requiredFields.some(
      (field) => !formData[field].trim()
    );

    if (hasMissingFields) {
      setMessage("Error: Please complete all required fields.");
      return;
    }

    setMessage("Company saved successfully.");
  };

  return (
    <main style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Companies</h1>

      <p>Manage companies and importers.</p>

      <button
        type="button"
        onClick={() => {
          setShowForm(!showForm);
          setMessage("");
        }}
        style={{
          padding: "10px 18px",
          marginBottom: "25px",
          cursor: "pointer",
        }}
      >
        {showForm ? "Close" : "Add Company"}
      </button>

      {showForm && (
        <section>
          <h2>Company Profile</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Company Name</label>
              <br />
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>Registration Number</label>
              <br />
              <input
                type="text"
                name="registrationNumber"
                placeholder="Company Registration Number"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>TIN</label>
              <br />
              <input
                type="text"
                name="tin"
                placeholder="TIN"
                value={formData.tin}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>Phone Number</label>
              <br />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>Email Address</label>
              <br />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>Physical Address</label>
              <br />
              <input
                type="text"
                name="physicalAddress"
                placeholder="Physical Address"
                value={formData.physicalAddress}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>City</label>
              <br />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>Country</label>
              <br />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>Contact Person</label>
              <br />
              <input
                type="text"
                name="contactPerson"
                placeholder="Contact Person"
                value={formData.contactPerson}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>Notes</label>
              <br />
              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <br />

            <button type="submit">Save Company</button>

            {message && (
              <p style={{ marginTop: "15px" }}>
                {message}
              </p>
            )}
          </form>
        </section>
      )}
    </main>
  );
}
