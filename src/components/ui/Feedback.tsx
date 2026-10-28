import type { ReactNode } from "react"
import Button from "./Button"
import styles from "./Feedback.module.css"

/** Stato vuoto: nessun dato da mostrare, con azione opzionale. */
type EmptyStateProps = { icon?: ReactNode; title?: ReactNode; children?: ReactNode; action?: ReactNode }

export function EmptyState({ icon, title, children, action }: EmptyStateProps) {
    return (
        <div className={styles.empty}>
            {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
            {title && <h2 className={styles.title}>{title}</h2>}
            {children && <p>{children}</p>}
            {action}
        </div>
    )
}

/** Messaggio di errore annunciato agli screen reader, con "Riprova" opzionale. */
type ErrorStateProps = { title?: ReactNode; children?: ReactNode; onRetry?: () => void }

export function ErrorState({ title = "Qualcosa è andato storto", children, onRetry }: ErrorStateProps) {
    return (
        <div className={`${styles.empty} ${styles.error}`} role="alert">
            <span className={styles.icon} aria-hidden="true">⚠️</span>
            <h2 className={styles.title}>{title}</h2>
            {children && <p>{children}</p>}
            {onRetry && <Button variant="danger" onClick={onRetry}>Riprova</Button>}
        </div>
    )
}

/** Caricamento annunciato agli screen reader. */
export function LoadingState({ label = "Caricamento in corso..." }: { label?: string }) {
    return (
        <div className={styles.loading} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <span>{label}</span>
        </div>
    )
}

/** Placeholder animato con la forma del contenuto in arrivo. */
export function Skeleton({ height = 78, count = 1 }: { height?: number; count?: number }) {
    return (
        <div className={styles.skeletonGroup} aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={styles.skeleton} style={{ height }} />
            ))}
        </div>
    )
}
