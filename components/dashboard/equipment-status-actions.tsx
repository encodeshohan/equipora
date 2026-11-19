"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { setEquipmentStatus } from "@/lib/actions/admin"
import type { EquipmentStatus } from "@/lib/types/equipment"

export function EquipmentStatusActions({
    id,
    name,
    status,
}: {
    id: string
    name: string
    status: EquipmentStatus
}) {
    const router = useRouter()
    const [pending, setPending] = React.useState<"approved" | "rejected" | null>(null)

    const change = async (next: "approved" | "rejected") => {
        setPending(next)
        try {
            const result = await setEquipmentStatus(id, next)
            if (!result.ok) {
                toast.add({ title: "Could not update", description: result.message, type: "error" })
                return
            }
            toast.add({
                title: next === "approved" ? "Equipment approved" : "Equipment rejected",
                description: name,
                type: "success",
            })
            router.refresh()
        } catch {
            toast.add({
                title: "Could not update",
                description: "Something went wrong. Please try again.",
                type: "error",
            })
        } finally {
            setPending(null)
        }
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                disabled={status === "approved" || pending !== null}
                aria-label={`Approve ${name}`}
                onClick={() => change("approved")}
            >
                {pending === "approved" ? (
                    <Loader2 aria-hidden className="animate-spin" />
                ) : (
                    <Check aria-hidden />
                )}
                Approve
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={status === "rejected" || pending !== null}
                aria-label={`Reject ${name}`}
                onClick={() => change("rejected")}
            >
                {pending === "rejected" ? (
                    <Loader2 aria-hidden className="animate-spin" />
                ) : (
                    <X aria-hidden />
                )}
                Reject
            </Button>
        </>
    )
}