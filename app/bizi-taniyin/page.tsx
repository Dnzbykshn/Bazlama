"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
// DÜZELTME: 'Store' buraya eklendi
import { Heart, Star, Sun, Wheat, Utensils, ChefHat, Users, Target, ArrowRight, Store } from "lucide-react"
import { Caveat, Inter, Playfair_Display, Patrick_Hand } from "next/font/google"
import { cn } from "@/lib/utils"

// --- FONT AYARLARI ---
const patrick = Patrick_Hand({ subsets: ["latin"], weight: ["400"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"] })
const inter = Inter({ subsets: ["latin"] })

// --- MARKA RENGİ ---
const accentColor = "#8AD7D6";

// --- YUMUŞATILMIŞ ANİMASYONLAR ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

const slideInLeftSoft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
}

const slideInRightSoft: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
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

  // --- MOCK DATA ---
  const defaultValues = {
    hero_badge: "Hikayemiz",
    hero_title: "Bizi Tanıyın",
    hero_description: "Geleneksel Türk kahvaltısının en özel halini, modern bir dokunuş ve sonsuz bir sevgiyle harmanlıyoruz.",
    story_image_url: "/DSC04385.jpg",
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
    mission_image_url: "/DSC04385.jpg",
    vision_title: "Vizyonumuz",
    vision_content_paragraph1: "Gelecekte, Türkiye'nin her köşesinde Pişi Kahvaltı'nın sıcaklığını ve lezzetini yaşatmak istiyoruz.",
    vision_content_paragraph2: "Geleneksel değerlerimizi koruyarak, modern dünyanın ihtiyaçlarına uyum sağlayan, sürdürülebilir ve başarılı bir franchise ağı oluşturmak en büyük hedefimiz.",
    vision_image_url: "/DSC04385.jpg",
    franchise_title: "Franchise Fırsatı",
    franchise_description: "Pişi Kahvaltı ailesine katılın ve kendi işinizin sahibi olun. Başarılı bir franchise sistemi ile yanınızdayız.",
    franchise_button_text: "Franchise Başvurusu Yap",
  }

  const content = aboutPage || defaultValues

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffcf8]">
        <Header />
        <div className="h-screen flex flex-col items-center justify-center">
           <div className="relative w-24 h-24">
             <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-t-[#8AD7D6] rounded-full animate-spin"></div>
           </div>
           <p className={`text-stone-500 font-medium mt-6 tracking-wide animate-pulse ${inter.className}`}>Hikayemiz hazırlanıyor...</p>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-[#ffffff] selection:bg-[#8AD7D6] selection:text-white ${inter.className}`}>
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-24 px-4 overflow-hidden bg-gradient-to-b from-[#e6f4f1] via-[#f0fdfd] to-[#fffcf8]">
        
        {/* Dekoratif Arka Plan İkonları */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -left-20 text-[#8AD7D6]/5"
           >
              <Sun size={300} strokeWidth={0.5} />
           </motion.div>
           <motion.div 
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -right-10 text-[#8AD7D6]/5"
           >
              <Heart size={200} strokeWidth={0.5} />
           </motion.div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Rozet */}
            <motion.div variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full border border-[#8AD7D6]/30 shadow-sm">
                    <Star className="w-4 h-4 text-[#8AD7D6] fill-[#8AD7D6]" />
                    <span className="text-xs font-bold tracking-[0.2em] text-stone-600 uppercase">Kurumsal</span>
                </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className={`text-6xl md:text-8xl font-black text-stone-900 leading-tight mb-6 drop-shadow-sm ${playfair.className}`}>
              {content.hero_title}
            </motion.h1>
            
            <motion.p variants={fadeInUp} className={`text-xl md:text-3xl text-stone-500 font-light max-w-3xl mx-auto leading-relaxed ${patrick.className}`}>
              {content.hero_description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-32 space-y-32">
        
        {/* --- STORY SECTION --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center"
        >
          {/* Sol: Resim */}
          <motion.div variants={slideInLeftSoft} className="relative group">
             <div className="absolute inset-0 bg-[#8AD7D6] rounded-[3rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-700 ease-out"></div>
             <div className="relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200/50 border-[6px] border-white">
                <Image
                  src={content.story_image_url || "/images/image.png"}
                  alt="Pişi Kahvaltı Hikayesi"
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
             </div>
          </motion.div>

          {/* Sağ: Metin */}
          <motion.div variants={fadeInUp} className="space-y-10">
            <h2 className={`text-5xl md:text-6xl font-bold text-stone-900 leading-tight ${playfair.className}`}>
              {content.story_title?.includes(" ") ? (
                <>
                  {content.story_title.split(" ").slice(0, -1).join(" ")} <br />
                  <span className="text-[#8AD7D6] italic decoration-wavy decoration-[#8AD7D6]/30 underline-offset-8">{content.story_title.split(" ").slice(-1)[0]}</span>
                </>
              ) : (
                content.story_title
              )}
            </h2>
            
            <div className="space-y-6">
                <p className={`text-xl text-stone-600 leading-relaxed font-light ${patrick.className}`}>{content.story_content_paragraph1}</p>
                <p className={`text-xl text-stone-600 leading-relaxed font-light ${patrick.className}`}>{content.story_content_paragraph2}</p>
            </div>

            <div className="pt-6">
                <div className="h-1.5 w-24 bg-[#8AD7D6]/40 rounded-full"></div>
            </div>
          </motion.div>
        </motion.section>

        {/* --- VALUES SECTION --- */}
        <section className="relative py-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <span className="text-[#8AD7D6] font-bold tracking-widest uppercase text-sm mb-3 block">Prensiplerimiz</span>
            <h2 className={`text-5xl font-bold text-stone-900 ${playfair.className}`}>{content.values_title}</h2>
            <p className={`text-xl text-stone-500 mt-4 max-w-xl mx-auto ${patrick.className}`}>{content.values_subtitle}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              { title: content.value1_title, desc: content.value1_desc, icon: Wheat },
              { title: content.value2_title, desc: content.value2_desc, icon: Utensils },
              { title: content.value3_title, desc: content.value3_desc, icon: Heart }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -12, transition: { duration: 0.4, ease: "easeOut" } }}
                className="bg-white p-10 rounded-[3rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(138,215,214,0.25)] transition-all duration-500 border border-stone-50 text-center group relative z-10"
              >
                <div className="w-24 h-24 bg-[#f0fdfd] rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 ease-out relative">
                   <item.icon className="w-10 h-10 text-[#8AD7D6] relative z-10" />
                   <div className="absolute inset-0 bg-[#8AD7D6] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                </div>
                <h3 className={`text-3xl font-bold mb-4 text-stone-900 ${playfair.className}`}>{item.title}</h3>
                <p className={`text-lg text-stone-500 leading-relaxed font-light ${patrick.className}`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* --- MISSION & VISION (Aydınlık ve Ferah Tasarım) --- */}
        <div className="space-y-24">
            {/* Mission */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center bg-[#f0fdfd] rounded-[3rem] p-10 md:p-20 border border-[#8AD7D6]/20 shadow-xl shadow-[#8AD7D6]/5 relative overflow-hidden"
            >
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#8AD7D6]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <ChefHat className="absolute bottom-10 right-10 w-64 h-64 text-[#8AD7D6]/5 rotate-12 pointer-events-none" />

                <motion.div variants={slideInLeftSoft} className="space-y-10 relative z-10 order-2 md:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#8AD7D6] text-sm font-bold tracking-widest uppercase shadow-sm border border-[#8AD7D6]/10">
                        <Users className="w-4 h-4" /> Misyon
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-bold text-stone-900 ${playfair.className}`}>{content.mission_title}</h2>
                    <div className={`space-y-6 text-xl text-stone-600 leading-relaxed font-light ${patrick.className}`}>
                        <p>{content.mission_content_paragraph1}</p>
                        <p>{content.mission_content_paragraph2}</p>
                    </div>
                </motion.div>

                <motion.div variants={slideInRightSoft} className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-lg order-1 md:order-2 group">
                    <Image
                        src={content.mission_image_url || "/images/image.png"}
                        alt="Pişi Kahvaltı Misyon"
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                </motion.div>
            </motion.section>

            {/* Vision */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
                <motion.div variants={slideInLeftSoft} className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200/50 border-[6px] border-white order-2 md:order-1 group">
                    <Image
                        src={content.vision_image_url || "/images/image.png"}
                        alt="Pişi Kahvaltı Vizyon"
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                </motion.div>

                <motion.div variants={slideInRightSoft} className="space-y-10 order-1 md:order-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0fdfd] text-[#8AD7D6] text-sm font-bold tracking-widest uppercase shadow-sm border border-[#8AD7D6]/10">
                        <Target className="w-4 h-4" /> Vizyon
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-bold text-stone-900 ${playfair.className}`}>
                        {content.vision_title}
                    </h2>
                    <div className={`space-y-6 text-xl text-stone-600 leading-relaxed font-light ${patrick.className}`}>
                        <p>{content.vision_content_paragraph1}</p>
                        <p>{content.vision_content_paragraph2}</p>
                    </div>
                </motion.div>
            </motion.section>
        </div>

        {/* --- FRANCHISE CTA SECTION (Yumuşak Geçişli) --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative bg-gradient-to-br from-[#8AD7D6] to-[#7acaca] rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-[#8AD7D6]/20"
        >
            <div className="absolute inset-0 bg-[url('/dots.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
            
            {/* Dekoratif büyük ikon */}
            <Store className="absolute -bottom-20 -left-20 w-80 h-80 text-white/10 rotate-12 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                <h2 className={`text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-sm ${playfair.className}`}>{content.franchise_title}</h2>
                <p className={`text-2xl text-white/95 font-medium leading-relaxed ${patrick.className}`}>
                    {content.franchise_description}
                </p>
                <div className="pt-8">
                    <Link href="/franchise">
                        <Button className="bg-white text-[#8AD7D6] hover:bg-stone-50 text-xl font-bold px-12 py-8 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                            {content.franchise_button_text} <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.section>

      </div>

      <Footer />
    </main>
  )
}