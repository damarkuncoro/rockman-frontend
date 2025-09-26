"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEye,
  IconEdit,
  IconTrash,
  IconPhone,
  IconUser,
  IconMapPin,
  IconStar,
  IconStarFilled,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconDownload,
  IconX,
  IconCheck,
  IconShield,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Switch } from "@/components/shadcn/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/ui/dialog"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
import { Separator } from "@/components/shadcn/ui/separator"

/**
 * Interface untuk data nomor telepon user
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
 * Interface untuk form data nomor telepon
 */
interface PhoneFormData {
  userId: number
  label: string
  phoneNumber: string
  countryCode: string
  isDefault: boolean
}

/**
 * Interface untuk filter
 */
interface PhoneFilters {
  search: string
  userId: string
  countryCode: string
  isDefault: string
  isActive: string
  isVerified: string
}

/**
 * Komponen halaman manajemen nomor telepon untuk admin
 */
export default function PhoneManagementPage() {
  const router = useRouter()

  const [phones, setPhones] = useState<UserPhone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State untuk modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState<UserPhone | null>(null)

  // State untuk form
  const [formData, setFormData] = useState<PhoneFormData>({
    userId: 0,
    label: "",
    phoneNumber: "",
    countryCode: "+62",
    isDefault: false,
  })

  // State untuk filter dan pagination
  const [filters, setFilters] = useState<PhoneFilters>({
    search: "",
    userId: "",
    countryCode: "",
    isDefault: "all",
    isActive: "all",
    isVerified: "all",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // State untuk loading actions
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Fetch data nomor telepon dengan filter dan pagination
   */
  const fetchPhones = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.countryCode && { countryCode: filters.countryCode }),
        ...(filters.isDefault && filters.isDefault !== "all" && { isDefault: filters.isDefault }),
        ...(filters.isActive && filters.isActive !== "all" && { isActive: filters.isActive }),
        ...(filters.isVerified && filters.isVerified !== "all" && { isVerified: filters.isVerified }),
      })

      const response = await fetch(`http://localhost:9999/api/v1/user-phones?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setPhones(data.data || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalItems(data.pagination?.totalItems || 0)
    } catch (err) {
      console.error('Error fetching phones:', err)
      setError('Gagal memuat data nomor telepon')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle submit form create/edit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      setError(null)

      const url = selectedPhone 
        ? `http://localhost:9999/api/v1/user-phones/${selectedPhone.id}`
        : 'http://localhost:9999/api/v1/user-phones'
      
      const method = selectedPhone ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh data
      await fetchPhones()
      
      // Close modal dan reset form
      setIsCreateModalOpen(false)
      setIsEditModalOpen(false)
      setSelectedPhone(null)
      resetForm()
      
    } catch (err) {
      console.error('Error submitting phone:', err)
      setError('Gagal menyimpan data nomor telepon')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle delete nomor telepon
   */
  const handleDelete = async () => {
    if (!selectedPhone) return

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`http://localhost:9999/api/v1/user-phones/${selectedPhone.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh data
      await fetchPhones()
      
      // Close modal
      setIsDeleteModalOpen(false)
      setSelectedPhone(null)
      
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
  const handleSetDefault = async (phone: UserPhone) => {
    try {
      setError(null)

      const response = await fetch(`http://localhost:9999/api/v1/user-phones/${phone.id}/set-default`, {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh data
      await fetchPhones()
      
    } catch (err) {
      console.error('Error setting default phone:', err)
      setError('Gagal mengatur nomor telepon default')
    }
  }

  /**
   * Reset form data
   */
  const resetForm = () => {
    setFormData({
      userId: 0,
      label: "",
      phoneNumber: "",
      countryCode: "+62",
      isDefault: false,
    })
  }

  /**
   * Handle open edit modal
   */
  const handleEdit = (phone: UserPhone) => {
    setSelectedPhone(phone)
    setFormData({
      userId: phone.userId,
      label: phone.label,
      phoneNumber: phone.phoneNumber,
      countryCode: phone.countryCode,
      isDefault: phone.isDefault,
    })
    setIsEditModalOpen(true)
  }

  /**
   * Handle open delete modal
   */
  const handleDeleteClick = (phone: UserPhone) => {
    setSelectedPhone(phone)
    setIsDeleteModalOpen(true)
  }

  /**
   * Handle filter change
   */
  const handleFilterChange = (key: keyof PhoneFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset ke halaman pertama
  }

  /**
   * Handle clear filters
   */
  const handleClearFilters = () => {
    setFilters({
      search: "",
      userId: "",
      countryCode: "",
      isDefault: "all",
      isActive: "all",
      isVerified: "all",
    })
    setCurrentPage(1)
  }

  // Load data saat component mount atau filter berubah
  useEffect(() => {
    fetchPhones()
  }, [currentPage, filters])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Nomor Telepon</h1>
          <p className="text-muted-foreground">
            Kelola nomor telepon pengguna sistem
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah Nomor Telepon
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Pencarian</Label>
              <Input
                id="search"
                placeholder="Cari nomor telepon atau label..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Filter berdasarkan User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryCode">Kode Negara</Label>
              <Select value={filters.countryCode} onValueChange={(value) => handleFilterChange('countryCode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua kode negara" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua kode negara</SelectItem>
                  <SelectItem value="+62">+62 (Indonesia)</SelectItem>
                  <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                  <SelectItem value="+44">+44 (UK)</SelectItem>
                  <SelectItem value="+65">+65 (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isDefault">Status Default</Label>
              <Select value={filters.isDefault} onValueChange={(value) => handleFilterChange('isDefault', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="true">Default</SelectItem>
                  <SelectItem value="false">Bukan Default</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isVerified">Status Verifikasi</Label>
              <Select value={filters.isVerified} onValueChange={(value) => handleFilterChange('isVerified', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="true">Terverifikasi</SelectItem>
                  <SelectItem value="false">Belum Terverifikasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Status Aktif</Label>
              <Select value={filters.isActive} onValueChange={(value) => handleFilterChange('isActive', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              <IconX className="mr-2 h-4 w-4" />
              Bersihkan Filter
            </Button>
            <Button variant="outline" onClick={fetchPhones}>
              <IconRefresh className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daftar Nomor Telepon</span>
            <span className="text-sm font-normal text-muted-foreground">
              Total: {totalItems} nomor telepon
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : phones.length === 0 ? (
            <div className="text-center py-8">
              <IconPhone className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Tidak ada nomor telepon</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Mulai dengan menambahkan nomor telepon baru.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Nomor Telepon</TableHead>
                    <TableHead>Kode Negara</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {phones.map((phone) => (
                    <TableRow key={phone.id}>
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => router.push(`/users/${phone.userId}`)}
                        >
                          {phone.userId}
                        </Button>
                      </TableCell>
                      <TableCell>{phone.label}</TableCell>
                      <TableCell className="font-mono">
                        {phone.countryCode} {phone.phoneNumber}
                      </TableCell>
                      <TableCell>{phone.countryCode}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
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
                      </TableCell>
                      <TableCell>
                        {new Date(phone.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/phones/${phone.id}`)}
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(phone)}
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          {!phone.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(phone)}
                            >
                              <IconStar className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(phone)}
                          >
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
                    Halaman {currentPage} dari {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <IconChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Nomor Telepon Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi nomor telepon yang akan ditambahkan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-userId">User ID</Label>
              <Input
                id="create-userId"
                type="number"
                value={formData.userId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-label">Label</Label>
              <Input
                id="create-label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Contoh: Rumah, Kantor, HP Utama"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-countryCode">Kode Negara</Label>
                <Select 
                  value={formData.countryCode} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}
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
                <Label htmlFor="create-phoneNumber">Nomor Telepon</Label>
                <Input
                  id="create-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="81234567890"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="create-isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
              />
              <Label htmlFor="create-isDefault">Jadikan nomor telepon default</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Nomor Telepon</DialogTitle>
            <DialogDescription>
              Ubah informasi nomor telepon yang dipilih.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-userId">User ID</Label>
              <Input
                id="edit-userId"
                type="number"
                value={formData.userId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label</Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Contoh: Rumah, Kantor, HP Utama"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-countryCode">Kode Negara</Label>
                <Select 
                  value={formData.countryCode} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}
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
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="81234567890"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
              />
              <Label htmlFor="edit-isDefault">Jadikan nomor telepon default</Label>
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
          {selectedPhone && (
            <div className="py-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Label:</strong> {selectedPhone.label}</p>
                <p><strong>Nomor:</strong> {selectedPhone.countryCode} {selectedPhone.phoneNumber}</p>
                <p><strong>User ID:</strong> {selectedPhone.userId}</p>
              </div>
            </div>
          )}
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
    </div>
  )
}