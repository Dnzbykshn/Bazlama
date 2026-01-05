import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Menü",
  description: "Lezzetli Türk kahvaltı menümüzü keşfedin. Taze hazırlanan ürünlerimiz ve özel tariflerimizle sofralarınızı zenginleştirin.",
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


