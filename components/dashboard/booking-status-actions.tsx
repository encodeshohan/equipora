"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Ban, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { updateBookingStatus } from "@/lib/actions/admin"

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"

export function BookingStatusActions({
    id,
    equipmentName,
    bookingStatus,
    paid,
}: {
    id: string
    equipmentName: string
    bookingStatus: BookingStatus
    paid: boolean
}) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [pending, setPending] = React.useState<"completed" | "cancelled" | null>(null)

    // Completed and cancelled rentals are final.
    if (bookingStatus === "completed" || bookingStatus === "cancelled") {
        return <span className="text-fg-muted">-</span>
    }

    const apply = async (next: "completed" | "cancelled") => {
        setPending(next)
        try {
            const result = await updateBookingStatus(id, next)
            if (!result.ok) {
                toast.add({ title: "Could not update", description: result.message, type: "error" })
                setOpen(false)
                return
            }
            toast.add({
                title: next === "completed" ? "Rental marked completed" : "Rental cancelled",
                description: equipmentName,
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
            setPending(null)
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                {bookingStatus === "confirmed" ? (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pending !== null}
                        aria-label={`Mark ${equipmentName} as completed`}
                        onClick={() => apply("completed")}
                    >
                        {pending === "completed" ? (
                            <Loader2 aria-hidden className="animate-spin" />
                        ) : (
                            <Check aria-hidden />
                        )}
                        Complete
                    </Button>
                ) : null}
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={pending !== null}
                    aria-label={`Cancel rental of ${equipmentName}`}
                    onClick={() => setOpen(true)}
                >
                    <Ban aria-hidden />
                    Cancel
                </Button>
            </div>

            <Dialog
                open={open}
                onOpenChange={(next) => {
                    if (pending === null) setOpen(next)
                }}
            >
                <DialogContent>
                    <DialogTitle>Cancel this rental?</DialogTitle>
                    <DialogDescription>
                        {paid
                            ? `The rental of "${equipmentName}" will be cancelled and its stock released. This does not refund the customer automatically: refund the payment in Stripe.`
                            : `The rental of "${equipmentName}" will be cancelled and its unpaid checkout will be closed.`}
                    </DialogDescription>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            disabled={pending !== null}
                            onClick={() => setOpen(false)}
                        >
                            Keep rental
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={pending !== null}
                            onClick={() => apply("cancelled")}
                        >
                            {pending === "cancelled" ? (
                                <Loader2 aria-hidden className="animate-spin" />
                            ) : null}
                            Cancel rental
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}