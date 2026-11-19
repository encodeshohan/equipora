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

// 1250 -> "1.3K", used for chart axes.
export const formatCompact = (value: number) =>
    new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value)