import React, { useState, useEffect } from "react";

const API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";
const WERKBON_URL = "YOUR_WERKBON_APP_URL";

function toInputDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function App() {
  const [planning, setPlanning] = useState([]);
  const [filterMedewerker, setFilterMedewerker] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        // Mock data of echte fetch uit sheet
        setPlanning([
          ...data.alleWerkbonnen // als je sheet data wilt tonen
        ]);
      });
  }, []);

  const handleEdit = (item) => alert(`Bewerken: ${item.id}`);

  const filteredPlanning = filterMedewerker
    ? planning.filter(
        (p) =>
          p.medewerker1 === filterMedewerker ||
          p.medewerker2 === filterMedewerker
      )
    : planning;

  return (
    <main style={{ padding: "20px" }}>
      <h1>Houvast Planning</h1>

      <label>Filter medewerker:</label>
      <select onChange={e => setFilterMedewerker(e.target.value)} value={filterMedewerker}>
        <option value="">Alle medewerkers</option>
        <option value="Nicky">Nicky</option>
        <option value="Roland">Roland</option>
        <option value="Marc">Marc</option>
        <option value="Nelleke">Nelleke</option>
      </select>

      {filteredPlanning.map(item => (
        <div key={item.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <p>{item.datum} - {item.opdrachtgever} ({item.status})</p>
          <button onClick={() => handleEdit(item)}>Bewerken</button>
          <button
            onClick={() => {
              const params = new URLSearchParams({
                datum: toInputDate(item.datum),
                opdrachtgever: item.opdrachtgever,
                medewerker1: item.medewerker1,
                medewerker2: item.medewerker2,
                planningId: item.id
              });
              window.open(`${WERKBON_URL}?${params.toString()}`, "_blank");
            }}
            style={{ marginLeft: "10px", background: "#16a34a", color: "#fff" }}
          >
            Werkbon starten
          </button>
        </div>
      ))}
    </main>
  );
}
