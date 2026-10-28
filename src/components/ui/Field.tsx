import { useId } from "react"
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react"
import styles from "./Field.module.css"

/**
 * Campi di form con label sempre associata (htmlFor/id generati con useId).
 * `hint`: testo di aiuto collegato via aria-describedby.
 */
type FieldShellProps = {
    label: ReactNode
    hint?: ReactNode
    id: string
    grow?: boolean
    valueLabel?: ReactNode
    children: ReactNode
}

function FieldShell({ label, hint, id, grow, children, valueLabel }: FieldShellProps) {
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

type FieldBaseProps = {
    label: ReactNode
    /** Testo di aiuto collegato via aria-describedby */
    hint?: ReactNode
    /** Occupa lo spazio disponibile in una riga flex */
    grow?: boolean
}

type TextFieldProps = FieldBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id">

export function TextField({ label, hint, grow, ...inputProps }: TextFieldProps) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} id={id} grow={grow}>
            <input id={id} className={styles.control} aria-describedby={hint ? `${id}-hint` : undefined} {...inputProps} />
        </FieldShell>
    )
}

export type SelectOption = { value: string; label: string }

type SelectFieldProps = FieldBaseProps
    & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id">
    & { options: SelectOption[] }

/** `options`: array di { value, label } */
export function SelectField({ label, hint, grow, options, ...selectProps }: SelectFieldProps) {
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
type RangeFieldProps = Omit<FieldBaseProps, "grow">
    & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type">
    & { /** Valore leggibile mostrato sopra lo slider (es. "1.500 €") */ valueLabel: string }

export function RangeField({ label, hint, valueLabel, ...inputProps }: RangeFieldProps) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} id={id} valueLabel={valueLabel}>
            <input
                id={id}
                type="range"
                className={styles.range}
                aria-valuetext={valueLabel}
                {...inputProps}
            />
        </FieldShell>
    )
}
