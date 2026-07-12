import Button from "@/components/common/Button";
import { Typography } from "@/components/common/Typography";
import ModalHeader from "@/components/modal/ModalHeader";
import ModalWrapper from "@/components/modal/ModalWrapper";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import type { MouseEvent } from "react";

interface VersionInfo {
    latestVersion: string;
    minimumSupportedVersion: string;
    releaseDate: string;
    downloadUrl: string;
    releasePage: string;
    notes: string[];
}

interface UpdateAvailableModalProps {
    open: boolean;
    onClose: () => void;
    currentVersion: string;
    latest: VersionInfo;
}

export default function UpdateAvailableModal({
    open,
    onClose,
    currentVersion,
    latest,
}: UpdateAvailableModalProps) {
    function stopPropagation(e: MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    function downloadUpdate() {
        window.open(latest.downloadUrl, "_blank");
    }

    function openReleasePage() {
        window.open(latest.releasePage, "_blank");
    }

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                onClick={stopPropagation}
                className="app_container bg-background p-5 flex flex-col gap-5 w-full max-w-4/5 sm:max-w-md max-h-[80vh] overflow-y-auto scrollbar-none"
            >
                <ModalHeader
                    title="Update Available"
                    onClose={onClose}
                />

                <div className="space-y-1">
                    <Typography variant="body" weight="medium">
                        New version available
                    </Typography>

                    <Typography variant="body-sm" className="text-muted-foreground">
                        {currentVersion} → {latest.latestVersion}
                    </Typography>

                    {/* Added Release Date */}
                    <Typography variant="caption-xs" className="text-muted-foreground">
                        Released on {latest.releaseDate}
                    </Typography>
                </div>

                <div className="space-y-2">
                    <Typography variant="body-sm" weight="semibold">
                        What's new
                    </Typography>

                    <ul className="list-disc pl-5 space-y-1">
                        {latest.notes.map((note, index) => (
                            <li key={index}>
                                <Typography variant="body-sm">
                                    {note}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        variant="primary"
                        onClick={downloadUpdate}
                        className="w-full"
                    >
                        <DownloadIcon size={16} />
                        <Typography variant="body-sm">
                            Download Update
                        </Typography>
                    </Button>

                    {/* Added button to view the full release page on GitHub */}
                    <Button
                        variant="success"
                        onClick={openReleasePage}
                        className="w-full"
                    >
                        <ExternalLinkIcon size={16} />
                        <Typography variant="body-sm">
                            View Release Page
                        </Typography>
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );
}