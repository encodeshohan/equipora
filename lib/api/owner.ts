import "server-only"

import { API_BASE_URL, authFetch } from "@/lib/core/server"
import type { BookingListResponse } from "@/lib/types/booking"
import type { EquipmentListResponse } from "@/lib/types/equipment"

export const getOwnerEquipment = async (
    query: string
): Promise<EquipmentListResponse> => {
    const res = await authFetch(`${API_BASE_URL}/owner/equipment?${query}`)
    if (!res.ok) throw new Error(`Equipment request failed (${res.status})`)
    return res.json()
}

export const getOwnerBookings = async (
    query: string
): Promise<BookingListResponse> => {
    const res = await authFetch(`${API_BASE_URL}/owner/bookings?${query}`)
    if (!res.ok) throw new Error(`Bookings request failed (${res.status})`)
    return res.json()
}