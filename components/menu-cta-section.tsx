"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronRight, ChevronLeft, Utensils, Star, Flame, Sparkles, X } from "lucide-react"
import Image from "next/image"
import { Caveat, Inter, Patrick_Hand, Playfair_Display } from "next/font/google"
import Link from "next/link"

// --- FONTLAR ---
const caveat = Caveat({ subsets: ["latin"], weight: ["700"] })
const patrick = Patrick_Hand({ subsets: ["latin"], weight: ["400"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] })
const inter = Inter({ subsets: ["latin"] })

// --- MARKA RENGİ ---
const accentColor = "#8AD7D6";
const ornekResim = "/DSC04385.jpg";

// --- VERİ TİPİ (Rozet ve Fiyat Kaldırıldı) ---
interface MenuItem {
  id: number
  title: string
  description: string
  image_url: string
  category: string
}

// --- MENÜ VERİLERİ ---
const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "Sınırsız Serpme",
    description: "Sıcak pişiler, 4 çeşit peynir, ev reçelleri, sahanda yumurta ve sınırsız çay keyfi ile donatılmış efsane kahvaltı.",
    image_url: ornekResim,
    category: "Kahvaltı"
  },
  {
    id: 2,
    title: "Atom Pişi",
    description: "İçi akışkan çikolatalı ve peynir dolgulu, dışı çıtır, içi yumuşacık lezzet bombası.",
    image_url: ornekResim,
    category: "Tatlı"
  },
  {
    id: 3,
    title: "Köy Menemeni",
    description: "Bakır sahanda, organik domates, biber ve köy yumurtasıyla hazırlanan geleneksel lezzet.",
    image_url: ornekResim,
    category: "Sıcaklar"
  },
  {
    id: 4,
    title: "Sucuklu Yumurta",
    description: "Özel kasap sucuğu ve tereyağlı köy yumurtasının muhteşem uyumu.",
    image_url: ornekResim,
    category: "Sıcaklar"
  },
   {
    id: 5,
    title: "Mıhlama",
    description: "Trabzon peyniri ve hakiki tereyağı ile uzayan, mısır ekmeği banmalık lezzet.",
    image_url: ornekResim,
    category: "Yöresel"
  },
  {
    id: 6,
    title: "Gözleme Çeşitleri",
    description: "İncecik el açması yufka, bol malzeme ve odun ateşinde pişmiş çıtır lezzet.",
    image_url: ornekResim,
    category: "Hamur İşi"
  }
];

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
export function MenuCTASection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
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

  // --- KAYDIRMA FONKSİYONLARI ---
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

  // --- OTOMATİK KAYDIRMA ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && !isModalOpen) {
        scroll('right');
      }
    }, 4000); 

    return () => clearInterval(interval);
  }, [isPaused, isModalOpen]);

  return (
    // DÜZELTME: Arka plan rengi style prop'u ile geri getirildi
    <section className="relative pt-32 pb-24 px-4 overflow-hidden" style={{ backgroundColor: accentColor }}>
      
      <MenuDetailModal item={selectedItem} isOpen={isModalOpen} onClose={closeModal} />

      {/* --- ÜST DALGA (BEYAZ) --- */}
      <div className="absolute top-0 left-0 w-full leading-[0] z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px]" style={{ transform: 'rotate(180deg)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FDFBF7"></path>
        </svg>
      </div>

      {/* Silik İkonlar */}
      <div className="absolute top-10 right-10 text-white opacity-10 rotate-12 pointer-events-none">
          <Utensils size={200} />
      </div>
      <div className="absolute bottom-10 left-10 text-white opacity-10 -rotate-12 pointer-events-none">
          <Flame size={200} />
      </div>

      <div className="container mx-auto relative z-20">
        
        {/* --- BAŞLIK ALANI --- */}
        <div className="text-center mb-16 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 px-5 py-2 rounded-full shadow-sm mb-6 transform -rotate-2"
            >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className={`text-sm font-bold tracking-widest text-white uppercase ${inter.className}`}>Favori Lezzetler</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`text-6xl md:text-8xl font-bold text-white mb-4 ${caveat.className} drop-shadow-md`}
            >
                Sofraların Yıldızları
            </motion.h2>
            
            <p className={`text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light ${patrick.className}`}>
                Misafirlerimizin vazgeçemediği, her ısırıkta mutluluk veren imza lezzetlerimiz.
            </p>
        </div>

        {/* --- SLIDER KONTEYNERİ --- */}
        <div 
            className="relative max-w-[1400px] mx-auto px-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            {/* Sol Ok */}
            <button 
                onClick={() => scroll('left')} 
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/20 backdrop-blur border border-white/40 rounded-full text-white hover:bg-white hover:text-[#8AD7D6] shadow-lg items-center justify-center transition-all duration-200"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Slider Alanı */}
            <div 
                ref={carouselRef}
                className="flex gap-8 pb-12 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-2 pt-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {menuItems.map((item, index) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                        className="min-w-[300px] md:min-w-[360px] snap-center h-full group"
                        onClick={() => openModal(item)}
                    >
                        {/* --- LEZZET KARTI --- */}
                        <div className="bg-white rounded-[2.5rem] p-4 shadow-lg group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:-translate-y-2 relative flex flex-col h-full overflow-hidden cursor-pointer border border-white/50">
                            
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

                {/* "Tümünü Gör" Kartı */}
                <div className="min-w-[200px] md:min-w-[280px] flex flex-col items-center justify-center snap-center">
                    <Link href="/menu" className="group cursor-pointer">
                        <div className="w-40 h-40 bg-white/20 backdrop-blur border-2 border-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                            <ArrowRight className="w-16 h-16 text-white stroke-[3]" />
                        </div>
                        <div className="mt-6 text-center">
                            <span className={`text-2xl font-bold text-white drop-shadow-md inline-block ${caveat.className}`}>
                                Tüm Menü
                            </span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Sağ Ok */}
            <button 
                onClick={() => scroll('right')} 
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/20 backdrop-blur border border-white/40 rounded-full text-white hover:bg-white hover:text-[#8AD7D6] shadow-lg items-center justify-center transition-all duration-200"
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>

        {/* MOBİL BUTONLAR */}
        <div className="flex md:hidden justify-center gap-4 mt-2">
            <button onClick={() => scroll('left')} className="w-12 h-12 bg-white/20 border border-white/40 rounded-full flex items-center justify-center text-white active:scale-95 transition-all">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 bg-white/20 border border-white/40 rounded-full flex items-center justify-center text-white active:scale-95 transition-all">
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>

      </div>

      {/* --- ALT DALGA (BEYAZ) --- */}
      <div className="absolute bottom-0 left-0 w-full leading-[0] z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]">
          <path d="M0,60 C150,120 400,130 600,60 C800,-10 1050,0 1200,60 V120 H0 Z" fill="#FFF"></path>
        </svg>
      </div>

    </section>
  )
}