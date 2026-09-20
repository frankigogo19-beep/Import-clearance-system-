
export default function Home() {
  const modules = [
    {
      name: "Companies",
      description: "Manage companies and customer profiles.",
      link: "/companies",
    },
    {
      name: "Shipments",
      description: "Manage import shipments and shipping details.",
      link: "/shipments",
    },
    {
      name: "Clearance Cases",
      description: "Manage customs clearance and import declarations.",
      link: "/clearance-cases",
    },
    {
      name: "Documents",
      description: "Manage import and clearance documents.",
      link: "/documents",
    },
    {
      name: "Deliveries",
      description: "Manage deliveries and proof of delivery.",
      link: "/deliveries",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f8fafc",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "16px",
            marginBottom: "30px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "36px",
            }}
          >
            Import Clearance System
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "17px",
            }}
          >
            Manage your import clearance, shipments, documents and deliveries
            from one system.
          </p>
        </div>

        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Dashboard
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
          }}
        >
          {modules.map((module) => (
            <a
              key={module.name}
              href={module.link}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: "white",
                padding: "25px",
                borderRadius: "14px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
                display: "block",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "21px",
                }}
              >
                {module.name}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  lineHeight: "1.5",
                }}
              >
                {module.description}
              </p>

              <div
                style={{
                  marginTop: "18px",
                  fontWeight: "600",
                }}
              >
                Open →
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

