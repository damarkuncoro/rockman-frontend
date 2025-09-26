"use client"

import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconFilter,
  IconMapPin,
  IconHome,
  IconStar,
  IconStarFilled,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/ui/dialog"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"

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
 * Komponen utama halaman manajemen alamat
 */
export default function AddressesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [userIdFilter, setUserIdFilter] = useState("")
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // State untuk modal
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // State untuk form edit/add
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
  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (userIdFilter) params.append('userId', userIdFilter)
      if (statusFilter !== 'all') {
        params.append('includeInactive', statusFilter === 'inactive' ? 'true' : 'false')
      }
      
      const response = await fetch(`http://localhost:9999/api/v1/user-addresses?${params}`)
      
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
      if (!userIdFilter) {
        setError('Silakan pilih user terlebih dahulu')
        return
      }

      const response = await fetch(`http://localhost:9999/api/v1/user_addresses?userId=${userIdFilter}`, {
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
      if (!selectedAddress || !userIdFilter) return

      const response = await fetch(`http://localhost:9999/api/v1/user_addresses/${selectedAddress.id}?userId=${userIdFilter}`, {
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
        resetForm()
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
      if (!selectedAddress || !userIdFilter) return

      const response = await fetch(`http://localhost:9999/api/v1/user_addresses/${selectedAddress.id}?userId=${userIdFilter}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchAddresses()
        setIsDeleteModalOpen(false)
        setSelectedAddress(null)
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
      if (!userIdFilter) return

      const response = await fetch(`http://localhost:9999/api/v1/user_addresses/${address.id}?userId=${userIdFilter}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId: address.id }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchAddresses()
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
   * Fungsi untuk membuka modal edit
   */
  const openEditModal = (address: UserAddress) => {
    setSelectedAddress(address)
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
    setIsEditModalOpen(true)
  }

  /**
   * Fungsi untuk membuka modal view
   */
  const openViewModal = (address: UserAddress) => {
    setSelectedAddress(address)
    setIsViewModalOpen(true)
  }

  /**
   * Fungsi untuk membuka modal delete
   */
  const openDeleteModal = (address: UserAddress) => {
    setSelectedAddress(address)
    setIsDeleteModalOpen(true)
  }

  // Filter dan search alamat
  const filteredAddresses = useMemo(() => {
    return addresses.filter(address => {
      const matchesSearch = searchTerm === "" || 
        address.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.province.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && address.isActive) ||
        (statusFilter === "inactive" && !address.isActive) ||
        (statusFilter === "default" && address.isDefault)

      return matchesSearch && matchesStatus
    })
  }, [addresses, searchTerm, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAddresses = filteredAddresses.slice(startIndex, startIndex + itemsPerPage)

  // Effect untuk fetch data saat component mount
  useEffect(() => {
    fetchAddresses()
  }, [userIdFilter, statusFilter])

  // Reset halaman saat filter berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, userIdFilter])

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Alamat</h1>
          <p className="text-muted-foreground">
            Kelola alamat pengiriman untuk semua pengguna
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} disabled={!userIdFilter}>
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah Alamat
        </Button>
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari alamat, nama penerima, kota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="User ID"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="w-32"
                type="number"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alamat</CardTitle>
            <IconMapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{addresses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alamat Aktif</CardTitle>
            <IconHome className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addresses.filter(addr => addr.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alamat Default</CardTitle>
            <IconStarFilled className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addresses.filter(addr => addr.isDefault).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hasil Filter</CardTitle>
            <IconSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAddresses.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Alamat</CardTitle>
          <CardDescription>
            Menampilkan {paginatedAddresses.length} dari {filteredAddresses.length} alamat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Penerima</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Kota/Provinsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAddresses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <IconMapPin className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">Tidak ada alamat ditemukan</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAddresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {address.isDefault && (
                            <IconStarFilled className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="font-medium">{address.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{address.recipientName}</div>
                          <div className="text-sm text-muted-foreground">{address.phoneNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="truncate">{address.addressLine1}</div>
                          {address.addressLine2 && (
                            <div className="text-sm text-muted-foreground truncate">
                              {address.addressLine2}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{address.city}</div>
                          <div className="text-sm text-muted-foreground">{address.province}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={address.isActive ? "default" : "secondary"}>
                            {address.isActive ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-yellow-600">
                              Default
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{address.userId}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <IconEdit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewModal(address)}>
                              <IconEye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(address)}>
                              <IconEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {!address.isDefault && (
                              <DropdownMenuItem onClick={() => handleSetDefault(address)}>
                                <IconStar className="mr-2 h-4 w-4" />
                                Set Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => openDeleteModal(address)}
                              className="text-red-600"
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Baris per halaman</p>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Halaman {currentPage} dari {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <IconChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <IconChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal View Address */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Alamat</DialogTitle>
            <DialogDescription>
              Informasi lengkap alamat pengiriman
            </DialogDescription>
          </DialogHeader>
          {selectedAddress && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Label Alamat</Label>
                  <p className="text-sm text-muted-foreground">{selectedAddress.label}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nama Penerima</Label>
                  <p className="text-sm text-muted-foreground">{selectedAddress.recipientName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nomor Telepon</Label>
                  <p className="text-sm text-muted-foreground">{selectedAddress.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Kode Pos</Label>
                  <p className="text-sm text-muted-foreground">{selectedAddress.postalCode}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Alamat Lengkap</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Kota</Label>
                  <p className="text-sm text-muted-foreground">{selectedAddress.city}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Provinsi</Label>
                  <p className="text-sm text-muted-foreground">{selectedAddress.province}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Negara</Label>
                  <p className="text-sm text-muted-foreground">{selectedAddress.country}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Status:</Label>
                  <Badge variant={selectedAddress.isActive ? "default" : "secondary"}>
                    {selectedAddress.isActive ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
                {selectedAddress.isDefault && (
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">Default:</Label>
                    <Badge variant="outline" className="text-yellow-600">
                      <IconStarFilled className="mr-1 h-3 w-3" />
                      Alamat Default
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Add/Edit Address */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false)
          setIsEditModalOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isAddModalOpen ? "Tambah Alamat Baru" : "Edit Alamat"}
            </DialogTitle>
            <DialogDescription>
              {isAddModalOpen 
                ? "Masukkan informasi alamat pengiriman baru" 
                : "Ubah informasi alamat pengiriman"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false)
              setIsEditModalOpen(false)
              resetForm()
            }}>
              Batal
            </Button>
            <Button onClick={isAddModalOpen ? handleAddAddress : handleUpdateAddress}>
              {isAddModalOpen ? "Tambah Alamat" : "Simpan Perubahan"}
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