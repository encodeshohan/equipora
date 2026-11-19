import "server-only"

import { API_BASE_URL, authFetch } from "@/lib/core/server"
import type { AdminUserListResponse } from "@/lib/types/admin"
import type { BookingListResponse } from "@/lib/types/booking"
import type { EquipmentListResponse } from "@/lib/types/equipment"

const getList = async <T>(path: string, query: string): Promise<T> => {
    const res = await authFetch(`${API_BASE_URL}${path}?${query}`)
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    return res.json()
}

export const getAdminUsers = (query: string) =>
    getList<AdminUserListResponse>("/admin/users", query)

export const getAdminEquipment = (query: string) =>
    getList<EquipmentListResponse>("/admin/equipment", query)

export const getAdminBookings = (query: string) =>
    getList<BookingListResponse>("/admin/bookings", query)