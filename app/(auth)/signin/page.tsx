import { redirect } from "next/navigation"

import { SignInForm } from "@/components/auth/sign-in-form"
import { safeRedirect } from "@/lib/auth-redirect"
import { getSession } from "@/lib/core/server"

export const metadata = { title: "Login" }

export default async function SignInPage({
    searchParams,
}: {
    searchParams: Promise<{ redirectTo?: string }>
}) {
    const { redirectTo } = await searchParams
    const destination = safeRedirect(redirectTo)

    // Already logged in: skip the form.
    if (await getSession()) redirect(destination)

    return <SignInForm redirectTo={destination} />
}