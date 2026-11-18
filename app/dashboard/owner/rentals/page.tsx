import Link from "next/link"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { Pagination } from "@/components/shared/pagination"
import { StatusPill } from "@/components/shared/status-pill"
import { getOwnerBookings } from "@/lib/api/owner"
import { formatDate, formatMoney } from "@/lib/formatters"
import { BOOKING_STATUS_META, PAYMENT_STATUS_META } from "@/lib/types/booking"

export const metadata = { title: "My Equipment Rental" }

const headClass =
    "px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-fg-secondary uppercase"
const cellClass = "px-4 py-3.5 align-top"

export default async function OwnerRentalsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const { page } = await searchParams
    const parsed = Number.parseInt(typeof page === "string" ? page : "", 10)
    const current = Number.isFinite(parsed) && parsed > 0 ? parsed : 1

    const result = await getOwnerBookings(`page=${current}&limit=10`)

    return (
        <PageContainer>
            <PageHeader
                overline="Owner"
                title="My Equipment Rental"
                subtitle="Paid bookings for your equipment, with customer contact details."
            />

            <section className="surface-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[64rem] text-left text-sm">
                        <thead className="bg-elevated">
                            <tr>
                                <th scope="col" className={headClass}>Customer</th>
                                <th scope="col" className={headClass}>Equipment</th>
                                <th scope="col" className={headClass}>Duration</th>
                                <th scope="col" className={headClass}>Qty</th>
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
                                        <p className="text-xs text-fg-secondary">{booking.contactNumber}</p>
                                        <p
                                            title={booking.deliveryAddress}
                                            className="mt-1 max-w-52 truncate text-xs text-fg-muted"
                                        >
                                            {booking.deliveryAddress}
                                        </p>
                                    </td>
                                    <td className={cellClass}>
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={booking.equipmentImage}
                                                alt=""
                                                className="size-11 shrink-0 rounded-lg object-cover"
                                            />
                                            <Link
                                                href={`/equipment/${booking.equipmentId}`}
                                                className="block max-w-48 truncate font-medium hover:underline"
                                            >
                                                {booking.equipmentName}
                                            </Link>
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
                                    <td className={cellClass}>{booking.quantity}</td>
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
                        <p className="p-10 text-center text-fg-secondary">
                            No paid bookings for your equipment yet.
                        </p>
                    ) : null}
                </div>
            </section>

            <Pagination
                basePath="/dashboard/owner/rentals"
                params={{}}
                page={result.page}
                totalPages={result.totalPages}
            />
        </PageContainer>
    )
}