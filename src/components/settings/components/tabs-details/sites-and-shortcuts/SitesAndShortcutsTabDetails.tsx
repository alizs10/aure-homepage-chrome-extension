import SitesAndShortcutsContent from "./components/SitesAndShortcutsContent";
import { FavoritesProvider } from "./providers/FavoritesProvider";

export default function SitesAndShortcutsTabDetails() {
    return (
        <FavoritesProvider>
            <SitesAndShortcutsContent />
        </FavoritesProvider>
    )
}
