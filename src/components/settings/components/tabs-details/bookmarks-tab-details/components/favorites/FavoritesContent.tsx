import { BetterTypography } from "@/components/common/BetterTypography";
import AddNewFavorite from "./AddNewFavorite";
import FavoritesList from "./FavoritesList";
import { useFavorites } from "@/features/bookmarks";
import Badge from "@/components/ui/Badge";

export default function FavoritesContent() {
  const { data: favorites } = useFavorites();

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex-center-between">
        <div className="flex items-center gap-x-2">
          <BetterTypography variant="md" weight="semibold" as="h3">
            Favorite Websites
          </BetterTypography>

          <Badge variant="secondary" size="xs">
            {favorites.length}/15
          </Badge>
        </div>

        <AddNewFavorite />
      </div>

      <FavoritesList />
    </div>
  );
}
