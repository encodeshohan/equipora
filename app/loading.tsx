import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div
            role="status"
            className="flex min-h-svh flex-col items-center justify-center gap-3 text-fg-secondary"
        >
            <Loader2 aria-hidden className="size-8 animate-spin text-foreground" />
            <p className="text-sm">Loading...</p>
        </div>
    )
}