// Roles mirror the `user.additionalFields.role` enum in `lib/auth.ts`
// and the `role` values stored in the `user` collection.
export type UserRole = "customer" | "owner" | "admin"

/** All roles, in privilege order. */
export const USER_ROLES: UserRole[] = ["customer", "owner", "admin"]

export const ROLE_META: Record<
    UserRole,
    { label: string; dashboardPath: string }
> = {
    customer: { label: "Customer", dashboardPath: "/dashboard/customer" },
    owner: { label: "Owner", dashboardPath: "/dashboard/owner" },
    admin: { label: "Admin", dashboardPath: "/dashboard/admin" },
}