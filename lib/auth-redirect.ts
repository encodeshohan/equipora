// Only same-site paths are allowed as a post-login destination.
export const safeRedirect = (value?: string | string[]) => {
    const path = Array.isArray(value) ? value[0] : value
    if (
        !path ||
        !path.startsWith("/") ||
        path.startsWith("//") ||
        path.startsWith("/\\")
    ) {
        return "/"
    }
    return path
}