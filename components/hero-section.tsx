"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  { id: "1", x: 20, y: 50, title: "Mıhlama", description: "Geleneksel mıhlama özel tarifimiz" },
  { id: "2", x: 75, y: 70, title: "Menemen", description: "Geleneksel menemen özel tarifimiz" },
  { id: "3", x: 12, y: 25, title: "Türk Çayı", description: "Geleneksel demleme çay" },
]

export function HeroSection() {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null)

  return (
    <section className="relative w-full h-screen overflow-hidden bg-stone-900">
      {/* Hero Image - Full screen with 16:9 aspect ratio */}
      <div className="relative w-full h-full">
        <Image
          src="/hero.png"
          alt="Turkish Breakfast Spread"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          style={{ objectPosition: "center center" }}
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />

        {/* Hotspots */}
        {hotspots.map((hotspot, index) => (
          <div
            key={hotspot.id}
            className="absolute"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
          >
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className="w-10 h-10 rounded-full bg-white/90 border-3 border-white shadow-xl hover:scale-125 transition-all duration-300 cursor-pointer hover:bg-primary flex items-center justify-center group relative z-10"
              aria-label={hotspot.title}
            >
              <div className="w-3 h-3 bg-primary rounded-full group-hover:bg-white transition-colors" />
            </motion.button>
            
            {/* Animated Text - Appears on the right side when hovering */}
            <AnimatePresence>
              {hoveredHotspot === hotspot.id && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap z-20 pointer-events-none"
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/50">
                    <p className="text-sm font-bold text-foreground">{hotspot.title}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Action Button - Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium shadow-lg shadow-primary/20 border-2 border-white/20 hover:scale-105 transition-all duration-300">
              {"Sınırsız Kahvaltı"}
            </Button>
          </motion.div>
        </div>

        {/* Info Card - Bottom Left */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-12 left-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-xs hover:scale-105 transition-transform duration-300"
        >
          <p className="text-base font-serif font-semibold text-foreground leading-tight">Siz tamam diyene kadar, biz servise devam ediyoruz ;)</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">Geleneksel Türk kahvaltısının en lezzetli halini modern dokunuşlarla sunuyoruz.</p>
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

    </section>
  )
}
