import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { errorMessage, getTravels, getTravelsMeta, isAbortError } from "../lib/api"
import type { TravelSummary } from "../types"
import useDebouncedValue from "../hooks/useDebouncedValue"
import useDocumentTitle from "../hooks/useDocumentTitle"
import TravelCard from "../components/travel/TravelCard"
import { Button, Container, EmptyState, ErrorState, PageHeader, SelectField, Skeleton, TextField } from "../components/ui"
import styles from "./HomePage.module.css"

const TUTTE = ''

const OPZIONI_ORDINAMENTO = [
    { value: '', label: 'Ordine di Default' },
    { value: 'title-asc', label: 'Titoli da A - Z' },
    { value: 'title-desc', label: 'Titoli da Z - A' },
]

export default function HomePage() {
    useDocumentTitle('Viaggi d\'avventura')
    // I filtri vivono nell'URL (?q=surf&category=Surf&sort=title-asc): link condivisibili e back/forward funzionanti
    const [searchParams, setSearchParams] = useSearchParams()
    const q = searchParams.get('q') ?? ''
    const categoria = searchParams.get('category') ?? TUTTE
    const ordinamento = searchParams.get('sort') ?? ''

    // Il testo digitato aggiorna l'URL (e quindi la chiamata API) solo dopo 300ms di pausa
    const [testo, setTesto] = useState(q)
    const testoDebounced = useDebouncedValue(testo.trim(), 300)

    const aggiornaParam = (chiave: string, valore: string) => {
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

    // Categorie da /travels/meta: lette una volta, così la select non si svuota filtrando
    const [categorie, setCategorie] = useState<string[]>([])
    useEffect(() => {
        const controller = new AbortController()
        getTravelsMeta({ signal: controller.signal })
            .then(meta => setCategorie(meta.categories))
            .catch(() => { })
        return () => controller.abort()
    }, [])

    // Risultati: la ricerca e il filtro per categoria li fa il backend
    const chiave = `${q}|${categoria}`
    const [risultato, setRisultato] = useState<{ chiave: string | null; viaggi: TravelSummary[]; errore: string | null }>(
        { chiave: null, viaggi: [], errore: null }
    )
    const [tentativo, setTentativo] = useState(0)
    const loading = risultato.chiave !== `${chiave}|${tentativo}`

    useEffect(() => {
        const controller = new AbortController()
        const chiaveRichiesta = `${q}|${categoria}|${tentativo}`
        getTravels({ search: q, category: categoria }, { signal: controller.signal })
            .then(viaggi => setRisultato({ chiave: chiaveRichiesta, viaggi, errore: null }))
            .catch((err: unknown) => {
                if (!isAbortError(err)) setRisultato({ chiave: chiaveRichiesta, viaggi: [], errore: errorMessage(err) })
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
        <Container>
            <PageHeader title="I nostri viaggi all'insegna dell'avventura" />

            <Link to="/trova-il-tuo-viaggio" className={styles.cta}>
                <span>✨ Non sai da dove partire? Imposta budget, giorni e adrenalina: troviamo il viaggio giusto per te.</span>
                <strong>Prova il Trip Matcher <span aria-hidden="true">→</span></strong>
            </Link>

            <form role="search" className={styles.filters} aria-label="Filtra i viaggi" onSubmit={e => e.preventDefault()}>
                <TextField
                    label="Cerca per titolo"
                    type="search"
                    placeholder="Es: Downhill, Surf..."
                    value={testo}
                    onChange={e => setTesto(e.target.value)}
                    grow
                />
                <SelectField
                    label="Filtra per categoria"
                    value={categoria}
                    onChange={e => aggiornaParam('category', e.target.value)}
                    options={[{ value: TUTTE, label: 'Tutte le categorie' }, ...categorie.map(c => ({ value: c, label: c }))]}
                />
                <SelectField
                    label="Ordina per"
                    value={ordinamento}
                    onChange={e => aggiornaParam('sort', e.target.value)}
                    options={OPZIONI_ORDINAMENTO}
                />
                {filtriAttivi && (
                    <Button variant="ghost" onClick={() => { setTesto(''); setSearchParams({}, { replace: true }) }}>
                        Azzera filtri
                    </Button>
                )}
            </form>

            {risultato.errore && !loading ? (
                <ErrorState title="Non riusciamo a caricare i viaggi" onRetry={() => setTentativo(t => t + 1)}>
                    {risultato.errore}
                </ErrorState>
            ) : loading && risultato.chiave === null ? (
                <Skeleton count={4} />
            ) : (
                <section aria-labelledby="titolo-risultati">
                    <h2 id="titolo-risultati" className={styles.count} aria-live="polite">
                        {loading ? 'Ricerca in corso...' : `${viaggiOrdinati.length} viaggi trovati`}
                    </h2>
                    <div className={`${styles.list} ${loading ? styles.stale : ''}`} aria-busy={loading}>
                        {viaggiOrdinati.map(viaggio => (
                            <TravelCard key={viaggio.id} viaggio={viaggio} headingLevel={3} />
                        ))}
                        {!loading && viaggiOrdinati.length === 0 && (
                            <EmptyState icon="🧭" title="Nessun viaggio trovato">
                                Prova a cambiare i filtri o azzerali per vedere tutti i viaggi.
                            </EmptyState>
                        )}
                    </div>
                </section>
            )}
        </Container>
    )
}
