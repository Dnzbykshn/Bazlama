import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/placeholder-logo.svg"
                  alt="Muzlum Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-serif font-bold">Muzlum</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Geleneksel Türk kahvaltısının en lezzetli hali. Doymadan kaçmak yasak!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold uppercase tracking-wide mb-4">Hızlı Linkler</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Anasayfa
              </Link>
              <Link href="#menu" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Menü
              </Link>
              <Link href="#galeri" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Galeri
              </Link>
              <Link href="#bizi-taniyin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Bizi Tanıyın
              </Link>
              <Link href="#iletisim" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                İletişim
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold uppercase tracking-wide mb-4">İletişim</h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Örnek Mahalle, Örnek Sokak No:1</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+905551234567" className="hover:text-primary transition-colors">
                  +90 555 123 45 67
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@muzlum.com" className="hover:text-primary transition-colors">
                  info@muzlum.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold uppercase tracking-wide mb-4">Sosyal Medya</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Muzlum. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}


