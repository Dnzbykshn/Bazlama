import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables not found!")
  console.error("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// SQL Schema
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
-- menu_items için public read access
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "menu_items are viewable by everyone" ON menu_items;
CREATE POLICY "menu_items are viewable by everyone" ON menu_items
  FOR SELECT USING (true);

-- gallery için public read access
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gallery is viewable by everyone" ON gallery;
CREATE POLICY "gallery is viewable by everyone" ON gallery
  FOR SELECT USING (true);

-- messages için insert only (herkes mesaj gönderebilir, sadece admin okuyabilir)
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

async function createSchema() {
  console.log("🔄 Supabase bağlantısı kontrol ediliyor...")
  
  try {
    // Test connection
    const { data, error } = await supabase.from("menu_items").select("count").limit(1)
    
    if (error && error.code === "PGRST116") {
      console.log("✅ Bağlantı başarılı! Tablolar henüz oluşturulmamış.")
    } else if (error) {
      console.error("❌ Bağlantı hatası:", error.message)
      return
    } else {
      console.log("✅ Bağlantı başarılı! Tablolar zaten mevcut.")
    }

    console.log("\n⚠️  Not: Anon key ile DDL (CREATE TABLE) komutları çalıştırılamaz.")
    console.log("📋 SQL script'i Supabase Dashboard'da çalıştırmanız gerekiyor:\n")
    console.log("1. https://supabase.com/dashboard → Projenizi seçin")
    console.log("2. SQL Editor'a gidin")
    console.log("3. Aşağıdaki SQL'i yapıştırın ve çalıştırın:\n")
    console.log("=" .repeat(60))
    console.log(schemaSQL)
    console.log("=" .repeat(60))
    
    // Alternative: Try using RPC if available
    console.log("\n🔄 RPC ile deneme yapılıyor...")
    const { data: rpcData, error: rpcError } = await supabase.rpc("exec_sql", { sql: schemaSQL })
    
    if (rpcError) {
      console.log("ℹ️  RPC mevcut değil. SQL Editor kullanmanız gerekiyor.")
    } else {
      console.log("✅ Şema başarıyla oluşturuldu!")
    }
    
  } catch (err: any) {
    console.error("❌ Hata:", err.message)
  }
}

createSchema()

