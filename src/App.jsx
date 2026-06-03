import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzgTXIHhPWgCCDCYOiWfywCYT0mU6Ix-XC9y9qd1s7RunEKIwh45ZFEKRFged2ZMOZ2/exec";

export default function PlanningApp() {
  const [planning, setPlanning] = useState([]);
  const [filterMedewerker, setFilterMedewerker] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Ophalen van planning
  useEffect(() => {
    async function fetchPlanning() {
      try {
        const resp = await fetch(API_URL);
        const result = await resp.json();
        if (result.success && result.alleWerkbonnen) {
          setPlanning(result.alleWerkbonnen);
        }
      } catch (err) {
        console.error(err);
        setStatusMsg("Kan planning niet ophalen.");
      }
    }
    fetchPlanning();
  }, []);

  function handleFilterChange(e) {
    setFilterMedewerker(e.target.value);
  }

  function filteredPlanning() {
    if (!filterMedewerker) return planning;
    return planning.filter(
      (item) =>
        item.medewerker1 === filterMedewerker ||
        item.medewerker2 === filterMedewerker
    );
  }

  function handleOpenWerkbon(werkbonnummer) {
    const WORKBON_URL = `https://thriving-lily-981fb3.netlify.app/?werkbon=${werkbonnummer}`;
    window.open(WORKBON_URL, "_blank");
  }

  return (
    <main style={{ fontFamily: "Arial", padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Planning Dashboard</h1>

      <label>
        Filter op medewerker:
        <input type="text" value={filterMedewerker} onChange={handleFilterChange} placeholder="Naam medewerker" />
      </label>

      {statusMsg && <p>{statusMsg}</p>}

      <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
        {filteredPlanning().map((item, index) => (
          <div key={index} style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: item.handlingen.includes("Bezet") ? "#fde68a" : "#d1fae5"
          }}>
            <p><strong>Datum:</strong> {new Date(item.datum).toLocaleDateString()}</p>
            <p><strong>Werkbon:</strong> {item.werkbonnummer}</p>
            <p><strong>Opdrachtgever:</strong> {item.opdrachtgever}</p>
            <p><strong>Medewerkers:</strong> {item.medewerker1}{item.medewerker2 ? `, ${item.medewerker2}` : ""}</p>
            <p><strong>Start/Eind:</strong> {item.starttijd} - {item.eindtijd}</p>
            <p><strong>Uren:</strong> {item.uren}</p>
            <p><strong>Handelingen:</strong> {item.handelingen}</p>

            <button
              style={{
                padding: "8px 12px",
                backgroundColor: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                marginTop: "8px",
                cursor: "pointer",
              }}
              onClick={() => handleOpenWerkbon(item.werkbonnummer)}
            >
              Open Werkbon
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
