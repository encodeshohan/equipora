// Fixed en-US so server and client render the same text.
export const formatMoney = (amount: number) =>
    `৳${amount.toLocaleString("en-US")}`

export const formatDate = (value: string | Date) =>
    new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "Asia/Dhaka",
    })