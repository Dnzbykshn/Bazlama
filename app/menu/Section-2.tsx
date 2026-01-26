"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, type Variants, AnimatePresence } from "framer-motion"
import { Flower2, ChevronDown, ChevronUp, Star, ArrowUpRight, X, Sparkles, Utensils, ChefHat } from "lucide-react"
import { Caveat, Patrick_Hand, Playfair_Display, Inter } from "next/font/google"

// --- FONTLAR ---
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] })
const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: ["400"] })
const playfair = Playfair_Display({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"] })

// --- TİPLER ---
interface UnlimitedMenu {
  id: string
  title: string
  price: number
  description: string | null
}

interface UnlimitedMenuItem {
  id: string
  title: string
  description: string | null
  image_url: string | null
  category: string
}

// --- ANİMASYONLAR ---
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 0.5, type: "spring", stiffness: 120, damping: 20 } 
  },
  exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: { duration: 0.3 } 
  }
}

// --- MENU DETAY MODALI ---
const MenuDetailModal = ({ item, isOpen, onClose }: { item: UnlimitedMenuItem | null, isOpen: boolean, onClose: () => void }) => {
    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-stone-950/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#fffcf8] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative border border-white"
                        >
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all border border-stone-100 shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex flex-col">
                                <div className="relative h-72 w-full bg-stone-100 group">
                                    {item.image_url ? (
                                        <Image src={item.image_url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl text-stone-300">🍽️</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>
                                    
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-4 py-1.5 bg-[#8AD7D6] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg border border-white/20 backdrop-blur-sm flex items-center gap-2">
                                            <Sparkles size={12} />
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 pt-10 relative">
                                    <h3 className={`text-4xl font-bold text-slate-800 mb-3 leading-tight ${playfair.className}`}>
                                        {item.title}
                                    </h3>
                                    
                                    <div className="w-20 h-1.5 bg-[#8AD7D6]/20 rounded-full mb-6">
                                        <div className="w-1/2 h-full bg-[#8AD7D6] rounded-full"></div>
                                    </div>

                                    <p className={`text-slate-600 text-xl leading-relaxed ${patrickHand.className}`}>
                                        {item.description || "Bu lezzet için henüz detaylı açıklama eklenmedi, ama tadına doyamayacağınız kesin!"}
                                    </p>

                                    <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-400 font-medium uppercase tracking-wider">Afiyet Olsun</span>
                                        <button 
                                            onClick={onClose}
                                            className="px-8 py-3 bg-[#8AD7D6] text-white rounded-full font-bold shadow-lg hover:bg-[#7acaca] hover:shadow-[#8AD7D6]/30 hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            Kapat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// --- KART BİLEŞENİ (DÜZELTİLMİŞ) ---
const MenuItemCard = ({ item, onOpenModal }: { item: UnlimitedMenuItem, onOpenModal: (item: UnlimitedMenuItem) => void }) => {
    // Açıklama kısaltma
    const CHAR_LIMIT = 70; 
    const description = item.description || "";
    const displayText = description.length > CHAR_LIMIT ? description.slice(0, CHAR_LIMIT) + "..." : description;

    return (
        <motion.div
            layout 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="group h-full pt-4 relative z-0" 
            onClick={() => onOpenModal(item)}
        >
            {/* GÖLGE KATMANI */}
            <div className="absolute inset-x-4 bottom-0 h-20 bg-[#8AD7D6]/20 blur-xl rounded-[2.5rem] -z-10 group-hover:bg-[#8AD7D6]/40 transition-all duration-500 translate-y-2 group-hover:translate-y-4"></div>

            {/* KART GÖVDESİ */}
            <div className={`relative h-full p-6 rounded-[2.5rem] bg-white border-2 border-stone-50/50 hover:border-[#8AD7D6]/30 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(138,215,214,0.3)] transition-all duration-500 cursor-pointer flex flex-col overflow-hidden hover:-translate-y-1`}>
                
                {/* İÇ DOKU (Silik Şef Şapkası) */}
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform -rotate-12 group-hover:rotate-0 scale-150 pointer-events-none text-stone-800">
                    <ChefHat size={200} strokeWidth={1} />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f8fffe] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full">
                    
                    {/* ÜST: Kategori */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#8AD7D6]/30 text-[11px] font-bold tracking-widest text-[#6fb3b2] uppercase shadow-sm group-hover:bg-[#8AD7D6] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                            <Sparkles size={12} />
                            {item.category}
                        </div>
                        <Flower2 className="w-5 h-5 opacity-30 text-[#8AD7D6] group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500" />
                    </div>

                    <div className="flex gap-6 items-center mb-5">
                        {/* RESİM ALANI */}
                        <div className="relative flex-shrink-0 w-28 h-28">
                            {/* Çerçeve (Boyutu ayarlandı ve arkada) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 -z-10 opacity-50 group-hover:opacity-80 group-hover:rotate-[20deg] transition-all duration-700 ease-in-out">
                                <Image src="/urun-cerceve-yeni.svg" alt="frame" fill className="object-contain" />
                            </div>
                            
                            {/* Resim */}
                            <div className="absolute inset-0 m-1 rounded-full overflow-hidden border-[4px] border-white shadow-lg bg-white group-hover:scale-105 transition-transform duration-500">
                                {item.image_url ? (
                                    <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">🥞</div>
                                )}
                            </div>
                        </div>

                        {/* BAŞLIK */}
                        <h3 className={`flex-1 text-[1.6rem] font-bold text-slate-800 leading-tight group-hover:text-[#8AD7D6] transition-colors duration-300 drop-shadow-sm ${caveat.className} break-words`}>
                            {item.title}
                        </h3>
                    </div>

                    {/* AÇIKLAMA (Taşmayı önleyen class'lar eklendi) */}
                    <p className={`text-slate-500 text-lg leading-7 flex-1 mb-6 break-words line-clamp-3 ${patrickHand.className}`}>
                        {item.description || "Özel tarifimizle hazırlanan bu eşsiz lezzeti mutlaka denemelisiniz."}
                    </p>

                    {/* ALT BAR */}
                    <div className="flex justify-end mt-auto">
                        <div className="group/btn flex items-center gap-2 text-[#8AD7D6] font-bold text-sm transition-all duration-300 hover:text-[#6fb3b2]">
                            <span className="border-b-2 border-transparent group-hover/btn:border-[#8AD7D6] transition-all">İncele</span>
                            <div className="w-8 h-8 rounded-full bg-[#8AD7D6]/10 flex items-center justify-center group-hover/btn:bg-[#8AD7D6] group-hover/btn:text-white transition-all">
                                <ArrowUpRight size={16} className="group-hover/btn:rotate-45 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// --- ANA BİLEŞEN ---
export function Section2() {
  const [menu, setMenu] = useState<UnlimitedMenu | null>(null)
  const [menuItems, setMenuItems] = useState<UnlimitedMenuItem[]>([])
  const [loading, setLoading] = useState(true)

  const INITIAL_COUNT = 6
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  
  const [selectedItem, setSelectedItem] = useState<UnlimitedMenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const openModal = (item: UnlimitedMenuItem) => {
      setSelectedItem(item)
      setIsModalOpen(true)
  }

  const closeModal = () => {
      setIsModalOpen(false)
      setTimeout(() => setSelectedItem(null), 300)
  }

  const handleToggleShow = () => {
      if (visibleCount >= menuItems.length) {
          // Kapatırken (Daha Az Göster)
          setVisibleCount(INITIAL_COUNT)
          // Yumuşakça listenin başına kaydır
          if (gridRef.current) {
              const y = gridRef.current.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top: y, behavior: 'smooth' });
          }
      } else {
          // Açarken (Daha Fazla Göster)
          setVisibleCount(prev => Math.min(prev + 6, menuItems.length))
      }
  }

  useEffect(() => {
    async function fetchUnlimitedMenu() {
      try {
        setLoading(true)
        if (!isSupabaseConfigured) {
          // MOCK DATA (Uzun metin testi için güncellendi)
          setMenu({ id: "1", title: "Sınırsız Serpme Kahvaltı", price: 1150.00, description: "Çay dahil, kişi başı sınırsız mutluluk." })
          const mockItems = [
            { id: "1", title: "Evden Patatesli Yumurta", description: "Sahanda, anne eli değmiş gibi sıcacık ve samimi bir lezzet.", image_url: "/images/image.png", category: "Sıcaklar" },
            { id: "2", title: "Peynir Şöleni", description: "Ezine, Tulum, Kaşar ve Çeçil peynirlerinin muhteşem uyumu.", image_url: "/images/image.png", category: "Kahvaltılık" },
            { id: "3", title: "Ege Usulü Limonlu Kabak", description: "Dereotu ve zeytinyağı ile hafifletilmiş ferah lezzet.", image_url: "/images/image.png", category: "Zeytinyağlı" },
            { id: "4", title: "Pofuduk Pişi", description: "Yağ çekmeyen, bulut gibi hafif, yanında reçelle harika gider.", image_url: "/images/image.png", category: "Hamur İşi" },
            { id: "5", title: "Anne Reçelleri", description: "Mevsim meyvelerinden katkısız ev yapımı reçeller.", image_url: "/images/image.png", category: "Tatlı" },
            { id: "6", title: "Kasap Sucuk", description: "Özel baharat karışımıyla hazırlanan dana sucuk.", image_url: "/images/image.png", category: "Sıcaklar" },
            { id: "7", title: "Menemen", description: "Domates ve biberin muhteşem uyumu.", image_url: "/images/image.png", category: "Sıcaklar" },
            { id: "8", title: "Bal Kaymak", description: "Doğal petek bal ve manda kaymağı.", image_url: "/images/image.png", category: "Kahvaltılık" },
            { id: "9", title: "Sigara Böreği", description: "Çıtır çıtır, peynirli.", image_url: "/images/image.png", category: "Ara Sıcak" },
            { id: "10", title: "Sahanda Yumurta", description: "Tereyağlı, köy yumurtası.", image_url: "/images/image.png", category: "Sıcaklar" },
            { id: "11", title: "Acuka", description: "Cevizli, baharatlı kahvaltılık sos.", image_url: "/images/image.png", category: "Meze" },
            { id: "12", title: "Sınırsız Çay", description: "Taze demlenmiş Rize çayı.", image_url: "/images/image.png", category: "İçecek" },
          ];
          setMenuItems(mockItems as UnlimitedMenuItem[])
          setLoading(false)
          return
        }
        
        const { data: menuData } = await supabase.from("unlimited_menu").select("*").eq("active", true).limit(1).single()
        if (menuData) {
          setMenu(menuData)
          const { data: itemsData } = await supabase.from("unlimited_menu_items").select("*").eq("menu_id", menuData.id).order("position", { ascending: true })
          
          // Kategori veritabanından geliyorsa onu kullan, yoksa varsayılan ata
          const defaultCategories = ["Sıcaklar", "Kahvaltılık", "Zeytinyağlı", "Hamur İşi", "Tatlı", "İçecek"];
          const enhancedItems = (itemsData || []).map((item, index) => ({
             ...item,
             category: item.category || defaultCategories[index % defaultCategories.length] 
          })) as UnlimitedMenuItem[]
          
          setMenuItems(enhancedItems)
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchUnlimitedMenu()
  }, [])

  const visibleItems = menuItems.slice(0, visibleCount);
  const isAllVisible = visibleCount >= menuItems.length;

  return (
    <section id="sinirsiz-menu" className="relative py-24 px-4 overflow-hidden" ref={gridRef} 
        style={{ background: 'radial-gradient(circle at center top, #fffcf8, #fff)' }}
    >
        {/* Çok hafif nokta dokusu */}
        <div className="absolute inset-0 bg-[url('/dots.png')] opacity-[0.02] pointer-events-none" style={{ backgroundSize: '20px' }}></div>

        <MenuDetailModal item={selectedItem} isOpen={isModalOpen} onClose={closeModal} />

        <div className="container mx-auto max-w-7xl relative z-10">
            {/* ÜST BÖLÜM */}
            <div className="text-center mb-24 relative">
                {menu && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.8, y: 20 }}
                     whileInView={{ opacity: 1, scale: 1, y: 0 }}
                     whileHover={{ scale: 1.05 }}
                     transition={{ type: "spring", stiffness: 300 }}
                     className="inline-block mb-8 relative group cursor-pointer z-20"
                   >
                      <div className="absolute inset-0 bg-[#8AD7D6] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-[#8AD7D6] to-[#7acaca] text-white px-12 py-4 rounded-full shadow-xl flex items-baseline gap-3 border-[3px] border-white ring-2 ring-[#8AD7D6]/20">
                          <span className={`text-6xl font-bold ${caveat.className} drop-shadow-sm`}>{menu.price}</span>
                          <div className="flex flex-col items-start leading-none">
                              <span className="text-2xl font-bold">TL</span>
                              <span className="text-sm font-medium opacity-90 tracking-wider uppercase font-sans">Kişi Başı</span>
                          </div>
                      </div>
                      <Star className="absolute -top-4 -right-4 w-10 h-10 text-yellow-300 fill-yellow-300 drop-shadow-md animate-pulse" />
                   </motion.div>
                )}
                
                <div className="relative py-4">
                    <h2 className={`text-6xl md:text-8xl font-bold text-slate-800 px-6 pb-4 drop-shadow-sm ${playfair.className}`}>
                        {menu?.title || "Sınırsız Lezzet İçeriği"}
                    </h2>
                    <div className="flex justify-center mt-2 opacity-60 text-[#8AD7D6]">
                        <svg width="250" height="20" viewBox="0 0 200 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 7.5C40 2.5 60 12.5 100 7.5C140 2.5 160 12.5 197.5 7.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                
                {menu?.description && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`mt-8 text-2xl md:text-3xl text-slate-500 max-w-2xl mx-auto leading-relaxed ${patrickHand.className}`}
                    >
                        {menu.description}
                    </motion.p>
                )}
            </div>

            {/* IZGARA (GRID) */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 rounded-[2.5rem] bg-slate-100" />)}
                </div>
            ) : (
                <>
                    <motion.div 
                        layout 
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-14 pb-10 px-2"
                    >
                        <AnimatePresence mode="popLayout">
                            {visibleItems.map((item) => (
                                <MenuItemCard 
                                    key={item.id} 
                                    item={item} 
                                    onOpenModal={openModal} 
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* BUTON */}
                    {menuItems.length > INITIAL_COUNT && (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex justify-center mt-16"
                        >
                            <button 
                                onClick={handleToggleShow}
                                className="group relative px-12 py-5 bg-white border-2 border-[#8AD7D6] text-[#8AD7D6] rounded-full text-xl font-bold shadow-xl hover:bg-[#8AD7D6] hover:text-white transition-all duration-300 flex items-center gap-3 hover:shadow-[#8AD7D6]/50 hover:-translate-y-1 active:translate-y-0"
                            >
                                <span className={inter.className}>{isAllVisible ? "Daha Az Göster" : "Daha Fazla Göster"}</span>
                                {isAllVisible ? (
                                    <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                                )}
                            </button>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    </section>
  )
}