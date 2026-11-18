import type { ReactNode } from "react"

import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/theme-toggle"

// Shared shell for the signin / signup pages.
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col">
            <header className="site-container flex h-16 items-center justify-between">
                <Logo />
                <ThemeToggle />
            </header>
            <main className="site-container flex flex-1 items-start justify-center pt-4 pb-12 sm:items-center">
                <div className="w-full max-w-md">{children}</div>
            </main>
        </div>
    )
}