import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { playfairDisplay, poppins } from "@/lib/fonts"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Muzlum - Geleneksel Türk Kahvaltısı",
    template: "%s | Muzlum",
  },
  description: "Geleneksel Türk kahvaltısının en lezzetli hali. Doymadan kaçmak yasak! Taze hazırlanan ürünlerimiz ve sıcak atmosferimizle sizleri ağırlıyoruz.",
  keywords: ["Türk kahvaltısı", "geleneksel kahvaltı", "İstanbul kahvaltı", "serpme kahvaltı", "organik kahvaltı"],
  authors: [{ name: "Muzlum" }],
  creator: "Muzlum",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://muzlum.com",
    siteName: "Muzlum",
    title: "Muzlum - Geleneksel Türk Kahvaltısı",
    description: "Geleneksel Türk kahvaltısının en lezzetli hali. Doymadan kaçmak yasak!",
    images: [
      {
        url: "/images/image.png",
        width: 1200,
        height: 630,
        alt: "Muzlum - Geleneksel Türk Kahvaltısı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muzlum - Geleneksel Türk Kahvaltısı",
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
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
