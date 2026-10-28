import { useEffect } from "react"

const APP_NAME = "LangiaRoad"

// Titolo della scheda per pagina: è anche ciò che gli screen reader annunciano al cambio route
export default function useDocumentTitle(title: string): void {
    useEffect(() => {
        document.title = title ? `${title} · ${APP_NAME}` : APP_NAME
    }, [title])
}
