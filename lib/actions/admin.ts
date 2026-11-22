// "use server"

// import { API_BASE_URL, protectedMutation } from "@/lib/core/server"

// type Result = { ok: true } | { ok: false; message: string }

// const toResult = async (res: Response, fallback: string): Promise<Result> => {
//     if (res.ok) return { ok: true }
//     const body = await res.json().catch(() => null)
//     return {
//         ok: false,
//         message: typeof body?.message === "string" ? body.message : fallback,
//     }
// }

// export const changeUserRole = async (userId: string, role: string) =>
//     toResult(
//         await protectedMutation(
//             `${API_BASE_URL}/admin/users/${encodeURIComponent(userId)}/role`,
//             "PATCH",
//             { role }
//         ),
//         "Could not change the role."
//     )

// export const setUserSuspended = async (userId: string, banned: boolean) =>
//     toResult(
//         await protectedMutation(
//             `${API_BASE_URL}/admin/users/${encodeURIComponent(userId)}/ban`,
//             "PATCH",
//             { banned }
//         ),
//         "Could not update the account."
//     )

// export const setEquipmentStatus = async (id: string, status: string) =>
//     toResult(
//         await protectedMutation(
//             `${API_BASE_URL}/equipment/${encodeURIComponent(id)}/status`,
//             "PATCH",
//             { status }
//         ),
//         "Could not update the status."
//     )


"use server"

import { API_BASE_URL, protectedMutation } from "@/lib/core/server"

type Result = { ok: true } | { ok: false; message: string }

const toResult = async (res: Response, fallback: string): Promise<Result> => {
    if (res.ok) return { ok: true }
    const body = await res.json().catch(() => null)
    return {
        ok: false,
        message: typeof body?.message === "string" ? body.message : fallback,
    }
}

export const changeUserRole = async (userId: string, role: string) =>
    toResult(
        await protectedMutation(
            `${API_BASE_URL}/admin/users/${encodeURIComponent(userId)}/role`,
            "PATCH",
            { role }
        ),
        "Could not change the role."
    )

export const setUserSuspended = async (userId: string, banned: boolean) =>
    toResult(
        await protectedMutation(
            `${API_BASE_URL}/admin/users/${encodeURIComponent(userId)}/ban`,
            "PATCH",
            { banned }
        ),
        "Could not update the account."
    )

export const setEquipmentStatus = async (id: string, status: string) =>
    toResult(
        await protectedMutation(
            `${API_BASE_URL}/equipment/${encodeURIComponent(id)}/status`,
            "PATCH",
            { status }
        ),
        "Could not update the status."
    )

export const updateBookingStatus = async (
    bookingId: string,
    bookingStatus: "completed" | "cancelled"
) =>
    toResult(
        await protectedMutation(
            `${API_BASE_URL}/admin/bookings/${encodeURIComponent(bookingId)}/status`,
            "PATCH",
            { bookingStatus }
        ),
        "Could not update the rental."
    )