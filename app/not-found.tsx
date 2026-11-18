import Link from "next/link"
import { SearchX } from "lucide-react"

export const metadata = { title: "Page not found" }

export default function NotFound() {
    return (
        <main className="site-container flex min-h-svh flex-col items-center justify-center gap-4 text-center">
            <span className="brand-chip flex size-12 items-center justify-center rounded-xl">
                <SearchX aria-hidden className="size-6" />
            </span>
            <h1 className="page-title">Page not found</h1>
            <p className="max-w-md text-fg-secondary">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link href="/" className="btn-brand">
                Back to home
            </Link>
        </main>
    )
}