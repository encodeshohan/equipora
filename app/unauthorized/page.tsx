import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = { title: "Unauthorized" }

export default function UnauthorizedPage() {
    return (
        <main className="site-container flex min-h-svh flex-col items-center justify-center gap-4 text-center">
            <span className="brand-chip flex size-12 items-center justify-center rounded-xl">
                <ShieldAlert aria-hidden className="size-6" />
            </span>
            <h1 className="page-title">Unauthorized</h1>
            <p className="max-w-md text-fg-secondary">
                You do not have permission to view this page.
            </p>
            <Link href="/" className={cn(buttonVariants(), "btn-brand")}>
                Back to home
            </Link>
        </main>
    )
}