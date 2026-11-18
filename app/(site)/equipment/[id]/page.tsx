import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, MapPin } from "lucide-react"

import { BookNowModal } from "@/components/equipment/book-now-modal"
import { FavoriteButton } from "@/components/equipment/favorite-button"
import { UserAvatar } from "@/components/shared/user-avatar"
import { getEquipmentById } from "@/lib/api/equipment"
import { getFavoriteIds } from "@/lib/api/favorites"
import { getSessionSafe } from "@/lib/core/server"
import { formatDate, formatMoney } from "@/lib/formatters"
import { cn } from "@/lib/utils"

export const metadata = { title: "Equipment Details" }

export default async function EquipmentDetailsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ canceled?: string }>
}) {
    const { id } = await params
    const { canceled } = await searchParams

    // Private page: logged-out visitors go to login and come back here.
    const session = await getSessionSafe()
    if (!session) {
        redirect(`/signin?redirectTo=${encodeURIComponent(`/equipment/${id}`)}`)
    }

    const item = await getEquipmentById(id)
    if (!item) notFound()

    const isCustomer = session.user.role === "customer"
    const favoriteIds = isCustomer ? await getFavoriteIds() : []
    const available = item.quantity > 0

    const specs = [
        { label: "Rental type", value: item.rentalType },
        { label: "Condition", value: item.condition.replace("-", " ") },
        { label: "Brand", value: item.brand || "-" },
        { label: "Model", value: item.model || "-" },
        { label: "Available quantity", value: String(item.quantity) },
        { label: "Listed on", value: formatDate(item.createdAt) },
    ]

    return (
        <div className="site-container py-8">
            <Link
                href="/equipment"
                className="inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors hover:text-foreground"
            >
                <ArrowLeft aria-hidden className="size-4" />
                Back to all equipment
            </Link>

            {canceled ? (
                <p
                    role="status"
                    className="mt-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-warning"
                >
                    Payment was canceled, so your booking was not confirmed.
                </p>
            ) : null}

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                <div className="flex min-w-0 flex-col gap-6">
                    <div className="surface-card overflow-hidden">
                        <div className="aspect-[4/3] bg-elevated">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="size-full object-cover" />
                        </div>
                    </div>

                    <section className="surface-card p-6">
                        <h2 className="font-heading text-lg font-semibold">Description</h2>
                        <p className="mt-3 whitespace-pre-line text-fg-secondary">
                            {item.description}
                        </p>
                    </section>

                    <section className="surface-card p-6">
                        <h2 className="font-heading text-lg font-semibold">Details</h2>
                        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                            {specs.map((spec) => (
                                <div key={spec.label}>
                                    <dt className="text-xs text-fg-muted">{spec.label}</dt>
                                    <dd className="mt-0.5 font-medium capitalize">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section className="surface-card p-6">
                        <h2 className="font-heading text-lg font-semibold">Rental terms</h2>
                        <p className="mt-3 whitespace-pre-line text-fg-secondary">
                            {item.terms || "No specific terms provided by the owner."}
                        </p>
                    </section>
                </div>

                <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
                    <div className="surface-card flex flex-col gap-4 p-6">
                        <p className="overline-label">{item.category}</p>
                        <h1 className="font-heading text-2xl leading-snug font-bold">
                            {item.name}
                        </h1>
                        <p className="flex items-center gap-1.5 text-sm text-fg-secondary">
                            <MapPin aria-hidden className="size-4 shrink-0" />
                            {item.location}
                        </p>

                        <p className="font-heading text-3xl font-extrabold">
                            {formatMoney(item.price)}{" "}
                            <span className="font-sans text-base font-normal text-fg-secondary">
                                / {item.rentalType}
                            </span>
                        </p>

                        <p
                            className={cn(
                                "text-sm font-semibold",
                                available ? "text-success" : "text-error"
                            )}
                        >
                            {available ? `${item.quantity} available` : "Currently unavailable"}
                        </p>

                        {isCustomer ? (
                            <div className="flex flex-col gap-3">
                                <BookNowModal
                                    equipment={{
                                        id: item._id,
                                        name: item.name,
                                        price: item.price,
                                        rentalType: item.rentalType,
                                        quantity: item.quantity,
                                    }}
                                />
                                <FavoriteButton
                                    equipmentId={item._id}
                                    initialFavorite={favoriteIds.includes(item._id)}
                                />
                            </div>
                        ) : (
                            <p className="rounded-lg border border-border bg-elevated p-3 text-sm text-fg-secondary">
                                Only customer accounts can book or save equipment.
                            </p>
                        )}
                    </div>

                    <div className="surface-card flex items-center gap-4 p-6">
                        <UserAvatar src={item.ownerImage} name={item.ownerName} className="size-12" />
                        <div className="min-w-0">
                            <p className="text-xs text-fg-muted">Listed by</p>
                            <p className="truncate font-semibold">{item.ownerName}</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}