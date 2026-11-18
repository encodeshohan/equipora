"use client"

import * as React from "react"
import { Heart, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { addFavorite, removeFavorite } from "@/lib/actions/favorites"
import { cn } from "@/lib/utils"

export function FavoriteButton({
    equipmentId,
    initialFavorite,
}: {
    equipmentId: string
    initialFavorite: boolean
}) {
    const [favorite, setFavorite] = React.useState(initialFavorite)
    const [pending, setPending] = React.useState(false)

    const handleClick = async () => {
        setPending(true)
        try {
            const result = favorite
                ? await removeFavorite(equipmentId)
                : await addFavorite(equipmentId)

            if (!result.ok) {
                toast.add({
                    title: "Something went wrong",
                    description: "Your favorites could not be updated.",
                    type: "error",
                })
                return
            }

            setFavorite(!favorite)
            toast.add({
                title: favorite ? "Removed from favorites" : "Added to favorites",
                type: "success",
            })
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
            type="button"
            variant="outline"
            className="h-11 w-full"
            disabled={pending}
            aria-pressed={favorite}
            onClick={handleClick}
        >
            {pending ? (
                <Loader2 aria-hidden className="animate-spin" />
            ) : (
                <Heart
                    aria-hidden
                    className={cn(favorite && "fill-current text-error")}
                />
            )}
            {favorite ? "Remove from favorites" : "Add to favorites"}
        </Button>
    )
}