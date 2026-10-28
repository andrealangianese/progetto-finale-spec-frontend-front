import type { ReactNode } from "react"
import styles from "./Container.module.css"

type ContainerProps = { size?: "md" | "lg"; className?: string; children: ReactNode }

/** Larghezza massima e padding laterale coerenti per tutte le pagine. */
export default function Container({ size = "md", className = "", children }: ContainerProps) {
    return <div className={`${styles.container} ${styles[size]} ${className}`}>{children}</div>
}
