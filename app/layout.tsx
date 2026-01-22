import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { playfairDisplay, poppins } from "@/lib/fonts"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Pişi Kahvaltı - Geleneksel Türk Kahvaltısı",
    template: "%s | Pişi Kahvaltı",
  },
  description: "Geleneksel Türk kahvaltısının en lezzetli hali. Siz tamam diyene kadar, biz servise devam ediyoruz ;) Taze hazırlanan ürünlerimiz ve sıcak atmosferimizle sizleri ağırlıyoruz.",
  keywords: ["Türk kahvaltısı", "geleneksel kahvaltı", "İstanbul kahvaltı", "serpme kahvaltı", "organik kahvaltı"],
  authors: [{ name: "Pişi Kahvaltı" }],
  creator: "Pişi Kahvaltı",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://pisikahvalti.com",
    siteName: "Pişi Kahvaltı",
    title: "Pişi Kahvaltı - Geleneksel Türk Kahvaltısı",
    description: "Geleneksel Türk kahvaltısının en lezzetli hali. Siz tamam diyene kadar, biz servise devam ediyoruz ;)",
    images: [
      {
        url: "/images/image.png",
        width: 1200,
        height: 630,
        alt: "Pişi Kahvaltı - Geleneksel Türk Kahvaltısı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pişi Kahvaltı - Geleneksel Türk Kahvaltısı",
    description: "Geleneksel Türk kahvaltısının en lezzetli hali",
    images: ["/images/image.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${playfairDisplay.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
        style={{ backgroundColor: "#8ad7d6" }}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
