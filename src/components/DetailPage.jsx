import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export default function DetailPage() {

    // Recupero l'id dall'URL 
    const { id } = useParams()

    // Stato per il singolo viaggio (inizialmente null)
    const [viaggio, setViaggio] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id || id === "undefined") return;

        const urlDettaglio = `http://localhost:3001/travels/${id}`;

        fetch(urlDettaglio)
            .then(res => {
                if (!res.ok) throw new Error("Il server ha rifiutato l'ID o la rotta non esiste");
                return res.json();
            })
            .then(data => {
                // Invece di 'setViaggio(data)', salvo direttamente l'oggetto 'travel' che c'è al suo interno
                if (data.travel) {
                    setViaggio(data.travel);
                } else {
                    setViaggio(data);
                }

                setLoading(false);
            })
            .catch(error => {
                console.error("Errore durante il caricamento del dettaglio:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="detail-loading">Caricamento in corso...</p>
    if (!viaggio) return <p className="detail-error">Viaggio non trovato!</p>

    const aggiungiAlComparatoreDalDettaglio = () => {
        const salvati = JSON.parse(localStorage.getItem("travels_comparator")) || [];
        const giaPresente = salvati.some(item => item.id === viaggio.id);

        if (giaPresente) {
            alert("Questo viaggio è già presente nel comparatore!");
            return;
        }

        const nuoviSalvati = [...salvati, viaggio];
        localStorage.setItem("travels_comparator", JSON.stringify(nuoviSalvati));
        alert(`${viaggio.title} aggiunto al comparatore!`);
    };

    return (
        <div className="detail-container">
            <Link to="/" className="back-link">← Torna alla Home</Link>

            <div className="detail-layout">
                <div className="detail-media">
                    <img src={viaggio.image} alt={viaggio.title} className="detail-img" />
                </div>

                <div className="detail-info">
                    <span className="detail-category">{viaggio.category}</span>
                    <h1 className="detail-title">{viaggio.title}</h1>
                    <p className="detail-destination">📍 {viaggio.destination}</p>

                    <p className="detail-description">{viaggio.description}</p>

                    <div className="specs-grid">
                        <div className="spec-card">
                            <span className="spec-label">Durata</span>
                            <span className="spec-value">{viaggio.durationDay} giorni</span>
                        </div>
                        <div className="spec-card">
                            <span className="spec-label">Prezzo</span>
                            <span className="spec-value">€ {viaggio.price}</span>
                        </div>
                        <div className="spec-card">
                            <span className="spec-label">Difficoltà</span>
                            <span className="spec-value">{viaggio.difficulty}</span>
                        </div>
                        <div className="spec-card">
                            <span className="spec-label">Adrenalina</span>
                            <span className="spec-value">⚡️{viaggio.adrenalineLevel} / 5⚡️</span>
                        </div>
                    </div>

                    {viaggio.requiredEquipment && viaggio.requiredEquipment.length > 0 && (
                        <div className="equipment-section">
                            <h3 className="equipment-title">Equipaggiamento Richiesto:</h3>
                            <ul className="equipment-list">
                                {viaggio.requiredEquipment.map((item, index) => (
                                    <li key={index} className="equipment-item">👉 {item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="detail-actions">
                <Link to="/">← Torna alla Home</Link>

                {/* BOTTONE CONFRONTA NEL DETTAGLIO */}
                <button onClick={aggiungiAlComparatoreDalDettaglio}>
                    Confronta questo viaggio
                </button>
            </div>
        </div>
    )
}