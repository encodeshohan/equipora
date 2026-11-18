import { BadgeCheck } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"

const POINTS = [
    "Every listing is reviewed by an admin before it appears.",
    "Owners manage their own equipment, prices and availability.",
    "Bookings are confirmed only after a verified Stripe payment.",
]

export function AboutSection({ listedCount }: { listedCount: number }) {
    return (
        <section id="about" className="site-container scroll-mt-20 pt-20">
            <div className="grid items-center gap-8 lg:grid-cols-2">
                <Reveal>
                    <p className="overline-label">About Us</p>
                    <h2 className="section-title mt-2">Built on trusted owners</h2>
                    <p className="mt-3 text-fg-secondary">
                        Equipora connects people who own equipment with people who need it
                        for a day, a week or a month. We keep the marketplace reliable so
                        both sides can focus on the work.
                    </p>
                    <ul className="mt-6 flex flex-col gap-3">
                        {POINTS.map((point) => (
                            <li key={point} className="flex items-start gap-3 text-sm">
                                <BadgeCheck
                                    aria-hidden
                                    className="mt-0.5 size-5 shrink-0 text-success"
                                />
                                <span className="text-fg-secondary">{point}</span>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="surface-card flex flex-col items-center gap-2 p-10 text-center">
                        <p className="font-heading text-5xl font-extrabold">{listedCount}</p>
                        <p className="text-fg-secondary">approved items ready to rent</p>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}