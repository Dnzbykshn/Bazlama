"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, X, ZoomIn, Camera, Star, Coffee, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Caveat, Inter, Playfair_Display, Patrick_Hand } from "next/font/google"
import { cn } from "@/lib/utils"

// --- FONT AYARLARI ---
const caveat = Caveat({ subsets: ["latin"], weight: ["700"] })
const patrick = Patrick_Hand({ subsets: ["latin"], weight: ["400"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] })
const inter = Inter({ subsets: ["latin"] })

// --- TİPLER ---
interface GalleryItem {
  id: string
  image_url: string
  title: string | null
  description: string | null
  category?: string
}

const CATEGORIES = ["Tümü", "Kahvaltı", "Mekan", "Lezzetler", "Atmosfer"]

// --- GALERİ DETAY MODALI (YENİLENMİŞ) ---
const GalleryDetailModal = ({ 
    item, 
    isOpen, 
    onClose,
    onNext,
    onPrev,
    hasPrev,
    hasNext 
}: { 
    item: GalleryItem | null, 
    isOpen: boolean, 
    onClose: () => void,
    onNext: () => void,
    onPrev: () => void,
    hasPrev: boolean,
    hasNext: boolean
}) => {
    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Arka Plan Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
                    >
                        {/* Modal Kartı */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#fffcf8] rounded-[2.5rem] shadow-2xl w-full max-w-5xl h-[85vh] md:h-[700px] overflow-hidden relative border border-white flex flex-col md:flex-row"
                        >
                            {/* Kapat Butonu */}
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all border border-stone-100 shadow-sm group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            </button>

                            {/* SOL TARAF: RESİM */}
                            <div className="relative w-full md:w-[60%] h-[50%] md:h-full bg-stone-100 group">
                                <Image 
                                    src={item.image_url} 
                                    alt={item.title || "Galeri"} 
                                    fill 
                                    className="object-cover" 
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                                
                                {/* Navigasyon Okları (Resim Üzerinde) */}
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                                        disabled={!hasPrev}
                                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#8AD7D6] transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                                        disabled={!hasNext}
                                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#8AD7D6] transition-all disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Kategori Etiketi */}
                                <div className="absolute bottom-6 left-6">
                                    <span className="px-4 py-1.5 bg-white/90 text-[#8AD7D6] text-xs font-bold uppercase tracking-widest rounded-full shadow-lg border border-white/50 backdrop-blur-sm flex items-center gap-2">
                                        <Camera size={14} />
                                        {item.category || "Galeri"}
                                    </span>
                                </div>
                            </div>

                            {/* SAĞ TARAF: DETAYLAR */}
                            <div className="w-full md:w-[40%] h-[50%] md:h-full p-8 md:p-12 flex flex-col justify-center relative bg-[#fffcf8]">
                                {/* Dekoratif Arka Plan */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8AD7D6]/10 rounded-bl-full pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/5 rounded-tr-full pointer-events-none"></div>

                                <motion.div 
                                    key={item.id} // İçerik değişince animasyon tetiklensin
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h3 className={`text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight ${playfair.className}`}>
                                        {item.title || "Anı Yakala"}
                                    </h3>
                                    
                                    <div className="w-16 h-1 bg-[#8AD7D6] rounded-full mb-8"></div>

                                    <p className={`text-slate-600 text-xl leading-relaxed ${patrick.className}`}>
                                        {item.description || "Bu kare, misafirlerimizle paylaştığımız en güzel anlardan biri. Pişi Kahvaltı'da her detay sevgiyle hazırlanır."}
                                    </p>

                                    <div className="mt-12 flex items-center gap-4 text-stone-400 text-sm font-medium">
                                        <div className="w-8 h-[1px] bg-stone-300"></div>
                                        <span>Pişi Kahvaltı Sivas</span>
                                    </div>
                                </motion.div>
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default function GaleriPage() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryItem[]>([])
  const [activeCategory, setActiveCategory] = useState("Tümü")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal State'leri
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const isModalOpen = selectedImageIndex !== null

  // Sonraki / Önceki Fonksiyonları
  const handleNext = () => {
      if (selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1) {
          setSelectedImageIndex(selectedImageIndex + 1);
      }
  };

  const handlePrev = () => {
      if (selectedImageIndex !== null && selectedImageIndex > 0) {
          setSelectedImageIndex(selectedImageIndex - 1);
      }
  };

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true)

        if (!isSupabaseConfigured) {
          // MOCK DATA
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
        handlePrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        handleNext()
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
        
        {/* YENİ MODAL BİLEŞENİ */}
        <GalleryDetailModal 
            item={selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null} 
            isOpen={isModalOpen} 
            onClose={() => setSelectedImageIndex(null)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1}
            hasPrev={selectedImageIndex !== null && selectedImageIndex > 0}
        />

        {/* --- HERO / HEADER BÖLÜMÜ --- */}
        <section className="relative pt-40 pb-16 px-4 overflow-hidden bg-gradient-to-b from-[#e6f4f1] to-white">
        
          {/* Dekoratif Arka Plan İkonları */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 -left-10 text-[#8AD7D6]/10"
              >
                <Coffee size={200} />
              </motion.div>
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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

            {/* Kategori Filtreleri */}
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
                    className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-white shadow-lg shadow-stone-200/40 hover:shadow-2xl hover:shadow-[#8AD7D6]/20 transition-all duration-500 aspect-[4/5] hover:-translate-y-2 border border-stone-50"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title || "Galeri"}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/80 via-[#022c22]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.category && (
                          <span className="inline-block px-3 py-1 rounded-full bg-[#8AD7D6] text-white text-[10px] font-bold tracking-widest uppercase mb-2 shadow-sm">
                            {item.category}
                          </span>
                        )}
                        <h3 className={`text-white text-2xl mb-1 ${playfair.className}`}>{item.title}</h3>
                      </div>
                    </div>

                    {/* Büyüteç İkonu */}
                    <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 border border-white/30 hover:bg-white hover:text-[#8AD7D6] text-white">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <Footer />
      </div>
    </main>
  )
}