import Link from "next/link"
import {
    Camera,
    Cpu,
    HardHat,
    Package,
    PartyPopper,
    Tractor,
    Truck,
    type LucideIcon,
} from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import type { CategorySummary } from "@/lib/types/equipment"

const ICONS: Record<string, LucideIcon> = {
    "construction-equipment": HardHat,
    "photography-equipment": Camera,
    "vehicles-transportation": Truck,
    "agriculture-equipment": Tractor,
    electronics: Cpu,
    "event-equipment": PartyPopper,
}

export function CategoriesSection({
    categories,
}: {
    categories: CategorySummary[]
}) {
    return (
        <section className="site-container pt-20">
            <SectionHeading
                overline="Categories"
                title="Popular Categories"
                description="Whatever the job, start from the kind of equipment you need."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => {
                    const Icon = ICONS[category.slug] ?? Package
                    return (
                        <Reveal key={category.slug} delay={index * 0.05} className="h-full">
                            <Link
                                href={`/category/${category.slug}`}
                                className="surface-card flex h-full items-center gap-4 p-5 transition-colors hover:border-ring"
                            >
                                <span className="brand-chip flex size-12 shrink-0 items-center justify-center rounded-xl">
                                    <Icon aria-hidden className="size-6" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate font-heading font-semibold">
                                        {category.name}
                                    </span>
                                    <span className="text-sm text-fg-secondary">
                                        {category.count} {category.count === 1 ? "item" : "items"}
                                    </span>
                                </span>
                            </Link>
                        </Reveal>
                    )
                })}
            </div>
        </section>
    )
}