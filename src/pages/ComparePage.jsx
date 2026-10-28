import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTravelLists } from "../context/travelLists";
import { getTravelsByIds } from "../lib/api";
import { formatAdrenalina, formatEuro, formatGiorni } from "../lib/format";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { Button, Container, EmptyState, ErrorState, LoadingState, PageHeader } from "../components/ui";
import styles from "./ComparePage.module.css";

// Righe della tabella: `best` indica quale valore evidenziare ("min" | "max")
const RIGHE = [
    { label: "Categoria", render: v => v.category },
    { label: "Destinazione", render: v => `📍 ${v.destination}` },
    { label: "Prezzo", value: v => v.price, best: "min", render: v => formatEuro(v.price) },
    { label: "Durata", value: v => v.durationDay, best: "max", render: v => formatGiorni(v.durationDay) },
    { label: "Prezzo al giorno", value: v => v.price / v.durationDay, best: "min", render: v => formatEuro(v.price / v.durationDay) },
    { label: "Difficoltà", render: v => v.difficulty },
    { label: "Adrenalina", value: v => v.adrenalineLevel, render: v => formatAdrenalina(v.adrenalineLevel) },
    { label: "Equipaggiamento", render: v => `${v.requiredEquipment?.length ?? 0} articoli` },
];

function valoreMigliore(riga, viaggi) {
    if (!riga.best || viaggi.length < 2) return null;
    const valori = viaggi.map(riga.value);
    return riga.best === "min" ? Math.min(...valori) : Math.max(...valori);
}

export default function ComparePage() {
    useDocumentTitle("Comparatore");
    const { confronto, toggleConfronto, svuotaConfronto, mantieniSoloInConfronto } = useTravelLists();

    // Chiave degli id selezionati: quando cambia, ricarico i dettagli
    const chiave = confronto.map(v => v.id).join(",");
    const [risultato, setRisultato] = useState({ chiave: "", viaggi: [], errore: null });

    // Riuso i dettagli già caricati: rimuovere un viaggio aggiorna la tabella senza attese
    const viaggi = confronto.map(c => risultato.viaggi.find(v => v.id === c.id)).filter(Boolean);
    const loading = viaggi.length < confronto.length && risultato.chiave !== chiave;
    const errore = risultato.chiave === chiave ? risultato.errore : null;

    // Id di cui ho già i dettagli: rimuovere viaggi (o ripulire id inesistenti) non richiede chiamate
    const idsCaricati = useRef(new Set());

    useEffect(() => {
        if (!chiave) return;
        if (chiave.split(",").every(id => idsCaricati.current.has(Number(id)))) return;
        const controller = new AbortController();
        getTravelsByIds(chiave.split(","), { signal: controller.signal })
            .then(viaggi => {
                const idsTrovati = viaggi.map(v => v.id);
                idsCaricati.current = new Set(idsTrovati);
                const idsRichiesti = chiave.split(",").map(Number);
                if (idsTrovati.length < idsRichiesti.length) {
                    // Tolgo dallo store i viaggi che non esistono più: i dati degli altri
                    // sono già qui, quindi la nuova chiave non provoca una seconda chiamata
                    mantieniSoloInConfronto(idsTrovati);
                }
                setRisultato({ chiave, viaggi, errore: null });
            })
            .catch(err => {
                if (err.name !== "AbortError") setRisultato({ chiave, viaggi: [], errore: err.message });
            });
        return () => controller.abort();
    }, [chiave, mantieniSoloInConfronto]);

    return (
        <Container size="lg">
            <PageHeader
                title="Comparatore di Viaggi"
                subtitle="Ti accompagneremo nella scelta che fa più al caso tuo"
                backTo="/"
                actions={viaggi.length > 0 && (
                    <Button variant="danger" size="sm" onClick={svuotaConfronto}>Svuota comparatore</Button>
                )}
            />

            {confronto.length === 0 ? (
                <EmptyState
                    icon="⚖️"
                    title="Nessun viaggio da confrontare"
                    action={<Button to="/">Scegli i viaggi</Button>}
                >
                    Aggiungine almeno due dalla Home o lascia scegliere al Trip Matcher.
                </EmptyState>
            ) : loading ? (
                <LoadingState label="Caricamento del confronto..." />
            ) : errore ? (
                <ErrorState title="Impossibile caricare il confronto">{errore}</ErrorState>
            ) : (
                <>
                    <div className={styles.tableWrapper} tabIndex={0} role="region" aria-labelledby="caption-confronto">
                        <table className={styles.table}>
                            <caption id="caption-confronto" className={styles.caption}>
                                {viaggi.length} viaggi a confronto · <span aria-hidden="true">★</span> valore migliore
                            </caption>
                            <thead>
                                <tr>
                                    <td className={styles.corner} />
                                    {viaggi.map(v => (
                                        <th key={v.id} scope="col" className={styles.colHead}>
                                            <img src={v.image} alt="" className={styles.img} />
                                            <Link to={`/travels/${v.id}`} className={styles.colTitle}>{v.title}</Link>
                                            <Button variant="danger" size="sm" onClick={() => toggleConfronto(v)}>
                                                Rimuovi<span className="sr-only"> {v.title}</span>
                                            </Button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {RIGHE.map(riga => {
                                    const migliore = valoreMigliore(riga, viaggi);
                                    return (
                                        <tr key={riga.label}>
                                            <th scope="row" className={styles.rowHead}>{riga.label}</th>
                                            {viaggi.map(v => {
                                                const isBest = migliore !== null && riga.value(v) === migliore;
                                                return (
                                                    <td key={v.id} className={isBest ? styles.best : undefined}>
                                                        {riga.render(v)}
                                                        {isBest && <> <span aria-hidden="true">★</span><span className="sr-only">(migliore)</span></>}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {viaggi.length === 1 && (
                        <p className={styles.hint}>Aggiungi almeno un altro viaggio per vedere le differenze.</p>
                    )}
                </>
            )}
        </Container>
    );
}
