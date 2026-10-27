import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTravelLists } from "../context/travelLists";
import { getTravelsByIds } from "../lib/api";

const formatEuro = (n) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

// Righe della tabella: `best` indica quale valore evidenziare ("min" | "max")
const RIGHE = [
    { label: "Categoria", render: v => v.category },
    { label: "Destinazione", render: v => `📍 ${v.destination}` },
    { label: "Prezzo", value: v => v.price, best: "min", render: v => formatEuro(v.price) },
    { label: "Durata", value: v => v.durationDay, best: "max", render: v => `${v.durationDay} giorni` },
    { label: "Prezzo al giorno", value: v => v.price / v.durationDay, best: "min", render: v => formatEuro(v.price / v.durationDay) },
    { label: "Difficoltà", render: v => v.difficulty },
    { label: "Adrenalina", value: v => v.adrenalineLevel, render: v => "⚡".repeat(v.adrenalineLevel) + ` ${v.adrenalineLevel}/5` },
    { label: "Equipaggiamento", render: v => `${v.requiredEquipment?.length ?? 0} articoli` },
];

function valoreMigliore(riga, viaggi) {
    if (!riga.best || viaggi.length < 2) return null;
    const valori = viaggi.map(riga.value);
    return riga.best === "min" ? Math.min(...valori) : Math.max(...valori);
}

export default function ComparePage() {
    const { confronto, toggleConfronto, svuotaConfronto, mantieniSoloInConfronto } = useTravelLists();

    // Chiave degli id selezionati: quando cambia, ricarico i dettagli
    const chiave = confronto.map(v => v.id).join(",");
    const [risultato, setRisultato] = useState({ chiave: "", viaggi: [], errore: null });

    // Riuso i dettagli già caricati: rimuovere un viaggio aggiorna la tabella senza attese
    const viaggi = confronto.map(c => risultato.viaggi.find(v => v.id === c.id)).filter(Boolean);
    const loading = viaggi.length < confronto.length && risultato.chiave !== chiave;
    const errore = risultato.chiave === chiave ? risultato.errore : null;

    useEffect(() => {
        if (!chiave) return;
        const controller = new AbortController();
        getTravelsByIds(chiave.split(","), { signal: controller.signal })
            .then(viaggi => {
                const idsTrovati = viaggi.map(v => v.id);
                if (idsTrovati.length < chiave.split(",").length) {
                    // la chiave cambierà e partirà un nuovo caricamento coerente
                    mantieniSoloInConfronto(idsTrovati);
                    return;
                }
                setRisultato({ chiave, viaggi, errore: null });
            })
            .catch(err => {
                if (err.name !== "AbortError") setRisultato({ chiave, viaggi: [], errore: err.message });
            });
        return () => controller.abort();
    }, [chiave, mantieniSoloInConfronto]);

    return (
        <div className="compare-page">
            <h1>Comparatore di Viaggi</h1>
            <Link to="/" className="back-link">← Torna alla Home</Link>

            <h2>Ti accompagneremo nella scelta che fa più al caso tuo</h2>

            {confronto.length === 0 ? (
                <p className="no-results">
                    Nessun viaggio selezionato per il confronto. Aggiungine almeno due dalla <Link to="/">Home</Link>.
                </p>
            ) : loading ? (
                <p className="detail-loading">Caricamento del confronto...</p>
            ) : errore ? (
                <p className="detail-error">Impossibile caricare il confronto: {errore}</p>
            ) : (
                <>
                    <div className="compare-toolbar">
                        <span>{viaggi.length} viaggi a confronto · in verde il valore migliore</span>
                        <button className="btn-link" onClick={svuotaConfronto}>Svuota comparatore</button>
                    </div>
                    <div className="compare-table-wrapper">
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    {viaggi.map(v => (
                                        <th key={v.id} scope="col">
                                            <img src={v.image} alt="" className="compare-img" />
                                            <Link to={`/travels/${v.id}`} className="compare-title">{v.title}</Link>
                                            <button className="btn-remove" onClick={() => toggleConfronto(v)}>Rimuovi</button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {RIGHE.map(riga => {
                                    const migliore = valoreMigliore(riga, viaggi);
                                    return (
                                        <tr key={riga.label}>
                                            <th scope="row">{riga.label}</th>
                                            {viaggi.map(v => (
                                                <td key={v.id} className={migliore !== null && riga.value(v) === migliore ? "is-best" : ""}>
                                                    {riga.render(v)}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {viaggi.length === 1 && (
                        <p className="no-results">Aggiungi almeno un altro viaggio per vedere le differenze.</p>
                    )}
                </>
            )}
        </div>
    );
}
