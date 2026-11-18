import "server-only"

import { API_BASE_URL, authFetch } from "@/lib/core/server"
import type { BookingListResponse } from "@/lib/types/booking"

export const getMyBookings = async (query: string): Promise<BookingListResponse> => {
    const res = await authFetch(`${API_BASE_URL}/bookings/mine?${query}`)
    if (!res.ok) throw new Error(`Bookings request failed (${res.status})`)
    return res.json()
}