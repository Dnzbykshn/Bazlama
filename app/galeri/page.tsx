"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils" // Eğer utils dosyanızda cn varsa kullanın, yoksa silebilirsiniz.

interface GalleryItem {
  id: string
  image_url: string
  title: string | null
  description: string | null
  category?: string // Kategori eklenebilir
}

// Kategorileri veriden türetmek veya sabit tutmak için
const CATEGORIES = ["Tümü", "Kahvaltı", "Mekan", "Lezzetler", "Atmosfer"]

export default function GaleriPage() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryItem[]>([])
  const [activeCategory, setActiveCategory] = useState("Tümü")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true)

        if (!isSupabaseConfigured) {
          // Mock data - Kategorileri başlık veya açıklamadan uyduruyoruz simülasyon için
          const mockData = [
            { id: "1", image_url: "/images/image.png", title: "Serpme Kahvaltı", description: "En taze ürünlerle hazırlanan serpme kahvaltımız.", category: "Kahvaltı" },
            { id: "2", image_url: "/images/image.png", title: "Bahçe Keyfi", description: "Huzurlu ve sıcak atmosferimiz.", category: "Mekan" },
            { id: "3", image_url: "/images/image.png", title: "Özel Soslu Patates", description: "Özel tarifimizle hazırlanan lezzetler.", category: "Lezzetler" },
            { id: "4", image_url: "/images/image.png", title: "Akşam Işıkları", description: "Keyifli anlar için.", category: "Atmosfer" },
            { id: "5", image_url: "/images/image.png", title: "Simit Tabağı", description: "Doyurucu ve lezzetli.", category: "Kahvaltı" },
            { id: "6", image_url: "/images/image.png", title: "İç Mekan", description: "Sizi bekliyoruz.", category: "Mekan" },
            { id: "7", image_url: "/images/image.png", title: "Menemen", description: "Bakır sahanda sıcak lezzet.", category: "Lezzetler" },
            { id: "8", image_url: "/images/image.png", title: "Detaylar", description: "İnce dokunuşlar.", category: "Atmosfer" },
          ]
          setImages(mockData)
          setFilteredImages(mockData)
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
        setFilteredImages(data || [])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching gallery:", err)
        setError(err.message || "Galeri yüklenirken bir hata oluştu")
        
        // Fallback mock
        if (!isSupabaseConfigured) {
           // ... (Yukarıdaki mock datanın aynısı buraya da eklenebilir)
           setImages([]) 
        } else {
          setImages([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  // Kategori Filtreleme Mantığı
  useEffect(() => {
    if (activeCategory === "Tümü") {
      setFilteredImages(images)
    } else {
      // Not: Gerçek veride 'category' alanı yoksa title veya description içinde arama yapabiliriz
      setFilteredImages(images.filter(img => 
        (img.category === activeCategory) || 
        (img.title?.includes(activeCategory)) ||
        (img.description?.includes(activeCategory))
      ))
    }
  }, [activeCategory, images])

  // Klavye Kontrolleri
  useEffect(() => {
    if (selectedImageIndex === null) return

    function handleKeyDown(e: KeyboardEvent) {
      if (selectedImageIndex === null || filteredImages.length === 0) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setSelectedImageIndex((selectedImageIndex - 1 + filteredImages.length) % filteredImages.length)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length)
      } else if (e.key === "Escape") {
        e.preventDefault()
        setSelectedImageIndex(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImageIndex, filteredImages.length])

  return (
    <main className="min-h-screen relative bg-white selection:bg-stone-200">
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-8 px-4 border-b border-stone-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-medium mb-4 text-stone-900 tracking-tight">
              Galeri
            </h1>
            <p className="text-lg text-stone-500 font-light max-w-2xl mx-auto">
              Mutfağımızdan çıkan lezzetler, mekanımızın huzurlu köşeleri ve unutulmaz anlar.
            </p>

            {/* Kategori Filtreleri */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                    activeCategory === cat
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        <div className="container mx-auto px-4 py-12 min-h-[50vh]">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center text-red-600 mb-8">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl bg-stone-100" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-400 text-lg">Bu kategoride görsel bulunamadı.</p>
              <Button 
                variant="link" 
                onClick={() => setActiveCategory("Tümü")}
                className="mt-2 text-stone-800"
              >
                Tümünü Göster
              </Button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredImages.map((item, index) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative cursor-pointer overflow-hidden rounded-xl bg-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/5]"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title || "Galeri"}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Hover Overlay - Modern Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.category && (
                          <span className="text-stone-300 text-xs font-medium tracking-wider uppercase mb-1 block">
                            {item.category}
                          </span>
                        )}
                        <h3 className="text-white font-serif text-xl mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-stone-300 text-sm line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Zoom Icon Hint */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Full Screen Image Viewer (Lightbox) */}
        {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
          <Dialog open={true} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
            <DialogContent className="max-w-[100vw] w-full h-full p-0 overflow-hidden bg-stone-950/95 border-none shadow-none m-0 rounded-none backdrop-blur-xl">
              <DialogTitle className="sr-only">Detaylı Görünüm</DialogTitle>
              
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 z-50 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12"
                  onClick={() => setSelectedImageIndex(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                {/* Navigation Buttons */}
                {filteredImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex absolute left-6 z-50 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((selectedImageIndex - 1 + filteredImages.length) % filteredImages.length)
                      }}
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex absolute right-6 z-50 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12"
                      onClick={(e) => {
                         e.stopPropagation();
                         setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length)
                      }}
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                  </>
                )}

                {/* Main Image */}
                <div 
                  className="relative w-full h-full p-4 md:p-12 flex items-center justify-center"
                  onClick={() => setSelectedImageIndex(null)} // Click outside to close
                >
                  <div className="relative w-full h-full max-w-7xl max-h-[85vh]">
                    <Image
                      key={selectedImageIndex}
                      src={filteredImages[selectedImageIndex].image_url}
                      alt={filteredImages[selectedImageIndex].title || "Galeri"}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      quality={90}
                    />
                  </div>
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-center md:text-left md:flex md:justify-between md:items-end pointer-events-none">
                  <div className="max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">
                        {filteredImages[selectedImageIndex].title}
                    </h2>
                    {filteredImages[selectedImageIndex].description && (
                         <p className="text-stone-300 text-sm md:text-base font-light">
                            {filteredImages[selectedImageIndex].description}
                         </p>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0 text-stone-500 font-mono text-sm">
                    {selectedImageIndex + 1} / {filteredImages.length}
                  </div>
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