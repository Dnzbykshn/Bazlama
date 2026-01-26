"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Send, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

const accentColor = "#8AD7D6";

// Rastgele matematik sorusu oluştur
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
}

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [honeypot, setHoneypot] = useState("") // Bot tuzağı - boş kalmalı
  const [captcha, setCaptcha] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState("")
  const [workingHoursWeekday, setWorkingHoursWeekday] = useState("08:00 - 22:00")
  const [workingHoursWeekend, setWorkingHoursWeekend] = useState("08:00 - 23:00")
  const { toast } = useToast()

  // Çalışma saatlerini veritabanından çek
  useEffect(() => {
    async function fetchWorkingHours() {
      try {
        if (!isSupabaseConfigured) return;

        const { data: weekdayData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "working_hours_weekday")
          .single();

        const { data: weekendData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "working_hours_weekend")
          .single();

        if (weekdayData) setWorkingHoursWeekday(weekdayData.value);
        if (weekendData) setWorkingHoursWeekend(weekendData.value);
      } catch (error) {
        console.error("Error fetching working hours:", error);
      }
    }
    fetchWorkingHours();
  }, []);

  // Yeni captcha oluştur
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Bot tuzağı kontrolü - eğer doluysa bot
    if (honeypot) {
      console.log("Bot detected via honeypot");
      toast({
        title: "Mesaj gönderildi!",
        description: "Mesajınız başarıyla iletildi.",
      })
      return; // Sessizce reddet
    }

    // Captcha kontrolü
    if (parseInt(captchaInput) !== captcha.answer) {
      toast({
        title: "Hatalı doğrulama",
        description: "Lütfen matematik sorusunu doğru cevaplayın.",
        variant: "destructive",
      })
      refreshCaptcha();
      return;
    }

    setLoading(true)

    try {
      if (!isSupabaseConfigured) {
        toast({
          title: "Mesaj gönderildi!",
          description: "Mesajınız başarıyla iletildi. (Demo modu - Supabase yapılandırılmamış)",
        })
        setFormData({ name: "", email: "", phone: "", message: "" })
        setCaptchaInput("")
        refreshCaptcha()
        setLoading(false)
        return
      }

      // Telefon numarasını WhatsApp formatına çevir (90 ile başlamalı)
      let whatsappPhone = formData.phone.replace(/\D/g, '');
      if (whatsappPhone.startsWith('0')) {
        whatsappPhone = '90' + whatsappPhone.slice(1);
      } else if (!whatsappPhone.startsWith('90')) {
        whatsappPhone = '90' + whatsappPhone;
      }

      const { error } = await supabase.from("messages").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: whatsappPhone,
          message: formData.message,
        },
      ])

      if (error) throw error

      toast({
        title: "Mesaj gönderildi!",
        description: "Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.",
      })

      setFormData({ name: "", email: "", phone: "", message: "" })
      setCaptchaInput("")
      refreshCaptcha()
    } catch (error: any) {
      console.error("Error sending message:", error)
      toast({
        title: "Hata oluştu",
        description: error.message || "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative bg-[#e6f4f1] font-sans">

      {/* --- BACKGROUND LAYER (Fixed) --- */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="relative w-full h-full"
        >
          <Image
            src="/DSC07011.jpg"
            alt="İletişim Arkaplan"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay benzeri yapı - Biraz daha koyu olabilir okunabilirlik için */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#022c22]/95 via-[#022c22]/85 to-[#022c22]/60" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </div>

      <Header />

      {/* --- HERO CONTENT GRID --- */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-center justify-center container mx-auto px-6 pt-32 pb-12 gap-12 lg:gap-20">

        {/* LEFT SIDE: TEXT & INFO */}
        <div className="w-full lg:w-1/2 text-white space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-16" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}></span>
              <span className="font-sans uppercase tracking-[0.25em] text-sm font-bold shadow-black drop-shadow-md" style={{ color: accentColor }}>
                BİZE ULAŞIN
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-6 drop-shadow-2xl">
              Her Zaman <br />
              <span className="italic font-light" style={{ color: accentColor }}>Yanınızdayız.</span>
            </h1>

            <p className="text-gray-200 text-lg font-light leading-relaxed max-w-lg border-l-2 pl-6" style={{ borderColor: `${accentColor}80` }}>
              Sorularınız, rezervasyon talepleriniz veya sadece bir merhaba demek için
              aşağıdaki kanallardan bize ulaşabilirsiniz.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {/* Phone */}
            <a href="tel:+905402714040" className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer hover:border-[#8AD7D6]/50">
              <div className="w-12 h-12 rounded-full bg-[#8AD7D6]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-[#8AD7D6]" />
              </div>
              <div>
                <h3 className="text-white font-serif text-lg mb-1 group-hover:text-[#8AD7D6] transition-colors">Telefon</h3>
                <p className="text-gray-300 text-sm mb-1">+90 540 271 40 40</p>
                <span className="text-xs text-[#8AD7D6] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">Hemen Ara →</span>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:info@pisikahvalti.com" className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer hover:border-[#8AD7D6]/50">
              <div className="w-12 h-12 rounded-full bg-[#8AD7D6]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-[#8AD7D6]" />
              </div>
              <div>
                <h3 className="text-white font-serif text-lg mb-1 group-hover:text-[#8AD7D6] transition-colors">E-posta</h3>
                <p className="text-gray-300 text-sm mb-1">info@pisikahvalti.com</p>
                <span className="text-xs text-[#8AD7D6] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">Mail Gönder →</span>
              </div>
            </a>

            {/* Address */}
            <div
              onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group sm:col-span-2 flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer hover:border-[#8AD7D6]/50"
            >
              <div className="w-12 h-12 rounded-full bg-[#8AD7D6]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-[#8AD7D6]" />
              </div>
              <div>
                <h3 className="text-white font-serif text-lg mb-1 group-hover:text-[#8AD7D6] transition-colors">Adres</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Kızılırmak mah. Vatan cad. 16 D, Sivas / 58070
                </p>
                <span className="text-xs text-[#8AD7D6] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider mt-2 block">Yol Tarifi Al →</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: GLASS FORM (Hero Style) */}
        <div className="w-full lg:w-[480px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            {/* Decorative Elements around form */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#8AD7D6]/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-800/40 rounded-full blur-3xl" />

            <div className="relative bg-[#022c22]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#8AD7D6] rounded-t-[2.5rem]" />

              <div className="mb-8">
                <span className="px-3 py-1 rounded-full bg-[#8AD7D6]/20 border border-[#8AD7D6]/30 text-[#8AD7D6] text-[10px] font-bold tracking-widest uppercase">
                  İletişim Formu
                </span>
                <h2 className="text-3xl font-serif text-white mt-4">Bize Yazın</h2>
                <p className="text-gray-400 text-sm mt-2">Düşüncelerinizi duymayı çok isteriz. 😊</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs text-gray-300 uppercase tracking-wider font-semibold">İsim Soyisim</Label>
                  <div className="relative group">
                    <Input
                      id="name"
                      placeholder="Adınız..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-[#8AD7D6] focus:ring-1 focus:ring-[#8AD7D6] transition-all pl-4"
                    />
                    <div className="absolute inset-0 rounded-xl bg-[#8AD7D6]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-gray-300 uppercase tracking-wider font-semibold">E-posta</Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-[#8AD7D6] focus:ring-1 focus:ring-[#8AD7D6] transition-all pl-4"
                    />
                    <div className="absolute inset-0 rounded-xl bg-[#8AD7D6]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Telefon</Label>
                  <div className="relative group">
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="05XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => {
                        // Sadece rakamları al
                        const numbersOnly = e.target.value.replace(/\D/g, '');
                        // Maksimum 11 karakter (Türkiye telefon numarası)
                        const limited = numbersOnly.slice(0, 11);
                        setFormData({ ...formData, phone: limited });
                      }}
                      onKeyDown={(e) => {
                        // Sadece rakam, backspace, delete, tab, ok tuşlarına izin ver
                        if (!/[0-9]/.test(e.key) && 
                            !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) &&
                            !e.ctrlKey && !e.metaKey) {
                          e.preventDefault();
                        }
                      }}
                      required
                      minLength={10}
                      maxLength={11}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-[#8AD7D6] focus:ring-1 focus:ring-[#8AD7D6] transition-all pl-4"
                    />
                    <div className="absolute inset-0 rounded-xl bg-[#8AD7D6]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500">Sadece rakam giriniz (örn: 05321234567)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Mesajınız</Label>
                  <div className="relative group">
                    <Textarea
                      id="message"
                      placeholder="Bir şeyler yazın..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none rounded-xl focus:border-[#8AD7D6] focus:ring-1 focus:ring-[#8AD7D6] transition-all p-4"
                    />
                    <div className="absolute inset-0 rounded-xl bg-[#8AD7D6]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                {/* Honeypot - Bot Tuzağı (Gizli Alan) */}
                <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* CAPTCHA - Matematik Sorusu */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300 uppercase tracking-wider font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#8AD7D6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Güvenlik Doğrulaması
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 h-12">
                      <span className="text-white font-bold text-lg">{captcha.num1}</span>
                      <span className="text-[#8AD7D6] font-bold">+</span>
                      <span className="text-white font-bold text-lg">{captcha.num2}</span>
                      <span className="text-gray-400">=</span>
                      <Input
                        type="number"
                        placeholder="?"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        required
                        className="bg-transparent border-0 text-white placeholder:text-white/30 h-10 w-16 text-center text-lg font-bold focus:ring-0 p-0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#8AD7D6] hover:border-[#8AD7D6]/50 transition-all"
                      title="Yeni soru"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 4v6h-6M1 20v-6h6"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-all mt-2 hover:scale-[1.02] hover:-translate-y-1 active:scale-95"
                  style={{ backgroundColor: accentColor, color: '#022c22', boxShadow: `0 0 20px ${accentColor}40` }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#022c22] border-t-transparent rounded-full animate-spin mr-3" />
                      GÖNDERİLİYOR...
                    </>
                  ) : (
                    <>
                      GÖNDER
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

      </div>

      {/* --- MAP SECTION (Floating Glass Card Design) --- */}
      <section id="map-section" className="relative z-10 w-full h-[70vh] min-h-[600px] bg-stone-900 border-t-4" style={{ borderColor: accentColor }} >

        {/* Map Background with Style */}
        <div className="absolute inset-0 w-full h-full grayscale contrast-[0.9] brightness-[0.8] hover:grayscale-0 transition-all duration-1000">
          <iframe
            src="https://maps.google.com/maps?q=Kızılırmak+mah.+Vatan+cad.+16+D,+Sivas&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Gradient Overlay for integration */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#022c22] via-[#022c22]/40 to-transparent opacity-90" />

        {/* Content Container */}
        <div className="relative h-full container mx-auto px-6 flex items-center md:items-end md:pb-20 justify-center md:justify-start pointer-events-none">

          {/* Floating Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto w-full max-w-md bg-[#022c22]/80 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8AD7D6]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                <MapPin className="w-6 h-6 text-[#8AD7D6]" />
              </div>
              <div>
                <span className="text-[#8AD7D6] text-xs font-bold tracking-widest uppercase block mb-1">Lokasyon</span>
                <h3 className="text-2xl font-serif text-white">Bizi Ziyaret Edin</h3>
              </div>
            </div>

            {/* Address */}
            <p className="relative z-10 text-gray-300 mb-8 leading-relaxed border-l-2 border-[#8AD7D6]/30 pl-4">
              Kızılırmak mah. Vatan cad. 16 D,<br />
              Sivas / 58070
            </p>

            {/* Working Hours */}
            <div className="relative z-10 space-y-3 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Hafta İçi</span>
                <span className="text-white font-medium bg-[#8AD7D6]/10 px-2 py-0.5 rounded textxs">{workingHoursWeekday}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/5 pt-2">
                <span className="text-gray-400">Hafta Sonu</span>
                <span className="text-white font-medium bg-[#8AD7D6]/10 px-2 py-0.5 rounded textxs">{workingHoursWeekend}</span>
              </div>
            </div>

            {/* Action Button */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Pişi+Kahvaltı+Sivas"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center justify-center gap-2 w-full h-12 bg-white text-[#022c22] rounded-xl font-bold transition-all hover:bg-[#8AD7D6] hover:scale-[1.02] shadow-lg"
            >
              Yol Tarifi Al
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
{/* --- YENİ BÖLÜM: MERAK ETTİKLERİNİZ & SOSYAL (BEYAZ ARKAPLAN) --- */}
      <section className="relative py-24 px-6 bg-[#fffcf8] text-[#022c22] overflow-hidden">
        
        {/* Dekoratif Arka Plan (Silik Desenler) */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }}></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#8AD7D6]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* SOL: SIKÇA SORULAN SORULAR */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-[#8AD7D6]/10 rounded-full text-[#8AD7D6] text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#8AD7D6]"></span>
                Merak Ettikleriniz
              </div>
              <h2 className="text-4xl font-serif font-bold mb-8 text-[#022c22]">Sıkça Sorulan Sorular</h2>
              
              <div className="space-y-6">
                {[
                  { q: "Rezervasyon gerekli mi?", a: "Hafta sonları yoğunluk olabildiği için rezervasyon yapmanızı öneririz. Hafta içi genellikle yer bulmak daha kolaydır." },
                  { q: "Otopark alanınız var mı?", a: "Evet, restoranımızın hemen yanında misafirlerimize özel ücretsiz otopark alanımız mevcuttur." },
                  { q: "Özel etkinlikler için yer ayırtabilir miyiz?", a: "Kesinlikle! Doğum günü, kutlama veya toplantılarınız için özel masa düzeni ve menü seçeneklerimiz mevcuttur." },
                  { q: "Glutensiz seçenekleriniz var mı?", a: "Evet, menümüzde glutensiz ekmek ve kahvaltı seçeneklerimiz bulunmaktadır. Lütfen sipariş verirken belirtiniz." }
                ].map((item, index) => (
                  <div key={index} className="group border-b border-[#022c22]/10 pb-6 last:border-0">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-[#8AD7D6] transition-colors flex items-center gap-2 cursor-pointer">
                      {item.q}
                    </h3>
                    <p className="text-gray-500 font-light leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SAĞ: TOPLULUK & DAVET KARTI */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="relative bg-[#022c22] rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden text-center">
                
                {/* İç Dekorasyon */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8AD7D6] to-yellow-400"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#8AD7D6] rounded-full blur-[60px] opacity-20"></div>

                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8AD7D6]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                  
                  <h3 className="text-3xl font-serif font-bold">Ailemize Katılın</h3>
                  <p className="text-gray-300 font-light leading-relaxed">
                    En yeni lezzetlerimizi, etkinliklerimizi ve sürpriz çekilişlerimizi kaçırmamak için bizi sosyal medyada takip edin.
                  </p>

                  <div className="pt-4 flex flex-col gap-4">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-full bg-[#8AD7D6] hover:bg-[#7acaca] text-[#022c22] font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                      Instagram'da Takip Et
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <p className="text-sm text-gray-500">@pisikahvalti • #doymadankalkmakyok</p>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
