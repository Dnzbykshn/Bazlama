"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, type Variants } from "framer-motion"

interface UnlimitedMenu {
  id: string
  title: string
  price: number
  description: string | null
}

interface UnlimitedMenuItem {
  id: string
  title: string
  description: string | null
  image_url: string | null
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
  const [menu, setMenu] = useState<UnlimitedMenu | null>(null)
  const [menuItems, setMenuItems] = useState<UnlimitedMenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUnlimitedMenu() {
      try {
        setLoading(true)

        if (!isSupabaseConfigured) {
          // Mock data
          setMenu({
            id: "1",
            title: "Sınırsız Kahvaltı",
            price: 1150.00,
            description: "Kahvaltıya çay dahil, kişi başı sınırsızdır."
          })
          setMenuItems([
            { id: "1", title: "Evden Patatesli Yumurta", description: "Sahanda, alıştığımız ev lezzeti...", image_url: "/images/image.png" },
            { id: "2", title: "Peynir Şöleni", description: "Mevsim ne getirirse, soframıza o düşer...", image_url: "/images/image.png" },
            { id: "3", title: "Ege Sofrasından Limonlu Kabak", description: "Kabak ve havuç rendelendi...", image_url: "/images/image.png" },
          ])
          setLoading(false)
          return
        }

        // Fetch menu
        const { data: menuData, error: menuError } = await supabase
          .from("unlimited_menu")
          .select("*")
          .eq("active", true)
          .limit(1)
          .single()

        if (menuError && menuError.code !== "PGRST116") throw menuError

        if (menuData) {
          setMenu(menuData)
          // Fetch menu items
          const { data: itemsData, error: itemsError } = await supabase
            .from("unlimited_menu_items")
            .select("*")
            .eq("menu_id", menuData.id)
            .order("position", { ascending: true, nullsFirst: false })
            .order("created_at", { ascending: false })

          if (itemsError) throw itemsError
          setMenuItems(itemsData || [])
        }
      } catch (err: any) {
        console.error("Error fetching unlimited menu:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUnlimitedMenu()
  }, [])

  return (
    <main className="min-h-screen">
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
        {loading ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="w-full h-32 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="w-full aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        ) : menu ? (
          <>
            {/* Menu Price Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-3xl mx-auto mb-12"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 shadow-xl border border-primary/20">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 text-center">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full mb-4 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-medium text-slate-700 uppercase tracking-wider">Sınırsız</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-3">
                    {menu.title}
                  </h2>
                  
                  {/* Description */}
                  {menu.description && (
                    <p className="text-sm md:text-base text-slate-600 mb-6 max-w-xl mx-auto leading-relaxed">
                      {menu.description}
                    </p>
                  )}
                  
                  {/* Price */}
                  <div className="inline-flex flex-col items-center gap-1.5 bg-white/90 backdrop-blur-sm px-6 md:px-8 py-4 rounded-xl shadow-lg border border-white/50">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        {menu.price.toFixed(2)}
                      </span>
                      <span className="text-lg md:text-xl font-semibold text-slate-700">TL</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kişi Başı</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Menu Items Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              <h3 className="text-2xl font-serif font-bold text-center mb-8 text-foreground">
                Sınırsız Kahvaltı İçeriği
              </h3>
              {menuItems.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-stone-100">
                  <span className="text-4xl block mb-4">🍽️</span>
                  <p className="text-muted-foreground text-lg">Henüz menü içeriği eklenmemiş.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={fadeIn}
                      className="bg-white rounded-lg p-2 md:p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-stone-100 group"
                    >
                      {/* Thumbnail Image */}
                      <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2 bg-slate-100">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <span className="text-xl opacity-20">🍽️</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h4 className="font-semibold text-slate-900 text-xs md:text-sm mb-1 line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                      
                      {/* Description */}
                      {item.description && (
                        <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2 leading-tight">
                          {item.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-100">
            <span className="text-4xl block mb-4">🍽️</span>
            <p className="text-muted-foreground text-lg">Menü bilgisi bulunamadı.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
