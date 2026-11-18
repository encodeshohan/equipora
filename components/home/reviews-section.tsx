import { Star } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { UserAvatar } from "@/components/shared/user-avatar"
import { REVIEWS } from "@/lib/data/reviews"
import { cn } from "@/lib/utils"

export function ReviewsSection() {
    return (
        <section className="site-container pt-20">
            <SectionHeading
                overline="Testimonials"
                title="Customer Reviews"
                description="What renters and owners say about Equipora."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {REVIEWS.map((review, index) => (
                    <Reveal key={review.name} delay={index * 0.06} className="h-full">
                        <figure className="surface-card flex h-full flex-col gap-4 p-6">
                            <div
                                role="img"
                                aria-label={`${review.rating} out of 5 stars`}
                                className="flex gap-0.5"
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        aria-hidden
                                        className={cn(
                                            "size-4",
                                            star <= review.rating
                                                ? "fill-warning text-warning"
                                                : "text-fg-muted"
                                        )}
                                    />
                                ))}
                            </div>
                            <blockquote className="flex-1 text-sm text-fg-secondary">
                                {review.comment}
                            </blockquote>
                            <figcaption className="flex items-center gap-3">
                                <UserAvatar name={review.name} />
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold">
                                        {review.name}
                                    </span>
                                    <span className="block truncate text-xs text-fg-secondary">
                                        {review.role}
                                    </span>
                                </span>
                            </figcaption>
                        </figure>
                    </Reveal>
                ))}
            </div>
        </section>
    )
}