import type { RentalType } from "@/lib/types/equipment"

export type PaymentStatus = "unpaid" | "paid"
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"

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
}

export type VerifyResponse = {
    success: boolean
    message?: string
    alreadyVerified?: boolean
    booking?: BookingItem
    transactionId?: string | null
}