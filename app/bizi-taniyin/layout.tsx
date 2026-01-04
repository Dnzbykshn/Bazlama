import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bizi Tanıyın",
  description: "Muzlum'un hikayesi, değerleri ve misyonu. Geleneksel Türk kahvaltısını modern bir dokunuşla sunma yolculuğumuz.",
}

export default function BiziTaniyinLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

