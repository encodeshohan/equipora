import type { ReactNode } from "react"

import { requireRole } from "@/lib/core/server"

export default async function CustomerDashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    await requireRole("customer")
    return children
}