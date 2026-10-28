import { createContext, useContext } from "react"

export type ToastType = "success" | "info" | "error"

export type ToastContextValue = {
    notify: (message: string, type?: ToastType) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast deve essere usato dentro <ToastProvider>")
    return ctx
}
