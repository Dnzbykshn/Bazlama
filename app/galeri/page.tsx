"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface GalleryItem {
  id: string
  image_url: string
  title: string | null
  description: string | null
}

export default function GaleriPage() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true)
        
        // If Supabase is not configured, use mock data directly
        if (!isSupabaseConfigured) {
          setImages([
            { id: "1", image_url: "/images/image.png", title: "Kahvaltı Tabağı", description: null },
            { id: "2", image_url: "/images/image.png", title: "Mekan", description: null },
            { id: "3", image_url: "/images/image.png", title: "Lezzetler", description: null },
            { id: "4", image_url: "/images/image.png", title: "Atmosfer", description: null },
            { id: "5", image_url: "/images/image.png", title: "Kahvaltı", description: null },
            { id: "6", image_url: "/images/image.png", title: "Mekan", description: null },
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
        // Only show mock data if Supabase is not configured
        if (!isSupabaseConfigured) {
          setImages([
            { id: "1", image_url: "/images/image.png", title: "Kahvaltı Tabağı", description: null },
            { id: "2", image_url: "/images/image.png", title: "Mekan", description: null },
            { id: "3", image_url: "/images/image.png", title: "Lezzetler", description: null },
            { id: "4", image_url: "/images/image.png", title: "Atmosfer", description: null },
            { id: "5", image_url: "/images/image.png", title: "Kahvaltı", description: null },
            { id: "6", image_url: "/images/image.png", title: "Mekan", description: null },
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
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold mb-4">Galeri</h1>
          <p className="text-lg text-muted-foreground">Mekanımızdan ve lezzetlerimizden kareler</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8 text-center">
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Supabase bağlantısı yapılandırılmamış olabilir. Mock veriler gösteriliyor.
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz galeri görseli bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                    <Image
                      src={item.image_url}
                      alt={item.title || "Galeri görseli"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                        {item.title || "Görüntüle"}
                      </span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full p-0">
                  <div className="relative w-full h-[80vh]">
                    <Image
                      src={item.image_url}
                      alt={item.title || "Galeri görseli"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {item.title && (
                    <div className="p-4 border-t">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      {item.description && (
                        <p className="text-muted-foreground mt-2">{item.description}</p>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

