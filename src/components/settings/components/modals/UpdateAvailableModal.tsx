import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import ModalWrapper from "@/components/ui/modal/ModalWrapper";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";

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
    function downloadUpdate() {
        window.open(latest.downloadUrl, "_blank");
    }

    function openReleasePage() {
        window.open(latest.releasePage, "_blank");
    }

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div className="app_container bg-background p-5 flex flex-col gap-5 w-full max-w-4/5 sm:max-w-md max-h-[80vh] overflow-y-auto scrollbar-none">
                <ModalHeader
                    title="Update Available"
                    onClose={onClose}
                />

                <div className="space-y-1">
                    <BetterTypography
                        variant="md"
                        weight="medium"
                    >
                        New version available
                    </BetterTypography>

                    <BetterTypography
                        variant="xs"
                        className="text-muted-foreground"
                    >
                        {currentVersion} → {latest.latestVersion}
                    </BetterTypography>

                    <BetterTypography
                        variant="xs"
                        className="text-muted-foreground"
                    >
                        Released on {latest.releaseDate}
                    </BetterTypography>
                </div>

                <div className="space-y-2">
                    <BetterTypography
                        variant="sm"
                        weight="semibold"
                    >
                        What's new
                    </BetterTypography>

                    <ul className="list-disc pl-5 space-y-1">
                        {latest.notes.map((note, index) => (
                            <li key={index}>
                                <BetterTypography variant="xs">
                                    {note}
                                </BetterTypography>
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
                        <BetterTypography variant="sm">
                            Download Update
                        </BetterTypography>
                    </Button>

                    <Button
                        variant="success"
                        onClick={openReleasePage}
                        className="w-full"
                    >
                        <ExternalLinkIcon size={16} />
                        <BetterTypography variant="sm">
                            View Release Page
                        </BetterTypography>
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );
}