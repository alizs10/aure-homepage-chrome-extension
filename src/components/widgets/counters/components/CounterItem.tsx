import { BetterTypography } from '@/components/common/BetterTypography';
import CounterCircle from './CounterCircle';
import type { Counter } from '../types';

interface CounterItemProps {
    counter: Counter;
    onClick: () => void;
}

export default function CounterItem({ counter, onClick }: CounterItemProps) {
    return (
        <div
            className="flex-row-center gap-x-1.5 px-1.5 py-2 h-fit rounded-3xl liquid-glass hover:bg-secondary/50 transition-colors cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
        >
            <CounterCircle counter={counter} size={56} />

            <BetterTypography variant="xs" className="line-clamp-3 leading-4 flex-1 min-w-0 text-start">
                {counter.name}
            </BetterTypography>
        </div>
    );
}