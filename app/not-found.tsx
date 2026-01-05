import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-32">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h1 className="text-9xl font-serif font-bold text-primary/20">404</h1>
          <h2 className="text-4xl font-serif font-bold">Sayfa Bulunamadı</h2>
          <p className="text-lg text-muted-foreground">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/">
              <Button size="lg" className="rounded-full">
                Anasayfaya Dön
              </Button>
            </Link>
            <Link href="/menu">
              <Button variant="outline" size="lg" className="rounded-full">
                Menüyü Gör
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}


