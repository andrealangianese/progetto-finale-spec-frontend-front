import { useTravelLists } from "../../context/travelLists"
import { Badge, Button, Card } from "../ui"
import styles from "./TravelCard.module.css"

/** Riga della lista viaggi con azioni preferito / confronto / dettaglio. */
export default function TravelCard({ viaggio, headingLevel = 2 }) {
    const { isPreferito, isInConfronto, togglePreferito, toggleConfronto } = useTravelLists()
    const preferito = isPreferito(viaggio.id)
    const inConfronto = isInConfronto(viaggio.id)
    const Heading = `h${headingLevel}`

    return (
        <Card as="article" interactive className={styles.card}>
            <div className={styles.content}>
                <Heading className={styles.title}>{viaggio.title}</Heading>
                <Badge>{viaggio.category}</Badge>
            </div>

            <div className={styles.actions}>
                <Button
                    variant="subtle"
                    iconOnly
                    pressed={preferito}
                    onClick={() => togglePreferito(viaggio)}
                    aria-label={`Preferito: ${viaggio.title}`}
                    title={preferito ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                >
                    <span aria-hidden="true">{preferito ? "❤️" : "🤍"}</span>
                </Button>
                <Button
                    variant="secondary"
                    pressed={inConfronto}
                    onClick={() => toggleConfronto(viaggio)}
                >
                    {/* Testo stabile: lo stato lo comunica aria-pressed, il ✓ è solo visivo */}
                    {inConfronto && <span aria-hidden="true">✓</span>}
                    Confronta<span className="sr-only"> {viaggio.title}</span>
                </Button>
                <Button to={`/travels/${viaggio.id}`}>
                    Dettagli del Viaggio<span className="sr-only">: {viaggio.title}</span>
                </Button>
            </div>
        </Card>
    )
}
