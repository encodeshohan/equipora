import { Reveal } from "@/components/shared/reveal"
import { cn } from "@/lib/utils"

// Same heading style on every public section.
export function SectionHeading({
    overline,
    title,
    description,
    className,
}: {
    overline: string
    title: string
    description?: string
    className?: string
}) {
    return (
        <Reveal className={cn("mx-auto mb-10 max-w-2xl text-center", className)}>
            <p className="overline-label">{overline}</p>
            <h2 className="section-title mt-2">{title}</h2>
            {description ? (
                <p className="mt-3 text-fg-secondary">{description}</p>
            ) : null}
        </Reveal>
    )
}