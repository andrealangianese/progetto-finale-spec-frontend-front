// Trip Matcher: punteggio di compatibilità (0-100) tra le preferenze dell'utente e un viaggio.
// Funzioni pure, nessuna dipendenza da React.

export const PREFERENZE_DEFAULT = {
    budget: 1500,
    giorni: 7,
    adrenalina: 3,
    categorie: [],
}

const PESI = { budget: 0.35, durata: 0.25, adrenalina: 0.3, categoria: 0.1 }

const clamp01 = (n) => Math.min(1, Math.max(0, n))

function punteggi(viaggio, pref) {
    const sforamento = viaggio.price - pref.budget
    return {
        // dentro budget = pieno; oltre, scende a 0 quando si sfora del 50%
        budget: sforamento <= 0 ? 1 : clamp01(1 - sforamento / (pref.budget * 0.5)),
        durata: clamp01(1 - Math.abs(viaggio.durationDay - pref.giorni) / Math.max(viaggio.durationDay, pref.giorni)),
        adrenalina: clamp01(1 - Math.abs(viaggio.adrenalineLevel - pref.adrenalina) / 4),
        categoria: pref.categorie.length === 0 || pref.categorie.includes(viaggio.category) ? 1 : 0.3,
    }
}

function motivi(viaggio, pref, p) {
    const pro = []
    const contro = []
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
export function classificaViaggi(viaggi, pref) {
    return viaggi
        .map(viaggio => {
            const p = punteggi(viaggio, pref)
            const totale = Object.keys(PESI).reduce((acc, k) => acc + PESI[k] * p[k], 0)
            return { viaggio, match: Math.round(totale * 100), ...motivi(viaggio, pref, p) }
        })
        .sort((a, b) => b.match - a.match || a.viaggio.price - b.viaggio.price)
}
