"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight, ChevronLeft, Star, ChefHat, Coffee, Wheat } from "lucide-react"
import Image from "next/image"
import { Caveat, Inter, Playfair_Display } from "next/font/google"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

// Fontlar
const caveat = Caveat({ subsets: ["latin"], weight: ["700"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "800"] })
const inter = Inter({ subsets: ["latin"] })

// Marka Rengi
const accentColor = "#8AD7D6";
const ornekResim = "/DSC04385.jpg";

interface MenuItem {
  id: string
  title: string
  description: string | null
  image_url: string | null
}

// Fallback menü verileri (Supabase bağlantısı yoksa)
const fallbackMenuItems = [
  { id: "1", title: "Sınırsız Serpme", description: "Sıcak pişiler, 4 çeşit peynir ve sınırsız çay.", image_url: ornekResim },
  { id: "2", title: "Atom Pişi", description: "Çikolatalı ve peynir dolgulu lezzet bombası.", image_url: ornekResim },
  { id: "3", title: "Köy Menemeni", description: "Bakır sahanda, organik domates ve biberle.", image_url: ornekResim },
  { id: "4", title: "Sucuklu Yumurta", description: "Kasap sucuğu ve köy yumurtası.", image_url: ornekResim },
  { id: "5", title: "Mıhlama", description: "Trabzon peyniri ve tereyağı ile.", image_url: ornekResim },
  { id: "6", title: "Gözleme Çeşitleri", description: "El açması, odun ateşinde pişmiş.", image_url: ornekResim }
];

// Animasyonlar
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export function MenuPageCTASection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Veritabanından menü öğelerini çek
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        if (!isSupabaseConfigured) {
          setMenuItems(fallbackMenuItems)
          setIsLoading(false)
          return
        }
        
        const { data: menuData } = await supabase
          .from("unlimited_menu")
          .select("*")
          .eq("active", true)
          .limit(1)
          .single()
        
        if (menuData) {
          const { data: itemsData } = await supabase
            .from("unlimited_menu_items")
            .select("*")
            .eq("menu_id", menuData.id)
            .eq("featured", true)
            .order("position", { ascending: true })
            .limit(6)
          
          if (itemsData && itemsData.length > 0) {
            setMenuItems(itemsData)
          } else {
            setMenuItems(fallbackMenuItems)
          }
        } else {
          setMenuItems(fallbackMenuItems)
        }
      } catch (error) {
        console.error("Error fetching menu items:", error)
        setMenuItems(fallbackMenuItems)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMenuItems()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = 360; 
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && !isLoading) scroll('right');
    }, 4500); 
    return () => clearInterval(interval);
  }, [isPaused, isLoading]);

  // Yükleme sırasında section'ı gizle
  if (isLoading || menuItems.length === 0) {
    return null;
  }

  return (
    // DÜZELTME: Rengi garantiye almak için 'style' prop'u ile standart CSS Gradient verdik.
    // Bu yöntem Tailwind config hatası olsa bile çalışır.
    <section 
        className="relative pt-40 pb-32 md:pt-52 md:pb-40 px-4 overflow-hidden" 
        style={{ background: 'linear-gradient(180deg, #AEEEEE 0%, #8AD7D6 100%)' }}
    >
      
      {/* --- ARKA PLAN DEKORASYONU (BOŞLUK DOLDURUCULAR) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         
         {/* 1. Nokta Dokusu (Texture) */}
         <div className="absolute inset-0 opacity-[0.07]" 
              style={{ backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
         </div>

         {/* 2. SOL TARAFTAKİ ELEMENTLER */}
         {/* Dönen Buğday İkonu */}
         <motion.div 
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 -left-10 md:left-10 text-white/10"
         >
            <Wheat size={300} strokeWidth={1} />
         </motion.div>
         
         {/* Sol Işık Efekti */}
         <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white/20 rounded-full blur-[80px] mix-blend-overlay" />


         {/* 3. SAĞ TARAFTAKİ ELEMENTLER */}
         {/* Kahve/Çay Fincanı İkonu */}
         <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -right-12 md:right-10 text-white/10"
         >
            <Coffee size={250} strokeWidth={1.5} />
         </motion.div>
         
         {/* Aşçı Şapkası (Alt Sağ) */}
         <motion.div 
            animate={{ rotate: [-10, 0, -10] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 right-1/4 text-white/5 hidden md:block"
         >
            <ChefHat size={150} strokeWidth={1} />
         </motion.div>

      </div>

      {/* --- ÜST DALGA (BEYAZ) --- */}
      <div className="absolute top-0 left-0 w-full leading-[0] z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" style={{ transform: 'rotate(180deg)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FDFBF7"></path>
        </svg>
      </div>

      <div className="container mx-auto relative z-20">
        
        {/* --- BAŞLIK ALANI --- */}
        <div className="text-center mb-16 relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-bold tracking-widest mb-6 border border-white/40 shadow-xl"
            >
                <Star className="w-4 h-4 fill-white text-yellow-300" />
                <span className="drop-shadow-sm">SİVAS'IN FAVORİLERİ</span>
                <Star className="w-4 h-4 fill-white text-yellow-300" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-5xl md:text-8xl font-bold text-white drop-shadow-xl mb-6 leading-tight ${caveat.className}`}
            >
                Damak Çatlatan Lezzetler
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/95 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md"
            >
                "Kahvaltının mutlulukla bir ilgisi var, bizim pişilerimizle ise kesinlikle bir ilgisi var."
            </motion.p>
        </div>

        {/* --- SLIDER KONTEYNERİ --- */}
        <div 
            className="relative max-w-[1400px] mx-auto px-4 md:px-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Sol Ok */}
            <button 
                onClick={() => scroll('left')} 
                className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white text-[#8AD7D6] hover:bg-[#f0fdfd] shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 group border-4 border-transparent hover:border-[#bbfdfc]"
            >
                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* KARTLAR */}
            <motion.div 
                ref={carouselRef}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-8 pb-12 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-2 pt-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {menuItems.map((item) => (
                    <motion.div 
                        key={item.id}
                        variants={cardVariants}
                        className="min-w-[280px] md:min-w-[360px] bg-white rounded-[2.5rem] p-4 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] transition-all duration-500 flex flex-col group relative snap-center h-full hover:-translate-y-3 border border-white/50"
                    >
                        {/* Resim Alanı */}
                        <div className="w-full h-56 md:h-72 rounded-[2rem] mb-6 overflow-hidden relative shadow-md">
                             <Image 
                                src={item.image_url || ornekResim} 
                                alt={item.title} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                             /> 
                             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                             
                             <div className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-md">
                                {item.title}
                             </div>

                             <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-[#8AD7D6] shadow-lg z-10 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                Özel
                             </div>
                        </div>

                        {/* İçerik */}
                        <div className="px-3 pb-2 flex-grow flex flex-col">
                            <p className="text-stone-500 text-sm md:text-base leading-relaxed font-medium mb-4 line-clamp-2">
                                {item.description || "Özel tarifimizle hazırlanan lezzet."}
                            </p>
                            
                            <div className="mt-auto flex justify-between items-center border-t border-stone-100 pt-4">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest group-hover:text-[#8AD7D6] transition-colors">İncele</span>
                                <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#8AD7D6] group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Tüm Menü Kartı */}
                <motion.div variants={cardVariants} className="min-w-[200px] md:min-w-[280px] flex flex-col items-center justify-center snap-center">
                    <Link href="/menu" className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-white/10 border-2 border-white/40 rounded-[2.5rem] hover:bg-white/20 transition-all duration-300 backdrop-blur-sm group cursor-pointer gap-6 hover:border-white">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#8AD7D6] shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <ArrowRight className="w-10 h-10" />
                        </div>
                        <span className="font-bold text-white text-2xl tracking-wide group-hover:tracking-wider transition-all text-center">Tümünü<br/>Gör</span>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Sağ Ok */}
            <button 
                onClick={() => scroll('right')} 
                className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white text-[#8AD7D6] hover:bg-[#f0fdfd] shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 group border-4 border-transparent hover:border-[#bbfdfc]"
            >
                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Mobil Butonlar */}
        <div className="flex md:hidden justify-center gap-6 mt-4">
            <button onClick={() => scroll('left')} className="w-14 h-14 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center text-white active:scale-95 shadow-lg">
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={() => scroll('right')} className="w-14 h-14 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center text-white active:scale-95 shadow-lg">
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>

        {/* --- ANA BUTON --- */}
        <div className="text-center mt-16 relative z-30">
            <Button 
                variant="secondary"
                onClick={() => {
                    const element = document.getElementById('sinirsiz-menu');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }}
                className="group relative px-14 py-9 text-xl font-bold rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-1 bg-white text-[#8AD7D6] overflow-hidden cursor-pointer"
            >
                <span className="relative z-10 flex items-center gap-3">
                    Tüm Menüyü Keşfet
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-stone-50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out -z-0" />
            </Button>
        </div>

      </div>

      {/* --- ALT DALGA --- */}
      <div className="absolute bottom-0 left-0 w-full leading-[0] z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]">
          <path d="M0,60 C150,120 400,130 600,60 C800,-10 1050,0 1200,60 V120 H0 Z" fill="#FFFFFF"></path>
        </svg>
      </div>

    </section>
  )
}