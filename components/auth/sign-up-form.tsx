"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Upload, User } from "lucide-react"

import { GoogleButton } from "@/components/auth/google-button"
import { Field } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { getPasswordError, isHttpUrl } from "@/lib/validators"

type SignUpRole = "customer" | "owner"

const ROLE_OPTIONS: { value: SignUpRole; label: string; hint: string }[] = [
    { value: "customer", label: "Customer", hint: "Rent equipment" },
    { value: "owner", label: "Owner", hint: "List equipment" },
]

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function SignUpForm({ redirectTo }: { redirectTo: string }) {
    const router = useRouter()
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [role, setRole] = React.useState<SignUpRole>("customer")
    const [image, setImage] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)
    const [pending, setPending] = React.useState(false)

    // Upload to imgbb straight from the browser (same approach as the mentor).
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget
        const file = input.files?.[0]
        input.value = ""
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.add({ title: "Invalid file", description: "Please choose an image.", type: "error" })
            return
        }
        if (file.size > MAX_IMAGE_SIZE) {
            toast.add({ title: "Image too large", description: "Please choose an image under 5 MB.", type: "error" })
            return
        }

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
        if (!apiKey) {
            toast.add({
                title: "Upload not configured",
                description: "Paste an image link instead.",
                type: "error",
            })
            return
        }

        setUploading(true)
        try {
            const body = new FormData()
            body.append("image", file)
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body,
            })
            const result = await res.json()
            const url = result?.data?.url
            if (!res.ok || typeof url !== "string") {
                throw new Error(result?.error?.message || "Upload failed")
            }
            setImage(url)
            toast.add({ title: "Photo uploaded", type: "success" })
        } catch (error) {
            toast.add({
                title: "Upload failed",
                description: error instanceof Error ? error.message : "Please try again.",
                type: "error",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedName = name.trim()
        const trimmedImage = image.trim()

        if (trimmedName.length < 2) {
            toast.add({ title: "Name is too short", description: "Please enter your full name.", type: "error" })
            return
        }

        const passwordError = getPasswordError(password)
        if (passwordError) {
            toast.add({ title: "Weak password", description: passwordError, type: "error" })
            return
        }

        if (trimmedImage && !isHttpUrl(trimmedImage)) {
            toast.add({
                title: "Invalid photo link",
                description: "The link must start with http:// or https://",
                type: "error",
            })
            return
        }

        setPending(true)
        try {
            const { error } = await authClient.signUp.email({
                name: trimmedName,
                email: email.trim(),
                password,
                role,
                ...(trimmedImage ? { image: trimmedImage } : {}),
            })

            if (error) {
                toast.add({
                    title: "Registration failed",
                    description: error.message || "Something went wrong. Please try again.",
                    type: "error",
                })
                return
            }

            toast.add({
                title: "Registration successful",
                description: "Your account has been created.",
                type: "success",
            })
            router.replace(redirectTo)
            router.refresh()
        } finally {
            setPending(false)
        }
    }

    return (
        <div className="surface-card p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-1.5 text-center">
                <h1 className="page-title">Create your account</h1>
                <p className="text-sm text-fg-secondary">
                    Rent smarter. Work better.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-sm font-medium">I want to join as</legend>
                    <div className="grid grid-cols-2 gap-3">
                        {ROLE_OPTIONS.map((option) => (
                            <label
                                key={option.value}
                                className="flex cursor-pointer flex-col gap-0.5 rounded-lg border border-border bg-elevated p-3 transition-colors has-[input:checked]:border-brand has-[input:checked]:bg-brand/15 has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30"
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={option.value}
                                    checked={role === option.value}
                                    onChange={() => setRole(option.value)}
                                    className="sr-only"
                                />
                                <span className="text-sm font-semibold">{option.label}</span>
                                <span className="text-xs text-fg-secondary">{option.hint}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <Field label="Full name" htmlFor="name">
                    <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={80}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Jane Doe"
                    />
                </Field>

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

                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-sm font-medium">Profile photo (optional)</legend>
                    <div className="flex items-center gap-3">
                        {image && isHttpUrl(image) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={image}
                                alt="Profile photo preview"
                                className="size-12 shrink-0 rounded-full border border-border object-cover"
                            />
                        ) : (
                            <span
                                aria-hidden
                                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-elevated"
                            >
                                <User className="size-5 text-fg-muted" />
                            </span>
                        )}
                        <label className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-elevated px-4 text-sm transition-colors hover:border-ring">
                            {uploading ? (
                                <Loader2 aria-hidden className="size-4 animate-spin" />
                            ) : (
                                <Upload aria-hidden className="size-4" />
                            )}
                            {uploading ? "Uploading..." : "Upload image"}
                            <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                disabled={uploading}
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                    <Input
                        id="image"
                        name="image"
                        inputMode="url"
                        value={image}
                        onChange={(event) => setImage(event.target.value)}
                        placeholder="or paste an image link (https://...)"
                        aria-label="Profile photo link"
                    />
                </fieldset>

                <Field
                    label="Password"
                    htmlFor="password"
                    hint="At least 6 characters, with an uppercase and a lowercase letter."
                >
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Create a password"
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

                <button
                    type="submit"
                    className="btn-brand h-11 w-full"
                    disabled={pending || uploading}
                >
                    {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
                    Register
                </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-fg-muted">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
            </div>

            <GoogleButton redirectTo={redirectTo} disabled={pending} />

            <p className="mt-6 text-center text-sm text-fg-secondary">
                Already have an account?{" "}
                <Link
                    href="/signin"
                    className="font-semibold text-foreground underline underline-offset-4 hover:text-fg-secondary"
                >
                    Login
                </Link>
            </p>
        </div>
    )
}