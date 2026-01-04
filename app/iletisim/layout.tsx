import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "İletişim",
  description: "Bizimle iletişime geçin. Rezervasyon, sorularınız veya önerileriniz için bize ulaşın.",
}

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

