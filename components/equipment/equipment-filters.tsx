"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Field } from "@/components/shared/field"
import { NativeSelect } from "@/components/shared/native-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { EQUIPMENT_CATEGORIES } from "@/lib/types/equipment"

type Values = {
    search: string
    category: string
    rentalType: string
    minPrice: string
    maxPrice: string
    availability: string
    sort: string
}

const EMPTY: Values = {
    search: "",
    category: "",
    rentalType: "",
    minPrice: "",
    maxPrice: "",
    availability: "",
    sort: "",
}

export function EquipmentFilters({
    basePath,
    initial,
    hideCategory = false,
}: {
    basePath: string
    initial: Record<string, string>
    hideCategory?: boolean
}) {
    const router = useRouter()
    const [values, setValues] = React.useState<Values>({
        search: initial.search ?? "",
        category: initial.category ?? "",
        rentalType: initial.rentalType ?? "",
        minPrice: initial.minPrice ?? "",
        maxPrice: initial.maxPrice ?? "",
        availability: initial.availability ?? "",
        sort: initial.sort ?? "",
    })

    const push = (next: Values) => {
        const min = next.minPrice.trim()
        const max = next.maxPrice.trim()
        if (min && max && Number(min) > Number(max)) {
            toast.add({
                title: "Invalid price range",
                description: "The minimum price cannot be higher than the maximum.",
                type: "error",
            })
            return
        }

        const params = new URLSearchParams()
        for (const [key, value] of Object.entries(next)) {
            const text = value.trim()
            if (text) params.set(key, text)
        }
        const query = params.toString()
        router.push(query ? `${basePath}?${query}` : basePath)
    }

    const handleSelect =
        (key: keyof Values) => (event: React.ChangeEvent<HTMLSelectElement>) => {
            const next = { ...values, [key]: event.target.value }
            setValues(next)
            push(next)
        }

    const handleText =
        (key: keyof Values) => (event: React.ChangeEvent<HTMLInputElement>) =>
            setValues((prev) => ({ ...prev, [key]: event.target.value }))

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        push(values)
    }

    const handleReset = () => {
        setValues(EMPTY)
        router.push(basePath)
    }

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3"
        >
            <div className="sm:col-span-2 lg:col-span-3">
                <Field label="Search" htmlFor="search">
                    <div className="relative">
                        <Search
                            aria-hidden
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted"
                        />
                        <Input
                            id="search"
                            value={values.search}
                            onChange={handleText("search")}
                            placeholder="Search by name or location"
                            className="pl-10"
                        />
                    </div>
                </Field>
            </div>

            {hideCategory ? null : (
                <Field label="Category" htmlFor="category">
                    <NativeSelect
                        id="category"
                        value={values.category}
                        onChange={handleSelect("category")}
                    >
                        <option value="">All categories</option>
                        {EQUIPMENT_CATEGORIES.map((category) => (
                            <option key={category.slug} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </NativeSelect>
                </Field>
            )}

            <Field label="Rental type" htmlFor="rentalType">
                <NativeSelect
                    id="rentalType"
                    value={values.rentalType}
                    onChange={handleSelect("rentalType")}
                >
                    <option value="">Any</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </NativeSelect>
            </Field>

            <Field label="Min price (৳)" htmlFor="minPrice">
                <Input
                    id="minPrice"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={values.minPrice}
                    onChange={handleText("minPrice")}
                    placeholder="0"
                />
            </Field>

            <Field label="Max price (৳)" htmlFor="maxPrice">
                <Input
                    id="maxPrice"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={values.maxPrice}
                    onChange={handleText("maxPrice")}
                    placeholder="Any"
                />
            </Field>

            <Field label="Availability" htmlFor="availability">
                <NativeSelect
                    id="availability"
                    value={values.availability}
                    onChange={handleSelect("availability")}
                >
                    <option value="">All</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </NativeSelect>
            </Field>

            <Field label="Sort by" htmlFor="sort">
                <NativeSelect id="sort" value={values.sort} onChange={handleSelect("sort")}>
                    <option value="newest">Recently added</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                </NativeSelect>
            </Field>

            <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-3">
                <button type="submit" className="btn-brand h-11 px-6">
                    Apply
                </button>
                <Button type="button" variant="outline" className="h-11 px-5" onClick={handleReset}>
                    Reset
                </Button>
            </div>
        </form>
    )
}