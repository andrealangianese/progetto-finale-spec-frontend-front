import useDocumentTitle from "../hooks/useDocumentTitle"
import { Button, Container } from "../components/ui"
import styles from "./NotFoundPage.module.css"

export default function NotFoundPage() {
    useDocumentTitle("Pagina non trovata")

    return (
        <Container className={styles.page}>
            <p className={styles.code} aria-hidden="true">404</p>
            <h1 className={styles.title}>Sentiero non trovato <span aria-hidden="true">🧭</span></h1>
            <p className={styles.text}>La pagina che cerchi non esiste o è stata spostata.</p>
            <Button to="/">Torna alla Home</Button>
        </Container>
    )
}
