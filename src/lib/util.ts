// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This function combines classes AND resolves Tailwind conflicts
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}