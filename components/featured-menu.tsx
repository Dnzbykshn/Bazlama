"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MenuItem {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
}

export function FeaturedMenu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        // If Supabase is not configured, use mock data directly
        if (!isSupabaseConfigured) {
          setItems([
            {
              id: "1",
              title: "Serpme Kahvaltı",
              description: "Tüm lezzetlerin bir arada olduğu zengin kahvaltı tabağı",
              price: 250,
              image_url: "/images/image.png",
            },
            {
              id: "2",
              title: "Menemen",
              description: "Geleneksel tarifimizle hazırlanan özel menemen",
              price: 85,
              image_url: "/images/image.png",
            },
            {
              id: "3",
              title: "Tereyağlı Bal",
              description: "Organik tereyağı ve doğal balımız",
              price: 95,
              image_url: "/images/image.png",
            },
          ])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .limit(3)

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }
        setItems(data || [])
      } catch (error: any) {
        console.error("Error fetching menu items:", error?.message || error)
        // If Supabase fails and not configured, show empty state
        if (!isSupabaseConfigured) {
          setItems([
            {
              id: "1",
              title: "Serpme Kahvaltı",
              description: "Tüm lezzetlerin bir arada olduğu zengin kahvaltı tabağı",
              price: 250,
              image_url: "/images/image.png",
            },
            {
              id: "2",
              title: "Menemen",
              description: "Geleneksel tarifimizle hazırlanan özel menemen",
              price: 85,
              image_url: "/images/image.png",
            },
            {
              id: "3",
              title: "Tereyağlı Bal",
              description: "Organik tereyağı ve doğal balımız",
              price: 95,
              image_url: "/images/image.png",
            },
          ])
        } else {
          // Supabase configured but error occurred - show empty
          setItems([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Öne Çıkan Lezzetler</h2>
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Öne Çıkan Lezzetler</h2>
          <p className="text-muted-foreground">En çok tercih edilen lezzetlerimiz</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

        <div className="text-center mt-12">
          <Link href="#menu">
            <Button size="lg" className="rounded-full">
              Tüm Menüyü Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

