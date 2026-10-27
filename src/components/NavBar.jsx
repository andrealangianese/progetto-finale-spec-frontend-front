import { NavLink, Link } from "react-router-dom"
import { useTravelLists } from "../context/travelLists"

function Badge({ count }) {
    if (!count) return null
    return <span className="navbar-badge">{count}</span>
}

export default function NavBar() {
    const { preferiti, confronto } = useTravelLists()

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" className="navbar-logo-link">
                    <img
                        src="/icona-viaggi.webp"
                        alt="Logo Viaggi"
                        className="navbar-icon"
                    />
                    <span className="navbar-logo-text">LangiaRoad</span>
                </Link>
            </div>
            <div className="navbar-links">
                <NavLink to='/' end className="navbar-link">Home</NavLink>
                <NavLink to='/trova-il-tuo-viaggio' className="navbar-link">✨ Trip Matcher</NavLink>
                <NavLink to='/destinazioni-preferite' className="navbar-link">
                    Destinazioni Preferite <Badge count={preferiti.length} />
                </NavLink>
                <NavLink to='/comparazione-viaggi' className="navbar-link">
                    Comparazione Viaggi <Badge count={confronto.length} />
                </NavLink>
            </div>
        </nav>
    )
}
