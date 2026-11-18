import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

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
import { EQUIPMENT_CATEGORIES } from "@/lib/types/equipment"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const category = EQUIPMENT_CATEGORIES.find((item) => item.slug === slug)
    return { title: category?.name ?? "Category" }
}

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<EquipmentSearchParams>
}) {
    const { slug } = await params
    const category = EQUIPMENT_CATEGORIES.find((item) => item.slug === slug)
    if (!category) notFound()

    // The category comes from the path, never from the query string.
    const picked = pickParams(await searchParams)
    delete picked.category
    const filterParams = { ...picked }
    delete filterParams.page

    const basePath = `/category/${category.slug}`

    const [session, result] = await Promise.all([
        getSessionSafe(),
        getEquipmentList(
            toQueryString({ ...picked, category: category.slug, limit: "9" })
        ),
    ])

    return (
        <div className="site-container py-10">
            <div className="mb-8">
                <p className="overline-label">Category</p>
                <h1 className="section-title mt-2">{category.name}</h1>
                <p className="mt-2 text-fg-secondary">
                    Approved listings in {category.name.toLowerCase()}.
                </p>
            </div>

            <EquipmentFilters
                key={toQueryString(filterParams)}
                basePath={basePath}
                initial={filterParams}
                hideCategory
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
                    <p className="text-fg-secondary">No equipment found in this category.</p>
                    <Link href="/equipment" className="btn-brand">
                        Browse all equipment
                    </Link>
                </div>
            )}

            <Pagination
                basePath={basePath}
                params={filterParams}
                page={result.page}
                totalPages={result.totalPages}
            />
        </div>
    )
}