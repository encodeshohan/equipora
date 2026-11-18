import type { ReactNode } from "react"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavbar } from "@/components/layout/site-navbar"

// Header, dynamic content, Footer.
export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col">
            <SiteNavbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    )
}