import type { ButtonHTMLAttributes } from "react"
import styles from "./Chip.module.css"

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "aria-pressed"> & { selected?: boolean }

/** Toggle compatto per selezioni multiple (es. categorie). */
export default function Chip({ selected = false, children, ...rest }: ChipProps) {
    return (
        <button type="button" className={styles.chip} aria-pressed={selected} {...rest}>
            {children}
        </button>
    )
}
