import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Gizlilik politikamız hakkında bilgi edinin. Kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu öğrenin.",
}

export default function GizlilikLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


