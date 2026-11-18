"use client"

import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

// Fade-up on scroll. Used on every home section (Framer Motion).
export function Reveal({
    children,
    delay = 0,
    y = 24,
    className,
}: {
    children: React.ReactNode
    delay?: number
    y?: number
    className?: string
}) {
    const reduceMotion = useReducedMotion()

    return (
        <motion.div
            className={cn(className)}
            initial={reduceMotion ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    )
}