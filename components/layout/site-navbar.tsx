import { NavbarClient } from "@/components/layout/navbar-client"
import { getSessionSafe } from "@/lib/core/server"
import { USER_ROLES, type UserRole } from "@/lib/types/user"

export async function SiteNavbar() {
    const session = await getSessionSafe()

    const user = session
        ? {
            name: session.user.name,
            image: session.user.image ?? null,
            role: (USER_ROLES.includes(session.user.role as UserRole)
                ? session.user.role
                : "customer") as UserRole,
        }
        : null

    return <NavbarClient user={user} />
}