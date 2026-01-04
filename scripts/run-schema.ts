// Simple script to run SQL via Supabase REST API
// Note: This requires service_role key for DDL operations

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local")
  process.exit(1)
}

if (!serviceRoleKey) {
  console.log("⚠️  SUPABASE_SERVICE_ROLE_KEY not found.")
  console.log("\n📋 Şemaları manuel olarak oluşturmak için:")
  console.log("1. Supabase Dashboard → Settings → API")
  console.log("2. 'service_role' key'i kopyalayın (anon key değil!)")
  console.log("3. .env.local'e ekleyin: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key")
  console.log("4. Bu script'i tekrar çalıştırın\n")
  console.log("VEYA")
  console.log("1. Supabase Dashboard → SQL Editor")
  console.log("2. supabase-schema.sql dosyasının içeriğini yapıştırın")
  console.log("3. Run butonuna tıklayın\n")
  process.exit(0)
}

console.log("🔄 Supabase şemaları oluşturuluyor...\n")
console.log("⚠️  Not: Service role key ile direkt SQL çalıştıramayız.")
console.log("📋 Lütfen şu adımları izleyin:\n")
console.log("1. https://supabase.com/dashboard → Projenizi seçin")
console.log("2. Sol menüden 'SQL Editor' seçin")
console.log("3. 'New query' butonuna tıklayın")
console.log("4. Aşağıdaki dosyanın içeriğini kopyalayıp yapıştırın:")
console.log("   📄 supabase-schema.sql")
console.log("5. 'Run' butonuna tıklayın\n")
console.log("✅ Şemalar oluşturulduktan sonra uygulama çalışacak!\n")

