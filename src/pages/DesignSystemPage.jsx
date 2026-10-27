import { useState } from "react"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { useToast } from "../context/toast"
import {
    Badge, Button, Card, Chip, Container, EmptyState, ErrorState, LoadingState, PageHeader,
    ProgressBar, ProgressRing, RangeField, SelectField, Skeleton, StatCard, StatGrid, TextField,
} from "../components/ui"
import styles from "./DesignSystemPage.module.css"

const COLORI = [
    ["--color-brand-400", "Brand su scuro"], ["--color-brand-600", "Brand primario"], ["--color-brand-700", "Brand hover / link"],
    ["--color-brand-50", "Brand tenue"], ["--color-ink-900", "Ink"], ["--color-gray-900", "Testo"],
    ["--color-gray-600", "Testo secondario"], ["--color-gray-50", "Superficie tenue"],
    ["--color-success-fg", "Successo"], ["--color-warning-fg", "Attenzione"], ["--color-danger-fg", "Errore"],
]

function Sezione({ titolo, children }) {
    return (
        <section className={styles.section} aria-labelledby={`ds-${titolo}`}>
            <h2 id={`ds-${titolo}`} className={styles.sectionTitle}>{titolo}</h2>
            {children}
        </section>
    )
}

/** Guida di stile viva: ogni componente del design system nei suoi stati. Solo in sviluppo. */
export default function DesignSystemPage() {
    useDocumentTitle("Design System")
    const { notify } = useToast()
    const [pressed, setPressed] = useState(false)
    const [chip, setChip] = useState(true)
    const [range, setRange] = useState(3)

    return (
        <Container size="lg">
            <PageHeader
                title="Design System"
                subtitle="Token e componenti riutilizzabili di LangiaRoad. Importa da src/components/ui."
            />

            <Sezione titolo="Colori">
                <ul className={styles.swatches}>
                    {COLORI.map(([token, nome]) => (
                        <li key={token} className={styles.swatch}>
                            <span className={styles.swatchColor} style={{ background: `var(${token})` }} />
                            <strong>{nome}</strong>
                            <code>{token}</code>
                        </li>
                    ))}
                </ul>
            </Sezione>

            <Sezione titolo="Button">
                <div className={styles.row}>
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="subtle">Subtle</Button>
                    <Button size="sm">Small</Button>
                    <Button disabled>Disabled</Button>
                    <Button variant="subtle" iconOnly aria-label="Preferito" pressed={pressed} onClick={() => setPressed(p => !p)}>
                        <span aria-hidden="true">{pressed ? "❤️" : "🤍"}</span>
                    </Button>
                    <Button to="/">Link come bottone</Button>
                </div>
            </Sezione>

            <Sezione titolo="Badge e Chip">
                <div className={styles.row}>
                    {["brand", "neutral", "success", "warning", "danger", "inverse"].map(t => <Badge key={t} tone={t}>{t}</Badge>)}
                    <Chip selected={chip} onClick={() => setChip(c => !c)}>Chip toggle</Chip>
                </div>
            </Sezione>

            <Sezione titolo="Form">
                <div className={styles.row}>
                    <TextField label="Testo" placeholder="Scrivi..." hint="(con suggerimento)" />
                    <SelectField label="Select" options={[{ value: "a", label: "Opzione A" }, { value: "b", label: "Opzione B" }]} />
                </div>
                <div className={styles.narrow}>
                    <RangeField label="Range" valueLabel={`${range}/5`} min="1" max="5" value={range} onChange={e => setRange(Number(e.target.value))} />
                </div>
            </Sezione>

            <Sezione titolo="Dati">
                <StatGrid>
                    <StatCard label="Prezzo" value="1.250 €" />
                    <StatCard label="Durata" value="7 giorni" />
                </StatGrid>
                <div className={styles.row}>
                    <ProgressRing value={92} />
                    <ProgressRing value={64} />
                    <ProgressRing value={30} />
                    <div className={styles.narrow}><ProgressBar value={72} label="Esempio 72%" /></div>
                </div>
            </Sezione>

            <Sezione titolo="Card">
                <Card interactive>Card interattiva con padding md</Card>
            </Sezione>

            <Sezione titolo="Feedback">
                <div className={styles.row}>
                    <Button onClick={() => notify("Operazione riuscita")}>Toast success</Button>
                    <Button variant="secondary" onClick={() => notify("Informazione", "info")}>Toast info</Button>
                    <Button variant="danger" onClick={() => notify("Errore!", "error")}>Toast error</Button>
                </div>
                <EmptyState icon="🧭" title="Stato vuoto" action={<Button size="sm">Azione</Button>}>Descrizione dello stato vuoto.</EmptyState>
                <ErrorState onRetry={() => notify("Riprovo...", "info")}>Dettaglio dell'errore.</ErrorState>
                <LoadingState />
                <Skeleton count={2} />
            </Sezione>
        </Container>
    )
}
