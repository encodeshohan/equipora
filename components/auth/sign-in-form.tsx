"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { GoogleButton } from "@/components/auth/google-button"
import { Field } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

export function SignInForm({ redirectTo }: { redirectTo: string }) {
    const router = useRouter()
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [pending, setPending] = React.useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setPending(true)
        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
                rememberMe: true,
            })

            if (error) {
                toast.add({
                    title: "Login failed",
                    description: error.message || "Invalid email or password.",
                    type: "error",
                })
                return
            }

            toast.add({
                title: "Welcome back",
                description: "You have logged in successfully.",
                type: "success",
            })
            // Refresh so server components pick up the new session cookie.
            router.replace(redirectTo)
            router.refresh()
        } finally {
            setPending(false)
        }
    }

    return (
        <div className="surface-card p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-1.5 text-center">
                <h1 className="page-title">Welcome back</h1>
                <p className="text-sm text-fg-secondary">
                    Log in to rent, list and manage equipment.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field label="Email address" htmlFor="email">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                    />
                </Field>

                <Field label="Password" htmlFor="password">
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Your password"
                            className="pr-11"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-fg-muted transition-colors hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff aria-hidden className="size-4" />
                            ) : (
                                <Eye aria-hidden className="size-4" />
                            )}
                        </button>
                    </div>
                </Field>

                <button type="submit" className="btn-brand h-11 w-full" disabled={pending}>
                    {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
                    Login
                </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-fg-muted">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
            </div>

            <GoogleButton redirectTo={redirectTo} disabled={pending} />

            <p className="mt-6 text-center text-sm text-fg-secondary">
                New to Equipora?{" "}
                <Link
                    href="/signup"
                    className="font-semibold text-foreground underline underline-offset-4 hover:text-fg-secondary"
                >
                    Register
                </Link>
            </p>
        </div>
    )
}