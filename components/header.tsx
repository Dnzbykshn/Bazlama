"use client"

import { Search, ChevronDown, Menu } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/menu", label: "Menü" },
  { href: "/galeri", label: "Galeri" },
  { href: "/bizi-taniyin", label: "Bizi Tanıyın" },
  { href: "/iletisim", label: "İletişim" },
]

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Left Section: Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-12 h-12">
              <Image
                src="/placeholder-logo.svg"
                alt="Muzlum Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-serif font-bold text-foreground hidden sm:block">
              Muzlum
            </span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                {index > 0 && <span className="text-muted-foreground">—</span>}
                <Link
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {/* Right Section: Search, Language */}
          <div className="flex items-center gap-4">

            <div className="hidden md:flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Memülde, ürünlerde ve şubele"
                className="border-0 bg-transparent text-sm w-56 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <Button variant="ghost" size="sm" className="font-bold">
              {"TR"}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="relative w-10 h-10">
                      <Image
                        src="/placeholder-logo.svg"
                        alt="Muzlum Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-lg font-serif font-bold">Muzlum</span>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-semibold uppercase tracking-wide hover:text-primary transition-colors py-2"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="pt-4 border-t space-y-4">
                    <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Ara..."
                        className="border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-between font-bold">
                      {"TR"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
