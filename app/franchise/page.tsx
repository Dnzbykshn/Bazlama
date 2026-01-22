"use client"

import { useState } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Send, TrendingUp, Users, MapPin, DollarSign } from "lucide-react"
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

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    investment_amount: "",
    experience: "",
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
          title: "Başvuru gönderildi!",
          description: "Başvurunuz başarıyla iletildi. (Demo modu - Supabase yapılandırılmamış)",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          investment_amount: "",
          experience: "",
          message: "",
        })
        setLoading(false)
        return
      }

      const { error } = await supabase.from("franchise_applications").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          investment_amount: formData.investment_amount || null,
          experience: formData.experience || null,
          message: formData.message || null,
        },
      ])

      if (error) throw error

      toast({
        title: "Başvuru gönderildi!",
        description: "Franchise başvurunuz başarıyla iletildi. En kısa sürede size dönüş yapacağız.",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        investment_amount: "",
        experience: "",
        message: "",
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

      {/* Header */}
      <section className="pt-32 pb-12 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container mx-auto text-center"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-4">
            İş Fırsatı
          </span>
          <h1 className="text-5xl font-serif font-bold mb-4 text-foreground">Franchise</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Pişi Kahvaltı ailesine katılın ve kendi işinizin sahibi olun. Başarılı bir franchise sistemi ile yanınızdayız.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 pb-24 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100">
              <h2 className="text-2xl font-serif font-bold mb-6">Franchise Avantajları</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Kanıtlanmış İş Modeli</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Başarılı bir iş modeli ile riski minimize edin ve karlı bir işletme kurun.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Kapsamlı Eğitim ve Destek</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Açılıştan itibaren sürekli eğitim ve operasyonel destek alın.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Bölge Koruması</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Belirlenen bölgede tek yetkili franchise olma hakkı.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Rekabetçi Yatırım</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Uygun yatırım maliyeti ile kendi işinizin sahibi olun.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
          >
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100">
              <h2 className="text-2xl font-serif font-bold mb-2">Franchise Başvuru Formu</h2>
              <p className="text-muted-foreground mb-8">Başvurunuzu doldurun, size en kısa sürede dönüş yapalım.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium pl-1">Ad Soyad *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-stone-50 border-stone-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium pl-1">E-posta *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-stone-50 border-stone-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium pl-1">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0540 271 40 40"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-stone-50 border-stone-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-base font-medium pl-1">Şehir *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="İstanbul"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-stone-50 border-stone-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment_amount" className="text-base font-medium pl-1">Yatırım Tutarı</Label>
                  <Input
                    id="investment_amount"
                    type="text"
                    placeholder="Örn: 500.000 - 1.000.000 TL"
                    value={formData.investment_amount}
                    onChange={(e) => setFormData({ ...formData, investment_amount: e.target.value })}
                    className="h-12 rounded-xl bg-stone-50 border-stone-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-base font-medium pl-1">İş Deneyimi</Label>
                  <Textarea
                    id="experience"
                    placeholder="Restoran, işletme veya franchise deneyiminiz varsa belirtin..."
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    rows={3}
                    className="resize-none rounded-xl bg-stone-50 border-stone-200 focus:bg-white transition-colors p-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base font-medium pl-1">Ek Mesaj</Label>
                  <Textarea
                    id="message"
                    placeholder="Eklemek istediğiniz bilgiler..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="resize-none rounded-xl bg-stone-50 border-stone-200 focus:bg-white transition-colors p-4"
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
                      Başvuru Gönder
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
