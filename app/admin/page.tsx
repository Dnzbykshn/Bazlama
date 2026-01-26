"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, User, Calendar, CheckCircle2, LogOut, Image as ImageIcon, Upload, Trash2, GripVertical, Building2, Phone, MapPin, Edit, Plus, X, Store, FileText, ExternalLink, Utensils, Star, TrendingUp, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Message {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  created_at: string
  read: boolean
}

interface GalleryItem {
  id: string
  image_url: string
  title: string | null
  description: string | null
  category: string | null
  hero_section: boolean
  hero_main: boolean
  created_at: string
  position: number | null
}

const GALLERY_CATEGORIES = [
  { value: "Kahvaltı", label: "Kahvaltı" },
  { value: "Mekan", label: "Mekan" },
  { value: "Lezzetler", label: "Lezzetler" },
  { value: "Atmosfer", label: "Atmosfer" },
]

interface FranchiseApplication {
  id: string
  name: string
  email: string
  phone: string
  city: string
  city_district: string | null
  birth_year: string | null
  job_status: string | null
  target_city: string | null
  location_type: string | null
  has_food_beverage_experience: boolean | null
  experience_description: string | null
  has_location: boolean | null
  location_area: string | null
  seating_capacity: string | null
  has_outdoor_area: boolean | null
  investment_budget: string | null
  opening_timeline: string | null
  operator_type: string | null
  motivation: string | null
  additional_notes: string | null
  kvkk_consent: boolean
  investment_amount: string | null
  experience: string | null
  message: string | null
  created_at: string
  read: boolean
}

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
  working_hours: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  } | null
  latitude: number | null
  longitude: number | null
  map_url: string | null
  created_at: string
  updated_at: string
}

interface BranchMenuItem {
  id: string
  branch_id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  position: number | null
  created_at: string
  updated_at: string
}

interface AboutPage {
  id: string
  hero_badge: string | null
  hero_title: string | null
  hero_description: string | null
  story_image_url: string | null
  story_title: string | null
  story_content_paragraph1: string | null
  story_content_paragraph2: string | null
  values_title: string | null
  values_subtitle: string | null
  value1_title: string | null
  value1_desc: string | null
  value2_title: string | null
  value2_desc: string | null
  value3_title: string | null
  value3_desc: string | null
  mission_title: string | null
  mission_content_paragraph1: string | null
  mission_content_paragraph2: string | null
  mission_image_url: string | null
  vision_title: string | null
  vision_content_paragraph1: string | null
  vision_content_paragraph2: string | null
  vision_image_url: string | null
  franchise_title: string | null
  franchise_description: string | null
  franchise_button_text: string | null
  created_at: string
  updated_at: string
}

interface UnlimitedMenu {
  id: string
  title: string
  price: number
  description: string | null
  active: boolean
  created_at: string
  updated_at: string
}

interface UnlimitedMenuItem {
  id: string
  menu_id: string
  title: string
  description: string | null
  image_url: string | null
  category: string | null
  position: number | null
  featured: boolean
  created_at: string
  updated_at: string
}

// Menü kategorileri
const MENU_CATEGORIES = [
  { value: "Sıcaklar", label: "Sıcaklar" },
  { value: "Kahvaltılık", label: "Kahvaltılık" },
  { value: "Zeytinyağlı", label: "Zeytinyağlı" },
  { value: "Hamur İşi", label: "Hamur İşi" },
  { value: "Tatlı", label: "Tatlı" },
  { value: "İçecek", label: "İçecek" },
  { value: "Ara Sıcak", label: "Ara Sıcak" },
  { value: "Meze", label: "Meze" },
  { value: "Diğer", label: "Diğer" },
]

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [franchiseApplications, setFranchiseApplications] = useState<FranchiseApplication[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null)
  const [unlimitedMenu, setUnlimitedMenu] = useState<UnlimitedMenu | null>(null)
  const [unlimitedMenuItems, setUnlimitedMenuItems] = useState<UnlimitedMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [franchiseLoading, setFranchiseLoading] = useState(true)
  const [branchLoading, setBranchLoading] = useState(true)
  const [aboutLoading, setAboutLoading] = useState(true)
  const [menuLoading, setMenuLoading] = useState(true)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [showMenuItemForm, setShowMenuItemForm] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<UnlimitedMenuItem | null>(null)
  const [activeTab, setActiveTab] = useState("iletisim")
  const [messageFilter, setMessageFilter] = useState<"all" | "unread">("all")
  const [franchiseFilter, setFranchiseFilter] = useState<"all" | "unread">("all")
  const [branchFilter, setBranchFilter] = useState<"all" | "active" | "inactive">("all")
  const [uploading, setUploading] = useState(false)
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>("Kahvaltı")
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [showBranchForm, setShowBranchForm] = useState(false)
  const [showAboutForm, setShowAboutForm] = useState(false)
  const [showBranchGallery, setShowBranchGallery] = useState(false)
  const [selectedBranchForGallery, setSelectedBranchForGallery] = useState<Branch | null>(null)
  const [menuForm, setMenuForm] = useState({ title: "", price: "", description: "" })
  const [menuSaving, setMenuSaving] = useState(false)
  const [googleRating, setGoogleRating] = useState("5.0")
  const [googleReviewCount, setGoogleReviewCount] = useState("120+")
  const [ratingSaving, setRatingSaving] = useState(false)
  const [workingHoursWeekday, setWorkingHoursWeekday] = useState("08:00 - 22:00")
  const [workingHoursWeekend, setWorkingHoursWeekend] = useState("08:00 - 23:00")
  const [workingHoursSaving, setWorkingHoursSaving] = useState(false)
  const [franchiseActiveBranches, setFranchiseActiveBranches] = useState("12+")
  const [franchiseYearlyGuests, setFranchiseYearlyGuests] = useState("500K+")
  const [franchiseInvestmentReturn, setFranchiseInvestmentReturn] = useState("%100")
  const [franchiseStatsSaving, setFranchiseStatsSaving] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.push("/admin/login")
  }

  async function fetchSiteSettings() {
    try {
      const { data: ratingData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "google_rating")
        .single()
      
      const { data: countData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "google_review_count")
        .single()

      const { data: weekdayData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "working_hours_weekday")
        .single()

      const { data: weekendData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "working_hours_weekend")
        .single()
      
      // Franchise istatistikleri
      const { data: branchesData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "franchise_active_branches")
        .single()

      const { data: guestsData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "franchise_yearly_guests")
        .single()

      const { data: returnData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "franchise_investment_return")
        .single()
      
      if (ratingData) setGoogleRating(ratingData.value)
      if (countData) setGoogleReviewCount(countData.value)
      if (weekdayData) setWorkingHoursWeekday(weekdayData.value)
      if (weekendData) setWorkingHoursWeekend(weekendData.value)
      if (branchesData) setFranchiseActiveBranches(branchesData.value)
      if (guestsData) setFranchiseYearlyGuests(guestsData.value)
      if (returnData) setFranchiseInvestmentReturn(returnData.value)
    } catch (error) {
      console.error("Error fetching site settings:", error)
    }
  }

  async function handleSaveFranchiseStats() {
    setFranchiseStatsSaving(true)
    try {
      await supabase
        .from("site_settings")
        .update({ value: franchiseActiveBranches, updated_at: new Date().toISOString() })
        .eq("key", "franchise_active_branches")
      
      await supabase
        .from("site_settings")
        .update({ value: franchiseYearlyGuests, updated_at: new Date().toISOString() })
        .eq("key", "franchise_yearly_guests")

      await supabase
        .from("site_settings")
        .update({ value: franchiseInvestmentReturn, updated_at: new Date().toISOString() })
        .eq("key", "franchise_investment_return")
      
      alert("Franchise istatistikleri başarıyla kaydedildi!")
    } catch (error) {
      console.error("Error saving franchise stats:", error)
      alert("Kaydetme sırasında bir hata oluştu")
    } finally {
      setFranchiseStatsSaving(false)
    }
  }

  async function handleSaveWorkingHours() {
    setWorkingHoursSaving(true)
    try {
      await supabase
        .from("site_settings")
        .update({ value: workingHoursWeekday, updated_at: new Date().toISOString() })
        .eq("key", "working_hours_weekday")
      
      await supabase
        .from("site_settings")
        .update({ value: workingHoursWeekend, updated_at: new Date().toISOString() })
        .eq("key", "working_hours_weekend")
      
      alert("Çalışma saatleri başarıyla kaydedildi!")
    } catch (error) {
      console.error("Error saving working hours:", error)
      alert("Kaydetme sırasında bir hata oluştu")
    } finally {
      setWorkingHoursSaving(false)
    }
  }

  async function handleSaveRating() {
    setRatingSaving(true)
    try {
      await supabase
        .from("site_settings")
        .update({ value: googleRating, updated_at: new Date().toISOString() })
        .eq("key", "google_rating")
      
      await supabase
        .from("site_settings")
        .update({ value: googleReviewCount, updated_at: new Date().toISOString() })
        .eq("key", "google_review_count")
      
      alert("Puanlama başarıyla kaydedildi!")
    } catch (error) {
      console.error("Error saving rating:", error)
      alert("Kaydetme sırasında bir hata oluştu")
    } finally {
      setRatingSaving(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    fetchGallery()
    fetchFranchiseApplications()
    fetchBranches()
    fetchAboutPage()
    fetchUnlimitedMenu()
    fetchSiteSettings()
  }, [])

  // Realtime abonelik - Mesajlar ve Franchise başvuruları için
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Mesajlar için realtime abonelik
    const messagesChannel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('Messages change:', payload);
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new as Message, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.new.id ? payload.new as Message : msg
            ));
          }
        }
      )
      .subscribe();

    // Franchise başvuruları için realtime abonelik
    const franchiseChannel = supabase
      .channel('franchise-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'franchise_applications' },
        (payload) => {
          console.log('Franchise change:', payload);
          if (payload.eventType === 'INSERT') {
            setFranchiseApplications(prev => [payload.new as FranchiseApplication, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setFranchiseApplications(prev => prev.filter(app => app.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setFranchiseApplications(prev => prev.map(app => 
              app.id === payload.new.id ? payload.new as FranchiseApplication : app
            ));
          }
        }
      )
      .subscribe();

    // Cleanup - bileşen unmount olduğunda abonelikleri kaldır
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(franchiseChannel);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "galeri") {
      fetchGallery()
    } else if (activeTab === "franchise") {
      fetchFranchiseApplications()
    } else if (activeTab === "subeler") {
      fetchBranches()
    } else if (activeTab === "bizi-taniyin") {
      fetchAboutPage()
    } else if (activeTab === "menu") {
      fetchUnlimitedMenu()
    }
  }, [activeTab])

  async function fetchMessages() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(messageId: string) {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", messageId)

      if (error) throw error
      fetchMessages()
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  async function deleteMessage(messageId: string) {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return
    
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId)

      if (error) {
        console.error("Delete error:", error)
        alert("Mesaj silinirken bir hata oluştu: " + error.message)
        return
      }
      
      // Listeyi güncelle
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
    } catch (error: any) {
      console.error("Error deleting message:", error)
      alert("Mesaj silinirken bir hata oluştu")
    }
  }

  async function fetchFranchiseApplications() {
    try {
      setFranchiseLoading(true)
      const { data, error } = await supabase
        .from("franchise_applications")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setFranchiseApplications(data || [])
    } catch (error) {
      console.error("Error fetching franchise applications:", error)
    } finally {
      setFranchiseLoading(false)
    }
  }

  async function markFranchiseAsRead(applicationId: string) {
    try {
      const { error } = await supabase
        .from("franchise_applications")
        .update({ read: true })
        .eq("id", applicationId)

      if (error) throw error
      fetchFranchiseApplications()
    } catch (error) {
      console.error("Error marking franchise as read:", error)
    }
  }

  async function deleteFranchiseApplication(applicationId: string) {
    if (!confirm("Bu başvuruyu silmek istediğinizden emin misiniz?")) return
    
    try {
      const { error } = await supabase
        .from("franchise_applications")
        .delete()
        .eq("id", applicationId)

      if (error) {
        console.error("Delete error:", error)
        alert("Başvuru silinirken bir hata oluştu: " + error.message)
        return
      }
      
      // Listeyi güncelle
      setFranchiseApplications(prev => prev.filter(app => app.id !== applicationId))
    } catch (error: any) {
      console.error("Error deleting franchise application:", error)
      alert("Başvuru silinirken bir hata oluştu")
    }
  }

  async function fetchBranches() {
    try {
      setBranchLoading(true)
      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setBranches(data || [])
    } catch (error) {
      console.error("Error fetching branches:", error)
    } finally {
      setBranchLoading(false)
    }
  }

  async function fetchUnlimitedMenu() {
    try {
      setMenuLoading(true)
      const { data: menuData, error: menuError } = await supabase
        .from("unlimited_menu")
        .select("*")
        .eq("active", true)
        .limit(1)
        .single()

      if (menuError && menuError.code !== "PGRST116") throw menuError
      
      if (menuData) {
        setUnlimitedMenu(menuData)
        setMenuForm({
          title: menuData.title || "",
          price: menuData.price?.toString() || "",
          description: menuData.description || ""
        })
        const { data: itemsData, error: itemsError } = await supabase
          .from("unlimited_menu_items")
          .select("*")
          .eq("menu_id", menuData.id)
          .order("position", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false })

        if (itemsError) throw itemsError
        setUnlimitedMenuItems(itemsData || [])
      } else {
        const { data: newMenu, error: createError } = await supabase
          .from("unlimited_menu")
          .insert([{
            title: "Sınırsız Kahvaltı",
            price: 1150.00,
            description: "Kahvaltıya çay dahil, kişi başı sınırsızdır.",
            active: true
          }])
          .select()
          .single()

        if (createError) throw createError
        setUnlimitedMenu(newMenu)
        setMenuForm({
          title: newMenu.title || "",
          price: newMenu.price?.toString() || "",
          description: newMenu.description || ""
        })
        setUnlimitedMenuItems([])
      }
    } catch (error) {
      console.error("Error fetching unlimited menu:", error)
    } finally {
      setMenuLoading(false)
    }
  }

  async function handleSaveMenuSettings() {
    if (!unlimitedMenu) return
    const price = parseFloat(menuForm.price)
    if (isNaN(price) || price <= 0) {
      alert("Lütfen geçerli bir fiyat girin")
      return
    }
    try {
      setMenuSaving(true)
      const { error } = await supabase
        .from("unlimited_menu")
        .update({ 
          title: menuForm.title,
          price: price,
          description: menuForm.description || null,
          updated_at: new Date().toISOString() 
        })
        .eq("id", unlimitedMenu.id)
      if (error) throw error
      fetchUnlimitedMenu()
      alert("Menü ayarları başarıyla kaydedildi!")
    } catch (error) {
      console.error("Error updating menu settings:", error)
      alert("Menü ayarları güncellenirken bir hata oluştu")
    } finally {
      setMenuSaving(false)
    }
  }

  async function handleUploadMenuItemImage(e: React.ChangeEvent<HTMLInputElement>, itemId?: string): Promise<string | undefined> {
    const file = e.target.files?.[0]
    if (!file || !unlimitedMenu) return undefined
    try {
      setUploading(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `menu-items/${fileName}`
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file)
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)
      if (itemId) {
        const { error } = await supabase
          .from("unlimited_menu_items")
          .update({ image_url: urlData.publicUrl })
          .eq("id", itemId)
        if (error) throw error
        fetchUnlimitedMenu()
        return urlData.publicUrl
      }
      return urlData.publicUrl
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(`Hata: ${error?.message || "Görsel yüklenirken bir hata oluştu"}`)
      return undefined
    } finally {
      setUploading(false)
    }
  }

  async function handleCreateMenuItem(title: string, description: string, imageUrl: string | null, category: string | null, featured: boolean) {
    if (!unlimitedMenu) return
    try {
      const maxPosition = unlimitedMenuItems.length > 0 
        ? Math.max(...unlimitedMenuItems.map(item => item.position || 0))
        : 0
      const { error } = await supabase
        .from("unlimited_menu_items")
        .insert([{
          menu_id: unlimitedMenu.id,
          title,
          description: description || null,
          image_url: imageUrl,
          category: category || null,
          featured: featured,
          position: maxPosition + 1
        }])
      if (error) throw error
      fetchUnlimitedMenu()
      setShowMenuItemForm(false)
      setEditingMenuItem(null)
    } catch (error: any) {
      console.error("Error creating menu item:", error)
      alert(`Hata: ${error?.message || "Menü öğesi eklenirken bir hata oluştu"}`)
    }
  }

  async function handleUpdateMenuItem(id: string, title: string, description: string, imageUrl: string | null, category: string | null, featured: boolean) {
    try {
      const { error } = await supabase
        .from("unlimited_menu_items")
        .update({
          title,
          description: description || null,
          image_url: imageUrl,
          category: category || null,
          featured: featured,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
      if (error) throw error
      fetchUnlimitedMenu()
      setShowMenuItemForm(false)
      setEditingMenuItem(null)
    } catch (error: any) {
      console.error("Error updating menu item:", error)
      alert(`Hata: ${error?.message || "Menü öğesi güncellenirken bir hata oluştu"}`)
    }
  }

  async function handleDeleteMenuItem(id: string, imageUrl: string | null) {
    if (!confirm("Bu menü öğesini silmek istediğinize emin misiniz?")) return
    try {
      if (imageUrl) {
        const urlParts = imageUrl.split("/")
        const filePath = urlParts.slice(urlParts.indexOf("menu-items")).join("/")
        await supabase.storage.from("images").remove([filePath])
      }
      const { error } = await supabase
        .from("unlimited_menu_items")
        .delete()
        .eq("id", id)
      if (error) throw error
      fetchUnlimitedMenu()
    } catch (error: any) {
      console.error("Error deleting menu item:", error)
      alert("Menü öğesi silinirken bir hata oluştu")
    }
  }

  async function fetchAboutPage() {
    try {
      setAboutLoading(true)
      const { data, error } = await supabase
        .from("about_page")
        .select("*")
        .limit(1)
        .single()

      if (error) {
        // Eğer kayıt yoksa, varsayılan bir kayıt oluştur
        if (error.code === "PGRST116") {
          const defaultData = {
            id: "00000000-0000-0000-0000-000000000001",
            hero_badge: "Hikayemiz",
            hero_title: "Bizi Tanıyın",
            hero_description: "Geleneksel Türk kahvaltısının en özel halini, modern bir dokunuş ve sonsuz bir sevgiyle harmanlıyoruz.",
            story_title: "Soframızın Hikayesi",
            story_content_paragraph1: "Pişi Kahvaltı, sadece bir kahvaltı mekanı değil; geleneksel Türk misafirperverliğinin vücut bulmuş halidir. Her sabah gün doğmadan başlayan hazırlığımız, annelerimizin tariflerine sadık kalarak devam ediyor.",
            story_content_paragraph2: 'Modern yaşamın koşuşturmacası içinde, "doymadan kalkmak yok" diyerek sizi yavaşlamaya, sevdiklerinizle uzun ve keyifli bir sofrayı paylaşmaya davet ediyoruz.',
            values_title: "Değerlerimiz",
            values_subtitle: "Bizi biz yapan özelliklerimiz",
            value1_title: "Tazelik",
            value1_desc: "Bahçeden sofraya, her zaman en taze ve doğal ürünler.",
            value2_title: "Gelenek",
            value2_desc: "Yüzyıllık tarifler, değişmeyen lezzetler ve özlenen tatlar.",
            value3_title: "Sevgi",
            value3_desc: "Ailenizle hissetmeniz için her detaya işlenen özen ve sevgi.",
            mission_title: "Misyonumuz",
            mission_content_paragraph1: '"Siz tamam diyene kadar, biz servise devam ediyoruz ;)" felsefesiyle yola çıktık. Amacımız sadece karnınızı doyurmak değil; gözünüzü ve gönlünüzü de doyurmak.',
            mission_content_paragraph2: "Her misafirimizin, kendi evinde hissettiği o sıcaklığı ve samimiyeti yaşamasını sağlamak bizim en büyük tutkumuz.",
            franchise_title: "Franchise Fırsatı",
            franchise_description: "Pişi Kahvaltı ailesine katılın ve kendi işinizin sahibi olun. Başarılı bir franchise sistemi ile yanınızdayız.",
            franchise_button_text: "Franchise Başvurusu Yap",
          }
          const { data: newData, error: insertError } = await supabase
            .from("about_page")
            .insert([defaultData])
            .select()
            .single()
          
          if (insertError) throw insertError
          setAboutPage(newData)
        } else {
          throw error
        }
      } else {
        setAboutPage(data)
      }
    } catch (error) {
      console.error("Error fetching about page:", error)
    } finally {
      setAboutLoading(false)
    }
  }

  async function handleDeleteBranch(id: string) {
    if (!confirm("Bu şubeyi silmek istediğinize emin misiniz?")) return

    try {
      const { error } = await supabase.from("branches").delete().eq("id", id)
      if (error) throw error
      fetchBranches()
    } catch (error) {
      console.error("Error deleting branch:", error)
      alert("Şube silinirken bir hata oluştu")
    }
  }

  async function handleToggleBranchActive(id: string, currentActive: boolean) {
    try {
      const { error } = await supabase
        .from("branches")
        .update({ active: !currentActive })
        .eq("id", id)
      if (error) throw error
      fetchBranches()
    } catch (error) {
      console.error("Error toggling branch active:", error)
      alert("Şube durumu güncellenirken bir hata oluştu")
    }
  }

  async function fetchGallery() {
    try {
      setGalleryLoading(true)
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("position", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      setGalleryItems(data || [])
    } catch (error) {
      console.error("Error fetching gallery:", error)
    } finally {
      setGalleryLoading(false)
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPendingImageFile(file)
    setPendingImagePreview(previewUrl)
    e.target.value = ""
  }

  function handleCancelPendingImage() {
    if (pendingImagePreview) {
      URL.revokeObjectURL(pendingImagePreview)
    }
    setPendingImageFile(null)
    setPendingImagePreview(null)
  }

  async function handleSaveGalleryImage() {
    if (!pendingImageFile) return

    try {
      setUploading(true)
      const fileExt = pendingImageFile.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `gallery/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, pendingImageFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)

      // Get max position to add new item at the end
      const { data: maxPosData } = await supabase
        .from("gallery")
        .select("position")
        .order("position", { ascending: false })
        .limit(1)
      
      const nextPosition = maxPosData && maxPosData[0]?.position !== null 
        ? (maxPosData[0].position as number) + 1 
        : 0

      // Insert into gallery table
      const { error: insertError } = await supabase.from("gallery").insert({
        image_url: urlData.publicUrl,
        title: null,
        category: selectedGalleryCategory,
        position: nextPosition,
      })

      if (insertError) throw insertError

      // Clear pending image
      handleCancelPendingImage()
      fetchGallery()
    } catch (error: any) {
      console.error("Error uploading image:", error)
      const errorMessage = error?.message || "Görsel yüklenirken bir hata oluştu"
      alert(`Hata: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteImage(id: string, imageUrl: string) {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return

    try {
      // Extract file path from URL
      const url = new URL(imageUrl)
      const pathParts = url.pathname.split("/")
      const filePath = pathParts.slice(pathParts.indexOf("gallery")).join("/")

      // Delete from storage
      await supabase.storage.from("images").remove([filePath])

      // Delete from database
      const { error } = await supabase.from("gallery").delete().eq("id", id)
      if (error) throw error

      fetchGallery()
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Görsel silinirken bir hata oluştu")
    }
  }

  async function handleToggleHeroSection(id: string, currentValue: boolean) {
    try {
      // Count current hero section images (excluding hero_main)
      const heroCount = galleryItems.filter(item => item.hero_section && !item.hero_main).length
      
      // If trying to add and already have 4, show warning
      if (!currentValue && heroCount >= 4) {
        alert("Küçük görsel olarak en fazla 4 görsel ekleyebilirsiniz. Önce mevcut görsellerden birini kaldırın.")
        return
      }

      const { error } = await supabase
        .from("gallery")
        .update({ hero_section: !currentValue })
        .eq("id", id)
      
      if (error) throw error
      
      // Update local state
      setGalleryItems(prev => prev.map(item => 
        item.id === id ? { ...item, hero_section: !currentValue } : item
      ))
    } catch (error) {
      console.error("Error toggling hero section:", error)
      alert("Görsel güncellenirken bir hata oluştu")
    }
  }

  async function handleToggleHeroMain(id: string) {
    try {
      // First, remove hero_main from all other items
      const { error: resetError } = await supabase
        .from("gallery")
        .update({ hero_main: false })
        .neq("id", id)
      
      if (resetError) throw resetError

      // Check if this item is already the main
      const currentItem = galleryItems.find(item => item.id === id)
      const newValue = !currentItem?.hero_main

      // Set this item as hero_main (or toggle off)
      const { error } = await supabase
        .from("gallery")
        .update({ hero_main: newValue })
        .eq("id", id)
      
      if (error) throw error
      
      // Update local state
      setGalleryItems(prev => prev.map(item => ({
        ...item,
        hero_main: item.id === id ? newValue : false
      })))
    } catch (error) {
      console.error("Error toggling hero main:", error)
      alert("Görsel güncellenirken bir hata oluştu")
    }
  }

  const [galleryOrderChanged, setGalleryOrderChanged] = useState(false)
  const [savingGalleryOrder, setSavingGalleryOrder] = useState(false)

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    setActiveId(null)
    setOverId(null)

    if (!over || active.id === over.id) return

    const oldIndex = galleryItems.findIndex((item) => item.id === active.id)
    const newIndex = galleryItems.findIndex((item) => item.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(galleryItems, oldIndex, newIndex)
      setGalleryItems(newItems)
      setGalleryOrderChanged(true)
    }
  }

  async function handleSaveGalleryOrder() {
    if (!galleryOrderChanged) return

    setSavingGalleryOrder(true)
    try {
      // Update all positions based on current array order
      const updates = galleryItems.map((item, index) => 
        supabase
          .from("gallery")
          .update({ position: index })
          .eq("id", item.id)
      )
      
      await Promise.all(updates)
      setGalleryOrderChanged(false)
      alert("Sıralama başarıyla kaydedildi!")
    } catch (error) {
      console.error("Error saving gallery order:", error)
      alert("Sıralama kaydedilirken bir hata oluştu")
    } finally {
      setSavingGalleryOrder(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Sortable Gallery Item Component
  function SortableGalleryItem({
    item,
    onDelete,
    onToggleHero,
    onToggleHeroMain,
    isOver,
  }: {
    item: GalleryItem
    onDelete: (id: string, imageUrl: string) => void
    onToggleHero: (id: string, currentValue: boolean) => void
    onToggleHeroMain: (id: string) => void
    isOver?: boolean
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id })

    const style = {
      transform: isDragging ? CSS.Transform.toString(transform) : undefined,
      transition: isDragging ? transition : undefined,
    }

    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`overflow-hidden transition-all duration-200 border-[#8AD7D6]/20 shadow-sm hover:shadow-md ${
          isDragging
            ? "opacity-30 scale-95"
            : isOver
            ? "ring-2 ring-[#8AD7D6] ring-offset-2 scale-105 shadow-xl border-[#8AD7D6]"
            : "opacity-100"
        }`}
      >
        <div className="relative aspect-square group">
          <Image
            src={item.image_url}
            alt={item.title || "Galeri görseli"}
            fill
            className="object-cover"
          />
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 cursor-grab active:cursor-grabbing hover:bg-white shadow-lg transition-colors z-10 border border-[#8AD7D6]/20"
          >
            <GripVertical className="w-5 h-5 text-[#022c22]/70" />
          </div>
          {item.hero_main && (
            <div className="absolute top-2 left-12 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              Ana Görsel
            </div>
          )}
          {item.hero_section && !item.hero_main && (
            <div className="absolute top-2 left-12 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Küçük
            </div>
          )}
          {item.category && (
            <div className="absolute top-2 right-2 bg-[#8AD7D6] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
              {item.category}
            </div>
          )}
          {isOver && (
            <div className="absolute inset-0 bg-[#8AD7D6]/20 border-2 border-dashed border-[#8AD7D6] rounded-lg flex items-center justify-center z-20">
              <div className="bg-[#022c22] text-white px-4 py-2 rounded-lg font-medium shadow-lg">
                Buraya Bırak
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-3 bg-white space-y-2">
          <Button
            variant={item.hero_main ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleHeroMain(item.id)}
            className={`w-full ${item.hero_main ? "bg-purple-600 hover:bg-purple-700" : ""}`}
          >
            <ImageIcon className={`w-4 h-4 mr-2`} />
            {item.hero_main ? "Ana Görsel ✓" : "Ana Görsel Yap"}
          </Button>
          <Button
            variant={item.hero_section ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleHero(item.id, item.hero_section)}
            className={`w-full ${item.hero_section && !item.hero_main ? "bg-amber-500 hover:bg-amber-600" : ""}`}
            disabled={item.hero_main}
          >
            <Star className={`w-4 h-4 mr-2 ${item.hero_section ? "fill-current" : ""}`} />
            {item.hero_section ? "Küçük Görsel ✓" : "Küçük Görsel Ekle"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(item.id, item.image_url)}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Sil
          </Button>
        </CardContent>
      </Card>
    )
  }

  const filteredMessages =
    messageFilter === "unread" ? messages.filter((m) => !m.read) : messages

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-[#e6f4f1] via-[#f0faf8] to-[#e6f4f1]">
        {/* Modern Header - Frontend Style */}
        <div className="bg-[#022c22] border-b-4 border-[#8AD7D6] shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 font-serif">
                  Pişi Kahvaltı
                  <span className="text-[#8AD7D6] ml-2 font-normal text-lg">Admin</span>
                </h1>
                <p className="text-[#8AD7D6]/70 text-sm">Yönetim paneline hoş geldiniz</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="flex items-center gap-2 border-[#8AD7D6]/50 text-white hover:bg-[#8AD7D6]/20 hover:border-[#8AD7D6]"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-[#8AD7D6]/20 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-[#8AD7D6]/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#022c22]/60 mb-1">Toplam Mesaj</p>
                    <p className="text-2xl font-bold text-[#022c22]">{messages.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#8AD7D6]/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#8AD7D6]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#8AD7D6]/20 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-[#8AD7D6]/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#022c22]/60 mb-1">Okunmamış</p>
                    <p className="text-2xl font-bold text-[#022c22]">{messages.filter((m) => !m.read).length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#8AD7D6]/20 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-[#8AD7D6]/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#022c22]/60 mb-1">Franchise Başvuru</p>
                    <p className="text-2xl font-bold text-[#022c22]">{franchiseApplications.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#8AD7D6]/20 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-[#8AD7D6]/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#022c22]/60 mb-1">Aktif Şubeler</p>
                    <p className="text-2xl font-bold text-[#022c22]">{branches.filter((b) => b.active).length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#8AD7D6]/20 flex items-center justify-center">
                    <Store className="w-6 h-6 text-[#022c22]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-[#8AD7D6]/20 p-1.5 rounded-2xl shadow-sm">
            <TabsTrigger 
              value="iletisim"
              className="data-[state=active]:bg-[#022c22] data-[state=active]:text-white rounded-xl px-4 py-2 transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              İletişim
              {messages.filter((m) => !m.read).length > 0 && (
                <Badge className="ml-2 bg-[#8AD7D6] text-[#022c22]">{messages.filter((m) => !m.read).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="galeri"
              className="data-[state=active]:bg-[#022c22] data-[state=active]:text-white rounded-xl px-4 py-2 transition-all"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Galeri
            </TabsTrigger>
            <TabsTrigger 
              value="franchise"
              className="data-[state=active]:bg-[#022c22] data-[state=active]:text-white rounded-xl px-4 py-2 transition-all"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Franchise
              {franchiseApplications.filter((a) => !a.read).length > 0 && (
                <Badge className="ml-2 bg-[#8AD7D6] text-[#022c22]">{franchiseApplications.filter((a) => !a.read).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="bizi-taniyin"
              className="data-[state=active]:bg-[#022c22] data-[state=active]:text-white rounded-xl px-4 py-2 transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              Bizi Tanıyın
            </TabsTrigger>
            <TabsTrigger 
              value="subeler"
              className="data-[state=active]:bg-[#022c22] data-[state=active]:text-white rounded-xl px-4 py-2 transition-all"
            >
              <Store className="w-4 h-4 mr-2" />
              Şubeler
            </TabsTrigger>
            <TabsTrigger 
              value="menu"
              className="data-[state=active]:bg-[#022c22] data-[state=active]:text-white rounded-xl px-4 py-2 transition-all"
            >
              <Utensils className="w-4 h-4 mr-2" />
              Menü Yönetimi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="iletisim" className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#8AD7D6]/20 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#022c22] mb-2">İletişim Yönetimi</h2>
              <p className="text-[#022c22]/70">
                İletişim formundan gelen mesajları görüntüleyin ve yönetin
              </p>
            </div>

            {/* Çalışma Saatleri Ayarları */}
            <Card className="border-[#8AD7D6]/20 shadow-sm">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="text-[#022c22] flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Çalışma Saatleri
                </CardTitle>
                <CardDescription className="text-[#022c22]/70">İletişim sayfasında gösterilecek çalışma saatleri</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#022c22]/80">Hafta İçi</Label>
                    <Input
                      type="text"
                      value={workingHoursWeekday}
                      onChange={(e) => setWorkingHoursWeekday(e.target.value)}
                      className="w-40 h-10"
                      placeholder="08:00 - 22:00"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#022c22]/80">Hafta Sonu</Label>
                    <Input
                      type="text"
                      value={workingHoursWeekend}
                      onChange={(e) => setWorkingHoursWeekend(e.target.value)}
                      className="w-40 h-10"
                      placeholder="08:00 - 23:00"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveWorkingHours}
                    disabled={workingHoursSaving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {workingHoursSaving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 mb-6">
              <Button
                variant={messageFilter === "all" ? "default" : "outline"}
                onClick={() => setMessageFilter("all")}
                size="sm"
                className={messageFilter === "all" ? "bg-[#022c22] hover:bg-[#034435]" : "border-[#8AD7D6]/30"}
              >
                Tüm Mesajlar ({messages.length})
              </Button>
              <Button
                variant={messageFilter === "unread" ? "default" : "outline"}
                onClick={() => setMessageFilter("unread")}
                size="sm"
                className={messageFilter === "unread" ? "bg-[#022c22] hover:bg-[#034435]" : "border-[#8AD7D6]/30"}
              >
                Okunmamış ({messages.filter((m) => !m.read).length})
              </Button>
            </div>

            <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {messageFilter === "unread" ? "Okunmamış mesaj yok" : "Henüz mesaj yok"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <Card
                    key={message.id}
                    className={`transition-all hover:shadow-lg ${
                      message.read 
                        ? "border-[#8AD7D6]/20 bg-[#e6f4f1]/50/50" 
                        : "border-orange-300 bg-orange-50/30 shadow-md"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {message.name}
                              {!message.read && (
                                <Badge variant="default" className="ml-2">
                                  Yeni
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4" />
                              <a 
                                href={`mailto:${message.email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              >
                                {message.email}
                              </a>
                            </CardDescription>
                            {message.phone && (
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Phone className="w-4 h-4" />
                                <a 
                                  href={`https://wa.me/${message.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800 hover:underline transition-colors flex items-center gap-1"
                                >
                                  {message.phone}
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                  </svg>
                                </a>
                              </CardDescription>
                            )}
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(message.created_at).toLocaleString("tr-TR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!message.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(message.id)}
                              className="flex items-center gap-2 border-[#8AD7D6]/30 hover:bg-[#8AD7D6]/10"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Okundu İşaretle
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
                            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white rounded-lg p-4 border border-[#8AD7D6]/20">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#022c22]/80">
                          {message.message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            </div>
          </TabsContent>

          <TabsContent value="galeri" className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#8AD7D6]/20 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#022c22] mb-2">Galeri Yönetimi</h2>
              <p className="text-[#022c22]/70">
                Galeri görsellerini yönetin ve yeni görseller ekleyin
              </p>
            </div>

            {/* Google Rating Settings */}
            <Card className="border-[#8AD7D6]/20 shadow-sm">
              <CardHeader className="bg-amber-50 border-b border-amber-200">
                <CardTitle className="text-[#022c22] flex items-center gap-2">
                  <svg className="w-5 h-5" fill="#FFD700" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Google Puanlama
                </CardTitle>
                <CardDescription className="text-[#022c22]/70">Ana sayfada gösterilecek yıldız puanlaması</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#022c22]/80">Puan (0-5)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={googleRating}
                      onChange={(e) => setGoogleRating(e.target.value)}
                      className="w-24 h-10"
                      placeholder="5.0"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#022c22]/80">Yorum Sayısı</Label>
                    <Input
                      type="text"
                      value={googleReviewCount}
                      onChange={(e) => setGoogleReviewCount(e.target.value)}
                      className="w-32 h-10"
                      placeholder="120+"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = parseFloat(googleRating) || 0;
                        const rawFill = Math.min(Math.max(rating - (star - 1), 0), 1);
                        // Kısmi dolulukları daha görünür yapmak için kare kök ölçeklendirme
                        const fillPercentage = (rawFill > 0 && rawFill < 1) 
                            ? Math.sqrt(rawFill) * 100 
                            : rawFill * 100;
                        return (
                          <div key={star} className="relative w-6 h-6">
                            <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                              <svg className="w-6 h-6" fill="#FFD700" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-lg font-bold text-[#022c22]">{googleRating}</span>
                  </div>
                  <Button 
                    onClick={handleSaveRating}
                    disabled={ratingSaving}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    {ratingSaving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card className="border-[#8AD7D6]/20 shadow-sm">
              <CardHeader className="bg-[#e6f4f1]/50 border-b border-[#8AD7D6]/20">
                <CardTitle className="text-[#022c22]">Yeni Görsel Ekle</CardTitle>
                <CardDescription className="text-[#022c22]/70">Galeriye yeni görsel yükleyin</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#022c22]/80">Kategori</Label>
                      <select
                        value={selectedGalleryCategory}
                        onChange={(e) => setSelectedGalleryCategory(e.target.value)}
                        className="px-4 py-2 border border-[#8AD7D6]/20 rounded-lg bg-white text-[#022c22] focus:outline-none focus:ring-2 focus:ring-[#8AD7D6]"
                        disabled={uploading}
                      >
                        {GALLERY_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#022c22]/80">Görsel</Label>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Button asChild variant="outline" disabled={uploading || !!pendingImageFile}>
                          <span className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            {pendingImageFile ? "Görsel Seçildi" : "Görsel Seç"}
                          </span>
                        </Button>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={uploading || !!pendingImageFile}
                      />
                    </div>
                  </div>

                  {/* Preview and Save/Cancel */}
                  {pendingImagePreview && (
                    <div className="flex items-center gap-4 p-4 bg-[#e6f4f1]/50 rounded-lg border border-[#8AD7D6]/20">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#8AD7D6]/30 flex-shrink-0">
                        <Image src={pendingImagePreview} alt="Önizleme" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#022c22]/70 mb-1">Seçilen görsel:</p>
                        <p className="text-sm font-medium text-[#022c22] truncate">{pendingImageFile?.name}</p>
                        <p className="text-xs text-[#022c22]/60 mt-1">Kategori: {selectedGalleryCategory}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          onClick={handleSaveGalleryImage}
                          disabled={uploading}
                          className="bg-[#8AD7D6] hover:bg-[#6bc5c4]"
                        >
                          {uploading ? "Yükleniyor..." : "Kaydet"}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleCancelPendingImage}
                          disabled={uploading}
                        >
                          İptal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save Order Section */}
            {galleryItems.length > 0 && (
              <div className="flex items-center justify-between bg-[#e6f4f1]/50 border border-[#8AD7D6]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#022c22]/70">
                  <GripVertical className="w-5 h-5" />
                  <span className="text-sm">Görselleri sürükleyerek sıralayın, ardından kaydedin</span>
                </div>
                <Button 
                  onClick={handleSaveGalleryOrder}
                  disabled={!galleryOrderChanged || savingGalleryOrder}
                  className={galleryOrderChanged ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {savingGalleryOrder ? "Kaydediliyor..." : galleryOrderChanged ? "Sıralamayı Kaydet" : "Kaydedildi"}
                </Button>
              </div>
            )}

            {/* Gallery Grid */}
            {galleryLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : galleryItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Henüz galeri görseli yok</p>
                </CardContent>
              </Card>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={galleryItems.map((item) => item.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryItems.map((item) => (
                      <SortableGalleryItem
                        key={item.id}
                        item={item}
                        onDelete={handleDeleteImage}
                        onToggleHero={handleToggleHeroSection}
                        onToggleHeroMain={handleToggleHeroMain}
                        isOver={overId === item.id && activeId !== item.id}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <Card className="overflow-hidden shadow-2xl ring-2 ring-primary scale-105 rotate-1">
                      <div className="relative aspect-square w-48">
                        <Image
                          src={galleryItems.find((item) => item.id === activeId)?.image_url || ""}
                          alt={galleryItems.find((item) => item.id === activeId)?.title || "Galeri görseli"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-lg px-2 py-1 text-sm font-medium">
                          Sürüklüyor...
                        </div>
                      </div>
                    </Card>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </TabsContent>

          <TabsContent value="franchise" className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#8AD7D6]/20 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#022c22] mb-2">Franchise Yönetimi</h2>
              <p className="text-[#022c22]/70">
                Franchise başvurularını görüntüleyin ve yönetin
              </p>
            </div>

            {/* Franchise İstatistikleri */}
            <Card className="border-[#8AD7D6]/20 shadow-sm">
              <CardHeader className="bg-[#e6f4f1]/50 border-b border-[#8AD7D6]/20">
                <CardTitle className="text-[#022c22] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#8AD7D6]" />
                  Franchise İstatistikleri
                </CardTitle>
                <CardDescription className="text-[#022c22]/70">Franchise sayfasında gösterilecek istatistikler</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#022c22]/80 flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Aktif Şube
                    </Label>
                    <Input
                      type="text"
                      value={franchiseActiveBranches}
                      onChange={(e) => setFranchiseActiveBranches(e.target.value)}
                      className="h-10"
                      placeholder="12+"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#022c22]/80 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Yıllık Misafir
                    </Label>
                    <Input
                      type="text"
                      value={franchiseYearlyGuests}
                      onChange={(e) => setFranchiseYearlyGuests(e.target.value)}
                      className="h-10"
                      placeholder="500K+"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#022c22]/80 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Yatırım Geri Dönüşü
                    </Label>
                    <Input
                      type="text"
                      value={franchiseInvestmentReturn}
                      onChange={(e) => setFranchiseInvestmentReturn(e.target.value)}
                      className="h-10"
                      placeholder="%100"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={handleSaveFranchiseStats}
                    disabled={franchiseStatsSaving}
                    className="bg-[#022c22] hover:bg-[#034435]"
                  >
                    {franchiseStatsSaving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 mb-6">
              <Button
                variant={franchiseFilter === "all" ? "default" : "outline"}
                onClick={() => setFranchiseFilter("all")}
                size="sm"
                className={franchiseFilter === "all" ? "bg-[#022c22] hover:bg-[#034435]" : "border-[#8AD7D6]/30"}
              >
                Tüm Başvurular ({franchiseApplications.length})
              </Button>
              <Button
                variant={franchiseFilter === "unread" ? "default" : "outline"}
                onClick={() => setFranchiseFilter("unread")}
                size="sm"
                className={franchiseFilter === "unread" ? "bg-[#022c22] hover:bg-[#034435]" : "border-[#8AD7D6]/30"}
              >
                Okunmamış ({franchiseApplications.filter((a) => !a.read).length})
              </Button>
            </div>

            <div className="space-y-4">
              {franchiseLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : (franchiseFilter === "unread"
                ? franchiseApplications.filter((a) => !a.read)
                : franchiseApplications
              ).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {franchiseFilter === "unread" ? "Okunmamış başvuru yok" : "Henüz başvuru yok"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {(franchiseFilter === "unread"
                    ? franchiseApplications.filter((a) => !a.read)
                    : franchiseApplications
                  ).map((application) => (
                    <Card
                      key={application.id}
                      className={`transition-all hover:shadow-lg ${
                        application.read 
                          ? "border-[#8AD7D6]/20 bg-[#e6f4f1]/50/50" 
                          : "border-orange-300 bg-orange-50/30 shadow-md"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2">
                                {application.name}
                                {!application.read && (
                                  <Badge variant="default" className="ml-2">
                                    Yeni
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {application.email}
                              </CardDescription>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Phone className="w-4 h-4" />
                                {application.phone}
                              </CardDescription>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="w-4 h-4" />
                                {application.city_district || application.city}
                              </CardDescription>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(application.created_at).toLocaleString("tr-TR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!application.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markFranchiseAsRead(application.id)}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Okundu İşaretle
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteFranchiseApplication(application.id)}
                              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                              Sil
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* A) BAŞVURU SAHİBİ BİLGİLERİ */}
                          {(application.birth_year || application.job_status) && (
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                              <p className="text-sm font-bold mb-2">A) BAŞVURU SAHİBİ BİLGİLERİ</p>
                              {application.birth_year && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Doğum Yılı:</span> {application.birth_year}
                                </p>
                              )}
                              {application.job_status && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">İş Durumu:</span> {
                                    application.job_status === "calisan" ? "Çalışan" :
                                    application.job_status === "isletme_sahibi" ? "İşletme Sahibi" :
                                    application.job_status === "yatirimci" ? "Yatırımcı" :
                                    application.job_status === "diger" ? "Diğer" : application.job_status
                                  }
                                </p>
                              )}
                            </div>
                          )}

                          {/* B) BAYİLİK PLANI */}
                          {(application.target_city || application.location_type || application.has_food_beverage_experience !== null) && (
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                              <p className="text-sm font-bold mb-2">B) BAYİLİK PLANI</p>
                              {application.target_city && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Hedef Şehir/İlçe:</span> {application.target_city}
                                </p>
                              )}
                              {application.location_type && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Lokasyon Tipi:</span> {
                                    application.location_type === "cadde" ? "Cadde" :
                                    application.location_type === "avm" ? "AVM" :
                                    application.location_type === "islek_bolge" ? "İşlek bölge" :
                                    application.location_type === "diger" ? "Diğer" : application.location_type
                                  }
                                </p>
                              )}
                              {application.has_food_beverage_experience !== null && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Gıda & İçecek Deneyimi:</span> {application.has_food_beverage_experience ? "Evet" : "Hayır"}
                                </p>
                              )}
                              {application.experience_description && (
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap mt-2">
                                  <span className="font-medium">Deneyim Açıklaması:</span><br />
                                  {application.experience_description}
                                </p>
                              )}
                            </div>
                          )}

                          {/* C) MEKÂN BİLGİLERİ */}
                          {(application.has_location !== null || application.location_area || application.seating_capacity || application.has_outdoor_area !== null) && (
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                              <p className="text-sm font-bold mb-2">C) MEKÂN BİLGİLERİ</p>
                              {application.has_location !== null && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Uygun Yer:</span> {
                                    application.has_location === true ? "Evet" :
                                    application.has_location === false ? "Hayır" : "Araştırıyorum"
                                  }
                                </p>
                              )}
                              {application.location_area && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Alan:</span> {application.location_area} m²
                                </p>
                              )}
                              {application.seating_capacity && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Oturma Kapasitesi:</span> {application.seating_capacity}
                                </p>
                              )}
                              {application.has_outdoor_area !== null && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Açık Alan/Teras:</span> {application.has_outdoor_area ? "Evet" : "Hayır"}
                                </p>
                              )}
                            </div>
                          )}

                          {/* D) YATIRIM VE ZAMANLAMA */}
                          {(application.investment_budget || application.opening_timeline || application.operator_type) && (
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                              <p className="text-sm font-bold mb-2">D) YATIRIM VE ZAMANLAMA</p>
                              {application.investment_budget && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Yatırım Bütçesi:</span> {
                                    application.investment_budget === "3-5m" ? "3.000.000 – 5.000.000 TL" :
                                    application.investment_budget === "5-7m" ? "5.000.000 – 7.000.000 TL" :
                                    application.investment_budget === "7m+" ? "7.000.000 TL ve üzeri" : application.investment_budget
                                  }
                                </p>
                              )}
                              {application.opening_timeline && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Açılış Süresi:</span> {
                                    application.opening_timeline === "0-3ay" ? "0–3 ay" :
                                    application.opening_timeline === "3-6ay" ? "3–6 ay" :
                                    application.opening_timeline === "6-12ay" ? "6–12 ay" :
                                    application.opening_timeline === "belirsiz" ? "Belirsiz" : application.opening_timeline
                                  }
                                </p>
                              )}
                              {application.operator_type && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">İşletme:</span> {
                                    application.operator_type === "kendim" ? "Kendim" :
                                    application.operator_type === "ortak" ? "Ortak" :
                                    application.operator_type === "profesyonel_yonetici" ? "Profesyonel yönetici" : application.operator_type
                                  }
                                </p>
                              )}
                            </div>
                          )}

                          {/* E) MOTİVASYON */}
                          {application.motivation && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm font-bold mb-2">E) MOTİVASYON</p>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {application.motivation}
                              </p>
                            </div>
                          )}

                          {application.additional_notes && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm font-medium mb-1">Ek Notlar</p>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {application.additional_notes}
                              </p>
                            </div>
                          )}

                          {/* Legacy fields for backward compatibility */}
                          {application.investment_amount && !application.investment_budget && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm font-medium mb-1">Yatırım Tutarı</p>
                              <p className="text-sm text-muted-foreground">{application.investment_amount}</p>
                            </div>
                          )}
                          {application.experience && !application.experience_description && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm font-medium mb-1">İş Deneyimi</p>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {application.experience}
                              </p>
                            </div>
                          )}
                          {application.message && !application.motivation && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm font-medium mb-1">Ek Mesaj</p>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {application.message}
                              </p>
                            </div>
                          )}

                          {application.kvkk_consent && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm font-medium text-green-800">✓ KVKK Onayı Verildi</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bizi-taniyin" className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#8AD7D6]/20 p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#022c22] mb-2">Bizi Tanıyın Yönetimi</h2>
                <p className="text-[#022c22]/70">
                  "Bizi Tanıyın" sayfasının içeriğini düzenleyin
                </p>
              </div>
              <Button 
                onClick={() => setShowAboutForm(true)} 
                className="flex items-center gap-2 bg-[#022c22] hover:bg-[#034435]"
              >
                <Edit className="w-4 h-4" />
                İçeriği Düzenle
              </Button>
            </div>

            {aboutLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : aboutPage ? (
              <Card className="border-[#8AD7D6]/20 shadow-sm">
                <CardHeader className="bg-[#e6f4f1]/50 border-b border-[#8AD7D6]/20">
                  <CardTitle className="text-[#022c22]">Mevcut İçerik</CardTitle>
                  <CardDescription className="text-[#022c22]/70">Sayfada görüntülenen içerik</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Hero Bölümü</h3>
                    <p className="text-sm text-muted-foreground mb-1">Badge: {aboutPage.hero_badge || "Hikayemiz"}</p>
                    <p className="text-sm text-muted-foreground mb-1">Başlık: {aboutPage.hero_title || "Bizi Tanıyın"}</p>
                    <p className="text-sm text-muted-foreground">Açıklama: {aboutPage.hero_description || "-"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Hikaye Bölümü</h3>
                    <p className="text-sm text-muted-foreground mb-1">Başlık: {aboutPage.story_title || "Soframızın Hikayesi"}</p>
                    <p className="text-sm text-muted-foreground mb-1">Paragraf 1: {aboutPage.story_content_paragraph1 || "-"}</p>
                    <p className="text-sm text-muted-foreground">Paragraf 2: {aboutPage.story_content_paragraph2 || "-"}</p>
                    {aboutPage.story_image_url && (
                      <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden">
                        <Image src={aboutPage.story_image_url} alt="Story" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Değerler Bölümü</h3>
                    <p className="text-sm text-muted-foreground mb-1">Başlık: {aboutPage.values_title || "Değerlerimiz"}</p>
                    <p className="text-sm text-muted-foreground mb-1">Alt Başlık: {aboutPage.values_subtitle || "Bizi biz yapan özelliklerimiz"}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground">1. {aboutPage.value1_title || "Tazelik"}: {aboutPage.value1_desc || "-"}</p>
                      <p className="text-sm text-muted-foreground">2. {aboutPage.value2_title || "Gelenek"}: {aboutPage.value2_desc || "-"}</p>
                      <p className="text-sm text-muted-foreground">3. {aboutPage.value3_title || "Sevgi"}: {aboutPage.value3_desc || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Misyon Bölümü</h3>
                    <p className="text-sm text-muted-foreground mb-1">Başlık: {aboutPage.mission_title || "Misyonumuz"}</p>
                    <p className="text-sm text-muted-foreground mb-1">Paragraf 1: {aboutPage.mission_content_paragraph1 || "-"}</p>
                    <p className="text-sm text-muted-foreground">Paragraf 2: {aboutPage.mission_content_paragraph2 || "-"}</p>
                    {aboutPage.mission_image_url && (
                      <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden">
                        <Image src={aboutPage.mission_image_url} alt="Mission" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Vizyon Bölümü</h3>
                    <p className="text-sm text-muted-foreground mb-1">Başlık: {aboutPage.vision_title || "Vizyonumuz"}</p>
                    <p className="text-sm text-muted-foreground mb-1">Paragraf 1: {aboutPage.vision_content_paragraph1 || "-"}</p>
                    <p className="text-sm text-muted-foreground">Paragraf 2: {aboutPage.vision_content_paragraph2 || "-"}</p>
                    {aboutPage.vision_image_url && (
                      <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden">
                        <Image src={aboutPage.vision_image_url} alt="Vision" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Franchise Bölümü</h3>
                    <p className="text-sm text-muted-foreground mb-1">Başlık: {aboutPage.franchise_title || "Franchise Fırsatı"}</p>
                    <p className="text-sm text-muted-foreground mb-1">Açıklama: {aboutPage.franchise_description || "-"}</p>
                    <p className="text-sm text-muted-foreground">Buton Metni: {aboutPage.franchise_button_text || "Franchise Başvurusu Yap"}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">İçerik bulunamadı. Lütfen içerik ekleyin.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="subeler" className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#8AD7D6]/20 p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#022c22] mb-2">Şube Yönetimi</h2>
                <p className="text-[#022c22]/70">
                  Şubeleri yönetin, yeni şube ekleyin ve şubelere özel menüler oluşturun
                </p>
              </div>
              <Button 
                onClick={() => { setEditingBranch(null); setShowBranchForm(true) }} 
                className="flex items-center gap-2 bg-[#022c22] hover:bg-[#034435]"
              >
                <Plus className="w-4 h-4" />
                Yeni Şube
              </Button>
            </div>

            <div className="flex gap-3 mb-6">
              <Button
                variant={branchFilter === "all" ? "default" : "outline"}
                onClick={() => setBranchFilter("all")}
                size="sm"
                className={branchFilter === "all" ? "bg-[#022c22] hover:bg-[#034435]" : "border-[#8AD7D6]/30"}
              >
                Tümü ({branches.length})
              </Button>
              <Button
                variant={branchFilter === "active" ? "default" : "outline"}
                onClick={() => setBranchFilter("active")}
                size="sm"
                className={branchFilter === "active" ? "bg-[#022c22] hover:bg-[#034435]" : "border-[#8AD7D6]/30"}
              >
                Aktif ({branches.filter((b) => b.active).length})
              </Button>
              <Button
                variant={branchFilter === "inactive" ? "default" : "outline"}
                onClick={() => setBranchFilter("inactive")}
                size="sm"
                className={branchFilter === "inactive" ? "bg-[#022c22] hover:bg-[#034435]" : "border-[#8AD7D6]/30"}
              >
                Pasif ({branches.filter((b) => !b.active).length})
              </Button>
            </div>

            <div className="space-y-4">
              {branchLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : (branchFilter === "active"
                ? branches.filter((b) => b.active)
                : branchFilter === "inactive"
                ? branches.filter((b) => !b.active)
                : branches
              ).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {branchFilter === "active" ? "Aktif şube yok" : branchFilter === "inactive" ? "Pasif şube yok" : "Henüz şube yok"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {(branchFilter === "active"
                    ? branches.filter((b) => b.active)
                    : branchFilter === "inactive"
                    ? branches.filter((b) => !b.active)
                    : branches
                  ).map((branch) => (
                    <Card 
                      key={branch.id} 
                      className={`transition-all hover:shadow-lg ${
                        branch.active 
                          ? "border-[#8AD7D6]/20 shadow-sm" 
                          : "border-[#8AD7D6]/20 bg-[#e6f4f1]/50/50 opacity-75"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 mb-2">
                              {branch.name}
                              {branch.active ? (
                                <Badge variant="default">Aktif</Badge>
                              ) : (
                                <Badge variant="outline">Pasif</Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {branch.city}
                              </span>
                              {branch.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {branch.phone}
                                </span>
                              )}
                            </CardDescription>
                            {branch.description && (
                              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                {branch.description}
                              </p>
                            )}
                          </div>
                          {branch.image_url && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden ml-4">
                              <Image src={branch.image_url} alt={branch.name} fill className="object-cover" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleBranchActive(branch.id, branch.active)}
                            className="flex items-center gap-2"
                          >
                            {branch.active ? "Pasif Yap" : "Aktif Yap"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setEditingBranch(branch); setShowBranchForm(true) }}
                            className="flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Düzenle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBranch(branch.id)}
                            className="flex items-center gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Sil
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelectedBranchForGallery(branch); setShowBranchGallery(true) }}
                            className="flex items-center gap-2"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Fotoğraflar
                          </Button>
                          <Link href={`/subeler/${branch.slug}`} target="_blank">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Görüntüle
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#8AD7D6]/20 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#022c22] mb-2">Menü Yönetimi</h2>
              <p className="text-[#022c22]/70">
                Sınırsız kahvaltı menüsünün fiyatını ve içeriğini yönetin
              </p>
            </div>

            {/* Menu Price Section */}
            {menuLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : unlimitedMenu ? (
              <Card className="border-[#8AD7D6]/20 shadow-sm">
                <CardHeader className="bg-[#e6f4f1]/50 border-b border-[#8AD7D6]/20">
                  <CardTitle className="text-[#022c22]">Menü Ayarları</CardTitle>
                  <CardDescription className="text-[#022c22]/70">Sınırsız kahvaltı menüsünün bilgilerini güncelleyin</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="menu-title" className="text-[#022c22]/80 font-medium mb-2 block">
                        Menü Başlığı
                      </Label>
                      <Input
                        id="menu-title"
                        placeholder="Örn: Sınırsız Kahvaltı"
                        value={menuForm.title}
                        onChange={(e) => setMenuForm({ ...menuForm, title: e.target.value })}
                        className="h-12 border-[#8AD7D6]/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="menu-price" className="text-[#022c22]/80 font-medium mb-2 block">
                        Fiyat (TL)
                      </Label>
                      <Input
                        id="menu-price"
                        type="number"
                        step="0.01"
                        placeholder="Örn: 1150.00"
                        value={menuForm.price}
                        onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                        className="h-12 border-[#8AD7D6]/30"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="menu-description" className="text-[#022c22]/80 font-medium mb-2 block">
                      Açıklama
                    </Label>
                    <Textarea
                      id="menu-description"
                      placeholder="Örn: Kahvaltıya çay dahil, kişi başı sınırsızdır."
                      value={menuForm.description}
                      onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                      rows={3}
                      className="border-[#8AD7D6]/30 resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#8AD7D6]/20">
                    <div className="bg-[#e6f4f1] rounded-xl px-6 py-3">
                      <p className="text-sm text-[#022c22]/60">Mevcut Fiyat</p>
                      <p className="text-2xl font-bold text-[#022c22]">
                        {unlimitedMenu.price.toFixed(2)} TL <span className="text-sm font-normal text-[#022c22]/70">/ Kişi Başı</span>
                      </p>
                    </div>
                    <Button 
                      onClick={handleSaveMenuSettings}
                      disabled={menuSaving}
                      className="h-12 px-8 bg-primary hover:bg-primary/90"
                    >
                      {menuSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Kaydet
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Menu Items Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#8AD7D6]/20 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#022c22]">Menü İçeriği</h3>
                  <p className="text-[#022c22]/70 text-sm mt-1">Menüye öğe ekleyin veya düzenleyin</p>
                </div>
                <Button 
                  onClick={() => { setEditingMenuItem(null); setShowMenuItemForm(true) }} 
                  className="flex items-center gap-2 bg-[#022c22] hover:bg-[#034435]"
                >
                  <Plus className="w-4 h-4" />
                  Yeni Öğe Ekle
                </Button>
              </div>

              {menuLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : unlimitedMenuItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Utensils className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Henüz menü öğesi eklenmemiş</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlimitedMenuItems.map((item) => (
                    <Card key={item.id} className="border-[#8AD7D6]/20 shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative aspect-square">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#e6f4f1]">
                            <ImageIcon className="w-12 h-12 text-[#8AD7D6]" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold text-[#022c22] mb-2">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-[#022c22]/70 mb-4 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setEditingMenuItem(item); setShowMenuItemForm(true) }}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMenuItem(item.id, item.image_url)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Menu Item Form Dialog */}
      {showMenuItemForm && (
        <MenuItemFormDialog
          item={editingMenuItem}
          onClose={() => { setShowMenuItemForm(false); setEditingMenuItem(null) }}
          onSave={(title, description, imageUrl, category, featured) => {
            if (editingMenuItem) {
              handleUpdateMenuItem(editingMenuItem.id, title, description, imageUrl, category, featured)
            } else {
              handleCreateMenuItem(title, description, imageUrl, category, featured)
            }
          }}
          onImageUpload={handleUploadMenuItemImage}
          uploading={uploading}
        />
      )}

      {/* About Page Form Dialog */}
      {showAboutForm && aboutPage && (
        <AboutPageFormDialog
          aboutPage={aboutPage}
          onClose={() => setShowAboutForm(false)}
          onSave={() => { fetchAboutPage(); setShowAboutForm(false) }}
        />
      )}

      {/* Branch Form Dialog */}
      {showBranchForm && (
        <BranchFormDialog
          branch={editingBranch}
          branches={branches}
          onClose={() => { setShowBranchForm(false); setEditingBranch(null) }}
          onSave={() => { fetchBranches(); setShowBranchForm(false); setEditingBranch(null) }}
        />
      )}

      {/* Branch Gallery Dialog */}
      {showBranchGallery && selectedBranchForGallery && (
        <BranchGalleryDialog
          branch={selectedBranchForGallery}
          onClose={() => { setShowBranchGallery(false); setSelectedBranchForGallery(null) }}
        />
      )}
    </main>
    </ProtectedRoute>
  )
}

// Branch Form Dialog Component
function BranchFormDialog({ branch, branches, onClose, onSave }: { branch: Branch | null; branches: Branch[]; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: branch?.name || "",
    slug: branch?.slug || "",
    city: branch?.city || "",
    address: branch?.address || "",
    phone: branch?.phone || "",
    email: branch?.email || "",
    active: branch?.active ?? true,
    description: branch?.description || "",
    story: branch?.story || "",
    image_url: branch?.image_url || "",
    working_hours: branch?.working_hours || {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    latitude: branch?.latitude?.toString() || "",
    longitude: branch?.longitude?.toString() || "",
    map_url: branch?.map_url || "",
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: formData.slug || generateSlug(name) })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `branches/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)
      setFormData({ ...formData, image_url: urlData.publicUrl })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(`Hata: ${error?.message || "Görsel yüklenirken bir hata oluştu"}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Check if slug is unique
      if (!branch) {
        const existingBranch = branches.find((b) => b.slug === formData.slug)
        if (existingBranch) {
          alert("Bu slug zaten kullanılıyor. Lütfen farklı bir slug girin.")
          setSaving(false)
          return
        }
      } else {
        const existingBranch = branches.find((b) => b.slug === formData.slug && b.id !== branch.id)
        if (existingBranch) {
          alert("Bu slug zaten kullanılıyor. Lütfen farklı bir slug girin.")
          setSaving(false)
          return
        }
      }

      const branchData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        city: formData.city,
        address: formData.address || null,
        phone: formData.phone || null,
        email: formData.email || null,
        active: formData.active,
        description: formData.description || null,
        story: formData.story || null,
        working_hours: formData.working_hours,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        map_url: formData.map_url || null,
        updated_at: new Date().toISOString(),
        ...(formData.image_url && { image_url: formData.image_url }),
      }

      if (branch) {
        const { error } = await supabase
          .from("branches")
          .update(branchData)
          .eq("id", branch.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("branches").insert([branchData])
        if (error) throw error
      }

      onSave()
    } catch (error: any) {
      console.error("Error saving branch:", error)
      alert(`Hata: ${error?.message || "Şube kaydedilirken bir hata oluştu"}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{branch ? "Şubeyi Düzenle" : "Yeni Şube"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="branch-name">Şube Adı *</Label>
            <Input
              id="branch-name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Örn: Sivas Merkez Şubesi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-slug">Slug *</Label>
            <Input
              id="branch-slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="sivas-merkez-subesi"
            />
            <p className="text-xs text-muted-foreground">URL için kullanılacak benzersiz slug</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch-city">Şehir *</Label>
              <Input
                id="branch-city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="Sivas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-phone">Telefon</Label>
              <Input
                id="branch-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0540 271 40 40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-address">Adres</Label>
            <Textarea
              id="branch-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Tam adres bilgisi..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-email">E-posta</Label>
            <Input
              id="branch-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sube@pisikahvalti.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-description">Kısa Açıklama</Label>
            <Textarea
              id="branch-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Şube hakkında kısa bilgiler..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-story">Hikaye / Detaylı Açıklama</Label>
            <Textarea
              id="branch-story"
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Şubenin hikayesi, özellikleri, atmosferi..."
              rows={6}
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold">Çalışma Saatleri</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "monday", label: "Pazartesi" },
                { key: "tuesday", label: "Salı" },
                { key: "wednesday", label: "Çarşamba" },
                { key: "thursday", label: "Perşembe" },
                { key: "friday", label: "Cuma" },
                { key: "saturday", label: "Cumartesi" },
                { key: "sunday", label: "Pazar" },
              ].map((day) => (
                <div key={day.key} className="space-y-2">
                  <Label htmlFor={`working-hours-${day.key}`}>{day.label}</Label>
                  <Input
                    id={`working-hours-${day.key}`}
                    value={formData.working_hours[day.key as keyof typeof formData.working_hours] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        working_hours: {
                          ...formData.working_hours,
                          [day.key]: e.target.value,
                        },
                      })
                    }
                    placeholder="09:00 - 22:00"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold">Lokasyon Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch-latitude">Enlem (Latitude)</Label>
                <Input
                  id="branch-latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="39.7475"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-longitude">Boylam (Longitude)</Label>
                <Input
                  id="branch-longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="37.0175"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-map-url">Harita Linki (Google Maps)</Label>
              <Input
                id="branch-map-url"
                value={formData.map_url}
                onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-image">Görsel</Label>
            <div className="flex items-center gap-4">
              <label htmlFor="branch-image-upload" className="cursor-pointer">
                <Button asChild variant="outline" disabled={uploading} type="button">
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Yükleniyor..." : "Görsel Seç"}
                  </span>
                </Button>
              </label>
              <input
                id="branch-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              {formData.image_url && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                  <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="branch-active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="branch-active" className="cursor-pointer">Aktif</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Kaydediliyor..." : branch ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// About Page Form Dialog Component
function AboutPageFormDialog({ aboutPage, onClose, onSave }: { aboutPage: AboutPage; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    hero_badge: aboutPage.hero_badge || "",
    hero_title: aboutPage.hero_title || "",
    hero_description: aboutPage.hero_description || "",
    story_title: aboutPage.story_title || "",
    story_content_paragraph1: aboutPage.story_content_paragraph1 || "",
    story_content_paragraph2: aboutPage.story_content_paragraph2 || "",
    story_image_url: aboutPage.story_image_url || "",
    values_title: aboutPage.values_title || "",
    values_subtitle: aboutPage.values_subtitle || "",
    value1_title: aboutPage.value1_title || "",
    value1_desc: aboutPage.value1_desc || "",
    value2_title: aboutPage.value2_title || "",
    value2_desc: aboutPage.value2_desc || "",
    value3_title: aboutPage.value3_title || "",
    value3_desc: aboutPage.value3_desc || "",
    mission_title: aboutPage.mission_title || "",
    mission_content_paragraph1: aboutPage.mission_content_paragraph1 || "",
    mission_content_paragraph2: aboutPage.mission_content_paragraph2 || "",
    mission_image_url: aboutPage.mission_image_url || "",
    vision_title: aboutPage.vision_title || "",
    vision_content_paragraph1: aboutPage.vision_content_paragraph1 || "",
    vision_content_paragraph2: aboutPage.vision_content_paragraph2 || "",
    vision_image_url: aboutPage.vision_image_url || "",
    franchise_title: aboutPage.franchise_title || "",
    franchise_description: aboutPage.franchise_description || "",
    franchise_button_text: aboutPage.franchise_button_text || "",
  })
  const [uploadingStory, setUploadingStory] = useState(false)
  const [uploadingMission, setUploadingMission] = useState(false)
  const [uploadingVision, setUploadingVision] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingStory(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `about/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)
      setFormData({ ...formData, story_image_url: urlData.publicUrl })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(`Hata: ${error?.message || "Görsel yüklenirken bir hata oluştu"}`)
    } finally {
      setUploadingStory(false)
    }
  }

  const handleMissionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingMission(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `about/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)
      setFormData({ ...formData, mission_image_url: urlData.publicUrl })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(`Hata: ${error?.message || "Görsel yüklenirken bir hata oluştu"}`)
    } finally {
      setUploadingMission(false)
    }
  }

  const handleVisionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingVision(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `about/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)
      setFormData({ ...formData, vision_image_url: urlData.publicUrl })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(`Hata: ${error?.message || "Görsel yüklenirken bir hata oluştu"}`)
    } finally {
      setUploadingVision(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from("about_page")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", aboutPage.id)

      if (error) throw error
      onSave()
    } catch (error: any) {
      console.error("Error saving about page:", error)
      alert(`Hata: ${error?.message || "İçerik kaydedilirken bir hata oluştu"}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bizi Tanıyın İçeriğini Düzenle</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hero Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold">Hero Bölümü</h3>
            <div className="space-y-2">
              <Label htmlFor="hero_badge">Badge</Label>
              <Input
                id="hero_badge"
                value={formData.hero_badge}
                onChange={(e) => setFormData({ ...formData, hero_badge: e.target.value })}
                placeholder="Hikayemiz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_title">Başlık</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                placeholder="Bizi Tanıyın"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_description">Açıklama</Label>
              <Textarea
                id="hero_description"
                value={formData.hero_description}
                onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                placeholder="Geleneksel Türk kahvaltısının en özel halini..."
                rows={3}
              />
            </div>
          </div>

          {/* Story Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold">Hikaye Bölümü</h3>
            <div className="space-y-2">
              <Label htmlFor="story_title">Başlık</Label>
              <Input
                id="story_title"
                value={formData.story_title}
                onChange={(e) => setFormData({ ...formData, story_title: e.target.value })}
                placeholder="Soframızın Hikayesi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="story_content_paragraph1">Paragraf 1</Label>
              <Textarea
                id="story_content_paragraph1"
                value={formData.story_content_paragraph1}
                onChange={(e) => setFormData({ ...formData, story_content_paragraph1: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="story_content_paragraph2">Paragraf 2</Label>
              <Textarea
                id="story_content_paragraph2"
                value={formData.story_content_paragraph2}
                onChange={(e) => setFormData({ ...formData, story_content_paragraph2: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Hikaye Görseli</Label>
              <div className="flex items-center gap-4">
                <label htmlFor="story-image-upload" className="cursor-pointer">
                  <Button asChild variant="outline" disabled={uploadingStory} type="button">
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {uploadingStory ? "Yükleniyor..." : "Görsel Seç"}
                    </span>
                  </Button>
                </label>
                <input
                  id="story-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleStoryImageUpload}
                  className="hidden"
                  disabled={uploadingStory}
                />
                {formData.story_image_url && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image src={formData.story_image_url} alt="Story" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold">Değerler Bölümü</h3>
            <div className="space-y-2">
              <Label htmlFor="values_title">Başlık</Label>
              <Input
                id="values_title"
                value={formData.values_title}
                onChange={(e) => setFormData({ ...formData, values_title: e.target.value })}
                placeholder="Değerlerimiz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="values_subtitle">Alt Başlık</Label>
              <Input
                id="values_subtitle"
                value={formData.values_subtitle}
                onChange={(e) => setFormData({ ...formData, values_subtitle: e.target.value })}
                placeholder="Bizi biz yapan özelliklerimiz"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value1_title">Değer 1 Başlık</Label>
                <Input
                  id="value1_title"
                  value={formData.value1_title}
                  onChange={(e) => setFormData({ ...formData, value1_title: e.target.value })}
                />
                <Textarea
                  id="value1_desc"
                  value={formData.value1_desc}
                  onChange={(e) => setFormData({ ...formData, value1_desc: e.target.value })}
                  rows={3}
                  placeholder="Açıklama"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value2_title">Değer 2 Başlık</Label>
                <Input
                  id="value2_title"
                  value={formData.value2_title}
                  onChange={(e) => setFormData({ ...formData, value2_title: e.target.value })}
                />
                <Textarea
                  id="value2_desc"
                  value={formData.value2_desc}
                  onChange={(e) => setFormData({ ...formData, value2_desc: e.target.value })}
                  rows={3}
                  placeholder="Açıklama"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value3_title">Değer 3 Başlık</Label>
                <Input
                  id="value3_title"
                  value={formData.value3_title}
                  onChange={(e) => setFormData({ ...formData, value3_title: e.target.value })}
                />
                <Textarea
                  id="value3_desc"
                  value={formData.value3_desc}
                  onChange={(e) => setFormData({ ...formData, value3_desc: e.target.value })}
                  rows={3}
                  placeholder="Açıklama"
                />
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold">Misyon Bölümü</h3>
            <div className="space-y-2">
              <Label htmlFor="mission_title">Başlık</Label>
              <Input
                id="mission_title"
                value={formData.mission_title}
                onChange={(e) => setFormData({ ...formData, mission_title: e.target.value })}
                placeholder="Misyonumuz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission_content_paragraph1">Paragraf 1</Label>
              <Textarea
                id="mission_content_paragraph1"
                value={formData.mission_content_paragraph1}
                onChange={(e) => setFormData({ ...formData, mission_content_paragraph1: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission_content_paragraph2">Paragraf 2</Label>
              <Textarea
                id="mission_content_paragraph2"
                value={formData.mission_content_paragraph2}
                onChange={(e) => setFormData({ ...formData, mission_content_paragraph2: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Misyon Görseli</Label>
              <div className="flex items-center gap-4">
                <label htmlFor="mission-image-upload" className="cursor-pointer">
                  <Button asChild variant="outline" disabled={uploadingMission} type="button">
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {uploadingMission ? "Yükleniyor..." : "Görsel Seç"}
                    </span>
                  </Button>
                </label>
                <input
                  id="mission-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleMissionImageUpload}
                  className="hidden"
                  disabled={uploadingMission}
                />
                {formData.mission_image_url && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image src={formData.mission_image_url} alt="Mission" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold">Vizyon Bölümü</h3>
            <div className="space-y-2">
              <Label htmlFor="vision_title">Başlık</Label>
              <Input
                id="vision_title"
                value={formData.vision_title}
                onChange={(e) => setFormData({ ...formData, vision_title: e.target.value })}
                placeholder="Vizyonumuz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision_content_paragraph1">Paragraf 1</Label>
              <Textarea
                id="vision_content_paragraph1"
                value={formData.vision_content_paragraph1}
                onChange={(e) => setFormData({ ...formData, vision_content_paragraph1: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision_content_paragraph2">Paragraf 2</Label>
              <Textarea
                id="vision_content_paragraph2"
                value={formData.vision_content_paragraph2}
                onChange={(e) => setFormData({ ...formData, vision_content_paragraph2: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Vizyon Görseli</Label>
              <div className="flex items-center gap-4">
                <label htmlFor="vision-image-upload" className="cursor-pointer">
                  <Button asChild variant="outline" disabled={uploadingVision} type="button">
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {uploadingVision ? "Yükleniyor..." : "Görsel Seç"}
                    </span>
                  </Button>
                </label>
                <input
                  id="vision-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleVisionImageUpload}
                  className="hidden"
                  disabled={uploadingVision}
                />
                {formData.vision_image_url && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image src={formData.vision_image_url} alt="Vision" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Franchise Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Franchise Bölümü</h3>
            <div className="space-y-2">
              <Label htmlFor="franchise_title">Başlık</Label>
              <Input
                id="franchise_title"
                value={formData.franchise_title}
                onChange={(e) => setFormData({ ...formData, franchise_title: e.target.value })}
                placeholder="Franchise Fırsatı"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="franchise_description">Açıklama</Label>
              <Textarea
                id="franchise_description"
                value={formData.franchise_description}
                onChange={(e) => setFormData({ ...formData, franchise_description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="franchise_button_text">Buton Metni</Label>
              <Input
                id="franchise_button_text"
                value={formData.franchise_button_text}
                onChange={(e) => setFormData({ ...formData, franchise_button_text: e.target.value })}
                placeholder="Franchise Başvurusu Yap"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Branch Gallery Dialog Component
interface BranchGalleryItem {
  id: string
  branch_id: string
  image_url: string
  title: string | null
  description: string | null
  position: number | null
  created_at: string
}

function BranchGalleryDialog({ branch, onClose }: { branch: Branch; onClose: () => void }) {
  const [galleryItems, setGalleryItems] = useState<BranchGalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchGalleryItems()
  }, [branch.id])

  async function fetchGalleryItems() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("branch_gallery")
        .select("*")
        .eq("branch_id", branch.id)
        .order("position", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      setGalleryItems(data || [])
    } catch (error) {
      console.error("Error fetching gallery items:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `branch-gallery/${branch.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)
      
      const maxPosition = galleryItems.length > 0 
        ? Math.max(...galleryItems.map(item => item.position || 0))
        : 0

      const { error: insertError } = await supabase
        .from("branch_gallery")
        .insert([{
          branch_id: branch.id,
          image_url: urlData.publicUrl,
          position: maxPosition + 1,
        }])

      if (insertError) throw insertError
      fetchGalleryItems()
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(`Hata: ${error?.message || "Görsel yüklenirken bir hata oluştu"}`)
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteImage(id: string, imageUrl: string) {
    if (!confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return

    try {
      // Extract file path from URL
      const urlParts = imageUrl.split("/")
      const filePath = urlParts.slice(urlParts.indexOf("branch-gallery")).join("/")

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from("images")
        .remove([filePath])

      if (deleteError) console.error("Error deleting from storage:", deleteError)

      // Delete from database
      const { error } = await supabase
        .from("branch_gallery")
        .delete()
        .eq("id", id)

      if (error) throw error
      fetchGalleryItems()
    } catch (error: any) {
      console.error("Error deleting image:", error)
      alert("Fotoğraf silinirken bir hata oluştu")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{branch.name} - Fotoğraf Galerisi</h2>
            <p className="text-sm text-muted-foreground mt-1">Şubeye özel fotoğrafları yönetin</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div className="border-b pb-6">
            <Label htmlFor="branch-gallery-upload" className="cursor-pointer">
              <Button asChild variant="outline" disabled={uploading} type="button">
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
                </span>
              </Button>
            </Label>
            <input
              id="branch-gallery-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          ) : galleryItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Henüz fotoğraf eklenmemiş.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="relative aspect-square">
                    <Image
                      src={item.image_url}
                      alt={item.title || "Gallery image"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(item.id, item.image_url)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Menu Item Form Dialog Component
function MenuItemFormDialog({
  item,
  onClose,
  onSave,
  onImageUpload,
  uploading,
}: {
  item: UnlimitedMenuItem | null
  onClose: () => void
  onSave: (title: string, description: string, imageUrl: string | null, category: string | null, featured: boolean) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, itemId?: string) => Promise<string | undefined>
  uploading: boolean
}) {
  const [title, setTitle] = useState(item?.title || "")
  const [description, setDescription] = useState(item?.description || "")
  const [imageUrl, setImageUrl] = useState(item?.image_url || null)
  const [category, setCategory] = useState(item?.category || "")
  const [featured, setFeatured] = useState(item?.featured || false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      alert("Lütfen başlık girin")
      return
    }
    setSaving(true)
    try {
      await onSave(title, description, imageUrl, category || null, featured)
    } finally {
      setSaving(false)
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = item?.id 
      ? await onImageUpload(e, item.id)
      : await onImageUpload(e)
    if (url) setImageUrl(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#022c22]">
              {item ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
            </h2>
            <p className="text-sm text-[#022c22]/70 mt-1">Menü içeriğine yeni öğe ekleyin</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-title" className="text-[#022c22]/80 font-medium">Başlık *</Label>
              <Input
                id="item-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Evden Patatesli Yumurta"
                className="h-12 border-[#8AD7D6]/30"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-category" className="text-[#022c22]/80 font-medium">Kategori</Label>
              <select
                id="item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 px-3 rounded-md border border-[#8AD7D6]/30 bg-white text-[#022c22] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Kategori Seçin</option>
                {MENU_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-description" className="text-[#022c22]/80 font-medium">Açıklama</Label>
            <Textarea
              id="item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ürün açıklaması..."
              className="min-h-24 border-[#8AD7D6]/30"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#022c22]/80 font-medium">Fotoğraf</Label>
            <div className="flex items-center gap-4">
              <label htmlFor="item-image-upload" className="cursor-pointer">
                <Button asChild variant="outline" disabled={uploading} type="button">
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Yükleniyor..." : imageUrl ? "Fotoğrafı Değiştir" : "Fotoğraf Seç"}
                  </span>
                </Button>
              </label>
              <input
                id="item-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={uploading}
              />
              {imageUrl && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[#8AD7D6]/20">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <input
              type="checkbox"
              id="item-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="item-featured" className="flex flex-col cursor-pointer">
              <span className="font-medium text-amber-800">Öne Çıkan Ürün</span>
              <span className="text-sm text-amber-600">Bu ürünü ana sayfadaki "Öne Çıkanlar" bölümünde göster</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={saving} className="bg-[#022c22] hover:bg-[#034435]">
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
