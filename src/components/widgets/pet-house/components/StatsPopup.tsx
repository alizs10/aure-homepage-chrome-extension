import { BetterTypography } from "@/components/common/BetterTypography";
import Popup from "@/components/ui/Popup";
import { ChartNoAxesColumnIcon } from "lucide-react";
import Button from "../../../ui/Button";
import { usePetHouse } from "../hooks/usePetHouse";

export default function StatsPopup() {
    const { data: pets, alivePets, catPets, dogPets } = usePetHouse();

    const stats = [
        { label: "All Pets", value: pets.length },
        { label: "Alive Pets", value: alivePets.length },
        { label: "Dead Pets", value: pets.length - alivePets.length },
        { label: "Cats", value: catPets.length },
        { label: "Dogs", value: dogPets.length },
    ];

    return (
        <Popup
            // 🎯 Dynamic trigger: receives `props` and `state` from Base UI
            trigger={(props, state) => (
                <Button
                    {...props} // ⚠️ Crucial: spreads Base UI's onClick and aria attributes
                    variant={state.open ? "primary-active" : "ghost"}
                    size="icon-sm"
                >
                    <ChartNoAxesColumnIcon className="size-4" />
                </Button>
            )}
            // Optional: tweak positioning or add specific padding/width
            className="py-3 px-4 min-w-40"
        >
            {/* 🎯 Completely dynamic content goes here */}
            <ul className="flex flex-col gap-y-2">
                {stats.map((stat) => (
                    <li key={stat.label} className="flex justify-between items-center">
                        <BetterTypography variant="xs" className="text-muted-foreground">
                            {stat.label}
                        </BetterTypography>
                        <BetterTypography variant="xs" weight="semibold">
                            {stat.value}
                        </BetterTypography>
                    </li>
                ))}
            </ul>
        </Popup>
    );
}