import { Link } from "react-router-dom"
import styles from "./BackLink.module.css"

/** Link "indietro" unico per tutta l'app. */
export default function BackLink({ to = "/", children = "Torna alla Home" }) {
    return (
        <Link to={to} className={styles.back}>
            <span aria-hidden="true">←</span> {children}
        </Link>
    )
}
