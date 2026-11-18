import { cn } from "@/lib/utils"

// Full-width dashboard content area.
export function PageContainer({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("w-full px-4 py-8 sm:px-6 lg:px-8", className)}>
            {children}
        </div>
    )
}

export function PageHeader({
    overline,
    title,
    subtitle,
    action,
}: {
    overline?: string
    title: string
    subtitle: string
    action?: React.ReactNode
}) {
    return (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
                {overline ? <p className="overline-label">{overline}</p> : null}
                <h1 className="page-title">{title}</h1>
                <p className="text-sm text-fg-secondary">{subtitle}</p>
            </div>
            {action}
        </header>
    )
}

export function StatCard({
    label,
    value,
    icon,
}: {
    label: string
    value: string
    icon: React.ReactNode
}) {
    return (
        <div className="surface-card flex items-center gap-4 p-5">
            <span className="brand-chip flex size-11 shrink-0 items-center justify-center rounded-xl">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-sm text-fg-secondary">{label}</p>
                <p className="font-heading text-2xl font-bold">{value}</p>
            </div>
        </div>
    )
}