const ALLOWED = [
    "search",
    "category",
    "rentalType",
    "minPrice",
    "maxPrice",
    "availability",
    "sort",
    "page",
] as const

export type EquipmentSearchParams = Record<string, string | string[] | undefined>

export const pickParams = (searchParams: EquipmentSearchParams) => {
    const params: Record<string, string> = {}
    for (const key of ALLOWED) {
        const value = searchParams[key]
        const text = (Array.isArray(value) ? value[0] : value)?.trim()
        if (text) params[key] = text.slice(0, 100)
    }
    return params
}

export const toQueryString = (params: Record<string, string>) =>
    new URLSearchParams(params).toString()