import BookmarkVisibilitySection from "./BookmarkVisibilitySection";
import FavoritesContent from "./favorites/FavoritesContent";
import FoldersContent from "./folders/FoldersContent";

export default function BookmarksContent() {
  return (
    <div className="h-fit flex-1 flex flex-col gap-y-8">
      <BookmarkVisibilitySection />
      <FavoritesContent />
      <FoldersContent />
    </div>
  );
}
