"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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
    <section className="relative w-full h-[calc(100vh-6rem)] overflow-hidden bg-stone-900">
      {/* Hero Image with hotspots */}
      <div className="relative w-full h-full">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image src="/images/image.png" alt="Turkish Breakfast Spread" fill className="object-cover opacity-90" priority />
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
        </motion.div>

        {/* Hotspots */}
        {hotspots.map((hotspot, index) => (
          <motion.button
            key={hotspot.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
            className="absolute w-10 h-10 rounded-full bg-white/90 border-3 border-white shadow-xl hover:scale-125 transition-all duration-300 cursor-pointer hover:bg-primary flex items-center justify-center group"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            onClick={() => setSelectedHotspot(hotspot)}
            aria-label={hotspot.title}
          >
            <div className="w-3 h-3 bg-primary rounded-full group-hover:bg-white transition-colors" />
          </motion.button>
        ))}

        {/* Action Buttons - Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium shadow-lg shadow-primary/20 border-2 border-white/20 hover:scale-105 transition-all duration-300">
              {"Sınırsız Kahvaltı"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full bg-white/90 hover:bg-white text-foreground px-8 py-6 text-base font-medium shadow-lg backdrop-blur-sm border-2 border-white/50 hover:scale-105 transition-all duration-300"
            >
              {"Konseptimiz"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full bg-white/90 hover:bg-white text-foreground px-8 py-6 text-base font-medium shadow-lg backdrop-blur-sm border-2 border-white/50 hover:scale-105 transition-all duration-300"
            >
              {"Online Sipariş"}
            </Button>
          </motion.div>
        </div>

        {/* Info Card - Bottom Left */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-12 left-8 bg-white/95 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl max-w-sm hover:scale-105 transition-transform duration-300"
        >
          <p className="text-xl font-serif font-bold text-foreground">"Doymadan Kaçmak Yasak"</p>
          <p className="text-muted-foreground mt-2 leading-relaxed">Geleneksel Türk kahvaltısının en lezzetli halini modern dokunuşlarla sunuyoruz.</p>
        </motion.div>

        {/* Award Badge - Bottom Right */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
          className="absolute bottom-12 right-12 hidden md:block"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xl text-center transform hover:rotate-6 transition-all duration-500 cursor-help group">
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center text-4xl shadow-inner">
              🏆
            </div>
            <p className="text-sm font-bold text-foreground">2024</p>
            <p className="text-xs font-bold text-primary tracking-wide mt-1">HALKIN FAVORİSİ</p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>

      {/* Hotspot Detail Modal */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedHotspot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FDFBF7] rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full hover:bg-black/5"
                onClick={() => setSelectedHotspot(null)}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="space-y-6 text-center">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-4xl mx-auto shadow-sm rotate-3">
                  🍽️
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{selectedHotspot.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedHotspot.description}</p>
                </div>
                <Button className="w-full rounded-2xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  {"Sipariş Ver"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
