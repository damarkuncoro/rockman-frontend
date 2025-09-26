"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  IconRoute, 
  IconSearch, 
  IconFilter, 
  IconSortAscending, 
  IconSortDescending,
  IconShield,
  IconTrendingUp,
  IconEye,
  IconPlus
} from "@tabler/icons-react"
import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
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
import { SkeletonCards } from "@/components/skeleton-cards"
import Link from "next/link"

/**
 * Interface untuk data route feature
 */
interface RouteFeature {
  id: number
  path: string
  method: string
  featureId: number
}

/**
 * Interface untuk data feature terkait
 */
interface Feature {
  id: number
  name: string
  description: string
  category: string
  createdAt: string
}

/**
 * Interface untuk statistik routes
 */
interface RouteStats {
  total: number
  get: number
  post: number
  put: number
  delete: number
  patch: number
  other: number
}

/**
 * Fungsi untuk mendapatkan variant badge berdasarkan HTTP method
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @returns Variant badge yang sesuai
 */
function getMethodBadgeVariant(method: string) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'default'
    case 'POST':
      return 'secondary'
    case 'PUT':
      return 'outline'
    case 'DELETE':
      return 'destructive'
    case 'PATCH':
      return 'outline'
    default:
      return 'outline'
  }
}

/**
 * Halaman Route Management yang menampilkan daftar semua routes
 * Menggunakan konsistensi layout dengan halaman management lainnya
 * Implementasi fitur pencarian, filter, sorting, dan statistik
 */
export default function RouteManagementPage() {
  const router = useRouter()
  
  const [routes, setRoutes] = useState<RouteFeature[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<RouteFeature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter dan search states
  const [searchTerm, setSearchTerm] = useState("")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [featureFilter, setFeatureFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  /**
   * Fungsi untuk mengambil data routes dari API
   */
  const fetchRoutesData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch routes data
      const routesResponse = await fetch('http://localhost:9999/api/v1/route-features')
      if (!routesResponse.ok) {
        throw new Error('Failed to fetch routes data')
      }
      const routesData = await routesResponse.json()
      
      // Validasi dan sanitasi data routes
      const validatedRoutes = Array.isArray(routesData) 
        ? routesData.filter(route => 
            route && 
            typeof route === 'object' &&
            route.id && 
            route.method && 
            typeof route.method === 'string' &&
            route.path && 
            typeof route.path === 'string' &&
            route.featureId && 
            typeof route.featureId === 'number'
          )
        : []
      
      setRoutes(validatedRoutes)
      setFilteredRoutes(validatedRoutes)

      // Fetch features data untuk mapping
      const featuresResponse = await fetch('http://localhost:9999/api/v1/features')
      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json()
        const validatedFeatures = Array.isArray(featuresData) 
          ? featuresData.filter(feature => 
              feature && 
              typeof feature === 'object' &&
              feature.id && 
              feature.name && 
              typeof feature.name === 'string'
            )
          : []
        setFeatures(validatedFeatures)
      }
    } catch (err) {
      console.error('Error fetching routes data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk menghitung statistik routes
   */
  const getRouteStats = (): RouteStats => {
    // Filter routes yang valid (memiliki method yang tidak null/undefined)
    const validRoutes = routes.filter(r => r && r.method && typeof r.method === 'string')
    
    const stats = {
      total: validRoutes.length,
      get: validRoutes.filter(r => r.method.toUpperCase() === 'GET').length,
      post: validRoutes.filter(r => r.method.toUpperCase() === 'POST').length,
      put: validRoutes.filter(r => r.method.toUpperCase() === 'PUT').length,
      delete: validRoutes.filter(r => r.method.toUpperCase() === 'DELETE').length,
      patch: validRoutes.filter(r => r.method.toUpperCase() === 'PATCH').length,
      other: 0
    }
    
    stats.other = stats.total - (stats.get + stats.post + stats.put + stats.delete + stats.patch)
    return stats
  }

  /**
   * Fungsi untuk mendapatkan nama feature berdasarkan ID
   */
  const getFeatureName = (featureId: number): string => {
    const feature = features.find(f => f.id === featureId)
    return feature ? feature.name : `Feature ${featureId}`
  }

  /**
   * Fungsi untuk memfilter dan mengurutkan routes
   */
  const applyFiltersAndSort = () => {
    // Filter routes yang valid terlebih dahulu
    let filtered = routes.filter(route => 
      route && 
      route.method && 
      typeof route.method === 'string' &&
      route.path && 
      typeof route.path === 'string' &&
      route.featureId && 
      typeof route.featureId === 'number'
    )

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(route => 
        route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getFeatureName(route.featureId).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply method filter
    if (methodFilter !== "all") {
      filtered = filtered.filter(route => route.method.toUpperCase() === methodFilter.toUpperCase())
    }

    // Apply feature filter
    if (featureFilter !== "all") {
      filtered = filtered.filter(route => route.featureId.toString() === featureFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof RouteFeature]
      let bValue: any = b[sortBy as keyof RouteFeature]

      if (sortBy === "featureName") {
        aValue = getFeatureName(a.featureId)
        bValue = getFeatureName(b.featureId)
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

    setFilteredRoutes(filtered)
  }

  /**
   * Fungsi untuk toggle sort order
   */
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc")
  }

  // Effects
  useEffect(() => {
    fetchRoutesData()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [routes, searchTerm, methodFilter, featureFilter, sortBy, sortOrder])

  const stats = getRouteStats()

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Route Management</h2>
        </div>
        <SkeletonCards />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Route Management</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">Error: {error}</p>
              <Button onClick={fetchRoutesData} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Route Management</h2>
          <p className="text-muted-foreground">
            Kelola dan monitor semua API routes dalam sistem
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Routes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.total}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconRoute className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              API endpoints registered <IconShield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              All available routes
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>GET Methods</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.get}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp className="h-3 w-3 mr-1" />
                {stats.total > 0 ? ((stats.get / stats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Read operations <IconRoute className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Data retrieval endpoints
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>POST Methods</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.post}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp className="h-3 w-3 mr-1" />
                {stats.total > 0 ? ((stats.post / stats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Create operations <IconShield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Data creation endpoints
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Modify Methods</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.put + stats.delete + stats.patch}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconRoute className="h-3 w-3 mr-1" />
                {stats.total > 0 ? (((stats.put + stats.delete + stats.patch) / stats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Update & delete operations <IconShield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Data modification endpoints
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>
            Filter dan cari routes berdasarkan kriteria tertentu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search routes by path, method, or feature..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Method Filter */}
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>

            {/* Feature Filter */}
            <Select value={featureFilter} onValueChange={setFeatureFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by feature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Features</SelectItem>
                {features.map((feature) => (
                  <SelectItem key={feature.id} value={feature.id.toString()}>
                    {feature.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="path">Path</SelectItem>
                <SelectItem value="method">Method</SelectItem>
                <SelectItem value="featureName">Feature</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={toggleSortOrder}>
              {sortOrder === "asc" ? (
                <IconSortAscending className="h-4 w-4" />
              ) : (
                <IconSortDescending className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Routes List</CardTitle>
          <CardDescription>
            Daftar semua routes yang terdaftar dalam sistem ({filteredRoutes.length} dari {routes.length} routes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-8">
              <IconRoute className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No routes found</h3>
              <p className="text-muted-foreground">
                {routes.length === 0 
                  ? "No routes are registered in the system yet."
                  : "No routes match your current filters."
                }
              </p>
              {routes.length === 0 && (
                <Button className="mt-4">
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add First Route
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Feature</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.map((route) => (
                  <TableRow 
                    key={route.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/routes/${route.id}`)}
                  >
                    <TableCell className="font-medium">#{route.id}</TableCell>
                    <TableCell>
                      <Badge variant={getMethodBadgeVariant(route.method)}>
                        {route.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-md truncate">
                      {route.path}
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/features/${route.featureId}`}
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getFeatureName(route.featureId)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/routes/${route.id}`}>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}