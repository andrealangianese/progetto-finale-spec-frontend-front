import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

/**
 * Converte il valore letto dallo storage nel tipo atteso. Il dato può venire da vecchie
 * versioni dell'app o da modifiche manuali: `parse` lo ripulisce (es. scarta solo gli
 * elementi malformati di una lista) invece di fidarsi del tipo.
 */
export type Parser<T> = (value: unknown) => T

function readValue<T>(key: string, fallback: T, parse: Parser<T>): T {
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return fallback
        return parse(JSON.parse(raw))
    } catch {
        // JSON corrotto o storage non disponibile (es. navigazione privata)
        return fallback
    }
}

// useState persistito su localStorage e sincronizzato tra le schede del browser.
// `fallback` e `parse` devono essere stabili (costanti o funzioni a livello di modulo).
export default function useLocalStorage<T>(
    key: string,
    fallback: T,
    parse: Parser<T>,
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => readValue(key, fallback, parse))

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {
            // storage pieno o bloccato: lo stato in memoria resta valido
        }
    }, [key, value])

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === key) setValue(readValue(key, fallback, parse))
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [key, fallback, parse])

    return [value, setValue]
}
