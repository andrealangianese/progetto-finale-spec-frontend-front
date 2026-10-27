import styles from "./Container.module.css"

/** Larghezza massima e padding laterale coerenti per tutte le pagine. */
export default function Container({ size = "md", className = "", children }) {
    return <div className={`${styles.container} ${styles[size]} ${className}`}>{children}</div>
}
