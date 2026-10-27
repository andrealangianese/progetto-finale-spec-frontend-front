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

    const value = useMemo(() => ({
        preferiti, confronto,
        isPreferito, isInConfronto,
        togglePreferito, toggleConfronto, svuotaConfronto,
    }), [preferiti, confronto, isPreferito, isInConfronto, togglePreferito, toggleConfronto, svuotaConfronto])

    return <TravelListsContext.Provider value={value}>{children}</TravelListsContext.Provider>
}
