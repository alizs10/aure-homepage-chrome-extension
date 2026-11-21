import type { Wallpaper } from "@/types";
import defaultDark1 from "@/assets/background/default-dark.webp";
import defaultLight from "@/assets/background/default-light.webp";

export const DEFAULT_WALLPAPERS: Wallpaper[] = [
  {
    id: "default",
    name: "Default",
    variants: { light: defaultLight, dark: defaultDark1 },
  },
];

export const SOLID_COLOR_WALLPAPERS: Wallpaper[] = [
  {
    id: "solid-soft",
    name: "Soft",
    description: "Balanced neutral slate-gray",
    variants: {
      light: "#D8DBE1",
      dark: "#262A32",
    },
  },
  {
    id: "solid-default",
    name: "Default",
    description: "Muted lavender-gray / midnight indigo",
    variants: {
      light: "#E0DEEB",
      dark: "#28234A",
    },
  },
  {
    id: "solid-cherry",
    name: "Cherry",
    description: "Dusty rose-stone / deep garnet charcoal",
    variants: {
      light: "#E9DDDE",
      dark: "#442024",
    },
  },
  {
    id: "solid-tangerine",
    name: "Tangerine",
    description: "Warm sandstone / dark espresso-umber",
    variants: {
      light: "#E9E0DB",
      dark: "#3A271A",
    },
  },
  {
    id: "solid-lime",
    name: "Lime",
    description: "Soft sage-stone / deep moss-slate",
    variants: {
      light: "#E1E7DA",
      dark: "#253017",
    },
  },
  {
    id: "solid-ocean",
    name: "Ocean",
    description: "Pale cerulean-mist / deep navy-slate",
    variants: {
      light: "#DCE1EA",
      dark: "#1D2B41",
    },
  },
  {
    id: "solid-orchid",
    name: "Orchid",
    description: "Muted mauve / dark aubergine-charcoal",
    variants: {
      light: "#E9DDE6",
      dark: "#401E38",
    },
  },
  {
    id: "solid-golden",
    name: "Golden",
    description: "Warm champagne / dark bronze-charcoal",
    variants: {
      light: "#EAE5DC",
      dark: "#342B18",
    },
  },
];

export const BUILTIN_WALLPAPERS: Wallpaper[] = [
  ...DEFAULT_WALLPAPERS,
  ...SOLID_COLOR_WALLPAPERS,
];

export function isColor(value?: string): boolean {
  if (!value) return false;
  return (
    value.startsWith("#") ||
    value.startsWith("rgb") ||
    value.startsWith("hsl") ||
    value.startsWith("oklch")
  );
}
