import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import styles from "./BackLink.module.css"

type BackLinkProps = { to?: string; children?: ReactNode }

/** Link "indietro" unico per tutta l'app. */
export default function BackLink({ to = "/", children = "Torna alla Home" }: BackLinkProps) {
    return (
        <Link to={to} className={styles.back}>
            <span aria-hidden="true">←</span> {children}
        </Link>
    )
}
