import { Link } from "react-router-dom"
import { useTravelLists } from "../context/travelLists"

export default function TravelCard({ viaggio }) {
    const { isPreferito, isInConfronto, togglePreferito, toggleConfronto } = useTravelLists()
    const preferito = isPreferito(viaggio.id)
    const inConfronto = isInConfronto(viaggio.id)

    return (
        <div className="travel-card">
            <div className="travel-card-content">
                <h3 className="travel-card-title">{viaggio.title}</h3>
                <span className="travel-card-category">{viaggio.category}</span>
            </div>

            <div className="travel-card-actions">
                <button
                    onClick={() => togglePreferito(viaggio)}
                    className={`btn-icon ${preferito ? "is-active" : ""}`}
                    aria-pressed={preferito}
                    aria-label={preferito ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                    title={preferito ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                >
                    {preferito ? "❤️" : "🤍"}
                </button>
                <button
                    onClick={() => toggleConfronto(viaggio)}
                    className={`btn-compare ${inConfronto ? "is-active" : ""}`}
                    aria-pressed={inConfronto}
                >
                    {inConfronto ? "✓ Nel confronto" : "Confronta"}
                </button>
                <Link to={`/travels/${viaggio.id}`} className="travel-card-button">
                    Dettagli del Viaggio
                </Link>
            </div>
        </div>
    )
}
