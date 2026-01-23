"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

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

interface AboutPage {
  hero_badge: string | null
  hero_title: string | null
  hero_description: string | null
  story_image_url: string | null
  story_title: string | null
  story_content_paragraph1: string | null
  story_content_paragraph2: string | null
  values_title: string | null
  values_subtitle: string | null
  value1_title: string | null
  value1_desc: string | null
  value2_title: string | null
  value2_desc: string | null
  value3_title: string | null
  value3_desc: string | null
  mission_title: string | null
  mission_content_paragraph1: string | null
  mission_content_paragraph2: string | null
  mission_image_url: string | null
  vision_title: string | null
  vision_content_paragraph1: string | null
  vision_content_paragraph2: string | null
  vision_image_url: string | null
  franchise_title: string | null
  franchise_description: string | null
  franchise_button_text: string | null
}

export default function BiziTaniyinPage() {
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutPage()
  }, [])

  async function fetchAboutPage() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("about_page")
        .select("*")
        .limit(1)
        .single()

      if (error) throw error
      setAboutPage(data)
    } catch (error) {
      console.error("Error fetching about page:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen overflow-hidden">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
        <Footer />
      </main>
    )
  }

  const defaultValues = {
    hero_badge: "Hikayemiz",
    hero_title: "Bizi Tanıyın",
    hero_description: "Geleneksel Türk kahvaltısının en özel halini, modern bir dokunuş ve sonsuz bir sevgiyle harmanlıyoruz.",
    story_image_url: "/images/image.png",
    story_title: "Soframızın Hikayesi",
    story_content_paragraph1: "Pişi Kahvaltı, sadece bir kahvaltı mekanı değil; geleneksel Türk misafirperverliğinin vücut bulmuş halidir. Her sabah gün doğmadan başlayan hazırlığımız, annelerimizin tariflerine sadık kalarak devam ediyor.",
    story_content_paragraph2: 'Modern yaşamın koşuşturmacası içinde, "doymadan kalkmak yok" diyerek sizi yavaşlamaya, sevdiklerinizle uzun ve keyifli bir sofrayı paylaşmaya davet ediyoruz.',
    values_title: "Değerlerimiz",
    values_subtitle: "Bizi biz yapan özelliklerimiz",
    value1_title: "Tazelik",
    value1_desc: "Bahçeden sofraya, her zaman en taze ve doğal ürünler.",
    value2_title: "Gelenek",
    value2_desc: "Yüzyıllık tarifler, değişmeyen lezzetler ve özlenen tatlar.",
    value3_title: "Sevgi",
    value3_desc: "Ailenizle hissetmeniz için her detaya işlenen özen ve sevgi.",
    mission_title: "Misyonumuz",
    mission_content_paragraph1: '"Siz tamam diyene kadar, biz servise devam ediyoruz ;)" felsefesiyle yola çıktık. Amacımız sadece karnınızı doyurmak değil; gözünüzü ve gönlünüzü de doyurmak.',
    mission_content_paragraph2: "Her misafirimizin, kendi evinde hissettiği o sıcaklığı ve samimiyeti yaşamasını sağlamak bizim en büyük tutkumuz.",
    mission_image_url: "/images/image.png",
    vision_title: "Vizyonumuz",
    vision_content_paragraph1: "Gelecekte, Türkiye'nin her köşesinde Pişi Kahvaltı'nın sıcaklığını ve lezzetini yaşatmak istiyoruz.",
    vision_content_paragraph2: "Geleneksel değerlerimizi koruyarak, modern dünyanın ihtiyaçlarına uyum sağlayan, sürdürülebilir ve başarılı bir franchise ağı oluşturmak en büyük hedefimiz.",
    vision_image_url: "/images/image.png",
    franchise_title: "Franchise Fırsatı",
    franchise_description: "Pişi Kahvaltı ailesine katılın ve kendi işinizin sahibi olun. Başarılı bir franchise sistemi ile yanınızdayız.",
    franchise_button_text: "Franchise Başvurusu Yap",
  }

  const content = aboutPage || defaultValues

  return (
    <main className="min-h-screen overflow-hidden bg-transparent">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 relative overflow-hidden">
        <motion.div
          className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
              {content.hero_badge}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
              {content.hero_title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light italic">
              {content.hero_description}
            </p>
          </motion.div>
        </motion.div>
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
              src={content.story_image_url || "/images/image.png"}
              alt="Pişi Kahvaltı Mekan"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          <motion.div variants={fadeIn} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {content.story_title?.includes(" ") ? (
                <>
                  {content.story_title.split(" ").slice(0, -1).join(" ")} <br />
                  <span className="text-primary">{content.story_title.split(" ").slice(-1)[0]}</span>
                </>
              ) : (
                content.story_title
              )}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light italic">
              <p>{content.story_content_paragraph1}</p>
              <p>{content.story_content_paragraph2}</p>
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
            <h2 className="text-4xl font-serif font-bold mb-4">{content.values_title}</h2>
            <p className="text-muted-foreground italic">{content.values_subtitle}</p>
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
                title: content.value1_title,
                desc: content.value1_desc
              },
              {
                title: content.value2_title,
                desc: content.value2_desc
              },
              {
                title: content.value3_title,
                desc: content.value3_desc
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
                <p className="text-muted-foreground leading-relaxed italic">
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
            <h2 className="text-4xl font-serif font-bold text-white">{content.mission_title}</h2>
            <p className="text-lg text-stone-300 leading-relaxed font-light italic">
              {content.mission_content_paragraph1}
            </p>
            <p className="text-lg text-stone-300 leading-relaxed font-light italic">
              {content.mission_content_paragraph2}
            </p>
          </motion.div>

          <motion.div variants={slideInRight} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={content.mission_image_url || "/images/image.png"}
              alt="Pişi Kahvaltı Değerler"
              fill
              className="object-cover opacity-90"
            />
          </motion.div>
        </motion.section>

        {/* Vision Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={slideInLeft} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={content.vision_image_url || "/images/image.png"}
              alt="Pişi Kahvaltı Vizyon"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          <motion.div variants={slideInRight} className="space-y-6">
            <h2 className="text-4xl font-serif font-bold text-foreground">
              {content.vision_title?.includes(" ") ? (
                <>
                  {content.vision_title.split(" ").slice(0, -1).join(" ")} <br />
                  <span className="text-primary">{content.vision_title.split(" ").slice(-1)[0]}</span>
                </>
              ) : (
                content.vision_title
              )}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light italic">
              <p>{content.vision_content_paragraph1}</p>
              <p>{content.vision_content_paragraph2}</p>
            </div>
          </motion.div>
        </motion.section>

        {/* Franchise CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[3rem] p-8 md:p-16 text-center space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold">{content.franchise_title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
            {content.franchise_description}
          </p>
          <Link href="/franchise">
            <Button size="lg" className="mt-4">
              {content.franchise_button_text}
            </Button>
          </Link>
        </motion.section>
      </div>

      <Footer />
    </main>
  )
}
