"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { Field } from "@/components/shared/field"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { createCheckout } from "@/lib/actions/bookings"
import {
    calcTotal,
    countDays,
    MAX_RENTAL_DAYS,
    rentalUnits,
    todayInDhaka,
    UNIT_LABEL,
} from "@/lib/booking"
import { formatMoney } from "@/lib/formatters"
import type { RentalType } from "@/lib/types/equipment"

const PHONE_PATTERN = /^\+?[\d\s-]{7,20}$/

type BookableEquipment = {
    id: string
    name: string
    price: number
    rentalType: RentalType
    quantity: number
}

export function BookNowModal({ equipment }: { equipment: BookableEquipment }) {
    const [open, setOpen] = React.useState(false)
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")
    const [quantity, setQuantity] = React.useState("1")
    const [contactNumber, setContactNumber] = React.useState("")
    const [deliveryAddress, setDeliveryAddress] = React.useState("")
    const [notes, setNotes] = React.useState("")
    const [pending, setPending] = React.useState(false)

    const available = equipment.quantity > 0
    const today = todayInDhaka()

    // Live estimate only: the server recomputes the real total.
    const hasRange = Boolean(startDate && endDate && endDate >= startDate)
    const days = hasRange ? countDays(startDate, endDate) : 0
    const units = days ? rentalUnits(equipment.rentalType, days) : 0
    const qty = Number(quantity)
    const total =
        days && Number.isInteger(qty) && qty >= 1
            ? calcTotal(equipment.price, equipment.rentalType, days, qty)
            : null
    const unitLabel = UNIT_LABEL[equipment.rentalType]

    const fail = (title: string, description: string) =>
        toast.add({ title, description, type: "error" })

    const handleOpenChange = (next: boolean) => {
        // keep the dialog open while redirecting to Stripe
        if (!pending) setOpen(next)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!startDate || !endDate) {
            return fail("Dates required", "Choose a start and an end date.")
        }
        if (startDate < today) {
            return fail("Invalid start date", "The start date cannot be in the past.")
        }
        if (endDate < startDate) {
            return fail("Invalid dates", "The end date cannot be before the start date.")
        }
        if (days > MAX_RENTAL_DAYS) {
            return fail("Rental too long", `Rentals are limited to ${MAX_RENTAL_DAYS} days.`)
        }
        if (!Number.isInteger(qty) || qty < 1 || qty > equipment.quantity) {
            return fail("Invalid quantity", `Choose between 1 and ${equipment.quantity}.`)
        }
        if (!PHONE_PATTERN.test(contactNumber.trim())) {
            return fail("Invalid contact number", "Enter a valid phone number.")
        }
        if (deliveryAddress.trim().length < 5) {
            return fail("Delivery address required", "Enter the delivery address.")
        }

        setPending(true)
        try {
            const result = await createCheckout({
                equipmentId: equipment.id,
                startDate,
                endDate,
                quantity: qty,
                contactNumber: contactNumber.trim(),
                deliveryAddress: deliveryAddress.trim(),
                notes: notes.trim(),
            })

            if (!result.ok) {
                fail("Could not book", result.message)
                setPending(false)
                return
            }

            // Stay in the pending state while the browser leaves for Stripe.
            window.location.assign(result.url)
        } catch {
            fail("Could not book", "Something went wrong. Please try again.")
            setPending(false)
        }
    }

    return (
        <>
            <button
                type="button"
                className="btn-brand h-11 w-full"
                disabled={!available}
                onClick={() => setOpen(true)}
            >
                {available ? "Book Now" : "Unavailable"}
            </button>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent>
                    <DialogTitle>Book {equipment.name}</DialogTitle>
                    <DialogDescription>
                        Choose your dates and quantity. You will pay securely on Stripe.
                    </DialogDescription>

                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Start date" htmlFor="startDate">
                                <Input
                                    id="startDate"
                                    type="date"
                                    required
                                    min={today}
                                    value={startDate}
                                    onChange={(event) => setStartDate(event.target.value)}
                                />
                            </Field>
                            <Field label="End date" htmlFor="endDate">
                                <Input
                                    id="endDate"
                                    type="date"
                                    required
                                    min={startDate || today}
                                    value={endDate}
                                    onChange={(event) => setEndDate(event.target.value)}
                                />
                            </Field>
                        </div>

                        <Field
                            label="Required quantity"
                            htmlFor="quantity"
                            hint={`${equipment.quantity} available`}
                        >
                            <Input
                                id="quantity"
                                type="number"
                                required
                                min={1}
                                max={equipment.quantity}
                                inputMode="numeric"
                                value={quantity}
                                onChange={(event) => setQuantity(event.target.value)}
                            />
                        </Field>

                        <Field label="Contact number" htmlFor="contactNumber">
                            <Input
                                id="contactNumber"
                                type="tel"
                                required
                                autoComplete="tel"
                                maxLength={20}
                                value={contactNumber}
                                onChange={(event) => setContactNumber(event.target.value)}
                                placeholder="01XXXXXXXXX"
                            />
                        </Field>

                        <Field label="Delivery address" htmlFor="deliveryAddress">
                            <Textarea
                                id="deliveryAddress"
                                required
                                rows={2}
                                maxLength={300}
                                value={deliveryAddress}
                                onChange={(event) => setDeliveryAddress(event.target.value)}
                                placeholder="House, road, area, city"
                            />
                        </Field>

                        <Field label="Notes (optional)" htmlFor="notes">
                            <Textarea
                                id="notes"
                                rows={2}
                                maxLength={500}
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Anything the owner should know"
                            />
                        </Field>

                        <div className="rounded-lg border border-border bg-elevated p-4 text-sm">
                            {total !== null ? (
                                <dl className="flex flex-col gap-1.5">
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-fg-secondary">Duration</dt>
                                        <dd>
                                            {days} {days === 1 ? "day" : "days"}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-fg-secondary">Billed</dt>
                                        <dd>
                                            {qty} × {units} {unitLabel}
                                            {units === 1 ? "" : "s"} × {formatMoney(equipment.price)}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between gap-4 border-t border-border pt-2 font-heading text-base font-bold">
                                        <dt>Estimated total</dt>
                                        <dd>{formatMoney(total)}</dd>
                                    </div>
                                </dl>
                            ) : (
                                <p className="text-fg-secondary">
                                    Pick your dates and quantity to see the total.
                                </p>
                            )}
                            <p className="mt-2 text-xs text-fg-muted">
                                The final total is calculated and checked by the server.
                            </p>
                        </div>

                        <button type="submit" className="btn-brand h-11 w-full" disabled={pending}>
                            {pending ? (
                                <>
                                    <Loader2 aria-hidden className="animate-spin" />
                                    Redirecting to payment...
                                </>
                            ) : (
                                "Confirm and pay"
                            )}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}