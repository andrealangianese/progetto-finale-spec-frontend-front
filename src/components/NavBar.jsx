import { Link } from "react-router-dom"
import FavouritePage from "./FavouritePage"
import '../App.css'

export default function NavBar() {
    return (
        <>
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
                    <Link to='/' className="navbar-link">Home</Link>
                    <Link to='/destinazioni-preferite' className="navbar-link">Destinazioni Preferite</Link>
                    <Link to='/comparazione-viaggi' className="navbar-link">Comparazione Viaggi</Link>
                </div>
            </nav>
        </>
    )
}