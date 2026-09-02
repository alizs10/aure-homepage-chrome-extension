import { BetterTypography } from '@/components/common/BetterTypography';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import ProgressBar from '@/components/ui/ProgressBar';
import { format } from 'date-fns';
import type { DayLog } from '../../../types';
import { useWallpaperBackground } from '@/hooks/useWallpaperBackground';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { ScanSquareIcon } from 'lucide-react';

interface DayDetailModalProps {
    open: boolean;
    onClose: () => void;
    day: DayLog;
    formatDuration: (ms: number) => string;
}

export default function DayDetailModal({ open, onClose, day, formatDuration }: DayDetailModalProps) {
    const { background } = useWallpaperBackground();
    const captureRef = useRef<HTMLDivElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const [year, month, dayNum] = day.dateKey.split('-').map(Number);
    const dateObj = new Date(year, month - 1, dayNum);
    const fullDate = format(dateObj, 'MMM d, yyyy');

    const taskBreakdown = (() => {
        const map = new Map<string, { name: string; duration: number }>();
        day.entries.forEach(entry => {
            if (entry.type === 'focus') {
                const name = entry.taskName || 'Unknown Task';
                const existing = map.get(name) || { name, duration: 0 };
                existing.duration += entry.duration;
                map.set(name, existing);
            }
        });
        return Array.from(map.values()).sort((a, b) => b.duration - a.duration);
    })();

    const totalFocusTime = taskBreakdown.reduce((sum, t) => sum + t.duration, 0);

    const handleCapture = async () => {
        if (!captureRef.current) return;

        setIsCapturing(true);

        // Wait for React to render the capture state (hiding buttons, showing watermark)
        await new Promise(resolve => setTimeout(resolve, 150));

        try {
            const dataUrl = await toPng(captureRef.current, {
                cacheBust: true,
                pixelRatio: 2, // Crisp retina quality
            });

            // Create a temporary link to download the image
            const link = document.createElement('a');
            link.download = `focus-summary-${day.dateKey}.png`;
            link.href = dataUrl;
            link.click();

            toast.success('Screenshot saved!');
        } catch (err) {
            console.error('Screenshot failed', err);
            toast.error('Failed to generate screenshot');
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>

            {/* 1. Outer Shell: Handles shadows and rounded corners without clipping them */}
            <div ref={captureRef} className="rounded-3xl w-full max-w-4/5 sm:max-w-md max-h-[80vh] flex flex-col relative overflow-y-scroll">

                <div
                    style={{ backgroundImage: `url(${background})` }}
                    className="absolute z-0 inset-0 bg-cover bg-center rounded-3xl"
                />
                <div
                    className="absolute z-0 inset-0 backdrop-blur-xs bg-background/50 rounded-3xl app_shadow"
                />

                {/* 2. Clipping Layer: Handles overflow and hides the blurred edges */}
                <div className="relative flex-1 rounded-3xl overflow-hidden flex flex-col">

                    {/* 3. Scrollable Content Layer */}
                    <div className="relative z-10 flex-1 overflow-y-auto scrollbar-none flex flex-col p-5 gap-5">
                        <ModalHeader
                            title="Daily Summary"
                            onClose={onClose}
                            hideClose={isCapturing}
                        />

                        <div className="w-full flex-center">
                            <div
                                className="flex flex-col items-center justify-center rounded-full p-10 liquid-glass aspect-square">
                                <BetterTypography
                                    variant="2xl"
                                    weight="bold"
                                    className="text-primary tabular-nums leading-tight"
                                >
                                    {formatDuration(totalFocusTime)}
                                </BetterTypography>

                                <BetterTypography
                                    variant="xs"
                                    className="text-muted-foreground"
                                >
                                    Total focus time
                                </BetterTypography>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex-center-between">
                                <BetterTypography variant="xs" weight="semibold" className="text-muted-foreground">
                                    Tasks
                                </BetterTypography>
                                <BetterTypography variant="xxs" weight="medium">
                                    {fullDate}
                                </BetterTypography>
                            </div>

                            {taskBreakdown.length > 0 ? (
                                <div className="flex flex-col gap-5">
                                    {taskBreakdown.map(task => {
                                        const percentage = totalFocusTime > 0 ? (task.duration / totalFocusTime) * 100 : 0;
                                        return (
                                            <div key={task.name} className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <BetterTypography variant="xs" weight="medium" className="truncate pr-2">
                                                        {task.name}
                                                    </BetterTypography>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <BetterTypography variant="sm" weight="semibold" className="text-primary tabular-nums">
                                                            {formatDuration(task.duration)}
                                                        </BetterTypography>
                                                    </div>
                                                </div>
                                                <ProgressBar value={percentage} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex-center py-6">
                                    <BetterTypography variant="sm" className="text-muted-foreground">
                                        No focus sessions recorded.
                                    </BetterTypography>
                                </div>
                            )}
                        </div>

                        {/* Screenshot Button (Hidden during capture) */}
                        {!isCapturing && (
                            <Button
                                variant="primary-active"
                                size="sm"
                                className="w-full mt-2"
                                onClick={handleCapture}
                                leftIcon={<ScanSquareIcon className="size-4" />}
                            >
                                Take screenshot
                            </Button>
                        )}
                    </div>


                </div>
            </div>
        </ModalWrapper>
    );
}