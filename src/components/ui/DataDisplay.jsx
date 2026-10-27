import styles from "./DataDisplay.module.css"

/** Coppia etichetta/valore in evidenza (prezzo, durata...). */
export function StatCard({ label, value }) {
    return (
        <div className={styles.stat}>
            <dt className={styles.statLabel}>{label}</dt>
            <dd className={styles.statValue}>{value}</dd>
        </div>
    )
}

/** Griglia di StatCard: semanticamente una description list. */
export function StatGrid({ children }) {
    return <dl className={styles.statGrid}>{children}</dl>
}

const toneFor = (value) => value >= 80 ? "var(--color-success-fg)" : value >= 55 ? "var(--color-warning-fg)" : "var(--color-danger-fg)"

/** Anello percentuale (0-100) con colore semantico. */
export function ProgressRing({ value, label }) {
    return (
        <div
            className={styles.ring}
            role="img"
            aria-label={label ?? `${value}%`}
            style={{ background: `conic-gradient(${toneFor(value)} ${value * 3.6}deg, var(--color-gray-200) 0deg)` }}
        >
            <span aria-hidden="true">{value}%</span>
        </div>
    )
}

/** Barra percentuale (0-100) accessibile. */
export function ProgressBar({ value, label }) {
    return (
        <span
            className={styles.bar}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={label}
        >
            <span style={{ width: `${value}%` }} />
        </span>
    )
}
