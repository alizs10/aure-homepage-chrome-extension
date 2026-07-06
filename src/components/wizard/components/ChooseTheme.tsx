import type { Theme } from "@/types";

export function ChooseTheme({
    value,
    onChange,
}: {
    value: Theme;
    onChange: (theme: Theme) => void;
}) {
    return (

        <div className="flex flex-wrap gap-x-2">
            <button
                onClick={() => onChange("light")}
                className={`p-1 rounded-[28px] ${value === "light" ? "outline-2 outline-primary" : ""}`}>

                <div className={`h-30 aspect-video rounded-3xl bg-white  relative`} />
            </button>
            <button
                onClick={() => onChange("dark")}
                className={`p-1 rounded-[28px] ${value === "dark" ? "outline-2 outline-primary" : ""} `}>

                <div className={`h-30 aspect-video rounded-3xl bg-gray-800 relative`} />
            </button>
        </div>
    );
}