import Button from '@/components/ui/Button'
import Popup from '@/components/ui/Popup'
import { MegaphoneIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
    changelog,
    getLastSeenVersion,
    hasNewUpdate,
    latestVersion,
    setLastSeenVersion,
    type ChangelogEntry,
} from '@/lib/changelog'
import UpdatesPopupContent from './UpdatesPopup'
import UpdateDetailModal from './UpdateDetailModal'

export default function Updates() {
    const [popupOpen, setPopupOpen] = useState(false) // 🌟 Now properly tracking state
    const [lastSeen, setLastSeen] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        getLastSeenVersion().then((v) => {
            if (!cancelled) {
                setLastSeen(v)
                setLoaded(true)
            }
        })
        return () => { cancelled = true }
    }, [])

    const showIndicator = loaded && hasNewUpdate(lastSeen)

    const selectedEntry = selectedVersion
        ? changelog.find((e) => e.version === selectedVersion) ?? null
        : null

    const handlePopupOpenChange = (nextOpen: boolean) => {
        setPopupOpen(nextOpen)
        if (nextOpen && hasNewUpdate(lastSeen)) {
            setLastSeenVersion(latestVersion)
            setLastSeen(latestVersion)
        }
    }

    const handleSelectEntry = (entry: ChangelogEntry) => {
        setPopupOpen(false)
        setSelectedVersion(entry.version)
    }

    const handleCloseModal = () => {
        setSelectedVersion(null)
    }

    return (
        <>
            <Popup
                open={popupOpen} // 🌟 Controlled state
                side="bottom"
                align="end"
                sideOffset={8}
                onOpenChange={handlePopupOpenChange}
                trigger={(props) => (
                    <div className="relative">
                        <Button
                            {...props}
                            variant="ghost"
                            size="icon-xs"
                            title="Updates"
                        >
                            <MegaphoneIcon className="size-4" />
                        </Button>

                        {showIndicator && (
                            <span
                                aria-hidden
                                className="absolute top-0 right-0 size-1.5 rounded-full bg-destructive ring-2 ring-background"
                            />
                        )}
                    </div>
                )}
            >
                <UpdatesPopupContent
                    onSelectEntry={handleSelectEntry}
                    onOpenChange={handlePopupOpenChange}
                />
            </Popup>

            <UpdateDetailModal
                entry={selectedEntry}
                onClose={handleCloseModal}
                isLatest={selectedVersion === latestVersion}
            />
        </>
    )
}