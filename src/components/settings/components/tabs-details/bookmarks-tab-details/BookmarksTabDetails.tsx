import { BetterTypography } from "@/components/common/BetterTypography";
import BookmarkBehaviorSection from "./components/BookmarkBehaviorSection";
import BookmarksContent from "./components/BookmarksContent";

export default function BookmarksTabDetails() {
  return (
    <div className="h-fit flex-1 flex flex-col gap-y-8">
      {/* 🌟 1. Header Information */}
      <div className="flex flex-col gap-y-2">
        <BetterTypography variant="sm" className="text-muted-foreground">
          Choose bookmark opening behavior and manage your homepage bookmarks,
          favorite websites, and folders.
        </BetterTypography>
      </div>

      {/* 🌟 2. Bookmark Behavior */}
      <BookmarkBehaviorSection />

      {/* 🌟 3. Bookmarks Management */}
      <BookmarksContent />
    </div>
  );
}
