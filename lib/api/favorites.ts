import "server-only"

import { API_BASE_URL, authFetch } from "@/lib/core/server"

export const getFavoriteIds = async (): Promise<string[]> => {
    const res = await authFetch(`${API_BASE_URL}/favorites/ids`)
    if (!res.ok) throw new Error(`Favorites request failed (${res.status})`)
    return res.json()
}