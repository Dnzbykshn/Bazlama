"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { MenuCTASection } from "@/components/menu-cta-section"
import { Section1 } from "./Section-1"
import { Section2 } from "./Section-2"
import { MenuPageCTASection } from "@/components/menu-page-cta-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      {/* 1. Header (Menü Çubuğu) */}
      <Header />

      {/* 2. Hero Section (Büyük Giriş Slider) */}
       <Section1 />
        <MenuPageCTASection />
      <Section2 />
     
      
      {/* 3. Menu CTA Section (Kayan Menü Vitrini) */}
     

      {/* Buraya başka sectionlar da ekleyebilirsin (örn: Hakkımızda, Galeri vb.) */}
      
      {/* 4. Footer (Alt Bilgi) */}
      <Footer />
    </main>
  )
}