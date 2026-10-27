import { useEffect, useState } from "react"

// Restituisce `value` solo dopo che è rimasto invariato per `delay` ms
export default function useDebouncedValue(value, delay = 300) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}
