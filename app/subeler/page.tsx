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
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
              Şubelerimiz
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
              Şubelerimiz
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Türkiye'nin dört bir yanında sizlerle buluşuyoruz. En yakın şubemizi keşfedin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="container mx-auto px-4 pb-24">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        ) : branches.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Henüz şube eklenmemiş.</p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {branches.map((branch) => {
              const todayHours = getTodayWorkingHours(branch.working_hours)
              return (
                <motion.div key={branch.id} variants={fadeIn}>
                  <Card className="overflow-hidden rounded-[2rem] shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-stone-100 h-full flex flex-col group">
                    {branch.image_url && (
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={branch.image_url}
                          alt={branch.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="mb-4">
                        <h3 className="text-2xl font-serif font-bold mb-2">{branch.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{branch.city}</span>
                        </div>
                        {branch.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                            {branch.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 mb-4 flex-1">
                        {branch.address && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground line-clamp-2">{branch.address}</span>
                          </div>
                        )}
                        {todayHours && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">Bugün: {todayHours}</span>
                          </div>
                        )}
                        {branch.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <a href={`tel:${branch.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                              {branch.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      <Link href={`/subeler/${branch.slug}`}>
                        <Button variant="outline" className="w-full group mt-auto">
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
    </main>
  )
}
