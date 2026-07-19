import { Globe } from "lucide-react";
import { useFavicon } from "@/hooks/useFavicon";

export default function Favicon({ url }: { url: string }) {
    const { data: faviconSrc, isLoading } = useFavicon(url);

    if (!faviconSrc) {
        return <Globe className="min-w-6 md:min-w-10 size-6 md:size-10 text-muted-foreground" />;
    }

    if (isLoading) {
        return <Globe className="min-w-6 md:min-w-10 size-6 md:size-10 text-muted-foreground animate-pulse" />;
    }

    return (
        <img
            src={faviconSrc}
            className="min-w-6 md:min-w-10 size-6 md:size-10 rounded-full"
            alt="Website favicon"
        />
    );
}