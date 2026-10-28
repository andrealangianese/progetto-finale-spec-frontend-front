import { createContext, useContext } from "react"
import type { TravelRef } from "../types"

export const MAX_CONFRONTO = 4

export type TravelListsContextValue = {
    preferiti: TravelRef[]
    confronto: TravelRef[]
    isPreferito: (id: number) => boolean
    isInConfronto: (id: number) => boolean
    togglePreferito: (viaggio: TravelRef) => void
    toggleConfronto: (viaggio: TravelRef) => void
    svuotaConfronto: () => void
    /** Rimuove dal comparatore i viaggi che non esistono più sul backend */
    mantieniSoloInConfronto: (idsValidi: number[]) => void
    /** Sostituisce il contenuto del comparatore (es. "confronta i top 3") */
    impostaConfronto: (viaggi: TravelRef[]) => void
}

export const TravelListsContext = createContext<TravelListsContextValue | null>(null)

export function useTravelLists(): TravelListsContextValue {
    const ctx = useContext(TravelListsContext)
    if (!ctx) throw new Error("useTravelLists deve essere usato dentro <TravelListsProvider>")
    return ctx
}

/**
 * Lista salvata in localStorage → solo gli elementi ben formati.
 * Le versioni precedenti dell'app salvavano oggetti completi: i campi in più vengono scartati.
 */
export function parseTravelRefs(value: unknown): TravelRef[] {
    if (!Array.isArray(value)) return []
    return value.flatMap((item: unknown): TravelRef[] => {
        if (typeof item !== "object" || item === null) return []
        const { id, title, category } = item as Record<string, unknown>
        return typeof id === "number" && typeof title === "string" && typeof category === "string"
            ? [{ id, title, category }]
            : []
    })
}
