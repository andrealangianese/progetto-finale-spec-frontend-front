import BackLink from "./BackLink"
import styles from "./PageHeader.module.css"

/** Intestazione di pagina: link indietro opzionale, unico <h1>, sottotitolo e azioni. */
export default function PageHeader({ title, subtitle, backTo, backLabel = "Torna alla Home", actions }) {
    return (
        <header className={styles.header}>
            {backTo && <BackLink to={backTo}>{backLabel}</BackLink>}
            <div className={styles.row}>
                <div>
                    <h1 className={styles.title}>{title}</h1>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
                {actions && <div className={styles.actions}>{actions}</div>}
            </div>
        </header>
    )
}
