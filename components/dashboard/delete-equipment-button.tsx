"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { deleteEquipment } from "@/lib/actions/equipment"

export function DeleteEquipmentButton({
    id,
    name,
}: {
    id: string
    name: string
}) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [pending, setPending] = React.useState(false)

    const handleDelete = async () => {
        setPending(true)
        try {
            const result = await deleteEquipment(id)
            if (!result.ok) {
                toast.add({ title: "Could not delete", description: result.message, type: "error" })
                setOpen(false)
                return
            }
            toast.add({ title: "Equipment deleted", type: "success" })
            setOpen(false)
            router.refresh()
        } catch {
            toast.add({
                title: "Could not delete",
                description: "Something went wrong. Please try again.",
                type: "error",
            })
        } finally {
            setPending(false)
        }
    }

    return (
        <>
            <Button
                variant="destructive"
                size="sm"
                aria-label={`Delete ${name}`}
                onClick={() => setOpen(true)}
            >
                <Trash2 aria-hidden />
                Delete
            </Button>

            <Dialog
                open={open}
                onOpenChange={(next) => {
                    if (!pending) setOpen(next)
                }}
            >
                <DialogContent>
                    <DialogTitle>Delete equipment?</DialogTitle>
                    <DialogDescription>
                        This permanently deletes &quot;{name}&quot; and removes it from
                        customers&apos; favorites. This cannot be undone.
                    </DialogDescription>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" disabled={pending} onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" disabled={pending} onClick={handleDelete}>
                            {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}