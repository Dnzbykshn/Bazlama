import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { FeaturedMenu } from "@/components/featured-menu"
import { GalleryPreview } from "@/components/gallery-preview"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <FeaturedMenu />
      <GalleryPreview />
      <CTASection />
      <Footer />
    </main>
  )
}
