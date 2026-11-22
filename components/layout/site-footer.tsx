import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Logo } from "@/components/shared/logo"
import {
    FacebookIcon,
    InstagramIcon,
    RedditIcon,
    XIcon,
} from "@/components/shared/social-icons"
import { NAV_LINKS, SITE } from "@/lib/site-config"
import { EQUIPMENT_CATEGORIES } from "@/lib/types/equipment"

const linkClass = "text-sm text-fg-secondary transition-colors hover:text-foreground"

const socialClass =
    "flex size-9 items-center justify-center rounded-lg border border-border text-fg-secondary transition-colors hover:text-foreground"

// Replace the Instagram, Facebook and Reddit links with your own pages.
const SOCIAL_LINKS = [
    { label: "Equipora on X", href: SITE.xUrl, icon: XIcon },
    { label: "Equipora on Instagram", href: "https://www.instagram.com/", icon: InstagramIcon },
    { label: "Equipora on Facebook", href: "https://www.facebook.com/", icon: FacebookIcon },
    { label: "Equipora on Reddit", href: "https://www.reddit.com/", icon: RedditIcon },
]

export function SiteFooter() {
    return (
        <footer className="mt-20 border-t border-border bg-surface">
            <div className="site-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-4">
                    <Logo />
                    <p className="max-w-xs text-sm text-fg-secondary">
                        {SITE.tagline} List equipment, browse, book and pay securely.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className={socialClass}
                            >
                                <Icon className="size-4" />
                            </a>
                        ))}
                        <a
                            href={`mailto:${SITE.email}`}
                            aria-label="Email Equipora"
                            className={socialClass}
                        >
                            <Mail aria-hidden className="size-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h2 className="font-heading text-base font-semibold">Quick Links</h2>
                    <ul className="mt-4 flex flex-col gap-2.5">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={linkClass}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="font-heading text-base font-semibold">Our Services</h2>
                    <ul className="mt-4 flex flex-col gap-2.5">
                        {EQUIPMENT_CATEGORIES.map((category) => (
                            <li key={category.slug}>
                                <Link href={`/category/${category.slug}`} className={linkClass}>
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="font-heading text-base font-semibold">Contact</h2>
                    <ul className="mt-4 flex flex-col gap-3 text-sm text-fg-secondary">
                        <li className="flex items-center gap-2">
                            <Mail aria-hidden className="size-4 shrink-0" />
                            {SITE.email}
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone aria-hidden className="size-4 shrink-0" />
                            {SITE.phone}
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin aria-hidden className="size-4 shrink-0" />
                            {SITE.address}
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-border">
                <p className="site-container py-5 text-center text-sm text-fg-muted">
                    © {new Date().getFullYear()} {SITE.name}. All rights reserved.
                </p>
            </div>
        </footer>
    )
}