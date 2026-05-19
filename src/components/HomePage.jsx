import { useEffect, useRef, useState } from "react"

export default function HomePage() {

    // state per salvare i viaggi
    const [viaggi, setViaggi] = useState([])
    // state per ricerca viaggi per nome
    const [cercaViaggiNome, setCercaViaggiNome] = useState('')
    // state per ricerca viaggi per categorie
    const [cercaViaggiCategoria, setCercaViaggiCategoria] = useState('Tutte le categorie')

    useEffect(() => {
        fetch('http://localhost:3001/travels')
            .then(res => res.json())
            .then(data => setViaggi(data))
            .catch(error => console.error(error)
            )
    }, [])

    // per evitare di stampare tutte le categorie uguali
    const categorieUniche = ['Tutte le categorie', ...new Set(viaggi.map(viaggio => viaggio.category).filter(Boolean))]

    const viaggiFiltrati = viaggi.filter(viaggio => {
        const titolo = viaggio.title.toLowerCase()
        const comparazioneTitolo = titolo.includes(cercaViaggiNome.toLowerCase())
        const comprazioneCategorie = cercaViaggiCategoria === 'Tutte le categorie' || viaggio.category === cercaViaggiCategoria
        return comparazioneTitolo && comprazioneCategorie
    })
    return (
        <>
            <h1>I nostri viaggi</h1>
            {/* ricerca per testo */}
            <input
                type="text"
                placeholder="Cerca per titolo"
                onChange={e => setCercaViaggiNome(e.target.value)}
            />
            {/* ricerca per categorie con select */}
            <div>
                <label>Filtra per categoria</label>
                <select
                    value={cercaViaggiCategoria}
                    onChange={e => setCercaViaggiCategoria(e.target.value)}
                >
                    {/* stampo tutte le categorie solo una volta */}
                    {categorieUniche.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>
            {viaggiFiltrati.length > 0 ? (
                viaggiFiltrati.map(viaggio => (
                    <div key={viaggio.id}>
                        <h3>{viaggio.title}</h3>
                        <p>Categoria: {viaggio.category}</p>
                    </div>
                ))
            ) : <p>Non è stato trovato nulla</p>}
        </>
    )
}