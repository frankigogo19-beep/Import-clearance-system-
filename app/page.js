import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Import Clearance System</h1>
      <p>Manage your import and clearance operations in one place.</p>

      <div>
        <h2>Dashboard</h2>

        <Link href="/companies">Companies</Link>
        <br />

        <Link href="/shipments">Shipments</Link>
        <br />

        <Link href="/clearance-cases">Clearance Cases</Link>
        <br />

        <Link href="/documents">Documents</Link>
        <br />

        <Link href="/deliveries">Deliveries</Link>
      </div>
    </main>
  );
    }
