import { redirect } from "next/navigation"

import { SignUpForm } from "@/components/auth/sign-up-form"
import { safeRedirect } from "@/lib/auth-redirect"
import { getSession } from "@/lib/core/server"

export const metadata = { title: "Register" }

export default async function SignUpPage({
    searchParams,
}: {
    searchParams: Promise<{ redirectTo?: string }>
}) {
    const { redirectTo } = await searchParams
    const destination = safeRedirect(redirectTo)

    if (await getSession()) redirect(destination)

    return <SignUpForm redirectTo={destination} />
}