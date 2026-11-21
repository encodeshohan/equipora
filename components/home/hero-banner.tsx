import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/shared/reveal"
import { HERO_IMAGE, SITE } from "@/lib/site-config"

export function HeroBanner() {
    return (
        <section className="relative isolate overflow-hidden border-b border-border">
            <Image
                src={HERO_IMAGE}
                alt=""
                fill
                priority
                quality={90}
                sizes="100vw"
                className="-z-20 object-cover object-center"
            />

            {/* Same dark scrim in both themes: the photo keeps its colors, the
                left side is dark enough for white text, the right side stays clear. */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/5"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
            />

            <div className="site-container py-20 sm:py-28 lg:py-36">
                <div className="max-w-2xl">
                    <Reveal>
                        <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                            Equipment rental marketplace
                        </span>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <h1 className="mt-5 font-heading text-4xl leading-[1.1] font-extrabold tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
                            {SITE.tagline}
                        </h1>
                    </Reveal>
                    <Reveal delay={0.16}>
                        <p className="mt-5 max-w-xl text-lg text-white/85">
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
                                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
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