import "server-only"

import { API_BASE_URL, authFetch } from "@/lib/core/server"
import type { Profile } from "@/lib/types/profile"

export const getProfile = async (): Promise<Profile> => {
    const res = await authFetch(`${API_BASE_URL}/profile`)
    if (!res.ok) throw new Error(`Profile request failed (${res.status})`)
    return res.json()
}