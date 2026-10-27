import styles from "./Chip.module.css"

/** Toggle compatto per selezioni multiple (es. categorie). */
export default function Chip({ selected = false, children, ...rest }) {
    return (
        <button type="button" className={styles.chip} aria-pressed={selected} {...rest}>
            {children}
        </button>
    )
}
