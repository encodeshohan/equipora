"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { Logo } from "@/components/shared/logo"
import { UserAvatar } from "@/components/shared/user-avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { DASHBOARD_NAV } from "@/lib/dashboard-nav"
import { ROLE_META, type UserRole } from "@/lib/types/user"

export function DashboardSidebar({
    user,
}: {
    user: { name: string; image: string | null; role: UserRole }
}) {
    const pathname = usePathname()
    const { setOpenMobile } = useSidebar()
    const items = DASHBOARD_NAV[user.role]

    return (
        <Sidebar>
            <SidebarHeader className="gap-4 p-4">
                <Logo />
                <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent p-3">
                    <UserAvatar src={user.image} name={user.name} />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-fg-secondary">{ROLE_META[user.role].label}</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map((item) => {
                            const active = item.end
                                ? pathname === item.href
                                : pathname === item.href || pathname.startsWith(`${item.href}/`)

                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        isActive={active}
                                        render={
                                            <Link href={item.href} onClick={() => setOpenMobile(false)} />
                                        }
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="gap-3 p-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fg-secondary transition-colors hover:text-foreground"
                >
                    <Home aria-hidden className="size-4" />
                    Back to site
                </Link>
                <SignOutButton />
            </SidebarFooter>
        </Sidebar>
    )
}