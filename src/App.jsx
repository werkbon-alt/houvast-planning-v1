import React, { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzgTXIHhPWgCCDCYOiWfywCYT0mU6Ix-XC9y9qd1s7RunEKIwh45ZFEKRFged2ZMOZ2/exec";

const WERKBON_URL = "https://thriving-lily-981fb3.netlify.app/";

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

const emptyForm = {
  datum: "",
  tijd: "",
  opdrachtgever: "",
  locatie: "",
  medewerker1: "",
  medewerker2: "",
  status: "Gepland",
  opmerkingen: "",
};

export default function App() {
  const [planning, setPlanning] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [medewerkerFilter, setMedewerkerFilter] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredPlanning = useMemo(() => {
    if (!medewerkerFilter) return planning;

    return planning.filter(
      (item) =>
        item.medewerker1 === medewerkerFilter ||
        item.medewerker2 === medewerkerFilter
    );
  }, [planning, medewerkerFilter]);

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

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEdit(item) {
    setEditingId(item.id);

    setFormData({
      datum: toInputDate(item.datum),
      tijd: formatTime(item.tijd),
      opdrachtgever: item.opdrachtgever || "",
      locatie: item.locatie || "",
      medewerker1: item.medewerker1 || "",
      medewerker2: item.medewerker2 || "",
      status: item.status || "Gepland",
      opmerkingen: item.opmerkingen || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId("");
    setFormData(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setStatus(
      editingId ? "Wijziging wordt opgeslagen..." : "Planning wordt opgeslagen..."
    );

    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          type: editingId ? "updatePlanning" : "planning",
          id: editingId,
          datum: formData.datum,
          tijd: formData.tijd,
          opdrachtgever: formData.opdrachtgever,
          locatie: formData.locatie,
          medewerker1: formData.medewerker1,
          medewerker2: formData.medewerker2,
          status: formData.status || "Gepland",
          opmerkingen: formData.opmerkingen,
        }),
      });

      setStatus(editingId ? "Planning gewijzigd." : "Planning opgeslagen.");
      resetForm();

      setTimeout(loadPlanning, 1000);
    } catch {
      setStatus("Opslaan mislukt.");
    } finally {
      setLoading(false);
    }
  }

  function startWerkbon(item) {
    const params = new URLSearchParams({
      datum: toInputDate(item.datum),
      opdrachtgever: item.opdrachtgever || "",
      medewerker1: item.medewerker1 || "",
      medewerker2: item.medewerker2 || "",
      locatie: item.locatie || "",
      planningId: item.id || "",
    });

    window.open(`${WERKBON_URL}?${params.toString()}`, "_blank");
  }

  return (
    <main>
      <style>{styles}</style>

      <section className="hero">
        <div>
          <p className="eyebrow">Houvast Postmortale Zorg</p>
          <h1>Planning</h1>
          <p>Nieuwe opdrachten plannen, wijzigen en werkbonnen starten.</p>
        </div>
      </section>

      <section className="layout">
        <form className="card" onSubmit={handleSubmit}>
          <div className="form-title-row">
            <h2>{editingId ? "Planning wijzigen" : "Nieuwe planning toevoegen"}</h2>
            {editingId && <span className="edit-id">{editingId}</span>}
          </div>

          <label>Datum</label>
          <input
            name="datum"
            type="date"
            value={formData.datum}
            onChange={handleChange}
            required
          />

          <label>Tijd</label>
          <input
            name="tijd"
            type="text"
            placeholder="Bijv. 09:30"
            value={formData.tijd}
            onChange={handleChange}
            required
          />

          <label>Opdrachtgever</label>
          <input
            name="opdrachtgever"
            placeholder="Bijv. Walpot"
            value={formData.opdrachtgever}
            onChange={handleChange}
            required
          />

          <label>Locatie</label>
          <input
            name="locatie"
            placeholder="Plaats of adres"
            value={formData.locatie}
            onChange={handleChange}
          />

          <label>Medewerker 1</label>
          <select
            name="medewerker1"
            value={formData.medewerker1}
            onChange={handleChange}
            required
          >
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
          <select
            name="medewerker2"
            value={formData.medewerker2}
            onChange={handleChange}
          >
            <option value="">Geen tweede medewerker</option>
            {medewerkers.map((naam) => (
              <option key={naam} value={naam}>
                {naam}
              </option>
            ))}
          </select>

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Gepland">Gepland</option>
            <option value="Uitgevoerd">Uitgevoerd</option>
            <option value="Vervallen">Vervallen</option>
          </select>

          <label>Opmerkingen</label>
          <textarea
            name="opmerkingen"
            placeholder="Aanvullende informatie"
            value={formData.opmerkingen}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Opslaan..."
              : editingId
              ? "Wijziging opslaan"
              : "Planning opslaan"}
          </button>

          {editingId && (
            <button type="button" className="cancel-button" onClick={resetForm}>
              Annuleren
            </button>
          )}

          {status && <p className="status">{status}</p>}
        </form>

        <section className="card">
          <div className="header-row">
            <h2>Planningsoverzicht</h2>

            <select
              value={medewerkerFilter}
              onChange={(event) => setMedewerkerFilter(event.target.value)}
              className="filter-select"
            >
              <option value="">Alle medewerkers</option>
              {medewerkers.map((naam) => (
                <option key={naam} value={naam}>
                  {naam}
                </option>
              ))}
            </select>

            <button type="button" onClick={loadPlanning}>
              Verversen
            </button>
          </div>

          {filteredPlanning.length === 0 ? (
            <p className="muted">Er staan geen geplande opdrachten voor deze selectie.</p>
          ) : (
            <div className="planning-list">
              {filteredPlanning.map((item) => (
                <article className="planning-item" key={item.id}>
                  <div className="planning-top">
                    <div>
                      <strong>
                        {formatDate(item.datum)} om {formatTime(item.tijd)}
                      </strong>
                      <div className="planning-id">{item.id}</div>
                    </div>

                    <span
                      className={`badge ${String(
                        item.status || "Gepland"
                      ).toLowerCase()}`}
                    >
                      {item.status || "Gepland"}
                    </span>
                  </div>

                  <p>
                    <b>Opdrachtgever:</b> {item.opdrachtgever || "-"}
                  </p>
                  <p>
                    <b>Locatie:</b> {item.locatie || "-"}
                  </p>
                  <p>
                    <b>Medewerkers:</b>{" "}
                    {[item.medewerker1, item.medewerker2]
                      .filter(Boolean)
                      .join(" & ") || "-"}
                  </p>

                  {item.opmerkingen && (
                    <p>
                      <b>Opmerkingen:</b> {item.opmerkingen}
                    </p>
                  )}

                  <div className="button-row">
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
                      onClick={() => startWerkbon(item)}
                    >
                      Werkbon starten
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function toInputDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
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

  .hero { background: #111827; color: white; padding: 70px 24px; }
  .hero div { max-width: 1100px; margin: 0 auto; }
  .eyebrow { text-transform: uppercase; letter-spacing: 4px; color: #cbd5e1; font-size: 13px; }
  h1 { font-size: clamp(3rem, 8vw, 6rem); margin: 10px 0; }
  .hero p:last-child { color: #d7e1e8; font-size: 20px; }

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

  .form-title-row, .header-row, .planning-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .edit-id, .badge {
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 13px;
    font-weight: bold;
  }

  .edit-id { background: #eef2ff; color: #3730a3; }

  label { display: block; margin-top: 16px; margin-bottom: 6px; font-weight: bold; }

  input, select, textarea {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: 1px solid rgba(31,41,51,.18);
    font-size: 16px;
  }

  textarea { min-height: 110px; }

  button {
    background: #1f2933;
    color: white;
    border: none;
    border-radius: 999px;
    padding: 15px 24px;
    font-weight: bold;
    cursor: pointer;
  }

  form button { width: 100%; margin-top: 24px; padding: 18px; }

  .cancel-button { background: #6b7280; margin-top: 12px; }

  .status {
    background: #d1fae5;
    color: #065f46;
    padding: 14px;
    border-radius: 14px;
    text-align: center;
    font-weight: bold;
  }

  .filter-select { max-width: 240px; }
  .muted { color: #6b7280; }

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

  .planning-id {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }

  .badge { background: #dbeafe; color: #1e40af; }
  .badge.gepland { background: #dbeafe; color: #1e40af; }
  .badge.uitgevoerd { background: #dcfce7; color: #166534; }
  .badge.vervallen { background: #fee2e2; color: #991b1b; }

  .button-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .edit-button { background: #2563eb; }
  .workbon-button { background: #16a34a; }

  @media (max-width: 850px) {
    .layout {
      grid-template-columns: 1fr;
      margin-top: -20px;
    }

    .card { padding: 24px; }
    .planning-top { align-items: flex-start; flex-direction: column; }
    .filter-select { max-width: 100%; }
  }
`;
