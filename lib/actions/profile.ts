"use server"

import { API_BASE_URL, protectedMutation } from "@/lib/core/server"

export type ProfileInput = {
    name: string
    image: string
    phone: string
    address: string
}

export const updateProfile = async (
    input: ProfileInput
): Promise<{ ok: true } | { ok: false; message: string }> => {
    const res = await protectedMutation(`${API_BASE_URL}/profile`, "PATCH", input)
    if (res.ok) return { ok: true }

    const body = await res.json().catch(() => null)
    return {
        ok: false,
        message:
            typeof body?.message === "string"
                ? body.message
                : "Your profile could not be saved.",
    }
}