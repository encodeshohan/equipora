import Link from "next/link"

import { EquipmentCard } from "@/components/equipment/equipment-card"
import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import type { EquipmentItem } from "@/lib/types/equipment"

export function FeaturedSection({
    items,
    isLoggedIn,
}: {
    items: EquipmentItem[]
    isLoggedIn: boolean
}) {
    return (
        <section className="site-container pt-20">
            <SectionHeading
                overline="Featured"
                title="Featured Equipment"
                description="Fresh, approved listings from verified owners."
            />

            {items.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <Reveal key={item._id} delay={(index % 3) * 0.08} className="h-full">
                            <EquipmentCard item={item} isLoggedIn={isLoggedIn} />
                        </Reveal>
                    ))}
                </div>
            ) : (
                <p className="surface-card p-10 text-center text-fg-secondary">
                    No equipment is listed yet. Check back soon.
                </p>
            )}

            <Reveal className="mt-10 text-center">
                <Link href="/equipment" className="btn-brand h-11 px-6">
                    View All Equipment
                </Link>
            </Reveal>
        </section>
    )
}