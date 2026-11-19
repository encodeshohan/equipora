import Link from "next/link"
import { ClipboardList, Clock, Users } from "lucide-react"

import { PageContainer, PageHeader, StatCard } from "@/components/dashboard/page-shell"
import { getAdminBookings, getAdminEquipment, getAdminUsers } from "@/lib/api/admin"
import { getSession } from "@/lib/core/server"

export const metadata = { title: "Admin Dashboard" }

export default async function AdminDashboardPage() {
    const [session, users, pending, rentals] = await Promise.all([
        getSession(),
        getAdminUsers("page=1&limit=1"),
        getAdminEquipment("page=1&limit=1&status=pending"),
        getAdminBookings("page=1&limit=1&paymentStatus=paid"),
    ])

    return (
        <PageContainer>
            <PageHeader
                overline="Dashboard"
                title={`Welcome, ${session?.user.name ?? "admin"}`}
                subtitle="Manage users, approve equipment and watch rentals."
                action={
                    <Link href="/dashboard/admin/equipment?status=pending" className="btn-brand">
                        Review pending
                    </Link>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Total users"
                    value={String(users.total)}
                    icon={<Users aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Pending approvals"
                    value={String(pending.total)}
                    icon={<Clock aria-hidden className="size-5" />}
                />
                <StatCard
                    label="Paid rentals"
                    value={String(rentals.total)}
                    icon={<ClipboardList aria-hidden className="size-5" />}
                />
            </div>
        </PageContainer>
    )
}