import { Link } from "react-router-dom"
import FavouritePage from "./FavouritePage"

export default function NavBar() {
    return (
        <>
            <Link to='/'>Home</Link>
            <Link to='/viaggi'>Viaggi</Link>
            <Link to='/destinazioni-preferite'>Destinazioni Preferite</Link>
            <Link to='/comparazione-viaggi'>Comparzione Viaggi</Link>
        </>
    )
}