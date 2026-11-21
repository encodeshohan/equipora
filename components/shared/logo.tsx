import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function Logo({
    className,
    showName = false,
}: {
    className?: string
    showName?: boolean
}) {
    return (
        <Link
            href="/"
            aria-label="Equipora home"
            className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
        >
            <Image
                src="/images/logo-dark-mode.png"
                alt={showName ? "" : "Equipora"}
                width={240}
                height={60}
                priority
                unoptimized
                className="hidden h-9 w-auto object-contain select-none dark:block"
            />
            <Image
                src="/images/logo-light-mode.png"
                alt=""
                aria-hidden
                width={240}
                height={60}
                priority
                unoptimized
                className="block h-9 w-auto object-contain select-none dark:hidden"
            />
            {showName ? (
                <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                    Equipora
                </span>
            ) : null}
        </Link>
    )
}