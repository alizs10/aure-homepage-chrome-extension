export function getDestination(input: string): string {
    const value = input.trim();

    if (!value) return "";

    // Already a valid URL
    try {
        return new URL(value).toString();
    } catch (error) {
        console.log(error)
    }

    // Looks like a domain
    if (
        /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#].*)?$/.test(value) &&
        !value.includes(" ")
    ) {
        return `https://${value}`;
    }

    // Google search
    return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
}