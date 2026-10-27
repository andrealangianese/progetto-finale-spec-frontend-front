import { Link } from "react-router-dom"
import styles from "./Button.module.css"

/**
 * Bottone del design system.
 * - `to` → renderizza un <Link> (navigazione), altrimenti un <button>
 * - `variant`: primary | secondary | ghost | danger | subtle
 * - `size`: sm | md
 * - `pressed`: per i bottoni toggle (imposta aria-pressed)
 * - `iconOnly`: bottone quadrato con sola icona → `aria-label` obbligatorio
 */
export default function Button({
    variant = "primary",
    size = "md",
    to,
    pressed,
    iconOnly = false,
    fullWidth = false,
    className = "",
    type = "button",
    children,
    ...rest
}) {
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        iconOnly && styles.iconOnly,
        fullWidth && styles.fullWidth,
        className,
    ].filter(Boolean).join(" ")

    if (to) {
        return <Link to={to} className={classes} {...rest}>{children}</Link>
    }

    return (
        <button type={type} className={classes} aria-pressed={pressed} {...rest}>
            {children}
        </button>
    )
}
