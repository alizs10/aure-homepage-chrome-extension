import { ChartNoAxesColumnIcon } from "lucide-react";
import Button from "../../../ui/Button";
import { Typography } from "../../../common/Typography";
import { usePetHouse } from "../hooks/usePetHouse";
import Popup from "@/components/ui/Popup";

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
                        <Typography variant="caption-xs" className="text-muted-foreground">
                            {stat.label}
                        </Typography>
                        <Typography variant="caption-xs" weight="semibold">
                            {stat.value}
                        </Typography>
                    </li>
                ))}
            </ul>
        </Popup>
    );
}