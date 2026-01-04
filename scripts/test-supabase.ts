import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

// Load environment variables
const envPath = path.join(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8")
  const envVars = envContent.split("\n").reduce((acc, line) => {
    const [key, ...valueParts] = line.split("=")
    if (key && valueParts.length > 0) {
      acc[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "")
    }
    return acc
  }, {} as Record<string, string>)

  process.env.NEXT_PUBLIC_SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables not found!")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log("🔄 Supabase bağlantısı test ediliyor...\n")

  try {
    // Test menu_items table
    console.log("📋 menu_items tablosu kontrol ediliyor...")
    const { data: menuData, error: menuError } = await supabase
      .from("menu_items")
      .select("count")
      .limit(1)

    if (menuError) {
      if (menuError.code === "PGRST116") {
        console.log("❌ menu_items tablosu bulunamadı!")
      } else {
        console.log(`⚠️  menu_items: ${menuError.message}`)
      }
    } else {
      console.log("✅ menu_items tablosu mevcut!")
    }

    // Test gallery table
    console.log("\n📋 gallery tablosu kontrol ediliyor...")
    const { data: galleryData, error: galleryError } = await supabase
      .from("gallery")
      .select("count")
      .limit(1)

    if (galleryError) {
      if (galleryError.code === "PGRST116") {
        console.log("❌ gallery tablosu bulunamadı!")
      } else {
        console.log(`⚠️  gallery: ${galleryError.message}`)
      }
    } else {
      console.log("✅ gallery tablosu mevcut!")
    }

    // Test messages table
    console.log("\n📋 messages tablosu kontrol ediliyor...")
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("count")
      .limit(1)

    if (messagesError) {
      if (messagesError.code === "PGRST116") {
        console.log("❌ messages tablosu bulunamadı!")
      } else {
        console.log(`⚠️  messages: ${messagesError.message}`)
      }
    } else {
      console.log("✅ messages tablosu mevcut!")
    }

    console.log("\n" + "=".repeat(50))
    if (!menuError && !galleryError && !messagesError) {
      console.log("✅ Tüm tablolar mevcut! Supabase bağlantısı başarılı!")
      console.log("\n📝 Şimdi test verisi ekleyebilirsiniz:")
      console.log("   - Menü öğeleri eklemek için: Supabase Dashboard → Table Editor → menu_items")
      console.log("   - Galeri görselleri eklemek için: Supabase Dashboard → Table Editor → gallery")
    } else {
      console.log("⚠️  Bazı tablolar eksik!")
      console.log("\n📋 Eksik tabloları oluşturmak için:")
      console.log("1. Supabase Dashboard → SQL Editor")
      console.log("2. supabase-schema.sql dosyasının içeriğini yapıştırın")
      console.log("3. Run butonuna tıklayın")
    }
    console.log("=".repeat(50) + "\n")

  } catch (err: any) {
    console.error("❌ Hata:", err.message)
  }
}

testConnection()

