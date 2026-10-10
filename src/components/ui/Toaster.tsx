import { useToastStore, type ToastStatus } from '@/stores/useToastStore'
import Button from './Button'
import { BetterTypography } from '../common/BetterTypography'
import { createPortal } from 'react-dom'

export default function Toaster() {
    const toasts = useToastStore(s => s.toasts)

    if (toasts.length === 0) return null

    const getAnimation = (status: ToastStatus) => {
        switch (status) {
            case 'entering': return 'toast-slide-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards'
            case 'pushing-back': return 'toast-push-back 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            case 'pulling-front': return 'toast-pull-front 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards'
            case 'exiting': return 'toast-slide-out 0.4s cubic-bezier(0.4, 0, 1, 1) forwards'
            default: return undefined
        }
    }

    const getTransform = (status: ToastStatus) => {
        switch (status) {
            case 'front': return 'translateX(0) translateY(0) scale(1)'
            case 'back': return 'translateX(18px) translateY(0) scale(0.8)'
            default: return undefined
        }
    }

    const getZIndex = (status: ToastStatus) => {
        switch (status) {
            case 'front':
            case 'entering':
            case 'pulling-front': return 'z-20'
            case 'back':
            case 'pushing-back': return 'z-10'
            case 'exiting': return 'z-0'
            default: return 'z-10'
        }
    }

    return createPortal((
        // ✅ 1. Added 'isolate' to contain repaints and prevent whole-app flashing
        <div className="fixed inset-0 isolate overflow-x-clip mx-auto z-9999 flex flex-col gap-2 pointer-events-none px-5 py-4 items-end">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`absolute bottom-4 right-4 ${getZIndex(t.status)}`}
                    style={{
                        transform: getTransform(t.status),
                        animation: getAnimation(t.status),
                        willChange: 'transform, opacity', // ✅ 2. Promote to GPU layer to prevent repaint bleeding
                    }}
                >
                    {/* ✅ 3. Removed 'transition-all' to prevent backdrop-filter/box-shadow interpolation flashes. 
                        Kept only 'transition-opacity' for a safe, lightweight fade if needed. */}
                    <div className="liquid-glass-sm flex items-center gap-2 rounded-3xl px-4 min-h-12 text-foreground pointer-events-auto w-fit max-w-[calc(100vw-2.5rem)] transition-opacity duration-300">
                        {t.icon && (
                            <span className="size-5 shrink-0 flex items-center justify-center">
                                {t.icon}
                            </span>
                        )}
                        <BetterTypography variant="xs" className="font-medium flex-1">
                            {t.message}
                        </BetterTypography>
                        {t.action && (
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={t.action.onClick}
                                className="shrink-0"
                            >
                                <BetterTypography variant="xs" weight="semibold">
                                    {t.action.label}
                                </BetterTypography>
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    ),
        document.body // Forces it to render at the root level
    )
}