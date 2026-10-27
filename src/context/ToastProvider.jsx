import { useCallback, useMemo, useState } from "react"
import { ToastContext } from "./toast"
import styles from "./Toast.module.css"

const DURATA_TOAST = 3000

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const chiudi = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    // type: "success" | "info" | "error"
    const notify = useCallback((message, type = "success") => {
        const id = crypto.randomUUID()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => chiudi(id), DURATA_TOAST)
    }, [chiudi])

    const value = useMemo(() => ({ notify }), [notify])

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Regione live sempre presente nel DOM: i messaggi inseriti vengono annunciati */}
            <div className={styles.stack} role="status" aria-live="polite">
                {toasts.map(t => (
                    <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
                        <span>{t.message}</span>
                        <button type="button" className={styles.close} onClick={() => chiudi(t.id)} aria-label="Chiudi notifica">
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
