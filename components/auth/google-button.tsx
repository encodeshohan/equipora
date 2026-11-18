"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

export function GoogleButton({
    redirectTo,
    disabled,
}: {
    redirectTo: string
    disabled?: boolean
}) {
    const [pending, setPending] = React.useState(false)

    const handleClick = async () => {
        setPending(true)
        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: redirectTo,
        })
        // On success the browser leaves for Google, so we only handle errors.
        if (error) {
            setPending(false)
            toast.add({
                title: "Google login failed",
                description: error.message || "Google login is not available right now.",
                type: "error",
            })
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            disabled={disabled || pending}
            onClick={handleClick}
        >
            {pending ? (
                <Loader2 aria-hidden className="animate-spin" />
            ) : (
                <span aria-hidden className="font-heading font-bold">
                    G
                </span>
            )}
            Continue with Google
        </Button>
    )
}