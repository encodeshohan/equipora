import type { RentalType } from "@/lib/types/equipment"

export const MAX_RENTAL_DAYS = 365

export const UNIT_LABEL: Record<RentalType, string> = {
    daily: "day",
    weekly: "week",
    monthly: "month",
}

// "YYYY-MM-DD" in Bangladesh time (same as the server).
export const todayInDhaka = () =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" })

const DAY_MS = 24 * 60 * 60 * 1000

/** Both days are inclusive. */
export const countDays = (start: string, end: string) =>
    Math.round((Date.parse(end) - Date.parse(start)) / DAY_MS) + 1

export const rentalUnits = (rentalType: RentalType, days: number) => {
    if (rentalType === "weekly") return Math.ceil(days / 7)
    if (rentalType === "monthly") return Math.ceil(days / 30)
    return days
}

export const calcTotal = (
    price: number,
    rentalType: RentalType,
    days: number,
    quantity: number
) => Math.round(price * rentalUnits(rentalType, days) * quantity * 100) / 100