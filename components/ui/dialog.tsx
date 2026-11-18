"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogContent({
    className,
    children,
    ...props
}: DialogPrimitive.Popup.Props) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Backdrop
                data-slot="dialog-overlay"
                className="fixed inset-0 z-50 bg-black/50 duration-150 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
            />
            <DialogPrimitive.Popup
                data-slot="dialog-content"
                className={cn(
                    "fixed top-1/2 left-1/2 z-50 max-h-[90svh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-surface p-6 text-foreground shadow-lg outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="absolute top-3 right-3"
                        />
                    }
                >
                    <XIcon aria-hidden />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
    )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("font-heading text-xl font-bold", className)}
            {...props}
        />
    )
}

function DialogDescription({
    className,
    ...props
}: DialogPrimitive.Description.Props) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("mt-1 text-sm text-fg-secondary", className)}
            {...props}
        />
    )
}

export { Dialog, DialogContent, DialogDescription, DialogTitle }