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

// Dettaglio completo di più viaggi in parallelo
export function getTravelsByIds(ids, options) {
    return Promise.all(ids.map(id => getTravel(id, options)))
}
