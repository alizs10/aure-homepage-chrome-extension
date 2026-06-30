export function sliceText(text: string, length: number, dots = true) {

    if (text.length === 0) return ""

    if (text.length <= length) return text;

    const dotsStr = dots ? "..." : ""
    return text.slice(0, length) + dotsStr
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        return false;
    }
}