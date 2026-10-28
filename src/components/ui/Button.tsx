import { Link } from "react-router-dom"
import type { LinkProps } from "react-router-dom"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import styles from "./Button.module.css"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "subtle"
export type ButtonSize = "sm" | "md"

type CommonProps = {
    variant?: ButtonVariant
    size?: ButtonSize
    /** Bottone quadrato con sola icona: serve `aria-label` */
    iconOnly?: boolean
    fullWidth?: boolean
    className?: string
    children: ReactNode
}

/** Senza `to`: un <button>. `pressed` lo rende un toggle (aria-pressed). */
type ButtonAsButton = CommonProps
    & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps | "aria-pressed">
    & { to?: undefined; pressed?: boolean }

/** Con `to`: un <Link> di navigazione (niente `pressed`, che non ha senso su un link). */
type ButtonAsLink = CommonProps
    & Omit<LinkProps, keyof CommonProps>
    & { pressed?: never }

export type ButtonProps = ButtonAsButton | ButtonAsLink

/**
 * Bottone del design system.
 * - `to` → renderizza un <Link> (navigazione), altrimenti un <button>
 * - `variant`: primary | secondary | ghost | danger | subtle
 * - `size`: sm | md
 * - `pressed`: per i bottoni toggle (imposta aria-pressed)
 * - `iconOnly`: bottone quadrato con sola icona → `aria-label` obbligatorio
 */
export default function Button(props: ButtonProps) {
    const { variant = "primary", size = "md", iconOnly = false, fullWidth = false, className = "" } = props
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        iconOnly && styles.iconOnly,
        fullWidth && styles.fullWidth,
        className,
    ].filter(Boolean).join(" ")

    if (props.to !== undefined) {
        const { variant: _v, size: _s, iconOnly: _i, fullWidth: _f, className: _c, pressed: _p, children, ...linkProps } = props
        return <Link className={classes} {...linkProps}>{children}</Link>
    }

    const { variant: _v, size: _s, iconOnly: _i, fullWidth: _f, className: _c, to: _to, pressed, type = "button", children, ...buttonProps } = props
    return (
        <button type={type} className={classes} aria-pressed={pressed} {...buttonProps}>
            {children}
        </button>
    )
}
