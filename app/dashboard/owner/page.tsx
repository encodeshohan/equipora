import Link from "next/link"
import { CalendarCheck, CircleCheck, Package, Wallet } from "lucide-react"

import { MonthlyChart } from "@/components/dashboard/monthly-chart"
import { PageContainer, PageHeader, StatCard } from "@/components/dashboard/page-shell"
import { getOwnerAnalytics } from "@/lib/api/analytics"
import { getSession } from "@/lib/core/server"
import { formatMoney } from "@/lib/formatters"

export const metadata = { title: "Owner Dashboard" }

export default async function OwnerDashboardPage() {
    const [session, stats] = await Promise.all([getSession(), getOwnerAnalytics()])

    return (
        <PageContainer>
            <PageHeader
                overline="Dashboard"
                title={`Welcome, ${session?.user.name ?? "there"}`}
                subtitle="Your listings and earnings at a glance."
                action={
                    <Link href="/dashboard/owner/equipment/new" className="btn-brand">
                        Add Equipment
                    </Link>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Listed equipment"
                    value={String(stats.listedEquipment)}
                    icon={<Package aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Paid rentals"
                    value={String(stats.paidRentals)}
                    icon={<CalendarCheck aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Completed rentals"
                    value={String(stats.completedRentals)}
                    icon={<CircleCheck aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Total earnings (gross)"
                    value={formatMoney(stats.totalEarnings)}
                    icon={<Wallet aria-hidden className="size-5" />}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <MonthlyChart
                    title="Monthly earnings"
                    description="Amount paid for your equipment, last 6 months."
                    data={stats.monthly}
                    dataKey="revenue"
                    kind="line"
                    money
                    seriesLabel="Earnings"
                />
                <MonthlyChart
                    title="Monthly rentals"
                    description="Paid rentals of your equipment per month."
                    data={stats.monthly}
                    dataKey="bookings"
                    kind="bar"
                    seriesLabel="Rentals"
                />
            </div>
        </PageContainer>
    )
}