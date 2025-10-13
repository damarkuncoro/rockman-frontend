"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { IconRoute, IconArrowLeft, IconShield, IconTrendingUp } from "@tabler/icons-react"
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
import { SkeletonCards } from "@/components/skeleton-cards"
import Link from "next/link"
import { useFetch } from "@/lib/useFetch"

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

function AssociatedFeatureSection({ featureId }: { featureId: number }) {
  const { data: feature, loading, error, refetch } = useFetch<Feature>(`/api/v2/features/${featureId}`, { useCache: true })

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <SkeletonCards />
      </div>
    )
  }

  if (error || !feature) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Associated Feature</CardTitle>
            <CardDescription>Failed to load feature details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">{error?.message || "Feature not found"}</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <IconShield className="h-5 w-5" />
                <span>Associated Feature</span>
              </CardTitle>
              <CardDescription>
                Feature yang terkait dengan route ini
              </CardDescription>
            </div>
            <Link href={`/features/${feature.id}`}>
              <Button variant="outline" size="sm">
                View Feature
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Feature Name</label>
              <p className="text-lg font-semibold">{feature.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <Badge variant="outline" className="ml-2">
                {feature.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
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
    default:
      return 'outline'
  }
}

/**
 * Halaman detail route yang menampilkan informasi lengkap tentang route tertentu
 * Menggunakan konsistensi layout dengan halaman detail feature
 */
export default function RouteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const routeId = params.id as string
  
  const [route, setRoute] = useState<RouteFeature | null>(null)
  const [feature, setFeature] = useState<Feature | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fungsi untuk mengambil data route dari API
   */
  const fetchRouteData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch route data
      const routeResponse = await fetch(`/api/v2/route-features/${routeId}`)
      if (!routeResponse.ok) {
        throw new Error('Failed to fetch route data')
      }
      const routeData = await routeResponse.json()
      setRoute(routeData)

      // Fetch feature data jika route berhasil diambil
      if (routeData.featureId) {
        const featureResponse = await fetch(`/api/v2/features/${routeData.featureId}`)
        if (featureResponse.ok) {
          const featureData = await featureResponse.json()
          setFeature(featureData)
        }
      }
    } catch (err) {
      console.error('Error fetching route data:', err)
      setError('Failed to load route data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (routeId) {
      fetchRouteData()
    }
  }, [routeId])

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" disabled>
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
        <SkeletonCards />
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">{error || 'Route not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Route Info */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <IconRoute className="h-6 w-6" />
              <div>
                <CardTitle className="text-2xl font-bold">Route Details</CardTitle>
                <CardDescription>
                  Informasi lengkap tentang route ini
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Route ID</label>
                <p className="text-lg font-semibold">{route.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">HTTP Method</label>
                <div className="mt-1">
                  <Badge variant={getMethodBadgeVariant(route.method)} className="text-sm">
                    {route.method}
                  </Badge>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Path</label>
                <p className="text-lg font-mono bg-muted p-2 rounded-md mt-1">{route.path}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Associated Feature */}
      {route.featureId && (
        <AssociatedFeatureSection featureId={route.featureId} />
      )}

      {/* Route Statistics */}
      <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Route ID</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              #{route.id}
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
              Unique identifier <IconRoute className="size-4" />
            </div>
            <div className="text-muted-foreground">
              System generated ID
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>HTTP Method</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {route.method}
            </CardTitle>
            <CardAction>
              <Badge variant={getMethodBadgeVariant(route.method)}>
                <IconTrendingUp className="h-3 w-3 mr-1" />
                {route.method}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Request method <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              HTTP operation type
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Feature Link</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              #{route.featureId}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconShield className="h-3 w-3 mr-1" />
                Linked
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Associated feature <IconShield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Feature relationship
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}