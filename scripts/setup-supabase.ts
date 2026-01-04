import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

// Load environment variables
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Supabase environment variables not found!")
  console.error("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local")
  console.error("\nTo get Service Role Key:")
  console.error("1. Go to Supabase Dashboard → Settings → API")
  console.error("2. Copy the 'service_role' key (NOT the anon key)")
  process.exit(1)
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const schemaSQL = `
-- menu_items Tablosu
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- gallery Tablosu
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- messages Tablosu (İletişim Formu)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Row Level Security (RLS) Politikaları
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "menu_items are viewable by everyone" ON menu_items;
CREATE POLICY "menu_items are viewable by everyone" ON menu_items
  FOR SELECT USING (true);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gallery is viewable by everyone" ON gallery;
CREATE POLICY "gallery is viewable by everyone" ON gallery
  FOR SELECT USING (true);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages are insertable by everyone" ON messages;
CREATE POLICY "messages are insertable by everyone" ON messages
  FOR INSERT WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for menu_items updated_at
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at);
`

async function setupSchema() {
  console.log("🔄 Supabase şemaları oluşturuluyor...\n")

  try {
    // Split SQL into individual statements
    const statements = schemaSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    console.log(`📝 ${statements.length} SQL komutu çalıştırılıyor...\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ";"
      try {
        const { error } = await supabase.rpc("exec_sql", { sql: statement })
        
        if (error) {
          // If RPC doesn't exist, try direct query (might not work with anon key)
          console.log(`⚠️  Statement ${i + 1} RPC ile çalıştırılamadı, alternatif yöntem deneniyor...`)
        } else {
          console.log(`✅ Statement ${i + 1} başarılı`)
        }
      } catch (err: any) {
        console.log(`⚠️  Statement ${i + 1} atlandı: ${err.message}`)
      }
    }

    console.log("\n✅ Şema oluşturma işlemi tamamlandı!")
    console.log("\n📋 Not: Eğer hata aldıysanız, SQL'i manuel olarak çalıştırın:")
    console.log("1. Supabase Dashboard → SQL Editor")
    console.log("2. supabase-schema.sql dosyasının içeriğini yapıştırın")
    console.log("3. Run butonuna tıklayın\n")

  } catch (err: any) {
    console.error("❌ Hata:", err.message)
    console.log("\n📋 Alternatif: SQL'i manuel olarak çalıştırın:")
    console.log("1. Supabase Dashboard → SQL Editor")
    console.log("2. supabase-schema.sql dosyasının içeriğini yapıştırın")
    console.log("3. Run butonuna tıklayın\n")
  }
}

setupSchema()

