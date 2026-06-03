import React, { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzgTXIHhPWgCCDCYOiWfywCYT0mU6Ix-XC9y9qd1s7RunEKIwh45ZFEKRFged2ZMOZ2/exec";

const medewerkers = [
  "Nicky",
  "Roland",
  "Cindy",
  "Cécile",
  "Mike",
  "Nelleke",
  "Dylano",
  "Gerald",
  "Marc",
  "Angélique",
  "Bianca",
  "Externe/inhuur",
];

export default function App() {
  const [planning, setPlanning] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPlanning() {
    try {
      const response = await fetch(`${API_URL}?action=planning`);
      const data = await response.json();
      setPlanning(data.planning || []);
    } catch {
      setStatus("Planning kon niet worden geladen.");
    }
  }

  useEffect(() => {
    loadPlanning();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setLoading(true);
    setStatus("Planning wordt opgeslagen...");

    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          type: "planning",
          datum: data.datum,
          tijd: data.tijd,
          opdrachtgever: data.opdrachtgever,
          locatie: data.locatie,
          medewerker1: data.medewerker1,
          medewerker2: data.medewerker2,
          status: data.status || "Gepland",
          opmerkingen: data.opmerkingen,
        }),
      });

      setStatus("Planning opgeslagen.");
      form.reset();

      setTimeout(() => {
        loadPlanning();
      }, 1000);
    } catch {
      setStatus("Opslaan mislukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <style>{styles}</style>

      <section className="hero">
        <div>
          <p className="eyebrow">Houvast Postmortale Zorg</p>
          <h1>Planning</h1>
          <p>Nieuwe opdrachten plannen en overzicht houden.</p>
        </div>
      </section>

      <section className="layout">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Nieuwe planning toevoegen</h2>

          <label>Datum</label>
          <input name="datum" type="date" required />

          <label>Tijd</label>
          <input name="tijd" type="text" placeholder="Bijv. 09:30" required />

          <label>Opdrachtgever</label>
          <input name="opdrachtgever" placeholder="Bijv. Walpot" required />

          <label>Locatie</label>
          <input name="locatie" placeholder="Plaats of adres" />

          <label>Medewerker 1</label>
          <select name="medewerker1" required defaultValue="">
            <option value="" disabled>
              Kies medewerker
            </option>
            {medewerkers.map((naam) => (
              <option key={naam} value={naam}>
                {naam}
              </option>
            ))}
          </select>

          <label>Medewerker 2</label>
          <select name="medewerker2" defaultValue="">
            <option value="">Geen tweede medewerker</option>
            {medewerkers.map((naam) => (
              <option key={naam} value={naam}>
                {naam}
              </option>
            ))}
          </select>

          <label>Status</label>
          <select name="status" defaultValue="Gepland">
            <option value="Gepland">Gepland</option>
            <option value="Uitgevoerd">Uitgevoerd</option>
            <option value="Vervallen">Vervallen</option>
          </select>

          <label>Opmerkingen</label>
          <textarea name="opmerkingen" placeholder="Aanvullende informatie" />

          <button type="submit" disabled={loading}>
            {loading ? "Opslaan..." : "Planning opslaan"}
          </button>

          {status && <p className="status">{status}</p>}
        </form>

        <section className="card">
          <div className="header-row">
            <h2>Planningsoverzicht</h2>
            <button type="button" onClick={loadPlanning}>
              Verversen
            </button>
          </div>

          {planning.length === 0 ? (
            <p className="muted">Er staan nog geen geplande opdrachten.</p>
          ) : (
            <div className="planning-list">
              {planning.map((item) => (
                <article className="planning-item" key={item.id}>
                  <div className="planning-top">
                   <div>
  <strong>
    {formatDate(item.datum)} om {formatTime(item.tijd)}
  </strong>
  <div style={{ fontSize: "12px", color: "#666" }}>
    {item.id}
  </div>
</div> 
<span className={`badge ${String(item.status || "Gepland").toLowerCase()}`}>
  {item.status || "Gepland"}
</span>
                  </div>

                  <p><b>Opdrachtgever:</b> {item.opdrachtgever || "-"}</p>
                  <p><b>Locatie:</b> {item.locatie || "-"}</p>
                  <p>
                    <b>Medewerkers:</b>{" "}
                    {[item.medewerker1, item.medewerker2].filter(Boolean).join(" & ") || "-"}
                  </p>

                  {item.opmerkingen && (
                    <p><b>Opmerkingen:</b> {item.opmerkingen}</p>
                  )}
                  <button
  type="button"
  style={{
    marginTop: "10px",
    background: "#2563eb"
  }}
  onClick={() => {
    alert(`Bewerken van ${item.id} komt in v1.1`);
  }}
>
  ✏️ Bewerken
</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("nl-NL");
}

function formatTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime()) && String(value).includes("T")) {
    return date.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return value;
}

const styles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, sans-serif; background: #f4f1eb; color: #1f2933; }
  main { min-height: 100vh; }

  .hero {
    background: #111827;
    color: white;
    padding: 70px 24px;
  }

  .hero div {
    max-width: 1100px;
    margin: 0 auto;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #cbd5e1;
    font-size: 13px;
  }

  h1 {
    font-size: clamp(3rem, 8vw, 6rem);
    margin: 10px 0;
  }

  .hero p:last-child {
    color: #d7e1e8;
    font-size: 20px;
  }

  .layout {
    max-width: 1200px;
    margin: -40px auto 80px;
    padding: 0 24px;
    display: grid;
    grid-template-columns: minmax(300px, 420px) 1fr;
    gap: 24px;
    align-items: start;
  }

  .card {
    background: white;
    border-radius: 28px;
    padding: 32px;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.10);
  }

  label {
    display: block;
    margin-top: 16px;
    margin-bottom: 6px;
    font-weight: bold;
  }

  input, select, textarea {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: 1px solid rgba(31,41,51,.18);
    font-size: 16px;
  }

  textarea {
    min-height: 110px;
  }

  button {
    background: #1f2933;
    color: white;
    border: none;
    border-radius: 999px;
    padding: 15px 24px;
    font-weight: bold;
    cursor: pointer;
  }

  form button {
    width: 100%;
    margin-top: 24px;
    padding: 18px;
  }

  .status {
    background: #d1fae5;
    color: #065f46;
    padding: 14px;
    border-radius: 14px;
    text-align: center;
    font-weight: bold;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .muted {
    color: #6b7280;
  }

  .planning-list {
    display: grid;
    gap: 14px;
    margin-top: 20px;
  }

  .planning-item {
    background: #f8fafc;
    border: 1px solid rgba(31,41,51,.08);
    border-radius: 20px;
    padding: 20px;
  }

  .planning-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-bottom: 14px;
  }

  .badge {
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: bold;
    background: #dbeafe;
    color: #1e40af;
  }

  .badge.uitgevoerd {
    background: #dcfce7;
    color: #166534;
  }

  .badge.vervallen {
    background: #fee2e2;
    color: #991b1b;
  }

  @media (max-width: 850px) {
    .layout {
      grid-template-columns: 1fr;
      margin-top: -20px;
    }

    .card {
      padding: 24px;
    }
  }
`;
