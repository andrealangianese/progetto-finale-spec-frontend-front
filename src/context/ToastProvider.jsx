import { useCallback, useMemo, useState } from "react"
import { ToastContext } from "./toast"

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
            <div className="toast-stack" role="status" aria-live="polite">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type}`} onClick={() => chiudi(t.id)}>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
