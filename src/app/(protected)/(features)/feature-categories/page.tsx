"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconFolder,
  IconFolderOpen,
  IconSettings,
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconSortDescending
} from "@tabler/icons-react"
import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table"
import { Input } from "@/components/shadcn/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { SkeletonCards } from "@/components/skeleton-cards"

interface FeatureCategory {
  id: number
  name: string
  slug: string
  description: string
  color: string
  icon: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count?: {
    features: number
  }
}

interface CategoryStats {
  total: number
  active: number
  inactive: number
  totalFeatures: number
}

/**
 * Halaman Category Management yang menampilkan daftar kategori fitur
 * Menggunakan konsistensi layout dengan halaman lain dalam aplikasi
 * Implementasi CRUD operations untuk kategori fitur
 */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<FeatureCategory[]>([])
  const [filteredCategories, setFilteredCategories] = useState<FeatureCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("sortOrder")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const router = useRouter()

  /**
   * Mengambil data categories dari API
   */
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/v2/feature-categories', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const json = await response.json()
      const list = Array.isArray(json) ? json : (json?.data ?? [])
      setCategories(list || [])
      setFilteredCategories(list || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      console.error('Error fetching categories:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Filter dan sort categories berdasarkan kriteria yang dipilih
   */
  const applyFiltersAndSort = () => {
    let filtered = [...categories]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      filtered = filtered.filter(category => category.isActive === isActive)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof FeatureCategory]
      let bValue: any = b[sortBy as keyof FeatureCategory]

      // Handle special cases
      if (sortBy === "featuresCount") {
        aValue = a._count?.features || 0
        bValue = b._count?.features || 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCategories(filtered)
  }

  /**
   * Handler untuk navigasi ke halaman detail category
   * @param categoryId - ID category yang akan dilihat detailnya
   */
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/feature-categories/${categoryId}`)
  }

  /**
   * Handler untuk edit category
   * @param categoryId - ID category yang akan diedit
   */
  const handleEditCategory = (categoryId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    router.push(`/feature-categories/${categoryId}/edit`)
  }

  /**
   * Handler untuk delete category
   * @param categoryId - ID category yang akan dihapus
   */
  const handleDeleteCategory = async (categoryId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/v2/feature-categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      // Refresh data after deletion
      await fetchCategories()
    } catch (err) {
      console.error('Error deleting category:', err)
      alert('Gagal menghapus kategori. Silakan coba lagi.')
    }
  }

  /**
   * Toggle sort order
   */
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc")
  }

  /**
   * Menghitung statistik categories
   */
  const getCategoryStats = (): CategoryStats => {
    const total = categories.length
    const active = categories.filter(c => c.isActive).length
    const inactive = total - active
    const totalFeatures = categories.reduce((sum, c) => sum + (c._count?.features || 0), 0)

    return { total, active, inactive, totalFeatures }
  }

  /**
   * Get icon component berdasarkan nama icon
   * @param iconName - Nama icon dari Tabler Icons
   */
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      IconFolder,
      IconFolderOpen,
      IconSettings,
      IconEye,
      IconEdit,
      IconTrash,
    }
    
    const IconComponent = iconMap[iconName] || IconFolder
    return <IconComponent className="h-4 w-4" />
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [categories, searchTerm, statusFilter, sortBy, sortOrder])

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <Button onClick={fetchCategories} className="mt-4">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getCategoryStats()

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
            <p className="text-muted-foreground">
              Kelola kategori fitur dalam sistem
            </p>
          </div>
          <Button onClick={() => router.push('/feature-categories/create')}>
            <IconPlus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {isLoading ? (
        <SkeletonCards />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kategori</CardTitle>
              <IconFolder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Semua kategori
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategori Aktif</CardTitle>
              <IconFolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Kategori yang aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategori Nonaktif</CardTitle>
              <IconFolder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                Kategori nonaktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fitur</CardTitle>
              <IconSettings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeatures}</div>
              <p className="text-xs text-muted-foreground">
                Fitur dalam kategori
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter dan Pencarian</CardTitle>
          <CardDescription>
            Gunakan filter untuk menemukan kategori dengan cepat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan Berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sortOrder">Urutan</SelectItem>
                <SelectItem value="name">Nama</SelectItem>
                <SelectItem value="createdAt">Tanggal Dibuat</SelectItem>
                <SelectItem value="featuresCount">Jumlah Fitur</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order Toggle */}
            <Button variant="outline" size="icon" onClick={toggleSortOrder}>
              {sortOrder === "asc" ? (
                <IconSortAscending className="h-4 w-4" />
              ) : (
                <IconSortDescending className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>
            {filteredCategories.length} dari {categories.length} kategori
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jumlah Fitur</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          {getIconComponent(category.icon)}
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category._count?.features || 0} fitur
                      </Badge>
                    </TableCell>
                    <TableCell>{category.sortOrder}</TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <IconSettings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => handleCategoryClick(category.id)}
                          >
                            <IconEye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleEditCategory(category.id, e)}
                          >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteCategory(category.id, e)}
                            className="text-red-600"
                          >
                            <IconTrash className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <IconFolder className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Tidak ada kategori</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Tidak ada kategori yang sesuai dengan filter."
                  : "Belum ada kategori yang dibuat."}
              </p>
              {(!searchTerm && statusFilter === "all") && (
                <Button
                  onClick={() => router.push('/categories/create')}
                  className="mt-4"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Tambah Kategori Pertama
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}