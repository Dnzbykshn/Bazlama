"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Phone } from "lucide-react"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto rounded-[3.5rem] bg-stone-900 px-6 py-20 md:p-24 text-center text-white relative overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Sizi Bekliyoruz
            </h2>
            <p className="text-lg md:text-xl text-stone-300 font-light italic">
              Lezzetli bir kahvaltı ve sıcak bir sohbet için hemen yerinizi ayırtın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/iletisim">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                  <UtensilsCrossed className="w-5 h-5 mr-2" />
                  Rezervasyon Yap
                </Button>
              </Link>
              <Link href="/iletisim">
                <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm hover:scale-105 transition-all">
                  <Phone className="w-5 h-5 mr-2" />
                  İletişime Geç
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
