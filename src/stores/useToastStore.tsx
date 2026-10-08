import { create } from 'zustand'
import type { ReactNode } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, Loader2 } from 'lucide-react'

export type ToastStatus = 'entering' | 'front' | 'pushing-back' | 'back' | 'pulling-front' | 'exiting'

export interface ToastAction {
    label: string
    onClick: () => void
}

export interface ToastOptions {
    action?: ToastAction
    duration?: number
    id?: string
}

export interface Toast {
    id: string
    icon?: ReactNode
    message: string
    status: ToastStatus
    action?: ToastAction
    duration?: number
}

interface ToastState {
    toasts: Toast[]
    addToast: (message: string, icon?: ReactNode, options?: ToastOptions) => void
    exitToast: (id: string) => void
}

let counter = 0
const genId = () => `t-${Date.now()}-${++counter}`

const DEFAULT_DURATION = 2500

export const useToastStore = create<ToastState>((set, get) => ({
    toasts: [],

    addToast: (message, icon, options) => {
        const id = options?.id ?? genId()
        const duration = options?.duration ?? DEFAULT_DURATION

        // ✅ Handle smooth update for existing toasts (No animation thrashing)
        const existingIndex = get().toasts.findIndex(t => t.id === id)
        if (existingIndex !== -1) {
            const updatedToasts = [...get().toasts]
            updatedToasts[existingIndex] = {
                ...updatedToasts[existingIndex],
                message,
                icon,
                status: 'front', // Keep as 'front' to let CSS transition handle the smooth change
                action: options?.action,
                duration
            }
            set({ toasts: updatedToasts })
            return // Exit early, do not run "new toast" logic
        }

        // Normal creation logic for new toasts
        const newToast: Toast = {
            id,
            icon,
            message,
            status: 'entering',
            action: options?.action,
            duration
        }

        set(state => {
            const activeToasts = state.toasts.filter(t => t.status !== 'exiting')
            let next = [...state.toasts]

            const frontToast = activeToasts.find(t => t.status === 'front' || t.status === 'entering' || t.status === 'pulling-front')
            if (frontToast) {
                next = next.map(t => t.id === frontToast.id ? { ...t, status: 'pushing-back' as ToastStatus } : t)
                setTimeout(() => {
                    set(s => ({
                        toasts: s.toasts.map(t => t.id === frontToast.id && t.status === 'pushing-back' ? { ...t, status: 'back' as ToastStatus } : t)
                    }))
                }, 500)
            }

            const backToasts = activeToasts.filter(t => t.status === 'back' || t.status === 'pushing-back')
            if (backToasts.length >= 1 && frontToast) {
                const oldestBack = backToasts[0]
                next = next.map(t => t.id === oldestBack.id ? { ...t, status: 'exiting' as ToastStatus } : t)
                setTimeout(() => {
                    set(s => ({ toasts: s.toasts.filter(t => t.id !== oldestBack.id) }))
                }, 400)
            }

            return { toasts: [...next, newToast] }
        })

        setTimeout(() => {
            set(state => ({
                toasts: state.toasts.map(t => t.id === id && t.status === 'entering' ? { ...t, status: 'front' as ToastStatus } : t)
            }))
        }, 400)

        if (duration !== Infinity) {
            setTimeout(() => {
                const current = get().toasts.find(t => t.id === id)
                if (current && current.status !== 'exiting') {
                    get().exitToast(id)
                }
            }, duration)
        }
    },

    exitToast: (id) => {
        const existing = get().toasts.find(t => t.id === id)
        if (!existing || existing.status === 'exiting') return

        set(state => ({
            toasts: state.toasts.map(t => t.id === id ? { ...t, status: 'exiting' as ToastStatus } : t)
        }))

        if (existing.status === 'front' || existing.status === 'entering') {
            const backToast = get().toasts.find(t => t.status === 'back')
            if (backToast) {
                set(state => ({
                    toasts: state.toasts.map(t => t.id === backToast.id ? { ...t, status: 'pulling-front' as ToastStatus } : t)
                }))
                setTimeout(() => {
                    set(s => ({
                        toasts: s.toasts.map(t => t.id === backToast.id && t.status === 'pulling-front' ? { ...t, status: 'front' as ToastStatus } : t)
                    }))
                }, 400)
            }
        }

        setTimeout(() => {
            set(state => ({
                toasts: state.toasts.filter(t => t.id !== id)
            }))
        }, 400)
    },
}))

export const toast = Object.assign(
    (message: string, icon?: ReactNode, options?: ToastOptions) => {
        useToastStore.getState().addToast(message, icon, options)
    },
    {
        success: (message: string, options?: ToastOptions) => {
            useToastStore.getState().addToast(message, <CheckCircle2 className="w-5 h-5 text-success" />, options)
        },
        error: (message: string, options?: ToastOptions) => {
            useToastStore.getState().addToast(message, <XCircle className="w-5 h-5 text-destructive" />, options)
        },
        info: (message: string, options?: ToastOptions) => {
            useToastStore.getState().addToast(message, <Info className="w-5 h-5 text-primary" />, options)
        },
        warning: (message: string, options?: ToastOptions) => {
            useToastStore.getState().addToast(message, <AlertTriangle className="w-5 h-5 text-warning" />, options)
        },
        loading: (message: string, options?: ToastOptions) => {
            useToastStore.getState().addToast(message, <Loader2 className="w-5 h-5 text-primary animate-spin" />, {
                duration: Infinity,
                ...options
            })
        },
        dismiss: (id?: string) => {
            if (id) {
                useToastStore.getState().exitToast(id)
            } else {
                const toasts = useToastStore.getState().toasts
                toasts.forEach(t => useToastStore.getState().exitToast(t.id))
            }
        },
        promise: async <T,>(
            promise: Promise<T>,
            msgs: {
                loading: string
                success: string | ((data: T) => string)
                error: string | ((err: unknown) => string)
            },
            options?: ToastOptions
        ) => {
            const id = options?.id ?? `promise-${Date.now()}`
            useToastStore.getState().addToast(msgs.loading, <Loader2 className="w-5 h-5 text-primary animate-spin" />, { ...options, duration: Infinity, id })

            try {
                const data = await promise
                useToastStore.getState().exitToast(id)
                const successMsg = typeof msgs.success === 'function' ? msgs.success(data) : msgs.success
                useToastStore.getState().addToast(successMsg, <CheckCircle2 className="w-5 h-5 text-success" />, options)
                return data
            } catch (err) {
                useToastStore.getState().exitToast(id)
                const errorMsg = typeof msgs.error === 'function' ? msgs.error(err) : msgs.error
                useToastStore.getState().addToast(errorMsg, <XCircle className="w-5 h-5 text-destructive" />, options)
                throw err
            }
        }
    }
)