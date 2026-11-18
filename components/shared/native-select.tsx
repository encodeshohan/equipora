import * as React from "react"

import { cn } from "@/lib/utils"

// Native select styled with tokens. `*:` colors the <option> list in dark mode.
export function NativeSelect({
    className,
    ...props
}: React.ComponentProps<"select">) {
    return (
        <select
            className={cn(
                "surface-field h-11 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 *:bg-surface *:text-foreground",
                className
            )}
            {...props}
        />
    )
}