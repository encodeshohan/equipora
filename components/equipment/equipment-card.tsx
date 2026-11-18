import Link from "next/link"
import { MapPin } from "lucide-react"

import { formatMoney } from "@/lib/formatters"
import type { EquipmentItem } from "@/lib/types/equipment"
import { cn } from "@/lib/utils"

export function EquipmentCard({
    item,
    isLoggedIn,
}: {
    item: EquipmentItem
    isLoggedIn: boolean
}) {
    const detailsPath = `/equipment/${item._id}`
    // Logged out: View Details goes to login, then returns to the item.
    const href = isLoggedIn
        ? detailsPath
        : `/signin?redirectTo=${encodeURIComponent(detailsPath)}`
    const available = item.quantity > 0

    return (
        <article className="surface-card flex h-full flex-col overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="size-full object-cover"
                />
                <span
                    className={cn(
                        "absolute top-3 left-3 rounded-full border border-border bg-background/85 px-2.5 py-1 text-xs font-semibold backdrop-blur",
                        available ? "text-success" : "text-error"
                    )}
                >
                    {available ? `${item.quantity} available` : "Unavailable"}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="overline-label truncate">{item.category}</p>
                <h3 className="line-clamp-2 min-h-[3rem] font-heading text-lg leading-snug font-semibold">
                    {item.name}
                </h3>
                <p className="flex items-center gap-1.5 text-sm text-fg-secondary">
                    <MapPin aria-hidden className="size-4 shrink-0" />
                    <span className="truncate">{item.location}</span>
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                    <p className="font-heading text-lg font-bold">
                        {formatMoney(item.price)}{" "}
                        <span className="font-sans text-sm font-normal text-fg-secondary">
                            / {item.rentalType}
                        </span>
                    </p>
                    <Link href={href} className="btn-brand h-9 shrink-0 px-4">
                        View Details
                    </Link>
                </div>
            </div>
        </article>
    )
}