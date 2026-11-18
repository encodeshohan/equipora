"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { removeFavorite } from "@/lib/actions/favorites"

export function RemoveFavoriteButton({
    equipmentId,
    name,
}: {
    equipmentId: string
    name: string
}) {
    const router = useRouter()
    const [pending, setPending] = React.useState(false)

    const handleClick = async () => {
        setPending(true)
        try {
            const result = await removeFavorite(equipmentId)
            if (!result.ok) {
                toast.add({
                    title: "Something went wrong",
                    description: "Your favorites could not be updated.",
                    type: "error",
                })
                return
            }
            toast.add({ title: "Removed from favorites", type: "success" })
            router.refresh()
        } catch {
            toast.add({
                title: "Something went wrong",
                description: "Your favorites could not be updated.",
                type: "error",
            })
        } finally {
            setPending(false)
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            disabled={pending}
            aria-label={`Remove ${name} from favorites`}
            onClick={handleClick}
        >
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Trash2 aria-hidden />}
            Remove
        </Button>
    )
}