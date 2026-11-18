"use server"

import { API_BASE_URL, protectedMutation } from "@/lib/core/server"

export const addFavorite = async (equipmentId: string) => {
    const res = await protectedMutation(`${API_BASE_URL}/favorites`, "POST", {
        equipmentId,
    })
    return { ok: res.ok }
}

export const removeFavorite = async (equipmentId: string) => {
    const res = await protectedMutation(
        `${API_BASE_URL}/favorites/${encodeURIComponent(equipmentId)}`,
        "DELETE"
    )
    return { ok: res.ok }
}