import { BetterTypography } from "@/components/common/BetterTypography";
import AddNewRoutine from "./AddNewRoutine";
import RoutinesList from "./RoutinesList";
import { useRoutines } from "@/features/bookmarks";
import Badge from "@/components/ui/Badge";

export default function RoutinesContent() {
    const { data: routines } = useRoutines();

    return (
        <div className="flex flex-col gap-y-3">
            <div className="flex-center-between">
                <div className="flex items-center gap-x-2">
                    <BetterTypography variant="md" weight="semibold" as="h3">
                        Routines
                    </BetterTypography>

                    <Badge variant="secondary" size="xs">
                        {routines.length}/5
                    </Badge>
                </div>

                <AddNewRoutine />
            </div>

            <BetterTypography variant="xs" className="text-muted-foreground">
                Group up to 5 websites into a routine. With one click on Home, all sites launch simultaneously in new tabs.
            </BetterTypography>

            <RoutinesList />
        </div>
    );
}
