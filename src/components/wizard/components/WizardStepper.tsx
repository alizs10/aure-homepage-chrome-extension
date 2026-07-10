import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@/components/common/Typography";
import { CheckIcon } from "lucide-react";
import { STEPS } from "../constants/steps";

export function WizardStepper({ currentStep }: { currentStep: number }) {
    return (
        <motion.div
            layout
            className="bg-secondary p-1.5 rounded-full overflow-clip flex flex-nowrap gap-x-1.5 mt-4 h-12"
        >
            {STEPS.map((step, i) => {
                const completed = step.id < currentStep;
                const active = step.id === currentStep;

                return (
                    <motion.div
                        key={step.id}
                        layout // Magic: Automatically animates the pixel width changes from flex-1 to w-10!
                        className={`
                            flex items-center justify-center h-full rounded-full text-center overflow-hidden min-w-10
                            ${active ? "text-primary bg-background" : "bg-background text-muted-foreground"}
                            ${completed ? "bg-primary text-primary-foreground" : ""}
                        `}

                        initial={false}
                        animate={{
                            width: active ? "calc(100% - 5.75rem)" : "2.5rem"
                        }}
                        // Slower, softer spring for a premium feel
                        transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 22,
                            mass: 0.8,
                            // delay: .3
                        }}
                    >
                        {/* AnimatePresence handles the content swap */}
                        <AnimatePresence mode="wait" initial={false}>
                            {completed ? (
                                <motion.div
                                    key="check"
                                    initial={{ opacity: 0, y: -15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="flex items-center justify-center"
                                >
                                    <CheckIcon className="size-5" strokeWidth={2.5} />
                                </motion.div>
                            ) : active ? (
                                <motion.div
                                    key="label"
                                    initial={{ opacity: 0, y: -15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    transition={{
                                        duration: 0.25, ease: "easeInOut",
                                        // delay: .3

                                    }}
                                    className="w-full flex items-center justify-center px-2"
                                >
                                    <Typography className="text-nowrap capitalize" variant="body" weight="medium">
                                        {step.id}. {step.label}
                                    </Typography>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="number"
                                    initial={{ opacity: 0, y: -15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="flex items-center justify-center"
                                >
                                    <Typography variant="body" weight="medium">
                                        {i + 1}
                                    </Typography>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}