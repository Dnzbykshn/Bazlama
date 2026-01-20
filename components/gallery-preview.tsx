"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface GalleryItem {
  id: string
  image_url: string
  title: string | null
}

export function GalleryPreview() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGallery() {
      try {
        if (!isSupabaseConfigured) {
          setImages([
            { id: "1", image_url: "/images/image.png", title: "Kahvaltı" },
            { id: "2", image_url: "/images/image.png", title: "Mekan" },
            { id: "3", image_url: "/images/image.png", title: "Detay" },
            { id: "4", image_url: "/images/image.png", title: "Atmosfer" },
          ])
          setLoading(false)
          return
        }

        const { data } = await supabase
          .from("gallery")
          .select("*")
          .order("position", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false })
          .limit(4)
        setImages(data || [])
      } catch (error) {
        setImages([])
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  if (loading) return null

  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold mb-4">Galeri</h2>
          <p className="text-muted-foreground text-lg">Mekanımızdan ve lezzetlerimizden kareler</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto h-[600px] md:h-[500px]">
          {images.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-[2rem] group cursor-pointer shadow-lg ${index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                }`}
            >
              <Image
                src={item.image_url}
                alt={item.title || "Galeri görseli"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/galeri">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 border-2 hover:bg-stone-50">
              Tüm Galeriyi Gör
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
