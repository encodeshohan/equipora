import "server-only"

import { API_BASE_URL, protectedMutation } from "@/lib/core/server"
import type { VerifyResponse } from "@/lib/types/booking"

export const verifyCheckout = async (sessionId: string) => {
    const res = await protectedMutation(
        `${API_BASE_URL}/payments/checkout-verify`,
        "POST",
        { sessionId }
    )
    const body = (await res.json().catch(() => null)) as VerifyResponse | null
    return { status: res.status, body }
}