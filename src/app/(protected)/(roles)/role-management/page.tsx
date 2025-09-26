"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconShield,
  IconPlus,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconCheck,
  IconX,
  IconCalendar,
  IconUsers,
  IconSettings,
  IconSearch,
  IconEye,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Separator } from "@/components/shadcn/ui/separator"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
import { Input } from "@/components/shadcn/ui/input"
import { Skeleton } from "@/components/shadcn/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog"
import { Label } from "@/components/shadcn/ui/label"
import { Switch } from "@/components/shadcn/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"

// Interface untuk data role
interface Role {
  id: number
  name: string
  grantsAll: boolean
  createdAt: string
}

// Interface untuk form data
interface RoleFormData {
  name: string
  grantsAll: boolean
}

// Komponen utama halaman Role Management
export default function RoleManagementPage() {
  const router = useRouter()
  
  // State untuk data dan UI
  const [roles, setRoles] = React.useState<Role[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [accessFilter, setAccessFilter] = React.useState("all")
  
  // State untuk dialog dan form
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  
  // Form data state
  const [formData, setFormData] = React.useState<RoleFormData>({
    name: "",
    grantsAll: false,
  })

  /**
   * Fungsi untuk mengambil data roles dari API
   */
  const fetchRoles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:9999/api/v1/roles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data) // Debug log
      setRoles(data || []) // Ubah dari data.data ke data langsung
    } catch (err) {
      console.error('Error fetching roles:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk membuat role baru
   */
  const createRole = async () => {
    if (!formData.name.trim()) return

    try {
      setIsSubmitting(true)
      
      const response = await fetch('http://localhost:9999/api/v1/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchRoles()
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error('Error creating role:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat role')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Fungsi untuk mengupdate role
   */
  const updateRole = async () => {
    if (!selectedRole || !formData.name.trim()) return

    try {
      setIsSubmitting(true)
      
      const response = await fetch(`http://localhost:9999/api/v1/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchRoles()
      setIsEditDialogOpen(false)
      resetForm()
      setSelectedRole(null)
    } catch (err) {
      console.error('Error updating role:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengupdate role')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Fungsi untuk menghapus role
   */
  const deleteRole = async () => {
    if (!selectedRole) return

    try {
      setIsSubmitting(true)
      
      const response = await fetch(`http://localhost:9999/api/v1/roles/${selectedRole.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchRoles()
      setIsDeleteDialogOpen(false)
      setSelectedRole(null)
    } catch (err) {
      console.error('Error deleting role:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus role')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Fungsi untuk reset form
   */
  const resetForm = () => {
    setFormData({
      name: "",
      grantsAll: false,
    })
  }

  /**
   * Handler untuk edit role
   */
  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      grantsAll: role.grantsAll,
    })
    setIsEditDialogOpen(true)
  }

  /**
   * Handler untuk view role
   */
  const handleViewRole = (role: Role) => {
    setSelectedRole(role)
    setIsViewDialogOpen(true)
  }

  /**
   * Handler untuk delete role
   */
  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }

  /**
   * Handler untuk refresh data
   */
  const handleRefresh = () => {
    fetchRoles()
  }

  /**
   * Fungsi untuk filter roles berdasarkan pencarian dan filter
   */
  const filteredRoles = React.useMemo(() => {
    return roles.filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAccess = accessFilter === "all" || 
        (accessFilter === "admin" && role.grantsAll) ||
        (accessFilter === "limited" && !role.grantsAll)
      
      return matchesSearch && matchesAccess
    })
  }, [roles, searchTerm, accessFilter])

  /**
   * Fungsi untuk menghitung statistik
   */
  const stats = React.useMemo(() => {
    const totalRoles = roles.length
    const adminRoles = roles.filter(role => role.grantsAll).length
    const limitedRoles = roles.filter(role => !role.grantsAll).length
    
    return {
      total: totalRoles,
      admin: adminRoles,
      limited: limitedRoles,
    }
  }, [roles])

  /**
   * Fungsi untuk pagination
   */
  const paginatedRoles = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredRoles.slice(startIndex, endIndex)
  }, [filteredRoles, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)

  /**
   * Fungsi untuk format tanggal
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  /**
   * Fungsi untuk mendapatkan inisial dari nama role
   */
  const getRoleInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Effect untuk load data saat komponen mount
  React.useEffect(() => {
    fetchRoles()
  }, [])

  // Reset halaman saat filter berubah
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, accessFilter])

  // Render loading state dengan skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Skeleton className="h-10 w-full md:w-[300px]" />
                <Skeleton className="h-10 w-full md:w-[180px]" />
              </div>
              <Skeleton className="h-5 w-48" />
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-8 pb-4 border-b">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {/* Table Rows */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-5 gap-8 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            </div>
            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-16" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
            <p className="text-muted-foreground">Terjadi kesalahan saat memuat data</p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <IconX className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <Button onClick={handleRefresh} className="flex items-center gap-2">
                <IconRefresh className="h-4 w-4" />
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Kelola roles dan permissions sistem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <IconRefresh className="h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <IconPlus className="h-4 w-4" />
                Tambah Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Role Baru</DialogTitle>
                <DialogDescription>
                  Buat role baru dengan nama dan permissions yang sesuai.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-8">
                  <Label htmlFor="name" className="text-right">
                    Nama Role
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                    placeholder="Masukkan nama role"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-8">
                  <Label htmlFor="grantsAll" className="text-right">
                    Full Access
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="grantsAll"
                      checked={formData.grantsAll}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, grantsAll: checked }))}
                    />
                    <Label htmlFor="grantsAll" className="text-sm text-muted-foreground">
                      Berikan akses penuh ke semua fitur
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={createRole}
                  disabled={isSubmitting || !formData.name.trim()}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <IconPlus className="h-4 w-4" />
                  )}
                  {isSubmitting ? 'Membuat...' : 'Buat Role'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <IconShield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Semua role dalam sistem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Roles</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admin}</div>
            <p className="text-xs text-muted-foreground">
              Role dengan akses penuh
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Limited Roles</CardTitle>
            <IconSettings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.limited}</div>
            <p className="text-xs text-muted-foreground">
              Role dengan akses terbatas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Hari Ini</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Role yang digunakan hari ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-[300px]"
                />
              </div>
              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Access</SelectItem>
                  <SelectItem value="admin">Admin Only</SelectItem>
                  <SelectItem value="limited">Limited Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan {paginatedRoles.length} dari {filteredRoles.length} role</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <IconShield className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {searchTerm || accessFilter !== "all" ? 'Tidak ada role yang ditemukan' : 'Belum ada role'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm || accessFilter !== "all"
                          ? 'Coba ubah filter atau kata kunci pencarian'
                          : 'Mulai dengan membuat role pertama untuk sistem Anda'
                        }
                      </p>
                      {!searchTerm && accessFilter === "all" && (
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          className="flex items-center gap-2"
                        >
                          <IconPlus className="h-4 w-4" />
                          Tambah Role Pertama
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {getRoleInitials(role.name)}
                        </div>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {role.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.grantsAll ? "default" : "secondary"}>
                        {role.grantsAll ? (
                          <div className="flex items-center gap-1">
                            <IconCheck className="h-3 w-3" />
                            Full Access
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <IconSettings className="h-3 w-3" />
                            Limited
                          </div>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(role.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <IconChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewRole(role)}>
                            <IconEye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditRole(role)}>
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRole(role)}
                            className="text-destructive"
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
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredRoles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {((currentPage - 1) * itemsPerPage) + 1} hingga{' '}
                  {Math.min(currentPage * itemsPerPage, filteredRoles.length)} dari{' '}
                  {filteredRoles.length} role
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Rows per page:</p>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <IconChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <IconChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Role Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Role</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang role yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-medium">
                  {getRoleInitials(selectedRole.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedRole.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedRole.id}</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Access Level:</span>
                  <Badge variant={selectedRole.grantsAll ? "default" : "secondary"}>
                    {selectedRole.grantsAll ? (
                      <div className="flex items-center gap-1">
                        <IconCheck className="h-3 w-3" />
                        Full Access
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <IconSettings className="h-3 w-3" />
                        Limited
                      </div>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dibuat:</span>
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(selectedRole.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Tutup
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                if (selectedRole) handleEditRole(selectedRole)
              }}
              className="flex items-center gap-2"
            >
              <IconEdit className="h-4 w-4" />
              Edit Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Ubah informasi role yang dipilih.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-8">
              <Label htmlFor="edit-name" className="text-right">
                Nama Role
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Masukkan nama role"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-8">
              <Label htmlFor="edit-grantsAll" className="text-right">
                Full Access
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="edit-grantsAll"
                  checked={formData.grantsAll}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, grantsAll: checked }))}
                />
                <Label htmlFor="edit-grantsAll" className="text-sm text-muted-foreground">
                  Berikan akses penuh ke semua fitur
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={updateRole}
              disabled={isSubmitting || !formData.name.trim()}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <IconEdit className="h-4 w-4" />
              )}
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Role</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus role "{selectedRole?.name}"? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={deleteRole}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <IconTrash className="h-4 w-4" />
              )}
              {isSubmitting ? 'Menghapus...' : 'Hapus Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}