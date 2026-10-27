import { createContext, useContext } from "react"

export const MAX_CONFRONTO = 4

export const TravelListsContext = createContext(null)

export function useTravelLists() {
    const ctx = useContext(TravelListsContext)
    if (!ctx) throw new Error("useTravelLists deve essere usato dentro <TravelListsProvider>")
    return ctx
}
