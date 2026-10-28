// Formattazione condivisa: un solo posto per valuta e unità
const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export const formatEuro = (n: number): string => euro.format(n)
export const formatGiorni = (n: number): string => `${n} ${n === 1 ? "giorno" : "giorni"}`
export const formatAdrenalina = (n: number): string => `${"⚡".repeat(n)} ${n}/5`
