import Link from "next/link"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { NativeSelect } from "@/components/shared/native-select"
import { Pagination } from "@/components/shared/pagination"
import { StatusPill } from "@/components/shared/status-pill"
import { getAdminBookings } from "@/lib/api/admin"
import { formatDate, formatMoney } from "@/lib/formatters"
import { firstParam, pageParam } from "@/lib/page-params"
import { BOOKING_STATUS_META, PAYMENT_STATUS_META } from "@/lib/types/booking"

export const metadata = { title: "All Rentals" }

const PAYMENTS = ["paid", "unpaid"]
const STATUSES = ["pending", "confirmed", "completed", "cancelled"]
const headClass =
    "px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-fg-secondary uppercase"
const cellClass = "px-4 py-3.5 align-top"

export default async function AdminRentalsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const raw = await searchParams
    const paymentRaw = firstParam(raw.paymentStatus)
    const payment = PAYMENTS.includes(paymentRaw) ? paymentRaw : ""
    const statusRaw = firstParam(raw.bookingStatus)
    const status = STATUSES.includes(statusRaw) ? statusRaw : ""
    const current = pageParam(raw.page)

    const query = new URLSearchParams({ page: String(current), limit: "10" })
    if (payment) query.set("paymentStatus", payment)
    if (status) query.set("bookingStatus", status)

    const filterParams: Record<string, string> = {}
    if (payment) filterParams.paymentStatus = payment
    if (status) filterParams.bookingStatus = status

    const result = await getAdminBookings(query.toString())

    return (
        <PageContainer>
            <PageHeader
                overline="Admin"
                title="All Rentals"
                subtitle="Every booking on the platform, with payment and booking status."
            />

            <form className="mb-4 flex flex-wrap items-end gap-3">
                <div className="flex w-44 flex-col gap-2">
                    <label htmlFor="paymentStatus" className="text-sm font-medium">
                        Payment
                    </label>
                    <NativeSelect id="paymentStatus" name="paymentStatus" defaultValue={payment}>
                        <option value="">All</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </NativeSelect>
                </div>
                <div className="flex w-44 flex-col gap-2">
                    <label htmlFor="bookingStatus" className="text-sm font-medium">
                        Status
                    </label>
                    <NativeSelect id="bookingStatus" name="bookingStatus" defaultValue={status}>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </NativeSelect>
                </div>
                <button type="submit" className="btn-brand h-11 px-6">
                    Filter
                </button>
                <Link
                    href="/dashboard/admin/rentals"
                    className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-elevated"
                >
                    Reset
                </Link>
            </form>

            <section className="surface-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[64rem] text-left text-sm">
                        <thead className="bg-elevated">
                            <tr>
                                <th scope="col" className={headClass}>Customer</th>
                                <th scope="col" className={headClass}>Owner</th>
                                <th scope="col" className={headClass}>Equipment</th>
                                <th scope="col" className={headClass}>Duration</th>
                                <th scope="col" className={headClass}>Amount</th>
                                <th scope="col" className={headClass}>Payment</th>
                                <th scope="col" className={headClass}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.items.map((booking) => (
                                <tr key={booking._id} className="border-t border-border">
                                    <td className={cellClass}>
                                        <p className="font-medium">{booking.customerName}</p>
                                        <p className="text-xs text-fg-secondary">{booking.customerEmail}</p>
                                    </td>
                                    <td className={`${cellClass} font-medium`}>{booking.ownerName}</td>
                                    <td className={cellClass}>
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={booking.equipmentImage}
                                                alt=""
                                                className="size-11 shrink-0 rounded-lg object-cover"
                                            />
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/equipment/${booking.equipmentId}`}
                                                    className="block max-w-48 truncate font-medium hover:underline"
                                                >
                                                    {booking.equipmentName}
                                                </Link>
                                                <p className="text-xs text-fg-secondary">
                                                    Qty {booking.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`${cellClass} whitespace-nowrap`}>
                                        <p>
                                            {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                                        </p>
                                        <p className="text-xs text-fg-secondary">
                                            {booking.days} {booking.days === 1 ? "day" : "days"}
                                        </p>
                                    </td>
                                    <td className={`${cellClass} font-semibold whitespace-nowrap`}>
                                        {formatMoney(booking.total)}
                                    </td>
                                    <td className={cellClass}>
                                        <StatusPill {...PAYMENT_STATUS_META[booking.paymentStatus]} />
                                    </td>
                                    <td className={cellClass}>
                                        <StatusPill {...BOOKING_STATUS_META[booking.bookingStatus]} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {result.items.length === 0 ? (
                        <p className="p-10 text-center text-fg-secondary">No rentals found.</p>
                    ) : null}
                </div>
            </section>

            <Pagination
                basePath="/dashboard/admin/rentals"
                params={filterParams}
                page={result.page}
                totalPages={result.totalPages}
            />
        </PageContainer>
    )
}