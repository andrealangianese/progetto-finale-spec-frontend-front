import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FavouritePage() {
    const [preferiti, setPreferiti] = useState([]);

    // Al caricamento della pagina leggiamo i preferiti salvati nel browser
    useEffect(() => {
        const salvati = JSON.parse(localStorage.getItem("travels_favs")) || [];
        setPreferiti(salvati);
    }, []);

    // Funzione per rimuovere un viaggio dai preferiti
    const rimuoviPreferito = (idDaRimuovere) => {
        const filtrati = preferiti.filter((v) => v.id !== idDaRimuovere);
        setPreferiti(filtrati);
        localStorage.setItem("travels_favs", JSON.stringify(filtrati));
    };

    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Le tue Destinazioni Preferite ❤️</h1>

            <Link to="/" className="btn-secondary" style={{ marginBottom: "20px", display: "inline-block" }}>
                ← Torna alla Home
            </Link>

            {preferiti.length === 0 ? (
                <p className="no-results">Non hai ancora salvato nessuna destinazione nei tuoi preferiti.</p>
            ) : (
                /* Usiamo la tua stessa identica struttura a lista verticale che si vede nello screenshot */
                <div className="travels-grid">
                    {preferiti.map((viaggio) => (
                        <div key={viaggio.id} className="travel-card">
                            <div className="travel-card-content">
                                <h3 className="travel-card-title">{viaggio.title}</h3>
                                <span className="travel-card-category">{viaggio.category}</span>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={() => rimuoviPreferito(viaggio.id)} className="travel-card-button" style={{ backgroundColor: "#ff6b6b" }}>
                                    ❌ Rimuovi
                                </button>
                                <Link to={`/travels/${viaggio.id}`} className="travel-card-button">
                                    Dettagli del Viaggio
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}