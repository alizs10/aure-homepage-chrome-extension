import { BookmarkIcon, InfoIcon, ShieldIcon, SwatchBookIcon, TerminalIcon, UserPenIcon } from "lucide-react";

export const TABS = [
    {
        id: "preferences",
        label: "Preferences",
        Icon: SwatchBookIcon
    },
    {
        id: "bookmarks",
        label: "Bookmarks",
        Icon: BookmarkIcon
    },
    {
        id: "user-information",
        label: "User Information",
        Icon: UserPenIcon
    },
    {
        id: "commands",
        label: "Commands",
        Icon: TerminalIcon
    },
    {
        id: "privacy",
        label: "Privacy",
        Icon: ShieldIcon
    },
    {
        id: "about",
        label: "About",
        Icon: InfoIcon
    },
] as const;