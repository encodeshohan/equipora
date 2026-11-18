import { cn } from "@/lib/utils"

// Pass the className from a *_STATUS_META map (token colors only).
export function StatusPill({
    label,
    className,
}: {
    label: string
    className: string
}) {
    return (
        <span
            className={cn(
                "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium whitespace-nowrap",
                className
            )}
        >
            {label}
        </span>
    )
}