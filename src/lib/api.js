// URL del backend: da variabile d'ambiente (Vercel), con fallback in locale
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

async function request(path, { signal } = {}) {
    const res = await fetch(`${API_URL}${path}`, { signal })
    if (!res.ok) {
        const error = new Error(res.status === 404 ? 'Risorsa non trovata' : `Errore del server (${res.status})`)
        error.status = res.status
        throw error
    }
    return res.json()
}

// Lista viaggi (il backend restituisce solo id, title, category)
export function getTravels({ search = '', category = '' } = {}, options) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    const query = params.toString()
    return request(`/travels${query ? `?${query}` : ''}`, options)
}

// Dettaglio completo di un viaggio
export async function getTravel(id, options) {
    const data = await request(`/travels/${id}`, options)
    return data.travel ?? data
}

// Dettaglio completo di più viaggi con una sola chiamata (?ids=&fields=*).
// I viaggi non più esistenti semplicemente non tornano: il chiamante confronta gli id.
export function getTravelsByIds(ids, options) {
    if (ids.length === 0) return Promise.resolve([])
    const params = new URLSearchParams({ ids: ids.join(','), fields: '*' })
    return request(`/travels?${params}`, options)
}

// Tutti i viaggi con tutti i campi, in una chiamata (usato dal Trip Matcher)
export function getAllTravels(options) {
    return request('/travels?fields=*', options)
}

// Categorie e range numerici (min/max) senza scaricare la lista
export async function getTravelsMeta(options) {
    const data = await request('/travels/meta', options)
    return data.meta
}

// Viaggi simili: stessa categoria prima, poi i più vicini per prezzo/durata/adrenalina
export function getSimilarTravels(id, { limit = 3 } = {}, options) {
    return request(`/travels/${id}/similar?limit=${limit}`, options)
}
