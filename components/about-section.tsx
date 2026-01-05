export function AboutSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-serif font-bold text-foreground">Geleneksel Lezzet, Modern Dokunuş</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Muzlum olarak, geleneksel Türk kahvaltısının en özel halini sizlere sunuyoruz. 
            Her sabah taze hazırlanan ürünlerimiz, annelerimizin elinden çıkmış gibi sıcacık sofralarınızda yerini alıyor.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Organik malzemeler, geleneksel tarifler ve sevgiyle hazırlanan her bir lezzet, 
            sizleri doyurmadan sofradan kalkmamanız için özenle hazırlanıyor. 
            Çünkü bizim için <span className="font-bold text-primary">"Doymadan Kaçmak Yasak"</span>.
          </p>
        </div>
      </div>
    </section>
  )
}


