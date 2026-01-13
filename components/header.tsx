"use client"

import { Search, ChevronDown, Menu } from "lucide-react"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/menu", label: "Menü" },
  { href: "/galeri", label: "Galeri" },
  { href: "/bizi-taniyin", label: "Bizi Tanıyın" },
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
        bg-white/70 backdrop-blur-xl 
        shadow-lg shadow-black/5 
        border border-white/20
        rounded-full 
        transition-all duration-300
        ${scrolled ? 'bg-white/80 shadow-xl' : ''}
      `}>
        {/* Left Section: Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
          <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
            {/* Placeholder Logo Logic */}
            <div className="font-serif font-bold text-primary text-xl">M</div>
          </div>
          <span className="text-xl font-serif font-bold text-foreground hidden sm:block tracking-wide">
            Muzlum
          </span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 hover:text-primary px-5 py-2.5 rounded-full hover:bg-white transition-all duration-300 hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-stone-100 hidden sm:flex">
            <Search className="w-5 h-5 text-stone-500" />
          </Button>

          <Button variant="ghost" size="sm" className="font-medium rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 hidden sm:flex">
            {"TR"}
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-stone-100">
                <Menu className="w-6 h-6 text-stone-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-white/20 bg-white/90 backdrop-blur-xl rounded-l-[2rem]">
              <div className="flex flex-col gap-8 mt-12 px-2">
                <div className="flex items-center gap-3 pb-6 border-b border-stone-100">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="font-serif font-bold text-primary text-2xl">M</span>
                  </div>
                  <span className="text-2xl font-serif font-bold">Muzlum</span>
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-stone-600 hover:text-primary hover:bg-stone-50 px-4 py-3 rounded-2xl transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
