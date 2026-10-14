import { AppWindowIcon, InfoIcon, SwatchBookIcon, TerminalIcon, UserPenIcon } from "lucide-react";

export const TABS = [
    {
        id: "preferences",
        label: "Preferences",
        Icon: SwatchBookIcon
    },
    {
        id: "sites-and-folders",
        label: "Sites & Folders",
        Icon: AppWindowIcon
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
        id: "about",
        label: "About",
        Icon: InfoIcon
    },
] as const;