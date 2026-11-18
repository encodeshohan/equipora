import { AboutSection } from "@/components/home/about-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { ContactSection } from "@/components/home/contact-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { HeroBanner } from "@/components/home/hero-banner"
import { HowItWorks } from "@/components/home/how-it-works"
import { ReviewsSection } from "@/components/home/reviews-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { getCategories, getFeaturedEquipment } from "@/lib/api/equipment"
import { getSessionSafe } from "@/lib/core/server"

export default async function HomePage() {
  const [session, featured, categories] = await Promise.all([
    getSessionSafe(),
    getFeaturedEquipment(),
    getCategories(),
  ])

  const listedCount = categories.reduce((sum, category) => sum + category.count, 0)

  return (
    <>
      <HeroBanner />
      <CategoriesSection categories={categories} />
      <FeaturedSection items={featured} isLoggedIn={Boolean(session)} />
      <WhyChooseUs />
      <HowItWorks />
      <AboutSection listedCount={listedCount} />
      <ReviewsSection />
      <ContactSection />
    </>
  )
}