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
    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex-center flex-row-center gap-x-2 liquid-glass bg-background/40 dark:bg-background/50 rounded-t-3xl p-0.5 px-1">
            {totalPages > 1 && (
                <>
                    <div className="flex-row-center gap-x-0 ">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                size="icon-sm"
                                variant={currentPage === i + 1 ? 'primary-active' : 'ghost'}
                                onClick={() => onPageChange(i + 1)}
                                className=''
                            >
                                <div className={`size-3.5 rounded-full transition-colors ${currentPage === i + 1
                                    ? 'bg-primary'
                                    : 'bg-background'
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
                    Customize
                </BetterTypography>
            </Button>
        </div>
    );
}