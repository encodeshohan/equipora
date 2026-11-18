import Link from "next/link"

import { Reveal } from "@/components/shared/reveal"
import { buttonVariants } from "@/components/ui/button"
import { HERO_IMAGE, SITE } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export function HeroBanner() {
    return (
        <section className="relative isolate overflow-hidden border-b border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={HERO_IMAGE}
                alt=""
                aria-hidden
                fetchPriority="high"
                className="absolute inset-0 -z-20 size-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-background/80" />

            <div className="site-container py-20 sm:py-28 lg:py-36">
                <div className="max-w-2xl">
                    <Reveal>
                        <span className="brand-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                            Equipment rental marketplace
                        </span>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <h1 className="mt-5 font-heading text-4xl leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
                            {SITE.tagline}
                        </h1>
                    </Reveal>
                    <Reveal delay={0.16}>
                        <p className="mt-5 max-w-xl text-lg text-fg-secondary">
                            Find verified construction, photography, farming and event
                            equipment near you. Book for the days you need and pay securely.
                        </p>
                    </Reveal>
                    <Reveal delay={0.24}>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/equipment" className="btn-brand h-11 px-6">
                                Browse Equipment
                            </Link>
                            <Link
                                href="/signup"
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "h-11 px-6 text-sm"
                                )}
                            >
                                List Your Equipment
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}