import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getTravels } from "../lib/api"
import useDebouncedValue from "../hooks/useDebouncedValue"
import TravelCard from "./TravelCard"

const TUTTE = ''

export default function HomePage() {
    // I filtri vivono nell'URL (?q=surf&category=Surf&sort=title-asc): link condivisibili e back/forward funzionanti
    const [searchParams, setSearchParams] = useSearchParams()
    const q = searchParams.get('q') ?? ''
    const categoria = searchParams.get('category') ?? TUTTE
    const ordinamento = searchParams.get('sort') ?? ''

    // Il testo digitato aggiorna l'URL (e quindi la chiamata API) solo dopo 300ms di pausa
    const [testo, setTesto] = useState(q)
    const testoDebounced = useDebouncedValue(testo.trim(), 300)

    const aggiornaParam = (chiave, valore) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            if (valore) next.set(chiave, valore)
            else next.delete(chiave)
            return next
        }, { replace: true })
    }

    useEffect(() => {
        if (testoDebounced !== q) aggiornaParam('q', testoDebounced)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testoDebounced])

    // Categorie: lette una volta dalla lista completa, così la select non si svuota filtrando
    const [categorie, setCategorie] = useState([])
    useEffect(() => {
        const controller = new AbortController()
        getTravels({}, { signal: controller.signal })
            .then(data => setCategorie([...new Set(data.map(v => v.category).filter(Boolean))].sort()))
            .catch(() => { })
        return () => controller.abort()
    }, [])

    // Risultati: la ricerca e il filtro per categoria li fa il backend
    const chiave = `${q}|${categoria}`
    const [risultato, setRisultato] = useState({ chiave: null, viaggi: [], errore: null })
    const [tentativo, setTentativo] = useState(0)
    const loading = risultato.chiave !== `${chiave}|${tentativo}`

    useEffect(() => {
        const controller = new AbortController()
        const chiaveRichiesta = `${q}|${categoria}|${tentativo}`
        getTravels({ search: q, category: categoria }, { signal: controller.signal })
            .then(viaggi => setRisultato({ chiave: chiaveRichiesta, viaggi, errore: null }))
            .catch(err => {
                if (err.name !== 'AbortError') setRisultato({ chiave: chiaveRichiesta, viaggi: [], errore: err.message })
            })
        return () => controller.abort()
    }, [q, categoria, tentativo])

    // ordinamento lato client: il backend non lo supporta
    const viaggiOrdinati = [...risultato.viaggi].sort((a, b) => {
        if (ordinamento === 'title-asc') return a.title.localeCompare(b.title, 'it')
        if (ordinamento === 'title-desc') return b.title.localeCompare(a.title, 'it')
        return 0
    })

    const filtriAttivi = q || categoria || ordinamento

    return (
        <div className="homepage-container">
            <h1 className="homepage-title">I nostri viaggi all'insegna dell'avventura</h1>

            {/* PANNELLO FILTRI */}
            <div className="filters-panel">
                <div className="filter-group flex-grow">
                    <label className="filter-label" htmlFor="filtro-titolo">Cerca per titolo</label>
                    <input
                        id="filtro-titolo"
                        type="search"
                        placeholder="Es: Downhill, Surf..."
                        value={testo}
                        onChange={e => setTesto(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label" htmlFor="filtro-categoria">Filtra per categoria</label>
                    <select
                        id="filtro-categoria"
                        value={categoria}
                        onChange={e => aggiornaParam('category', e.target.value)}
                        className="filter-select"
                    >
                        <option value={TUTTE}>Tutte le categorie</option>
                        {categorie.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label" htmlFor="filtro-ordine">Ordina per</label>
                    <select
                        id="filtro-ordine"
                        value={ordinamento}
                        onChange={e => aggiornaParam('sort', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Ordine di Default</option>
                        <option value="title-asc">Titoli da A - Z</option>
                        <option value="title-desc">Titoli da Z - A</option>
                    </select>
                </div>

                {filtriAttivi && (
                    <button
                        className="btn-link filters-reset"
                        onClick={() => { setTesto(''); setSearchParams({}, { replace: true }) }}
                    >
                        Azzera filtri
                    </button>
                )}
            </div>

            {/* lista dei risultati finali */}
            {risultato.errore && !loading ? (
                <div className="state-box">
                    <p>Non riusciamo a caricare i viaggi: {risultato.errore}</p>
                    <button className="travel-card-button" onClick={() => setTentativo(t => t + 1)}>Riprova</button>
                </div>
            ) : loading && risultato.chiave === null ? (
                <div className="travels-grid" aria-busy="true">
                    {Array.from({ length: 4 }, (_, i) => <div key={i} className="travel-card skeleton" />)}
                </div>
            ) : (
                <>
                    <p className="results-count" aria-live="polite">
                        {loading ? 'Ricerca in corso...' : `${viaggiOrdinati.length} viaggi trovati`}
                    </p>
                    <div className={`travels-grid ${loading ? 'is-stale' : ''}`}>
                        {viaggiOrdinati.map(viaggio => (
                            <TravelCard key={viaggio.id} viaggio={viaggio} />
                        ))}
                        {!loading && viaggiOrdinati.length === 0 && (
                            <p className="no-results">Non è stato trovato nulla che corrisponda ai filtri applicati.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
