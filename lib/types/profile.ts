import type { UserRole } from "@/lib/types/user"

export type Profile = {
    id: string
    name: string
    email: string
    role: UserRole
    image: string | null
    phone: string
    address: string
    createdAt: string
}