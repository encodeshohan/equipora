import Link from "next/link"
import { CalendarCheck, CircleCheck, Heart, Wallet } from "lucide-react"

import { MonthlyChart } from "@/components/dashboard/monthly-chart"
import { PageContainer, PageHeader, StatCard } from "@/components/dashboard/page-shell"
import { getCustomerAnalytics } from "@/lib/api/analytics"
import { getFavoriteIds } from "@/lib/api/favorites"
import { getSession } from "@/lib/core/server"
import { formatMoney } from "@/lib/formatters"

export const metadata = { title: "Customer Dashboard" }

export default async function CustomerDashboardPage() {
    const [session, stats, favoriteIds] = await Promise.all([
        getSession(),
        getCustomerAnalytics(),
        getFavoriteIds(),
    ])

    return (
        <PageContainer>
            <PageHeader
                overline="Dashboard"
                title={`Welcome, ${session?.user.name ?? "there"}`}
                subtitle="Track your rentals and manage your saved equipment."
                action={
                    <Link href="/equipment" className="btn-brand">
                        Browse Equipment
                    </Link>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total rentals"
                    value={String(stats.totalRentals)}
                    icon={<CalendarCheck aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Completed rentals"
                    value={String(stats.completedRentals)}
                    icon={<CircleCheck aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Total spent"
                    value={formatMoney(stats.totalSpent)}
                    icon={<Wallet aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Favorites"
                    value={String(favoriteIds.length)}
                    icon={<Heart aria-hidden className="size-5" />}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <MonthlyChart
                    title="Monthly rentals"
                    description="Your paid rentals per month, last 6 months."
                    data={stats.monthly}
                    dataKey="bookings"
                    kind="bar"
                    seriesLabel="Rentals"
                />
                <MonthlyChart
                    title="Monthly spending"
                    description="Amount you paid per month, last 6 months."
                    data={stats.monthly}
                    dataKey="revenue"
                    kind="line"
                    money
                    seriesLabel="Spent"
                />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                    href="/dashboard/customer/rentals"
                    className="surface-card p-6 transition-colors hover:border-ring"
                >
                    <h2 className="font-heading text-lg font-semibold">My Rentals</h2>
                    <p className="mt-1 text-sm text-fg-secondary">
                        See your bookings, dates, totals and payment status.
                    </p>
                </Link>
                <Link
                    href="/dashboard/customer/favorites"
                    className="surface-card p-6 transition-colors hover:border-ring"
                >
                    <h2 className="font-heading text-lg font-semibold">Favorites</h2>
                    <p className="mt-1 text-sm text-fg-secondary">
                        Equipment you saved for later.
                    </p>
                </Link>
            </div>
        </PageContainer>
    )
}
