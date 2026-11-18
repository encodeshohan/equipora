import Link from "next/link"

import { CheckPaymentButton } from "@/components/dashboard/check-payment-button"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { Pagination } from "@/components/shared/pagination"
import { StatusPill } from "@/components/shared/status-pill"
import { getMyBookings } from "@/lib/api/bookings"
import { formatDate, formatMoney } from "@/lib/formatters"
import { BOOKING_STATUS_META, PAYMENT_STATUS_META } from "@/lib/types/booking"

export const metadata = { title: "My Rentals" }

const headClass =
    "px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-fg-secondary uppercase"
const cellClass = "px-4 py-3.5 align-middle whitespace-nowrap"

export default async function MyRentalsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const { page } = await searchParams
    const parsed = Number.parseInt(typeof page === "string" ? page : "", 10)
    const current = Number.isFinite(parsed) && parsed > 0 ? parsed : 1

    const result = await getMyBookings(`page=${current}&limit=10`)

    return (
        <PageContainer>
            <PageHeader
                overline="Customer"
                title="My Rentals"
                subtitle="Your bookings, rental periods and payment status."
            />

            <section className="surface-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[56rem] text-left text-sm">
                        <thead className="bg-elevated">
                            <tr>
                                <th scope="col" className={headClass}>Equipment</th>
                                <th scope="col" className={headClass}>Start</th>
                                <th scope="col" className={headClass}>End</th>
                                <th scope="col" className={headClass}>Booked on</th>
                                <th scope="col" className={headClass}>Total</th>
                                <th scope="col" className={headClass}>Payment</th>
                                <th scope="col" className={headClass}>Status</th>
                                <th scope="col" className={headClass}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.items.map((booking) => (
                                <tr key={booking._id} className="border-t border-border">
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
                                                    className="block max-w-56 truncate font-medium hover:underline"
                                                >
                                                    {booking.equipmentName}
                                                </Link>
                                                <p className="text-xs text-fg-secondary">
                                                    Qty {booking.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={cellClass}>{formatDate(booking.startDate)}</td>
                                    <td className={cellClass}>{formatDate(booking.endDate)}</td>
                                    <td className={cellClass}>{formatDate(booking.createdAt)}</td>
                                    <td className={`${cellClass} font-semibold`}>
                                        {formatMoney(booking.total)}
                                    </td>
                                    <td className={cellClass}>
                                        <StatusPill {...PAYMENT_STATUS_META[booking.paymentStatus]} />
                                    </td>
                                    <td className={cellClass}>
                                        <StatusPill {...BOOKING_STATUS_META[booking.bookingStatus]} />
                                    </td>
                                    <td className={cellClass}>
                                        {booking.paymentStatus === "unpaid" && booking.stripeSessionId ? (
                                            <CheckPaymentButton sessionId={booking.stripeSessionId} />
                                        ) : (
                                            <span className="text-fg-muted">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {result.items.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 p-10 text-center">
                            <p className="text-fg-secondary">You have no rentals yet.</p>
                            <Link href="/equipment" className="btn-brand">
                                Browse equipment
                            </Link>
                        </div>
                    ) : null}
                </div>
            </section>

            <p className="mt-4 text-xs text-fg-muted">
                Paid on Stripe but still unpaid here? Press Check payment on that row.
            </p>

            <Pagination
                basePath="/dashboard/customer/rentals"
                params={{}}
                page={result.page}
                totalPages={result.totalPages}
            />
        </PageContainer>
    )
}