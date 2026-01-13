"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowUp } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-stone-900 text-stone-100 rounded-t-[3rem] -mt-12 relative z-10"
    >
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white/10 rounded-xl p-2">
                {/* Placeholder generic logo representation if image fails */}
                <div className="w-full h-full flex items-center justify-center text-white font-serif font-bold text-xl">
                  M
                </div>
              </div>
              <span className="text-2xl font-serif font-bold tracking-wide">Muzlum</span>
            </Link>
            <p className="text-stone-400 leading-relaxed font-light">
              Geleneksel Türk kahvaltısının en lezzetli hali. Doymadan kaçmak yasak!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 text-primary">Hızlı Linkler</h3>
            <nav className="flex flex-col gap-4">
              {[
                { name: 'Anasayfa', href: '/' },
                { name: 'Menü', href: '/menu' },
                { name: 'Galeri', href: '/galeri' },
                { name: 'Bizi Tanıyın', href: '/bizi-taniyin' },
                { name: 'İletişim', href: '/iletisim' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-stone-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 text-primary">İletişim</h3>
            <div className="flex flex-col gap-6 text-stone-400">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-[-4px]">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="leading-relaxed">Örnek Mahalle, Örnek Sokak No:1<br />İstanbul, Türkiye</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Phone className="w-5 h-5 group-hover:text-white" />
                </div>
                <a href="tel:+905551234567" className="group-hover:text-white transition-colors">
                  +90 555 123 45 67
                </a>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Mail className="w-5 h-5 group-hover:text-white" />
                </div>
                <a href="mailto:info@muzlum.com" className="group-hover:text-white transition-colors">
                  info@muzlum.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 text-primary">Bizi Takip Edin</h3>
            <div className="flex gap-4 mb-8">
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
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>© {new Date().getFullYear()} Muzlum. Tüm hakları saklıdır.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            Yukarı Çık <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.footer>
  )
}
