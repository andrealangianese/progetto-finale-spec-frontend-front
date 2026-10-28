import type { Travel, TravelsMeta, TravelSummary } from "../types"

// URL del backend: da variabile d'ambiente (Vercel), con fallback in locale
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

type RequestOptions = { signal?: AbortSignal }

export class ApiError extends Error {
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

/** Richiesta annullata (AbortController): non è un errore da mostrare all'utente. */
export const isAbortError = (err: unknown): boolean =>
    err instanceof DOMException && err.name === 'AbortError'

/** Messaggio leggibile per qualsiasi errore. */
export const errorMessage = (err: unknown): string =>
    err instanceof Error ? err.message : String(err)

// Unico punto di fiducia verso il backend: la risposta viene tipizzata secondo il contratto
// delle API (non validata a runtime). Gli errori HTTP diventano ApiError con lo status.
async function request<T>(path: string, { signal }: RequestOptions = {}): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, { signal })
    if (!res.ok) {
        throw new ApiError(res.status === 404 ? 'Risorsa non trovata' : `Errore del server (${res.status})`, res.status)
    }
    return await res.json() as T
}

// Lista viaggi (il backend restituisce solo id, title, category)
export function getTravels(
    { search = '', category = '' }: { search?: string; category?: string } = {},
    options?: RequestOptions,
): Promise<TravelSummary[]> {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    const query = params.toString()
    return request<TravelSummary[]>(`/travels${query ? `?${query}` : ''}`, options)
}

// Dettaglio completo di un viaggio
export async function getTravel(id: number | string, options?: RequestOptions): Promise<Travel> {
    const data = await request<{ travel: Travel }>(`/travels/${id}`, options)
    return data.travel
}

// Dettaglio completo di più viaggi con una sola chiamata (?ids=&fields=*).
// I viaggi non più esistenti semplicemente non tornano: il chiamante confronta gli id.
export function getTravelsByIds(ids: readonly (number | string)[], options?: RequestOptions): Promise<Travel[]> {
    if (ids.length === 0) return Promise.resolve([])
    const params = new URLSearchParams({ ids: ids.join(','), fields: '*' })
    return request<Travel[]>(`/travels?${params}`, options)
}

// Tutti i viaggi con tutti i campi, in una chiamata (usato dal Trip Matcher)
export function getAllTravels(options?: RequestOptions): Promise<Travel[]> {
    return request<Travel[]>('/travels?fields=*', options)
}

// Categorie e range numerici (min/max) senza scaricare la lista
export async function getTravelsMeta(options?: RequestOptions): Promise<TravelsMeta> {
    const data = await request<{ meta: TravelsMeta }>('/travels/meta', options)
    return data.meta
}

// Viaggi simili: stessa categoria prima, poi i più vicini per prezzo/durata/adrenalina
export function getSimilarTravels(id: number, { limit = 3 }: { limit?: number } = {}, options?: RequestOptions): Promise<Travel[]> {
    return request<Travel[]>(`/travels/${id}/similar?limit=${limit}`, options)
}
