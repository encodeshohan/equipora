import type { UserRole } from "@/lib/types/user"

export type AdminUser = {
    id: string
    name: string
    email: string
    role: UserRole
    image: string | null
    banned: boolean
    createdAt: string
}

export type AdminUserListResponse = {
    items: AdminUser[]
    total: number
    page: number
    limit: number
    totalPages: number
}