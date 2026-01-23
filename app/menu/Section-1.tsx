"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Caveat, Patrick_Hand, Inter } from "next/font/google"
import { Flower2, ChevronDown } from "lucide-react"

// Fontlar
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] })
const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: ["400"] })
const inter = Inter({ subsets: ["latin"] })

export function Section1() {
  const [index, setIndex] = useState(0)
  
  const images = [
    "/DSC07011.jpg", 
    "/DSC04385.jpg", 
    "/Szutest-5.jpg"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  // Yazı animasyonları
  const textContainerVar = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 } // Sayfa yüklenince 1 kere çalışır
    }
  }

  const textItemVar = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-stone-900">
      
      {/* KATMAN 1: ARKA PLAN SLIDER (Sadece burası değişir) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[index]}
              alt="Hero görseli"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* KATMAN 2: SABİT GRADIENT (ÖNEMLİ: Bu döngünün dışına alındı!) */}
      {/* Resim değişse bile bu katman sabit durduğu için alttaki dalgayla bağlantı kopmaz */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#FDFBF7] via-transparent to-black/30 pointer-events-none" />

      {/* KATMAN 3: SABİT YAZILAR (Resimden bağımsız) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
        <motion.div 
           variants={textContainerVar}
           initial="hidden"
           animate="show"
           className="relative"
           // key prop'u VERMEDİK. Böylece resim değişse bile React burayı yeniden çizmez.
        >
            {/* Çiçekler ve Üst Yazı */}
            <motion.div variants={textItemVar} className="flex items-center justify-center gap-4 mb-4 text-[#8AD7D6]">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Flower2 className="w-8 h-8 opacity-90" />
                </motion.div>
                
                <span className={`text-xl md:text-2xl font-bold tracking-[0.4em] uppercase text-white drop-shadow-md ${inter.className}`}>
                  Sivas'ın İncisi
                </span>
                
                <motion.div 
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Flower2 className="w-8 h-8 opacity-90" />
                </motion.div>
            </motion.div>

            {/* Ana Başlık */}
            <motion.h1 
               variants={textItemVar}
               className={`text-7xl md:text-[9rem] font-bold text-white mb-8 leading-none drop-shadow-2xl ${caveat.className}`}
            >
              Pişi Kahvaltı
            </motion.h1>

            {/* Açıklama Kutusu */}
            <motion.div 
               variants={textItemVar}
               className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-10 py-4 inline-block shadow-lg"
            >
              <p className={`text-2xl md:text-4xl text-white/95 ${patrickHand.className}`}>
                Sıcak pişiler, sınırsız çay ve mutluluk dolu sofralar.
              </p>
            </motion.div>
        </motion.div>
      </div>

      {/* SCROLL İNDİKATÖRÜ */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-stone-600/70 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>

      {/* KATMAN 4: WAVE (SABİT) */}
      <div className="absolute -bottom-48 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" style={{ transform: 'rotate(180deg)' }}>
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FDFBF7"></path>
          </svg>
      </div>
    </section>
  )
}