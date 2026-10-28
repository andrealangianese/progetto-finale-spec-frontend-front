// Tipi di dominio: rispecchiano le risposte del backend (schema in types.ts del backend).

export type Difficulty = "Facile" | "Intermedio" | "Difficile" | "Estremo"

/** Elemento di GET /travels senza parametri: solo i campi base. */
export type TravelSummary = {
    id: number
    title: string
    category: string
    createdAt: string
    updatedAt: string
}

/** Dettaglio completo (GET /travels/:id, ?fields=*). */
export type Travel = TravelSummary & {
    destination: string
    durationDay: number
    price: number
    difficulty: Difficulty
    adrenalineLevel: number
    image: string
    description: string
    requiredEquipment: string[]
}

/** Quello che salviamo in localStorage per preferiti e comparatore. */
export type TravelRef = Pick<TravelSummary, "id" | "title" | "category">

export type NumericRange = { min: number; max: number }

/** GET /travels/meta */
export type TravelsMeta = {
    count: number
    categories: string[]
    ranges: Record<string, NumericRange>
    fields: string[]
}
