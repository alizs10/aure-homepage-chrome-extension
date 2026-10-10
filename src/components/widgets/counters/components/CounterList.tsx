import { useCounters } from "../hooks/useCounters";
import CounterItem from "./CounterItem";
import type { Counter } from "../types";
import { BetterTypography } from "@/components/common/BetterTypography";

interface CounterListProps {
    onSelect: (counter: Counter) => void;
}

export default function CounterList({ onSelect }: CounterListProps) {
    const { data, loading } = useCounters();

    if (loading) {
        return <div className="flex-1 min-h-0 flex-center">Loading...</div>;
    }

    if (data.length === 0) {
        return (
            <div className="flex-1 min-h-0 flex-center flex-col gap-y-2">
                <BetterTypography variant="sm" className="text-muted-foreground">
                    No counters yet.
                </BetterTypography>
                <BetterTypography variant="xs" className="text-muted-foreground">
                    Click + to add one.
                </BetterTypography>
            </div>
        );
    }

    return (
        // 🎯 Changed to grid grid-cols-2
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide grid grid-cols-2 gap-1">
            {data.map((counter) => (
                <CounterItem key={counter.id} counter={counter} onClick={() => onSelect(counter)} />
            ))}
        </div>
    );
}