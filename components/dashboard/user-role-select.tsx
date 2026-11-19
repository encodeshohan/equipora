"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { toast } from "@/components/ui/toast"
import { changeUserRole } from "@/lib/actions/admin"
import { ROLE_META, USER_ROLES, type UserRole } from "@/lib/types/user"

// Render with key={`${id}-${role}`} so it resets when the server data changes.
export function UserRoleSelect({
    userId,
    name,
    role,
    disabled,
}: {
    userId: string
    name: string
    role: UserRole
    disabled?: boolean
}) {
    const router = useRouter()
    const [value, setValue] = React.useState<UserRole>(role)
    const [pending, setPending] = React.useState(false)

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const next = event.target.value as UserRole
        const previous = value
        setValue(next)
        setPending(true)

        try {
            const result = await changeUserRole(userId, next)
            if (!result.ok) {
                setValue(previous)
                toast.add({ title: "Could not change role", description: result.message, type: "error" })
                return
            }
            toast.add({
                title: "Role updated",
                description: `${name} is now ${ROLE_META[next].label}.`,
                type: "success",
            })
            router.refresh()
        } catch {
            setValue(previous)
            toast.add({
                title: "Could not change role",
                description: "Something went wrong. Please try again.",
                type: "error",
            })
        } finally {
            setPending(false)
        }
    }

    return (
        <select
            aria-label={`Role for ${name}`}
            value={value}
            disabled={disabled || pending}
            onChange={handleChange}
            className="surface-field h-9 w-36 rounded-lg border px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60 *:bg-surface *:text-foreground"
        >
            {USER_ROLES.map((item) => (
                <option key={item} value={item}>
                    {ROLE_META[item].label}
                </option>
            ))}
        </select>
    )
}