"use client"

import { useState } from "react"
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

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!isSupabaseConfigured) {
        toast({
          title: "Mesaj gönderildi!",
          description: "Mesajınız başarıyla iletildi. (Demo modu - Supabase yapılandırılmamış)",
        })
        setFormData({ name: "", email: "", message: "" })
        setLoading(false)
        return
      }

      const { error } = await supabase.from("messages").insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      ])

      if (error) throw error

      toast({
        title: "Mesaj gönderildi!",
        description: "Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.",
      })

      setFormData({ name: "", email: "", message: "" })
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
                <p className="text-gray-400 text-sm mt-2">Düşüncelerinizi duymayı çok isteriz.</p>
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
                <span className="text-white font-medium bg-[#8AD7D6]/10 px-2 py-0.5 rounded textxs">08:00 - 22:00</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/5 pt-2">
                <span className="text-gray-400">Hafta Sonu</span>
                <span className="text-white font-medium bg-[#8AD7D6]/10 px-2 py-0.5 rounded textxs">08:00 - 23:00</span>
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

      <Footer />
    </main>
  )
}
