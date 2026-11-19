import "server-only"

import { API_BASE_URL, authFetch } from "@/lib/core/server"
import type { AdminAnalytics, OwnerAnalytics } from "@/lib/types/analytics"

export const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
    const res = await authFetch(`${API_BASE_URL}/admin/analytics`)
    if (!res.ok) throw new Error(`Analytics request failed (${res.status})`)
    return res.json()
}

export const getOwnerAnalytics = async (): Promise<OwnerAnalytics> => {
    const res = await authFetch(`${API_BASE_URL}/owner/analytics`)
    if (!res.ok) throw new Error(`Analytics request failed (${res.status})`)
    return res.json()
}