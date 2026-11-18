import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { CircleAlert, CircleCheck } from "lucide-react"

import { verifyCheckout } from "@/lib/api/payments"
import { getSessionSafe } from "@/lib/core/server"
import { formatDate, formatMoney } from "@/lib/formatters"
import { UNIT_LABEL } from "@/lib/booking"

export const metadata = { title: "Payment" }

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 py-2.5">
    <dt className="shrink-0 text-sm text-fg-secondary">{label}</dt>
    <dd className="min-w-0 text-right text-sm font-medium break-words">{value}</dd>
  </div>
)

function Notice({
  title,
  text,
  href,
  action,
}: {
  title: string
  text: string
  href: string
  action: string
}) {
  return (
    <div className="site-container flex min-h-[60svh] flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="brand-chip flex size-12 items-center justify-center rounded-xl">
        <CircleAlert aria-hidden className="size-6" />
      </span>
      <h1 className="page-title">{title}</h1>
      <p className="max-w-md text-fg-secondary">{text}</p>
      <Link href={href} className="btn-brand">
        {action}
      </Link>
    </div>
  )
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const sessionId = typeof session_id === "string" ? session_id : ""
  if (!sessionId) notFound()

  const session = await getSessionSafe()
  if (!session) {
    redirect(
      `/signin?redirectTo=${encodeURIComponent(`/checkout/success?session_id=${sessionId}`)}`
    )
  }

  // The server re-checks the Stripe session; reloading this page is safe.
  const { status, body } = await verifyCheckout(sessionId)

  if (status === 400 || status === 404) {
    return (
      <Notice
        title="Payment not found"
        text="We could not find a payment for this link."
        href="/equipment"
        action="Browse equipment"
      />
    )
  }
  if (status !== 200 || !body) {
    throw new Error(`Payment verification failed (${status})`)
  }

  if (!body.success || !body.booking) {
    return (
      <Notice
        title="Payment not completed"
        text={body.message || "Your payment has not been completed, so the booking is not confirmed."}
        href="/equipment"
        action="Browse equipment"
      />
    )
  }

  const booking = body.booking
  const unit = UNIT_LABEL[booking.rentalType]

  return (
    <div className="site-container flex justify-center py-16">
      <section className="surface-card w-full max-w-lg p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CircleCheck aria-hidden className="size-8" />
        </span>
        <h1 className="page-title mt-5">Booking confirmed</h1>
        <p className="mt-2 text-fg-secondary">
          Your payment was received. The owner will prepare your equipment.
        </p>

        <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-elevated px-4 text-left">
          <Row label="Equipment" value={booking.equipmentName} />
          <Row
            label="Rental period"
            value={`${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}`}
          />
          <Row
            label="Quantity"
            value={`${booking.quantity} × ${booking.units} ${unit}${booking.units === 1 ? "" : "s"}`}
          />
          <Row label="Amount paid" value={formatMoney(booking.total)} />
          <Row label="Payment status" value="Paid" />
          <Row label="Transaction ID" value={body.transactionId ?? "-"} />
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/customer/rentals" className="btn-brand">
            Go to My Rentals
          </Link>
          <Link
            href="/equipment"
            className="inline-flex h-10 items-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-elevated"
          >
            Browse more
          </Link>
        </div>
      </section>
    </div>
  )
}