import Link from "next/link"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { RemoveFavoriteButton } from "@/components/dashboard/remove-favorite-button"
import { getFavorites } from "@/lib/api/favorites"
import { formatMoney } from "@/lib/formatters"
import { cn } from "@/lib/utils"

export const metadata = { title: "Favorites" }

const headClass =
    "px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-fg-secondary uppercase"
const cellClass = "px-4 py-3.5 align-middle whitespace-nowrap"

export default async function FavoritesPage() {
    const items = await getFavorites()

    return (
        <PageContainer>
            <PageHeader
                overline="Customer"
                title="Favorites"
                subtitle="Equipment you saved for later."
            />

            <section className="surface-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[48rem] text-left text-sm">
                        <thead className="bg-elevated">
                            <tr>
                                <th scope="col" className={headClass}>Equipment</th>
                                <th scope="col" className={headClass}>Category</th>
                                <th scope="col" className={headClass}>Price</th>
                                <th scope="col" className={headClass}>Location</th>
                                <th scope="col" className={headClass}>Availability</th>
                                <th scope="col" className={headClass}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id} className="border-t border-border">
                                    <td className={cellClass}>
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="size-11 shrink-0 rounded-lg object-cover"
                                            />
                                            <span className="block max-w-56 truncate font-medium">
                                                {item.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={cn(cellClass, "text-fg-secondary")}>{item.category}</td>
                                    <td className={`${cellClass} font-semibold`}>
                                        {formatMoney(item.price)}
                                        <span className="text-xs font-normal text-fg-secondary">
                                            {" "}
                                            / {item.rentalType}
                                        </span>
                                    </td>
                                    <td className={cn(cellClass, "text-fg-secondary")}>{item.location}</td>
                                    <td
                                        className={cn(
                                            cellClass,
                                            "font-medium",
                                            item.quantity > 0 ? "text-success" : "text-error"
                                        )}
                                    >
                                        {item.quantity > 0 ? `${item.quantity} available` : "Unavailable"}
                                    </td>
                                    <td className={cellClass}>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/equipment/${item._id}`}
                                                className="inline-flex h-7 items-center rounded-lg border border-border px-2.5 text-[0.8rem] font-medium transition-colors hover:bg-elevated"
                                            >
                                                View Details
                                            </Link>
                                            <RemoveFavoriteButton equipmentId={item._id} name={item.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 p-10 text-center">
                            <p className="text-fg-secondary">You have no favorites yet.</p>
                            <Link href="/equipment" className="btn-brand">
                                Browse equipment
                            </Link>
                        </div>
                    ) : null}
                </div>
            </section>
        </PageContainer>
    )
}