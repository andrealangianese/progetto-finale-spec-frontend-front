import { NavLink, Link } from "react-router-dom"
import { useTravelLists } from "../../context/travelLists"
import { Badge } from "../ui"
import styles from "./NavBar.module.css"

const LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/trova-il-tuo-viaggio", label: "✨ Trip Matcher" },
    { to: "/destinazioni-preferite", label: "Destinazioni Preferite", counter: "preferiti" },
    { to: "/comparazione-viaggi", label: "Comparazione Viaggi", counter: "confronto" },
]

export default function NavBar() {
    const liste = useTravelLists()

    return (
        <header className={styles.navbar}>
            <Link to="/" className={styles.logo}>
                <img src="/icona-viaggi.webp" alt="" className={styles.icon} />
                <span className={styles.logoText}>LangiaRoad</span>
            </Link>
            <nav aria-label="Principale">
                <ul className={styles.links}>
                    {LINKS.map(({ to, label, end, counter }) => {
                        const count = counter ? liste[counter].length : 0
                        return (
                            <li key={to}>
                                <NavLink to={to} end={end} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>
                                    {label}
                                    {count > 0 && (
                                        <Badge tone="inverse">
                                            {count}<span className="sr-only"> elementi</span>
                                        </Badge>
                                    )}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </header>
    )
}
