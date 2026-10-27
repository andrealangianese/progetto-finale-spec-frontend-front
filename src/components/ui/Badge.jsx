import styles from "./Badge.module.css"

/**
 * Etichetta compatta per categorie, stati e contatori.
 * `tone`: brand | neutral | success | warning | danger | inverse
 */
export default function Badge({ tone = "brand", className = "", children, ...rest }) {
    return (
        <span className={`${styles.badge} ${styles[tone]} ${className}`} {...rest}>
            {children}
        </span>
    )
}
