import { BetterTypography } from '@/components/common/BetterTypography'
import { changelog, type ChangelogEntry } from '@/lib/changelog'
import { ChevronRightIcon, XIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface UpdatesPopupProps {
    onSelectEntry: (entry: ChangelogEntry) => void
    onOpenChange: (open: boolean) => void
}

function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    try {
        return format(parseISO(dateStr), 'MMM d, yyyy')
    } catch {
        return dateStr
    }
}

export default function UpdatesPopupContent({ onSelectEntry, onOpenChange }: UpdatesPopupProps) {
    return (
        <div className="w-[min(360px,calc(100vw-2rem))] max-h-[70vh] flex flex-col rounded-3xl liquid-glass overflow-hidden">
            <div className="flex-center-between px-5 py-3 border-b border-border/40">
                <BetterTypography variant="md" weight="semibold">
                    Updates
                </BetterTypography>
                <Button onClick={() => onOpenChange(false)} variant='ghost-destructive' size='icon-sm'>
                    <XIcon className='size-4' />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
                {changelog.length === 0 ? (
                    <div className="py-10 text-center px-3">
                        <BetterTypography variant="sm" className="text-muted-foreground">
                            No updates yet.
                        </BetterTypography>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-0.5">
                        {changelog.map((entry, index) => (
                            <li key={entry.version}>
                                <button
                                    onClick={() => onSelectEntry(entry)}
                                    className="w-full flex items-center gap-3 p-3 text-left group"
                                >
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                        <div className="flex-center-between">
                                            <div className="flex-row-center gap-x-2">
                                                <span className="text-xs font-semibold text-primary">
                                                    v{entry.version}
                                                </span>
                                                {index === 0 && (
                                                    // <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-medium leading-none">
                                                    //     Latest
                                                    // </span>
                                                    <Badge variant='default' size='xs'>
                                                        Latest
                                                    </Badge>
                                                )}
                                            </div>
                                            {entry.date && (
                                                <span className="text-[11px] text-muted-foreground">
                                                    {formatDate(entry.date)}
                                                </span>
                                            )}
                                        </div>

                                        <BetterTypography variant="sm" weight="semibold" className="line-clamp-1">
                                            {entry.title}
                                        </BetterTypography>
                                    </div>

                                    <ChevronRightIcon className="size-4 text-muted-foreground shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}