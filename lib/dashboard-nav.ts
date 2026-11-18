import {
    CalendarCheck,
    ClipboardList,
    Heart,
    LayoutDashboard,
    Package,
    PlusCircle,
    UserRound,
    Users,
    type LucideIcon,
} from "lucide-react"

import type { UserRole } from "@/lib/types/user"

export type DashboardNavItem = {
    label: string
    href: string
    icon: LucideIcon
    /** Match the path exactly (used for the overview link). */
    end?: boolean
}

// Owner and admin pages arrive in later steps.
export const DASHBOARD_NAV: Record<UserRole, DashboardNavItem[]> = {
    customer: [
        { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, end: true },
        { label: "My Rentals", href: "/dashboard/customer/rentals", icon: CalendarCheck },
        { label: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
        { label: "My Profile", href: "/dashboard/customer/profile", icon: UserRound },
    ],
    owner: [
        { label: "Overview", href: "/dashboard/owner", icon: LayoutDashboard, end: true },
        { label: "Add Equipment", href: "/dashboard/owner/equipment/new", icon: PlusCircle },
        { label: "My Equipment", href: "/dashboard/owner/equipment", icon: Package, end: true },
        { label: "My Equipment Rental", href: "/dashboard/owner/rentals", icon: ClipboardList },
        { label: "My Profile", href: "/dashboard/owner/profile", icon: UserRound },
    ],
    admin: [
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, end: true },
        { label: "All Users", href: "/dashboard/admin/users", icon: Users },
        { label: "All Equipment", href: "/dashboard/admin/equipment", icon: Package },
        { label: "All Rentals", href: "/dashboard/admin/rentals", icon: ClipboardList },
        { label: "My Profile", href: "/dashboard/admin/profile", icon: UserRound },
    ],
}