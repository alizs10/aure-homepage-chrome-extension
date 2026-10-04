import { type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
    open: boolean;
    className?: string;
}

export default function Modal({ children, open, onClose, className }: ModalProps) {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <Dialog.Portal>
                {/* 🌟 CRITICAL FIX: Explicitly set lower z-index via inline style */}
                <Dialog.Backdrop
                    className="fixed inset-0 bg-background/30 backdrop-blur-sm flex-center pointer-events-auto"
                    style={{ zIndex: 999 }}
                >
                    <Dialog.Popup
                        className={cn(
                            "flex flex-col",
                            "transition-colors duration-200",
                            "max-w-4/5 sm:max-w-md w-full",
                            "max-h-[80vh] overflow-y-auto scrollbar-none",
                            className
                        )}
                    >
                        {children}
                    </Dialog.Popup>
                </Dialog.Backdrop>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}