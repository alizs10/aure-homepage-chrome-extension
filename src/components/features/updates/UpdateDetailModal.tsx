import { BetterTypography } from '@/components/common/BetterTypography'
import ModalHeader from '@/components/ui/modal/ModalHeader'
import ModalWrapper from '@/components/ui/modal/ModalWrapper'
import type { ChangelogEntry } from '@/lib/changelog'
import { format, parseISO } from 'date-fns'

interface UpdateDetailModalProps {
    entry: ChangelogEntry | null
    onClose: () => void
    isLatest: boolean
}

function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    try {
        return format(parseISO(dateStr), 'MMMM d, yyyy')
    } catch {
        return dateStr
    }
}

export default function UpdateDetailModal({ entry, onClose, isLatest }: UpdateDetailModalProps) {
    return (
        <ModalWrapper
            open={!!entry}
            onClose={onClose}
            className="max-w-4/5 sm:max-w-xl"
        >
            <div className="rounded-3xl liquid-glass p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-auto scrollbar-hide">
                <ModalHeader
                    title={`Release v${entry?.version ?? ''}`}
                    onClose={onClose}
                />

                {entry && (
                    <>
                        <div className="flex items-center gap-2 flex-wrap">
                            {isLatest && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[11px] font-medium">
                                    Latest Release
                                </span>
                            )}
                            {entry.date && (
                                <BetterTypography variant="xs" className="text-muted-foreground">
                                    {formatDate(entry.date)}
                                </BetterTypography>
                            )}
                        </div>

                        <BetterTypography variant="xl" weight="bold">
                            {entry.title}
                        </BetterTypography>

                        {/* 🌟 Full markdown content with scoped styles */}
                        <div
                            className="changelog-content"
                            dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
                        />
                    </>
                )}
            </div>
        </ModalWrapper>
    )
}