import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Phone } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-serif font-bold">Hemen Rezervasyon Yapın</h2>
          <p className="text-lg text-muted-foreground">
            Lezzetli bir kahvaltı için bizi ziyaret edin veya online sipariş verin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#rezervasyon">
              <Button size="lg" className="rounded-full w-full sm:w-auto">
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                Rezervasyon Yap
              </Button>
            </Link>
            <Link href="#iletisim">
              <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                <Phone className="w-5 h-5 mr-2" />
                İletişime Geç
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

