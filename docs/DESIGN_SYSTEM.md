# LangiaRoad Design System

Fondamenta grafiche e componenti riutilizzabili. Obiettivo: ogni nuova schermata si costruisce **componendo primitive**, senza scrivere CSS da zero e senza reinventare colori o spaziature.

Guida di stile viva: `npm run dev` → [`/design-system`](http://localhost:5173/design-system). La pagina esiste solo in sviluppo ed è esclusa dal bundle di produzione.

## Architettura

```
src/
  styles/
    tokens.css        ← unica fonte di verità (colori, tipografia, spazi, raggi, ombre, motion)
    base.css          ← reset, focus ring globale, .sr-only, prefers-reduced-motion
  components/
    ui/               ← design system: componenti generici, nessuna logica di dominio
    layout/           ← AppLayout (skip link, landmark, focus al cambio route), NavBar
    travel/           ← componenti di dominio costruiti con ui/ (TravelCard)
  pages/              ← pagine: compongono layout, travel e ui
```

Gli stili sono **CSS Modules** (`*.module.css`): le classi sono isolate per componente e non collidono tra loro.

## Token

Usa sempre gli **alias di ruolo** (`--text-secondary`, `--surface-muted`, ...) prima dei colori grezzi: così un futuro tema (es. dark mode) cambia solo `tokens.css`.

| Categoria | Esempi |
|---|---|
| Colore | `--color-brand-600`, `--text-primary`, `--surface-card`, `--color-success-fg` |
| Tipografia | `--font-size-sm … --font-size-display`, `--font-weight-semibold` |
| Spazi (scala 4px) | `--space-1` (4px) … `--space-12` (48px) |
| Forma | `--radius-sm … --radius-pill`, `--shadow-sm/md/lg` |
| Motion | `--duration-fast/base`, `--ease-out` |

**Regola del brand**: il turchese storico `--color-brand-400` (#00adb5) ha contrasto 2.7:1 su bianco, quindi si usa **solo su sfondi scuri** (navbar). Su sfondi chiari usa `--color-brand-600` / `-700`.

## Componenti

Importa sempre dal barrel: `import { Button, Card } from "../components/ui"`. Da lì arrivano anche i tipi pubblici: `ButtonProps`, `ButtonVariant`, `ButtonSize`, `BadgeTone`, `SelectOption`.

Le props sono tipizzate, quindi l'editor suggerisce le varianti e TypeScript segnala gli usi sbagliati. Per esempio `Button` con `to` diventa un link e non accetta `pressed`; `RangeField` richiede `valueLabel`, che diventa anche `aria-valuetext`.

| Componente | Uso | Props principali |
|---|---|---|
| `Button` | azioni e link-bottone | `variant` primary/secondary/ghost/danger/subtle · `size` sm/md · `to` (diventa Link) · `pressed` (toggle) · `iconOnly` |
| `Badge` | categorie, stati, contatori | `tone` brand/neutral/success/warning/danger/inverse |
| `Chip` | selezione multipla | `selected` |
| `Card` | superficie contenitore | `as` · `padding` none/md/lg · `interactive` |
| `Container` | larghezza pagina | `size` md/lg |
| `PageHeader` | unico `<h1>` della pagina | `title` · `subtitle` · `backTo` · `actions` |
| `BackLink` | link "indietro" | `to` |
| `TextField` / `SelectField` / `RangeField` | form con label associata | `label` · `hint` · `options` · `valueLabel` |
| `EmptyState` / `ErrorState` / `LoadingState` / `Skeleton` | stati di pagina | `title` · `action` · `onRetry` · `count` |
| `StatGrid` + `StatCard` | coppie etichetta/valore (`<dl>`) | `label` · `value` |
| `ProgressRing` / `ProgressBar` | percentuali | `value` · `label` |

Toast: `const { notify } = useToast(); notify("Salvato", "success" | "info" | "error")`.

## Checklist accessibilità per ogni nuovo componente

- [ ] Una sola `<h1>` per pagina (usa `PageHeader`), titoli senza salti di livello
- [ ] `useDocumentTitle("...")` in ogni pagina
- [ ] Ogni campo ha una label (i `*Field` la associano già)
- [ ] I bottoni con sola icona hanno `aria-label`; le emoji decorative hanno `aria-hidden="true"`
- [ ] I toggle usano `pressed` (aria-pressed) con un'etichetta **stabile**: lo stato non va scritto nel nome
- [ ] Link e bottoni ripetuti in una lista sono distinguibili (`<span className="sr-only"> {titolo}</span>`)
- [ ] L'informazione non è veicolata solo dal colore (icona e/o testo `sr-only`)
- [ ] Contrasto ≥ 4.5:1: usa le coppie fg/bg dei token, non colori nuovi
- [ ] Caricamenti ed errori usano `LoadingState` (`role=status`) ed `ErrorState` (`role=alert`)
- [ ] Nessun overflow orizzontale a 390px

Stato attuale: **0 violazioni axe-core** (WCAG 2.1 AA + best practice) su tutte le pagine.
