
---

## 3. Global Stil & Marka Kimliği

- [ ] Google Font seç ve ekle (örn: Playfair Display, Poppins)
- [ ] `fonts.ts` dosyasını oluştur
- [ ] Font’u `layout.tsx` içinde global olarak bağla
- [ ] Logo dosyasını `/public` klasörüne ekle
- [ ] Navbar’da logo değişimini yap
- [ ] Ana renkleri `tailwind.config.js` içine ekle

---

## 4. Navbar & Footer

### Navbar
- [ ] Logo alanı ekle
- [ ] Menü linkleri ekle:
  - Anasayfa
  - Menü
  - Galeri
  - Bizi Tanıyın
  - İletişim
- [ ] Mobil hamburger menü ekle
- [ ] Scroll durumunda sticky davranış ekle

### Footer
- [ ] Logo veya site adı ekle
- [ ] Sosyal medya ikonları ekle
- [ ] Tel / adres bilgileri ekle
- [ ] Copyright alanı ekle

---

## 5. Supabase Kurulumu

- [ ] Supabase projesi oluştur
- [ ] `.env.local` dosyasını oluştur
- [ ] Supabase URL ve Anon Key ekle
- [ ] `supabase.ts` client dosyasını oluştur
- [ ] Basit bir fetch testi yap

---

## 6. Veritabanı Yapısı

### menu_items Tablosu
- [ ] `id` (uuid, primary key)
- [ ] `title` (text)
- [ ] `description` (text)
- [ ] `price` (numeric)
- [ ] `image_url` (text)

### gallery Tablosu
- [ ] `id` (uuid)
- [ ] `image_url` (text)

### messages Tablosu
- [ ] `id` (uuid)
- [ ] `name` (text)
- [ ] `email` (text)
- [ ] `message` (text)
- [ ] `created_at` (timestamp)

---

## 7. Anasayfa

- [ ] Hero section oluştur
- [ ] Kahvaltı konseptini anlatan kısa metin ekle
- [ ] Öne çıkan 3 menü ürünü göster
- [ ] Galeriden 3–4 görsel preview göster
- [ ] Menü ve iletişim için CTA butonları ekle

---

## 8. Menü Sayfası

- [ ] Supabase’dan `menu_items` verilerini çek
- [ ] `MenuCard` componenti oluştur
- [ ] Grid layout ile menüleri listele
- [ ] Fiyat formatlaması ekle
- [ ] Loading ve error state ekle

---

## 9. Galeri Sayfası

- [ ] Supabase Storage bucket oluştur (`gallery`)
- [ ] Galeri görsellerini storage’a yükle
- [ ] Supabase’dan galeri verilerini çek
- [ ] `GalleryGrid` componenti oluştur
- [ ] Modal / Lightbox görüntüleme ekle (opsiyonel)

---

## 10. Bizi Tanıyın Sayfası

- [ ] Metin içeriklerini ekle
- [ ] Mekan veya ekip fotoğrafı ekle
- [ ] Basit fade-in animasyonu ekle
- [ ] Responsive kontrolü yap

---

## 11. İletişim Sayfası

- [ ] İsim / Email / Mesaj input’larını oluştur
- [ ] Form validation ekle
- [ ] Supabase `messages` tablosuna kayıt al
- [ ] Başarı ve hata mesajları göster
- [ ] Google Maps iframe ekle

---

## 12. SEO & UX

- [ ] Sayfa başlıklarını ayarla
- [ ] Meta description ekle
- [ ] Open Graph ayarları yap
- [ ] 404 sayfası oluştur
- [ ] Loading skeleton’lar ekle

---

## 13. Son Kontroller & Deploy

- [ ] Mobil / Tablet / Desktop testleri
- [ ] Lighthouse performans kontrolü
- [ ] Vercel ortam değişkenlerini ekle
- [ ] Production deploy al

---

## 14. Opsiyonel Geliştirmeler

- [ ] Admin panel (menü & galeri ekleme)
- [ ] Çoklu dil desteği
- [ ] Framer Motion animasyonları
- [ ] WhatsApp / Rezervasyon CTA

---

✅ Proje tamamlandığında:
- SEO uyumlu
- Mobil uyumlu
- Kolay yönetilebilir
- Gerçek müşteri kullanımı için hazır

