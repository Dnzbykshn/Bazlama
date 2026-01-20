"use client"

import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function WhatsAppButton() {
  const phoneNumber = "905402714040" // WhatsApp formatında (ülke kodu + numara, boşluksuz)
  const whatsappUrl = `https://wa.me/${phoneNumber}`

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className="fixed top-24 right-6 z-50"
    >
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 hover:scale-110"
        aria-label="WhatsApp ile iletişime geç"
      >
        <MessageCircle className="w-7 h-7 text-white" fill="white" />
        <span className="absolute -top-12 right-0 bg-stone-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          WhatsApp ile iletişime geç
        </span>
      </Link>
    </motion.div>
  )
}
