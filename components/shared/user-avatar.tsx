import { cn } from "@/lib/utils"

// Profile image when set, otherwise the first letter of the name. A plain
// <img> on purpose: images are user-supplied URLs from any host.
export function UserAvatar({
    src,
    name,
    className,
}: {
    src?: string | null
    name?: string | null
    className?: string
}) {
    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={name ? `${name}'s avatar` : "Profile picture"}
                className={cn("size-9 shrink-0 rounded-full object-cover", className)}
            />
        )
    }

    return (
        <span
            aria-hidden
            className={cn(
                "brand-chip flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                className
            )}
        >
            {(name?.trim().charAt(0) || "U").toUpperCase()}
        </span>
    )
}