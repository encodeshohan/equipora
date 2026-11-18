import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SITE } from "@/lib/site-config"

const CONTACTS = [
    { icon: Mail, label: "Email", value: SITE.email },
    { icon: Phone, label: "Phone", value: SITE.phone },
    { icon: MapPin, label: "Address", value: SITE.address },
]

export function ContactSection() {
    return (
        <section id="contact" className="site-container scroll-mt-20 pt-20">
            <Reveal>
                <div className="rounded-2xl bg-brand p-8 text-on-brand sm:p-12">
                    <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
                        Ready to rent or list equipment?
                    </h2>
                    <p className="mt-3 max-w-xl">
                        Create a free account in a minute. Questions first? Contact us.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/signup"
                            className="inline-flex h-11 items-center justify-center rounded-lg bg-on-brand px-6 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/equipment"
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-on-brand/40 px-6 text-sm font-semibold transition-colors hover:bg-on-brand/10"
                        >
                            Browse Equipment
                        </Link>
                    </div>

                    <ul className="mt-10 grid gap-4 border-t border-on-brand/20 pt-6 sm:grid-cols-3">
                        {CONTACTS.map(({ icon: Icon, label, value }) => (
                            <li key={label} className="flex items-center gap-3">
                                <Icon aria-hidden className="size-5 shrink-0" />
                                <span className="min-w-0 text-sm">
                                    <span className="block font-semibold">{label}</span>
                                    <span className="block truncate">{value}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Reveal>
        </section>
    )
}