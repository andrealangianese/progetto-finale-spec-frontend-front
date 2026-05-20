import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ComparePage() {
    // State per i viaggi
    const [tuttiIViaggi, setTuttiIViaggi] = useState([]);

    // state per confrontare le schede
    const [schedeInConfronto, setSchedeInConfronto] = useState([]);

    useEffect(() => {
        // chiamata per i viaggi
        fetch("http://localhost:3001/travels")
            .then((res) => res.json())
            .then((data) => setTuttiIViaggi(data))
            .catch((err) => console.error(err));

        // Leggo i viaggi salvati nel localStorage per mostrarli a schermo
        // uso JSON.parse per trasformare i dati in array o oggetti
        // li prendo dal local storage
        const salvati = JSON.parse(localStorage.getItem("travels_comparator")) || [];
        setSchedeInConfronto(salvati);
    }, []);

    // Rimuove una singola scheda e aggiorna il localStorage
    const rimuoviScheda = (idDaRimuovere) => {
        const filtrate = schedeInConfronto.filter((v) => v.id !== idDaRimuovere);
        setSchedeInConfronto(filtrate);
        localStorage.setItem("travels_comparator", JSON.stringify(filtrate));
    };

    return (
        <div className="compare-page">
            <h1>Comparatore di Viaggi</h1>
            <Link to="/">← Torna alla Home</Link>

            <h2>Ti accompagneremo nella scelta che fa più al caso tuo</h2>

            {schedeInConfronto.length === 0 ? (
                <p>Nessun viaggio selezionato per il confronto.</p>
            ) : (
                <div className="flex-container" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {schedeInConfronto.map((viaggio) => (
                        <div key={viaggio.id} className="scheda-confronto" style={{ border: "1px solid #000", padding: "15px", width: "250px" }}>
                            <button onClick={() => rimuoviScheda(viaggio.id)}>❌ Rimuovi</button>

                            <h3>{viaggio.title}</h3>
                            <p><strong>Categoria:</strong> {viaggio.category}</p>
                            <p><strong>Destinazione:</strong> {viaggio.destination || "Vedi nel dettaglio"}</p>
                            <p><strong>Prezzo:</strong> € {viaggio.price || "Vedi nel dettaglio"}</p>
                            <p><strong>Durata:</strong> {viaggio.durationDay || "N/D"} giorni</p>
                            <p><strong>Difficoltà:</strong> {viaggio.difficulty || "N/D"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}