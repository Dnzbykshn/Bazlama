"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

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
        // If Supabase is not configured, use mock data directly
        if (!isSupabaseConfigured) {
          setImages([
            { id: "1", image_url: "/images/image.png", title: "Kahvaltı Tabağı" },
            { id: "2", image_url: "/images/image.png", title: "Mekan" },
            { id: "3", image_url: "/images/image.png", title: "Lezzetler" },
            { id: "4", image_url: "/images/image.png", title: "Atmosfer" },
          ])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .limit(4)

        if (error) throw error
        setImages(data || [])
      } catch (error) {
        console.error("Error fetching gallery:", error)
        // Only show mock data if Supabase is not configured
        if (!isSupabaseConfigured) {
          setImages([
            { id: "1", image_url: "/images/image.png", title: "Kahvaltı Tabağı" },
            { id: "2", image_url: "/images/image.png", title: "Mekan" },
            { id: "3", image_url: "/images/image.png", title: "Lezzetler" },
            { id: "4", image_url: "/images/image.png", title: "Atmosfer" },
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

  if (loading) {
    return null
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Galeri</h2>
          <p className="text-muted-foreground">Mekanımızdan kareler</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {images.map((item, index) => (
            <div
              key={item.id}
              className={`relative aspect-square overflow-hidden rounded-lg group cursor-pointer ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <Image
                src={item.image_url}
                alt={item.title || "Galeri görseli"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="#galeri">
            <Button variant="outline" size="lg" className="rounded-full">
              Tüm Galeriyi Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

