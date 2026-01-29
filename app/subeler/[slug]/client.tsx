"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, type Variants, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, Mail, ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, Store, Compass, Camera, Utensils, Quote } from "lucide-react"
import { Caveat, Inter, Playfair_Display, Patrick_Hand } from "next/font/google"

// --- FONT AYARLARI (Premium Tema) ---
// const caveat = Caveat({ subsets: ["latin"], weight: ["700"] }) // Artık pek kullanmıyoruz, daha ciddi durması için
const patrick = Patrick_Hand({ subsets: ["latin"], weight: ["400"] }) // Samimi açıklamalar için
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"] }) // Başlıklar için
const inter = Inter({ subsets: ["latin"] }) // Genel metinler için

// --- MARKA RENGİ ---
const accentColor = "#8AD7D6";

// --- TİPLER ---
interface Branch {
    id: string
    name: string
    slug: string
    city: string
    address: string | null
    phone: string | null
    email: string | null
    active: boolean
    image_url: string | null
    description: string | null
    story: string | null
    working_hours: { [key: string]: string } | null
    map_url: string | null
}

interface BranchMenuItem {
    id: string
    title: string
    description: string | null
    price: number
    image_url: string | null
    category: string | null
}

interface BranchGalleryItem {
    id: string
    image_url: string
    title: string | null
    description: string | null
}

// --- ANİMASYONLAR ---
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } // Daha yumuşak bir ease
}

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
}

const days = [
    { key: "monday", label: "Pazartesi" },
    { key: "tuesday", label: "Salı" },
    { key: "wednesday", label: "Çarşamba" },
    { key: "thursday", label: "Perşembe" },
    { key: "friday", label: "Cuma" },
    { key: "saturday", label: "Cumartesi" },
    { key: "sunday", label: "Pazar" },
]



export default function BranchDetailPage() {
    const params = useParams()
    const slug = params?.slug as string
    const [branch, setBranch] = useState<Branch | null>(null)
    const [menuItems, setMenuItems] = useState<BranchMenuItem[]>([])
    const [galleryItems, setGalleryItems] = useState<BranchGalleryItem[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // --- VERİ ÇEKME ---
    useEffect(() => {
        if (slug) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const { data: branchData, error: branchError } = await supabase
                        .from("branches")
                        .select("*")
                        .eq("slug", slug)
                        .eq("active", true)
                        .single();

                    if (branchError || !branchData) throw new Error("Şube bulunamadı");
                    setBranch(branchData);

                    const [menuRes, galleryRes] = await Promise.all([
                        supabase.from("branch_menu_items").select("*").eq("branch_id", branchData.id).order("category").order("position"),
                        supabase.from("branch_gallery").select("*").eq("branch_id", branchData.id).order("position").order("created_at", { ascending: false })
                    ]);

                    if (menuRes.data) setMenuItems(menuRes.data);
                    if (galleryRes.data) setGalleryItems(galleryRes.data);

                } catch (err: any) {
                    setError(err.message || "Bir hata oluştu");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [slug]);

    // Slider Otomatik Geçiş
    useEffect(() => {
        if (galleryItems.length > 1) {
            const interval = setInterval(() => setCurrentImageIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1)), 5000);
            return () => clearInterval(interval);
        }
    }, [galleryItems.length]);

    // Yükleniyor / Hata Durumları (Premium Tasarım)
    if (loading) return <LoadingState />;
    if (error || !branch) return <ErrorState error={error} />;

    const groupedMenu = menuItems.reduce((acc, item) => {
        const category = item.category || "Diğer";
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {} as Record<string, BranchMenuItem[]>);

    return (
        <main className={`min-h-screen bg-[#fffcf8] selection:bg-[#8AD7D6] selection:text-white ${inter.className}`}>
            <Header />

            {/* --- HERO SECTION (Sinematik & Premium) --- */}
            <section className="relative h-[70vh] min-h-[500px] flex items-end justify-center pb-24 text-center text-white overflow-hidden">
                {/* Arka Plan Resmi */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={branch.image_url || "/placeholder-branch.jpg"}
                        alt={branch.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Daha sofistike bir gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/50 to-black/30 opacity-90"></div>
                </div>

                {/* İçerik */}
                <motion.div
                    initial="hidden" animate="visible" variants={staggerContainer}
                    className="relative z-10 container mx-auto px-4 max-w-4xl space-y-6"
                >
                    {/* Geri Dön Linki */}
                    <motion.div variants={fadeInUp}>
                        <Link href="/subeler" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="font-medium text-sm tracking-wide uppercase">Tüm Şubeler</span>
                        </Link>
                    </motion.div>

                    {/* Şehir Rozeti */}
                    <motion.div variants={fadeInUp}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase">
                            <MapPin className="w-3 h-3 text-[#8AD7D6]" />
                            {branch.city}
                        </div>
                    </motion.div>

                    {/* Başlık */}
                    <motion.h1 variants={fadeInUp} className={`text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl ${playfair.className}`}>
                        {branch.name}
                    </motion.h1>

                    {/* Kısa Açıklama */}
                    {branch.description && (
                        <motion.p variants={fadeInUp} className={`text-lg md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto ${patrick.className}`}>
                            {branch.description}
                        </motion.p>
                    )}
                </motion.div>
            </section>

            {/* --- ANA İÇERİK ALANI (Kavisli Geçiş) --- */}
            <div className="relative z-20 -mt-20 bg-[#fffcf8] rounded-t-[3rem] md:rounded-t-[4rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-4 pb-32 overflow-hidden">

                {/* Çok hafif arka plan dokusu */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }}></div>

                <div className="container mx-auto pt-16 md:pt-24 space-y-24 max-w-6xl relative z-10">

                    {/* --- HİKAYEMİZ (Zarif Kart Tasarımı) --- */}
                    {branch.story && (
                        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl shadow-stone-200/40 border border-stone-100 relative overflow-hidden">
                                <Quote className="absolute top-8 left-8 w-12 h-12 text-[#8AD7D6]/20 rotate-180" />
                                <div className="relative z-10 text-center">
                                    <h2 className={`text-3xl md:text-4xl font-bold text-stone-900 mb-8 ${playfair.className}`}>Bu Şubenin Hikayesi</h2>
                                    <div className={`text-xl text-stone-600 leading-relaxed font-light whitespace-pre-wrap ${patrick.className}`}>
                                        {branch.story}
                                    </div>
                                </div>
                                <Quote className="absolute bottom-8 right-8 w-12 h-12 text-[#8AD7D6]/20" />
                            </div>
                        </motion.section>
                    )}

                    {/* --- BİLGİ KARTLARI (Premium & Ferah) --- */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 gap-8 lg:gap-12">

                        {/* İletişim Paneli */}
                        <motion.div variants={fadeInUp} className="bg-white rounded-[3rem] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-stone-50 relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(138,215,214,0.15)] transition-all duration-500">
                            {/* Dekoratif Arka Plan İkonu */}
                            <div className="absolute -right-12 -bottom-12 text-stone-100 opacity-70 group-hover:rotate-12 transition-transform duration-700">
                                <Compass size={200} strokeWidth={0.5} />
                            </div>

                            <h3 className={`text-2xl font-bold mb-10 flex items-center gap-3 text-stone-900 ${playfair.className}`}>
                                <span className="w-10 h-10 rounded-full bg-[#8AD7D6]/10 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-[#8AD7D6]" />
                                </span>
                                İletişim
                            </h3>
                            <div className="space-y-8 relative z-10 pl-2">
                                {branch.address && <InfoItem icon={MapPin} title="Adres" content={branch.address} />}
                                {branch.phone && <InfoItem icon={Phone} title="Telefon" content={branch.phone} isLink href={`tel:${branch.phone}`} />}
                                {branch.email && <InfoItem icon={Mail} title="E-posta" content={branch.email} isLink href={`mailto:${branch.email}`} />}

                                {branch.map_url && (
                                    <div className="pt-4">
                                        <a href={branch.map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-stone-900 hover:bg-[#8AD7D6] px-6 py-3 rounded-full transition-all group/btn shadow-md hover:shadow-lg">
                                            Yol Tarifi Al
                                            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Çalışma Saatleri Paneli */}
                        <motion.div variants={fadeInUp} className="bg-white rounded-[3rem] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-stone-50 relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(252,211,77,0.15)] transition-all duration-500">
                            {/* Dekoratif Arka Plan İkonu */}
                            <div className="absolute -right-12 -bottom-12 text-stone-100 opacity-70 group-hover:-rotate-12 transition-transform duration-700">
                                <Clock size={200} strokeWidth={0.5} />
                            </div>
                            <h3 className={`text-2xl font-bold mb-10 flex items-center gap-3 text-stone-900 ${playfair.className}`}>
                                <span className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-yellow-500" />
                                </span>
                                Çalışma Saatleri
                            </h3>
                            <div className="space-y-4 relative z-10 pl-2">
                                {days.map((day) => {
                                    const hours = branch.working_hours?.[day.key];
                                    return (
                                        <div key={day.key} className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0">
                                            <span className={`font-bold text-stone-700 ${inter.className}`}>{day.label}</span>
                                            <span className={`font-medium ${hours ? 'text-stone-900' : 'text-red-400 italic'}`}>
                                                {hours || "Kapalı"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* --- GALERİ (Şık ve Yuvarlak) --- */}
                    {galleryItems.length > 0 && (
                        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-10">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#8AD7D6]/10 text-[#8AD7D6] text-sm font-bold tracking-widest uppercase mb-4">
                                    <Camera className="w-4 h-4" /> Galeri
                                </div>
                                <h2 className={`text-4xl md:text-5xl font-bold text-stone-900 ${playfair.className}`}>Atmosferi Hisset</h2>
                            </div>

                            <div className="relative max-w-5xl mx-auto group">
                                <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200/40 border-[6px] border-white">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentImageIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.7 }}
                                            className="absolute inset-0"
                                        >
                                            <Image src={galleryItems[currentImageIndex].image_url} alt={galleryItems[currentImageIndex].title || "Gallery"} fill className="object-cover" priority />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                            {galleryItems[currentImageIndex].title && (
                                                <div className="absolute bottom-0 left-0 right-0 p-10 md:p-14">
                                                    <h4 className={`text-white text-3xl font-bold ${playfair.className}`}>{galleryItems[currentImageIndex].title}</h4>
                                                    {galleryItems[currentImageIndex].description && <p className="text-white/80 mt-2 text-lg font-light">{galleryItems[currentImageIndex].description}</p>}
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Slider Kontrolleri */}
                                    {galleryItems.length > 1 && (
                                        <>
                                            <SliderButton direction="left" onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))} />
                                            <SliderButton direction="right" onClick={() => setCurrentImageIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))} />
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-2 rounded-full bg-black/20 backdrop-blur-sm">
                                                {galleryItems.map((_, index) => (
                                                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`h-2 rounded-full transition-all duration-500 ${index === currentImageIndex ? "bg-[#8AD7D6] w-8" : "bg-white/50 w-2 hover:bg-white"}`} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* --- MENÜ (Restoran Tarzı Liste) --- */}
                    {menuItems.length > 0 && (
                        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-16 pt-12">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-400/10 text-yellow-600 text-sm font-bold tracking-widest uppercase mb-4">
                                    <Utensils className="w-4 h-4" /> Menü
                                </div>
                                <h2 className={`text-4xl md:text-5xl font-bold text-stone-900 ${playfair.className}`}>Şubeye Özel Lezzetler</h2>
                            </div>

                            {Object.entries(groupedMenu).map(([category, items]) => (
                                <motion.div key={category} variants={fadeInUp}>
                                    <h3 className={`text-3xl font-bold text-stone-800 mb-8 flex items-center gap-4 ${playfair.className}`}>
                                        <span className="w-8 h-[3px] bg-[#8AD7D6] rounded-full"></span>
                                        {category}
                                    </h3>

                                    <div className="grid lg:grid-cols-2 gap-x-12 gap-y-6">
                                        {items.map((item) => (
                                            <motion.div key={item.id} whileHover={{ x: 5 }} className="flex gap-6 items-start group p-4 rounded-2xl hover:bg-white transition-all duration-300">
                                                {/* Menü Resmi */}
                                                <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                                                    {item.image_url ? (
                                                        <Image src={item.image_url} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-300"><Utensils /></div>
                                                    )}
                                                </div>
                                                {/* Menü Detayı */}
                                                <div className="flex-1 py-1">
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <h4 className={`text-xl font-bold text-stone-900 group-hover:text-[#8AD7D6] transition-colors ${playfair.className}`}>{item.title}</h4>
                                                        <div className="flex-1 mx-4 border-b-2 border-dotted border-stone-300 opacity-50"></div>
                                                        <div className={`text-xl font-bold text-stone-900 ${inter.className}`}>
                                                            {item.price.toFixed(0)}<span className="text-sm align-top ml-0.5">₺</span>
                                                        </div>
                                                    </div>
                                                    {item.description && <p className={`text-stone-500 text-base leading-relaxed ${patrick.className}`}>{item.description}</p>}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.section>
                    )}

                </div>
            </div>
            <Footer />
        </main>
    )
}

// --- YARDIMCI BİLEŞENLER (Temiz Kod İçin) ---

// Bilgi Satırı
const InfoItem = ({ icon: Icon, title, content, isLink, href }: { icon: any, title: string, content: string, isLink?: boolean, href?: string }) => {
    const Wrapper = isLink ? 'a' : 'div';
    const props = isLink ? { href, className: "group/link block" } : {};

    return (
        <Wrapper {...props}>
            <div className="flex items-start gap-4">
                <div className="mt-1">
                    <Icon className={`w-5 h-5 text-stone-400 ${isLink ? 'group-hover/link:text-[#8AD7D6]' : ''} transition-colors`} />
                </div>
                <div>
                    <p className={`text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 ${inter.className}`}>{title}</p>
                    <p className={`text-stone-800 leading-relaxed text-lg font-medium ${isLink ? 'group-hover/link:text-[#8AD7D6] transition-colors' : ''} ${inter.className}`}>
                        {content}
                    </p>
                </div>
            </div>
        </Wrapper>
    )
}

// Slider Butonu
const SliderButton = ({ direction, onClick }: { direction: 'left' | 'right', onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`absolute ${direction === 'left' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-stone-900 rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100`}
    >
        {direction === 'left' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
    </button>
)

// Yükleniyor Ekranı (Premium)
const LoadingState = () => (
    <main className="min-h-screen bg-[#fffcf8]">
        <Header />
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#8AD7D6] rounded-full animate-spin"></div>
            </div>
            <p className={`text-stone-500 font-medium mt-6 tracking-wide animate-pulse ${inter.className}`}>Şube detayları yükleniyor...</p>
        </div>
    </main>
)

// Hata Ekranı (Premium)
const ErrorState = ({ error }: { error: string | null }) => (
    <main className="min-h-screen bg-[#fffcf8]">
        <Header />
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-red-50 mb-6 shadow-sm ring-4 ring-red-50/50">
                <Store className="w-10 h-10 text-red-400" />
            </div>
            <h1 className={`text-5xl font-bold mb-4 text-stone-900 ${playfair.className}`}>Şube Bulunamadı</h1>
            <p className="text-stone-500 mb-10 max-w-md mx-auto text-lg leading-relaxed">{error || "Aradığınız lezzet durağına şu anda ulaşılamıyor."}</p>
            <Link href="/subeler">
                <Button className="bg-stone-900 hover:bg-[#8AD7D6] text-white rounded-full px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all group">
                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                    Diğer Şubelere Göz At
                </Button>
            </Link>
        </div>
        <Footer />
    </main>
)