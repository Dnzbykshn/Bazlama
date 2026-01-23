"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, type Variants } from "framer-motion"
import { Flower2 } from "lucide-react"

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

  // Slider state
  const [heroIndex, setHeroIndex] = useState(0)
  const [isResetting, setIsResetting] = useState(false)

  const originalImages = ["DSC07011.jpg", "DSC04385.jpg", "Szutest-5.jpg"]
  const heroImages = [...originalImages, originalImages[0]]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroIndex((prev) => prev + 1)
    }, 3000)

    return () => window.clearInterval(intervalId)
  }, [])

  // Handle infinite loop reset
  useEffect(() => {
    if (heroIndex === heroImages.length - 1) {
      // Wait for animation to finish then snap to start
      const timeout = setTimeout(() => {
        setIsResetting(true)
        setHeroIndex(0)
      }, 1000) // matches transition duration
      return () => clearTimeout(timeout)
    } else if (heroIndex === 0 && isResetting) {
      // Enable animation after snap
      const timeout = setTimeout(() => {
        setIsResetting(false)
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [heroIndex, isResetting, heroImages.length])

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
    <main className="min-h-screen bg-transparent">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="w-full h-full">
          <div className="relative w-full h-full">
            {/* Sliding images */}
            <motion.div
              className="flex h-full"
              animate={{ x: `-${heroIndex * (100 / heroImages.length)}%` }}
              transition={{ duration: isResetting ? 0 : 1, ease: "easeInOut" }}
              style={{ width: `${heroImages.length * 100}%` }}
            >
              {heroImages.map((src, idx) => (
                <div key={`${src}-${idx}`} className="relative h-full" style={{ width: `${100 / heroImages.length}%` }}>
                  <Image
                    src={src}
                    alt="Menü üst görseli"
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              ))}
            </motion.div>

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium tracking-wide mb-4 border border-white/30">
                Lezzetlerimiz
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 text-white drop-shadow-md">Menü</h1>
              <p className="text-lg md:text-2xl text-white/90 font-light italic max-w-2xl drop-shadow-sm">
                Geleneksel lezzetler, özenli sunumlar ve unutulmaz tatlar.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                  {menu?.title || "Sınırsız Kahvaltı"}
                </h2>
                <p className="mt-2 text-base sm:text-lg text-white/90 italic">
                  {menu?.description || "Kahvaltıya çay dahil, kişi başı sınırsızdır."}
                </p>
              </div>
            </div>
          </div>
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
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative text-center space-y-6 isolate mx-auto w-[1470px] max-w-[95vw] h-[300px] flex flex-col justify-center">
                {/* Background image behind the texts */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-0 w-screen overflow-hidden rounded-3xl">
                  <Image
                    src="/hero.png"
                    alt=""
                    fill
                    className="object-cover object-left opacity-40"
                    priority
                  />
                  <div className="absolute inset-0 bg-white/45"></div>
                </div>
                <div className="relative z-10">
                  {/* Main Title */}
                  <h2 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-3 tracking-tight">
                    {menu.title}
                  </h2>
                  
                  {/* Description */}
                  {menu.description && (
                    <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed italic max-w-xl mx-auto">
                      {menu.description}
                    </p>
                  )}
                  
                  {/* Price with underline */}
                  <div className="inline-block">
                    <div className="relative">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          {menu.price.toFixed(2)}
                        </span>
                        <span className="text-xl md:text-2xl font-semibold text-slate-700">TL</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 italic">(Kişi Başı)</p>
                      <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
                    </div>
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
              <div className="relative w-[450px] h-[220px] mx-auto -mt-25 -mb-15  flex items-center justify-center">
                <Image
                  src="/baslık_cerceve.png"
                  alt="Ürünlerimiz Çerçevesi"
                  fill
                  className="object-contain opacity-100"
                />
                <h3 className="relative z-10 text-3xl font-serif font-bold text-center text-black pb-2">
                  Ürünlerimiz
                </h3>
              </div>
              {menuItems.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-stone-100">
                  <span className="text-4xl block mb-4">🍽️</span>
                  <p className="text-muted-foreground text-lg italic">Henüz menü içeriği eklenmemiş.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={fadeIn}
                      className="flex flex-col p-3 rounded-xl group"
                    >
                      <div className="flex items-start gap-1.5">
                        {/* Circular Image */}
                        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-full overflow-hidden bg-slate-50 border-4 border-stone-100 shadow-sm">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="(max-width: 768px) 96px, 112px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <span className="text-lg opacity-20">🍽️</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-3 md:pt-4">
                          {/* Title */}
                          <h4 className="font-serif font-bold text-slate-900 text-sm md:text-base mb-1.5 leading-tight">
                            {item.title}
                          </h4>

                          {/* Description */}
                          {item.description && (
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic line-clamp-3">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Separator Line */}
                      {/* Separator Line with Rose */}
                      <div className="flex items-center gap-3 mt-4">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/40 to-white/10 rounded-full -mt-3" />
                        <Flower2 className="w-5 h-5 text-white/60 rotate-45 -mt-4" strokeWidth={1} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-100">
            <span className="text-4xl block mb-4">🍽️</span>
            <p className="text-muted-foreground text-lg italic">Menü bilgisi bulunamadı.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
