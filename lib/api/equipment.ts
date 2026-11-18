import "server-only"

import { API_BASE_URL } from "@/lib/core/server"
import {
    EQUIPMENT_CATEGORIES,
    type CategorySummary,
    type EquipmentItem,
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