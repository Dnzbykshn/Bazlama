"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, Mail, ArrowRight } from "lucide-react"
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

  // Slider state
  const [heroIndex, setHeroIndex] = useState(0)

  const heroImages = ["DSC07011.jpg", "DSC04385.jpg", "Szutest-5.jpg"]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)

    return () => window.clearInterval(intervalId)
  }, [])

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
    <main className="min-h-screen bg-transparent">
      <Header />

      {/* Hero Section */}
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-[60vh] overflow-hidden"
      >
        {/* Slider */}
        {/* Slider */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={heroIndex}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={`/${heroImages[heroIndex]}`}
              alt="Slider Image"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        {/* Content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
        >

          {/* Frosted Map Container */}
          <div className="relative w-[600px] h-[300px] flex items-center justify-center mt-24">
            {/* The Frosted Shape */}
            <div
              className="absolute inset-0 bg-white/80 backdrop-blur-3xl"
              style={{
                maskImage: 'url(/harita.png)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: 'url(/harita.png)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center'
              }}
            />
            {/* Title on top */}
            <h1 className="relative z-10 text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-2xl">
              Şubelerimiz
            </h1>
          </div>

          <p className="text-xl text-white/90 leading-relaxed font-light italic mt-4 max-w-2xl drop-shadow-md">
            Türkiye'nin dört bir yanında sizlerle buluşuyoruz. En yakın şubemizi keşfedin.
          </p>
        </div>
      </motion.div>

      {/* Branches Grid */}
      <section className="container mx-auto px-4 pb-24 mt-24">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground italic">Yükleniyor...</p>
          </div>
        ) : branches.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground italic">Henüz şube eklenmemiş.</p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {branches.map((branch) => {
              const todayHours = getTodayWorkingHours(branch.working_hours)
              return (
                <motion.div key={branch.id} variants={fadeIn} className="group/card">
                  <Card className="overflow-hidden rounded-3xl shadow-xl shadow-stone-200/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-2 border-stone-300/60 hover:border-primary/40 h-full flex flex-col group bg-white ring-1 ring-stone-100/50 hover:ring-primary/20 hover:scale-[1.02]">
                    {branch.image_url && (
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                        <Image
                          src={branch.image_url}
                          alt={branch.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="mb-5">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-slate-900">{branch.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium">{branch.city}</span>
                        </div>
                        {branch.description && (
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-5 italic">
                            {branch.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 mb-5 flex-1">
                        {branch.address && (
                          <div className="flex items-start gap-3 text-sm bg-slate-50/50 rounded-lg p-3">
                            <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                            <span className="text-slate-700 line-clamp-2 italic leading-relaxed">{branch.address}</span>
                          </div>
                        )}
                        {todayHours && (
                          <div className="flex items-center gap-3 text-sm bg-slate-50/50 rounded-lg p-3">
                            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-slate-700 italic">Bugün: <span className="font-semibold not-italic">{todayHours}</span></span>
                          </div>
                        )}
                        {branch.phone && (
                          <div className="flex items-center gap-3 text-sm bg-slate-50/50 rounded-lg p-3">
                            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                            <a href={`tel:${branch.phone}`} className="text-slate-700 hover:text-primary transition-colors font-medium">
                              {branch.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      <Link href={`/subeler/${branch.slug}`}>
                        <Button variant="outline" className="w-full group mt-auto border-2 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300">
                          Detayları Gör
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
    </main >
  )
}
