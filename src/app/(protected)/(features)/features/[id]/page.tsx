"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IconRoute, IconShield, IconTrendingUp, IconArrowLeft, IconEye } from "@tabler/icons-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs"
import { SkeletonCards } from "@/components/skeleton-cards"
import { SkeletonDataTable } from "@/components/skeleton-data-table"
import Link from "next/link"

interface Feature {
  id: number
  name: string
  description: string
  category: string
  createdAt: string
}

interface RouteFeature {
  id: number
  path: string
  method: string
  featureId: number
}

interface Policy {
  id: number
  featureId: number
  attribute: string
  operator: string
  value: string
  createdAt: string
}

/**
 * Halaman Feature Detail yang menampilkan informasi lengkap feature
 * Menggunakan konsistensi layout dengan dashboard
 * Implementasi skeleton loading untuk UX yang lebih baik
 */
export default function FeatureDetailPage() {
  const params = useParams()
  const featureId = params.id as string
  
  const [feature, setFeature] = useState<Feature | null>(null)
  const [routes, setRoutes] = useState<RouteFeature[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Mengambil data feature dan routes dari API
   */
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch features
      const featuresResponse = await fetch('http://localhost:9999/api/v1/features')
      if (!featuresResponse.ok) {
        throw new Error(`HTTP error! status: ${featuresResponse.status}`)
      }
      const featuresData = await featuresResponse.json()
      
      // Find the specific feature
      const currentFeature = featuresData.find((f: Feature) => f.id === parseInt(featureId))
      setFeature(currentFeature || null)
      
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
      
      // Fetch policies
      const policiesResponse = await fetch('http://localhost:9999/api/v1/policies')
      if (!policiesResponse.ok) {
        throw new Error(`HTTP error! status: ${policiesResponse.status}`)
      }
      const policiesData = await policiesResponse.json()
      
      // Filter policies by featureId
      const filteredPolicies = policiesData.filter((policy: Policy) => 
        policy.featureId === parseInt(featureId)
      )
      setPolicies(filteredPolicies)
      
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

  /**
   * Mendapatkan warna badge berdasarkan attribute
   */
  const getAttributeBadgeVariant = (attribute: string) => {
    switch (attribute) {
      case 'department': return 'default'
      case 'region': return 'secondary'
      case 'level': return 'outline'
      default: return 'default'
    }
  }

  /**
   * Mendapatkan warna badge berdasarkan operator
   */
  const getOperatorBadgeVariant = (operator: string) => {
    switch (operator) {
      case 'equals': return 'default'
      case 'not_equals': return 'destructive'
      case 'in': return 'secondary'
      case 'not_in': return 'outline'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Feature Detail</h1>
          <p className="text-muted-foreground">
            Detail informasi feature
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

  if (!feature) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Feature Not Found</h1>
          <p className="text-muted-foreground">Feature dengan ID {featureId} tidak ditemukan</p>
          <Link href="/feature-management">
            <Button>Back to Features</Button>
          </Link>
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
              <h1 className="text-3xl font-bold">{feature.name}</h1>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/features/${featureId}/routes`}>
            <Button variant="outline">
              <IconEye className="h-4 w-4 mr-2" />
              View Routes
            </Button>
          </Link>
          <Link href={`/features/${featureId}/policies`}>
            <Button variant="outline">
              <IconShield className="h-4 w-4 mr-2" />
              View Policies
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Info Card */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Information</CardTitle>
            <CardDescription>Detail lengkap informasi feature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feature ID</p>
                <p className="text-2xl font-bold">{feature.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg font-semibold">{feature.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <Badge variant="secondary" className="text-sm">
                  {feature.category}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-lg">{new Date(feature.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
              <p className="text-base leading-relaxed">{feature.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Associated Routes and Policies Tabs */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Associated Resources</CardTitle>
            <CardDescription>
              Routes dan policies yang terkait dengan feature ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="routes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="routes" className="flex items-center gap-2">
                  <IconRoute className="h-4 w-4" />
                  Routes ({routes.length})
                </TabsTrigger>
                <TabsTrigger value="policies" className="flex items-center gap-2">
                  <IconShield className="h-4 w-4" />
                  Policies ({policies.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="routes" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Associated Routes</h3>
                    <p className="text-sm text-muted-foreground">
                      Routes yang terkait dengan feature ini
                    </p>
                  </div>
                  {routes.length > 0 && (
                    <Link href={`/features/${featureId}/routes`}>
                      <Button variant="outline" size="sm">
                        <IconEye className="h-4 w-4 mr-2" />
                        View All Routes
                      </Button>
                    </Link>
                  )}
                </div>
                
                {routes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No routes found for this feature</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Path</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routes.slice(0, 5).map((route) => (
                          <TableRow 
                            key={route.id} 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => window.location.href = `/routes/${route.id}`}
                          >
                            <TableCell className="font-medium">{route.id}</TableCell>
                            <TableCell>
                              <Badge variant={getMethodBadgeVariant(route.method)}>
                                {route.method}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {route.path}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/routes/${route.id}`}>
                                <Button variant="ghost" size="sm">
                                  <IconEye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {routes.length > 5 && (
                      <div className="mt-4 text-center">
                        <Link href={`/features/${featureId}/routes`}>
                          <Button variant="outline">
                            View {routes.length - 5} more routes
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="policies" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Associated Policies</h3>
                    <p className="text-sm text-muted-foreground">
                      Policies yang terkait dengan feature ini
                    </p>
                  </div>
                  {policies.length > 0 && (
                    <Link href={`/features/${featureId}/policies`}>
                      <Button variant="outline" size="sm">
                        <IconShield className="h-4 w-4 mr-2" />
                        View All Policies
                      </Button>
                    </Link>
                  )}
                </div>
                
                {policies.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No policies found for this feature</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Attribute</TableHead>
                          <TableHead>Operator</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {policies.slice(0, 5).map((policy) => (
                          <TableRow key={policy.id}>
                            <TableCell className="font-medium">{policy.id}</TableCell>
                            <TableCell>
                              <Badge variant={getAttributeBadgeVariant(policy.attribute)}>
                                {policy.attribute}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getOperatorBadgeVariant(policy.operator)}>
                                {policy.operator}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {policy.value}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <IconShield className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {policies.length > 5 && (
                      <div className="mt-4 text-center">
                        <Link href={`/features/${featureId}/policies`}>
                          <Button variant="outline">
                            View {policies.length - 5} more policies
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}