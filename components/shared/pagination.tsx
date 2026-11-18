import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const itemClass =
    "flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-3 text-sm transition-colors"

export function Pagination({
    basePath,
    params,
    page,
    totalPages,
}: {
    basePath: string
    /** Current filters, without `page`. */
    params: Record<string, string>
    page: number
    totalPages: number
}) {
    if (totalPages <= 1) return null

    const hrefFor = (target: number) => {
        const search = new URLSearchParams(params)
        search.delete("page")
        if (target > 1) search.set("page", String(target))
        const query = search.toString()
        return query ? `${basePath}?${query}` : basePath
    }

    const end = Math.min(totalPages, Math.max(1, page - 2) + 4)
    const start = Math.max(1, end - 4)
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    return (
        <nav aria-label="Pagination" className="mt-10 flex flex-wrap justify-center gap-2">
            {page > 1 ? (
                <Link href={hrefFor(page - 1)} className={cn(itemClass, "hover:bg-elevated")}>
                    <ChevronLeft aria-hidden className="size-4" />
                    Prev
                </Link>
            ) : (
                <span className={cn(itemClass, "pointer-events-none opacity-50")}>
                    <ChevronLeft aria-hidden className="size-4" />
                    Prev
                </span>
            )}

            {pages.map((item) => (
                <Link
                    key={item}
                    href={hrefFor(item)}
                    aria-current={item === page ? "page" : undefined}
                    className={cn(
                        itemClass,
                        item === page ? "border-brand bg-brand text-on-brand" : "hover:bg-elevated"
                    )}
                >
                    {item}
                </Link>
            ))}

            {page < totalPages ? (
                <Link href={hrefFor(page + 1)} className={cn(itemClass, "hover:bg-elevated")}>
                    Next
                    <ChevronRight aria-hidden className="size-4" />
                </Link>
            ) : (
                <span className={cn(itemClass, "pointer-events-none opacity-50")}>
                    Next
                    <ChevronRight aria-hidden className="size-4" />
                </span>
            )}
        </nav>
    )
}