import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getTravel } from "../lib/api"
import { formatAdrenalina, formatEuro, formatGiorni } from "../lib/format"
import { useTravelLists } from "../context/travelLists"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { BackLink, Badge, Button, Container, ErrorState, LoadingState, StatCard, StatGrid } from "../components/ui"
import styles from "./DetailPage.module.css"

export default function DetailPage() {
    // Recupero l'id dall'URL
    const { id } = useParams()
    const { isPreferito, isInConfronto, togglePreferito, toggleConfronto } = useTravelLists()

    // Risultato legato all'id richiesto: se cambia l'id, torna automaticamente in caricamento
    const [risultato, setRisultato] = useState({ id: null, viaggio: null, errore: null })
    const loading = risultato.id !== id
    const viaggio = risultato.viaggio

    useDocumentTitle(loading ? "Caricamento..." : viaggio?.title ?? "Viaggio non trovato")

    useEffect(() => {
        const controller = new AbortController()
        getTravel(id, { signal: controller.signal })
            .then(viaggio => setRisultato({ id, viaggio, errore: null }))
            .catch(error => {
                if (error.name === "AbortError") return
                setRisultato({ id, viaggio: null, errore: error.status === 404 ? "Viaggio non trovato!" : error.message })
            })
        return () => controller.abort()
    }, [id]);

    if (loading) return <LoadingState label="Caricamento del viaggio..." />
    if (!viaggio) return (
        <Container>
            <ErrorState title={risultato.errore}>
                <Button to="/" variant="secondary">Torna alla Home</Button>
            </ErrorState>
        </Container>
    )

    return (
        <Container size="lg">
            <BackLink />

            <article className={styles.layout}>
                <div className={styles.media}>
                    <img src={viaggio.image} alt="" className={styles.img} />
                </div>

                <div className={styles.info}>
                    <Badge>{viaggio.category}</Badge>
                    <h1 className={styles.title}>{viaggio.title}</h1>
                    <p className={styles.destination}><span aria-hidden="true">📍</span> {viaggio.destination}</p>
                    <p className={styles.description}>{viaggio.description}</p>

                    <StatGrid>
                        <StatCard label="Durata" value={formatGiorni(viaggio.durationDay)} />
                        <StatCard label="Prezzo" value={formatEuro(viaggio.price)} />
                        <StatCard label="Difficoltà" value={viaggio.difficulty} />
                        <StatCard label="Adrenalina" value={formatAdrenalina(viaggio.adrenalineLevel)} />
                    </StatGrid>

                    {viaggio.requiredEquipment?.length > 0 && (
                        <section className={styles.equipment} aria-labelledby="titolo-equipaggiamento">
                            <h2 id="titolo-equipaggiamento" className={styles.equipmentTitle}>Equipaggiamento richiesto</h2>
                            <ul className={styles.equipmentList}>
                                {viaggio.requiredEquipment.map(item => (
                                    <li key={item}><span aria-hidden="true">👉</span> {item}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <div className={styles.actions}>
                        <Button variant="secondary" pressed={isPreferito(viaggio.id)} onClick={() => togglePreferito(viaggio)}>
                            <span aria-hidden="true">{isPreferito(viaggio.id) ? "❤️" : "🤍"}</span> Preferito
                        </Button>
                        <Button pressed={isInConfronto(viaggio.id)} onClick={() => toggleConfronto(viaggio)}>
                            {isInConfronto(viaggio.id) && <span aria-hidden="true">✓</span>} Confronta questo viaggio
                        </Button>
                    </div>
                </div>
            </article>
        </Container>
    )
}
