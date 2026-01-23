"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react"
import Image from "next/image"

// Marka Rengi
const accentColor = "#8AD7D6";

// Resim dosyan "public" klasörünün içinde olmalı!
const ornekResim = "/DSC04385.jpg";

// MENÜ VERİLERİ
const menuItems = [
  {
    id: 1,
    title: "Sınırsız Serpme",
    desc: "Sıcak pişiler, 4 çeşit peynir ve sınırsız çay.",
    image: ornekResim, 
  },
  {
    id: 2,
    title: "Atom Pişi",
    desc: "Çikolatalı ve peynir dolgulu lezzet bombası.",
    image: ornekResim, // Test için hepsine aynı resmi verdim
  },
  {
    id: 3,
    title: "Köy Menemeni",
    desc: "Bakır sahanda, organik domates ve biberle.",
    image: ornekResim,
  },
  {
    id: 4,
    title: "Sucuklu Yumurta",
    desc: "Kasap sucuğu ve köy yumurtası.",
    image: ornekResim,
  },
   {
    id: 5,
    title: "Mıhlama",
    desc: "Trabzon peyniri ve tereyağı ile.",
    image: ornekResim,
  },
  {
    id: 6,
    title: "Gözleme Çeşitleri",
    desc: "El açması, odun ateşinde pişmiş.",
    image: ornekResim,
  }
];

export function MenuCTASection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // --- KAYDIRMA FONKSİYONLARI ---
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = 320; 
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        if (current.scrollLeft + current.clientWidth >= current.scrollWidth - 10) {
            current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  // --- OTOMATİK KAYDIRMA ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        scroll('right');
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative py-16 pb-24 px-4 overflow-hidden" style={{ backgroundColor: accentColor }}>
      
      {/* --- ÜST DALGA --- */}
      <div className="absolute top-0 left-0 w-full leading-[0] z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px]" style={{ transform: 'rotate(180deg)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FDFBF7"></path>
        </svg>
      </div>

      <div className="container mx-auto relative z-20">
        
        {/* BAŞLIK */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-2">
            <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-md"
                >
                    Öne Çıkanlar
                </motion.h2>
                <p className="text-white/90 text-sm md:text-lg italic mt-2 font-light">
                    Müşterilerimizin favori kahvaltı seçenekleri.
                </p>
            </div>
            
            <div className="hidden md:flex gap-3">
                <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-[#8AD7D6] transition-all active:scale-95">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-[#8AD7D6] transition-all active:scale-95">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* --- SLIDER KONTEYNERİ --- */}
        <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <button 
                onClick={() => scroll('left')} 
                className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#8AD7D6] -ml-2 border border-stone-100"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <div 
                ref={carouselRef}
                className="flex gap-5 pb-8 pl-2 overflow-x-auto no-scrollbar snap-x scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {menuItems.map((item, index) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="min-w-[260px] md:min-w-[300px] bg-white rounded-[2rem] p-3 shadow-lg flex flex-col group relative overflow-hidden snap-start"
                    >
                        {/* RESİM ALANI - DÜZELTİLDİ */}
                        <div className="w-full h-40 rounded-[1.5rem] mb-4 overflow-hidden relative bg-stone-100">
                             
                             {/* Resmi kapatan 'absolute bg-stone-50' div'ini kaldırdım. Artık resim görünecek. */}
                             <Image 
                                src={item.image} 
                                alt={item.title} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                             /> 
                             
                             <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#8AD7D6] shadow-sm z-10">
                                LEZZETLİ
                             </div>
                        </div>

                        {/* İÇERİK */}
                        <div className="px-2 pb-2">
                            <h3 className="text-xl font-bold text-stone-800 mb-1 font-serif">{item.title}</h3>
                            <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                                {item.desc}
                            </p>
                        </div>

                        {/* BUTONCUK */}
                        <div className="mt-auto pt-3 border-t border-stone-50 flex justify-end">
                            <div className="w-8 h-8 rounded-full bg-[#f0fdfd] flex items-center justify-center text-[#8AD7D6] group-hover:bg-[#8AD7D6] group-hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                ))}

                <div className="min-w-[150px] flex flex-col items-center justify-center snap-start">
                    <Link href="/menu" className="flex flex-col items-center text-center group">
                        <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#8AD7D6] group-hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                        <span className="mt-3 font-bold text-white text-sm">Tüm Menü</span>
                    </Link>
                </div>

            </div>

             <button 
                onClick={() => scroll('right')} 
                className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#8AD7D6] -mr-2 border border-stone-100"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>

        {/* ANA BUTON */}
        <div className="text-center mt-4">
            <Link href="/menu">
                <Button 
                    variant="secondary"
                    className="group px-8 py-6 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
                    style={{ color: accentColor }} 
                >
                    Tüm Menüyü İncele
                </Button>
            </Link>
        </div>

      </div>

      {/* --- ALT DALGA (BEYAZ) --- */}
      <div className="absolute bottom-0 left-0 w-full leading-[0] z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]">
          <path d="M0,60 C150,120 400,130 600,60 C800,-10 1050,0 1200,60 V120 H0 Z" fill="#FFFFFF"></path>
        </svg>
      </div>

    </section>
  )
}