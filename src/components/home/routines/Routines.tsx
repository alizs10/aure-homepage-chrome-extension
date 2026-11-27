import { useRoutines } from "@/features/bookmarks";
import RoutineItem from "./RoutineItem";

export default function Routines() {
    const { data: routines } = useRoutines();

    if (!routines || routines.length === 0) return null;

    return (
        <>
            {routines.slice(0, 5).map((routine) => routine.websites && routine.websites.length > 0 && (
                <RoutineItem key={routine.id} routine={routine} />
            ))}
        </>
    );
}
