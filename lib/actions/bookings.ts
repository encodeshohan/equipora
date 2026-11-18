"use server"

import { API_BASE_URL, protectedMutation } from "@/lib/core/server"

export type CheckoutInput = {
    equipmentId: string
    startDate: string
    endDate: string
    quantity: number
    contactNumber: string
    deliveryAddress: string
    notes: string
}

type CheckoutResult = { ok: true; url: string } | { ok: false; message: string }

export const createCheckout = async (input: CheckoutInput): Promise<CheckoutResult> => {
    const res = await protectedMutation(
        `${API_BASE_URL}/bookings/checkout`,
        "POST",
        input
    )
    const body = await res.json().catch(() => null)

    // only ever send the browser to Stripe's checkout domain
    if (
        !res.ok ||
        typeof body?.url !== "string" ||
        !body.url.startsWith("https://checkout.stripe.com/")
    ) {
        return {
            ok: false,
            message:
                typeof body?.message === "string"
                    ? body.message
                    : "Could not start checkout. Please try again.",
        }
    }

    return { ok: true, url: body.url }
}

// Re-checks Stripe for an unpaid booking (paid but never reached the success page).
export const checkPayment = async (sessionId: string) => {
    const res = await protectedMutation(
        `${API_BASE_URL}/payments/checkout-verify`,
        "POST",
        { sessionId }
    )
    const body = await res.json().catch(() => null)

    if (res.ok && body?.success) return { confirmed: true as const }

    return {
        confirmed: false as const,
        message:
            typeof body?.message === "string"
                ? body.message
                : "We could not find a completed payment for this booking.",
    }
}