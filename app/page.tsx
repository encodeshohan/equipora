import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const SWATCHES = [
  { name: "background", className: "bg-background" },
  { name: "surface", className: "bg-surface" },
  { name: "elevated", className: "bg-elevated" },
  { name: "brand", className: "bg-brand" },
  { name: "success", className: "bg-success" },
  { name: "warning", className: "bg-warning" },
  { name: "error", className: "bg-error" },
  { name: "info", className: "bg-info" },
]

export default function Page() {
  return (
    <main className="site-container py-10">
      <header className="flex items-center justify-between">
        <p className="font-heading text-xl font-bold">Equipora</p>
        <ThemeToggle />
      </header>

      <section className="mt-12 flex flex-col gap-3">
        <p className="overline-label">Design tokens</p>
        <h1 className="page-title">Rent smarter. Work better.</h1>
        <p className="max-w-xl text-fg-secondary">
          Headings use Plus Jakarta Sans, body text uses Inter. Press d or use
          the toggle to switch themes.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="outline">Secondary</Button>
          <button type="button" className="btn-brand">
            btn-brand
          </button>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SWATCHES.map(({ name, className }) => (
          <div key={name} className="surface-card p-3">
            <div className={`h-12 rounded-lg border border-border ${className}`} />
            <p className="mt-2 text-xs text-fg-secondary">{name}</p>
          </div>
        ))}
      </section>

      <section className="surface-card mt-12 p-6">
        <h2 className="font-heading text-lg font-semibold">Card and field</h2>
        <p className="mt-1 text-sm text-fg-secondary">
          Secondary text on a surface card.
        </p>
        <input
          className="surface-field mt-4 h-10 w-full rounded-lg border px-3 text-sm outline-none"
          placeholder="surface-field placeholder"
        />
      </section>
    </main>
  )
}