// Trip Matcher: punteggio di compatibilità (0-100) tra le preferenze dell'utente e un viaggio.
// Funzioni pure, nessuna dipendenza da React.
import type { Travel } from "../types"

/** I campi del viaggio che servono al punteggio. */
export type Matchable = Pick<Travel, "price" | "durationDay" | "adrenalineLevel" | "category">

export type Preferenze = {
    budget: number
    giorni: number
    adrenalina: number
    categorie: string[]
}

export type Risultato<T extends Matchable> = {
    viaggio: T
    match: number
    pro: string[]
    contro: string[]
}

type Punteggi = { budget: number; durata: number; adrenalina: number; categoria: number }

export const PREFERENZE_DEFAULT: Preferenze = {
    budget: 1500,
    giorni: 7,
    adrenalina: 3,
    categorie: [],
}

/**
 * Preferenze salvate in localStorage → valori validi, con i default per ciò che manca o è corrotto
 * (versioni precedenti dell'app, modifiche manuali).
 */
export function parsePreferenze(value: unknown): Preferenze {
    if (typeof value !== "object" || value === null) return PREFERENZE_DEFAULT
    const v = value as Record<string, unknown>
    const numero = (x: unknown, fallback: number): number =>
        typeof x === "number" && Number.isFinite(x) ? x : fallback
    return {
        budget: numero(v.budget, PREFERENZE_DEFAULT.budget),
        giorni: numero(v.giorni, PREFERENZE_DEFAULT.giorni),
        adrenalina: numero(v.adrenalina, PREFERENZE_DEFAULT.adrenalina),
        categorie: Array.isArray(v.categorie)
            ? v.categorie.filter((c): c is string => typeof c === "string")
            : PREFERENZE_DEFAULT.categorie,
    }
}

const PESI: Punteggi = { budget: 0.35, durata: 0.25, adrenalina: 0.3, categoria: 0.1 }

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n))

function punteggi(viaggio: Matchable, pref: Preferenze): Punteggi {
    const sforamento = viaggio.price - pref.budget
    return {
        // dentro budget = pieno; oltre, scende a 0 quando si sfora del 50%
        budget: sforamento <= 0 ? 1 : clamp01(1 - sforamento / (pref.budget * 0.5)),
        durata: clamp01(1 - Math.abs(viaggio.durationDay - pref.giorni) / Math.max(viaggio.durationDay, pref.giorni)),
        adrenalina: clamp01(1 - Math.abs(viaggio.adrenalineLevel - pref.adrenalina) / 4),
        categoria: pref.categorie.length === 0 || pref.categorie.includes(viaggio.category) ? 1 : 0.3,
    }
}

function motivi(viaggio: Matchable, pref: Preferenze, p: Punteggi): { pro: string[]; contro: string[] } {
    const pro: string[] = []
    const contro: string[] = []
    const sforamento = viaggio.price - pref.budget

    if (sforamento < 0) pro.push(`💰 Nel budget (avanzano ${-sforamento} €)`)
    else if (sforamento === 0) pro.push("💰 Esattamente il tuo budget")
    else contro.push(`💸 Sfora il budget di ${sforamento} €`)

    if (viaggio.durationDay === pref.giorni) pro.push("📅 Durata perfetta")
    else if (p.durata >= 0.7) pro.push(`📅 ${viaggio.durationDay} giorni, quasi come volevi`)
    else contro.push(`📅 Dura ${viaggio.durationDay} giorni invece di ${pref.giorni}`)

    if (viaggio.adrenalineLevel === pref.adrenalina) pro.push("⚡ Adrenalina su misura")
    else if (viaggio.adrenalineLevel > pref.adrenalina) contro.push("⚡ Più adrenalinico di quanto cerchi")
    else contro.push("⚡ Più tranquillo di quanto cerchi")

    if (pref.categorie.includes(viaggio.category)) pro.push(`🎯 ${viaggio.category}, come piace a te`)

    return { pro, contro }
}

// Restituisce i viaggi ordinati per compatibilità decrescente
export function classificaViaggi<T extends Matchable>(viaggi: T[], pref: Preferenze): Risultato<T>[] {
    return viaggi
        .map(viaggio => {
            const p = punteggi(viaggio, pref)
            const totale = PESI.budget * p.budget + PESI.durata * p.durata
                + PESI.adrenalina * p.adrenalina + PESI.categoria * p.categoria
            return { viaggio, match: Math.round(totale * 100), ...motivi(viaggio, pref, p) }
        })
        .sort((a, b) => b.match - a.match || a.viaggio.price - b.viaggio.price)
}
