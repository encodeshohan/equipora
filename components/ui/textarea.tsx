import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "surface-field min-h-20 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
}

export { Textarea }