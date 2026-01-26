"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
}

// MÜŞTERİ YORUMLARI (Profil Resimleri Eklendi)
const reviews = [
  { 
    id: 1, 
    name: "Selin Yılmaz", 
    comment: "Hayatımda yediğim en çıtır pişi! Kesinlikle tavsiye ederim.", 
    rating: 5, 
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" // Örnek Avatar
  },
  { 
    id: 2, 
    name: "Mert Kaya", 
    comment: "Ambiyans harika, servis çok hızlı. Kahvaltı on numara.", 
    rating: 5, 
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" 
  },
  { 
    id: 3, 
    name: "Elif Demir", 
    comment: "Gözlemeler efsane, Alaçatı'da tek adresim artık.", 
    rating: 5, 
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d" 
  },
];

// Fallback slider verileri (Supabase bağlantısı yoksa)
const fallbackSliderImages = [
  { id: "1", title: "Mekan", image_url: "/DSC07011.jpg" },
  { id: "2", title: "Kahvaltı", image_url: "/DSC04385.jpg" },
  { id: "3", title: "Atmosfer", image_url: "/Szutest-5.jpg" },
];

interface FeaturedItem {
  id: string;
  title: string;
  image_url: string | null;
}

const hotspots: Hotspot[] = [
  { id: "1", x: 65, y: 55, title: "El Açması Gözleme", description: "Otlu & Peynirli" },
  { id: "2", x: 50, y: 80, title: "Bahçe Söğüş", description: "Çengelköy & Tarla" },
  { id: "3", x: 80, y: 60, title: "Atom Meze", description: "Acı severlere" },
];

// LOGO RENGİ
const accentColor = "#8AD7D6"; 

export function HeroSection() {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [googleRating, setGoogleRating] = useState(5.0);
  const [googleReviewCount, setGoogleReviewCount] = useState("120+");

  // Google puanlamasını veritabanından çek
  useEffect(() => {
    async function fetchRating() {
      try {
        if (!isSupabaseConfigured) return;
        
        const { data: ratingData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "google_rating")
          .single();
        
        const { data: countData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "google_review_count")
          .single();
        
        if (ratingData) setGoogleRating(parseFloat(ratingData.value) || 5.0);
        if (countData) setGoogleReviewCount(countData.value);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    }
    fetchRating();
  }, []);

  // Öne çıkan menü öğelerini veritabanından çek
  useEffect(() => {
    async function fetchFeaturedItems() {
      try {
        if (!isSupabaseConfigured) {
          setFeaturedItems(fallbackSliderImages.map(item => ({ ...item, image_url: item.image_url })));
          setIsLoading(false);
          return;
        }
        
        // First get the active menu
        const { data: menuData } = await supabase
          .from("unlimited_menu")
          .select("id")
          .eq("active", true)
          .limit(1)
          .single();

        if (menuData) {
          // Then get featured items from that menu
          const { data: itemsData } = await supabase
            .from("unlimited_menu_items")
            .select("id, title, image_url")
            .eq("menu_id", menuData.id)
            .eq("featured", true)
            .order("position", { ascending: true })
            .limit(6);
          
          if (itemsData && itemsData.length > 0) {
            // Filter out items without images
            const itemsWithImages = itemsData.filter(item => item.image_url);
            if (itemsWithImages.length > 0) {
              setFeaturedItems(itemsWithImages);
            } else {
              setFeaturedItems(fallbackSliderImages.map(item => ({ ...item, image_url: item.image_url })));
            }
          } else {
            setFeaturedItems(fallbackSliderImages.map(item => ({ ...item, image_url: item.image_url })));
          }
        } else {
          setFeaturedItems(fallbackSliderImages.map(item => ({ ...item, image_url: item.image_url })));
        }
      } catch (error) {
        console.error("Error fetching featured items:", error);
        setFeaturedItems(fallbackSliderImages.map(item => ({ ...item, image_url: item.image_url })));
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeaturedItems();
  }, []);

  // Slider Otomatik Döngü
  useEffect(() => {
    if (featuredItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  // Yorumlar Otomatik Döngü
  useEffect(() => {
    const reviewTimer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(reviewTimer);
  }, []);

  const handleNextSlide = () => {
    if (featuredItems.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const handlePrevSlide = () => {
    if (featuredItems.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#e6f4f1]">
      
      {/* --- ARKA PLAN --- */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "linear" }}
        className="relative w-full h-full"
      >
        <Image
          src="/DSC07011.jpg"
          alt="Pişi Kahvaltı"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#022c22]/95 via-[#022c22]/60 to-transparent" />
      </motion.div>

      {/* --- SOL TARAFTAKİ ANA METİN --- */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-24 z-30 pointer-events-none">
        <div className="pointer-events-auto max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-20" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}></span>
              <span className="font-sans uppercase tracking-[0.25em] text-sm font-bold drop-shadow-md" style={{ color: accentColor }}>
                
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif text-white leading-[1.1] mb-8 drop-shadow-2xl">
              Geleneksel <br />
              <span className="italic font-light" style={{ color: accentColor }}>Lezzet,</span> <br /> 
              Modern Keyif.
            </h1>
            <p className="text-gray-100 text-xl font-light leading-relaxed mb-10 max-w-lg drop-shadow-md border-l-2 pl-6" style={{ borderColor: `${accentColor}80` }}>
              Zeytin ağaçlarının gölgesinde, sıcak pişiler ve taze demli çay eşliğinde 
              unutulmaz bir kahvaltı deneyimi.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link 
                href="/iletisim"
                className="px-10 py-4 text-white font-bold rounded-full transition-all shadow-lg hover:scale-105 hover:-translate-y-1" 
                style={{ backgroundColor: accentColor, boxShadow: `0 0 25px ${accentColor}66` }}
              >
                Rezervasyon Yap
              </Link>
              <Link 
                href="/menu#sinirsiz-menu"
                className="px-10 py-4 bg-transparent text-white font-medium rounded-full border-2 transition-all hover:bg-white/10 backdrop-blur-sm" 
                style={{ borderColor: accentColor, color: "white" }}
              >
                Menüyü İncele
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- SAĞ SÜTUN: WIDGET, YORUMLAR & SLIDER GRUBU --- */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/3 z-30 hidden lg:flex flex-col justify-center items-end pr-16 gap-5 pointer-events-none">
        
        {/* 1. ÜST WIDGETLAR */}
      

        {/* 2. GOOGLE YORUMLARI KARTI (BEYAZ & PROFİL RESİMLİ) */}
        {/* Beyaz kart, gölge ve temiz tasarım */}
       

        {/* 3. SLIDER (Favoriler) */}
        <div className="flex flex-col items-end gap-4 pointer-events-auto">
            <div className="flex items-center justify-between w-64 pl-2">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-white" >
                    Favoriler
                </span>
                <div className="flex gap-2">
                    <button onClick={handlePrevSlide} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors" style={{ borderColor: "rgba(255,255,255,0.2)" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = accentColor} onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}>←</button>
                    <button onClick={handleNextSlide} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors" style={{ borderColor: "rgba(255,255,255,0.2)" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = accentColor} onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}>→</button>
                </div>
            </div>

            {featuredItems.length > 0 && !isLoading && (
            <div className="relative w-64 h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#022c22]/40 backdrop-blur-md group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={featuredItems[currentSlide]?.image_url || "/DSC07011.jpg"}
                            alt={featuredItems[currentSlide]?.title || "Öne Çıkan"}
                            fill
                            className="object-cover"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/20 to-transparent opacity-90" />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="self-start px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-lg" style={{ backgroundColor: `${accentColor}E6` }}>
                        <motion.span 
                            key={currentSlide} 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold text-white uppercase tracking-wider"
                        >
                            {featuredItems[currentSlide]?.title || "Öne Çıkan"}
                        </motion.span>
                    </div>

                    <div>
                        <p className="text-xs text-white/70">{currentSlide + 1} / {featuredItems.length}</p>
                    </div>
                </div>
                
                <motion.div 
                    key={currentSlide}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1"
                    style={{ backgroundColor: accentColor }}
                />
            </div>
            )}

            {/* 5 Yıldız Değerlendirme - Google Maps'e Link */}
            <a 
                href="https://maps.app.goo.gl/tEy2nFmFFXbxBY6R9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-3 hover:opacity-80 transition-opacity cursor-pointer group"
            >
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const rawFill = Math.min(Math.max(googleRating - (star - 1), 0), 1);
                        // Kısmi dolulukları daha görünür yapmak için kare kök ölçeklendirme
                        // 0.3 → 55%, 0.5 → 71%, 0.7 → 84%
                        const fillPercentage = (rawFill > 0 && rawFill < 1) 
                            ? Math.sqrt(rawFill) * 100 
                            : rawFill * 100;
                        return (
                            <div key={star} className="relative w-4 h-4 group-hover:scale-110 transition-transform">
                                {/* Boş yıldız (arka plan) */}
                                <svg className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                {/* Dolu yıldız (orantılı) */}
                                <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                                    <svg className="w-4 h-4" fill="#FFD700" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <span className="text-xs text-white/70 font-medium">{googleRating.toFixed(1)}</span>
                <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">• {googleReviewCount} yorum →</span>
            </a>
        </div>
       
      </div>

      {/* --- HOTSPOTS --- */}
      {hotspots.map((hotspot, index) => (
        <div
          key={hotspot.id}
          className="absolute z-20 hidden lg:block" 
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          onMouseEnter={() => setHoveredHotspot(hotspot.id)}
          onMouseLeave={() => setHoveredHotspot(null)}
        >
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2 + index * 0.2 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-3 rounded-full animate-ping opacity-70" style={{ backgroundColor: `${accentColor}50` }} />
            <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] border flex items-center justify-center transition-all duration-300 group-hover:scale-125" style={{ borderColor: accentColor }}>
               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
          </motion.button>

           <AnimatePresence>
            {hoveredHotspot === hotspot.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-8 whitespace-nowrap z-40"
              >
                <div className="bg-[#022c22]/80 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-xl flex flex-col items-center" style={{ borderColor: `${accentColor}50` }}>
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: accentColor }}>{hotspot.title}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* --- SCROLL INDICATOR --- */}
     // HeroSection.tsx veya AboutSection'ın en üstü için güncellenmiş Kaydır kısmı

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 2, duration: 1 }}
  className="absolute sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-50 pointer-events-none"
>
  {/* El Yazısı Fontuyla (varsa sitendeki el yazısı fontu, yoksa italic serif) */}
  <span className="font-serif italic text-sm text-[#022c22]/70 tracking-tight">
    Hikayemize göz at...
  </span>

  {/* El Çizimi Görünümlü Ok (SVG) */}
  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-100"
    >
      {/* Elle çizilmiş gibi duran yamuk bir ok yolu */}
      <path 
        d="M12 3V19M12 19L7 14M12 19L17 14" 
        stroke="#8AD7D6" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeDasharray="1,2" /* Kesik çizgili el çizimi efekti */
      />
    </svg>
  </motion.div>
</motion.div>

    </section>
  );
}