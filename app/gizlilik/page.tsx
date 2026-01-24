"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// İsteğin üzerine Button bileşeni eklendi ve kullanıldı
import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"
// İsim çakışmasını önlemek için Link ikonuna takma ad verdik
import { ShieldCheck, Lock, Eye, FileText, Cookie, Server, Mail, ArrowRight, CheckCircle2, Link as LinkIcon, BadgeCheck } from "lucide-react"
import { Caveat, Inter, Playfair_Display, Patrick_Hand } from "next/font/google"

// --- FONT AYARLARI ---
const patrick = Patrick_Hand({ subsets: ["latin"], weight: ["400"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"] })
const inter = Inter({ subsets: ["latin"] })

// --- MARKA RENGİ ---
const accentColor = "#8AD7D6";

// --- ANİMASYONLAR (Yumuşatılmış) ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

// --- POLİTİKA MADDELERİ ---
const policyItems = [
    {
        id: 1,
        title: "Toplanan Bilgiler",
        icon: FileText,
        content: "Hizmetlerimizi kullanırken; rezervasyon yapmanız, bültenimize abone olmanız veya bizimle iletişime geçmeniz durumunda adınız, e-posta adresiniz, telefon numaranız gibi kişisel bilgileri toplayabiliriz. Ayrıca, siteyi kullanımınızla ilgili teknik veriler otomatik olarak toplanabilir."
    },
    {
        id: 2,
        title: "Bilgilerin Kullanımı",
        icon: Eye,
        content: "Topladığımız bilgiler; rezervasyonlarınızı yönetmek, size daha iyi bir hizmet sunmak, müşteri memnuniyetini artırmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılır. Bilgileriniz izniniz olmadan pazarlama amacıyla paylaşılmaz."
    },
    {
        id: 3,
        title: "Çerez Politikası",
        icon: Cookie,
        content: "Sitemizde kullanıcı deneyimini geliştirmek ve tercihlerinizi hatırlamak için çerezler (cookies) kullanıyoruz. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman yönetebilir veya engelleyebilirsiniz."
    },
    {
        id: 4,
        title: "Veri Güvenliği",
        icon: Server,
        content: "Kişisel verilerinizin güvenliği bizim için en önemli önceliktir. Verilerinizi yetkisiz erişime, kaybolmaya veya değiştirilmeye karşı korumak için endüstri standardında güvenlik önlemleri (SSL şifreleme vb.) uyguluyoruz."
    },
    {
        id: 5,
        title: "Üçüncü Taraf Bağlantılar",
        icon: LinkIcon, // LinkIcon kullanıldı
        content: "Web sitemiz, iş ortaklarımıza veya sosyal medya platformlarına ait bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından sorumlu olmadığımızı ve ziyaret ettiğinizde onların politikalarının geçerli olduğunu hatırlatırız."
    }
]

export default function PrivacyPolicyPage() {
  return (
    <main className={`min-h-screen bg-[#fffcf8] selection:bg-[#8AD7D6] selection:text-white ${inter.className}`}>
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-24 px-4 overflow-hidden bg-gradient-to-b from-[#e6f4f1] via-[#f0fdfd] to-[#fffcf8]">
        
        {/* Dekoratif İkonlar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <motion.div 
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -left-20 text-[#8AD7D6]/5"
           >
              <ShieldCheck size={300} strokeWidth={0.5} />
           </motion.div>
           <motion.div 
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 text-[#8AD7D6]/5"
           >
              <Lock size={250} strokeWidth={0.5} />
           </motion.div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#8AD7D6]/30 shadow-sm group hover:shadow-md transition-all">
                    <BadgeCheck className="w-5 h-5 text-[#8AD7D6] fill-[#8AD7D6]/10 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold tracking-[0.2em] text-stone-600 uppercase">Resmi & Güvenli</span>
                </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className={`text-5xl md:text-7xl font-black text-stone-900 leading-tight drop-shadow-sm ${playfair.className}`}>
              Gizlilik Politikası
            </motion.h1>
            
            <motion.p variants={fadeInUp} className={`text-xl md:text-2xl text-stone-500 font-light max-w-2xl mx-auto leading-relaxed ${patrick.className}`}>
              Verilerinizin güvenliği, bizim için en az sunduğumuz lezzetlerin kalitesi kadar önemlidir.
            </motion.p>

            <motion.div variants={fadeInUp} className="inline-block pt-4">
                <span className="px-4 py-1.5 rounded-lg bg-stone-100 text-stone-500 text-sm font-medium border border-stone-200">
                   Son Güncelleme: 24 Ocak 2026
                </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="relative pb-32 px-4">
         {/* Kağıt Dokusu */}
         <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }}></div>

         <div className="container mx-auto max-w-5xl relative z-10">
            
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="space-y-8"
            >
                {/* Giriş Metni Kartı */}
                <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] shadow-xl shadow-stone-200/30 border border-white/50 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8AD7D6]/50 via-[#8AD7D6] to-[#8AD7D6]/50"></div>
                    <p className="text-lg md:text-xl text-stone-700 leading-relaxed font-medium relative z-10">
                        Pişi Kahvaltı ("biz", "bizim") olarak, web sitemizi ziyaret eden misafirlerimizin gizliliğine saygı duyuyoruz. Bu şeffaflık belgesi, kişisel verilerinizin nasıl işlendiğini açıklar.
                    </p>
                </motion.div>

                {/* Maddeler Grid (Güzelleştirilmiş Kartlar) */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {policyItems.map((item) => (
                        <motion.div 
                            key={item.id}
                            variants={fadeInUp}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-white p-8 lg:p-10 rounded-[3rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-15px_rgba(138,215,214,0.25)] transition-all duration-300 border border-stone-50 hover:border-[#8AD7D6]/30 group relative overflow-hidden"
                        >
                            {/* Arka Plan Numarası (Watermark) */}
                            <div className={`absolute -bottom-10 -right-6 text-[10rem] font-black text-stone-100/80 pointer-events-none select-none leading-none font-serif group-hover:text-[#8AD7D6]/10 transition-colors duration-500 ${playfair.className}`}>
                                {item.id}
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-[#f0fdfd] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out border border-[#8AD7D6]/20 shadow-sm group-hover:shadow-md">
                                    <item.icon className="w-8 h-8 text-[#8AD7D6]" />
                                </div>
                                <h3 className={`text-2xl font-bold text-stone-900 mb-4 ${playfair.className}`}>
                                    {item.title}
                                </h3>
                                <p className="text-stone-600 leading-relaxed text-base font-light">
                                    {item.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* YENİ CTA BÖLÜMÜ (Aydınlık ve Premium - Button Kullanıldı) */}
                <motion.div 
                    variants={fadeInUp} 
                    className="relative bg-gradient-to-br from-[#f0fdfd] to-white p-10 md:p-20 rounded-[3.5rem] shadow-2xl shadow-[#8AD7D6]/10 border border-[#8AD7D6]/20 text-center mt-16 overflow-hidden"
                >
                    
                    {/* Dekoratif */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#8AD7D6]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    <CheckCircle2 className="absolute bottom-5 left-5 w-40 h-40 text-[#8AD7D6]/5 rotate-12 pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h3 className={`text-3xl md:text-5xl font-bold text-stone-900 leading-tight ${playfair.className}`}>Hâlâ sorularınız mı var?</h3>
                        <p className={`text-xl text-stone-500 font-light ${patrick.className}`}>
                            Gizlilik politikamız veya verilerinizin işlenmesi hakkında aklınıza takılan her şey için ekibimizle iletişime geçebilirsiniz.
                        </p>
                        
                        {/* Button Bileşenlerinin Kullanımı */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <Link href="/iletisim">
                                <Button className="bg-[#8AD7D6] hover:bg-[#7acaca] text-white rounded-full h-14  text-3xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group w-full sm:w-auto">
                                    Bize Ulaşın<ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                                </Button>
                            </Link>
                           
                        </div>
                    </div>
                </motion.div>

            </motion.div>
         </div>
      </section>

      <Footer />
    </main>
  )
}