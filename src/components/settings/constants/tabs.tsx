import { LayoutDashboardIcon, SwatchBookIcon, UserPenIcon } from "lucide-react";

export const TABS = [
    {
        id: "user-information",
        label: "User Information",
        Icon: UserPenIcon
    },
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
] as const;