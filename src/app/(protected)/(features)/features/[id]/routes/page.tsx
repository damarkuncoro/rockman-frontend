"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IconRoute, IconShield, IconTrendingUp, IconArrowLeft } from "@tabler/icons-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table"
import { SkeletonCards } from "@/components/skeleton-cards"
import { SkeletonDataTable } from "@/components/skeleton-data-table"
import Link from "next/link"

interface RouteFeature {
  id: number
  path: string
  method: string
  featureId: number
}

interface Feature {
  id: number
  name: string
  description: string
  category: string
  createdAt: string
}

/**
 * Halaman Feature Routes yang menampilkan routes untuk feature tertentu
 * Menggunakan konsistensi layout dengan dashboard
 * Implementasi skeleton loading untuk UX yang lebih baik
 */
export default function FeatureRoutesPage() {
  const params = useParams()
  const featureId = params.id as string
  
  const [routes, setRoutes] = useState<RouteFeature[]>([])
  const [feature, setFeature] = useState<Feature | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Mengambil data routes dan feature dari API
   */
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch routes
      const routesResponse = await fetch('http://localhost:9999/api/v1/route_features')
      if (!routesResponse.ok) {
        throw new Error(`HTTP error! status: ${routesResponse.status}`)
      }
      const routesData = await routesResponse.json()
      
      // Filter routes by featureId
      const filteredRoutes = routesData.filter((route: RouteFeature) => 
        route.featureId === parseInt(featureId)
      )
      setRoutes(filteredRoutes)
      
      // Fetch features to get feature details
      const featuresResponse = await fetch('http://localhost:9999/api/v1/features')
      if (!featuresResponse.ok) {
        throw new Error(`HTTP error! status: ${featuresResponse.status}`)
      }
      const featuresData = await featuresResponse.json()
      
      // Find the specific feature
      const currentFeature = featuresData.find((f: Feature) => f.id === parseInt(featureId))
      setFeature(currentFeature || null)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [featureId])

  /**
   * Menghitung statistik routes
   */
  const getRouteStats = () => {
    const totalRoutes = routes.length
    const getMethods = routes.filter(r => r.method === 'GET').length
    const postMethods = routes.filter(r => r.method === 'POST').length
    const putMethods = routes.filter(r => r.method === 'PUT').length
    const deleteMethods = routes.filter(r => r.method === 'DELETE').length

    return {
      total: totalRoutes,
      get: getMethods,
      post: postMethods,
      put: putMethods,
      delete: deleteMethods
    }
  }

  const stats = getRouteStats()

  /**
   * Mendapatkan warna badge berdasarkan HTTP method
   */
  const getMethodBadgeVariant = (method: string) => {
    switch (method) {
      case 'GET': return 'default'
      case 'POST': return 'secondary'
      case 'PUT': return 'outline'
      case 'DELETE': return 'destructive'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Feature Routes</h1>
          <p className="text-muted-foreground">
            Routes untuk feature yang dipilih
          </p>
        </div>
        <SkeletonCards />
        <div className="px-4 lg:px-6">
          <SkeletonDataTable />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Link href="/feature-management">
              <Button variant="ghost" size="sm">
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {feature ? feature.name : `Feature ${featureId}`} Routes
              </h1>
              <p className="text-muted-foreground">
                {feature ? feature.description : 'Routes untuk feature yang dipilih'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Info Card */}
      {feature && (
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Information</CardTitle>
              <CardDescription>Detail informasi feature</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{feature.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <Badge variant="secondary">{feature.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-lg">{new Date(feature.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Cards - Menggunakan pola yang sama dengan dashboard */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
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
              API endpoints available <IconShield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              All registered routes
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
              Read operations <IconTrendingUp className="size-4" />
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
              Create operations <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Data creation endpoints
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>PUT/DELETE</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.put + stats.delete}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconRoute className="h-3 w-3 mr-1" />
                {stats.total > 0 ? (((stats.put + stats.delete) / stats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Modify operations <IconShield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Update & delete endpoints
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Routes Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Routes List</CardTitle>
            <CardDescription>
              Daftar semua routes yang terkait dengan feature ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {routes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No routes found for this feature</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Feature ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.id}</TableCell>
                      <TableCell>
                        <Badge variant={getMethodBadgeVariant(route.method)}>
                          {route.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {route.path}
                      </TableCell>
                      <TableCell>{route.featureId}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <IconRoute className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}