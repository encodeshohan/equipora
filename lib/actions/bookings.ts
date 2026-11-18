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