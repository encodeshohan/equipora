import Link from "next/link"
import { Eye, Pencil } from "lucide-react"

import { DeleteEquipmentButton } from "@/components/dashboard/delete-equipment-button"
import { EquipmentStatusActions } from "@/components/dashboard/equipment-status-actions"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { NativeSelect } from "@/components/shared/native-select"
import { Pagination } from "@/components/shared/pagination"
import { StatusPill } from "@/components/shared/status-pill"
import { getAdminEquipment } from "@/lib/api/admin"
import { formatMoney } from "@/lib/formatters"
import { firstParam, pageParam } from "@/lib/page-params"
import { STATUS_META } from "@/lib/types/equipment"

export const metadata = { title: "All Equipment" }

const STATUSES = ["pending", "approved", "rejected"]
const headClass =
    "px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-fg-secondary uppercase"
const cellClass = "px-4 py-3.5 align-middle whitespace-nowrap"
const actionClass =
    "inline-flex h-7 items-center gap-1 rounded-lg border border-border px-2.5 text-[0.8rem] font-medium transition-colors hover:bg-elevated"

export default async function AdminEquipmentPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const raw = await searchParams
    const statusRaw = firstParam(raw.status)
    const status = STATUSES.includes(statusRaw) ? statusRaw : ""
    const search = firstParam(raw.search).slice(0, 60)
    const current = pageParam(raw.page)

    const query = new URLSearchParams({ page: String(current), limit: "10" })
    if (status) query.set("status", status)
    if (search) query.set("search", search)

    const filterParams: Record<string, string> = {}
    if (status) filterParams.status = status
    if (search) filterParams.search = search

    const result = await getAdminEquipment(query.toString())

    return (
        <PageContainer>
            <PageHeader
                overline="Admin"
                title="All Equipment"
                subtitle="Approve or reject listings, edit details and remove equipment."
            />

            <form className="mb-4 flex flex-wrap items-end gap-3" role="search">
                <div className="flex min-w-56 flex-1 flex-col gap-2">
                    <label htmlFor="search" className="text-sm font-medium">
                        Search
                    </label>
                    <input
                        id="search"
                        name="search"
                        defaultValue={search}
                        maxLength={60}
                        placeholder="Search by name, category or owner"
                        className="surface-field h-11 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                    />
                </div>
                <div className="flex w-44 flex-col gap-2">
                    <label htmlFor="status" className="text-sm font-medium">
                        Status
                    </label>
                    <NativeSelect id="status" name="status" defaultValue={status}>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </NativeSelect>
                </div>
                <button type="submit" className="btn-brand h-11 px-6">
                    Filter
                </button>
                <Link
                    href="/dashboard/admin/equipment"
                    className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-elevated"
                >
                    Reset
                </Link>
            </form>

            <section className="surface-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[72rem] text-left text-sm">
                        <thead className="bg-elevated">
                            <tr>
                                <th scope="col" className={headClass}>Equipment</th>
                                <th scope="col" className={headClass}>Owner</th>
                                <th scope="col" className={headClass}>Category</th>
                                <th scope="col" className={headClass}>Price</th>
                                <th scope="col" className={headClass}>Qty</th>
                                <th scope="col" className={headClass}>Status</th>
                                <th scope="col" className={headClass}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.items.map((item) => (
                                <tr key={item._id} className="border-t border-border">
                                    <td className={cellClass}>
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="size-11 shrink-0 rounded-lg object-cover"
                                            />
                                            <span className="block max-w-48 truncate font-medium">
                                                {item.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={cellClass}>
                                        <p className="max-w-40 truncate font-medium">{item.ownerName}</p>
                                        <p className="max-w-40 truncate text-xs text-fg-secondary">
                                            {item.ownerEmail}
                                        </p>
                                    </td>
                                    <td className={`${cellClass} text-fg-secondary`}>{item.category}</td>
                                    <td className={`${cellClass} font-semibold`}>
                                        {formatMoney(item.price)}
                                        <span className="text-xs font-normal text-fg-secondary">
                                            {" "}
                                            / {item.rentalType}
                                        </span>
                                    </td>
                                    <td className={cellClass}>{item.quantity}</td>
                                    <td className={cellClass}>
                                        <StatusPill {...STATUS_META[item.status]} />
                                    </td>
                                    <td className={cellClass}>
                                        <div className="flex items-center gap-2">
                                            <EquipmentStatusActions
                                                id={item._id}
                                                name={item.name}
                                                status={item.status}
                                            />
                                            <Link
                                                href={`/dashboard/admin/equipment/${item._id}/edit`}
                                                className={actionClass}
                                            >
                                                <Pencil aria-hidden className="size-3.5" />
                                                Update
                                            </Link>
                                            <DeleteEquipmentButton id={item._id} name={item.name} />
                                            <Link href={`/equipment/${item._id}`} className={actionClass}>
                                                <Eye aria-hidden className="size-3.5" />
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {result.items.length === 0 ? (
                        <p className="p-10 text-center text-fg-secondary">No equipment found.</p>
                    ) : null}
                </div>
            </section>

            <Pagination
                basePath="/dashboard/admin/equipment"
                params={filterParams}
                page={result.page}
                totalPages={result.totalPages}
            />
        </PageContainer>
    )
}