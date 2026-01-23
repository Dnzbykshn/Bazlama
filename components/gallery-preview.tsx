"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Instagram, ArrowRight, Camera } from "lucide-react"

// Marka Rengi
const accentColor = "#8AD7D6";

// Örnek Resimler (Supabase boşsa bunlar döner)
const PLACEHOLDER_IMAGES = [
    "DSC04385.jpg",
  "DSC04385.jpg",
  "DSC04385.jpg",
  "DSC04385.jpg",

  "DSC04385.jpg",
];

export function GalleryPreview() {
  // Sonsuz döngü için resim listesini 3 kez çoğaltıyoruz
  const marqueeImages = [...PLACEHOLDER_IMAGES, ...PLACEHOLDER_IMAGES, ...PLACEHOLDER_IMAGES];

  return (
    <section className="py-24 bg-white relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* BAŞLIK VE GİRİŞ */}
      <div className="container mx-auto px-4 text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-stone-50 border border-stone-100 px-4 py-2 rounded-full mb-6 shadow-sm"
        >
          <Instagram className="w-4 h-4 text-[#E1306C]" />
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">@pisikahvalti</span>
        </motion.div>
        
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-6"
        >
          Mutluluğun <span className="relative inline-block">
            <span className="relative z-10">Fotoğrafı</span>
            {/* Kelime altı vurgu çizgisi */}
            <span className="absolute bottom-1 left-0 w-full h-3 bg-[#8AD7D6]/30 -z-0 rounded-full"></span>
          </span>
        </motion.h2>
        
        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-500 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Misafirlerimizin objektifinden ve mutfağımızdan en özel kareler. 
          Siz de anılarınızı bizimle paylaşın.
        </motion.p>
      </div>

      {/* --- SONSUZ KAYAN GALERİ (MARQUEE) --- */}
      <div className="w-full relative z-0 space-y-8">
        
        {/* SOLA KAYAN SIRA (ROW 1) */}
        <div className="relative w-full overflow-hidden rotate-[-1deg] scale-105 hover:rotate-0 transition-transform duration-700">
           <motion.div 
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-33.33%"] }} // Sonsuz döngü mantığı
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
           >
              {marqueeImages.map((src, index) => (
                 <div key={`row1-${index}`} className="relative w-[300px] h-[200px] md:w-[400px] md:h-[280px] rounded-3xl overflow-hidden shadow-lg group cursor-pointer">
                    <div className="absolute inset-0 bg-stone-200 animate-pulse"></div> {/* Yükleniyor efekti */}
                    <Image src={src} alt="Galeri" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Camera className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                 </div>
              ))}
           </motion.div>
        </div>

        {/* SAĞA KAYAN SIRA (ROW 2) */}
        <div className="relative w-full overflow-hidden rotate-[1deg] scale-105 hover:rotate-0 transition-transform duration-700">
           <motion.div 
              className="flex gap-6 w-max"
              animate={{ x: ["-33.33%", "0%"] }} // TERS YÖN
              transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
           >
              {marqueeImages.map((src, index) => (
                 <div key={`row2-${index}`} className="relative w-[300px] h-[200px] md:w-[400px] md:h-[280px] rounded-3xl overflow-hidden shadow-lg group cursor-pointer">
                    <div className="absolute inset-0 bg-stone-200 animate-pulse"></div>
                    <Image src={src} alt="Galeri" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                     {/* Hover Overlay */}
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Camera className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                 </div>
              ))}
           </motion.div>
        </div>

      </div>

      {/* ALT BUTON */}
      <div className="mt-16 relative z-10">
         <Link href="/galeri">
            <Button 
                size="lg" 
                className="group bg-white text-stone-900 border-2 px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                style={{ borderColor: accentColor }}
            >
                <span className="font-bold">Tüm Fotoğrafları Gör</span>
                <div className="ml-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:text-white" style={{ backgroundColor: accentColor + "30", color: accentColor }}>
                   <ArrowRight className="w-5 h-5" />
                </div>
            </Button>
         </Link>
      </div>

      {/* KENARLARI YUMUŞATAN GRADIENT (FADE EFFECT) */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

    </section>
  )
}