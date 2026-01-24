"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight, ChevronLeft, Star, ChefHat, Coffee, Wheat, Utensils, Flame, Sparkles, X } from "lucide-react"
import Image from "next/image"
import { Caveat, Inter, Playfair_Display, Patrick_Hand } from "next/font/google"

// Fontlar
const caveat = Caveat({ subsets: ["latin"], weight: ["700"] })
const patrick = Patrick_Hand({ subsets: ["latin"], weight: ["400"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "800"] })
const inter = Inter({ subsets: ["latin"] })

// Marka Rengi
const accentColor = "#8AD7D6";
const ornekResim = "/DSC04385.jpg";

// VERİ TİPİ
interface MenuItem {
  id: number
  title: string
  description: string // 'desc' yerine 'description' kullanıldı (Modal ile uyumlu olsun diye)
  image_url: string
  category: string
  price?: string // Fiyat opsiyonel bırakıldı
}

// MENÜ VERİLERİ (Yapıyı koruyarak güncelledim)
const menuItems: MenuItem[] = [
  { id: 1, title: "Sınırsız Serpme", description: "Sıcak pişiler, 4 çeşit peynir ve sınırsız çay.", price: "₺₺₺", image_url: ornekResim, category: "Kahvaltı" },
  { id: 2, title: "Atom Pişi", description: "İçi akışkan çikolatalı ve peynir dolgulu lezzet bombası.", price: "₺₺", image_url: ornekResim, category: "Tatlı" },
  { id: 3, title: "Köy Menemeni", description: "Bakır sahanda, organik domates ve biberle.", price: "₺₺", image_url: ornekResim, category: "Sıcaklar" },
  { id: 4, title: "Sucuklu Yumurta", description: "Kasap sucuğu ve köy yumurtası.", price: "₺₺", image_url: ornekResim, category: "Sıcaklar" },
  { id: 5, title: "Mıhlama", description: "Trabzon peyniri ve tereyağı ile.", price: "₺₺₺", image_url: ornekResim, category: "Yöresel" },
  { id: 6, title: "Gözleme Çeşitleri", description: "El açması, odun ateşinde pişmiş.", price: "₺₺", image_url: ornekResim, category: "Hamur İşi" }
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

// --- DETAY MODALI ---
const MenuDetailModal = ({ item, isOpen, onClose }: { item: MenuItem | null, isOpen: boolean, onClose: () => void }) => {
    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-stone-950/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#fffcf8] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative border border-white"
                        >
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all border border-stone-100 shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex flex-col">
                                <div className="relative h-72 w-full bg-stone-100 group">
                                    {item.image_url ? (
                                        <Image src={item.image_url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl text-stone-300">🍽️</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>
                                    
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-4 py-1.5 bg-[#8AD7D6] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg border border-white/20 backdrop-blur-sm flex items-center gap-2">
                                            <Sparkles size={12} />
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 pt-10 relative">
                                    <h3 className={`text-4xl font-bold text-slate-800 mb-3 leading-tight ${playfair.className}`}>
                                        {item.title}
                                    </h3>
                                    
                                    <div className="w-20 h-1.5 bg-[#8AD7D6]/20 rounded-full mb-6">
                                        <div className="w-1/2 h-full bg-[#8AD7D6] rounded-full"></div>
                                    </div>

                                    <p className={`text-slate-600 text-xl leading-relaxed ${patrick.className}`}>
                                        {item.description}
                                    </p>

                                    <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-400 font-medium uppercase tracking-wider">Afiyet Olsun</span>
                                        <button 
                                            onClick={onClose}
                                            className="px-8 py-3 bg-[#8AD7D6] text-white rounded-full font-bold shadow-lg hover:bg-[#7acaca] hover:shadow-[#8AD7D6]/30 hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            Kapat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// --- ANA BİLEŞEN ---
export function MenuPageCTASection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Modal State'leri
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Açma
  const openModal = (item: MenuItem) => {
      setSelectedItem(item);
      setIsModalOpen(true);
      setIsPaused(true);
  };

  // Modal Kapatma
  const closeModal = () => {
      setIsModalOpen(false);
      setIsPaused(false);
      setTimeout(() => setSelectedItem(null), 300);
  };

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
      if (!isPaused && !isModalOpen) scroll('right');
    }, 4500); 
    return () => clearInterval(interval);
  }, [isPaused, isModalOpen]);

  return (
    <section 
        className="relative pt-40 pb-32 md:pt-52 md:pb-40 px-4 overflow-hidden" 
        style={{ background: 'linear-gradient(180deg, #AEEEEE 0%, #8AD7D6 100%)' }}
    >
      
      {/* MODAL BİLEŞENİ */}
      <MenuDetailModal item={selectedItem} isOpen={isModalOpen} onClose={closeModal} />

      {/* --- ARKA PLAN DEKORASYONU --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.07]" 
              style={{ backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
          </div>
          <motion.div 
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 -left-10 md:left-10 text-white/10"
          >
            <Wheat size={300} strokeWidth={1} />
          </motion.div>
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white/20 rounded-full blur-[80px] mix-blend-overlay" />
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -right-12 md:right-10 text-white/10"
          >
            <Coffee size={250} strokeWidth={1.5} />
          </motion.div>
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
                        onClick={() => openModal(item)} // Tıklanınca Modal Aç
                        className="min-w-[300px] md:min-w-[360px] snap-center h-full group cursor-pointer"
                    >
                         {/* --- YENİ KART TASARIMI (1. KODDAN ALINDI) --- */}
                         <div className="bg-white rounded-[2.5rem] p-4 shadow-lg group-hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.5)] transition-all duration-300 group-hover:-translate-y-2 relative flex flex-col h-full overflow-hidden border border-white/50">
                            
                            {/* Resim Alanı */}
                            <div className="w-full h-64 rounded-[2rem] overflow-hidden relative bg-stone-100 shadow-inner">
                                 <Image 
                                    src={item.image_url} 
                                    alt={item.title} 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                 /> 
                            </div>

                            {/* İçerik */}
                            <div className="px-2 pt-6 pb-2 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <Utensils className="w-4 h-4 text-[#8AD7D6]" />
                                    <h3 className={`text-3xl font-bold text-stone-900 ${playfair.className}`}>{item.title}</h3>
                                </div>
                                
                                <p className={`text-stone-500 text-lg leading-6 mb-6 line-clamp-2 ${patrick.className}`}>
                                    {item.description}
                                </p>

                                <div className="mt-auto pt-4 border-t-2 border-dashed border-stone-100 flex justify-between items-center">
                                    <span className={`text-sm font-bold text-stone-400 uppercase tracking-widest group-hover:text-[#8AD7D6] transition-colors ${inter.className}`}>Detaylı Bak</span>
                                    <div className="w-10 h-10 rounded-full bg-[#f0fdfd] border border-[#8AD7D6]/20 flex items-center justify-center text-[#8AD7D6] group-hover:bg-[#8AD7D6] group-hover:text-white transition-all duration-300">
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
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
        {/* <div className="text-center mt-16 relative z-30">
            <Link href="/menu">
                <Button 
                    variant="secondary"
                    className="group relative px-14 py-9 text-xl font-bold rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-1 bg-white text-[#8AD7D6] overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Tüm Menüyü Keşfet
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-stone-50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out -z-0" />
                </Button>
            </Link>
        </div> */}

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