"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { checkPayment } from "@/lib/actions/bookings"

export function CheckPaymentButton({ sessionId }: { sessionId: string }) {
    const router = useRouter()
    const [pending, setPending] = React.useState(false)

    const handleClick = async () => {
        setPending(true)
        try {
            const result = await checkPayment(sessionId)
            if (result.confirmed) {
                toast.add({
                    title: "Payment confirmed",
                    description: "Your booking is now confirmed.",
                    type: "success",
                })
                router.refresh()
            } else {
                toast.add({
                    title: "Not paid yet",
                    description: result.message,
                    type: "warning",
                })
            }
        } catch {
            toast.add({
                title: "Could not check payment",
                description: "Please try again.",
                type: "error",
            })
        } finally {
            setPending(false)
        }
    }

    return (
        <Button variant="outline" size="sm" disabled={pending} onClick={handleClick}>
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
            Check payment
        </Button>
    )
}