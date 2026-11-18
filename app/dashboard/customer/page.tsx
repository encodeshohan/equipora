import Link from "next/link"
import { CalendarCheck, Heart } from "lucide-react"

import { PageContainer, PageHeader, StatCard } from "@/components/dashboard/page-shell"
import { getMyBookings } from "@/lib/api/bookings"
import { getFavoriteIds } from "@/lib/api/favorites"
import { getSession } from "@/lib/core/server"

export const metadata = { title: "Customer Dashboard" }

export default async function CustomerDashboardPage() {
    const [session, bookings, favoriteIds] = await Promise.all([
        getSession(),
        getMyBookings("page=1&limit=1"),
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

            <div className="grid gap-4 sm:grid-cols-2">
                <StatCard
                    label="Total rentals"
                    value={String(bookings.total)}
                    icon={<CalendarCheck aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Favorites"
                    value={String(favoriteIds.length)}
                    icon={<Heart aria-hidden className="size-5" />}
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