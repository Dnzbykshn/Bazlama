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
import { Mail, Phone, MapPin, Send } from "lucide-react"
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
    <main className="min-h-screen relative bg-transparent">
      {/* Fixed Hero Background */}
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-[65vh] -z-10">
        <Image
          src="/DSC07011.jpg"
          alt="İletişim Arkaplan"
          fill
          className="object-cover saturate-150"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <Header />

      {/* Hero Spacer */}
      {/* Hero Content Overlay */}
      <div className="w-full h-[55vh] flex items-center justify-center pt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center px-4"
        >

          <div className="inline-block p-8 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl">
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 text-white backdrop-blur-sm text-sm font-medium tracking-wide mb-2 border border-white/10">
              Bize Ulaşın
            </span>
            <h1 className="text-5xl font-serif font-bold text-white mb-4 mt-2">İletişim</h1>
            <p className="text-lg text-white/90 font-light italic max-w-lg mx-auto mt-2">
              Sorularınız veya rezervasyon talepleriniz için buradayız.
            </p>
          </div>
        </motion.div>
      </div>



      <section className="relative z-10 bg-[var(--background)] pb-24 pt-12 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Details Title */}
          <div className="relative w-[500px] h-[340px] mx-auto -mt-40 -mb-20 flex items-center justify-center">
            <Image
              src="/baslık_cerceve.png"
              alt="Çerçeve"
              fill
              className="object-contain opacity-100"
            />
            <h2 className="relative z-10 text-4xl font-serif font-bold text-stone-900 pb-2">Detaylar</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Contact Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInLeft}
              className="space-y-8"
            >
              {/* Large Framed Visual */}
              <div className="relative w-full h-[720px] mb-12">
                {/* Frame Background/Overlay */}
                <div className="absolute w-[3200px] h-[1134px] -ml-305 -mt-59 inset-0 z-20 pointer-events-none">
                  <Image
                    src="/cerceve_2.png"
                    alt="Çerçeve"
                    fill
                    className="object-fill"
                  />
                </div>
                {/* Content Image */}
                <div className="relative w-full h-full z-10 p-[6%]">
                  <div className="relative w-full h-full -mt-6 rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src="/DSC04385.jpg"
                      alt="İletişim Görseli"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 space-y-6">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-[0.2em] px-4 py-1.5 w-fit">
                  BİLGİLER
                </span>
                <h2 className="text-3xl font-serif font-bold text-stone-900">İletişim Bilgileri</h2>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Adres</h3>
                    <p className="text-stone-600 leading-relaxed">
                      Kızılırmak mah. Vatan cad. 16 D
                      <br />
                      Sivas / 58070
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Telefon</h3>
                    <a href="tel:+905402714040" className="text-stone-600 hover:text-primary transition-colors text-lg">
                      +90 540 271 40 40
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">E-posta</h3>
                    <a href="mailto:info@pisikahvalti.com" className="text-stone-600 hover:text-primary transition-colors text-lg">
                      info@pisikahvalti.com
                    </a>
                  </div>
                </div>
              </div>


            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInRight}
            >
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 min-h-[680px] flex flex-col">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-[0.2em] px-4 py-1.5 mb-4 w-fit">
                  İLETİŞİM
                </span>
                <h2 className="text-3xl font-serif font-bold text-stone-900">Bize Yazın</h2>
                <p className="text-stone-600 mt-2 mb-8">
                  Mesajınızı iletin, ekibimiz en kısa sürede dönüş yapsın.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-center">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-stone-700">İsim Soyisim</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Adınız Soyadınız"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12 rounded-xl bg-white border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-stone-700">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 rounded-xl bg-white border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-stone-700">Mesajınız</Label>
                    <Textarea
                      id="message"
                      placeholder="Mesajınızı buraya yazın..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      required
                      className="resize-none rounded-xl bg-white border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors p-4"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Gönder
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Map */}
              <div className="h-[420px] w-full mt-16 rounded-[2.5rem] overflow-hidden shadow-xl shadow-stone-200/50 border border-stone-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.5!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOMKwNTgnNDIuMiJF!5e0!3m2!1str!2str!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      <Footer />
    </main >
  )
}
