import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getSimilarTravels, isAbortError } from "../../lib/api"
import { formatEuro, formatGiorni } from "../../lib/format"
import { Badge, Card, Skeleton } from "../ui"
import type { Travel } from "../../types"
import styles from "./SimilarTravels.module.css"

/** "Potrebbe piacerti anche": contenuto secondario, se la chiamata fallisce la sezione non compare. */
export default function SimilarTravels({ travelId }: { travelId: number }) {
    const [risultato, setRisultato] = useState<{ id: number | null; viaggi: Travel[] }>({ id: null, viaggi: [] })
    const loading = risultato.id !== travelId

    useEffect(() => {
        const controller = new AbortController()
        getSimilarTravels(travelId, { limit: 3 }, { signal: controller.signal })
            .then(viaggi => setRisultato({ id: travelId, viaggi }))
            .catch((err: unknown) => {
                if (!isAbortError(err)) setRisultato({ id: travelId, viaggi: [] })
            })
        return () => controller.abort()
    }, [travelId])

    if (!loading && risultato.viaggi.length === 0) return null

    return (
        <section className={styles.section} aria-labelledby="titolo-simili">
            <h2 id="titolo-simili" className={styles.title}>Potrebbe piacerti anche</h2>
            {loading ? (
                <Skeleton height={120} count={1} />
            ) : (
                <ul className={styles.grid}>
                    {risultato.viaggi.map(viaggio => (
                        <li key={viaggio.id}>
                            <Card as="article" interactive className={styles.card}>
                                <Badge>{viaggio.category}</Badge>
                                <h3 className={styles.cardTitle}>
                                    <Link to={`/travels/${viaggio.id}`} className={styles.link}>{viaggio.title}</Link>
                                </h3>
                                <p className={styles.meta}>
                                    <span aria-hidden="true">📍</span> {viaggio.destination} · {formatGiorni(viaggio.durationDay)} · {formatEuro(viaggio.price)}
                                </p>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
