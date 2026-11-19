type Param = string | string[] | undefined

export const firstParam = (value: Param) =>
    (Array.isArray(value) ? value[0] : value)?.trim() ?? ""

export const pageParam = (value: Param) => {
    const parsed = Number.parseInt(firstParam(value), 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}