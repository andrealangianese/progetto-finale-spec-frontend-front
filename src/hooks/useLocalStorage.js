import { useEffect, useState } from "react"

function readValue(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        // JSON corrotto o storage non disponibile (es. navigazione privata)
        return fallback
    }
}

// useState persistito su localStorage e sincronizzato tra le schede del browser
export default function useLocalStorage(key, fallback) {
    const [value, setValue] = useState(() => readValue(key, fallback))

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {
            // storage pieno o bloccato: lo stato in memoria resta valido
        }
    }, [key, value])

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === key) setValue(readValue(key, fallback))
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [key, fallback])

    return [value, setValue]
}
