// Mirrors the equipment documents and categories of the Express server.
export const EQUIPMENT_CATEGORIES = [
    { name: "Construction Equipment", slug: "construction-equipment" },
    { name: "Photography Equipment", slug: "photography-equipment" },
    { name: "Vehicles & Transportation", slug: "vehicles-transportation" },
    { name: "Agriculture Equipment", slug: "agriculture-equipment" },
    { name: "Electronics", slug: "electronics" },
    { name: "Event Equipment", slug: "event-equipment" },
]

export type RentalType = "daily" | "weekly" | "monthly"
export type EquipmentStatus = "pending" | "approved" | "rejected"

export type EquipmentItem = {
    _id: string
    name: string
    description: string
    category: string
    location: string
    price: number
    rentalType: RentalType
    quantity: number
    condition: string
    brand: string
    model: string
    image: string
    terms: string
    status: EquipmentStatus
    ownerId: string
    ownerName: string
    ownerImage: string | null
    /** Only present on owner/admin management responses. */
    ownerEmail?: string
    createdAt: string
    updatedAt: string
}

export type CategorySummary = {
    name: string
    slug: string
    count: number
}

export type EquipmentListResponse = {
    items: EquipmentItem[]
    total: number
    page: number
    limit: number
    totalPages: number
}

/** Status pill labels + token-based colors. */
export const STATUS_META: Record<
    EquipmentStatus,
    { label: string; className: string }
> = {
    pending: {
        label: "Pending",
        className: "border-warning/40 bg-warning/10 text-warning",
    },
    approved: {
        label: "Approved",
        className: "border-success/40 bg-success/10 text-success",
    },
    rejected: {
        label: "Rejected",
        className: "border-error/40 bg-error/10 text-error",
    },
}

export type FavoriteItem = EquipmentItem & {
    favoriteId: string
    favoritedAt: string
}

export const RENTAL_TYPES: RentalType[] = ["daily", "weekly", "monthly"]

export const CONDITIONS = [
    { value: "new", label: "New" },
    { value: "like-new", label: "Like new" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
]