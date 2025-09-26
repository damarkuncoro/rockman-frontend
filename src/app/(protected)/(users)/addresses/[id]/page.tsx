"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconMapPin,
  IconUser,
  IconPhone,
  IconHome,
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/ui/dialog"
import { Separator } from "@/components/shadcn/ui/separator"

/**
 * Interface untuk data alamat user
 */
interface UserAddress {
  id: number
  userId: number
  label: string
  recipientName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Interface untuk form data alamat
 */
interface AddressFormData {
  label: string
  recipientName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault: boolean
}

/**
 * Komponen halaman detail alamat
 */
export default function AddressDetailPage() {
  const router = useRouter()
  const params = useParams()
  const addressId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [address, setAddress] = useState<UserAddress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userIdFilter, setUserIdFilter] = useState("")

  // State untuk form edit
  const [formData, setFormData] = useState<AddressFormData>({
    label: "",
    recipientName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Indonesia",
    isDefault: false
  })

  /**
   * Fungsi untuk fetch data alamat dari API
   */
  const fetchAddress = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!userIdFilter) {
        setError('User ID diperlukan untuk mengakses alamat')
        return
      }

      const response = await fetch(`http://localhost:9999/api/v1/user_addresses/${addressId}?userId=${userIdFilter}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Alamat tidak ditemukan')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setAddress(result.data)
        // Set form data untuk editing
        setFormData({
          label: result.data.label,
          recipientName: result.data.recipientName,
          phoneNumber: result.data.phoneNumber,
          addressLine1: result.data.addressLine1,
          addressLine2: result.data.addressLine2 || "",
          city: result.data.city,
          province: result.data.province,
          postalCode: result.data.postalCode,
          country: result.data.country,
          isDefault: result.data.isDefault
        })
      } else {
        throw new Error(result.message || 'Gagal mengambil data alamat')
      }
    } catch (err) {
      console.error('Error fetching address:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data alamat')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk mengupdate alamat
   */
  const handleUpdateAddress = async () => {
    try {
      if (!address || !userIdFilter) return

      const response = await fetch(`http://localhost:9999/api/v1/user_addresses/${address.id}?userId=${userIdFilter}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchAddress()
        setIsEditing(false)
        setError(null)
      } else {
        setError(result.message || 'Gagal mengupdate alamat')
      }
    } catch (err) {
      console.error('Error updating address:', err)
      setError('Terjadi kesalahan saat mengupdate alamat')
    }
  }

  /**
   * Fungsi untuk menghapus alamat
   */
  const handleDeleteAddress = async () => {
    try {
      if (!address || !userIdFilter) return

      const response = await fetch(`http://localhost:9999/api/v1/user_addresses/${address.id}?userId=${userIdFilter}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        router.push('/addresses')
      } else {
        setError(result.message || 'Gagal menghapus alamat')
      }
    } catch (err) {
      console.error('Error deleting address:', err)
      setError('Terjadi kesalahan saat menghapus alamat')
    }
  }

  /**
   * Fungsi untuk set alamat sebagai default
   */
  const handleSetDefault = async () => {
    try {
      if (!address || !userIdFilter) return

      const response = await fetch(`http://localhost:9999/api/v1/user_addresses/${address.id}?userId=${userIdFilter}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId: address.id }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchAddress()
        setError(null)
      } else {
        setError(result.message || 'Gagal mengatur alamat default')
      }
    } catch (err) {
      console.error('Error setting default address:', err)
      setError('Terjadi kesalahan saat mengatur alamat default')
    }
  }

  /**
   * Fungsi untuk cancel editing
   */
  const handleCancelEdit = () => {
    if (address) {
      setFormData({
        label: address.label,
        recipientName: address.recipientName,
        phoneNumber: address.phoneNumber,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault
      })
    }
    setIsEditing(false)
    setError(null)
  }

  /**
   * Fungsi untuk format tanggal
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Effect untuk fetch data saat component mount
  useEffect(() => {
    if (userIdFilter && addressId) {
      fetchAddress()
    }
  }, [userIdFilter, addressId])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error && !address) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <IconMapPin className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h2 className="text-2xl font-bold">Alamat Tidak Ditemukan</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Masukkan User ID"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className="w-48"
              type="number"
            />
            <Button onClick={() => fetchAddress()} disabled={!userIdFilter}>
              Coba Lagi
            </Button>
          </div>
          <Button variant="outline" onClick={() => router.push('/addresses')}>
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Alamat
          </Button>
        </div>
      </div>
    )
  }

  if (!address) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/addresses')}>
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detail Alamat</h1>
            <p className="text-muted-foreground">
              Informasi lengkap alamat pengiriman
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!userIdFilter && (
            <Input
              placeholder="User ID"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className="w-32"
              type="number"
            />
          )}
          {!address.isDefault && (
            <Button variant="outline" onClick={handleSetDefault}>
              <IconStar className="mr-2 h-4 w-4" />
              Set Default
            </Button>
          )}
          <Button 
            variant={isEditing ? "outline" : "default"} 
            onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <IconX className="mr-2 h-4 w-4" />
                Batal
              </>
            ) : (
              <>
                <IconEdit className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
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

      {/* Address Details */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Address Information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <IconMapPin className="h-5 w-5" />
                    {isEditing ? "Edit Alamat" : "Informasi Alamat"}
                  </CardTitle>
                  {address.isDefault && (
                    <Badge variant="outline" className="text-yellow-600">
                      <IconStarFilled className="mr-1 h-3 w-3" />
                      Default
                    </Badge>
                  )}
                </div>
                <Badge variant={address.isActive ? "default" : "secondary"}>
                  {address.isActive ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="label">Label Alamat *</Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({...formData, label: e.target.value})}
                        placeholder="Rumah, Kantor, dll"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientName">Nama Penerima *</Label>
                      <Input
                        id="recipientName"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                        placeholder="Nama lengkap penerima"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Nomor Telepon *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressLine1">Alamat Baris 1 *</Label>
                    <Textarea
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                      placeholder="Jalan, nomor rumah, RT/RW"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressLine2">Alamat Baris 2</Label>
                    <Textarea
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                      placeholder="Kelurahan, kecamatan (opsional)"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Kota *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="Jakarta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Provinsi *</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => setFormData({...formData, province: e.target.value})}
                        placeholder="DKI Jakarta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Kode Pos *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Negara</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      placeholder="Indonesia"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) => setFormData({...formData, isDefault: checked})}
                    />
                    <Label htmlFor="isDefault">Jadikan alamat default</Label>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleUpdateAddress} className="flex-1">
                      <IconCheck className="mr-2 h-4 w-4" />
                      Simpan Perubahan
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <IconX className="mr-2 h-4 w-4" />
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Label Alamat</Label>
                      <p className="text-lg font-medium">{address.label}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nama Penerima</Label>
                      <p className="text-lg font-medium flex items-center gap-2">
                        <IconUser className="h-4 w-4" />
                        {address.recipientName}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nomor Telepon</Label>
                    <p className="text-lg font-medium flex items-center gap-2">
                      <IconPhone className="h-4 w-4" />
                      {address.phoneNumber}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Alamat Lengkap</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="text-base leading-relaxed flex items-start gap-2">
                        <IconHome className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span>
                          {address.addressLine1}
                          {address.addressLine2 && (
                            <>
                              <br />
                              {address.addressLine2}
                            </>
                          )}
                          <br />
                          {address.city}, {address.province} {address.postalCode}
                          <br />
                          {address.country}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Alamat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status Aktif</span>
                <Badge variant={address.isActive ? "default" : "secondary"}>
                  {address.isActive ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alamat Default</span>
                {address.isDefault ? (
                  <Badge variant="outline" className="text-yellow-600">
                    <IconStarFilled className="mr-1 h-3 w-3" />
                    Ya
                  </Badge>
                ) : (
                  <Badge variant="outline">Tidak</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User ID</span>
                <Badge variant="outline">{address.userId}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                Riwayat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Dibuat</Label>
                <p className="text-sm">{formatDate(address.createdAt)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Terakhir Diupdate</Label>
                <p className="text-sm">{formatDate(address.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!address.isDefault && (
                <Button variant="outline" className="w-full" onClick={handleSetDefault}>
                  <IconStar className="mr-2 h-4 w-4" />
                  Jadikan Default
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <IconEdit className="mr-2 h-4 w-4" />
                {isEditing ? "Batal Edit" : "Edit Alamat"}
              </Button>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Hapus Alamat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus alamat "{address.label}"?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteAddress}>
              Hapus Alamat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}