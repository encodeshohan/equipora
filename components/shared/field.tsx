// Labeled field wrapper: label + control + optional hint.
import { Label } from "@/components/ui/label"

export function Field({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string
    htmlFor: string
    /** Small helper text shown under the control. */
    hint?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint ? <p className="text-xs text-fg-muted">{hint}</p> : null}
        </div>
    )
}