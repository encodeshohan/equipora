"use server"

import { API_BASE_URL, protectedMutation } from "@/lib/core/server"

export type EquipmentInput = {
    name: string
    description: string
    category: string
    location: string
    price: number
    rentalType: string
    quantity: number
    condition: string
    brand: string
    model: string
    image: string
    terms: string
}

type Result = { ok: true } | { ok: false; message: string }

const toResult = async (res: Response, fallback: string): Promise<Result> => {
    if (res.ok) return { ok: true }
    const body = await res.json().catch(() => null)
    return {
        ok: false,
        message: typeof body?.message === "string" ? body.message : fallback,
    }
}

export const createEquipment = async (input: EquipmentInput) =>
    toResult(
        await protectedMutation(`${API_BASE_URL}/equipment`, "POST", input),
        "Could not submit the equipment."
    )

export const updateEquipment = async (id: string, input: EquipmentInput) =>
    toResult(
        await protectedMutation(
            `${API_BASE_URL}/equipment/${encodeURIComponent(id)}`,
            "PATCH",
            input
        ),
        "Could not save the changes."
    )

export const deleteEquipment = async (id: string) =>
    toResult(
        await protectedMutation(
            `${API_BASE_URL}/equipment/${encodeURIComponent(id)}`,
            "DELETE"
        ),
        "Could not delete the equipment."
    )