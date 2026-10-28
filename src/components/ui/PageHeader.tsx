import type { ReactNode } from "react"
import BackLink from "./BackLink"
import styles from "./PageHeader.module.css"

type PageHeaderProps = {
    title: ReactNode
    subtitle?: ReactNode
    /** Mostra il link "indietro" verso questa route */
    backTo?: string
    backLabel?: string
    actions?: ReactNode
}

/** Intestazione di pagina: link indietro opzionale, unico <h1>, sottotitolo e azioni. */
export default function PageHeader({ title, subtitle, backTo, backLabel = "Torna alla Home", actions }: PageHeaderProps) {
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
