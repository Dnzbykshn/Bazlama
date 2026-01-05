import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BiziTaniyinPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold mb-4">Bizi Tanıyın</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Geleneksel Türk kahvaltısının en özel halini sizlere sunmak için yola çıktık
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="/images/image.png"
                alt="Muzlum Mekan"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-bold">Hikayemiz</h2>
              <p className="text-muted-foreground leading-relaxed">
                Muzlum, geleneksel Türk kahvaltısının sıcaklığını ve lezzetini modern bir dokunuşla 
                birleştiren bir mekan olarak doğdu. Her sabah taze hazırlanan ürünlerimiz, 
                annelerimizin elinden çıkmış gibi sofralarınızda yerini alıyor.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Organik malzemeler, geleneksel tarifler ve sevgiyle hazırlanan her bir lezzet, 
                sizleri doyurmadan sofradan kalkmamanız için özenle hazırlanıyor.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 md:order-2">
              <h2 className="text-3xl font-serif font-bold">Değerlerimiz</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Tazelik</h3>
                  <p className="text-muted-foreground">
                    Her sabah taze hazırlanan ürünlerimiz, en yüksek kalite standartlarında sunulur.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Geleneksel Lezzet</h3>
                  <p className="text-muted-foreground">
                    Nesillerden gelen tariflerimiz, modern dokunuşlarla harmanlanarak sofralarınıza gelir.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Misafirperverlik</h3>
                  <p className="text-muted-foreground">
                    Her misafirimiz bizim için özeldir. Sıcak karşılama ve hizmet anlayışımızla 
                    sizleri ağırlamaktan mutluluk duyarız.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden md:order-1">
              <Image
                src="/images/image.png"
                alt="Muzlum Değerler"
                fill
                className="object-cover"
              />
            </div>
          </section>

          {/* Mission Statement */}
          <section className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Misyonumuz</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              "Doymadan Kaçmak Yasak" felsefesiyle, her misafirimizin soframızdan mutlu ve doymuş 
              ayrılmasını sağlamak. Geleneksel Türk kahvaltısının en lezzetli halini, 
              sıcak bir atmosferde sunarak unutulmaz anılar yaratmak.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}


