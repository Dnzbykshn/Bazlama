"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Phone, MapPin, ArrowUp, Coffee, Wheat, Utensils } from "lucide-react"
import { motion, Variants } from "framer-motion"

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Animation Variants
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
    <footer className="relative bg-stone-950 text-stone-300 pt-20 pb-10 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative w-full h-full"
      >
        {/* Top Neon Line Separator */}
        <div className="absolute top-[-80px] left-0 w-full h-[1px] bg-[#8AD7D6] shadow-[0_0_20px_2px_#8AD7D6] z-20 opacity-80" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#8AD7D6] to-transparent shadow-[0_0_30px_#8AD7D6] z-20 opacity-60" />

        {/* Floating Background Icons - Subtle & Static */}
        <div className="absolute top-10 right-10 w-32 h-32 opacity-[0.03] rotate-12 pointer-events-none text-white"><Coffee className="w-full h-full" /></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 opacity-[0.02] -rotate-12 pointer-events-none text-white"><Utensils className="w-full h-full" /></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 opacity-[0.03] rotate-45 pointer-events-none text-white -translate-x-1/2 -translate-y-1/2"><Wheat className="w-full h-full" /></div>

        <div className="container mx-auto px-6 relative z-10">

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 border-b border-white/5 pb-16">

            {/* Brand Column (Span 4) */}
            <div className="lg:col-span-4 space-y-8">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="relative w-14 h-14 bg-stone-900 rounded-2xl border border-white/10 p-3 overflow-hidden group-hover:border-[#8AD7D6]/50 transition-colors shadow-2xl">
                  <Image
                    src="/pisikahvalti-logo.png"
                    alt="Pişi Kahvaltı Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-2xl font-serif font-bold text-white tracking-wide block">Pişi Kahvaltı</span>
                  <span className="text-xs text-[#8AD7D6] tracking-[0.2em] uppercase">Sivas'ın İncisi</span>
                </div>
              </Link>
              <p className="text-stone-400 leading-relaxed font-light text-sm max-w-sm">
                Sıcak pişiler, taze demlenmiş çay ve yöresel lezzetlerle dolu bir sofra.
                Günün en güzel öğünü için sizi bekliyoruz.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                  { icon: Twitter, href: "https://twitter.com", label: "Twitter" }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center hover:bg-[#8AD7D6] hover:text-stone-900 hover:border-[#8AD7D6] hover:-translate-y-1 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Column 1 (Span 2) */}
            <div className="lg:col-span-2">
              <h4 className="font-serif font-bold text-lg text-white mb-6">Kurumsal</h4>
              <ul className="space-y-4 text-sm">
                {[
                  { name: 'Hakkımızda', href: '/bizi-taniyin' },
                  { name: 'Şubelerimiz', href: '/subeler' },
                  { name: 'Franchise', href: '/franchise' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-stone-400 hover:text-[#8AD7D6] transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#8AD7D6] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 2 (Span 2) */}
            <div className="lg:col-span-2">
              <h4 className="font-serif font-bold text-lg text-white mb-6">Menü & Hızmetler</h4>
              <ul className="space-y-4 text-sm">
                {[
                  { name: 'Kahvaltı Tabağı', href: '/menu' },
                  { name: 'Sıcak Pişiler', href: '/menu' },
                  { name: 'İçecekler', href: '/menu' },
                  { name: 'Catering', href: '/iletisim' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-stone-400 hover:text-[#8AD7D6] transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#8AD7D6] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column (Span 4) */}
            <div className="lg:col-span-4">
              <h4 className="font-serif font-bold text-lg text-white mb-6">Bize Ulaşın</h4>
              <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                Sorularınız, rezervasyonlarınız ve görüşleriniz için haftanın her günü hizmetinizdeyiz.
              </p>

              <div className="space-y-4">
                {/* Phone Card */}
                <a href="tel:+905402714040" className="flex items-center gap-4 group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#8AD7D6]/30 transition-all hover:bg-white/10 hover:-translate-y-1 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#8AD7D6]/10 flex items-center justify-center text-[#8AD7D6] group-hover:bg-[#8AD7D6] group-hover:text-stone-900 transition-all shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-stone-500 text-xs uppercase tracking-wider mb-1 font-semibold">Telefon</span>
                    <span className="text-stone-200 group-hover:text-white transition-colors font-medium text-lg">+90 540 271 40 40</span>
                  </div>
                </a>

                {/* Address Card */}
                <a
                  href="https://maps.google.com/maps?q=Kızılırmak+mah.+Vatan+cad.+16+D,+Sivas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#8AD7D6]/30 transition-all hover:bg-white/10 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#8AD7D6]/10 flex items-center justify-center text-[#8AD7D6] group-hover:bg-[#8AD7D6] group-hover:text-stone-900 transition-all shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-stone-500 text-xs uppercase tracking-wider mb-1 font-semibold">Adres</span>
                    <span className="text-stone-200 group-hover:text-white transition-colors leading-relaxed font-medium block">
                      Kızılırmak mah. Vatan cad. 16 D,<br />Sivas / Merkez
                    </span>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-medium">
            <p>© {new Date().getFullYear()} Pişi Kahvaltı. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-6">
              <Link href="/gizlilik" className="hover:text-[#8AD7D6] transition-colors">Gizlilik Politikası</Link>
              <Link href="/kullanim-kosullari" className="hover:text-[#8AD7D6] transition-colors">Kullanım Koşulları</Link>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 hover:text-[#8AD7D6] transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:border-[#8AD7D6]"
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
