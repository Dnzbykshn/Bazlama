"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, type Variants } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Phone, Mail, ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Branch {
  id: string
  name: string
  slug: string
  city: string
  address: string | null
  phone: string | null
  email: string | null
  active: boolean
  image_url: string | null
  description: string | null
  story: string | null
  working_hours: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  } | null
  latitude: number | null
  longitude: number | null
  map_url: string | null
}

interface BranchMenuItem {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
}

interface BranchGalleryItem {
  id: string
  image_url: string
  title: string | null
  description: string | null
}

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const days = [
  { key: "monday", label: "Pazartesi" },
  { key: "tuesday", label: "Salı" },
  { key: "wednesday", label: "Çarşamba" },
  { key: "thursday", label: "Perşembe" },
  { key: "friday", label: "Cuma" },
  { key: "saturday", label: "Cumartesi" },
  { key: "sunday", label: "Pazar" },
]

export default function BranchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [branch, setBranch] = useState<Branch | null>(null)
  const [menuItems, setMenuItems] = useState<BranchMenuItem[]>([])
  const [galleryItems, setGalleryItems] = useState<BranchGalleryItem[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchBranch()
    }
  }, [slug])

  async function fetchBranch() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("branches")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single()

      if (fetchError) throw fetchError
      if (!data) {
        setError("Şube bulunamadı")
        return
      }

      setBranch(data)
    } catch (err: any) {
      console.error("Error fetching branch:", err)
      setError("Şube yüklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  async function fetchMenuItems(branchId: string) {
    try {
      const { data, error } = await supabase
        .from("branch_menu_items")
        .select("*")
        .eq("branch_id", branchId)
        .order("category", { ascending: true })
        .order("position", { ascending: true })

      if (error) throw error
      setMenuItems(data || [])
    } catch (error) {
      console.error("Error fetching menu items:", error)
    }
  }

  useEffect(() => {
    if (branch?.id) {
      fetchMenuItems(branch.id)
      fetchGalleryItems(branch.id)
    }
  }, [branch?.id])

  // Auto-play slider
  useEffect(() => {
    if (galleryItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
      }, 5000) // 5 saniyede bir geçiş

      return () => clearInterval(interval)
    }
  }, [galleryItems.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (galleryItems.length === 0) return
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
      } else if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [galleryItems.length])

  async function fetchGalleryItems(branchId: string) {
    try {
      const { data, error } = await supabase
        .from("branch_gallery")
        .select("*")
        .eq("branch_id", branchId)
        .order("position", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      setGalleryItems(data || [])
    } catch (error) {
      console.error("Error fetching gallery items:", error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !branch) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Şube Bulunamadı</h1>
          <p className="text-muted-foreground mb-8">{error || "Aradığınız şube bulunamadı."}</p>
          <Link href="/subeler">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Şubelere Dön
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const groupedMenu = menuItems.reduce((acc, item) => {
    const category = item.category || "Diğer"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, BranchMenuItem[]>)

  return (
    <main className="min-h-screen bg-transparent">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <Link href="/subeler">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Şubelere Dön
              </Button>
            </Link>
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
              {branch.city}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
              {branch.name}
            </h1>
            {branch.description && (
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {branch.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-24 space-y-16">
        {/* Branch Image */}
        {branch.image_url && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5"
          >
            <Image
              src={branch.image_url}
              alt={branch.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Story Section */}
        {branch.story && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-serif font-bold mb-6">Hikayemiz</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed font-light whitespace-pre-wrap">
                {branch.story}
              </p>
            </div>
          </motion.section>
        )}

        {/* Gallery Slider Section */}
        {galleryItems.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-4xl font-serif font-bold mb-4">Fotoğraf Galerisi</h2>
              <p className="text-muted-foreground">Şubemizden kareler</p>
            </div>
            <div className="relative max-w-5xl mx-auto">
              <div 
                className="relative aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5"
                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                onTouchEnd={() => {
                  if (!touchStart || !touchEnd) return
                  const distance = touchStart - touchEnd
                  const isLeftSwipe = distance > 50
                  const isRightSwipe = distance < -50

                  if (isLeftSwipe && galleryItems.length > 0) {
                    setCurrentImageIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
                  }
                  if (isRightSwipe && galleryItems.length > 0) {
                    setCurrentImageIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
                  }
                }}
              >
                {galleryItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title || `Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === currentImageIndex}
                    />
                    {item.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                        <p className="text-white text-xl font-medium">{item.title}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Navigation Buttons */}
                {galleryItems.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-foreground rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                      aria-label="Önceki fotoğraf"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-foreground rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                      aria-label="Sonraki fotoğraf"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {galleryItems.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {galleryItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Fotoğraf ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Info Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Contact Info */}
          <Card className="rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-100">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl font-serif font-bold mb-6">İletişim Bilgileri</h3>
              {branch.address && (
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Adres</p>
                    <p className="text-muted-foreground leading-relaxed">{branch.address}</p>
                  </div>
                </div>
              )}
              {branch.phone && (
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Telefon</p>
                    <a href={`tel:${branch.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {branch.phone}
                    </a>
                  </div>
                </div>
              )}
              {branch.email && (
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">E-posta</p>
                    <a href={`mailto:${branch.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {branch.email}
                    </a>
                  </div>
                </div>
              )}
              {branch.map_url && (
                <div className="pt-4 border-t">
                  <a
                    href={branch.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Haritada Görüntüle
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          {branch.working_hours && (
            <Card className="rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-100">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Çalışma Saatleri
                </h3>
                <div className="space-y-3">
                  {days.map((day) => {
                    const hours = branch.working_hours?.[day.key as keyof typeof branch.working_hours]
                    return (
                      <div key={day.key} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="font-medium">{day.label}</span>
                        <span className="text-muted-foreground">{hours || "Kapalı"}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.section>

        {/* Menu Section */}
        {menuItems.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-4xl font-serif font-bold mb-4">Menümüz</h2>
              <p className="text-muted-foreground">Bu şubeye özel lezzetlerimiz</p>
            </div>

            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="space-y-6">
                <h3 className="text-2xl font-serif font-bold text-primary">{category}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-100">
                      {item.image_url && (
                        <div className="relative aspect-video w-full">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h4 className="text-xl font-serif font-bold mb-2">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <p className="text-2xl font-bold text-primary">
                          {item.price.toFixed(2)} ₺
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </motion.section>
        )}
      </div>

      <Footer />
    </main>
  )
}
