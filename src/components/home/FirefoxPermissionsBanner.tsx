import { useState } from "react";
import { BetterTypography } from "../common/BetterTypography";
import Button from "../ui/Button";
import { ShieldCheckIcon } from "lucide-react";
import { toast } from "@/stores/useToastStore";
import { useHostPermissions, isFirefox } from "@/lib/browser";

const DISMISSED_STORAGE_KEY = "aure_firefox_perm_banner_dismissed";

export default function FirefoxPermissionsBanner() {
    const [isDismissed, setIsDismissed] = useState<boolean>(() => {
        try {
            return localStorage.getItem(DISMISSED_STORAGE_KEY) === "true";
        } catch {
            return false;
        }
    });

    const { allGranted, isLoading, requestAll } = useHostPermissions();

    if (!isFirefox || isLoading || allGranted || isDismissed) {
        return null;
    }

    const handleGrant = async () => {
        const granted = await requestAll();
        if (granted) {
            toast.success("All host permissions granted!");
        } else {
            toast.info("Permissions request was cancelled");
        }
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        try {
            localStorage.setItem(DISMISSED_STORAGE_KEY, "true");
        } catch {
            // Ignore storage errors
        }
    };

    return (
        <div className="z-99 fixed mb-0 inset-x-5 md:right-auto bottom-16 xl:bottom-5 w-fit md:max-w-sm">
            <div className="p-4 md:p-5 liquid-glass-sm rounded-3xl flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-y-0.5">
                    <div className="w-full flex justify-between items-start">
                        <BetterTypography variant="md" weight="semibold">
                            Enable Live Suggestions & External Features
                        </BetterTypography>
                        <ShieldCheckIcon className="h-auto w-5 sm:w-7 md:w-18 text-primary" />
                    </div>
                    <BetterTypography variant="sm" className="text-muted-foreground text-pretty">
                        Firefox requires permission to load live Google suggestions and network info. Grant permissions with one native prompt.
                    </BetterTypography>
                </div>

                <div className="flex items-center gap-x-2">
                    <Button
                        size="md"
                        variant="ghost"
                        onClick={handleDismiss}
                        title="Dismiss notification"
                        className="flex-1"
                    >
                        <BetterTypography variant="sm" weight="medium" className="text-nowrap">
                            Dismiss
                        </BetterTypography>

                    </Button>
                    <Button
                        size="md"
                        variant="primary"
                        onClick={handleGrant}
                        className="flex-1"
                    >
                        <BetterTypography variant="sm" weight="medium" className="text-nowrap">
                            Grant Permissions
                        </BetterTypography>
                    </Button>
                </div>
            </div>
        </div>
    );
}
