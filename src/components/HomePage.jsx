import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

export default function HomePage() {

    // state per salvare i viaggi
    const [viaggi, setViaggi] = useState([])
    // state per ricerca viaggi per nome
    const [cercaViaggiNome, setCercaViaggiNome] = useState('')
    // state per ricerca viaggi per categorie
    const [cercaViaggiCategoria, setCercaViaggiCategoria] = useState('Tutte le categorie')
    // state per ordinamento da A -> Z
    const [ordinamentoAlfabetico, setOrdinamentoAlfabetico] = useState('')

    useEffect(() => {
        fetch('http://localhost:3001/travels')
            .then(res => res.json())
            .then(data => setViaggi(data))
            .catch(error => console.error(error)
            )
    }, [])

    // per evitare di stampare tutte le categorie uguali, set prorprietà di js che non accetta elementi uguali
    const categorieUniche = ['Tutte le categorie', ...new Set(viaggi.map(viaggio => viaggio.category).filter(Boolean))]

    const viaggiFiltrati = viaggi.filter(viaggio => {
        const titolo = viaggio.title.toLowerCase()
        const comparazioneTitolo = titolo.includes(cercaViaggiNome.toLowerCase())
        const comprazioneCategorie = cercaViaggiCategoria === 'Tutte le categorie' || viaggio.category === cercaViaggiCategoria
        return comparazioneTitolo && comprazioneCategorie
    })

    // controllo ordinamento alfabetico
    const viaggiOrdinati = [...viaggiFiltrati].sort((a, b) => {
        // la forza diventare una stringa a togliere gli spazi e farlo diventare minuscolo
        const titoloA = (a.title || "").toString().trim().toLowerCase();
        const titoloB = (b.title || "").toString().trim().toLowerCase();


        if (ordinamentoAlfabetico === 'title-asc') {
            return titoloA.localeCompare(titoloB);
        } else if (ordinamentoAlfabetico === 'title-desc') {
            return titoloB.localeCompare(titoloA);
        }
        return 0;
    })

    // funzione che andrò a richiamare dopo per confrontare viaggi
    const aggiungiAlComparatore = (viaggio) => {
        // prendo l'array salvato nel browser (se non c'è nulla, parto da un array vuoto)
        const salvati = JSON.parse(localStorage.getItem("travels_comparator")) || [];

        // controllo se questo viaggio è già stato inserito
        const giaPresente = salvati.some(item => item.id === viaggio.id);

        if (giaPresente) {
            alert("Questo viaggio è già presente nel comparatore!");
            return;
        }

        // aggiungo il viaggio corrente alla lista e salvo tutto nel browser
        const nuoviSalvati = [...salvati, viaggio];
        localStorage.setItem("travels_comparator", JSON.stringify(nuoviSalvati));
        alert(`${viaggio.title} aggiunto al comparatore!`);
    };

    // funzione per gestire i preferiti molto simile a quella sopra

    const aggiungiAiPreferiti = (viaggio) => {
        // prendo l'array salvato nel browser (se non c'è nulla, parto da un array vuoto)
        const salvati = JSON.parse(localStorage.getItem("travels_favs")) || [];

        // controllo se questo viaggio è già stato inserito
        const giaPresente = salvati.some(item => item.id === viaggio.id);

        if (giaPresente) {
            alert("Questo viaggio è già presente tra i tuoi preferiti!");
            return;
        }

        // aggiungo il viaggio corrente alla lista e salvo tutto nel browser
        const nuoviSalvati = [...salvati, viaggio];
        localStorage.setItem("travels_favs", JSON.stringify(nuoviSalvati));
        alert(`${viaggio.title} aggiunto ai tuoi preferiti!!!`);
    };


    return (
        <div className="homepage-container">
            <h1 className="homepage-title">I nostri viaggi all'insegna dell'avventura</h1>

            {/* PANNELLO FILTRI */}
            <div className="filters-panel">
                {/* ricerca per testo */}
                <div className="filter-group flex-grow">
                    <label className="filter-label">Cerca per titolo</label>
                    <input
                        type="text"
                        placeholder="Es: Downhill, Surf..."
                        onChange={e => setCercaViaggiNome(e.target.value)}
                        className="filter-input"
                    />
                </div>

                {/* ricerca per categorie con select */}
                <div className="filter-group">
                    <label className="filter-label">Filtra per categoria</label>
                    <select
                        value={cercaViaggiCategoria}
                        onChange={e => setCercaViaggiCategoria(e.target.value)}
                        className="filter-select"
                    >
                        {/* stampo tutte le categorie solo una volta */}
                        {categorieUniche.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ordinamento ordine crescente e decrescente */}
                <div className="filter-group">
                    <label className="filter-label">Ordina per</label>
                    <select
                        value={ordinamentoAlfabetico}
                        onChange={e => setOrdinamentoAlfabetico(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Ordine di Default</option>
                        <option value="title-asc">Titoli da A - Z</option>
                        <option value="title-desc">Titoli da Z - A</option>
                    </select>
                </div>
            </div>

            {/* lista dei risultati finali */}
            <div className="travels-grid">
                {viaggiOrdinati.length > 0 ? (
                    viaggiOrdinati.map((viaggio, index) => (
                        <div key={index} className="travel-card">
                            <div className="travel-card-content">
                                <h3 className="travel-card-title">{viaggio.title}</h3>
                                <span className="travel-card-category">{viaggio.category}</span>
                            </div>
                            {/* bottone per la comparazione dei viaggi*/}
                            <div>
                                <button onClick={() => aggiungiAiPreferiti(viaggio)} className="travel-card-button" style={{ backgroundColor: 'black', marginLeft: "10px" }}>
                                    ❤️
                                </button>
                                <button onClick={() => aggiungiAlComparatore(viaggio)} style={{ backgroundColor: 'brown', marginLeft: "10px", marginRight: '10px' }}>
                                    Confronta
                                </button>
                                <Link to={`/travels/${viaggio.id}`} className="travel-card-button">
                                    Dettagli del Viaggio
                                </Link>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="no-results">Non è stato trovato nulla che corrisponda ai filtri applicati.</p>
                )}
            </div>
        </div>
    )
}

