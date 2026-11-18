import { CalendarClock, Lock, ShieldCheck, Wallet } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"

const REASONS = [
    {
        icon: Wallet,
        title: "Affordable Prices",
        text: "Rent only for the days you need instead of paying to own.",
    },
    {
        icon: ShieldCheck,
        title: "Verified Owners",
        text: "Every listing is reviewed and approved before it goes live.",
    },
    {
        icon: CalendarClock,
        title: "Flexible Periods",
        text: "Daily, weekly or monthly rentals to fit your project.",
    },
    {
        icon: Lock,
        title: "Secure Payments",
        text: "Pay through Stripe Checkout. Your card details never touch us.",
    },
]

export function WhyChooseUs() {
    return (
        <section className="site-container pt-20">
            <SectionHeading overline="Why Equipora" title="Why Choose Us" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {REASONS.map(({ icon: Icon, title, text }, index) => (
                    <Reveal key={title} delay={index * 0.06} className="h-full">
                        <div className="surface-card flex h-full flex-col gap-3 p-6">
                            <span className="brand-chip flex size-11 items-center justify-center rounded-xl">
                                <Icon aria-hidden className="size-5" />
                            </span>
                            <h3 className="font-heading text-lg font-semibold">{title}</h3>
                            <p className="text-sm text-fg-secondary">{text}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    )
}