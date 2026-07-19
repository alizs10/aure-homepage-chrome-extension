import { BetterTypography } from "@/components/common/BetterTypography";
import { AnimatePresence, motion } from "framer-motion"; // 🌟 Added Framer Motion imports
import { BoneIcon, CatIcon, SoupIcon } from "lucide-react";
import { useMemo, useState, type PropsWithChildren } from "react";
import { toast } from "sonner";
import Button from "../../../ui/Button";
import KillPetDialog from "../dialogs/KillPetDialog";
import { getPetAgeLabel, getRemainingFoodToday, isPetDead } from "../helpers";
import { usePetAgeTicker } from "../hooks/usePetAgeTicker";
import { usePetHouse } from "../hooks/usePetHouse";
import type { Pet } from "../types";
import PetMovement from "./PetMovement";

export default function Cell({ children, pet }: PropsWithChildren & { pet: Pet }) {
    const { feedPet } = usePetHouse();

    // 🌟 NEW: State to track active dropping food animations
    const [droppingFoods, setDroppingFoods] = useState<{ id: number, type: Pet['type'] }[]>([]);

    const remainingFoodToday = useMemo(() => {
        return getRemainingFoodToday(pet)
    }, [pet])

    function handleFeedPet() {
        feedPet(pet.id);

        const remaining = getRemainingFoodToday(pet) - 1;

        const messages: Record<number, string> = {
            2: "First feed of the day! Your pet loved it.",
            1: "Second meal down. One more to go!",
            0: "Final feed of the day! Pet is happily full.",
        };

        const message = messages[remaining] || "Pet fed successfully.";
        toast.success(message);

        // 🌟 TRIGGER DROP ANIMATION
        const id = Date.now() + Math.random();
        setDroppingFoods(prev => [...prev, { id, type: pet.type }]);

        // Remove from state after animation finishes (800ms)
        setTimeout(() => {
            setDroppingFoods(prev => prev.filter(f => f.id !== id));
        }, 800);
    }

    usePetAgeTicker(pet.createdAt);
    const ageLabel = getPetAgeLabel(pet);

    const isDead = isPetDead(pet)

    return (
        <div className="relative border-2 nth-[1]:border-t-0 nth-[1]:border-l-0 nth-[2]:border-t-0 nth-[2]:border-r-0 nth-[3]:border-b-0 nth-[3]:border-l-0 nth-[4]:border-b-0 nth-[4]:border-r-0 border-muted overflow-hidden">

            <div className={`w-full flex-center-between px-3 py-1 z-10 relative ${isDead ? 'justify-end' : ''}`}>
                {!isDead && (
                    <KillPetDialog pet={pet} />
                )}

                <div className="flex-row-center gap-x-1">
                    {!isDead && (
                        <Button
                            onClick={handleFeedPet}
                            disabled={remainingFoodToday === 0}
                            rightIcon={
                                pet.type === "cat" ? (
                                    <SoupIcon className="size-4" />
                                ) : (
                                    <BoneIcon className="size-4" />
                                )
                            }
                            variant="primary"
                            size="xs"
                        >
                            {remainingFoodToday > 0 && (
                                <BetterTypography variant="10">
                                    {remainingFoodToday}
                                </BetterTypography>
                            )}
                        </Button>
                    )}

                    <div className="app_container app_gradient app-blur py-1 px-2 flex-row-center gap-x-0.5">
                        <CatIcon className="size-3.5" />

                        <BetterTypography variant="10">
                            {ageLabel}
                        </BetterTypography>
                    </div>
                </div>
            </div>

            <BetterTypography
                variant="10"
                className="absolute z-0 left-1/2 top-1/2 -translate-x-1/2 text-muted-foreground text-nowrap"
            >
                {isDead ? `${pet.name}'s ghost` : pet.name}
            </BetterTypography>

            <PetMovement type={pet.type}>
                {children}
            </PetMovement>

            {/* 🌟 DROPPING FOOD ANIMATIONS */}
            <AnimatePresence>
                {droppingFoods.map((food) => {
                    // Dynamically choose the icon based on the pet type
                    const Icon = food.type === 'cat' ? SoupIcon : BoneIcon;

                    return (
                        <motion.div
                            key={food.id}
                            className="absolute z-30 pointer-events-none"
                            // Start near the top-right (approximate location of the Feed button)
                            initial={{ top: 40, left: "70%", opacity: 0, scale: 0.2, rotate: -30 }}
                            // Drop to the center (where the pet is)
                            animate={{
                                top: "60%",
                                left: "50%",
                                x: "-50%", // Keeps the icon perfectly centered horizontally at the end
                                opacity: [0, 1, 1, 0], // Fades in, stays visible, fades out
                                scale: [0.5, 1.2, 1, 0.5], // Pops in, shrinks slightly as it lands
                                rotate: 10
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeIn",
                                times: [0, 0.2, 0.8, 1] // Controls the timing of the opacity/scale keyframes
                            }}
                        >
                            <Icon className={`size-6 drop-shadow-md ${food.type === 'cat' ? 'text-warning' : 'text-foreground'}`} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    )
}