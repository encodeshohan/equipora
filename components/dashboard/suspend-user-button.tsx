"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Ban, Loader2, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { setUserSuspended } from "@/lib/actions/admin"

export function SuspendUserButton({
    userId,
    name,
    banned,
}: {
    userId: string
    name: string
    banned: boolean
}) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [pending, setPending] = React.useState(false)

    const apply = async (nextBanned: boolean) => {
        setPending(true)
        try {
            const result = await setUserSuspended(userId, nextBanned)
            if (!result.ok) {
                toast.add({ title: "Could not update", description: result.message, type: "error" })
                setOpen(false)
                return
            }
            toast.add({
                title: nextBanned ? "Account suspended" : "Account restored",
                description: name,
                type: "success",
            })
            setOpen(false)
            router.refresh()
        } catch {
            toast.add({
                title: "Could not update",
                description: "Something went wrong. Please try again.",
                type: "error",
            })
        } finally {
            setPending(false)
        }
    }

    if (banned) {
        return (
            <Button
                variant="outline"
                size="sm"
                disabled={pending}
                aria-label={`Restore ${name}`}
                onClick={() => apply(false)}
            >
                {pending ? <Loader2 aria-hidden className="animate-spin" /> : <RotateCcw aria-hidden />}
                Restore
            </Button>
        )
    }

    return (
        <>
            <Button
                variant="destructive"
                size="sm"
                aria-label={`Suspend ${name}`}
                onClick={() => setOpen(true)}
            >
                <Ban aria-hidden />
                Suspend
            </Button>

            <Dialog
                open={open}
                onOpenChange={(next) => {
                    if (!pending) setOpen(next)
                }}
            >
                <DialogContent>
                    <DialogTitle>Suspend this account?</DialogTitle>
                    <DialogDescription>
                        {name} will be logged out and will not be able to log in until you
                        restore the account.
                    </DialogDescription>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" disabled={pending} onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" disabled={pending} onClick={() => apply(true)}>
                            {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
                            Suspend
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}