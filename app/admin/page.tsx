"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Mail, User, Calendar, CheckCircle2, LogOut, Image as ImageIcon, Upload, Trash2, GripVertical } from "lucide-react"
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
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Message {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

interface GalleryItem {
  id: string
  image_url: string
  title: string | null
  description: string | null
  created_at: string
  position: number | null
}

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("iletisim")
  const [messageFilter, setMessageFilter] = useState<"all" | "unread">("all")
  const [uploading, setUploading] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const { signOut } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.push("/admin/login")
  }

  useEffect(() => {
    fetchMessages()
    fetchGallery()
  }, [])

  useEffect(() => {
    if (activeTab === "galeri") {
      fetchGallery()
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `gallery/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file)

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
        title: file.name,
        position: nextPosition,
      })

      if (insertError) throw insertError

      fetchGallery()
      e.target.value = ""
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

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    setActiveId(null)
    setOverId(null)

    if (!over || active.id === over.id) return

    const activeItem = galleryItems.find((item) => item.id === active.id)
    const overItem = galleryItems.find((item) => item.id === over.id)

    if (!activeItem || !overItem) return

    // Swap only the positions of the two items
    const activePosition = activeItem.position ?? galleryItems.findIndex((item) => item.id === active.id)
    const overPosition = overItem.position ?? galleryItems.findIndex((item) => item.id === over.id)

    // Update local state immediately for better UX - only swap the two items
    const newItems = [...galleryItems]
    const activeIndex = newItems.findIndex((item) => item.id === active.id)
    const overIndex = newItems.findIndex((item) => item.id === over.id)
    
    // Swap the items in the array
    ;[newItems[activeIndex], newItems[overIndex]] = [newItems[overIndex], newItems[activeIndex]]
    setGalleryItems(newItems)

    // Update only the two items' positions in database
    try {
      await Promise.all([
        supabase
          .from("gallery")
          .update({ position: overPosition })
          .eq("id", active.id),
        supabase
          .from("gallery")
          .update({ position: activePosition })
          .eq("id", over.id),
      ])
    } catch (error) {
      console.error("Error updating positions:", error)
      // Revert on error
      fetchGallery()
      alert("Sıralama güncellenirken bir hata oluştu")
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
    isOver,
  }: {
    item: GalleryItem
    onDelete: (id: string, imageUrl: string) => void
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
        className={`overflow-hidden transition-all duration-200 ${
          isDragging
            ? "opacity-30 scale-95"
            : isOver
            ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-xl"
            : "opacity-100"
        }`}
      >
        <div className="relative aspect-square">
          <Image
            src={item.image_url}
            alt={item.title || "Galeri görseli"}
            fill
            className="object-cover"
          />
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 cursor-grab active:cursor-grabbing hover:bg-white shadow-lg transition-colors z-10"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          {isOver && (
            <div className="absolute inset-0 bg-primary/20 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-20">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium">
                Buraya Bırak
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <p className="font-medium mb-3">{item.title || "Başlıksız"}</p>
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
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Yönetim paneline hoş geldiniz</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </Button>
          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="iletisim">
              İletişim
              {messages.filter((m) => !m.read).length > 0 && (
                <Badge className="ml-2">{messages.filter((m) => !m.read).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="galeri">
              Galeri
            </TabsTrigger>
          </TabsList>

          <TabsContent value="iletisim" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Management</h2>
              <p className="text-muted-foreground mb-6">
                İletişim formundan gelen mesajları görüntüleyin ve yönetin
              </p>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                variant={messageFilter === "all" ? "default" : "outline"}
                onClick={() => setMessageFilter("all")}
                size="sm"
              >
                Tüm Mesajlar ({messages.length})
              </Button>
              <Button
                variant={messageFilter === "unread" ? "default" : "outline"}
                onClick={() => setMessageFilter("unread")}
                size="sm"
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
                    className={message.read ? "opacity-75" : "border-primary/50"}
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
                              {message.email}
                            </CardDescription>
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
                        {!message.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(message.id)}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Okundu İşaretle
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
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
            <div>
              <h2 className="text-2xl font-bold mb-4">Gallery Management</h2>
              <p className="text-muted-foreground mb-6">
                Galeri görsellerini yönetin ve yeni görseller ekleyin
              </p>
            </div>

            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Yeni Görsel Ekle</CardTitle>
                <CardDescription>Galeriye yeni görsel yükleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button asChild variant="outline" disabled={uploading}>
                      <span className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {uploading ? "Yükleniyor..." : "Görsel Seç"}
                      </span>
                    </Button>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
              </CardContent>
            </Card>

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
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                      <SortableGalleryItem
                        key={item.id}
                        item={item}
                        onDelete={handleDeleteImage}
                        isOver={overId === item.id && activeId !== item.id}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <Card className="overflow-hidden shadow-2xl ring-2 ring-primary scale-110 rotate-2">
                      <div className="relative aspect-square w-64">
                        <Image
                          src={galleryItems.find((item) => item.id === activeId)?.image_url || ""}
                          alt={galleryItems.find((item) => item.id === activeId)?.title || "Galeri görseli"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-lg px-3 py-1.5 font-medium">
                          Sürüklüyor...
                        </div>
                      </div>
                    </Card>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
    </ProtectedRoute>
  )
}
