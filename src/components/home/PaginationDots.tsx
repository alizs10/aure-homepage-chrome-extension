import Button from '@/components/ui/Button';
import { Settings2Icon } from 'lucide-react';
import { BetterTypography } from '@/components/common/BetterTypography';

interface PaginationDotsProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onCustomize: () => void;
}

export default function PaginationDots({
    totalPages,
    currentPage,
    onPageChange,
    onCustomize,
}: PaginationDotsProps) {
    // Responsive sizing based on number of dots
    const getDotSizes = () => {
        if (totalPages <= 3) {
            return { buttonHeight: 'h-6', circleSize: 'size-4' };
        } else if (totalPages <= 6) {
            return { buttonHeight: 'h-5', circleSize: 'size-3' };
        } else {
            return { buttonHeight: 'h-4', circleSize: 'size-2' };
        }
    };

    const { buttonHeight, circleSize } = getDotSizes();

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex-center flex-row-center gap-x-2 liquid-glass bg-background/40 dark:bg-background/50 rounded-t-3xl py-1 px-2">
            {totalPages > 1 && (
                <>
                    <div className="flex-row-center gap-x-0.5">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                size="icon-xs"
                                variant={currentPage === i + 1 ? 'primary-active' : 'ghost'}
                                onClick={() => onPageChange(i + 1)}
                                className={buttonHeight}
                            >
                                <div className={`rounded-full transition-colors ${circleSize} ${currentPage === i + 1
                                    ? 'bg-primary'
                                    : 'bg-border'
                                    }`} />
                            </Button>
                        ))}
                    </div>

                    <div className="w-px h-4 bg-background dark:bg-border" />
                </>
            )}

            <Button
                size="sm"
                variant="ghost"
                onClick={onCustomize}
                className="text-muted-foreground gap-x-2"
            >
                <Settings2Icon className="size-4" />
                <BetterTypography variant="xs" weight="medium" className=''>
                    Organize
                </BetterTypography>
            </Button>
        </div>
    );
}