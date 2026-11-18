"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { signOut } from "@/lib/auth-client"

export function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        toast.add({ title: "Logged out", type: "success" })
        router.refresh()
    }

    return (
        <Button variant="outline" onClick={handleSignOut}>
            <LogOut aria-hidden />
            Log out
        </Button>
    )
}