
"use client";

import Link from "next/link";

export default function Home() {
return (
<main style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
<h1>Import Clearance System</h1>

<p> Manage your import clearance, shipments, documents and deliveries from one system. </p> <h2 style={{ marginTop: "30px" }}>Dashboard</h2> <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "20px", }} > <Link href="/companies" style={{ textDecoration: "none", color: "inherit" }} > <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", }} > <h2>Companies</h2> <p>Manage companies and customer profiles.</p> <strong>Open →</strong> </div> </Link> <Link href="/shipments" style={{ textDecoration: "none", color: "inherit" }} > <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", }} > <h2>Shipments</h2> <p>Manage import shipments and shipping details.</p> <strong>Open →</strong> </div> </Link> <Link href="/clearance-cases" style={{ textDecoration: "none", color: "inherit" }} > <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", }} > <h2>Clearance Cases</h2> <p>Manage customs clearance and import declaration cases.</p> <strong>Open →</strong> </div> </Link> <Link href="/documents" style={{ textDecoration: "none", color: "inherit" }} > <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", }} > <h2>Documents</h2> <p>Manage import and clearance documents.</p> <strong>Open →</strong> </div> </Link> <Link href="/deliveries" style={{ textDecoration: "none", color: "inherit" }} > <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", }} > <h2>Deliveries</h2> <p>Manage deliveries and proof of delivery.</p> <strong>Open →</strong> </div> </Link> <Link href="/proof-of-delivery" style={{ textDecoration: "none", color: "inherit" }} > <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", }} > <h2>Proof of Delivery</h2> <p> Manage proof of delivery records and delivery confirmations. </p> <strong>Open →</strong> </div> </Link> </div> </main>

);
}


