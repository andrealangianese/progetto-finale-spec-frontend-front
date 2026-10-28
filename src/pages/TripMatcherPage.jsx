import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getAllTravels } from "../lib/api"
import { classificaViaggi, PREFERENZE_DEFAULT } from "../lib/matcher"
import { formatEuro, formatGiorni } from "../lib/format"
import useLocalStorage from "../hooks/useLocalStorage"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { useTravelLists } from "../context/travelLists"
import {
    Badge, Button, Card, Chip, Container, ErrorState, LoadingState,
    PageHeader, ProgressBar, ProgressRing, RangeField,
} from "../components/ui"
import styles from "./TripMatcherPage.module.css"

const ETICHETTE_ADRENALINA = ["", "Relax totale", "Tranquillo", "Equilibrato", "Avventuroso", "Adrenalina pura"]

export default function TripMatcherPage() {
    useDocumentTitle("Trip Matcher")
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
        getAllTravels(options)
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
        <Container size="lg">
            <PageHeader
                title="✨ Trip Matcher"
                subtitle="Dicci cosa cerchi: ordiniamo i viaggi per compatibilità, in tempo reale."
            />

            <div className={styles.layout}>
                <Card as="aside" className={styles.panel} aria-labelledby="titolo-preferenze">
                    <h2 id="titolo-preferenze" className="sr-only">Le tue preferenze</h2>
                    <RangeField
                        label="Budget massimo"
                        valueLabel={formatEuro(pref.budget)}
                        min="300" max="3500" step="50"
                        value={pref.budget}
                        onChange={e => aggiorna("budget", Number(e.target.value))}
                    />
                    <RangeField
                        label="Giorni disponibili"
                        valueLabel={formatGiorni(pref.giorni)}
                        min="2" max="15"
                        value={pref.giorni}
                        onChange={e => aggiorna("giorni", Number(e.target.value))}
                    />
                    <RangeField
                        label="Livello di adrenalina"
                        valueLabel={`${pref.adrenalina}/5 · ${ETICHETTE_ADRENALINA[pref.adrenalina]}`}
                        min="1" max="5"
                        value={pref.adrenalina}
                        onChange={e => aggiorna("adrenalina", Number(e.target.value))}
                    />

                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Categorie preferite <span>(opzionale)</span></legend>
                        <div className={styles.chips}>
                            {categorie.map(cat => (
                                <Chip key={cat} selected={pref.categorie.includes(cat)} onClick={() => toggleCategoria(cat)}>
                                    {cat}
                                </Chip>
                            ))}
                        </div>
                    </fieldset>

                    <Button variant="ghost" size="sm" className={styles.reset} onClick={() => setPref(PREFERENZE_DEFAULT)}>
                        Ripristina preferenze
                    </Button>
                </Card>

                <section className={styles.results} aria-labelledby="titolo-risultati">
                    <h2 id="titolo-risultati" className="sr-only">Viaggi ordinati per compatibilità</h2>
                    {stato.loading ? (
                        <LoadingState label="Analizziamo i viaggi..." />
                    ) : stato.errore ? (
                        <ErrorState title="Impossibile caricare i viaggi">{stato.errore}</ErrorState>
                    ) : vincitore && (
                        <>
                            <Card as="article" padding="none" className={styles.hero} aria-labelledby="titolo-vincitore">
                                <img src={vincitore.viaggio.image} alt="" className={styles.heroImg} />
                                <div className={styles.heroBody}>
                                    <Badge>Il tuo match perfetto</Badge>
                                    <div className={styles.heroHead}>
                                        <ProgressRing value={vincitore.match} label={`Compatibilità ${vincitore.match}%`} />
                                        <div>
                                            <h3 id="titolo-vincitore" className={styles.heroTitle}>{vincitore.viaggio.title}</h3>
                                            <p className={styles.meta}>
                                                <span aria-hidden="true">📍</span> {vincitore.viaggio.destination} · {formatGiorni(vincitore.viaggio.durationDay)} · {formatEuro(vincitore.viaggio.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <ul className={styles.reasons} aria-label="Perché è adatto a te">
                                        {vincitore.pro.map(m => <li key={m}><Badge tone="success">{m}</Badge></li>)}
                                        {vincitore.contro.map(m => <li key={m}><Badge tone="warning">{m}</Badge></li>)}
                                    </ul>
                                    <div className={styles.actions}>
                                        <Button to={`/travels/${vincitore.viaggio.id}`}>Scopri il viaggio</Button>
                                        <Button variant="secondary" pressed={isPreferito(vincitore.viaggio.id)} onClick={() => togglePreferito(vincitore.viaggio)}>
                                            <span aria-hidden="true">{isPreferito(vincitore.viaggio.id) ? "❤️" : "🤍"}</span> Salva
                                        </Button>
                                        <Button variant="secondary" onClick={confrontaTop3}>
                                            <span aria-hidden="true">⚖️</span> Confronta i top 3
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <ol className={styles.list} start={2}>
                                {altri.map(({ viaggio, match, pro, contro }) => (
                                    <li key={viaggio.id}>
                                        <Link to={`/travels/${viaggio.id}`} className={styles.row}>
                                            <span className={styles.rowTitle}>{viaggio.title}</span>
                                            <span className={styles.rowHint}>{pro[0] ?? contro[0]}</span>
                                            <span className={styles.rowBar}><ProgressBar value={match} label={`Compatibilità ${match}%`} /></span>
                                            <span className={styles.rowValue} aria-hidden="true">{match}%</span>
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </section>
            </div>
        </Container>
    )
}
