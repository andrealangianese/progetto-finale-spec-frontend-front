import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getTravels, getTravelsByIds } from "../lib/api"
import { classificaViaggi, PREFERENZE_DEFAULT } from "../lib/matcher"
import useLocalStorage from "../hooks/useLocalStorage"
import { useTravelLists } from "../context/travelLists"

const ETICHETTE_ADRENALINA = ["", "Relax totale", "Tranquillo", "Equilibrato", "Avventuroso", "Adrenalina pura"]

function MatchRing({ valore }) {
    const colore = valore >= 80 ? "#2b8a3e" : valore >= 55 ? "#f08c00" : "#e03131"
    return (
        <div
            className="match-ring"
            style={{ background: `conic-gradient(${colore} ${valore * 3.6}deg, #eef0f2 0deg)` }}
            aria-label={`Compatibilità ${valore}%`}
        >
            <span>{valore}%</span>
        </div>
    )
}

export default function TripMatcherPage() {
    const navigate = useNavigate()
    const { impostaConfronto, togglePreferito, isPreferito } = useTravelLists()
    const [prefSalvate, setPref] = useLocalStorage("trip_matcher_prefs", PREFERENZE_DEFAULT)
    // merge con i default: preferenze salvate da versioni precedenti potrebbero non avere tutti i campi
    const pref = useMemo(() => ({ ...PREFERENZE_DEFAULT, ...prefSalvate }), [prefSalvate])
    const aggiorna = (chiave, valore) => setPref(prev => ({ ...prev, [chiave]: valore }))

    // Il matcher ha bisogno di prezzo/durata/adrenalina: carico il dettaglio di tutti i viaggi
    const [stato, setStato] = useState({ viaggi: [], loading: true, errore: null })
    useEffect(() => {
        const controller = new AbortController()
        const options = { signal: controller.signal }
        getTravels({}, options)
            .then(lista => getTravelsByIds(lista.map(v => v.id), options))
            .then(viaggi => setStato({ viaggi, loading: false, errore: null }))
            .catch(err => {
                if (err.name !== "AbortError") setStato({ viaggi: [], loading: false, errore: err.message })
            })
        return () => controller.abort()
    }, [])

    const categorie = useMemo(
        () => [...new Set(stato.viaggi.map(v => v.category))].sort(),
        [stato.viaggi]
    )
    const classifica = useMemo(() => classificaViaggi(stato.viaggi, pref), [stato.viaggi, pref])
    const [vincitore, ...altri] = classifica

    const toggleCategoria = (cat) => aggiorna(
        "categorie",
        pref.categorie.includes(cat) ? pref.categorie.filter(c => c !== cat) : [...pref.categorie, cat]
    )

    const confrontaTop3 = () => {
        impostaConfronto(classifica.slice(0, 3).map(r => r.viaggio))
        navigate("/comparazione-viaggi")
    }

    return (
        <div className="homepage-container matcher">
            <h1 className="homepage-title">✨ Trip Matcher</h1>
            <p className="matcher-intro">Dicci cosa cerchi: ordiniamo i viaggi per compatibilità, in tempo reale.</p>

            <div className="matcher-layout">
                <aside className="matcher-panel">
                    <label className="filter-label" htmlFor="pref-budget">Budget massimo</label>
                    <output className="matcher-value">{pref.budget.toLocaleString("it-IT")} €</output>
                    <input id="pref-budget" type="range" min="300" max="3500" step="50"
                        value={pref.budget} onChange={e => aggiorna("budget", Number(e.target.value))} />

                    <label className="filter-label" htmlFor="pref-giorni">Giorni disponibili</label>
                    <output className="matcher-value">{pref.giorni} giorni</output>
                    <input id="pref-giorni" type="range" min="2" max="15"
                        value={pref.giorni} onChange={e => aggiorna("giorni", Number(e.target.value))} />

                    <label className="filter-label" htmlFor="pref-adrenalina">Livello di adrenalina</label>
                    <output className="matcher-value">{"⚡".repeat(pref.adrenalina)} {ETICHETTE_ADRENALINA[pref.adrenalina]}</output>
                    <input id="pref-adrenalina" type="range" min="1" max="5"
                        value={pref.adrenalina} onChange={e => aggiorna("adrenalina", Number(e.target.value))} />

                    <span className="filter-label">Categorie preferite <small>(opzionale)</small></span>
                    <div className="matcher-chips">
                        {categorie.map(cat => (
                            <button key={cat} type="button"
                                className={`chip ${pref.categorie.includes(cat) ? "is-active" : ""}`}
                                aria-pressed={pref.categorie.includes(cat)}
                                onClick={() => toggleCategoria(cat)}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <button type="button" className="btn-link" onClick={() => setPref(PREFERENZE_DEFAULT)}>
                        Ripristina preferenze
                    </button>
                </aside>

                <section className="matcher-results" aria-live="polite">
                    {stato.loading ? (
                        <p className="detail-loading">Analizziamo i viaggi...</p>
                    ) : stato.errore ? (
                        <p className="detail-error">Impossibile caricare i viaggi: {stato.errore}</p>
                    ) : vincitore && (
                        <>
                            <article className="match-hero">
                                <img src={vincitore.viaggio.image} alt="" className="match-hero-img" />
                                <div className="match-hero-body">
                                    <span className="match-hero-tag">Il tuo match perfetto</span>
                                    <div className="match-hero-head">
                                        <MatchRing valore={vincitore.match} />
                                        <div>
                                            <h2>{vincitore.viaggio.title}</h2>
                                            <p className="match-meta">
                                                📍 {vincitore.viaggio.destination} · {vincitore.viaggio.durationDay} giorni · {vincitore.viaggio.price.toLocaleString("it-IT")} €
                                            </p>
                                        </div>
                                    </div>
                                    <ul className="match-reasons">
                                        {vincitore.pro.map(m => <li key={m} className="pro">{m}</li>)}
                                        {vincitore.contro.map(m => <li key={m} className="contro">{m}</li>)}
                                    </ul>
                                    <div className="match-actions">
                                        <Link to={`/travels/${vincitore.viaggio.id}`} className="travel-card-button">Scopri il viaggio</Link>
                                        <button type="button" className="btn-secondary" onClick={() => togglePreferito(vincitore.viaggio)}>
                                            {isPreferito(vincitore.viaggio.id) ? "❤️ Salvato" : "🤍 Salva"}
                                        </button>
                                        <button type="button" className="btn-secondary" onClick={confrontaTop3}>
                                            ⚖️ Confronta i top 3
                                        </button>
                                    </div>
                                </div>
                            </article>

                            <ol className="match-list">
                                {altri.map(({ viaggio, match, pro, contro }) => (
                                    <li key={viaggio.id}>
                                        <Link to={`/travels/${viaggio.id}`} className="match-row">
                                            <span className="match-row-title">{viaggio.title}</span>
                                            <span className="match-row-hint">{pro[0] ?? contro[0]}</span>
                                            <span className="match-bar" aria-hidden="true">
                                                <span style={{ width: `${match}%` }} />
                                            </span>
                                            <span className="match-row-value">{match}%</span>
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}
