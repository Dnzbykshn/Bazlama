"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Phone, MapPin, ArrowUp, Coffee, Wheat, Utensils } from "lucide-react"
import { motion, Variants } from "framer-motion"
import Image from "next/image"


export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Animasyon Ayarları
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    // ARKA PLAN: Yeşil (#022c22) gitti -> Yerine Turkuaz'ın en koyu tonu (#081e1e) geldi.
    <footer className="relative bg-[#081e1e] text-slate-300 pt-32 pb-10 overflow-hidden">
      
      {/* --- ÜST DALGA (BEYAZ) --- */}
      {/* Üstteki Slider bölümü beyaz bittiği için burası beyaz olmalı */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative w-full h-full"
      >
        
        {/* Dekoratif Arka Plan İkonları (Turkuazın silik hali) */}
        <div className="absolute top-20 right-10 w-40 h-40 opacity-[0.03] rotate-12 pointer-events-none text-[#8AD7D6]"><Coffee className="w-full h-full" /></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 opacity-[0.02] -rotate-12 pointer-events-none text-[#8AD7D6]"><Utensils className="w-full h-full" /></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 opacity-[0.02] rotate-45 pointer-events-none text-white -translate-x-1/2 -translate-y-1/2"><Wheat className="w-full h-full" /></div>

        <div className="container mx-auto px-6 relative z-10">

          {/* Ana Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 border-b border-[#8AD7D6]/10 pb-16">

            {/* 1. KOLON: MARKA & HAKKINDA */}
            <div className="lg:col-span-4 space-y-8">
              <Link href="/" className="flex items-center gap-4 group">
                {/* Logo Kutusu */}
                <div className="relative w-16 h-16 bg-[#8AD7D6]/10 rounded-2xl border border-[#8AD7D6]/20 p-3 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:bg-[#8AD7D6] group-hover:text-[#081e1e] transition-all duration-500">
                   <span className="text-3xl transition-transform group-hover:scale-110">
                   <Image
                      src="/pisikahvalti-logo.png"
                      alt="Pişi Kahvaltı Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                      priority
                    />
                   </span>
                </div>
                <div>
                  <span className="text-3xl font-serif font-bold text-white tracking-wide block">Pişi Kahvaltı</span>
                  <span className="text-xs text-[#8AD7D6] tracking-[0.3em] uppercase font-bold">Sivas'ın İncisi</span>
                </div>
              </Link>
              
              <p className="text-slate-400 leading-relaxed font-light text-sm max-w-sm">
                Sıcak pişiler, taze demlenmiş çay ve yöresel lezzetlerle dolu bir sofra.
                Günün en güzel öğünü için sizi bekliyoruz.
              </p>
              
              {/* Sosyal Medya */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "https://www.facebook.com/pisikahvalticafe", label: "Facebook" },
                  { icon: Instagram, href: "https://www.instagram.com/pisikahvaltisivas/", label: "Instagram" },
                  // { icon: Twitter, href: "#", label: "Twitter" }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-[#8AD7D6]/5 border border-[#8AD7D6]/10 flex items-center justify-center text-slate-300 hover:bg-[#8AD7D6] hover:text-[#081e1e] hover:border-[#8AD7D6] hover:-translate-y-1 transition-all duration-300 shadow-md"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* 2. KOLON: KURUMSAL LİNKLER */}
            <div className="lg:col-span-2">
              <h4 className="font-serif font-bold text-lg text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#8AD7D6]"></span> Kurumsal
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  { name: 'Hakkımızda', href: '/bizi-taniyin' },
                  { name: 'Şubelerimiz', href: '/subeler' },
                  { name: 'Franchise', href: '/franchise' },
                  { name: 'Kariyer', href: '/iletisim' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-[#8AD7D6] transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 text-[#8AD7D6] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. KOLON: MENÜ LİNKLERİ */}
            <div className="lg:col-span-2">
              <h4 className="font-serif font-bold text-lg text-white mb-6 flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-[#8AD7D6]"></span> Menü
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  { name: 'Sınırsız Serpme', href: '/menu' },
                  { name: 'Sıcak Pişiler', href: '/menu' },
                  { name: 'Tava Lezzetleri', href: '/menu' },
                  { name: 'İçecekler', href: '/menu' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-[#8AD7D6] transition-colors flex items-center gap-2 group">
                       <ChevronRight className="w-3 h-3 text-[#8AD7D6] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. KOLON: İLETİŞİM */}
            <div className="lg:col-span-4">
              <h4 className="font-serif font-bold text-lg text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#8AD7D6]"></span> Bize Ulaşın
              </h4>
              
              <div className="space-y-4">
                {/* Telefon Kartı */}
                <a href="tel:+905402714040" className="flex items-center gap-4 group p-4 rounded-xl bg-[#8AD7D6]/5 border border-[#8AD7D6]/10 hover:border-[#8AD7D6]/40 hover:bg-[#8AD7D6]/10 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#8AD7D6]/10 flex items-center justify-center text-[#8AD7D6] group-hover:scale-110 transition-transform shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[#8AD7D6] text-[10px] uppercase tracking-wider mb-1 font-bold opacity-80">Rezervasyon Hattı</span>
                    <span className="text-white font-medium text-lg tracking-wide group-hover:text-[#8AD7D6] transition-colors">+90 540 271 40 40</span>
                  </div>
                </a>

                {/* Adres Kartı */}
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group p-4 rounded-xl bg-[#8AD7D6]/5 border border-[#8AD7D6]/10 hover:border-[#8AD7D6]/40 hover:bg-[#8AD7D6]/10 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#8AD7D6]/10 flex items-center justify-center text-[#8AD7D6] group-hover:scale-110 transition-transform shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[#8AD7D6] text-[10px] uppercase tracking-wider mb-1 font-bold opacity-80">Adres</span>
                    <span className="text-slate-300 font-light text-sm block leading-relaxed group-hover:text-white transition-colors">
                      Kızılırmak Mah. Vatan Cad. 16 D,<br />Merkez / Sivas
                    </span>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* ALT BAR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium border-t border-[#8AD7D6]/10 pt-8">
            <p className="flex items-center gap-1">
              © {new Date().getFullYear()} Pişi Kahvaltı. 
              <span className="hidden md:inline text-slate-600">|</span> 
              <span className="opacity-70">Tüm hakları saklıdır.</span>
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/gizlilik" className="hover:text-[#8AD7D6] transition-colors">Gizlilik Politikası</Link>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-[#8AD7D6] hover:text-white transition-colors border border-[#8AD7D6]/20 px-4 py-2 rounded-full hover:bg-[#8AD7D6] hover:border-[#8AD7D6]"
              >
                Yukarı Çık <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </footer>
  )
}

// ChevronRight İkonu (Eğer lucide-react'tan çekmediysen diye, ama yukarıda import ettik)
function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6"/>
        </svg>
    )
}