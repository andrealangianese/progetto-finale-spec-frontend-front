import type { ElementType, HTMLAttributes } from "react"
import styles from "./Card.module.css"

type CardProps = HTMLAttributes<HTMLElement> & {
    /** Elemento HTML da usare (div, article, section, aside, li...) */
    as?: ElementType
    padding?: "none" | "md" | "lg"
    /** Aggiunge l'effetto hover */
    interactive?: boolean
}

/** Superficie contenitore. */
export default function Card({ as: Tag = "div", padding = "md", interactive = false, className = "", children, ...rest }: CardProps) {
    const classes = [styles.card, styles[`padding-${padding}`], interactive && styles.interactive, className]
        .filter(Boolean).join(" ")
    return <Tag className={classes} {...rest}>{children}</Tag>
}
