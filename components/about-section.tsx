"use client"

import { motion } from "framer-motion"

export function AboutSection() {
  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-16 shadow-xl shadow-stone-200/50 text-center space-y-8 border border-stone-100"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
            Hikayemiz
          </span>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Geleneksel Lezzet, <br />
            <span className="italic text-primary">Modern Dokunuş</span>
          </h2>

          <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
            <p>
              Pişi Kahvaltı olarak, geleneksel Türk kahvaltısının en özel halini sizlere sunuyoruz.
              Her sabah taze hazırlanan ürünlerimiz, annelerimizin elinden çıkmış gibi sıcacık sofralarınızda yerini alıyor.
            </p>
            <p>
              Organik malzemeler, geleneksel tarifler ve sevgiyle hazırlanan her bir lezzet,
              sizleri doyurmadan sofradan kalkmamanız için özenle hazırlanıyor.
            </p>
          </div>

          <div className="pt-4">
            <p className="font-serif text-2xl font-bold text-primary">Siz tamam diyene kadar, biz servise devam ediyoruz ;)</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
