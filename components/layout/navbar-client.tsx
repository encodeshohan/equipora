"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { Logo } from "@/components/shared/logo"
import { UserAvatar } from "@/components/shared/user-avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { NAV_LINKS } from "@/lib/site-config"
import { ROLE_META, type UserRole } from "@/lib/types/user"
import { cn } from "@/lib/utils"

export type NavbarUser = {
    name: string
    image: string | null
    role: UserRole
} | null

export function NavbarClient({ user }: { user: NavbarUser }) {
    const pathname = usePathname()
    const [open, setOpen] = React.useState(false)

    const links = user
        ? [
            ...NAV_LINKS,
            { label: "Dashboard", href: ROLE_META[user.role].dashboardPath },
        ]
        : NAV_LINKS

    React.useEffect(() => {
        if (!open) return

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false)
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [open])

    const linkClass = (href: string) =>
        cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
            pathname === href ? "text-foreground" : "text-fg-secondary"
        )

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
            <div className="site-container flex h-16 items-center justify-between gap-4">
                <Logo />

                <nav aria-label="Main navigation" className="hidden lg:block">
                    <ul className="flex items-center gap-1">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    aria-current={pathname === link.href ? "page" : undefined}
                                    className={linkClass(link.href)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <div className="hidden items-center gap-2 lg:flex">
                        {user ? (
                            <>
                                <UserAvatar src={user.image} name={user.name} />
                                <SignOutButton />
                            </>
                        ) : (
                            <>
                                <Link href="/signin" className={linkClass("/signin")}>
                                    Login
                                </Link>
                                <Link href="/signup" className="btn-brand">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="lg:hidden"
                        aria-expanded={open}
                        aria-controls="site-navbar-mobile"
                        aria-label={open ? "Close menu" : "Open menu"}
                        onClick={() => setOpen((value) => !value)}
                    >
                        {open ? <X aria-hidden /> : <Menu aria-hidden />}
                    </Button>
                </div>
            </div>

            {open ? (
                <div
                    id="site-navbar-mobile"
                    className="border-t border-border bg-background lg:hidden"
                >
                    <div className="site-container flex flex-col gap-1 py-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(linkClass(link.href), "py-2.5")}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="mt-3 flex items-center gap-3 border-t border-border pt-4">
                            {user ? (
                                <>
                                    <UserAvatar src={user.image} name={user.name} />
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                        {user.name}
                                    </span>
                                    <SignOutButton />
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/signin"
                                        onClick={() => setOpen(false)}
                                        className="btn-brand flex-1 bg-transparent! text-foreground! ring-1 ring-border hover:bg-elevated!"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setOpen(false)}
                                        className="btn-brand flex-1"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </header>
    )
}