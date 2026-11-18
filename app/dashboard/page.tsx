import { redirect } from "next/navigation"

import { requireRole } from "@/lib/core/server"
import { ROLE_META, USER_ROLES, type UserRole } from "@/lib/types/user"

export default async function DashboardIndexPage() {
  const session = await requireRole(USER_ROLES)
  redirect(ROLE_META[session.user.role as UserRole].dashboardPath)
}