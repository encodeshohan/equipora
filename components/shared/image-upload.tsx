"use client"

import * as React from "react"
import { ImageIcon, Loader2, Upload } from "lucide-react"

import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { isHttpUrl } from "@/lib/validators"
import { cn } from "@/lib/utils"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function ImageUpload({
    id,
    label,
    value,
    onChange,
    shape = "circle",
    disabled,
}: {
    id: string
    label: string
    value: string
    onChange: (url: string) => void
    shape?: "circle" | "landscape"
    disabled?: boolean
}) {
    const [uploading, setUploading] = React.useState(false)
    const previewable = value.trim() !== "" && isHttpUrl(value.trim())

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
            onChange(url)
            toast.add({ title: "Image uploaded", type: "success" })
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

    const previewClass =
        shape === "circle"
            ? "size-16 rounded-full"
            : "aspect-[4/3] w-28 rounded-lg"

    return (
        <fieldset className="flex flex-col gap-2" disabled={disabled}>
            <legend className="mb-2 text-sm font-medium">{label}</legend>
            <div className="flex items-center gap-4">
                {previewable ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={value.trim()}
                        alt="Preview"
                        className={cn("shrink-0 border border-border object-cover", previewClass)}
                    />
                ) : (
                    <span
                        aria-hidden
                        className={cn(
                            "flex shrink-0 items-center justify-center border border-border bg-elevated",
                            previewClass
                        )}
                    >
                        <ImageIcon className="size-5 text-fg-muted" />
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
                        disabled={uploading || disabled}
                        onChange={handleFileChange}
                    />
                </label>
            </div>
            <Input
                id={id}
                inputMode="url"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="or paste an image link (https://...)"
                aria-label={`${label} link`}
            />
        </fieldset>
    )
}