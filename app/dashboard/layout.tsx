import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getSession } from "@/lib/core/server"
import { USER_ROLES, type UserRole } from "@/lib/types/user"

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await getSession()
    if (!session) redirect("/signin")

    const role = (
        USER_ROLES.includes(session.user.role as UserRole)
            ? session.user.role
            : "customer"
    ) as UserRole

    return (
        <SidebarProvider>
            <DashboardSidebar
                user={{ name: session.user.name, image: session.user.image ?? null, role }}
            />
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur">
                    <SidebarTrigger />
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </header>
                <main className="min-w-0 flex-1">{children}</main>
            </div>
        </SidebarProvider>
    )
}