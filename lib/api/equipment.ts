import "server-only"

import { API_BASE_URL } from "@/lib/core/server"
import {
    EQUIPMENT_CATEGORIES,
    type CategorySummary,
    type EquipmentItem,
    type EquipmentListResponse,
} from "@/lib/types/equipment"

// Public reads: a failed request returns the fallback instead of throwing.
const getJson = async <T>(path: string, fallback: T): Promise<T> => {
    try {
        const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" })
        if (!res.ok) {
            console.error("API request failed:", path, res.status)
            return fallback
        }
        return (await res.json()) as T
    } catch (error) {
        console.error(
            "API request failed:",
            path,
            error instanceof Error ? error.message : "unknown error"
        )
        return fallback
    }
}

export const getFeaturedEquipment = () =>
    getJson<EquipmentItem[]>("/equipment/featured", [])

export const getCategories = () =>
    getJson<CategorySummary[]>(
        "/equipment/categories",
        EQUIPMENT_CATEGORIES.map((category) => ({ ...category, count: 0 }))
    )


const EMPTY_LIST: EquipmentListResponse = {
    items: [],
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
}

export const getEquipmentList = (query: string) =>
    getJson<EquipmentListResponse>(`/equipment?${query}`, EMPTY_LIST)

// null = not found (bad or unknown id). Any other failure throws, so the
// error page shows instead of a misleading 404.
export const getEquipmentById = async (
    id: string
): Promise<EquipmentItem | null> => {
    const res = await fetch(`${API_BASE_URL}/equipment/${encodeURIComponent(id)}`, {
        cache: "no-store",
    })
    if (res.status === 400 || res.status === 404) return null
    if (!res.ok) throw new Error(`Equipment request failed (${res.status})`)
    return (await res.json()) as EquipmentItem
}