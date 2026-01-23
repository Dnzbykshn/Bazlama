"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { TrendingUp, Users, Store, ArrowRight, ClipboardCheck, PenTool, GraduationCap, PartyPopper, Wallet, ChefHat, Coffee, Utensils, Sun, Wheat, Egg, Milk, Croissant, Sandwich } from "lucide-react"

const accentColor = "#8AD7D6";

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    // A - Kişisel
    adSoyad: "",
    telefon: "",
    email: "",
    ikametIlIlce: "",
    dogumYili: "",
    meslek: "",
    // B - Plan
    hedefSehir: "",
    lokasyonTipi: "",
    tecrube: "",
    tecrubeAciklama: "",
    // C - Mekan
    yerDurumu: "",
    alanM2: "",
    kapasite: "",
    terasVarMi: "",
    // D - Yatırım
    butce: "",
    acilisSuresi: "",
    isletmeci: "",
    // E - Motivasyon
    motivasyon: "",
    ekNotlar: "",
    kvkkOnay: false
  })

  // Timeline Steps
  const steps = [
    {
      icon: ClipboardCheck,
      title: "Başvuru & Ön Değerlendirme",
      desc: "Web sitemiz üzerinden formun doldurulması ve aday ile ilk tanışma toplantısının yapılması."
    },
    {
      icon: TrendingUp,
      title: "Lokasyon & Fizibilite",
      desc: "Belirlenen lokasyonun yerinde incelenmesi, detaylı fizibilite raporunun hazırlanması ve onaylanması."
    },
    {
      icon: PenTool,
      title: "Mimari Proje & Uygulama",
      desc: "Konsepte uygun mimari projenin çizilmesi ve inşaat sürecinin profesyonel ekiplerce başlatılması."
    },
    {
      icon: GraduationCap,
      title: "Personel Eğitimi",
      desc: "İşletme sahibi ve personel için operasyonel ve teorik eğitimlerin merkez şubemizde verilmesi."
    },
    {
      icon: PartyPopper,
      title: "Büyük Açılış",
      desc: "Pazarlama desteği ile birlikte şubenin operasyona başlaması ve misafirlerini ağırlaması."
    }
  ]

  return (
    <main className="min-h-screen bg-stone-950 font-sans selection:bg-[#8AD7D6] selection:text-stone-900 overflow-x-hidden">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/DSC07011.jpg"
            alt="Franchise Background"
            fill
            className="object-cover opacity-60 grayscale-[0.2]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/30 to-stone-950" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 border border-[#8AD7D6]/30 rounded-full bg-[#8AD7D6]/10 text-[#8AD7D6] text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
              Franchise Fırsatı
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight">
              Geleceğe <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AD7D6] to-teal-200">
                Ortak Olun.
              </span>
            </h1>
            <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium drop-shadow-md">
              Sadece bir restoran değil, kârlı bir yatırım ve köklü bir kültürün parçası olmaya davetlisiniz.
              Başarı hikayemizi birlikte büyütelim.
            </p>
            <Button
              onClick={() => document.getElementById('basvuru-formu')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#8AD7D6] text-stone-950 hover:bg-[#7AC5C4] text-lg px-10 py-8 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_30px_-5px_#8AD7D6]"
            >
              Hemen Başvurun <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-stone-400"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-stone-400 to-transparent mx-auto mb-2" />
          <span className="text-xs uppercase tracking-widest text-opacity-70">Keşfet</span>
        </motion.div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-stone-900 relative overflow-hidden">

        {/* Top Neon Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#8AD7D6] shadow-[0_0_15px_1px_#8AD7D6] z-20 opacity-80" />

        {/* Bottom Neon Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#8AD7D6] shadow-[0_0_15px_1px_#8AD7D6] z-20 opacity-80" />

        {/* Floating Icons - Scattered */}
        <div className="absolute top-10 left-10 w-24 h-24 opacity-[0.04] -rotate-12 pointer-events-none text-white"><Coffee className="w-full h-full" /></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 opacity-[0.03] rotate-45 pointer-events-none text-white"><Utensils className="w-full h-full" /></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 opacity-[0.03] rotate-12 pointer-events-none text-white"><Egg className="w-full h-full" /></div>
        <div className="absolute top-10 right-1/3 w-20 h-20 opacity-[0.03] -rotate-12 pointer-events-none text-white"><Wheat className="w-full h-full" /></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12 text-center divide-y divide-white/10 md:divide-y-0 md:divide-x">
            {[
              { icon: Store, value: "12+", label: "Aktif Şube" },
              { icon: Users, value: "500K+", label: "Yıllık Misafir" },
              { icon: TrendingUp, value: "%100", label: "Yatırım Geri Dönüşü" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="py-12 md:py-0 px-4"
              >
                <stat.icon className="w-8 h-8 mx-auto text-[#8AD7D6] mb-4 opacity-80" />
                <h3 className="text-5xl font-serif text-white mb-2">{stat.value}</h3>
                <p className="text-stone-400 uppercase tracking-wider text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TIMELINE PROCESS --- */}
      <section className="py-32 bg-stone-950 relative overflow-hidden">
        {/* Floating Particles/Ingredients - DENSE */}
        <div className="absolute top-20 right-10 w-40 h-40 opacity-[0.03] rotate-12 pointer-events-none text-white"><ChefHat className="w-full h-full" /></div>
        <div className="absolute top-40 left-20 w-24 h-24 opacity-[0.03] -rotate-45 pointer-events-none text-white"><Wheat className="w-full h-full" /></div>
        <div className="absolute bottom-1/3 right-32 w-32 h-32 opacity-[0.02] rotate-90 pointer-events-none text-white"><Sun className="w-full h-full" /></div>
        <div className="absolute bottom-20 left-10 w-56 h-56 opacity-[0.03] -rotate-12 pointer-events-none text-white"><Wallet className="w-full h-full" /></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 opacity-[0.04] rotate-45 pointer-events-none text-white"><Croissant className="w-full h-full" /></div>
        <div className="absolute bottom-10 left-1/3 w-28 h-28 opacity-[0.03] -rotate-12 pointer-events-none text-white"><Sandwich className="w-full h-full" /></div>
        <div className="absolute top-10 left-1/3 w-16 h-16 opacity-[0.03] rotate-180 pointer-events-none text-white"><Milk className="w-full h-full" /></div>

        {/* Background Accents */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#8AD7D6]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-teal-900/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Süreç Nasıl İşliyor?</h2>
            <p className="text-stone-400 max-w-xl mx-auto">Adım adım başarıya giden yolda size rehberlik ediyoruz. Şeffaf, planlı ve profesyonel bir süreç.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#8AD7D6]/20 via-[#8AD7D6]/50 to-[#8AD7D6]/20 md:-translate-x-1/2" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-center gap-8 mb-16 md:mb-24 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Number/Icon Bubble */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full bg-stone-900 border-4 border-stone-950 shadow-[0_0_0_4px_rgba(138,215,214,0.2)] z-20 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-[#8AD7D6]" />
                </div>

                {/* Content Box */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                  <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5 hover:border-[#8AD7D6]/30 transition-colors duration-300 relative group overflow-hidden">
                    {/* Hover Glow */}
                    <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#8AD7D6]/10 rounded-full blur-xl group-hover:bg-[#8AD7D6]/20 transition-all" />

                    <span className="text-[#8AD7D6] text-xs font-bold tracking-widest uppercase mb-2 block">ADIM 0{index + 1}</span>
                    <h3 className="text-xl font-serif text-white mb-3">{step.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- APPLICATION FORM (Light / Teal Modern) --- */}
      <section id="basvuru-formu" className="py-24 relative overflow-hidden bg-gradient-to-br from-[#e0f2f1] via-stone-50 to-[#ccfbf1] border-t-0">

        {/* Neon Separator Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#8AD7D6] shadow-[0_0_20px_2px_#8AD7D6] z-50 opacity-100" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-[#8AD7D6] to-transparent shadow-[0_0_30px_#8AD7D6] z-50 opacity-80" />

        {/* Light Mode Floating Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#8AD7D6]/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="absolute top-20 right-20 w-24 h-24 opacity-[0.05] rotate-12 text-[#022c22] pointer-events-none"><Coffee className="w-full h-full" /></div>
        <div className="absolute bottom-40 left-10 w-32 h-32 opacity-[0.05] -rotate-12 text-[#022c22] pointer-events-none"><Utensils className="w-full h-full" /></div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">

          <div className="text-center mb-16">
            <span className="bg-white px-6 py-2 rounded-full text-[#8AD7D6] font-bold tracking-[0.2em] uppercase text-xs mb-4 inline-block shadow-sm">Başvuru Formu</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#022c22] mb-6">Bayilik Ön Başvurusu</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">Lütfen aşağıdaki formu eksiksiz doldurunuz. Başvurunuz ön değerlendirmeye alınacaktır.</p>
          </div>

          <form className="space-y-12">

            {/* Section A: Başvuru Sahibi Bilgileri */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8AD7D6] to-transparent" />

              <h3 className="text-2xl font-serif text-[#022c22] flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-full bg-[#e0f2f1] text-[#00695c] flex items-center justify-center font-bold text-sm">A</span>
                Başvuru Sahibi Bilgileri
              </h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Ad Soyad</Label>
                  <Input
                    value={formData.adSoyad} onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 h-14 focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Telefon</Label>
                  <Input
                    type="tel"
                    value={formData.telefon} onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 h-14 focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">E-Posta</Label>
                  <Input
                    type="email"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 h-14 focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">İl / İlçe (İkamet)</Label>
                  <Input
                    value={formData.ikametIlIlce} onChange={(e) => setFormData({ ...formData, ikametIlIlce: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 h-14 focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Doğum Yılı (Opsiyonel)</Label>
                  <Input
                    value={formData.dogumYili} onChange={(e) => setFormData({ ...formData, dogumYili: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 h-14 focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Meslek / Mevcut İş Durumu</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, meslek: val })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 h-14 hover:bg-stone-100 rounded-xl">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="calisan">Çalışan</SelectItem>
                      <SelectItem value="isletme_sahibi">İşletme Sahibi</SelectItem>
                      <SelectItem value="yatirimci">Yatırımcı</SelectItem>
                      <SelectItem value="diger">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section B: Bayilik Planı */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8AD7D6] to-transparent" />
              <h3 className="text-2xl font-serif text-[#022c22] flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-full bg-[#e0f2f1] text-[#00695c] flex items-center justify-center font-bold text-sm">B</span>
                Bayilik Planı
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Bayilik açmayı düşündüğünüz şehir / ilçe</Label>
                  <Input
                    value={formData.hedefSehir} onChange={(e) => setFormData({ ...formData, hedefSehir: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 h-14 focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Hedef Lokasyon Tipi</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, lokasyonTipi: val })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 h-14 hover:bg-stone-100 rounded-xl">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="cadde">Cadde</SelectItem>
                      <SelectItem value="avm">AVM</SelectItem>
                      <SelectItem value="islek">İşlek Bölge</SelectItem>
                      <SelectItem value="diger">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Daha önce gıda & içecek sektöründe işletmecilik yaptınız mı?</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, tecrube: val })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 h-14 hover:bg-stone-100 rounded-xl">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="evet">Evet</SelectItem>
                      <SelectItem value="hayir">Hayır</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Varsa Açıklama</Label>
                  <Textarea
                    value={formData.tecrubeAciklama} onChange={(e) => setFormData({ ...formData, tecrubeAciklama: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 min-h-[80px] focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl"
                    placeholder="Deneyimlerinizden kısaca bahsediniz..."
                  />
                </div>
              </div>
            </div>

            {/* Section C: Mekân Bilgileri */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8AD7D6] to-transparent" />
              <h3 className="text-2xl font-serif text-[#022c22] flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-full bg-[#e0f2f1] text-[#00695c] flex items-center justify-center font-bold text-sm">C</span>
                Mekân Bilgileri
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-stone-700 font-semibold">Uygun bir yeriniz var mı?</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, yerDurumu: val })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 h-14 hover:bg-stone-100 rounded-xl">
                      <SelectValue placeholder="Durum Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="evet">Evet</SelectItem>
                      <SelectItem value="hayir">Hayır</SelectItem>
                      <SelectItem value="arastiriyorum">Araştırıyorum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Yaklaşık Alan (m²)</Label>
                  <Input
                    value={formData.alanM2} onChange={(e) => setFormData({ ...formData, alanM2: e.target.value })}
                    type="number"
                    className="bg-stone-50 border-stone-200 text-stone-900 h-14 focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Tahmini Oturma Kapasitesi</Label>
                  <Input
                    value={formData.kapasite} onChange={(e) => setFormData({ ...formData, kapasite: e.target.value })}
                    type="number"
                    className="bg-stone-50 border-stone-200 text-stone-900 h-14 focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-stone-700 font-semibold">Açık Alan / Teras var mı?</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, terasVarMi: val })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 h-14 hover:bg-stone-100 rounded-xl">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="evet">Evet</SelectItem>
                      <SelectItem value="hayir">Hayır</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section D: Yatırım ve Zamanlama */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8AD7D6] to-transparent" />
              <h3 className="text-2xl font-serif text-[#022c22] flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-full bg-[#e0f2f1] text-[#00695c] flex items-center justify-center font-bold text-sm">D</span>
                Yatırım ve Zamanlama
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Tahmini Yatırım Bütçesi</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, butce: val })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 h-14 hover:bg-stone-100 rounded-xl">
                      <SelectValue placeholder="Bütçe Aralığı" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="3m-5m">3.000.000 - 5.000.000 TL</SelectItem>
                      <SelectItem value="5m-7m">5.000.000 - 7.000.000 TL</SelectItem>
                      <SelectItem value="7m+">7.000.000 TL ve üzeri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Açılış Hedef Süresi</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, acilisSuresi: val })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 h-14 hover:bg-stone-100 rounded-xl">
                      <SelectValue placeholder="Süre Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="0-3">0-3 ay</SelectItem>
                      <SelectItem value="3-6">3-6 ay</SelectItem>
                      <SelectItem value="6-12">6-12 ay</SelectItem>
                      <SelectItem value="belirsiz">Belirsiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Bayiliği kim işletecek?</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, isletmeci: val })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 h-14 hover:bg-stone-100 rounded-xl">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="kendim">Kendim</SelectItem>
                      <SelectItem value="ortak">Ortak</SelectItem>
                      <SelectItem value="profesyonel">Profesyonel Yönetici</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section E: Motivasyon */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8AD7D6] to-transparent" />
              <h3 className="text-2xl font-serif text-[#022c22] flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-full bg-[#e0f2f1] text-[#00695c] flex items-center justify-center font-bold text-sm">E</span>
                Motivasyon
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Neden bu bayiliği almak istiyorsunuz?</Label>
                  <Textarea
                    value={formData.motivasyon} onChange={(e) => setFormData({ ...formData, motivasyon: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 min-h-[120px] focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl p-4"
                    placeholder="Motivasyonunuzu açıklayınız..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-semibold">Ek Notlar</Label>
                  <Textarea
                    value={formData.ekNotlar} onChange={(e) => setFormData({ ...formData, ekNotlar: e.target.value })}
                    className="bg-stone-50 border-stone-200 text-stone-900 min-h-[100px] focus:border-[#8AD7D6] focus:ring-[#8AD7D6]/20 rounded-xl p-4"
                    placeholder="Varsa eklemek istedikleriniz..."
                  />
                </div>
              </div>
            </div>

            {/* KVKK & Submit */}
            <div className="space-y-8 pt-6 border-t border-stone-200/50">
              <div className="flex items-start gap-3 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <input
                  type="checkbox"
                  id="kvkk"
                  checked={formData.kvkkOnay}
                  onChange={(e) => setFormData({ ...formData, kvkkOnay: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-stone-300 text-[#00695c] focus:ring-[#00695c]"
                />
                <Label htmlFor="kvkk" className="text-stone-600 text-sm leading-relaxed cursor-pointer">
                  <span className="text-[#022c22] font-bold">KVKK ONAYI:</span> 6698 sayılı KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum.
                </Label>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
                <div className="text-stone-500 font-serif text-sm opacity-60">
                  {new Date().toLocaleDateString('tr-TR')} tarihinde elektronik olarak imzalanmıştır.
                </div>
                <Button className="w-full md:w-auto h-16 px-12 bg-[#022c22] text-white hover:bg-[#034435] font-bold text-lg rounded-2xl shadow-xl transition-all hover:scale-[1.02]">
                  Başvuruyu Tamamla
                </Button>
              </div>
            </div>

          </form>

        </div>
      </section>

      <Footer />
    </main>
  )
}
