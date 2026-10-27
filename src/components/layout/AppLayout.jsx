import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import NavBar from "./NavBar"
import styles from "./AppLayout.module.css"

export default function AppLayout() {
    const { pathname } = useLocation()
    const mainRef = useRef(null)
    // Confronto col pathname precedente (non un flag "primo render"): in StrictMode
    // gli effect girano due volte e un flag farebbe rubare il focus al caricamento iniziale
    const pathPrecedente = useRef(pathname)

    // Al cambio pagina sposto il focus sul contenuto: chi usa tastiera o screen reader
    // riparte dall'inizio della nuova pagina invece che dal link appena cliccato
    useEffect(() => {
        if (pathPrecedente.current === pathname) return
        pathPrecedente.current = pathname
        mainRef.current?.focus({ preventScroll: true })
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <>
            <a href="#main" className={styles.skipLink}>Vai al contenuto principale</a>
            <NavBar />
            <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
                <Outlet />
            </main>
        </>
    )
}
