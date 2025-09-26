"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  IconArrowLeft, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconFolder,
  IconFolderOpen,
  IconSettings,
  IconTrendingUp,
  IconUsers,
  IconShield,
  IconRoute,
  IconCalendar,
  IconTag,
  IconPalette,
  IconToggleLeft,
  IconToggleRight
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs"
import { SkeletonCards } from "@/components/skeleton-cards"
import Link from "next/link"

/**
 * Interface untuk Feature Category
 */
interface FeatureCategory {
  id: number
  name: string
  slug: string
  description: string
  color: string
  icon: string
  isActive: boolean
  createdAt: string
}

/**
 * Interface untuk Feature yang terkait dengan category
 */
interface Feature {
  id: number
  name: string
  description: string
  categorySlug: string
  isActive: boolean
  createdAt: string
}

/**
 * Interface untuk statistik category
 */
interface CategoryStats {
  totalFeatures: number
  activeFeatures: number
  inactiveFeatures: number
  totalRoutes: number
  totalPolicies: number
}

/**
 * Komponen halaman detail Feature Category
 * Menampilkan informasi lengkap tentang category beserta features yang terkait
 */
export default function FeatureCategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  // State management
  const [category, setCategory] = useState<FeatureCategory | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [stats, setStats] = useState<CategoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fungsi untuk mengambil data category dari API
   */
  const fetchCategory = async () => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/feature-categories/${categoryId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch category')
      }
      const data = await response.json()
      setCategory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  /**
   * Fungsi untuk mengambil features yang terkait dengan category
   */
  const fetchFeatures = async () => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/features`)
      if (!response.ok) {
        throw new Error('Failed to fetch features')
      }
      const data = await response.json()
      // Filter features berdasarkan category slug
      const categoryFeatures = data.filter((feature: Feature) => 
        feature.categorySlug === category?.slug
      )
      setFeatures(categoryFeatures)
    } catch (err) {
      console.error('Error fetching features:', err)
    }
  }

  /**
   * Fungsi untuk menghitung statistik category
   */
  const calculateStats = () => {
    if (!features.length) return

    const activeFeatures = features.filter(f => f.isActive).length
    const inactiveFeatures = features.filter(f => !f.isActive).length

    setStats({
      totalFeatures: features.length,
      activeFeatures,
      inactiveFeatures,
      totalRoutes: features.length * 3, // Estimasi
      totalPolicies: features.length * 2, // Estimasi
    })
  }

  /**
   * Fungsi untuk menghapus category
   */
  const handleDeleteCategory = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus category ini?')) return

    try {
      const response = await fetch(`http://localhost:9999/api/v1/feature-categories/${categoryId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      router.push('/feature-categories')
    } catch (err) {
      alert('Gagal menghapus category: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  /**
   * Fungsi untuk toggle status active category
   */
  const handleToggleActive = async () => {
    if (!category) return

    try {
      const response = await fetch(`http://localhost:9999/api/v1/feature-categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...category,
          isActive: !category.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update category')
      }

      const updatedCategory = await response.json()
      setCategory(updatedCategory)
    } catch (err) {
      alert('Gagal mengupdate category: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
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

  // Effect untuk load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchCategory()
      setLoading(false)
    }
    loadData()
  }, [categoryId])

  // Effect untuk load features setelah category loaded
  useEffect(() => {
    if (category) {
      fetchFeatures()
    }
  }, [category])

  // Effect untuk calculate stats setelah features loaded
  useEffect(() => {
    calculateStats()
  }, [features])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <SkeletonCards />
      </div>
    )
  }

  // Error state
  if (error || !category) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error || 'Category tidak ditemukan'}
              </p>
              <Button asChild>
                <Link href="/categories">
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Categories
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/feature-categories">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: category.color }}
            >
              <IconFolder className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleActive}
          >
            {category.isActive ? (
              <>
                <IconToggleRight className="h-4 w-4 mr-2 text-green-500" />
                Active
              </>
            ) : (
              <>
                <IconToggleLeft className="h-4 w-4 mr-2 text-gray-400" />
                Inactive
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <IconEdit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteCategory}
          >
            <IconTrash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Features</CardTitle>
              <IconFolder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeatures}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Features</CardTitle>
              <IconToggleRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeFeatures}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Features</CardTitle>
              <IconToggleLeft className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.inactiveFeatures}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
              <IconRoute className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoutes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
              <IconShield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPolicies}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features ({features.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconTag className="h-5 w-5 mr-2" />
                  Category Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="font-medium">{category.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Slug</label>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{category.slug}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Color</label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-mono text-sm">{category.color}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{category.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="text-sm flex items-center">
                    <IconCalendar className="h-4 w-4 mr-1" />
                    {formatDate(category.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconSettings className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <IconEdit className="h-4 w-4 mr-2" />
                  Edit Category Details
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <IconPalette className="h-4 w-4 mr-2" />
                  Change Color & Icon
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={handleToggleActive}
                >
                  {category.isActive ? (
                    <>
                      <IconToggleLeft className="h-4 w-4 mr-2" />
                      Deactivate Category
                    </>
                  ) : (
                    <>
                      <IconToggleRight className="h-4 w-4 mr-2" />
                      Activate Category
                    </>
                  )}
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="destructive"
                  onClick={handleDeleteCategory}
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  Delete Category
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Features in this Category</CardTitle>
              <CardDescription>
                Daftar semua features yang termasuk dalam category {category.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {features.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {features.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{feature.description}</TableCell>
                        <TableCell>
                          <Badge variant={feature.isActive ? "default" : "secondary"}>
                            {feature.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(feature.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/features/${feature.id}`}>
                              <IconEye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <IconFolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Belum ada features dalam category ini
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Settings</CardTitle>
              <CardDescription>
                Pengaturan dan konfigurasi untuk category {category.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Category Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Mengaktifkan atau menonaktifkan category ini
                    </p>
                  </div>
                  <Button
                    variant={category.isActive ? "default" : "outline"}
                    onClick={handleToggleActive}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Button>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus category dan semua data terkait.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={handleDeleteCategory}
                  >
                    <IconTrash className="h-4 w-4 mr-2" />
                    Delete Category
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}