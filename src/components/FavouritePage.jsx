import { Link } from "react-router-dom";
import { useTravelLists } from "../context/travelLists";
import TravelCard from "./TravelCard";

export default function FavouritePage() {
    const { preferiti } = useTravelLists();

    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Le tue Destinazioni Preferite ❤️</h1>

            <Link to="/" className="back-link">← Torna alla Home</Link>

            {preferiti.length === 0 ? (
                <p className="no-results">Non hai ancora salvato nessuna destinazione nei tuoi preferiti.</p>
            ) : (
                <div className="travels-grid">
                    {preferiti.map((viaggio) => (
                        <TravelCard key={viaggio.id} viaggio={viaggio} />
                    ))}
                </div>
            )}
        </div>
    );
}
