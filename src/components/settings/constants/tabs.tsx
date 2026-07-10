import { AppWindowIcon, InfoIcon, LayoutDashboardIcon, SwatchBookIcon, UserPenIcon } from "lucide-react";

export const TABS = [
    {
        id: "preferences",
        label: "Preferences",
        Icon: SwatchBookIcon
    },
    {
        id: "widgets-center",
        label: "Widgets Center",
        Icon: LayoutDashboardIcon
    },
    {
        id: "sites-and-shortcuts",
        label: "Sites & Shortcuts",
        Icon: AppWindowIcon
    },
    {
        id: "user-information",
        label: "User Information",
        Icon: UserPenIcon
    },
    {
        id: "about",
        label: "About",
        Icon: InfoIcon
    },
] as const;