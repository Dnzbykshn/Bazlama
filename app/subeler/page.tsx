"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, type Variants } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, ArrowRight, Store, Compass } from "lucide-react"
import { Caveat, Inter, Playfair_Display } from "next/font/google"

// --- FONT AYARLARI ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] })
const inter = Inter({ subsets: ["latin"] })

// --- MARKA RENGİ ---
const accentColor = "#8AD7D6";

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

export default function SubelerPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBranches()
  }, [])

  async function fetchBranches() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .eq("active", true)
        .order("city", { ascending: true })
        .order("name", { ascending: true })

      if (error) throw error
      setBranches(data || [])
    } catch (error) {
      console.error("Error fetching branches:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTodayWorkingHours = (workingHours: Branch["working_hours"]) => {
    if (!workingHours) return null
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const today = days[new Date().getDay()]
    return workingHours[today as keyof typeof workingHours] || null
  }

  return (
    <main className={`min-h-screen bg-white selection:bg-[#8AD7D6] selection:text-white ${inter.className}`}>
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden bg-gradient-to-b from-[#e6f4f1] to-white">
        
        {/* Dekoratif Arka Plan İkonları (Silik) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -left-10 text-[#8AD7D6]/10"
           >
              <Compass size={250} strokeWidth={1} />
           </motion.div>
           <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -right-10 text-[#8AD7D6]/10"
           >
              <MapPin size={200} strokeWidth={1} />
           </motion.div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            {/* Rozet */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-[#8AD7D6]/30 shadow-sm">
                <Store className="w-4 h-4 text-[#8AD7D6]" />
                <span className="text-xs font-bold tracking-[0.2em] text-stone-600 uppercase">Lokasyonlar</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold text-stone-900 ${playfair.className}`}>
              Size En Yakın <span className="text-[#8AD7D6] italic">Lezzet</span> Durağı
            </h1>
            
            <p className="text-lg md:text-xl text-stone-500 font-light italic leading-relaxed">
              Türkiye'nin dört bir yanında, aynı sıcaklık ve lezzetle sizlerle buluşuyoruz. <br className="hidden md:block" />
              Size en yakın şubemizi keşfedin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- BRANCHES GRID --- */}
      <section className="container mx-auto px-4 pb-32 min-h-[50vh]">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[500px] w-full bg-stone-100 animate-pulse rounded-[2.5rem]"></div>
             ))}
          </div>
        ) : branches.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto text-center py-20 bg-stone-50 rounded-[3rem] border border-stone-100"
          >
             <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-white mb-4 shadow-sm">
                  <MapPin className="w-10 h-10 text-stone-300" />
              </div>
            <p className="text-stone-400 text-lg font-medium">Henüz aktif şube bulunmuyor.</p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {branches.map((branch, index) => {
              const todayHours = getTodayWorkingHours(branch.working_hours)
              
              // ESKİZ EFEKTİ İÇİN YAMUK KENARLAR (Tek/Çift mantığı)
              const radiusStyle = index % 2 === 0 
                  ? "255px 15px 225px 15px / 15px 225px 15px 255px" 
                  : "15px 225px 15px 255px / 255px 15px 225px 15px";

              return (
                <motion.div key={branch.id} variants={fadeIn} className="group h-full">
                  
                  {/* --- ESKİZ GÖRÜNÜMLÜ KART --- */}
                  <Card 
                    className="h-full border-[3px] border-stone-900 shadow-[8px_8px_0px_rgba(0,0,0,0.15)] hover:shadow-[12px_12px_0px_#8AD7D6] transition-all duration-300 overflow-hidden flex flex-col bg-white hover:-translate-y-2"
                    style={{ borderRadius: radiusStyle }}
                   >
                    
                    {/* Resim Alanı (Altına kalın çizgi eklendi) */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border-b-[3px] border-stone-900">
                      {branch.image_url ? (
                        <Image
                          src={branch.image_url}
                          alt={branch.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-50 text-stone-300">
                            <Store className="w-16 h-16" />
                        </div>
                      )}
                      
                      {/* Şehir Rozeti (Eskiz tarzı) */}
                      <div className="absolute top-4 left-4 rotate-[-2deg] group-hover:rotate-0 transition-transform">
                         <span className="inline-block px-4 py-1 bg-white border-2 border-stone-900 text-stone-900 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-md">
                            {branch.city}
                         </span>
                      </div>
                    </div>

                    <CardContent className="p-8 flex flex-col flex-1 relative">
                      {/* Başlık */}
                      <div className="mb-6 text-center">
                        <h3 className={`text-2xl md:text-3xl font-bold text-stone-900 mb-3 ${playfair.className}`}>
                            {branch.name}
                        </h3>
                        {/* Süsleme Çizgisi */}
                        <div className="h-1 w-16 bg-[#8AD7D6] mx-auto rounded-full opacity-60 mb-4"></div>

                        {branch.description && (
                          <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 font-medium">
                            {branch.description}
                          </p>
                        )}
                      </div>

                      {/* Bilgiler */}
                      <div className="space-y-4 mb-8 flex-1 px-2">
                        {branch.address && (
                          <div className="flex items-start gap-3 group/item">
                            <MapPin className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5 fill-[#8AD7D6]" />
                            <span className="text-stone-700 text-sm leading-snug font-bold">
                                {branch.address}
                            </span>
                          </div>
                        )}
                        
                        {todayHours && (
                          <div className="flex items-center gap-3 group/item">
                            <Clock className="w-5 h-5 text-stone-900 flex-shrink-0 fill-[#fcd34d]" />
                            <div className="text-sm">
                                <span className="text-stone-900 font-bold mr-2">Bugün:</span>
                                <span className="text-stone-700 font-medium bg-stone-100 px-2 py-0.5 rounded border border-stone-200">{todayHours}</span>
                            </div>
                          </div>
                        )}

                        {branch.phone && (
                          <div className="flex items-center gap-3 group/item">
                            <Phone className="w-5 h-5 text-stone-900 flex-shrink-0 fill-[#8AD7D6]" />
                            <a href={`tel:${branch.phone}`} className="text-stone-700 hover:text-[#8AD7D6] transition-colors font-bold text-sm underline decoration-2 decoration-[#8AD7D6]/40">
                              {branch.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Buton (Eskiz tarzı) */}
                      <Link href={`/subeler/${branch.slug}`} className="mt-auto">
                        <Button 
                            className="w-full bg-stone-900 text-white hover:bg-[#8AD7D6] border-[2px] border-stone-900 h-12 text-base font-bold transition-all duration-300 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-xl"
                        >
                          Şube Detayları
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>

                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  )
}