"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
    XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const toast = ToastPrimitive.createToastManager()

function ToastIcon({ type }: { type: string | undefined }) {
    let icon: React.ReactNode = null

    if (type === "success") {
        icon = <CircleCheckIcon aria-hidden="true" className="text-success" />
    }
    if (type === "info") {
        icon = <InfoIcon aria-hidden="true" className="text-info" />
    }
    if (type === "warning") {
        icon = <TriangleAlertIcon aria-hidden="true" className="text-warning" />
    }
    if (type === "error") {
        icon = <OctagonXIcon aria-hidden="true" className="text-error" />
    }
    if (type === "loading") {
        icon = <Loader2Icon aria-hidden="true" className="animate-spin" />
    }

    if (!icon) return null

    return (
        <span
            data-slot="toast-icon"
            className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
        >
            {icon}
        </span>
    )
}

function ToastList() {
    const { toasts } = ToastPrimitive.useToastManager()

    return toasts.map((toastItem) => (
        <ToastPrimitive.Root
            key={toastItem.id}
            toast={toastItem}
            data-slot="toast"
            className={cn(
                "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
                "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
                "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
                "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
                "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]",
                "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
                "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
                "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
                "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
                "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]"
            )}
        >
            <ToastPrimitive.Content
                data-slot="toast-content"
                className="flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100"
            >
                <ToastIcon type={toastItem.type} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <ToastPrimitive.Title className="text-sm font-medium" />
                    <ToastPrimitive.Description className="text-sm text-muted-foreground" />
                </div>
                <ToastPrimitive.Close
                    aria-label="Close toast"
                    render={<Button variant="ghost" size="icon-sm" />}
                    className="relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground"
                >
                    <XIcon aria-hidden="true" />
                </ToastPrimitive.Close>
            </ToastPrimitive.Content>
        </ToastPrimitive.Root>
    ))
}

function Toaster({ children, ...props }: ToastPrimitive.Provider.Props) {
    return (
        <ToastPrimitive.Provider toastManager={toast} {...props}>
            {children}
            <ToastPrimitive.Portal data-slot="toast-portal">
                <ToastPrimitive.Viewport
                    data-slot="toast-viewport"
                    className="pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full"
                >
                    <ToastList />
                </ToastPrimitive.Viewport>
            </ToastPrimitive.Portal>
        </ToastPrimitive.Provider>
    )
}

export { Toaster, toast }