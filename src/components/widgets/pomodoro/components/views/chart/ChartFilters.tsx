import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';

const timeFilters = [
    { id: 7, label: '7D' },
    { id: 30, label: '30D' },
    { id: 90, label: '90D' },
];

interface ChartFiltersProps {
    selectedDays: number;
    onSelectDays: (days: number) => void;
}

export default function ChartFilters({ selectedDays, onSelectDays }: ChartFiltersProps) {
    return (
        <div className="flex-center-between">
            <BetterTypography variant="xs" weight="semibold" className="text-muted-foreground">
                Chart Filter
            </BetterTypography>
            <div className="flex gap-0.5">
                {timeFilters.map(filter => (
                    <Button
                        key={filter.id}
                        size="sm"
                        className='h-6 py-0'
                        variant={selectedDays === filter.id ? "primary-active" : "primary"}
                        onClick={() => onSelectDays(filter.id)}
                    >
                        <BetterTypography variant="12" className='leading-tight'>
                            {filter.label}
                        </BetterTypography>
                    </Button>
                ))}
            </div>
        </div>
    );
}