
import type { RentalType } from "@/lib/types/equipment"

export type PaymentStatus = "unpaid" | "paid"

export type BookingStatus =
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"

export type BookingItem = {
    _id: string
    equipmentId: string
    equipmentName: string
    equipmentImage: string
    category: string
    location: string
    ownerId: string
    ownerName: string
    customerId: string
    customerName: string
    customerEmail: string
    startDate: string
    endDate: string
    days: number
    rentalType: RentalType
    units: number
    unitPrice: number
    quantity: number
    total: number
    contactNumber: string
    deliveryAddress: string
    notes: string
    paymentStatus: PaymentStatus
    bookingStatus: BookingStatus
    createdAt: string
    stripeSessionId?: string
}

export type VerifyResponse = {
    success: boolean
    message?: string
    alreadyVerified?: boolean
    booking?: BookingItem
    transactionId?: string | null
}

export type BookingListResponse = {
    items: BookingItem[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export const PAYMENT_STATUS_META: Record<
    PaymentStatus,
    { label: string; className: string }
> = {
    unpaid: {
        label: "Unpaid",
        className: "border-warning/40 bg-warning/10 text-warning",
    },
    paid: {
        label: "Paid",
        className: "border-success/40 bg-success/10 text-success",
    },
}

export const BOOKING_STATUS_META: Record<
    BookingStatus,
    { label: string; className: string }
> = {
    pending: {
        label: "Pending",
        className: "border-warning/40 bg-warning/10 text-warning",
    },
    confirmed: {
        label: "Confirmed",
        className: "border-info/40 bg-info/10 text-info",
    },
    completed: {
        label: "Completed",
        className: "border-success/40 bg-success/10 text-success",
    },
    cancelled: {
        label: "Cancelled",
        className: "border-error/40 bg-error/10 text-error",
    },
}
