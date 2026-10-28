import type { HTMLAttributes } from "react"
import styles from "./Badge.module.css"

export type BadgeTone = "brand" | "neutral" | "success" | "warning" | "danger" | "inverse"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }

/**
 * Etichetta compatta per categorie, stati e contatori.
 * `tone`: brand | neutral | success | warning | danger | inverse
 */
export default function Badge({ tone = "brand", className = "", children, ...rest }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[tone]} ${className}`} {...rest}>
            {children}
        </span>
    )
}
