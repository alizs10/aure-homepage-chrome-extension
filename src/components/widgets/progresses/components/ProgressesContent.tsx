import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import { ArrowUpDownIcon, PlusIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useProgresses } from '../hooks/useProgresses';
import { useProgressesStore } from '../store';
import ProgressItem from './ProgressItem';
import ProgressModal from '../modals/ProgressModal';
import ProgressDetailModal from '../modals/ProgressDetailModal';
import { progressFilters, progressSortOptions } from '../constants/filters';
import type { Progress, ProgressSort } from '../types';

export default function ProgressesContent() {
    const {
        data,
        labels,
        loading,
        filter,
        labelFilter,
        sortBy,
        onFilterChange,
        onLabelFilterChange,
        onSortChange,
    } = useProgresses();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProgress, setEditingProgress] = useState<Progress | null>(null);
    const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null);

    const handleAdd = () => {
        setEditingProgress(null);
        setModalOpen(true);
    };

    const handleEdit = (progress: Progress) => {
        setEditingProgress(progress);
        setModalOpen(true);
    };

    const handleView = (progress: Progress) => {
        setSelectedProgress(progress);
    };

    const handleEditFromDetail = () => {
        if (selectedProgress) {
            const latest = useProgressesStore.getState().data.find((p) => p.id === selectedProgress.id) || selectedProgress;
            setEditingProgress(latest);
            setModalOpen(true);
            setSelectedProgress(null);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditingProgress(null);
    };

    // 🌟 Prepare options for the Label Dropdown
    const labelOptions = useMemo(() => [
        { label: "All Labels", value: "all" },
        ...labels.map(l => ({ label: l.name, value: l.name }))
    ], [labels]);

    return (
        <div className="relative h-full w-full rounded-3xl liquid-glass flex flex-col gap-y-4 p-5">
            <div className="flex flex-col gap-y-3">
                <div className="flex-center-between">
                    <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                        Progresses
                    </BetterTypography>
                    <Button size='icon-sm' variant='primary' onClick={handleAdd}>
                        <PlusIcon className='size-4' />
                    </Button>
                </div>

                <div className="flex-center-between h-9">
                    {/* 🌟 Label Filter Dropdown */}
                    <Dropdown
                        value={labelFilter}
                        options={labelOptions}
                        onValueChange={onLabelFilterChange}
                        triggerVariant="ghost"
                        align='start'
                    />

                    <div className="flex-row-center gap-x-1 h-full">
                        {/* Status Filter Tabs */}
                        <div className="rounded-3xl liquid-glass flex-row-center p-0.5 gap-x-0.5">
                            {progressFilters.map((f) => (
                                <Button
                                    key={f.value}
                                    size='icon-sm'
                                    variant={filter === f.value ? 'primary-active' : 'ghost'}
                                    onClick={() => onFilterChange(f.value)}
                                >
                                    {f.icon ? (
                                        f.icon
                                    ) : (
                                        <BetterTypography variant='xxs' weight='medium'>
                                            {f.label}
                                        </BetterTypography>
                                    )}
                                </Button>
                            ))}
                        </div>

                        {/* 🌟 Sorting Dropdown */}
                        <Dropdown<ProgressSort>
                            value={sortBy}
                            options={progressSortOptions}
                            onValueChange={onSortChange}
                            triggerVariant="ghost"
                            hideLabel
                            icon={<ArrowUpDownIcon className="size-4" />}
                            align="end"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 min-h-0 flex-center">Loading...</div>
            ) : data.length === 0 ? (
                <div className="flex-1 min-h-0 flex-center flex-col gap-y-2">
                    <BetterTypography variant="sm" className="text-muted-foreground">
                        No progresses found.
                    </BetterTypography>
                    <BetterTypography variant="xs" className="text-muted-foreground">
                        Click + to add one.
                    </BetterTypography>
                </div>
            ) : (
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-y-3">
                    {data.map((progress) => (
                        <ProgressItem
                            key={progress.id}
                            progress={progress}
                            onView={handleView}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {selectedProgress && (
                <ProgressDetailModal
                    open={Boolean(selectedProgress)}
                    onClose={() => setSelectedProgress(null)}
                    progress={selectedProgress}
                    onEdit={handleEditFromDetail}
                />
            )}

            {modalOpen && (
                <ProgressModal open={modalOpen} onClose={handleClose} progress={editingProgress} />
            )}
        </div>
    );
}