import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { MenuCTASection } from "@/components/menu-cta-section"
import { GalleryPreview } from "@/components/gallery-preview"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <MenuCTASection />
      <GalleryPreview />
      <CTASection />
      <Footer />
    </main>
  )
}
