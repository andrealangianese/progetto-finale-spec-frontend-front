import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <div className="homepage-container not-found">
            <p className="not-found-code">404</p>
            <h1 className="homepage-title">Sentiero non trovato 🧭</h1>
            <p>La pagina che cerchi non esiste o è stata spostata.</p>
            <Link to="/" className="travel-card-button">Torna alla Home</Link>
        </div>
    )
}
