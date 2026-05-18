import { useEffect, useState } from "react"

export default function HomePage() {

    // state per salvare i viaggi
    const [viaggi, setViaggi] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/travels')
            .then(res => res.json())
            .then(data => setViaggi(data))
            .catch(error => console.error(error)
            )
    })
    return (
        <>
            <h1>I nostri viaggi</h1>
            {viaggi.length > 0 ? (
                viaggi.map(viaggio => (
                    <div key={viaggio.id}>
                        <h3>{viaggio.title}</h3>
                        <p>Categoria: {viaggio.category}</p>
                    </div>
                ))
            ) : <p>Non è stato trovato nulla</p>}
        </>
    )
}