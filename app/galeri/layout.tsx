import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Galeri",
  description: "Mekanımızdan ve lezzetlerimizden kareler. Geleneksel Türk kahvaltısının görsel şöleni.",
}

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

