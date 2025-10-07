"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/ui/pagination"
import { Checkbox } from "@/components/shadcn/ui/checkbox"
import { toast } from "sonner"
import { PlusCircle, Search, Eye, Pencil, Trash2, Phone } from "lucide-react"

// Interface untuk data nomor telepon
interface UserPhone {
  id: string
  userId: string
  phoneNumber: string
  countryCode: string
  isDefault: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// Interface untuk data form nomor telepon
interface PhoneFormData {
  userId: string
  phoneNumber: string
  countryCode: string
  isDefault: boolean
}

// Interface untuk filter pencarian
interface PhoneFilters {
  userId: string
  countryCode: string
  isDefault: string
}

export default function PhoneManagementPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<PhoneFilters>({
    userId: "",
    countryCode: "",
    isDefault: "",
  })
  const [phones, setPhones] = useState<UserPhone[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  })

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState<UserPhone | null>(null)
  const [formData, setFormData] = useState<PhoneFormData>({
    userId: "",
    phoneNumber: "",
    countryCode: "+62",
    isDefault: false,
  })

  // Fetch phones on initial load and when filters/pagination change
  useEffect(() => {
    fetchPhones()
  }, [pagination.currentPage, filters])

  // Fetch phones from API
  const fetchPhones = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Construct query parameters
      const params = new URLSearchParams()
      params.append("page", pagination.currentPage.toString())
      params.append("limit", pagination.itemsPerPage.toString())
      
      if (search) {
        params.append("search", search)
      }
      
      if (filters.userId) {
        params.append("userId", filters.userId)
      }
      
      if (filters.countryCode) {
        params.append("countryCode", filters.countryCode)
      }
      
      if (filters.isDefault) {
        params.append("isDefault", filters.isDefault)
      }

      // Mock API response for demonstration
      const mockResponse = {
        data: Array.from({ length: 10 }, (_, i) => ({
          id: `phone-${i + 1}`,
          userId: `user-${Math.floor(Math.random() * 5) + 1}`,
          phoneNumber: `81234567${i.toString().padStart(2, '0')}`,
          countryCode: "+62",
          isDefault: i === 0,
          isVerified: Math.random() > 0.3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        pagination: {
          currentPage: pagination.currentPage,
          totalPages: 5,
          totalItems: 50,
          itemsPerPage: pagination.itemsPerPage,
        },
      }

      // Update state with response data
      setPhones(mockResponse.data)
      setPagination(mockResponse.pagination)
    } catch (err) {
      setError("Gagal memuat data nomor telepon")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search form submission
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    pagination.currentPage = 1
    fetchPhones()
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof PhoneFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  // Reset form data
  const resetFormData = () => {
    setFormData({
      userId: "",
      phoneNumber: "",
      countryCode: "+62",
      isDefault: false,
    })
  }

  // Open add dialog
  const openAddDialog = () => {
    resetFormData()
    setIsAddDialogOpen(true)
  }

  // Open edit dialog
  const openEditDialog = (phone: UserPhone) => {
    setSelectedPhone(phone)
    setFormData({
      userId: phone.userId,
      phoneNumber: phone.phoneNumber,
      countryCode: phone.countryCode,
      isDefault: phone.isDefault,
    })
    setIsEditDialogOpen(true)
  }

  // Open view dialog
  const openViewDialog = (phone: UserPhone) => {
    setSelectedPhone(phone)
    setIsViewDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (phone: UserPhone) => {
    setSelectedPhone(phone)
    setIsDeleteDialogOpen(true)
  }

  // Handle form input changes
  const handleFormChange = (key: keyof PhoneFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // Handle add phone submission
  const handleAddPhone = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Add new phone to list
      const newPhone: UserPhone = {
        id: `phone-${Date.now()}`,
        userId: formData.userId,
        phoneNumber: formData.phoneNumber,
        countryCode: formData.countryCode,
        isDefault: formData.isDefault,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setPhones((prev) => [newPhone, ...prev])
      setIsAddDialogOpen(false)
      toast.success("Nomor telepon berhasil ditambahkan")
      resetFormData()
    } catch (err) {
      toast.error("Gagal menambahkan nomor telepon")
      console.error(err)
    }
  }

  // Handle edit phone submission
  const handleEditPhone = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedPhone) return
    
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Update phone in list
      setPhones((prev) =>
        prev.map((phone) =>
          phone.id === selectedPhone.id
            ? {
                ...phone,
                userId: formData.userId,
                phoneNumber: formData.phoneNumber,
                countryCode: formData.countryCode,
                isDefault: formData.isDefault,
                updatedAt: new Date().toISOString(),
              }
            : phone
        )
      )
      
      setIsEditDialogOpen(false)
      toast.success("Nomor telepon berhasil diperbarui")
      resetFormData()
    } catch (err) {
      toast.error("Gagal memperbarui nomor telepon")
      console.error(err)
    }
  }

  // Handle delete phone
  const handleDeletePhone = async () => {
    if (!selectedPhone) return
    
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Remove phone from list
      setPhones((prev) => prev.filter((phone) => phone.id !== selectedPhone.id))
      
      setIsDeleteDialogOpen(false)
      toast.success("Nomor telepon berhasil dihapus")
    } catch (err) {
      toast.error("Gagal menghapus nomor telepon")
      console.error(err)
    }
  }

  // Render pagination controls
  const renderPagination = () => {
    const { currentPage, totalPages } = pagination
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                if (currentPage > 1) handlePageChange(currentPage - 1)
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show first page, last page, current page, and pages around current
              return (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              )
            })
            .map((page, index, array) => {
              // Add ellipsis between non-consecutive pages
              const showEllipsisBefore =
                index > 0 && array[index - 1] !== page - 1
              const showEllipsisAfter =
                index < array.length - 1 && array[index + 1] !== page + 1
              
              return (
                <div key={page} className="flex items-center">
                  {showEllipsisBefore && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  
                  {showEllipsisAfter && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </div>
              )
            })}
          
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                if (currentPage < totalPages) handlePageChange(currentPage + 1)
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Nomor Telepon</h1>
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Nomor Telepon
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <div>
            <form onSubmit={handleSearchSubmit} className="flex space-x-2">
              <Input
                placeholder="Cari nomor telepon..."
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="userId" className="mb-1 block text-sm">
              User ID
            </Label>
            <Input
              id="userId"
              placeholder="Filter berdasarkan User ID"
              value={filters.userId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFilterChange("userId", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="countryCode" className="mb-1 block text-sm">
              Kode Negara
            </Label>
            <Input
              id="countryCode"
              placeholder="Filter berdasarkan kode negara"
              value={filters.countryCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFilterChange("countryCode", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="isDefault" className="mb-1 block text-sm">
              Status Default
            </Label>
            <Select
              value={filters.isDefault}
              onValueChange={(value: string) => handleFilterChange("isDefault", value)}
            >
              <SelectTrigger id="isDefault">
                <SelectValue placeholder="Pilih status default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Memuat data...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Nomor Telepon</TableHead>
                  <TableHead>Kode Negara</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Terverifikasi</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Tidak ada data nomor telepon
                    </TableCell>
                  </TableRow>
                ) : (
                  phones.map((phone) => (
                    <TableRow key={phone.id}>
                      <TableCell>{phone.userId}</TableCell>
                      <TableCell>{phone.phoneNumber}</TableCell>
                      <TableCell>{phone.countryCode}</TableCell>
                      <TableCell>{phone.isDefault ? "Ya" : "Tidak"}</TableCell>
                      <TableCell>{phone.isVerified ? "Ya" : "Tidak"}</TableCell>
                      <TableCell>
                        {new Date(phone.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openViewDialog(phone)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(phone)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(phone)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Menampilkan {phones.length} dari {pagination.totalItems} nomor telepon
            </div>
            {renderPagination()}
          </div>
        </>
      )}

      {/* Dialog Tambah Nomor Telepon */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Nomor Telepon</DialogTitle>
            <DialogDescription>
              Tambahkan nomor telepon baru untuk pengguna.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPhone}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="add-userId">User ID</Label>
                <Input
                  id="add-userId"
                  value={formData.userId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange("userId", e.target.value)}
                  placeholder="Masukkan User ID"
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-countryCode">Kode Negara</Label>
                <Input
                  id="add-countryCode"
                  value={formData.countryCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange("countryCode", e.target.value)}
                  placeholder="Contoh: +62"
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-phoneNumber">Nomor Telepon</Label>
                <Input
                  id="add-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange("phoneNumber", e.target.value)}
                  placeholder="Masukkan nomor telepon tanpa kode negara"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="add-isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked: boolean) => handleFormChange("isDefault", checked)}
                />
                <Label htmlFor="add-isDefault">Jadikan nomor default</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Nomor Telepon */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Nomor Telepon</DialogTitle>
            <DialogDescription>
              Perbarui informasi nomor telepon.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPhone}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-userId">User ID</Label>
                <Input
                  id="edit-userId"
                  value={formData.userId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange("userId", e.target.value)}
                  placeholder="Masukkan User ID"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-countryCode">Kode Negara</Label>
                <Input
                  id="edit-countryCode"
                  value={formData.countryCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange("countryCode", e.target.value)}
                  placeholder="Contoh: +62"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phoneNumber">Nomor Telepon</Label>
                <Input
                  id="edit-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange("phoneNumber", e.target.value)}
                  placeholder="Masukkan nomor telepon tanpa kode negara"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked: boolean) => handleFormChange("isDefault", checked)}
                />
                <Label htmlFor="edit-isDefault">Jadikan nomor default</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Lihat Detail Nomor Telepon */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Nomor Telepon</DialogTitle>
          </DialogHeader>
          {selectedPhone && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">ID</div>
                <div>{selectedPhone.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">User ID</div>
                <div>{selectedPhone.userId}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Nomor Telepon</div>
                <div>
                  {selectedPhone.countryCode} {selectedPhone.phoneNumber}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Default</div>
                <div>{selectedPhone.isDefault ? "Ya" : "Tidak"}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Terverifikasi</div>
                <div>{selectedPhone.isVerified ? "Ya" : "Tidak"}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Tanggal Dibuat</div>
                <div>
                  {new Date(selectedPhone.createdAt).toLocaleString("id-ID")}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Tanggal Diperbarui</div>
                <div>
                  {new Date(selectedPhone.updatedAt).toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Nomor Telepon</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus nomor telepon ini?
            </DialogDescription>
          </DialogHeader>
          {selectedPhone && (
            <div className="py-4">
              <p>
                <span className="font-medium">Nomor Telepon:</span>{" "}
                {selectedPhone.countryCode} {selectedPhone.phoneNumber}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {selectedPhone.userId}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePhone}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Interface untuk data nomor telepon
interface UserPhone {
  id: string
  userId: string
  phoneNumber: string
  countryCode: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// Interface untuk form data nomor telepon
interface PhoneFormData {
  phoneNumber: string
  countryCode: string
  isDefault: boolean
  userId?: string
}

// Interface untuk filter pencarian
interface PhoneFilters {
  search: string
  userId: string
  countryCode: string
  isDefault: string
}

export default function PhoneManagementPage() {
  // State untuk pencarian dan filter
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<PhoneFilters>({
    search: "",
    userId: "",
    countryCode: "",
    isDefault: "all"
  })

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // State untuk data
  const [phones, setPhones] = useState<UserPhone[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State untuk dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState<UserPhone | null>(null)

  // State untuk form
  const [formData, setFormData] = useState<PhoneFormData>({
    phoneNumber: "",
    countryCode: "+62",
    isDefault: false
  })

  const router = useRouter()

  // Fetch data nomor telepon dengan filter dan pagination
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
      })

      const response = await fetch(`/api/phones?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data nomor telepon")
      }

      const data = await response.json()
      setPhones(data.items || [])
      setTotalPages(data.totalPages || 1)
      setTotalItems(data.totalItems || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      toast.error("Gagal memuat data nomor telepon")
    } finally {
      setIsLoading(false)
    }
  }

  // Effect untuk fetch data saat filter atau pagination berubah
  useEffect(() => {
    fetchPhones()
  }, [currentPage, itemsPerPage, filters])

  // Handler untuk submit pencarian
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search }))
    setCurrentPage(1)
  }

  // Handler untuk reset filter
  const handleResetFilters = () => {
    setSearch("")
    setFilters({
      search: "",
      userId: "",
      countryCode: "",
      isDefault: "all"
    })
    setCurrentPage(1)
  }

  // Handler untuk perubahan filter
  const handleFilterChange = (key: keyof PhoneFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  // Handler untuk perubahan form
  const handleFormChange = (key: keyof PhoneFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  // Handler untuk submit form tambah
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      
      const response = await fetch("/api/phones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Gagal menambahkan nomor telepon")
      }

      toast.success("Nomor telepon berhasil ditambahkan")
      setIsAddDialogOpen(false)
      setFormData({
        phoneNumber: "",
        countryCode: "+62",
        isDefault: false
      })
      fetchPhones()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  // Handler untuk submit form edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPhone) return

    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/phones/${selectedPhone.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Gagal mengubah nomor telepon")
      }

      toast.success("Nomor telepon berhasil diubah")
      setIsEditDialogOpen(false)
      fetchPhones()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  // Handler untuk hapus nomor telepon
  const handleDelete = async () => {
    if (!selectedPhone) return

    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/phones/${selectedPhone.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Gagal menghapus nomor telepon")
      }

      toast.success("Nomor telepon berhasil dihapus")
      setIsDeleteDialogOpen(false)
      fetchPhones()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  // Handler untuk melihat detail nomor telepon
  const handleViewPhone = (phone: UserPhone) => {
    setSelectedPhone(phone)
    setIsViewDialogOpen(true)
  }

  // Handler untuk edit nomor telepon
  const handleEditPhone = (phone: UserPhone) => {
    setSelectedPhone(phone)
    setFormData({
      phoneNumber: phone.phoneNumber,
      countryCode: phone.countryCode,
      isDefault: phone.isDefault,
      userId: phone.userId
    })
    setIsEditDialogOpen(true)
  }

  // Handler untuk konfirmasi hapus nomor telepon
  const handleDeleteConfirm = (phone: UserPhone) => {
    setSelectedPhone(phone)
    setIsDeleteDialogOpen(true)
  }

  // Render pagination items
  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    
    // Selalu tampilkan halaman pertama
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => setCurrentPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )

    // Jika total halaman lebih dari maxVisiblePages
    if (totalPages > maxVisiblePages) {
      // Tentukan range halaman yang akan ditampilkan
      let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)
      
      // Pastikan kita selalu menampilkan maxVisiblePages - 2 halaman (karena halaman pertama dan terakhir selalu ditampilkan)
      if (endPage - startPage < maxVisiblePages - 3) {
        startPage = Math.max(2, endPage - (maxVisiblePages - 3))
      }

      // Tambahkan ellipsis jika perlu
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Tambahkan halaman di tengah
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)} 
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      // Tambahkan ellipsis jika perlu
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    } else {
      // Jika total halaman kurang dari atau sama dengan maxVisiblePages, tampilkan semua halaman
      for (let i = 2; i < totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)} 
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    // Selalu tampilkan halaman terakhir jika totalPages > 1
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => setCurrentPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Nomor Telepon</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Nomor Telepon
        </Button>
      </div>

      {/* Filter dan Pencarian */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <form onSubmit={handleSearchSubmit} className="flex space-x-2">
              <Input
                placeholder="Cari nomor telepon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div>
            <Label htmlFor="userId" className="mb-1 block text-sm">
              User ID
            </Label>
            <Input
              id="userId"
              placeholder="Filter berdasarkan User ID"
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="countryCode" className="mb-1 block text-sm">
              Kode Negara
            </Label>
            <Input
              id="countryCode"
              placeholder="Filter berdasarkan kode negara"
              value={filters.countryCode}
              onChange={(e) => handleFilterChange("countryCode", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="isDefault" className="mb-1 block text-sm">
              Status Default
            </Label>
            <Select
              value={filters.isDefault}
              onValueChange={(value) => handleFilterChange("isDefault", value)}
            >
              <SelectTrigger id="isDefault">
                <SelectValue placeholder="Pilih status default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="true">Default</SelectItem>
                <SelectItem value="false">Tidak Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Tabel Nomor Telepon */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Kode Negara</TableHead>
              <TableHead>Nomor Telepon</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead>Tanggal Diperbarui</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : phones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Tidak ada data nomor telepon
                </TableCell>
              </TableRow>
            ) : (
              phones.map((phone, index) => (
                <TableRow key={phone.id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{phone.userId}</TableCell>
                  <TableCell>{phone.countryCode}</TableCell>
                  <TableCell>{phone.phoneNumber}</TableCell>
                  <TableCell>{phone.isDefault ? "Ya" : "Tidak"}</TableCell>
                  <TableCell>{new Date(phone.createdAt).toLocaleString("id-ID")}</TableCell>
                  <TableCell>{new Date(phone.updatedAt).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewPhone(phone)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditPhone(phone)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteConfirm(phone)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && !error && phones.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center space-x-2">
            <Label htmlFor="itemsPerPage" className="text-sm">
              Item per halaman:
            </Label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger id="itemsPerPage" className="w-20">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Dialog Tambah Nomor Telepon */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Nomor Telepon</DialogTitle>
            <DialogDescription>
              Masukkan informasi nomor telepon baru di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userId" className="text-right">
                  User ID
                </Label>
                <Input
                  id="userId"
                  placeholder="Masukkan User ID"
                  value={formData.userId || ""}
                  onChange={(e) => handleFormChange("userId", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="countryCode" className="text-right">
                  Kode Negara
                </Label>
                <Input
                  id="countryCode"
                  placeholder="Contoh: +62"
                  value={formData.countryCode}
                  onChange={(e) => handleFormChange("countryCode", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Nomor Telepon
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="Masukkan nomor telepon tanpa kode negara"
                  value={formData.phoneNumber}
                  onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isDefault" className="text-right">
                  Nomor Default
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => handleFormChange("isDefault", checked === true)}
                  />
                  <Label htmlFor="isDefault" className="font-normal">
                    Jadikan sebagai nomor telepon default
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Nomor Telepon */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Nomor Telepon</DialogTitle>
            <DialogDescription>
              Ubah informasi nomor telepon di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-userId" className="text-right">
                  User ID
                </Label>
                <Input
                  id="edit-userId"
                  value={formData.userId || ""}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-countryCode" className="text-right">
                  Kode Negara
                </Label>
                <Input
                  id="edit-countryCode"
                  placeholder="Contoh: +62"
                  value={formData.countryCode}
                  onChange={(e) => handleFormChange("countryCode", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phoneNumber" className="text-right">
                  Nomor Telepon
                </Label>
                <Input
                  id="edit-phoneNumber"
                  placeholder="Masukkan nomor telepon tanpa kode negara"
                  value={formData.phoneNumber}
                  onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isDefault" className="text-right">
                  Nomor Default
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="edit-isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => handleFormChange("isDefault", checked === true)}
                  />
                  <Label htmlFor="edit-isDefault" className="font-normal">
                    Jadikan sebagai nomor telepon default
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Lihat Detail Nomor Telepon */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Nomor Telepon</DialogTitle>
          </DialogHeader>
          {selectedPhone && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">ID</Label>
                <div className="col-span-3">{selectedPhone.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">User ID</Label>
                <div className="col-span-3">{selectedPhone.userId}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Kode Negara</Label>
                <div className="col-span-3">{selectedPhone.countryCode}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Nomor Telepon</Label>
                <div className="col-span-3">{selectedPhone.phoneNumber}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Nomor Default</Label>
                <div className="col-span-3">{selectedPhone.isDefault ? "Ya" : "Tidak"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Tanggal Dibuat</Label>
                <div className="col-span-3">
                  {new Date(selectedPhone.createdAt).toLocaleString("id-ID")}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Tanggal Diperbarui</Label>
                <div className="col-span-3">
                  {new Date(selectedPhone.updatedAt).toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus nomor telepon ini?
            </DialogDescription>
          </DialogHeader>
          {selectedPhone && (
            <div className="py-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Phone className="h-8 w-8 text-red-500" />
                <div className="text-lg font-medium">
                  {selectedPhone.countryCode} {selectedPhone.phoneNumber}
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">
                Tindakan ini tidak dapat dibatalkan.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}