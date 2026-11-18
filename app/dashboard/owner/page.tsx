import Link from "next/link"
import { ClipboardList, Clock, Package } from "lucide-react"

import { PageContainer, PageHeader, StatCard } from "@/components/dashboard/page-shell"
import { getOwnerBookings, getOwnerEquipment } from "@/lib/api/owner"
import { getSession } from "@/lib/core/server"

export const metadata = { title: "Owner Dashboard" }

export default async function OwnerDashboardPage() {
    const [session, all, pending, bookings] = await Promise.all([
        getSession(),
        getOwnerEquipment("page=1&limit=1"),
        getOwnerEquipment("page=1&limit=1&status=pending"),
        getOwnerBookings("page=1&limit=1"),
    ])

    return (
        <PageContainer>
            <PageHeader
                overline="Dashboard"
                title={`Welcome, ${session?.user.name ?? "there"}`}
                subtitle="Manage your equipment and see who is renting it."
                action={
                    <Link href="/dashboard/owner/equipment/new" className="btn-brand">
                        Add Equipment
                    </Link>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Listed equipment"
                    value={String(all.total)}
                    icon={<Package aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Pending approval"
                    value={String(pending.total)}
                    icon={<Clock aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Paid rentals"
                    value={String(bookings.total)}
                    icon={<ClipboardList aria-hidden className="size-5" />}
                />
            </div>
        </PageContainer>
    )
}