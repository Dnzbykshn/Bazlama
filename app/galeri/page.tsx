"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"

interface GalleryItem {
  id: string
  image_url: string
  title: string | null
  description: string | null
}

// Animation variants
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

export default function GaleriPage() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true)

        // If Supabase is not configured, use mock data directly
        if (!isSupabaseConfigured) {
          setImages([
            { id: "1", image_url: "/images/image.png", title: "Kahvaltı Tabağı", description: "En taze ürünlerle hazırlanan serpme kahvaltımız." },
            { id: "2", image_url: "/images/image.png", title: "Mekan", description: "Huzurlu ve sıcak atmosferimiz." },
            { id: "3", image_url: "/images/image.png", title: "Lezzetler", description: "Özel tarifimizle hazırlanan lezzetler." },
            { id: "4", image_url: "/images/image.png", title: "Atmosfer", description: "Keyifli anlar için." },
            { id: "5", image_url: "/images/image.png", title: "Kahvaltı", description: "Doyurucu ve lezzetli." },
            { id: "6", image_url: "/images/image.png", title: "Mekan", description: "Sizi bekliyoruz." },
          ])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("position", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false })

        if (error) throw error
        setImages(data || [])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching gallery:", err)
        setError(err.message || "Galeri yüklenirken bir hata oluştu")

        // Fallback to mock data on error if not configured
        if (!isSupabaseConfigured) {
          setImages([
            { id: "1", image_url: "/images/image.png", title: "Kahvaltı Tabağı", description: "En taze ürünlerle hazırlanan serpme kahvaltımız." },
            { id: "2", image_url: "/images/image.png", title: "Mekan", description: "Huzurlu ve sıcak atmosferimiz." },
            { id: "3", image_url: "/images/image.png", title: "Lezzetler", description: "Özel tarifimizle hazırlanan lezzetler." },
            { id: "4", image_url: "/images/image.png", title: "Atmosfer", description: "Keyifli anlar için." },
            { id: "5", image_url: "/images/image.png", title: "Kahvaltı", description: "Doyurucu ve lezzetli." },
            { id: "6", image_url: "/images/image.png", title: "Mekan", description: "Sizi bekliyoruz." },
          ])
        } else {
          setImages([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  // Keyboard navigation for image viewer
  useEffect(() => {
    if (selectedImageIndex === null) return

    function handleKeyDown(e: KeyboardEvent) {
      if (selectedImageIndex === null || images.length === 0) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setSelectedImageIndex((selectedImageIndex + 1) % images.length)
      } else if (e.key === "Escape") {
        e.preventDefault()
        setSelectedImageIndex(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImageIndex, images.length])


  return (
    <main className="min-h-screen relative bg-transparent">
      <div className="relative z-10">
        <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container mx-auto text-center"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-4">
            Fotoğraflar
          </span>
          <h1 className="text-5xl font-serif font-bold mb-4 text-foreground">Galeri</h1>
          <p className="text-xl text-muted-foreground font-light italic max-w-2xl mx-auto">
            Mutfağımızdan çıkan lezzetler ve mekanımızdan keyifli kareler.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 pb-24 relative">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-12 text-center max-w-2xl mx-auto">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-muted-foreground mt-2 italic">
              Supabase bağlantısı yapılandırılmamış olabilir. Mock veriler gösteriliyor.
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-[2.5rem]" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-stone-100"
          >
            <p className="text-muted-foreground text-lg italic">Henüz galeri görseli bulunmuyor.</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            onMouseLeave={() => setHoveredImageIndex(null)}
          >
            {images.map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeIn}
                className={`relative aspect-square overflow-hidden rounded-[2.5rem] group cursor-pointer shadow-lg shadow-stone-200/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-white ${
                  hoveredImageIndex === index
                    ? "z-[100] scale-110 !blur-none"
                    : hoveredImageIndex !== null
                    ? "blur-sm opacity-50"
                    : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
                onMouseEnter={() => {
                  if (hoveredImageIndex !== index) {
                    setHoveredImageIndex(index)
                  }
                }}
                onMouseLeave={() => {
                  if (hoveredImageIndex === index) {
                    setHoveredImageIndex(null)
                  }
                }}
              >
                <Image
                  src={item.image_url}
                  alt={item.title || "Galeri görseli"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px] group-hover:backdrop-blur-none">
                  <div className="bg-white/90 px-6 py-3 rounded-full text-foreground font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Görüntüle
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Full Screen Image Viewer */}
      {selectedImageIndex !== null && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
          <DialogContent className="max-w-[100vw] w-full h-full p-0 overflow-hidden bg-black/95 border-none shadow-none m-0 rounded-none [&+div]:backdrop-blur-md">
            <DialogTitle className="sr-only">
              {images[selectedImageIndex]?.title || `Galeri görseli ${selectedImageIndex + 1}`}
            </DialogTitle>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
                onClick={() => setSelectedImageIndex(null)}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Previous Button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full"
                  onClick={() => {
                    const newIndex = (selectedImageIndex - 1 + images.length) % images.length
                    setSelectedImageIndex(newIndex)
                  }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
              )}

              {/* Next Button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full"
                  onClick={() => {
                    const newIndex = (selectedImageIndex + 1) % images.length
                    setSelectedImageIndex(newIndex)
                  }}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              )}

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <Image
                  key={selectedImageIndex}
                  src={images[selectedImageIndex].image_url}
                  alt={images[selectedImageIndex].title || "Galeri görseli"}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Image Info - Only show page number */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-stone-400 text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

        <Footer />
      </div>
    </main>
  )
}
