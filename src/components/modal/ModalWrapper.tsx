import { type MouseEvent, type ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ModalWrapperProps {
    children: ReactNode;
    onClose: () => void;
    open: boolean;
}

export default function ModalWrapper({ children, open, onClose }: ModalWrapperProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const init = () => {
            setMounted(true)
        }

        init()
    }, [])

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!mounted) return null

    function handleClose(e: MouseEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        onClose()
    }

    return createPortal(
        <div onClick={handleClose} className="fixed inset-0 z-99 bg-background/30
        backdrop-blur-md flex-center">
            {children}
        </div>,
        document.body
    )
}