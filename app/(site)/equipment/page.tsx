import Link from "next/link"

import { EquipmentCard } from "@/components/equipment/equipment-card"
import { EquipmentFilters } from "@/components/equipment/equipment-filters"
import { Pagination } from "@/components/shared/pagination"
import { getEquipmentList } from "@/lib/api/equipment"
import { getSessionSafe } from "@/lib/core/server"
import {
    pickParams,
    toQueryString,
    type EquipmentSearchParams,
} from "@/lib/equipment-query"

export const metadata = { title: "All Equipment" }

export default async function EquipmentPage({
    searchParams,
}: {
    searchParams: Promise<EquipmentSearchParams>
}) {
    const params = pickParams(await searchParams)
    const filterParams = { ...params }
    delete filterParams.page

    const [session, result] = await Promise.all([
        getSessionSafe(),
        getEquipmentList(toQueryString({ ...params, limit: "9" })),
    ])

    return (
        <div className="site-container py-10">
            <div className="mb-8">
                <p className="overline-label">Marketplace</p>
                <h1 className="section-title mt-2">All Equipment</h1>
                <p className="mt-2 text-fg-secondary">
                    Search and filter approved equipment from verified owners.
                </p>
            </div>

            {/* key remounts the form when the URL changes (Reset, back button). */}
            <EquipmentFilters
                key={toQueryString(filterParams)}
                basePath="/equipment"
                initial={filterParams}
            />

            <p className="mt-8 mb-4 text-sm text-fg-secondary">
                Showing {result.items.length} of {result.total}{" "}
                {result.total === 1 ? "item" : "items"}
            </p>

            {result.items.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {result.items.map((item) => (
                        <EquipmentCard key={item._id} item={item} isLoggedIn={Boolean(session)} />
                    ))}
                </div>
            ) : (
                <div className="surface-card flex flex-col items-center gap-3 p-10 text-center">
                    <p className="text-fg-secondary">No equipment matches your filters.</p>
                    <Link href="/equipment" className="btn-brand">
                        Clear filters
                    </Link>
                </div>
            )}

            <Pagination
                basePath="/equipment"
                params={filterParams}
                page={result.page}
                totalPages={result.totalPages}
            />
        </div>
    )
}