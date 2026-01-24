"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Home, Utensils, Coffee, Search, Compass, MapPin } from "lucide-react"
import { Caveat, Inter, Playfair_Display, Patrick_Hand } from "next/font/google"

// --- FONT AYARLARI ---
const caveat = Caveat({ subsets: ["latin"], weight: ["700"] })
const patrick = Patrick_Hand({ subsets: ["latin"], weight: ["400"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "800"] })
const inter = Inter({ subsets: ["latin"] })

export default function NotFound() {
  return (
    <main className={`min-h-screen bg-[#ffffff] selection:bg-[#8AD7D6] selection:text-white ${inter.className} flex flex-col`}>
      <Header />
      
      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden pt-20 pb-20 px-4">
        
        {/* Dekoratif Arka Plan (Hareketli İkonlar) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Kağıt Dokusu */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }}></div>
            
            {/* Süzülen İkonlar */}
            <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-10 md:left-1/4 text-[#8AD7D6]/10"
            >
                <Coffee size={120} strokeWidth={1} />
            </motion.div>
            
            <motion.div 
                animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-10 md:right-1/4 text-yellow-400/10"
            >
                <Compass size={150} strokeWidth={1} />
            </motion.div>

            <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 text-stone-900/5"
            >
                <Search size={80} strokeWidth={1} />
            </motion.div>
        </div>

        {/* Merkez İçerik */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
            
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                {/* 404 Tipografisi */}
                <h1 className={`text-[10rem] md:text-[14rem] leading-none font-black text-stone-900/5 select-none ${playfair.className}`}>
                    404
                </h1>
                
                {/* Üstüne binen samimi başlık */}
                <div className="-mt-16 md:-mt-24 relative">
                    <div className="inline-block bg-[#8AD7D6] text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg transform -rotate-3 mb-4">
                        Ops! Kaybolduk galiba
                    </div>
                    <h2 className={`text-4xl md:text-6xl font-bold text-stone-900 ${playfair.className}`}>
                        Sanırım Yanlış <br />
                        <span className="text-[#8AD7D6]">Masaya</span> Oturdunuz
                    </h2>
                </div>
            </motion.div>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={`mt-6 text-xl text-stone-500 max-w-lg mx-auto leading-relaxed ${patrick.className}`}
            >
                Aradığınız sayfa menümüzde bulunmuyor veya mutfağa taşınmış olabilir. 
                Endişelenmeyin, sizi ana sayfaya veya lezzet dolu menümüze götürebiliriz.
            </motion.p>

            {/* Butonlar */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-10"
            >
                <Link href="/">
                    <Button size="lg" className="w-full sm:w-auto bg-[#8AD7D6] hover:bg-[#8AD7D6] text-white rounded-xl h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
                        <Home className="mr-2 w-5 h-5 group-hover:text-stone-900 transition-colors" />
                        <span className="group-hover:text-stone-900 transition-colors">Anasayfaya Dön</span>
                    </Button>
                </Link>
                <Link href="/menu">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 bg-white border-teal-200 hover:border-[#8AD7D6] hover:bg-white text-stone-600 hover:text-[#8AD7D6] rounded-xl h-14 text-lg font-bold transition-all hover:-translate-y-1">
                        <Utensils className="mr-2 w-5 h-5" />
                        Menüyü İncele
                    </Button>
                </Link>
            </motion.div>

            {/* Alt İpucu */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-stone-400 text-sm flex items-center justify-center gap-2"
            >
                <MapPin className="w-4 h-4" />
                <span>Belki de bir <Link href="/subeler" className="underline hover:text-[#8AD7D6] transition-colors">Şubemizi</Link> arıyordunuz?</span>
            </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  )
}