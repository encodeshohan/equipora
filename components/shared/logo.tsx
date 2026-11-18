import Link from "next/link"

import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
    return (
        <Link
            href="/"
            aria-label="Equipora home"
            className={cn("inline-flex items-center gap-2", className)}
        >
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand font-heading text-base font-extrabold text-on-brand">
                E
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                Equipora
            </span>
        </Link>
    )
}