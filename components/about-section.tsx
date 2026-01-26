"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Logonun tam rengi
const accentColor = "#8AD7D6";

interface HeroImage {
  id: string;
  image_url: string;
  hero_main: boolean;
}

export function AboutSection() {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [smallImages, setSmallImages] = useState<(string | null)[]>([null, null, null, null]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroImages() {
      try {
        if (!isSupabaseConfigured) {
          setIsLoading(false);
          return;
        }

        // Fetch main hero image
        const { data: mainData } = await supabase
          .from("gallery")
          .select("id, image_url")
          .eq("hero_main", true)
          .limit(1)
          .single();

        if (mainData) {
          setMainImage(mainData.image_url);
        }

        // Fetch small hero images (hero_section but not hero_main)
        const { data: smallData } = await supabase
          .from("gallery")
          .select("id, image_url")
          .eq("hero_section", true)
          .eq("hero_main", false)
          .order("position", { ascending: true })
          .limit(4);

        if (smallData && smallData.length > 0) {
          const images: (string | null)[] = smallData.map((item: HeroImage) => item.image_url);
          // Fill remaining slots with null
          while (images.length < 4) {
            images.push(null);
          }
          setSmallImages(images);
        }
      } catch (error) {
        console.error("Error fetching hero images:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHeroImages();
  }, []);

  return (
    // mt-[-1px] Hero ile aradaki olası beyaz boşluğu kapatır
    <section className="relative bg-[#FDFBF7] pt-24 pb-24 lg:pb-32 mt-[-5px] overflow-visible">
      
      {/* --- TURKUAZ & KREM GEÇİŞLİ DALGA (SVG) --- */}
      {/* Bu div Hero'nun koyu zeminine yukarıdan 'diş atar' */}
      <div className="absolute -top-[65px] md:-top-[110px] left-0 w-full overflow-hidden leading-[0] z-0 pointer-events-none">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-[calc(100%+1.3px)] h-[70px] md:h-[115px]"
        >
          {/* Hero'nun koyu petrol yeşilinden bu bölümün kremine kavisli geçiş */}
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#FDFBF7" 
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* --- SOL TARAF: SKETCHY METİN --- */}
          <div className="flex-1 space-y-8 order-2 lg:order-1 text-center lg:text-left">
            <motion.div
               initial={{ opacity: 0, rotate: -5 }}
               whileInView={{ opacity: 1, rotate: -2 }}
               viewport={{ once: true }}
               className="inline-block relative"
            >
                <span className="relative z-10 py-1.5 px-6 text-sm font-bold tracking-widest text-[#022c22] uppercase">
                    Hikayemiz
                </span>
                <div 
                    className="absolute inset-0 -z-10 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] opacity-40"
                    style={{ backgroundColor: accentColor }}
                />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#022c22] leading-[1.1]">
              Geleneksel Lezzet, <br />
              <span className="italic font-light" style={{ color: accentColor }}>Modern Dokunuş</span>
            </h2>

            <div className="space-y-6 text-lg text-stone-600 font-serif italic leading-relaxed max-w-lg mx-auto lg:mx-0">
              <p>
                Pişi Kahvaltı olarak, sadece karın doyurmayı değil, her sabah yeniden doğan o sıcak aile sofrası ruhunu yaşatmayı amaçlıyoruz.
              </p>
              <p>
                Organik bahçelerden gelen tazelik ve annelerimizin el emeği pişilerimizle, Ege&apos;nin o dingin sabahlarını sofranıza konuk ediyoruz.
              </p>
            </div>

            {/* El Çizimi Çerçeveli Slogan */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative inline-block p-6 mt-4"
            >
                <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <path 
                        d="M5,5 Q150,2 295,5 Q298,50 295,95 Q150,98 5,95 Q2,50 5,5" 
                        fill="none" 
                        stroke={accentColor} 
                        strokeWidth="2"
                        strokeDasharray="6,4"
                    />
                </svg>
                <p className="font-serif text-xl font-bold italic" style={{ color: "#022c22" }}>
                    &quot;Siz tamam diyene kadar, biz servise devam ediyoruz ;)&quot;
                </p>
            </motion.div>
          </div>

          {/* --- SAĞ TARAF: EL ÇİZİMİ ÇERÇEVELİ KOLAJ --- */}
          <div className="flex-1 relative w-full order-1 lg:order-2">
            {/* Arka plan glow (Turkuaz) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 blur-[120px] opacity-30 rounded-full" style={{ backgroundColor: accentColor }} />

            <div className="relative grid grid-cols-12 gap-4 items-center">
              {/* ANA GÖRSEL: Siyah El Çizimi Çerçeve */}
              <motion.div 
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="col-span-7 relative aspect-square rotate-[-2deg] p-2 bg-white shadow-2xl border-[3px] border-stone-800"
                style={{ borderRadius: '4px 15px 5px 20px' }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm bg-stone-100">
                    {mainImage ? (
                      <Image src={mainImage} alt="Pişi Kahvaltı Mekan" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                </div>
              </motion.div>

              {/* KÜÇÜK POLAROIDLER: Dağınık ve Siyah Çerçeveli */}
              <div className="col-span-5 grid grid-cols-2 gap-3">
                 {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.1, zIndex: 30, rotate: 0 }}
                        className="relative aspect-square bg-white p-1 shadow-lg border border-stone-800 rotate-[4deg] even:-rotate-[4deg]"
                        style={{ borderRadius: '2px 8px 3px 10px' }}
                    >
                        <div className="relative w-full h-full overflow-hidden bg-stone-100">
                            {smallImages[i] ? (
                              <Image src={smallImages[i]!} alt="Kahvaltı Detay" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                        </div>
                    </motion.div>
                 ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}   