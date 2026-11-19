import Link from "next/link"
import {
    CalendarCheck,
    CircleCheck,
    Clock,
    Package,
    Users,
    Wallet,
} from "lucide-react"

import { MonthlyChart } from "@/components/dashboard/monthly-chart"
import { PageContainer, PageHeader, StatCard } from "@/components/dashboard/page-shell"
import { getAdminAnalytics } from "@/lib/api/analytics"
import { getSession } from "@/lib/core/server"
import { formatMoney } from "@/lib/formatters"

export const metadata = { title: "Admin Dashboard" }

export default async function AdminDashboardPage() {
    const [session, stats] = await Promise.all([getSession(), getAdminAnalytics()])

    return (
        <PageContainer>
            <PageHeader
                overline="Dashboard"
                title={`Welcome, ${session?.user.name ?? "admin"}`}
                subtitle="Platform activity at a glance."
                action={
                    <Link href="/dashboard/admin/equipment?status=pending" className="btn-brand">
                        Review pending
                    </Link>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="Total users"
                    value={String(stats.totalUsers)}
                    icon={<Users aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Total equipment"
                    value={String(stats.totalEquipment)}
                    icon={<Package aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Total bookings (paid)"
                    value={String(stats.totalBookings)}
                    icon={<CalendarCheck aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Pending approvals"
                    value={String(stats.pendingApprovals)}
                    icon={<Clock aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Completed rentals"
                    value={String(stats.completedRentals)}
                    icon={<CircleCheck aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Total revenue (gross)"
                    value={formatMoney(stats.totalRevenue)}
                    icon={<Wallet aria-hidden className="size-5" />}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <MonthlyChart
                    title="Monthly bookings"
                    description="Paid bookings per month, last 6 months."
                    data={stats.monthly}
                    dataKey="bookings"
                    kind="bar"
                    seriesLabel="Bookings"
                />
                <MonthlyChart
                    title="Monthly revenue"
                    description="Gross amount paid by customers, last 6 months."
                    data={stats.monthly}
                    dataKey="revenue"
                    kind="line"
                    money
                    seriesLabel="Revenue"
                />
            </div>
        </PageContainer>
    )
}