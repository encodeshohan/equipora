export type MonthStat = {
    /** "2026-11" */
    month: string
    /** "Nov 2026" */
    label: string
    bookings: number
    revenue: number
}

export type AdminAnalytics = {
    totalUsers: number
    totalEquipment: number
    pendingApprovals: number
    totalBookings: number
    completedRentals: number
    totalRevenue: number
    monthly: MonthStat[]
}

export type OwnerAnalytics = {
    listedEquipment: number
    paidRentals: number
    completedRentals: number
    totalEarnings: number
    monthly: MonthStat[]
}