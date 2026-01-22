"use client"

import { Menu, MessageCircle } from "lucide-react"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/menu", label: "Menü" },
  { href: "/galeri", label: "Galeri" },
  { href: "/subeler", label: "Şubeler" },
  { href: "/bizi-taniyin", label: "Bizi Tanıyın" },
  { href: "/franchise", label: "Franchise Başvuru" },
  { href: "/iletisim", label: "İletişim" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for slightly changing appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-6 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 pointer-events-none`}
    >
      <div className={`
        pointer-events-auto
        flex items-center justify-between 
        w-full max-w-6xl 
        h-[4.5rem] px-4 sm:px-6 
        bg-teal-50/90 backdrop-blur-xl 
        shadow-lg shadow-teal-900/10 
        border border-teal-200/50
        rounded-full 
        transition-all duration-300
        ${scrolled ? 'bg-teal-50/95 shadow-xl shadow-teal-900/15' : ''}
      `}>
        {/* Left Section: Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
          <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform overflow-hidden">
            <Image
              src="/pisikahvalti-logo.png"
              alt="Pişi Kahvaltı Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-serif font-bold text-foreground hidden sm:block tracking-wide">
            Pişi Kahvaltı
          </span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-teal-800 hover:text-teal-600 px-5 py-2.5 rounded-full hover:bg-teal-100/80 transition-all duration-300 hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {/* WhatsApp Button */}
          <Link
            href="https://wa.me/905402714040"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30"
          >
            <MessageCircle className="w-4 h-4" fill="white" />
            WhatsApp
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-teal-100/80">
                <Menu className="w-6 h-6 text-teal-800" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-teal-200/50 bg-teal-50/95 backdrop-blur-xl rounded-l-[2rem]">
              <div className="flex flex-col gap-8 mt-12 px-2">
                <div className="flex items-center gap-3 pb-6 border-b border-teal-200/50">
                  <div className="relative w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/pisikahvalti-logo.png"
                      alt="Pişi Kahvaltı Logo"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-2xl font-serif font-bold">Pişi Kahvaltı</span>
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-teal-800 hover:text-teal-600 hover:bg-teal-100/80 px-4 py-3 rounded-2xl transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="https://wa.me/905402714040"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium text-white bg-[#25D366] hover:bg-[#20BA5A] px-4 py-3 rounded-2xl transition-all mt-2"
                  >
                    <MessageCircle className="w-5 h-5" fill="white" />
                    WhatsApp
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
