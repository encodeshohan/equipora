"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Field } from "@/components/shared/field"
import { ImageUpload } from "@/components/shared/image-upload"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { updateProfile } from "@/lib/actions/profile"
import { formatDate } from "@/lib/formatters"
import type { Profile } from "@/lib/types/profile"
import { ROLE_META } from "@/lib/types/user"
import { isHttpUrl } from "@/lib/validators"

const PHONE_PATTERN = /^\+?[\d\s-]{7,20}$/

export function ProfileForm({ profile }: { profile: Profile }) {
    const router = useRouter()
    const [name, setName] = React.useState(profile.name)
    const [image, setImage] = React.useState(profile.image ?? "")
    const [phone, setPhone] = React.useState(profile.phone)
    const [address, setAddress] = React.useState(profile.address)
    const [pending, setPending] = React.useState(false)

    const fail = (title: string, description: string) =>
        toast.add({ title, description, type: "error" })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (name.trim().length < 2) {
            return fail("Name is too short", "Please enter your full name.")
        }
        if (image.trim() && !isHttpUrl(image.trim())) {
            return fail("Invalid image link", "The link must start with http:// or https://")
        }
        if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
            return fail("Invalid phone number", "Enter a valid phone number.")
        }

        setPending(true)
        try {
            const result = await updateProfile({
                name: name.trim(),
                image: image.trim(),
                phone: phone.trim(),
                address: address.trim(),
            })

            if (!result.ok) {
                fail("Could not save", result.message)
                return
            }

            toast.add({
                title: "Profile updated",
                description: "Your changes have been saved.",
                type: "success",
            })
            // Refresh so the sidebar shows the new name and photo.
            router.refresh()
        } catch {
            fail("Could not save", "Something went wrong. Please try again.")
        } finally {
            setPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="surface-card flex max-w-2xl flex-col gap-5 p-6">
            <ImageUpload
                id="image"
                label="Profile photo"
                value={image}
                onChange={setImage}
                disabled={pending}
            />

            <Field label="Full name" htmlFor="name">
                <Input
                    id="name"
                    required
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" htmlFor="email" hint="Your email cannot be changed.">
                    <Input id="email" value={profile.email} disabled readOnly />
                </Field>
                <Field label="Role" htmlFor="role">
                    <Input id="role" value={ROLE_META[profile.role].label} disabled readOnly />
                </Field>
            </div>

            <Field label="Phone" htmlFor="phone">
                <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="01XXXXXXXXX"
                />
            </Field>

            <Field label="Address" htmlFor="address">
                <Textarea
                    id="address"
                    rows={3}
                    maxLength={300}
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="House, road, area, city"
                />
            </Field>

            <p className="text-xs text-fg-muted">
                Member since {formatDate(profile.createdAt)}
            </p>

            <div>
                <button type="submit" className="btn-brand h-11 px-6" disabled={pending}>
                    {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
                    Save changes
                </button>
            </div>
        </form>
    )
}