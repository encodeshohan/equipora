"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Page error:", error.message)
    }, [error])

    return (
        <main className="site-container flex min-h-svh flex-col items-center justify-center gap-4 text-center">
            <span className="brand-chip flex size-12 items-center justify-center rounded-xl">
                <TriangleAlert aria-hidden className="size-6" />
            </span>
            <h1 className="page-title">Something went wrong</h1>
            <p className="max-w-md text-fg-secondary">
                An unexpected error occurred. You can try again or go back home.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" className="h-10 px-5" onClick={() => reset()}>
                    Try again
                </Button>
                <Link href="/" className="btn-brand">
                    Back to home
                </Link>
            </div>
        </main>
    )
}