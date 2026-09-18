
"uswe client";
import { useState } from "react";
export default function Companies() {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
companyName: "",
registrationNumber: "",
tin: "",
phoneNumber: "",
email: "",
physicalAddress: "",
city: "",
country: "",
});
const [message, setMessage] = useState("");
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
<main>
<h1>Companies</h1>
<p>Manage companies and importers.</p>
<button onClick={() => setShowForm(!showForm)}>
    {showForm ? "Close" : "Add Company"}
  </button>

  {showForm && (
    <div>
      <h2>Company Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="registrationNumber"
          placeholder="Company Registration Number"
          value={formData.registrationNumber}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="tin"
          placeholder="TIN"
          value={formData.tin}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="physicalAddress"
          placeholder="Physical Address"
          value={formData.physicalAddress}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Save Company</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  )}
</main>
);
}
