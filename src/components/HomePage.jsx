import { useEffect, useRef, useState } from "react"

export default function HomePage() {

    // state per salvare i viaggi
    const [viaggi, setViaggi] = useState([])
    // state per ricerca viaggi per nome
    const [cercaViaggi, setCercaViaggi] = useState('')

    useEffect(() => {
        fetch('http://localhost:3001/travels')
            .then(res => res.json())
            .then(data => setViaggi(data))
            .catch(error => console.error(error)
            )
    }, [])

    const viaggiFiltrati = viaggi.filter(viaggio => {
        const titolo = viaggio.title.toLowerCase()
        const comparazioneTitolo = titolo.includes(cercaViaggi.toLowerCase())
        return comparazioneTitolo
    })
    return (
        <>
            <h1>I nostri viaggi</h1>
            <input
                type="text"
                placeholder="Cerca per titolo"
                onChange={e => setCercaViaggi(e.target.value)}
            />
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