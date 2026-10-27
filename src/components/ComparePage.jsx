import { Link } from "react-router-dom";
import { useTravelLists } from "../context/travelLists";

export default function ComparePage() {
    const { confronto, toggleConfronto } = useTravelLists();

    return (
        <div className="compare-page">
            <h1>Comparatore di Viaggi</h1>
            <Link to="/">← Torna alla Home</Link>

            <h2>Ti accompagneremo nella scelta che fa più al caso tuo</h2>

            {confronto.length === 0 ? (
                <p>Nessun viaggio selezionato per il confronto.</p>
            ) : (
                <div className="flex-container">
                    {confronto.map((viaggio) => (
                        <div key={viaggio.id} className="scheda-confronto">
                            <button onClick={() => toggleConfronto(viaggio)}>❌ Rimuovi</button>
                            <h3>{viaggio.title}</h3>
                            <p><strong>Categoria:</strong> {viaggio.category}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
