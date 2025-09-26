"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEye,
  IconEdit,
  IconTrash,
  IconMapPin,
  IconUser,
  IconPhone,
  IconHome,
  IconStar,
  IconStarFilled,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconArrowLeft,
  IconX,
  IconCheck,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/ui/dialog"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
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
  userId: number
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
 * Interface untuk filter
 */
interface AddressFilters {
  search: string
  city: string
  province: string
  isDefault: string
  isActive: string
}

/**
 * Komponen halaman alamat untuk user spesifik
 */
export default function UserAddressesPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State untuk modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null)

  // State untuk form
  const [formData, setFormData] = useState<AddressFormData>({
    userId: parseInt(userId) || 0,
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

  // State untuk filter dan paginasi
  const [filters, setFilters] = useState<AddressFilters>({
    search: "",
    city: "",
    province: "",
    isDefault: "all",
    isActive: "all"
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  /**
   * Fungsi untuk fetch data alamat dari API
   */
  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!userId) {
        throw new Error('User ID tidak ditemukan')
      }

      const response = await fetch(`http://localhost:9998/api/v1/users/${userId}/addresses`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setAddresses(result.data || [])
      } else {
        throw new Error(result.message || 'Gagal mengambil data alamat')
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data alamat')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk menambah alamat baru
   */
  const handleAddAddress = async () => {
    try {
      const response = await fetch(`http://localhost:9998/api/v1/users/${userId}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchAddresses()
        setIsAddModalOpen(false)
        resetForm()
        setError(null)
      } else {
        setError(result.message || 'Gagal menambah alamat')
      }
    } catch (err) {
      console.error('Error adding address:', err)
      setError('Terjadi kesalahan saat menambah alamat')
    }
  }

  /**
   * Fungsi untuk mengupdate alamat
   */
  const handleUpdateAddress = async () => {
    try {
      if (!selectedAddress) return

      const response = await fetch(`http://localhost:9998/api/v1/users/${userId}/addresses/${selectedAddress.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchAddresses()
        setIsEditModalOpen(false)
        setSelectedAddress(null)
        resetForm()
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
      if (!selectedAddress) return

      const response = await fetch(`http://localhost:9998/api/v1/users/${userId}/addresses/${selectedAddress.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchAddresses()
        setIsDeleteModalOpen(false)
        setSelectedAddress(null)
        setError(null)
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
  const handleSetDefault = async (address: UserAddress) => {
    try {
      const response = await fetch(`http://localhost:9998/api/v1/users/${userId}/addresses/${address.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId: address.id }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchAddresses()
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
   * Fungsi untuk reset form
   */
  const resetForm = () => {
    setFormData({
      userId: parseInt(userId) || 0,
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
  }

  /**
   * Fungsi untuk membuka modal view
   */
  const openViewModal = (address: UserAddress) => {
    setSelectedAddress(address)
    setIsViewModalOpen(true)
  }

  /**
   * Fungsi untuk membuka modal edit
   */
  const openEditModal = (address: UserAddress) => {
    setSelectedAddress(address)
    setFormData({
      userId: address.userId,
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
    setIsEditModalOpen(true)
  }

  /**
   * Fungsi untuk membuka modal delete
   */
  const openDeleteModal = (address: UserAddress) => {
    setSelectedAddress(address)
    setIsDeleteModalOpen(true)
  }

  /**
   * Fungsi untuk filter alamat
   */
  const filteredAddresses = addresses.filter(address => {
    const matchesSearch = !filters.search || 
      address.label.toLowerCase().includes(filters.search.toLowerCase()) ||
      address.recipientName.toLowerCase().includes(filters.search.toLowerCase()) ||
      address.phoneNumber.includes(filters.search) ||
      address.addressLine1.toLowerCase().includes(filters.search.toLowerCase()) ||
      address.city.toLowerCase().includes(filters.search.toLowerCase()) ||
      address.province.toLowerCase().includes(filters.search.toLowerCase())

    const matchesCity = !filters.city || address.city.toLowerCase().includes(filters.city.toLowerCase())
    const matchesProvince = !filters.province || address.province.toLowerCase().includes(filters.province.toLowerCase())
    const matchesDefault = filters.isDefault === "all" || address.isDefault.toString() === filters.isDefault
    const matchesActive = filters.isActive === "all" || address.isActive.toString() === filters.isActive

    return matchesSearch && matchesCity && matchesProvince && matchesDefault && matchesActive
  })

  /**
   * Fungsi untuk paginasi
   */
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAddresses = filteredAddresses.slice(startIndex, startIndex + itemsPerPage)

  /**
   * Fungsi untuk format tanggal
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Effect untuk fetch data saat component mount
  useEffect(() => {
    if (userId) {
      fetchAddresses()
    }
  }, [userId])

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alamat Pengguna</h1>
            <p className="text-muted-foreground">
              Kelola alamat pengiriman untuk User ID: {userId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchAddresses()}>
            <IconRefresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            Tambah Alamat
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Pencarian</Label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari alamat, nama, telepon..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="city">Kota</Label>
              <Input
                id="city"
                placeholder="Filter berdasarkan kota"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="province">Provinsi</Label>
              <Input
                id="province"
                placeholder="Filter berdasarkan provinsi"
                value={filters.province}
                onChange={(e) => setFilters({...filters, province: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="isDefault">Status Default</Label>
              <Select value={filters.isDefault} onValueChange={(value) => setFilters({...filters, isDefault: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="true">Default</SelectItem>
                  <SelectItem value="false">Bukan Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="isActive">Status Aktif</Label>
              <Select value={filters.isActive} onValueChange={(value) => setFilters({...filters, isActive: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Alamat</CardTitle>
            <Badge variant="outline">
              {filteredAddresses.length} alamat
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : paginatedAddresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <IconMapPin className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Tidak Ada Alamat</h3>
                <p className="text-muted-foreground">
                  Pengguna ini belum memiliki alamat pengiriman.
                </p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <IconPlus className="mr-2 h-4 w-4" />
                Tambah Alamat Pertama
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Penerima</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kota</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAddresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.label}</span>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-yellow-600">
                              <IconStarFilled className="mr-1 h-3 w-3" />
                              Default
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{address.recipientName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{address.phoneNumber}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-sm text-muted-foreground truncate">{address.addressLine2}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{address.city}</p>
                          <p className="text-sm text-muted-foreground">{address.province}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={address.isActive ? "default" : "secondary"}>
                            {address.isActive ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(address.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openViewModal(address)}>
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(address)}>
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          {!address.isDefault && (
                            <Button variant="ghost" size="sm" onClick={() => handleSetDefault(address)}>
                              <IconStar className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => openDeleteModal(address)}>
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAddresses.length)} dari {filteredAddresses.length} alamat
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <IconChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <span className="text-sm">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal View Address */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              Detail Alamat
            </DialogTitle>
          </DialogHeader>
          {selectedAddress && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Label Alamat</Label>
                  <p className="text-lg font-medium">{selectedAddress.label}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nama Penerima</Label>
                  <p className="text-lg font-medium">{selectedAddress.recipientName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                  <p>{selectedAddress.userId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nomor Telepon</Label>
                  <p>{selectedAddress.phoneNumber}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Alamat Lengkap</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="leading-relaxed">
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 && (
                      <>
                        <br />
                        {selectedAddress.addressLine2}
                      </>
                    )}
                    <br />
                    {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
                    <br />
                    {selectedAddress.country}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedAddress.isActive ? "default" : "secondary"}>
                    {selectedAddress.isActive ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
                {selectedAddress.isDefault && (
                  <Badge variant="outline" className="text-yellow-600">
                    <IconStarFilled className="mr-1 h-3 w-3" />
                    Alamat Default
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Add Address */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Alamat Baru</DialogTitle>
            <DialogDescription>
              Tambahkan alamat pengiriman baru untuk pengguna
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-userId">User ID</Label>
                <Input
                  id="add-userId"
                  type="number"
                  value={formData.userId || ""}
                  onChange={(e) => setFormData({...formData, userId: parseInt(e.target.value) || 0})}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="add-label">Label Alamat *</Label>
                <Input
                  id="add-label"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  placeholder="Rumah, Kantor, dll"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-recipientName">Nama Penerima *</Label>
                <Input
                  id="add-recipientName"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  placeholder="Nama lengkap penerima"
                />
              </div>
              <div>
                <Label htmlFor="add-phoneNumber">Nomor Telepon *</Label>
                <Input
                  id="add-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="add-addressLine1">Alamat Baris 1 *</Label>
              <Textarea
                id="add-addressLine1"
                value={formData.addressLine1}
                onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                placeholder="Jalan, nomor rumah, RT/RW"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="add-addressLine2">Alamat Baris 2</Label>
              <Textarea
                id="add-addressLine2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                placeholder="Kelurahan, kecamatan (opsional)"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="add-city">Kota *</Label>
                <Input
                  id="add-city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Jakarta"
                />
              </div>
              <div>
                <Label htmlFor="add-province">Provinsi *</Label>
                <Input
                  id="add-province"
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  placeholder="DKI Jakarta"
                />
              </div>
              <div>
                <Label htmlFor="add-postalCode">Kode Pos *</Label>
                <Input
                  id="add-postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  placeholder="12345"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="add-country">Negara</Label>
              <Input
                id="add-country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Indonesia"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="add-isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({...formData, isDefault: checked})}
              />
              <Label htmlFor="add-isDefault">Jadikan alamat default</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsAddModalOpen(false); resetForm()}}>
              Batal
            </Button>
            <Button onClick={handleAddAddress}>
              <IconCheck className="mr-2 h-4 w-4" />
              Tambah Alamat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Address */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Alamat</DialogTitle>
            <DialogDescription>
              Perbarui informasi alamat pengiriman
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-userId">User ID</Label>
                <Input
                  id="edit-userId"
                  type="number"
                  value={formData.userId || ""}
                  onChange={(e) => setFormData({...formData, userId: parseInt(e.target.value) || 0})}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="edit-label">Label Alamat *</Label>
                <Input
                  id="edit-label"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  placeholder="Rumah, Kantor, dll"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-recipientName">Nama Penerima *</Label>
                <Input
                  id="edit-recipientName"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  placeholder="Nama lengkap penerima"
                />
              </div>
              <div>
                <Label htmlFor="edit-phoneNumber">Nomor Telepon *</Label>
                <Input
                  id="edit-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-addressLine1">Alamat Baris 1 *</Label>
              <Textarea
                id="edit-addressLine1"
                value={formData.addressLine1}
                onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                placeholder="Jalan, nomor rumah, RT/RW"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="edit-addressLine2">Alamat Baris 2</Label>
              <Textarea
                id="edit-addressLine2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                placeholder="Kelurahan, kecamatan (opsional)"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-city">Kota *</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Jakarta"
                />
              </div>
              <div>
                <Label htmlFor="edit-province">Provinsi *</Label>
                <Input
                  id="edit-province"
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  placeholder="DKI Jakarta"
                />
              </div>
              <div>
                <Label htmlFor="edit-postalCode">Kode Pos *</Label>
                <Input
                  id="edit-postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  placeholder="12345"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-country">Negara</Label>
              <Input
                id="edit-country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Indonesia"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({...formData, isDefault: checked})}
              />
              <Label htmlFor="edit-isDefault">Jadikan alamat default</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsEditModalOpen(false); setSelectedAddress(null); resetForm()}}>
              Batal
            </Button>
            <Button onClick={handleUpdateAddress}>
              <IconCheck className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus alamat "{selectedAddress?.label}"?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsDeleteModalOpen(false); setSelectedAddress(null)}}>
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