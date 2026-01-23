"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, ZoomIn, Camera, Star, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Caveat, Inter, Playfair_Display } from "next/font/google"
import { cn } from "@/lib/utils"
import { GalleryPreview } from "@/components/gallery-preview"

// --- FONT AYARLARI ---
const caveat = Caveat({ subsets: ["latin"], weight: ["700"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] })
const inter = Inter({ subsets: ["latin"] })

// --- MARKA RENGİ ---
const accentColor = "#8AD7D6";

interface GalleryItem {
  id: string
  image_url: string
  title: string | null
  description: string | null
  category?: string
}

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
          // MOCK DATA (Temaya uygun içerik)
          const mockData = [
            { id: "1", image_url: "/DSC04385.jpg", title: "Serpme Kahvaltı", description: "En taze ürünlerle hazırlanan serpme kahvaltımız.", category: "Kahvaltı" },
            { id: "2", image_url: "/DSC04385.jpg", title: "Bahçe Keyfi", description: "Zeytin ağaçları altında huzur.", category: "Mekan" },
            { id: "3", image_url: "/DSC04385.jpg", title: "Atom Pişi", description: "Çikolata dolgulu lezzet bombası.", category: "Lezzetler" },
            { id: "4", image_url: "/DSC04385.jpg", title: "Gün Batımı", description: "Sivas manzarası eşliğinde.", category: "Atmosfer" },
            { id: "5", image_url: "/DSC04385.jpg", title: "Simit Tabağı", description: "Sıcak ve çıtır.", category: "Kahvaltı" },
            { id: "6", image_url: "/DSC04385.jpg", title: "İç Mekan", description: "Modern ve sıcak dekorasyon.", category: "Mekan" },
            { id: "7", image_url: "/DSC04385.jpg", title: "Sucuklu Yumurta", description: "Bakır sahanda geleneksel lezzet.", category: "Lezzetler" },
            { id: "8", image_url: "/DSC04385.jpg", title: "Detaylar", description: "Her köşede bir hikaye.", category: "Atmosfer" },
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
        if (!isSupabaseConfigured) {
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

  // Filtreleme
  useEffect(() => {
    if (activeCategory === "Tümü") {
      setFilteredImages(images)
    } else {
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
    <main className={`min-h-screen relative bg-white selection:bg-[#8AD7D6] selection:text-white ${inter.className}`}>
      <div className="relative z-10">
        <Header />
        {/* --- HERO / HEADER BÖLÜMÜ (Temaya Uygun) --- */}
        {/* Arka planda hafif yeşil/teal tonlu gradient ve dekoratif ikonlar */}
        <section className="relative pt-40 pb-16 px-4 overflow-hidden bg-gradient-to-b from-[#e6f4f1] to-white">
        
          {/* Dekoratif Arka Plan İkonları (Silik) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <motion.div 
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 -left-10 text-[#8AD7D6]/10"
             >
                <Coffee size={200} />
             </motion.div>
             <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -right-10 text-[#8AD7D6]/10"
             >
                <Camera size={180} />
             </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto text-center relative z-10"
          >
            {/* Rozet */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-[#8AD7D6]/30 mb-6 shadow-sm">
                <Star className="w-4 h-4 text-[#8AD7D6] fill-[#8AD7D6]" />
                <span className="text-xs font-bold tracking-[0.2em] text-stone-600 uppercase">Bizim Hikayemiz</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold mb-6 text-stone-900 ${playfair.className}`}>
              Mutluluğun <span className="text-[#8AD7D6] italic">Fotoğrafı</span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-500 font-light max-w-2xl mx-auto leading-relaxed">
              Sivas'ın en keyifli köşesinden, en sıcak anlar. <br/>
              Anılarınıza ortak olduğumuz her kare bizim için değerli.
            </p>

            {/* Kategori Filtreleri (Temaya Uygun Tasarım) */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border shadow-sm",
                    activeCategory === cat
                      ? "bg-[#8AD7D6] text-white border-[#8AD7D6] shadow-md scale-105"
                      : "bg-white text-stone-500 border-stone-100 hover:border-[#8AD7D6]/50 hover:text-[#8AD7D6]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* --- GALERİ GRID --- */}
        <div className="container mx-auto px-4 pb-32 min-h-[50vh]">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600 mb-8 mx-auto max-w-2xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-[2rem] bg-stone-100" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-stone-50/50 rounded-[3rem] border border-stone-100"
            >
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-white mb-4 shadow-sm">
                  <Camera className="w-10 h-10 text-stone-300" />
              </div>
              <p className="text-stone-400 text-lg font-medium">Bu kategoride henüz görsel yok.</p>
              <Button 
                variant="link" 
                onClick={() => setActiveCategory("Tümü")}
                className="mt-2 text-[#8AD7D6]"
              >
                Tümünü Göster
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {filteredImages.map((item, index) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                    className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-white shadow-lg shadow-stone-200/40 hover:shadow-2xl hover:shadow-[#8AD7D6]/20 transition-all duration-500 aspect-[4/5] hover:-translate-y-2"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title || "Galeri"}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Hover Overlay - Temaya Uygun */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/90 via-[#022c22]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.category && (
                          <span className="inline-block px-3 py-1 rounded-full bg-[#8AD7D6] text-white text-[10px] font-bold tracking-widest uppercase mb-2 shadow-sm">
                            {item.category}
                          </span>
                        )}
                        <h3 className={`text-white text-2xl mb-1 ${playfair.className}`}>{item.title}</h3>
                        {item.description && (
                          <p className="text-stone-200 text-sm font-light line-clamp-2 leading-relaxed opacity-90">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Büyüteç İkonu */}
                    <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 border border-white/30">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* --- LIGHTBOX (AÇILIR PENCERE) --- */}
        {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
          <Dialog open={true} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
            <DialogContent className="max-w-[100vw] w-full h-full p-0 overflow-hidden bg-[#022c22]/95 border-none shadow-none m-0 rounded-none backdrop-blur-md">
              <DialogTitle className="sr-only">Detaylı Görünüm</DialogTitle>
              
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Kapat Butonu */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 z-50 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12 transition-all hover:rotate-90"
                  onClick={() => setSelectedImageIndex(null)}
                >
                  <X className="w-8 h-8" />
                </Button>

                {/* Navigasyon Butonları */}
                {filteredImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex absolute left-6 z-50 text-white/50 hover:text-[#8AD7D6] hover:bg-white/5 rounded-full w-16 h-16 transition-all hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((selectedImageIndex - 1 + filteredImages.length) % filteredImages.length)
                      }}
                    >
                      <ChevronLeft className="w-10 h-10" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex absolute right-6 z-50 text-white/50 hover:text-[#8AD7D6] hover:bg-white/5 rounded-full w-16 h-16 transition-all hover:scale-110"
                      onClick={(e) => {
                         e.stopPropagation();
                         setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length)
                      }}
                    >
                      <ChevronRight className="w-10 h-10" />
                    </Button>
                  </>
                )}

                {/* Ana Resim */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={selectedImageIndex}
                  className="relative w-full h-full p-4 md:p-20 flex items-center justify-center"
                  onClick={() => setSelectedImageIndex(null)}
                >
                  <div className="relative w-full h-full max-w-7xl max-h-[80vh]">
                    <Image
                      src={filteredImages[selectedImageIndex].image_url}
                      alt={filteredImages[selectedImageIndex].title || "Galeri"}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      quality={95}
                    />
                  </div>
                </motion.div>

                {/* Alt Bilgi Çubuğu */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
                  <div className="container mx-auto flex flex-col md:flex-row justify-between items-end gap-4">
                      <div className="max-w-2xl">
                        {filteredImages[selectedImageIndex].category && (
                            <span className="text-[#8AD7D6] text-xs font-bold tracking-widest uppercase mb-2 block">
                                {filteredImages[selectedImageIndex].category}
                            </span>
                        )}
                        <h2 className={`text-3xl md:text-4xl text-white mb-2 ${playfair.className}`}>
                            {filteredImages[selectedImageIndex].title}
                        </h2>
                        {filteredImages[selectedImageIndex].description && (
                            <p className="text-stone-300 text-sm md:text-base font-light leading-relaxed">
                                {filteredImages[selectedImageIndex].description}
                            </p>
                        )}
                      </div>
                      
                      <div className="text-stone-500 font-mono text-sm border border-stone-700 px-3 py-1 rounded-full">
                        {selectedImageIndex + 1} / {filteredImages.length}
                      </div>
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