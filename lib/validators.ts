export const PASSWORD_MIN_LENGTH = 6

export const PASSWORD_RULES_MESSAGE =
    "Password must be at least 6 characters and include an uppercase and a lowercase letter."

// Shared by the sign-up form and the better-auth hook in lib/auth.ts.
export const getPasswordError = (password: unknown): string | null => {
    if (typeof password !== "string") return PASSWORD_RULES_MESSAGE
    if (
        password.length < PASSWORD_MIN_LENGTH ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
    ) {
        return PASSWORD_RULES_MESSAGE
    }
    return null
}

export const isHttpUrl = (value: string) => {
    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}