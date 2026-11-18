import { CalendarDays, CreditCard, PackageCheck, Search } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"

const STEPS = [
    {
        icon: Search,
        title: "Find equipment",
        text: "Search by name or location and filter by category and price.",
    },
    {
        icon: CalendarDays,
        title: "Pick your dates",
        text: "Choose the rental period and quantity. We check availability.",
    },
    {
        icon: CreditCard,
        title: "Pay securely",
        text: "Confirm your booking with Stripe Checkout.",
    },
    {
        icon: PackageCheck,
        title: "Pick up and work",
        text: "Collect from the owner, do the job and return on time.",
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="site-container scroll-mt-20 pt-20">
            <SectionHeading
                overline="Simple process"
                title="How It Works"
                description="From search to pickup in four steps."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map(({ icon: Icon, title, text }, index) => (
                    <Reveal key={title} delay={index * 0.06} className="h-full">
                        <div className="surface-card relative flex h-full flex-col gap-3 p-6">
                            <span className="font-heading text-sm font-bold text-fg-muted">
                                0{index + 1}
                            </span>
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