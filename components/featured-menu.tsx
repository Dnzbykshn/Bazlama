"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface MenuItem {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export function FeaturedMenu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        if (!isSupabaseConfigured) {
          setItems([
            { id: "1", title: "Serpme Kahvaltı", description: "Tüm lezzetlerin bir arada olduğu zengin kahvaltı tabağı", price: 450, image_url: "/images/image.png" },
            { id: "2", title: "Menemen", description: "Geleneksel tarifimizle hazırlanan özel menemen", price: 180, image_url: "/images/image.png" },
            { id: "3", title: "Tereyağlı Bal", description: "Organik tereyağı ve doğal balımız", price: 120, image_url: "/images/image.png" },
          ])
          setLoading(false)
          return
        }

        const { data, error } = await supabase.from("menu_items").select("*").limit(3)
        if (error) throw error
        setItems(data || [])
      } catch (error) {
        if (!isSupabaseConfigured) {
          setItems([
            { id: "1", title: "Serpme Kahvaltı", description: "Tüm lezzetlerin bir arada olduğu zengin kahvaltı tabağı", price: 450, image_url: "/images/image.png" },
            { id: "2", title: "Menemen", description: "Geleneksel tarifimizle hazırlanan özel menemen", price: 180, image_url: "/images/image.png" },
            { id: "3", title: "Tereyağlı Bal", description: "Organik tereyağı ve doğal balımız", price: 120, image_url: "/images/image.png" },
          ])
        } else {
          setItems([])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchMenuItems()
  }, [])

  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold mb-4">Öne Çıkan Lezzetler</h2>
          <p className="text-muted-foreground text-lg">En çok tercih edilen lezzetlerimiz</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">Yükleniyor...</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group bg-white rounded-[2.5rem] p-4 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-stone-100"
              >
                <div className="relative w-full h-48 rounded-[2rem] overflow-hidden mb-6 bg-secondary">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-primary shadow-lg">
                    {item.price.toFixed(0)} ₺
                  </div>
                </div>

                <div className="px-2 pb-2 text-center">
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{item.title}</h3>
                  {item.description && <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/menu">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-2 hover:bg-stone-50">
              Tüm Menüyü Gör
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
