import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function Logo({
    className,
    imageClassName,
    showName = false,
}: {
    className?: string
    /** Override the logo size, for example "h-9" in a tight spot. */
    imageClassName?: string
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
                className={cn(
                    "hidden h-11 w-auto object-contain select-none sm:h-12 dark:block",
                    imageClassName
                )}
            />
            <Image
                src="/images/logo-light-mode.png"
                alt=""
                aria-hidden
                width={240}
                height={60}
                priority
                unoptimized
                className={cn(
                    "block h-11 w-auto object-contain select-none sm:h-12 dark:hidden",
                    imageClassName
                )}
            />
            {showName ? (
                <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                    Equipora
                </span>
            ) : null}
        </Link>
    )
}