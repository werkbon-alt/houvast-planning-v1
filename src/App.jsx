import React, { useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzgTXIHhPWgCCDCYOiWfywCYT0mU6Ix-XC9y9qd1s7RunEKIwh45ZFEKRFged2ZMOZ2/exec";
const WERKBON_URL =
  "https://thriving-lily-981fb3.netlify.app/";

function toInputDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function App() {
  const [planning, setPlanning] = useState([
    {
      id: "1",
      datum: "2026-06-15",
      opdrachtgever: "Walpot",
      medewerker1: "Marc",
      medewerker2: "Nicky",
      locatie: "Ulestraten",
      status: "Open",
    },
    {
      id: "2",
      datum: "2026-06-16",
      opdrachtgever: "Sassen Dielemans",
      medewerker1: "Nelleke",
      medewerker2: "",
      locatie: "Sassen",
      status: "Uitgevoerd",
    },
  ]);

  const [filterMedewerker, setFilterMedewerker] = useState("");

  const handleEdit = (item) => {
    alert(`Planning bewerken: ${item.id}`);
  };

  const filteredPlanning = filterMedewerker
    ? planning.filter(
        (p) =>
          p.medewerker1 === filterMedewerker ||
          p.medewerker2 === filterMedewerker
      )
    : planning;

  const getStatusColor = (status) => {
    switch (status) {
      case "Uitgevoerd":
        return "#16a34a"; // groen
      case "Open":
        return "#f59e0b"; // oranje
      case "Gepland":
        return "#3b82f6"; // blauw
      default:
        return "#d1d5db"; // grijs
    }
  };

  return (
    <main style={pageStyle}>
      <h1>Houvast Planning v1.2</h1>

      <label style={{ fontWeight: "bold" }}>Filter op medewerker:</label>
      <select
        value={filterMedewerker}
        onChange={(e) => setFilterMedewerker(e.target.value)}
        style={filterStyle}
      >
        <option value="">Alle medewerkers</option>
        <option value="Nicky">Nicky</option>
        <option value="Roland">Roland</option>
        <option value="Cindy">Cindy</option>
        <option value="Cécile">Cécile</option>
        <option value="Mike">Mike</option>
        <option value="Nelleke">Nelleke</option>
        <option value="Dylano">Dylano</option>
        <option value="Gerald">Gerald</option>
        <option value="Marc">Marc</option>
        <option value="Angélique">Angélique</option>
        <option value="Bianca">Bianca</option>
        <option value="Externe/inhuur">Externe/inhuur</option>
      </select>

      {filteredPlanning.map((item) => (
        <div
          key={item.id}
          style={{
            ...cardStyle,
            borderLeft: `8px solid ${getStatusColor(item.status)}`,
          }}
        >
          <p>
            <strong>Datum:</strong> {item.datum} |{" "}
            <strong>Opdrachtgever:</strong> {item.opdrachtgever} |{" "}
            <strong>Medewerker 1:</strong> {item.medewerker1} |{" "}
            <strong>Medewerker 2:</strong> {item.medewerker2} |{" "}
            <strong>Status:</strong> {item.status}
          </p>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              className="edit-button"
              onClick={() => handleEdit(item)}
            >
              Bewerken
            </button>

            <button
              type="button"
              className="workbon-button"
              onClick={() => {
                const params = new URLSearchParams({
                  datum: toInputDate(item.datum),
                  opdrachtgever: item.opdrachtgever || "",
                  medewerker1: item.medewerker1 || "",
                  medewerker2: item.medewerker2 || "",
                  locatie: item.locatie || "",
                  planningId: item.id || "",
                });

                window.open(`${WERKBON_URL}?${params.toString()}`, "_blank");
              }}
            >
              Werkbon starten
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}

const pageStyle = {
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  background: "#f2f2f2",
  minHeight: "100vh",
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "16px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const filterStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "16px",
};

const buttonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const editButtonStyle = {
  ...buttonStyle,
  background: "#2563eb",
  color: "#fff",
};

const workbonButtonStyle = {
  ...buttonStyle,
  background: "#16a34a",
  color: "#fff",
};
