import { useEffect, useRef, useState } from "react"

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
            return titoloA.localeCompare(titoloB); // Fa tutto da solo: restituisce -1, 1 o 0 in automatico!
        } else if (ordinamentoAlfabetico === 'title-desc') {
            return titoloB.localeCompare(titoloA); // Al contrario per la Z-A
        }
        return 0;
    })

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
                            <button className="travel-card-button">Vai al dettaglio del Viaggio</button>
                        </div>
                    ))
                ) : (
                    <p className="no-results">Non è stato trovato nulla che corrisponda ai filtri applicati.</p>
                )}
            </div>
        </div>
    )
}