"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TestSupabase() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function testConnection() {
      try {
        // Test connection by fetching from a table (will fail if table doesn't exist, but connection works)
        const { error } = await supabase.from("menu_items").select("count").limit(1)
        
        if (error && error.code === "PGRST116") {
          // Table doesn't exist yet, but connection is working
          setStatus("success")
          setMessage("✅ Supabase bağlantısı başarılı! Tablolar henüz oluşturulmamış.")
        } else if (error) {
          setStatus("error")
          setMessage(`❌ Hata: ${error.message}`)
        } else {
          setStatus("success")
          setMessage("✅ Supabase bağlantısı ve tablolar çalışıyor!")
        }
      } catch (err: any) {
        setStatus("error")
        setMessage(`❌ Bağlantı hatası: ${err.message || "Environment variables eksik olabilir"}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Bağlantı Testi</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            {status === "loading" && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
            {status === "success" && <span className="text-2xl">✅</span>}
            {status === "error" && <span className="text-2xl">❌</span>}
            <p className="text-lg">{message || "Bağlantı test ediliyor..."}</p>
          </div>

          {status === "error" && (
            <div className="bg-destructive/10 border border-destructive/20 rounded p-4 text-sm">
              <p className="font-semibold mb-2">Kontrol edin:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>.env.local dosyası oluşturuldu mu?</li>
                <li>NEXT_PUBLIC_SUPABASE_URL değişkeni doğru mu?</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY değişkeni doğru mu?</li>
                <li>Supabase projesi aktif mi?</li>
              </ul>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Bu sayfa sadece test amaçlıdır. Supabase kurulumu tamamlandıktan sonra silinebilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


