# LangiaRoad — Frontend

Comparatore di viaggi d'avventura (progetto finale Boolean) in React 19 + Vite + React Router.

Backend: [progetto-finale-spec-frontend-back](https://github.com/andrealangianese/progetto-finale-spec-frontend-back).

## Funzionalità

- **Home**: ricerca per titolo (lato server, con debounce), filtro per categoria, ordinamento A-Z / Z-A. I filtri sono salvati nell'URL, quindi una ricerca si può condividere con un link.
- **Dettaglio viaggio**: scheda completa con specifiche ed equipaggiamento.
- **Preferiti** e **Comparatore** (max 4 viaggi), salvati in `localStorage` e sincronizzati tra le schede del browser.
- **Comparatore**: tabella affiancata con il valore migliore evidenziato (prezzo, durata, prezzo al giorno).
- **✨ Trip Matcher**: imposti budget, giorni e adrenalina; ogni viaggio riceve un punteggio di compatibilità con pro e contro, e con un click i top 3 finiscono nel comparatore.

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
```

Il frontend chiama `http://localhost:3001` di default. Per puntare a un altro backend:

```bash
# .env.local
VITE_API_URL=https://tuo-backend.vercel.app
```

## Script

| Comando | Descrizione |
|---|---|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build di produzione |
| `npm run lint` | ESLint |
| `npm test` | Unit test (`node:test`) della logica del Trip Matcher |

## Struttura

```
src/
  components/   pagine e componenti UI
  context/      store condiviso (preferiti/comparatore) e toast
  hooks/        useLocalStorage, useDebouncedValue
  lib/          client API e logica di matching
```

## Deploy

Su Vercel: `vercel.json` riscrive tutte le route su `index.html`, così i deep link (es. `/travels/1`) funzionano anche dopo un refresh.
