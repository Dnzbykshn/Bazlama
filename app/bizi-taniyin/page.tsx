"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, type Variants } from "framer-motion"

// Animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function BiziTaniyinPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
              Hikayemiz
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
              Bizi Tanıyın
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Geleneksel Türk kahvaltısının en özel halini, modern bir dokunuş ve sonsuz bir sevgiyle harmanlıyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-24 space-y-32">
        {/* Story Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={slideInLeft} className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
            <Image
              src="/images/image.png"
              alt="Muzlum Mekan"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          <motion.div variants={fadeIn} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Soframızın <br />
              <span className="text-primary">Hikayesi</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
              <p>
                Muzlum, sadece bir kahvaltı mekanı değil; geleneksel Türk misafirperverliğinin vücut bulmuş halidir.
                Her sabah gün doğmadan başlayan hazırlığımız, annelerimizin tariflerine sadık kalarak devam ediyor.
              </p>
              <p>
                Modern yaşamın koşuşturmacası içinde, "doymadan kalkmak yok" diyerek sizi yavaşlamaya,
                sevdiklerinizle uzun ve keyifli bir sofrayı paylaşmaya davet ediyoruz.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Values Section */}
        <section className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold mb-4">Değerlerimiz</h2>
            <p className="text-muted-foreground">Bizi biz yapan özelliklerimiz</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Tazelik",
                desc: "Bahçeden sofraya, her zaman en taze ve doğal ürünler."
              },
              {
                title: "Gelenek",
                desc: "Yüzyıllık tarifler, değişmeyen lezzetler ve özlenen tatlar."
              },
              {
                title: "Sevgi",
                desc: "Ailenizle hissetmeniz için her detaya işlenen özen ve sevgi."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-[2rem] shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-stone-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary font-bold text-xl">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Mission Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center bg-stone-900 rounded-[3rem] p-8 md:p-16 text-stone-50 overflow-hidden relative"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

          <motion.div variants={slideInLeft} className="space-y-6 relative z-10">
            <h2 className="text-4xl font-serif font-bold text-white">Misyonumuz</h2>
            <p className="text-lg text-stone-300 leading-relaxed font-light">
              "Doymadan Kaçmak Yasak" felsefesiyle yola çıktık. Amacımız sadece karnınızı doyurmak değil;
              gözünüzü ve gönlünüzü de doyurmak.
            </p>
            <p className="text-lg text-stone-300 leading-relaxed font-light">
              Her misafirimizin, kendi evinde hissettiği o sıcaklığı ve samimiyeti yaşamasını sağlamak
              bizim en büyük tutkumuz.
            </p>
          </motion.div>

          <motion.div variants={slideInRight} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/image.png"
              alt="Muzlum Değerler"
              fill
              className="object-cover opacity-90"
            />
          </motion.div>
        </motion.section>
      </div>

      <Footer />
    </main>
  )
}
