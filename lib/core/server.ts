import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import type { UserRole } from "@/lib/types/user"

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

const LOGIN_PATH = "/signin"
const UNAUTHORIZED_PATH = "/unauthorized"

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    return session
}

// The better-auth session token is what the Express server verifies.
export const getToken = async () => {
    const session = await getSession()
    if (!session?.session?.token) {
        redirect(LOGIN_PATH)
    }
    return session.session.token
}

const rejectIfDenied = (res: Response) => {
    if (res.status === 401 || res.status === 403) {
        redirect(UNAUTHORIZED_PATH)
    }
    return res
}

export const authFetch = async (api: string) => {
    const token = await getToken()
    const res = await fetch(api, {
        cache: "no-store",
        headers: {
            authorization: `Bearer ${token}`,
        },
    })
    return rejectIfDenied(res)
}

export const protectedMutation = async (
    api: string,
    method: string,
    data?: unknown
) => {
    const token = await getToken()
    const res = await fetch(api, {
        method,
        cache: "no-store",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: data ? JSON.stringify(data) : undefined,
    })
    return rejectIfDenied(res)
}

export const requireRole = async (role: UserRole | UserRole[]) => {
    const session = await getSession()
    if (!session) {
        redirect(LOGIN_PATH)
    }
    const allowed = Array.isArray(role) ? role : [role]
    if (!allowed.includes(session.user.role as UserRole)) {
        redirect(UNAUTHORIZED_PATH)
    }
    return session
}