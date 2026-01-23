"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Utensils, ArrowRight } from "lucide-react"

// Marka Rengi (Turkuaz)
const accentColor = "#8AD7D6";

export function MenuCTASection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden" style={{ backgroundColor: accentColor }}>
      
      {/* --- ÜST DALGA (KREM) --- */}
      {/* "Üst Okey" dediğin kısım: Üstteki bölümle birleşiyor */}
      <div className="absolute top-0 left-0 w-full leading-[0] z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#FDFBF7" 
          ></path>
        </svg>
      </div>

      <div className="container mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          // KART TASARIMI: Turkuaz zemin üzerinde hafif belirginleşen kutu
          className="max-w-5xl mx-auto rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl"
          style={{ 
            background: "rgba(0, 44, 34, 0.05)", // Çok hafif koyu bir katman
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          {/* Dekoratif Işıklar */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 mb-8 backdrop-blur-sm shadow-sm border border-white/10">
              <Utensils className="w-10 h-10 text-[#022c22]" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#022c22] mb-6 leading-tight">
              Lezzetlerimizi Keşfedin
            </h2>
            
            <p className="text-lg md:text-2xl text-[#022c22]/80 mb-10 max-w-2xl mx-auto leading-relaxed italic font-serif">
              Sınırsız kahvaltı menümüz ve geleneksel lezzetlerimizle sofralarınızı şenlendirin. 
              Tüm menümüzü inceleyin ve favori lezzetlerinizi keşfedin.
            </p>
            
            <Link href="/menu">
              <Button 
                size="lg" 
                className="group px-10 py-8 text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl"
                style={{ 
                    backgroundColor: "#22c55e", 
                    color: "white",
                    boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
                }}
              >
                Menüyü Görüntüle
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* --- ALT DALGA (BEYAZ) --- */}
      {/* Bu kısım Turkuaz bölümü bitirip Beyaz bölüme (Footer/Galeri) geçişi sağlar */}
      <div className="absolute bottom-0 left-0 w-full leading-[0] z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]"
        >
          {/* Alttaki bölümün rengi: Beyaz (#FFFFFF) */}
          <path
            d="M985.66,92.83C906.67,72,823.78,31,744.29,41.56c-82.26,17.34-168.06,16.33-250.45-.39-57.84-11.73-114-31.07-172-41.86A600.21,600.21,0,0,1,0,27.35V120H1200V75.83C1132.19,98.92,1055.71,111.31,985.66,92.83Z"
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>

    </section>
  )
}