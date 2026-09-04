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
            {/* 
              🎯 CRITICAL: Dialog.Portal moves this OUTSIDE the Layout div, 
              completely escaping the "overflow-clip" rule. 
            */}
            <Dialog.Portal>
                {/* 
                  🎯 CRITICAL: z-[9999] ensures this beats ANY Background or Toaster z-index.
                  We also add pointer-events-none to the backdrop container, and pointer-events-auto 
                  to the actual backdrop, which prevents weird click-through bugs.
                */}
                <Dialog.Backdrop
                    className="fixed inset-0 z-999 bg-background/30 backdrop-blur-sm flex-center pointer-events-auto"
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

// Helper if you don't have cn imported here
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}