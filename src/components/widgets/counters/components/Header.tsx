import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import { useCounters } from '../hooks/useCounters';
import { counterFilters } from '../types';

interface HeaderProps {
    onAdd: () => void;
}

export default function Header({ onAdd }: HeaderProps) {
    const { filter, onFilterChange } = useCounters();

    return (
        <div className="flex-center-between">
            <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                Counters
            </BetterTypography>

            <div className="flex-row-center gap-x-1 h-9">
                <div className="rounded-3xl liquid-glass flex-row-center p-0.5 gap-x-0.5">
                    {counterFilters.map((f) => (
                        <Button
                            key={f.value}
                            size='xs'
                            className='px-2 h-7 text-[10px]'
                            variant={filter === f.value ? 'primary-active' : 'ghost'}
                            onClick={() => onFilterChange(f.value)}
                        >
                            {f?.icon ? (
                                <div className="flex-center gap-x-1">
                                    {f.icon}
                                </div>
                            ) : (
                                f.label
                            )}
                        </Button>
                    ))}
                </div>
                <Button size='icon-sm' variant='primary' onClick={onAdd}>
                    <PlusIcon className='size-4' />
                </Button>
            </div>
        </div>
    );
}