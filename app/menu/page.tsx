"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, type Variants, AnimatePresence } from "framer-motion"

interface MenuItem {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
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

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true)

        // If Supabase is not configured, use mock data directly
        if (!isSupabaseConfigured) {
          const mockData = [
            { id: "1", title: "Serpme Kahvaltı", description: "Peynir çeşitleri, zeytinler, reçeller, bal-kaymak, yumurta ve sınırsız çay ile zenginleştirilmiş kahvaltı keyfi.", price: 450, image_url: "/images/image.png", category: "Kahvaltı" },
            { id: "2", title: "Menemen", description: "Kızarmış ekmek ve taze malzemelerle hazırlanan, isteğe göre kaşarlı veya sucuklu seçenekleriyle.", price: 180, image_url: "/images/image.png", category: "Sıcaklar" },
            { id: "3", title: "Mıhlama", description: "Karadeniz'in meşhur lezzeti; tereyağı, mısır unu ve özel peyniriyle uzayıp giden bir tat.", price: 200, image_url: "/images/image.png", category: "Sıcaklar" },
            { id: "4", title: "Pişi Tabağı", description: "Anne eli değmiş gibi, yanında peynir ve domates ile servis edilen sıcacık pişiler.", price: 150, image_url: "/images/image.png", category: "Hamur İşi" },
            { id: "5", title: "Gözleme", description: "İncecik açılmış hamur içerisinde mevsim yeşillikleri veya peynir seçenekleriyle.", price: 160, image_url: "/images/image.png", category: "Hamur İşi" },
            { id: "6", title: "Türk Kahvesi", description: "Geleneksel sunumu ve yanında lokumu ile közde pişen Türk kahvesi.", price: 90, image_url: "/images/image.png", category: "İçecekler" },
          ]

          const filtered = selectedCategory
            ? mockData.filter((item) => item.category === selectedCategory)
            : mockData

          setItems(filtered)
          setError(null)
          setLoading(false)
          return
        }

        let query = supabase.from("menu_items").select("*").order("title")

        if (selectedCategory) {
          query = query.eq("category", selectedCategory)
        }

        const { data, error } = await query

        if (error) throw error
        setItems(data || [])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching menu items:", err)
        setError(err.message || "Menü yüklenirken bir hata oluştu")

        // Fallback mock data
        if (!isSupabaseConfigured) {
          const mockData = [
            { id: "1", title: "Serpme Kahvaltı", description: "Peynir çeşitleri, zeytinler, reçeller, bal-kaymak, yumurta ve sınırsız çay ile zenginleştirilmiş kahvaltı keyfi.", price: 450, image_url: "/images/image.png", category: "Kahvaltı" },
            { id: "2", title: "Menemen", description: "Kızarmış ekmek ve taze malzemelerle hazırlanan, isteğe göre kaşarlı veya sucuklu seçenekleriyle.", price: 180, image_url: "/images/image.png", category: "Sıcaklar" },
            { id: "3", title: "Mıhlama", description: "Karadeniz'in meşhur lezzeti; tereyağı, mısır unu ve özel peyniriyle uzayıp giden bir tat.", price: 200, image_url: "/images/image.png", category: "Sıcaklar" },
          ]
          const filtered = selectedCategory
            ? mockData.filter((item) => item.category === selectedCategory)
            : mockData
          setItems(filtered)
        } else {
          setItems([])
        }

      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [selectedCategory])

  // Mock categories for better visual if empty
  const categories = ["Kahvaltı", "Sıcaklar", "Hamur İşi", "İçecekler"]

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
            Lezzetlerimiz
          </span>
          <h1 className="text-5xl font-serif font-bold mb-4 text-foreground">Menü</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Geleneksel lezzetler, özenli sunumlar ve unutulmaz tatlar.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 pb-24">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-16"
        >
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-6 transition-all duration-300 ${selectedCategory === null ? 'shadow-lg shadow-primary/25 scale-105' : 'bg-white border-stone-200 hover:bg-stone-50'}`}
          >
            Tümü
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 transition-all duration-300 ${selectedCategory === category ? 'shadow-lg shadow-primary/25 scale-105' : 'bg-white border-stone-200 hover:bg-stone-50'}`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-12 text-center max-w-2xl mx-auto">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Supabase bağlantısı yapılandırılmamış olabilir. Mock veriler gösteriliyor.
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full h-64 rounded-[2.5rem]" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100">
            <span className="text-4xl block mb-4">🍽️</span>
            <p className="text-muted-foreground text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-stone-100 group"
                >
                  <div className="relative w-full h-64 rounded-[2rem] overflow-hidden mb-6 bg-secondary">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-stone-100">
                        <span className="text-4xl opacity-20">🍽️</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-primary shadow-lg">
                      {item.price.toFixed(0)} ₺
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-serif font-bold text-foreground">{item.title}</h3>
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground leading-relaxed text-sm mb-6 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    <Button className="w-full rounded-xl h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group-hover:translate-y-[-2px]">
                      Sipariş Ver
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <Footer />
    </main>
  )
}
