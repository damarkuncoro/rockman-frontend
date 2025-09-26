"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconPhone,
  IconUser,
  IconCalendar,
  IconShield,
  IconStar,
  IconStarFilled,
  IconCheck,
  IconX,
  IconRefresh,
  IconCopy,
  IconExternalLink,
  IconHistory,
  IconSettings,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Switch } from "@/components/shadcn/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/ui/dialog"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
import { Separator } from "@/components/shadcn/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs"

/**
 * Interface untuk data nomor telepon lengkap
 */
interface UserPhone {
  id: number
  userId: number
  label: string
  phoneNumber: string
  countryCode: string
  isDefault: boolean
  isActive: boolean
  isVerified: boolean
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Interface untuk data user
 */
interface User {
  id: number
  name: string
  email: string
  username: string
}

/**
 * Interface untuk form data edit
 */
interface PhoneEditFormData {
  label: string
  phoneNumber: string
  countryCode: string
  isDefault: boolean
  isActive: boolean
}

/**
 * Interface untuk log verifikasi
 */
interface VerificationLog {
  id: number
  phoneId: number
  action: string
  status: string
  verificationCode: string | null
  attemptedAt: string
  verifiedAt: string | null
  ipAddress: string | null
  userAgent: string | null
}

/**
 * Komponen halaman detail nomor telepon
 */
export default function PhoneDetailPage() {
  const router = useRouter()
  const params = useParams()
  const phoneId = params.id as string

  const [phone, setPhone] = useState<UserPhone | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State untuk modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)

  // State untuk form edit
  const [editFormData, setEditFormData] = useState<PhoneEditFormData>({
    label: "",
    phoneNumber: "",
    countryCode: "+62",
    isDefault: false,
    isActive: true,
  })

  // State untuk loading actions
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Fetch data nomor telepon
   */
  const fetchPhone = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Tambahkan userId sebagai query parameter
      const response = await fetch(`http://localhost:9999/api/v1/user-phones/${phoneId}?userId=23`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Nomor telepon tidak ditemukan')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPhone(data.data)

      // Fetch user data jika ada
      if (data.data?.userId) {
        await fetchUser(data.data.userId)
      }
    } catch (err) {
      console.error('Error fetching phone:', err)
      setError(err instanceof Error ? err.message : 'Gagal memuat data nomor telepon')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fetch data user
   */
  const fetchUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/users/${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
      }
    } catch (err) {
      console.error('Error fetching user:', err)
    }
  }

  /**
   * Fetch log verifikasi
   */
  const fetchVerificationLogs = async () => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/user-phones/${phoneId}/verification-logs?userId=23`)
      
      if (response.ok) {
        const data = await response.json()
        setVerificationLogs(data.data || [])
      } else {
        // Handle case ketika endpoint tidak tersedia atau error
        console.warn('Verification logs endpoint not available or returned error:', response.status)
        setVerificationLogs([])
      }
    } catch (err) {
      console.error('Error fetching verification logs:', err)
      // Set empty array jika terjadi error
      setVerificationLogs([])
    }
  }

  /**
   * Handle submit form edit
   */
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`http://localhost:9999/api/v1/user-phones/${phoneId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh data
      await fetchPhone()
      
      // Close modal
      setIsEditModalOpen(false)
      
    } catch (err) {
      console.error('Error updating phone:', err)
      setError('Gagal memperbarui data nomor telepon')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle delete nomor telepon
   */
  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`http://localhost:9999/api/v1/user-phones/${phoneId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Redirect ke halaman manajemen
      router.push('/phone-management')
      
    } catch (err) {
      console.error('Error deleting phone:', err)
      setError('Gagal menghapus nomor telepon')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle set default nomor telepon
   */
  const handleSetDefault = async () => {
    try {
      setError(null)

      const response = await fetch(`http://localhost:9999/api/v1/user-phones/${phoneId}/set-default`, {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh data
      await fetchPhone()
      
    } catch (err) {
      console.error('Error setting default phone:', err)
      setError('Gagal mengatur nomor telepon default')
    }
  }

  /**
   * Handle verify nomor telepon
   */
  const handleVerify = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`http://localhost:9999/api/v1/user-phones/${phoneId}/verify`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh data
      await fetchPhone()
      await fetchVerificationLogs()
      
      // Close modal
      setIsVerifyModalOpen(false)
      
    } catch (err) {
      console.error('Error verifying phone:', err)
      setError('Gagal memverifikasi nomor telepon')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle copy nomor telepon
   */
  const handleCopyPhone = async () => {
    if (!phone) return

    try {
      await navigator.clipboard.writeText(`${phone.countryCode}${phone.phoneNumber}`)
      // Bisa tambahkan toast notification di sini
    } catch (err) {
      console.error('Error copying phone number:', err)
    }
  }

  /**
   * Handle open edit modal
   */
  const handleEditClick = () => {
    if (!phone) return

    setEditFormData({
      label: phone.label,
      phoneNumber: phone.phoneNumber,
      countryCode: phone.countryCode,
      isDefault: phone.isDefault,
      isActive: phone.isActive,
    })
    setIsEditModalOpen(true)
  }

  // Load data saat component mount
  useEffect(() => {
    if (phoneId) {
      fetchPhone()
      fetchVerificationLogs()
    }
  }, [phoneId])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted animate-pulse rounded" />
              <div className="h-48 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted animate-pulse rounded" />
              <div className="h-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !phone) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push('/phone-management')}>
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Manajemen Nomor Telepon
          </Button>
        </div>
      </div>
    )
  }

  if (!phone) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <IconPhone className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">Nomor telepon tidak ditemukan</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Nomor telepon yang Anda cari tidak ada atau telah dihapus.
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push('/phone-management')}>
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Manajemen Nomor Telepon
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/phone-management')}>
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detail Nomor Telepon</h1>
            <p className="text-muted-foreground">
              {phone.countryCode} {phone.phoneNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyPhone}>
            <IconCopy className="mr-2 h-4 w-4" />
            Salin Nomor
          </Button>
          <Button variant="outline" onClick={handleEditClick}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phone Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPhone className="h-5 w-5" />
                Informasi Nomor Telepon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                  <p className="text-sm font-mono">{phone.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Label</Label>
                  <p className="text-sm">{phone.label}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nomor Telepon</Label>
                  <p className="text-sm font-mono">{phone.countryCode} {phone.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Kode Negara</Label>
                  <p className="text-sm">{phone.countryCode}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                {phone.isDefault && (
                  <Badge variant="default">
                    <IconStar className="mr-1 h-3 w-3" />
                    Default
                  </Badge>
                )}
                {phone.isVerified ? (
                  <Badge variant="secondary">
                    <IconShield className="mr-1 h-3 w-3" />
                    Terverifikasi
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Belum Terverifikasi
                  </Badge>
                )}
                <Badge variant={phone.isActive ? "default" : "destructive"}>
                  {phone.isActive ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Dibuat</Label>
                  <p className="text-sm">{new Date(phone.createdAt).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Diperbarui</Label>
                  <p className="text-sm">{new Date(phone.updatedAt).toLocaleString('id-ID')}</p>
                </div>
                {phone.verifiedAt && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Diverifikasi</Label>
                    <p className="text-sm">{new Date(phone.verifiedAt).toLocaleString('id-ID')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs untuk konten tambahan */}
          <Tabs defaultValue="logs" className="w-full">
            <TabsList>
              <TabsTrigger value="logs">Log Verifikasi</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconHistory className="h-5 w-5" />
                    Log Verifikasi
                  </CardTitle>
                  <CardDescription>
                    Riwayat percobaan verifikasi nomor telepon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {verificationLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <IconHistory className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Belum ada log verifikasi
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {verificationLogs.map((log) => (
                        <div key={log.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                              {log.action}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.attemptedAt).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="text-muted-foreground">Status</Label>
                              <p>{log.status}</p>
                            </div>
                            {log.ipAddress && (
                              <div>
                                <Label className="text-muted-foreground">IP Address</Label>
                                <p className="font-mono">{log.ipAddress}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconSettings className="h-5 w-5" />
                    Pengaturan Nomor Telepon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Jadikan Default</Label>
                      <p className="text-sm text-muted-foreground">
                        Jadikan nomor telepon ini sebagai nomor utama
                      </p>
                    </div>
                    <Button
                      variant={phone.isDefault ? "secondary" : "outline"}
                      onClick={handleSetDefault}
                      disabled={phone.isDefault}
                    >
                      {phone.isDefault ? (
                        <>
                          <IconStarFilled className="mr-2 h-4 w-4" />
                          Sudah Default
                        </>
                      ) : (
                        <>
                          <IconStar className="mr-2 h-4 w-4" />
                          Jadikan Default
                        </>
                      )}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Verifikasi Nomor</Label>
                      <p className="text-sm text-muted-foreground">
                        Verifikasi kepemilikan nomor telepon
                      </p>
                    </div>
                    <Button
                      variant={phone.isVerified ? "secondary" : "outline"}
                      onClick={() => setIsVerifyModalOpen(true)}
                      disabled={phone.isVerified}
                    >
                      {phone.isVerified ? (
                        <>
                          <IconShield className="mr-2 h-4 w-4" />
                          Terverifikasi
                        </>
                      ) : (
                        <>
                          <IconShield className="mr-2 h-4 w-4" />
                          Verifikasi
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="h-5 w-5" />
                  Pemilik Nomor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nama</Label>
                  <p className="text-sm">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                  <p className="text-sm">{user.username}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="w-full"
                >
                  <IconExternalLink className="mr-2 h-4 w-4" />
                  Lihat Profil User
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" onClick={fetchPhone} className="w-full">
                <IconRefresh className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyPhone} className="w-full">
                <IconCopy className="mr-2 h-4 w-4" />
                Salin Nomor
              </Button>
              <Button variant="outline" size="sm" onClick={handleEditClick} className="w-full">
                <IconEdit className="mr-2 h-4 w-4" />
                Edit Nomor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Nomor Telepon</DialogTitle>
            <DialogDescription>
              Ubah informasi nomor telepon.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label</Label>
              <Input
                id="edit-label"
                value={editFormData.label}
                onChange={(e) => setEditFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Contoh: Rumah, Kantor, HP Utama"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-countryCode">Kode Negara</Label>
                <Select 
                  value={editFormData.countryCode} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, countryCode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+62">+62 (Indonesia)</SelectItem>
                    <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    <SelectItem value="+65">+65 (Singapore)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber">Nomor Telepon</Label>
                <Input
                  id="edit-phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="81234567890"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isDefault"
                  checked={editFormData.isDefault}
                  onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isDefault: checked }))}
                />
                <Label htmlFor="edit-isDefault">Jadikan nomor telepon default</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={editFormData.isActive}
                  onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="edit-isActive">Nomor telepon aktif</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Nomor Telepon</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus nomor telepon ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Label:</strong> {phone.label}</p>
              <p><strong>Nomor:</strong> {phone.countryCode} {phone.phoneNumber}</p>
              <p><strong>User ID:</strong> {phone.userId}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Modal */}
      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifikasi Nomor Telepon</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin memverifikasi nomor telepon ini?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Nomor:</strong> {phone.countryCode} {phone.phoneNumber}</p>
              <p><strong>Label:</strong> {phone.label}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleVerify} disabled={isSubmitting}>
              {isSubmitting ? "Memverifikasi..." : "Verifikasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}