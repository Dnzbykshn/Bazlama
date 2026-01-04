"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuItem {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
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
            {
              id: "1",
              title: "Serpme Kahvaltı",
              description: "Tüm lezzetlerin bir arada olduğu zengin kahvaltı tabağı",
              price: 250,
              image_url: "/images/image.png",
              category: "Kahvaltı",
            },
            {
              id: "2",
              title: "Menemen",
              description: "Geleneksel tarifimizle hazırlanan özel menemen",
              price: 85,
              image_url: "/images/image.png",
              category: "Sıcak Yemekler",
            },
            {
              id: "3",
              title: "Tereyağlı Bal",
              description: "Organik tereyağı ve doğal balımız",
              price: 95,
              image_url: "/images/image.png",
              category: "Kahvaltı",
            },
          ]
          
          // Filter by category if selected
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
        // Only show mock data if Supabase is not configured
        if (!isSupabaseConfigured) {
          const mockData = [
            {
              id: "1",
              title: "Serpme Kahvaltı",
              description: "Tüm lezzetlerin bir arada olduğu zengin kahvaltı tabağı",
              price: 250,
              image_url: "/images/image.png",
              category: "Kahvaltı",
            },
            {
              id: "2",
              title: "Menemen",
              description: "Geleneksel tarifimizle hazırlanan özel menemen",
              price: 85,
              image_url: "/images/image.png",
              category: "Sıcak Yemekler",
            },
            {
              id: "3",
              title: "Tereyağlı Bal",
              description: "Organik tereyağı ve doğal balımız",
              price: 95,
              image_url: "/images/image.png",
              category: "Kahvaltı",
            },
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

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean))) as string[]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold mb-4">Menü</h1>
          <p className="text-lg text-muted-foreground">Lezzetli seçeneklerimiz</p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              Tümü
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8 text-center">
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Supabase bağlantısı yapılandırılmamış olabilir. Mock veriler gösteriliyor.
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="w-full h-48" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz menü öğesi bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48 bg-secondary">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  {item.description && <CardDescription>{item.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {item.price.toFixed(2)} ₺
                    </span>
                    <Button size="sm">Sipariş Ver</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

