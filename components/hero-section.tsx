"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"

interface Hotspot {
  id: string
  x: number
  y: number
  title: string
  description: string
}

const hotspots: Hotspot[] = [
  { id: "1", x: 15, y: 70, title: "Tereyağlı Bal", description: "Organik tereyağı ve doğal balımız" },
  { id: "2", x: 32, y: 55, title: "Menemen", description: "Geleneksel menemen özel tarifimiz" },
  { id: "3", x: 48, y: 35, title: "Çıtır Börek", description: "El açması taze böreklerimiz" },
  { id: "4", x: 55, y: 32, title: "Gözleme", description: "Sıcak sıcak gözlemelerimiz" },
  { id: "5", x: 85, y: 65, title: "Türk Çayı", description: "Geleneksel demleme çay" },
]

export function HeroSection() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)

  return (
    <section className="relative w-full h-[calc(100vh-5rem)] overflow-hidden">
      {/* Hero Image with hotspots */}
      <div className="relative w-full h-full">
        <Image src="/images/image.png" alt="Turkish Breakfast Spread" fill className="object-cover" priority />

        {/* Hotspots */}
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            className="absolute w-8 h-8 rounded-full bg-destructive border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer animate-pulse"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            onClick={() => setSelectedHotspot(hotspot)}
            aria-label={hotspot.title}
          />
        ))}

        {/* Action Buttons - Right Side */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          <Button className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-6 text-sm font-bold shadow-xl border-2 border-white">
            {"Sunusuz Kahvaltı"}
          </Button>
          <Button
            variant="outline"
            className="rounded-full bg-white hover:bg-white/90 text-foreground px-6 py-6 text-sm font-bold shadow-xl border-2 border-primary"
          >
            {"Konseptimiz"}
          </Button>
          <Button
            variant="outline"
            className="rounded-full bg-white hover:bg-white/90 text-foreground px-6 py-6 text-sm font-bold shadow-xl border-2 border-foreground"
          >
            {"Online Alışveriş"}
          </Button>
        </div>

        {/* Info Card - Bottom Left */}
        <div className="absolute bottom-8 left-8 bg-accent/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-white max-w-xs">
          <p className="text-sm font-bold text-accent-foreground uppercase tracking-wide">{"Doymadan Kaçmak Yasak"}</p>
        </div>

        {/* Award Badge - Bottom Right */}
        <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-yellow-400 rounded-full flex items-center justify-center text-3xl">
            🏆
          </div>
          <p className="text-xs font-bold text-foreground">2024</p>
          <p className="text-xs font-semibold text-muted-foreground">{"En Çok Tercih Edilenler"}</p>
          <p className="text-xs font-bold text-primary">{"HALKİN FAVORİSİ"}</p>
          <p className="text-xs text-muted-foreground">{"ÖDÜLÜ"}</p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Hotspot Detail Modal */}
      {selectedHotspot && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setSelectedHotspot(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setSelectedHotspot(null)}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl mx-auto">
                🍽️
              </div>
              <h3 className="text-2xl font-bold text-center text-foreground">{selectedHotspot.title}</h3>
              <p className="text-muted-foreground text-center leading-relaxed">{selectedHotspot.description}</p>
              <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6">
                {"Sipariş Ver"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
