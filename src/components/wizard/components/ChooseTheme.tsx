import type { Theme } from "@/types";

export function ChooseTheme({
    value,
    onChange,
}: {
    value: Theme;
    onChange: (theme: Theme) => void;
}) {
    return (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
            <button
                onClick={() => onChange("light")}
                className={`p-1 rounded-[28px] ${value === "light" ? "outline-2 outline-primary" : ""}`}>

                <div className={`h-full aspect-video rounded-3xl bg-white  relative`} />
            </button>
            <button
                onClick={() => onChange("dark")}
                className={`p-1 rounded-[28px] ${value === "dark" ? "outline-2 outline-primary" : ""} `}>

                <div className={`h-full aspect-video rounded-3xl bg-gray-800 relative`} />
            </button>
        </div>
    );
}