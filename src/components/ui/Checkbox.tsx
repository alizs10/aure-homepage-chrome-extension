import { AnimatePresence, motion } from "framer-motion";
import { CircleCheckIcon, CircleIcon } from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/util";

type CheckboxSize = 'sm' | 'md' | 'lg';

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    className?: string;
    size?: CheckboxSize;
}

const SIZE_CONFIG: Record<CheckboxSize, { buttonSize: 'icon-xs' | 'icon-sm' | 'icon', iconClass: string }> = {
    sm: {
        buttonSize: 'icon-xs', // h-6 (24px)
        iconClass: 'size-3.5'  // 14px icon
    },
    md: {
        buttonSize: 'icon-sm', // h-8 (32px)
        iconClass: 'size-4'    // 16px icon
    },
    lg: {
        buttonSize: 'icon',    // h-10 (40px)
        iconClass: 'size-5'    // 20px icon
    }
};

export default function Checkbox({ checked, onChange, className, size = 'lg' }: CheckboxProps) {
    const config = SIZE_CONFIG[size];

    return (
        <Button
            className={cn('overflow-clip', className)}
            variant='success'
            onClick={(e) => {
                e.stopPropagation(); // Prevents triggering parent row clicks in lists
                onChange();
            }}
            size={config.buttonSize}
        >
            <AnimatePresence mode="wait" initial={false}>
                {checked ? (
                    <motion.div
                        key={'circle-check'}
                        initial={{ y: -25 }}
                        animate={{ y: 0 }}
                        exit={{ y: 25 }}
                        transition={{
                            ease: "linear",
                            duration: .1
                        }}
                    >
                        <CircleCheckIcon className={cn('text-success', config.iconClass)} />
                    </motion.div>
                ) : (
                    <motion.div
                        key={'circle'}
                        initial={{ y: -25 }}
                        animate={{ y: 0 }}
                        exit={{ y: 25 }}
                        transition={{
                            ease: "linear",
                            duration: .1
                        }}
                    >
                        <CircleIcon className={config.iconClass} />
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    );
}