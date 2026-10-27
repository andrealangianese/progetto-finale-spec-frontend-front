import { useCallback, useMemo } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { useToast } from "./toast"
import { MAX_CONFRONTO, TravelListsContext } from "./travelLists"

// Stesse chiavi di prima: chi aveva già preferiti/confronti salvati non li perde
const KEY_PREFERITI = "travels_favs"
const KEY_CONFRONTO = "travels_comparator"
const NESSUNO = []

// Salviamo solo i campi minimi: i dettagli completi vengono sempre letti dall'API
const snapshot = ({ id, title, category }) => ({ id, title, category })

export default function TravelListsProvider({ children }) {
    const { notify } = useToast()
    const [preferiti, setPreferiti] = useLocalStorage(KEY_PREFERITI, NESSUNO)
    const [confronto, setConfronto] = useLocalStorage(KEY_CONFRONTO, NESSUNO)

    const isPreferito = useCallback((id) => preferiti.some(v => v.id === id), [preferiti])
    const isInConfronto = useCallback((id) => confronto.some(v => v.id === id), [confronto])

    const togglePreferito = useCallback((viaggio) => {
        if (isPreferito(viaggio.id)) {
            setPreferiti(prev => prev.filter(v => v.id !== viaggio.id))
            notify(`${viaggio.title} rimosso dai preferiti`, "info")
        } else {
            setPreferiti(prev => [...prev, snapshot(viaggio)])
            notify(`${viaggio.title} aggiunto ai preferiti ❤️`)
        }
    }, [isPreferito, setPreferiti, notify])

    const toggleConfronto = useCallback((viaggio) => {
        if (isInConfronto(viaggio.id)) {
            setConfronto(prev => prev.filter(v => v.id !== viaggio.id))
            notify(`${viaggio.title} rimosso dal comparatore`, "info")
        } else if (confronto.length >= MAX_CONFRONTO) {
            notify(`Puoi confrontare al massimo ${MAX_CONFRONTO} viaggi`, "error")
        } else {
            setConfronto(prev => [...prev, snapshot(viaggio)])
            notify(`${viaggio.title} aggiunto al comparatore`)
        }
    }, [isInConfronto, confronto.length, setConfronto, notify])

    const svuotaConfronto = useCallback(() => setConfronto(NESSUNO), [setConfronto])

    // Sostituisce il contenuto del comparatore (es. "confronta i top 3" del Trip Matcher)
    const impostaConfronto = useCallback((viaggi) => {
        setConfronto(viaggi.slice(0, MAX_CONFRONTO).map(snapshot))
    }, [setConfronto])

    // Rimuove dal comparatore i viaggi che non esistono più sul backend
    const mantieniSoloInConfronto = useCallback((idsValidi) => {
        setConfronto(prev => prev.filter(v => idsValidi.includes(v.id)))
    }, [setConfronto])

    const value = useMemo(() => ({
        preferiti, confronto,
        isPreferito, isInConfronto,
        togglePreferito, toggleConfronto, svuotaConfronto, mantieniSoloInConfronto, impostaConfronto,
    }), [preferiti, confronto, isPreferito, isInConfronto, togglePreferito, toggleConfronto, svuotaConfronto, mantieniSoloInConfronto, impostaConfronto])

    return <TravelListsContext.Provider value={value}>{children}</TravelListsContext.Provider>
}
