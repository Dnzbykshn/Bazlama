"use client"

import { useState } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// Animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const inputClass =
  "h-12 rounded-xl bg-white border border-[#c8a589] text-[#6f5646] placeholder:text-[#b89a83] focus:border-[#9b7a63] focus:ring-2 focus:ring-[#c8a589]/30 transition-colors"
const textareaClass =
  "resize-none rounded-xl bg-white border border-[#c8a589] text-[#6f5646] placeholder:text-[#b89a83] focus:border-[#9b7a63] focus:ring-2 focus:ring-[#c8a589]/30 transition-colors p-4"
const labelClass = "text-sm font-medium text-[#8f6b52]"

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    // A) BAŞVURU SAHİBİ BİLGİLERİ
    name: "",
    phone: "",
    email: "",
    city_district: "",
    birth_year: "",
    job_status: "",
    // B) BAYİLİK PLANI
    target_city: "",
    location_type: "",
    location_type_other: "",
    has_food_beverage_experience: "",
    experience_description: "",
    // C) MEKÂN BİLGİLERİ
    has_location: "",
    location_area: "",
    seating_capacity: "",
    has_outdoor_area: "",
    // D) YATIRIM VE ZAMANLAMA
    investment_budget: "",
    opening_timeline: "",
    operator_type: "",
    // E) MOTİVASYON
    motivation: "",
    additional_notes: "",
    // KVKK
    kvkk_consent: false,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.kvkk_consent) {
      toast({
        title: "KVKK Onayı Gerekli",
        description: "Lütfen KVKK onayını işaretleyiniz.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (!isSupabaseConfigured) {
        toast({
          title: "Başvuru gönderildi!",
          description: "Başvurunuz başarıyla iletildi. (Demo modu - Supabase yapılandırılmamış)",
        })
        setFormData({
          name: "",
          phone: "",
          email: "",
          city_district: "",
          birth_year: "",
          job_status: "",
          target_city: "",
          location_type: "",
          location_type_other: "",
          has_food_beverage_experience: "",
          experience_description: "",
          has_location: "",
          location_area: "",
          seating_capacity: "",
          has_outdoor_area: "",
          investment_budget: "",
          opening_timeline: "",
          operator_type: "",
          motivation: "",
          additional_notes: "",
          kvkk_consent: false,
        })
        setLoading(false)
        return
      }

      const { error } = await supabase.from("franchise_applications").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city_district,
          city_district: formData.city_district,
          birth_year: formData.birth_year || null,
          job_status: formData.job_status || null,
          target_city: formData.target_city || null,
          location_type: formData.location_type || null,
          has_food_beverage_experience: formData.has_food_beverage_experience === "evet" ? true : formData.has_food_beverage_experience === "hayir" ? false : null,
          experience_description: formData.experience_description || null,
          has_location: formData.has_location === "evet" ? true : formData.has_location === "hayir" ? false : formData.has_location === "arastiriyorum" ? null : null,
          location_area: formData.location_area || null,
          seating_capacity: formData.seating_capacity || null,
          has_outdoor_area: formData.has_outdoor_area === "evet" ? true : formData.has_outdoor_area === "hayir" ? false : null,
          investment_budget: formData.investment_budget || null,
          opening_timeline: formData.opening_timeline || null,
          operator_type: formData.operator_type || null,
          motivation: formData.motivation || null,
          additional_notes: formData.additional_notes || null,
          kvkk_consent: formData.kvkk_consent,
          // Legacy fields for backward compatibility
          investment_amount: formData.investment_budget || null,
          experience: formData.experience_description || null,
          message: formData.motivation || null,
        },
      ])

      if (error) throw error

      toast({
        title: "Başvuru gönderildi!",
        description: "Bayilik başvurunuz başarıyla iletildi. En kısa sürede size dönüş yapacağız.",
      })

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        city_district: "",
        birth_year: "",
        job_status: "",
        target_city: "",
        location_type: "",
        location_type_other: "",
        has_food_beverage_experience: "",
        experience_description: "",
        has_location: "",
        location_area: "",
        seating_capacity: "",
        has_outdoor_area: "",
        investment_budget: "",
        opening_timeline: "",
        operator_type: "",
        motivation: "",
        additional_notes: "",
        kvkk_consent: false,
      })
    } catch (error: any) {
      console.error("Error submitting franchise application:", error)
      toast({
        title: "Hata oluştu",
        description: error.message || "Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-transparent">
      <Header />

      {/* Hero Image */}
      <section className="pt-0 -mt-16 sm:-mt-20 lg:-mt-24">
        <div className="relative w-full h-[460px] sm:h-[640px] lg:h-[820px] overflow-hidden">
          <Image
            src="/Szutest-5.jpg"
            alt="Franchise başvuru görseli"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-[940px] rounded-[2.5rem] bg-[#4B56B8] text-white px-6 sm:px-10 lg:px-14 py-12 sm:py-14 lg:py-16 shadow-xl min-h-[472px] flex items-center">
            <div className="w-full text-center">
              <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/80">
                Şimdi Master Franchise Adımı Atın
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight mt-4">
                Bir Bayilikten Daha Fazlası
              </h2>
              <p className="text-base sm:text-lg text-white/90 mt-4 max-w-2xl mx-auto">
                Pişi Kahvaltı master franchise modeli, sadece ürün satışı değil; bir kültürü,
                kalite anlayışını ve markayı birlikte yönetme sorumluluğunu ifade eder.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Button asChild className="bg-white text-[#4B56B8] hover:bg-white/90 rounded-full px-8 py-6 text-base">
                  <Link href="/subeler">Şubelerimiz</Link>
                </Button>
                <Button asChild className="bg-white/15 text-white hover:bg-white/25 border border-white/30 rounded-full px-8 py-6 text-base">
                  <a href="#franchise-form">Başvuru Formuna Git</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 sm:py-10">
        <div className="container mx-auto px-4 flex justify-center mt-4 sm:mt-6">
          <Image
            src="/country.svg"
            alt="Ülke görseli"
            width={640}
            height={220}
            className="h-auto w-full max-w-[940px]"
          />
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-[940px]">
            <div className="rounded-[2.75rem] bg-gradient-to-br from-[#2D3BAA] via-[#4657C7] to-[#5A6EE6] text-white shadow-[0_30px_80px_-40px_rgba(44,59,170,0.8)] px-6 sm:px-10 lg:px-12 py-12 sm:py-14">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
                <div>
                  <span className="inline-flex items-center justify-center rounded-full bg-white/15 text-white text-xs sm:text-sm font-semibold px-4 py-1.5 tracking-[0.2em]">
                    NEDEN PİŞİ KAHVALTI?
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight mt-4">
                    Neden Bizden Franchise Almalısınız?
                  </h2>
                  <p className="text-base sm:text-lg text-white/90 mt-5 max-w-xl">
                    Güçlü marka kimliği, standartlaştırılmış operasyon modeli ve sürdürülebilir kalite anlayışıyla
                    yatırımınızı güvenle büyüteceğiniz bir yapı sunuyoruz. Her adımda yanınızda olan
                    profesyonel ekibimizle uzun soluklu bir ortaklık kurarsınız.
                  </p>
                  <div className="mt-6 border-t border-white/20 pt-5 text-sm text-white/80">
                    Detaylı bilgi için bizimle iletişime geçebilirsiniz.
                  </div>
                </div>
                <div className="grid gap-4">
                  {[
                    {
                      title: "Güçlü Marka ve Sadık Müşteri",
                      text: "Lezzet ve hizmet kalitesiyle güçlü bir marka algısı oluşturur; sadık müşteri kitlesiyle hızlı geri dönüş sağlar."
                    },
                    {
                      title: "Standart ve Ölçeklenebilir Operasyon",
                      text: "Kurulumdan işletmeye kadar standart süreçlerle verimli ve sürdürülebilir operasyon kurar."
                    },
                    {
                      title: "Eğitim ve Sürekli Destek",
                      text: "Açılış öncesi/sonrası eğitim, saha desteği ve pazarlama rehberliği sunar."
                    },
                    {
                      title: "Rekabetçi Yatırım ve Karlılık",
                      text: "Optimum yatırım maliyeti, doğru lokasyon desteği ve menü stratejileriyle kârlı model sağlar."
                    }
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl bg-white/10 border border-white/15 px-5 py-5 backdrop-blur"
                    >
                      <h3 className="text-base sm:text-lg font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="pt-28 pb-12 px-4" id="franchise-form">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container mx-auto text-center"
        >
          <span className="inline-flex items-center justify-center py-1.5 px-4 rounded-full bg-[#f7efe7] text-[#9b7a63] text-xs sm:text-sm font-semibold tracking-[0.15em] mb-5">
            İş Fırsatı
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#6f5646]">
            Franchise Başvuru Formu
          </h1>
          <p className="text-lg sm:text-xl text-[#8f6b52] font-light max-w-2xl mx-auto mt-4">
            Pişi Kahvaltı franchise süreci için ön başvuru
          </p>
          <p className="text-sm text-[#a07e66] max-w-2xl mx-auto mt-2">
            Lütfen bilgilerinizi eksiksiz paylaşın. Başvurunuz değerlendirme sürecine alınacaktır.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 pb-24 max-w-[940px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="bg-white rounded-[2rem] border border-[#f2e7dc] shadow-[0_20px_60px_-30px_rgba(111,86,70,0.35)] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-x-8 top-0 h-1.5 rounded-b-full bg-gradient-to-r from-[#d8b79c] via-[#c8a589] to-[#b88f73]" />
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* A) BAŞVURU SAHİBİ BİLGİLERİ */}
              <div className="space-y-6 border-b border-[#edd9c8] pb-8">
                <h2 className="text-2xl font-serif font-bold text-[#9b7a63]">A) BAŞVURU SAHİBİ BİLGİLERİ</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className={labelClass}>Ad Soyad *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className={labelClass}>Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0540 271 40 40"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={labelClass}>E-Posta *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city_district" className={labelClass}>İl / İlçe *</Label>
                  <Input
                    id="city_district"
                    type="text"
                    placeholder="İstanbul / Kadıköy"
                    value={formData.city_district}
                    onChange={(e) => setFormData({ ...formData, city_district: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_year" className={labelClass}>Doğum Yılı (Opsiyonel)</Label>
                  <Input
                    id="birth_year"
                    type="text"
                    placeholder="1990"
                    value={formData.birth_year}
                    onChange={(e) => setFormData({ ...formData, birth_year: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-3">
                  <Label className={labelClass}>Meslek / Mevcut İş Durumu *</Label>
                  <RadioGroup
                    value={formData.job_status}
                    onValueChange={(value) => setFormData({ ...formData, job_status: value })}
                    required
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="calisan" id="calisan" />
                      <Label htmlFor="calisan" className="cursor-pointer font-normal">Çalışan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="isletme_sahibi" id="isletme_sahibi" />
                      <Label htmlFor="isletme_sahibi" className="cursor-pointer font-normal">İşletme Sahibi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yatirimci" id="yatirimci" />
                      <Label htmlFor="yatirimci" className="cursor-pointer font-normal">Yatırımcı</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diger" id="diger" />
                      <Label htmlFor="diger" className="cursor-pointer font-normal">Diğer</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* B) BAYİLİK PLANI */}
              <div className="space-y-6 border-b border-[#edd9c8] pb-8">
                <h2 className="text-2xl font-serif font-bold text-[#9b7a63]">B) BAYİLİK PLANI</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="target_city" className={labelClass}>Bayilik açmayı düşündüğünüz şehir / ilçe *</Label>
                  <Input
                    id="target_city"
                    type="text"
                    placeholder="İstanbul / Kadıköy"
                    value={formData.target_city}
                    onChange={(e) => setFormData({ ...formData, target_city: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-3">
                  <Label className={labelClass}>Hedef lokasyon tipi *</Label>
                  <RadioGroup
                    value={formData.location_type}
                    onValueChange={(value) => setFormData({ ...formData, location_type: value, location_type_other: "" })}
                    required
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cadde" id="cadde" />
                      <Label htmlFor="cadde" className="cursor-pointer font-normal">Cadde</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="avm" id="avm" />
                      <Label htmlFor="avm" className="cursor-pointer font-normal">AVM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="islek_bolge" id="islek_bolge" />
                      <Label htmlFor="islek_bolge" className="cursor-pointer font-normal">İşlek bölge</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diger" id="lokasyon_diger" />
                      <Label htmlFor="lokasyon_diger" className="cursor-pointer font-normal">Diğer</Label>
                    </div>
                  </RadioGroup>
                  {formData.location_type === "diger" && (
                    <Input
                      placeholder="Diğer lokasyon tipi"
                      value={formData.location_type_other}
                      onChange={(e) => setFormData({ ...formData, location_type_other: e.target.value })}
                      className={`${inputClass} mt-2`}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <Label className={labelClass}>Daha önce gıda & içecek sektöründe işletmecilik yaptınız mı? *</Label>
                  <RadioGroup
                    value={formData.has_food_beverage_experience}
                    onValueChange={(value) => setFormData({ ...formData, has_food_beverage_experience: value, experience_description: value === "hayir" ? "" : formData.experience_description })}
                    required
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evet" id="deneyim_evet" />
                      <Label htmlFor="deneyim_evet" className="cursor-pointer font-normal">Evet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hayir" id="deneyim_hayir" />
                      <Label htmlFor="deneyim_hayir" className="cursor-pointer font-normal">Hayır</Label>
                    </div>
                  </RadioGroup>
                  {formData.has_food_beverage_experience === "evet" && (
                    <div className="mt-3">
                      <Label htmlFor="experience_description" className={labelClass}>Varsa açıklama</Label>
                      <Textarea
                        id="experience_description"
                        placeholder="Deneyiminizi detaylı olarak açıklayınız..."
                        value={formData.experience_description}
                        onChange={(e) => setFormData({ ...formData, experience_description: e.target.value })}
                        rows={4}
                        className={`${textareaClass} mt-2`}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* C) MEKÂN BİLGİLERİ */}
              <div className="space-y-6 border-b border-[#edd9c8] pb-8">
                <h2 className="text-2xl font-serif font-bold text-[#9b7a63]">C) MEKÂN BİLGİLERİ</h2>
                
                <div className="space-y-3">
                  <Label className={labelClass}>Uygun bir yeriniz var mı? *</Label>
                  <RadioGroup
                    value={formData.has_location}
                    onValueChange={(value) => setFormData({ ...formData, has_location: value })}
                    required
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evet" id="yer_evet" />
                      <Label htmlFor="yer_evet" className="cursor-pointer font-normal">Evet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hayir" id="yer_hayir" />
                      <Label htmlFor="yer_hayir" className="cursor-pointer font-normal">Hayır</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="arastiriyorum" id="yer_arastiriyorum" />
                      <Label htmlFor="yer_arastiriyorum" className="cursor-pointer font-normal">Araştırıyorum</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_area" className={labelClass}>Yaklaşık alan (m²)</Label>
                  <Input
                    id="location_area"
                    type="text"
                    placeholder="Örn: 150"
                    value={formData.location_area}
                    onChange={(e) => setFormData({ ...formData, location_area: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seating_capacity" className={labelClass}>Tahmini oturma kapasitesi</Label>
                  <Input
                    id="seating_capacity"
                    type="text"
                    placeholder="Örn: 50"
                    value={formData.seating_capacity}
                    onChange={(e) => setFormData({ ...formData, seating_capacity: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-3">
                  <Label className={labelClass}>Açık alan / teras var mı? *</Label>
                  <RadioGroup
                    value={formData.has_outdoor_area}
                    onValueChange={(value) => setFormData({ ...formData, has_outdoor_area: value })}
                    required
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evet" id="teras_evet" />
                      <Label htmlFor="teras_evet" className="cursor-pointer font-normal">Evet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hayir" id="teras_hayir" />
                      <Label htmlFor="teras_hayir" className="cursor-pointer font-normal">Hayır</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* D) YATIRIM VE ZAMANLAMA */}
              <div className="space-y-6 border-b border-[#edd9c8] pb-8">
                <h2 className="text-2xl font-serif font-bold text-[#9b7a63]">D) YATIRIM VE ZAMANLAMA</h2>
                
                <div className="space-y-3">
                  <Label className={labelClass}>Tahmini yatırım bütçesi *</Label>
                  <RadioGroup
                    value={formData.investment_budget}
                    onValueChange={(value) => setFormData({ ...formData, investment_budget: value })}
                    required
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-5m" id="butce_3-5" />
                      <Label htmlFor="butce_3-5" className="cursor-pointer font-normal">3.000.000 – 5.000.000 TL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5-7m" id="butce_5-7" />
                      <Label htmlFor="butce_5-7" className="cursor-pointer font-normal">5.000.000 – 7.000.000 TL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7m+" id="butce_7+" />
                      <Label htmlFor="butce_7+" className="cursor-pointer font-normal">7.000.000 TL ve üzeri</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className={labelClass}>Açılış hedef süresi *</Label>
                  <RadioGroup
                    value={formData.opening_timeline}
                    onValueChange={(value) => setFormData({ ...formData, opening_timeline: value })}
                    required
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-3ay" id="sure_0-3" />
                      <Label htmlFor="sure_0-3" className="cursor-pointer font-normal">0–3 ay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-6ay" id="sure_3-6" />
                      <Label htmlFor="sure_3-6" className="cursor-pointer font-normal">3–6 ay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6-12ay" id="sure_6-12" />
                      <Label htmlFor="sure_6-12" className="cursor-pointer font-normal">6–12 ay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="belirsiz" id="sure_belirsiz" />
                      <Label htmlFor="sure_belirsiz" className="cursor-pointer font-normal">Belirsiz</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className={labelClass}>Bayiliği kim işletecek? *</Label>
                  <RadioGroup
                    value={formData.operator_type}
                    onValueChange={(value) => setFormData({ ...formData, operator_type: value })}
                    required
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kendim" id="isletme_kendim" />
                      <Label htmlFor="isletme_kendim" className="cursor-pointer font-normal">Kendim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ortak" id="isletme_ortak" />
                      <Label htmlFor="isletme_ortak" className="cursor-pointer font-normal">Ortak</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="profesyonel_yonetici" id="isletme_yonetici" />
                      <Label htmlFor="isletme_yonetici" className="cursor-pointer font-normal">Profesyonel yönetici</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* E) MOTİVASYON */}
              <div className="space-y-6 border-b border-[#edd9c8] pb-8">
                <h2 className="text-2xl font-serif font-bold text-[#9b7a63]">E) MOTİVASYON</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="motivation" className={labelClass}>Neden bu bayiliği almak istiyorsunuz? *</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Motivasyonunuzu detaylı olarak açıklayınız..."
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    required
                    rows={5}
                    className={textareaClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_notes" className={labelClass}>Ek notlar</Label>
                  <Textarea
                    id="additional_notes"
                    placeholder="Eklemek istediğiniz notlar..."
                    value={formData.additional_notes}
                    onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                    rows={4}
                    className={textareaClass}
                  />
                </div>
              </div>

              {/* KVKK ONAYI */}
              <div className="space-y-4 border border-[#edd9c8] rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-serif font-bold text-[#9b7a63]">KVKK ONAYI</h2>
                <p className="text-sm text-[#8f6b52]">
                  6698 sayılı KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum.
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="kvkk_consent"
                    checked={formData.kvkk_consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, kvkk_consent: checked === true })}
                    required
                  />
                  <Label htmlFor="kvkk_consent" className="cursor-pointer font-normal">
                    Kabul Ediyorum *
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                disabled={loading || !formData.kvkk_consent}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Başvuru Gönder
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
