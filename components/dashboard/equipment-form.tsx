"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Field } from "@/components/shared/field"
import { ImageUpload } from "@/components/shared/image-upload"
import { NativeSelect } from "@/components/shared/native-select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
    createEquipment,
    updateEquipment,
    type EquipmentInput,
} from "@/lib/actions/equipment"
import {
    CONDITIONS,
    EQUIPMENT_CATEGORIES,
    RENTAL_TYPES,
    STATUS_META,
    type EquipmentItem,
} from "@/lib/types/equipment"
import { isHttpUrl } from "@/lib/validators"

export function EquipmentForm({
    mode,
    initial,
    owner,
    backHref,
    resetsToPending = true,
}: {
    mode: "create" | "edit"
    initial?: EquipmentItem
    owner: { name: string; email: string }
    backHref: string
    /** Owner edits go back to review; admin edits keep the status. */
    resetsToPending?: boolean
}) {
    const router = useRouter()
    const [name, setName] = React.useState(initial?.name ?? "")
    const [description, setDescription] = React.useState(initial?.description ?? "")
    const [category, setCategory] = React.useState(initial?.category ?? "")
    const [location, setLocation] = React.useState(initial?.location ?? "")
    const [price, setPrice] = React.useState(initial ? String(initial.price) : "")
    const [rentalType, setRentalType] = React.useState<string>(
        initial?.rentalType ?? "daily"
    )
    const [quantity, setQuantity] = React.useState(
        initial ? String(initial.quantity) : "1"
    )
    const [condition, setCondition] = React.useState(initial?.condition ?? "good")
    const [brand, setBrand] = React.useState(initial?.brand ?? "")
    const [model, setModel] = React.useState(initial?.model ?? "")
    const [image, setImage] = React.useState(initial?.image ?? "")
    const [terms, setTerms] = React.useState(initial?.terms ?? "")
    const [pending, setPending] = React.useState(false)

    // Same rules as the server, so mistakes show up before the request.
    const validate = (): string | null => {
        const trimmedName = name.trim()
        if (trimmedName.length < 3 || trimmedName.length > 100) {
            return "Name must be 3 to 100 characters."
        }
        const trimmedDescription = description.trim()
        if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
            return "Description must be 10 to 2000 characters."
        }
        if (!EQUIPMENT_CATEGORIES.some((item) => item.name === category)) {
            return "Choose a category."
        }
        const trimmedLocation = location.trim()
        if (trimmedLocation.length < 2 || trimmedLocation.length > 120) {
            return "Location must be 2 to 120 characters."
        }
        const priceNumber = Number(price)
        if (
            price.trim() === "" ||
            !Number.isFinite(priceNumber) ||
            priceNumber <= 0 ||
            priceNumber > 10_000_000
        ) {
            return "Enter a valid price."
        }
        const quantityNumber = Number(quantity)
        if (
            quantity.trim() === "" ||
            !Number.isInteger(quantityNumber) ||
            quantityNumber < 0 ||
            quantityNumber > 1000
        ) {
            return "Quantity must be a whole number from 0 to 1000."
        }
        const trimmedImage = image.trim()
        if (!trimmedImage || trimmedImage.length > 500 || !isHttpUrl(trimmedImage)) {
            return "Add an image: upload one or paste an https link."
        }
        if (brand.trim().length > 80 || model.trim().length > 80) {
            return "Brand and model are limited to 80 characters."
        }
        if (terms.trim().length > 2000) {
            return "Terms are limited to 2000 characters."
        }
        return null
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const problem = validate()
        if (problem) {
            toast.add({ title: "Check the form", description: problem, type: "error" })
            return
        }

        const input: EquipmentInput = {
            name: name.trim(),
            description: description.trim(),
            category,
            location: location.trim(),
            price: Number(price),
            rentalType,
            quantity: Number(quantity),
            condition,
            brand: brand.trim(),
            model: model.trim(),
            image: image.trim(),
            terms: terms.trim(),
        }

        setPending(true)
        try {
            const result =
                mode === "edit" && initial
                    ? await updateEquipment(initial._id, input)
                    : await createEquipment(input)

            if (!result.ok) {
                toast.add({ title: "Could not save", description: result.message, type: "error" })
                return
            }

            toast.add({
                title: mode === "edit" ? "Equipment updated" : "Equipment submitted",
                description:
                    mode === "edit" && !resetsToPending
                        ? "Your changes were saved."
                        : mode === "edit"
                            ? "Your changes were saved and sent for admin review."
                            : "Your listing is pending admin approval.",
                type: "success",
            })
            router.push(backHref)
            router.refresh()
        } catch {
            toast.add({
                title: "Could not save",
                description: "Something went wrong. Please try again.",
                type: "error",
            })
        } finally {
            setPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex max-w-4xl flex-col gap-6">
            {mode === "edit" && resetsToPending ? (
                <p
                    role="status"
                    className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-warning"
                >
                    Saving changes sends this listing back for admin approval.
                </p>
            ) : null}

            <section className="surface-card flex flex-col gap-5 p-6">
                <h2 className="font-heading text-lg font-semibold">Basic information</h2>
                <Field label="Equipment name" htmlFor="name">
                    <Input
                        id="name"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Canon EOS R6 Camera Kit"
                    />
                </Field>
                <Field label="Category" htmlFor="category">
                    <NativeSelect
                        id="category"
                        required
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {EQUIPMENT_CATEGORIES.map((item) => (
                            <option key={item.slug} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </NativeSelect>
                </Field>
                <Field label="Description" htmlFor="description">
                    <Textarea
                        id="description"
                        required
                        rows={5}
                        maxLength={2000}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Describe the equipment, what is included and how it can be used."
                    />
                </Field>
            </section>

            <section className="surface-card flex flex-col gap-5 p-6">
                <h2 className="font-heading text-lg font-semibold">
                    Pricing and availability
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Rental price (৳)" htmlFor="price">
                        <Input
                            id="price"
                            type="number"
                            required
                            min={0}
                            step="any"
                            inputMode="decimal"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                            placeholder="2500"
                        />
                    </Field>
                    <Field label="Rental type" htmlFor="rentalType">
                        <NativeSelect
                            id="rentalType"
                            value={rentalType}
                            onChange={(event) => setRentalType(event.target.value)}
                        >
                            {RENTAL_TYPES.map((item) => (
                                <option key={item} value={item}>
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </option>
                            ))}
                        </NativeSelect>
                    </Field>
                    <Field label="Available quantity" htmlFor="quantity">
                        <Input
                            id="quantity"
                            type="number"
                            required
                            min={0}
                            max={1000}
                            inputMode="numeric"
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)}
                        />
                    </Field>
                    <Field label="Condition" htmlFor="condition">
                        <NativeSelect
                            id="condition"
                            value={condition}
                            onChange={(event) => setCondition(event.target.value)}
                        >
                            {CONDITIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </NativeSelect>
                    </Field>
                </div>
                <Field label="Location" htmlFor="location">
                    <Input
                        id="location"
                        required
                        maxLength={120}
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="e.g. Dhaka"
                    />
                </Field>
            </section>

            <section className="surface-card flex flex-col gap-5 p-6">
                <h2 className="font-heading text-lg font-semibold">Details</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Brand (optional)" htmlFor="brand">
                        <Input
                            id="brand"
                            maxLength={80}
                            value={brand}
                            onChange={(event) => setBrand(event.target.value)}
                        />
                    </Field>
                    <Field label="Model (optional)" htmlFor="model">
                        <Input
                            id="model"
                            maxLength={80}
                            value={model}
                            onChange={(event) => setModel(event.target.value)}
                        />
                    </Field>
                </div>
                <ImageUpload
                    id="image"
                    label="Equipment image"
                    value={image}
                    onChange={setImage}
                    shape="landscape"
                    disabled={pending}
                />
                <Field
                    label="Rental terms (optional)"
                    htmlFor="terms"
                    hint="Deposit, ID requirements, late fees, damage policy."
                >
                    <Textarea
                        id="terms"
                        rows={4}
                        maxLength={2000}
                        value={terms}
                        onChange={(event) => setTerms(event.target.value)}
                    />
                </Field>
            </section>

            <section className="surface-card flex flex-col gap-5 p-6">
                <h2 className="font-heading text-lg font-semibold">Listing</h2>
                <div className="grid gap-5 sm:grid-cols-3">
                    <Field label="Status" htmlFor="status" hint="Set by the server.">
                        <Input
                            id="status"
                            disabled
                            readOnly
                            value={STATUS_META[initial?.status ?? "pending"].label}
                        />
                    </Field>
                    <Field label="Owner name" htmlFor="ownerName">
                        <Input id="ownerName" disabled readOnly value={owner.name} />
                    </Field>
                    <Field label="Owner email" htmlFor="ownerEmail">
                        <Input id="ownerEmail" disabled readOnly value={owner.email} />
                    </Field>
                </div>
            </section>

            <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-brand h-11 px-6" disabled={pending}>
                    {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
                    {mode === "edit" ? "Save changes" : "Submit for approval"}
                </button>
                <Link
                    href={backHref}
                    className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-medium transition-colors hover:bg-elevated"
                >
                    Cancel
                </Link>
            </div>
        </form>
    )
}