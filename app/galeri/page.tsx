"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
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
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Mutfağımızdan çıkan lezzetler ve mekanımızdan keyifli kareler.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 pb-24">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-12 text-center max-w-2xl mx-auto">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
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
            <p className="text-muted-foreground text-lg">Henüz galeri görseli bulunmuyor.</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {images.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <motion.div
                    variants={fadeIn}
                    className="relative aspect-square overflow-hidden rounded-[2.5rem] group cursor-pointer shadow-lg shadow-stone-200/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 bg-white"
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
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-transparent border-none shadow-none text-white sm:rounded-[2rem]">
                  <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-stone-900/90 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-2xl">
                    <Image
                      src={item.image_url}
                      alt={item.title || "Galeri görseli"}
                      fill
                      className="object-contain p-4"
                    />
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="font-serif font-bold text-2xl mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-stone-300 font-light text-lg">{item.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </main>
  )
}
