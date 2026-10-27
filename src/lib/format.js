// Formattazione condivisa: un solo posto per valuta e unità
const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export const formatEuro = (n) => euro.format(n)
export const formatGiorni = (n) => `${n} ${n === 1 ? "giorno" : "giorni"}`
export const formatAdrenalina = (n) => `${"⚡".repeat(n)} ${n}/5`
