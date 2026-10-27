import { useId } from "react"
import styles from "./Field.module.css"

/**
 * Campi di form con label sempre associata (htmlFor/id generati con useId).
 * `hint`: testo di aiuto collegato via aria-describedby.
 */
function FieldShell({ label, hint, id, grow, children, valueLabel }) {
    return (
        <div className={`${styles.field} ${grow ? styles.grow : ""}`}>
            <label htmlFor={id} className={styles.label}>
                {label}
                {hint && <span id={`${id}-hint`} className={styles.hint}> {hint}</span>}
            </label>
            {valueLabel !== undefined && <output htmlFor={id} className={styles.value}>{valueLabel}</output>}
            {children}
        </div>
    )
}

export function TextField({ label, hint, grow, ...inputProps }) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} id={id} grow={grow}>
            <input id={id} className={styles.control} aria-describedby={hint ? `${id}-hint` : undefined} {...inputProps} />
        </FieldShell>
    )
}

/** `options`: array di { value, label } */
export function SelectField({ label, hint, grow, options, ...selectProps }) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} id={id} grow={grow}>
            <select id={id} className={styles.control} aria-describedby={hint ? `${id}-hint` : undefined} {...selectProps}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </FieldShell>
    )
}

/** Slider con valore leggibile (`valueLabel`) annunciato anche via aria-valuetext. */
export function RangeField({ label, hint, valueLabel, ...inputProps }) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} id={id} valueLabel={valueLabel}>
            <input
                id={id}
                type="range"
                className={styles.range}
                aria-valuetext={typeof valueLabel === "string" ? valueLabel : undefined}
                {...inputProps}
            />
        </FieldShell>
    )
}
