"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IconPlus, IconSettings, IconShield, IconTrendingUp } from "@tabler/icons-react"
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

interface Feature {
  id: number
  name: string
  description: string
  category: string
  createdAt: string
}

/**
 * Halaman Feature Management yang menampilkan daftar features
 * Menggunakan konsistensi layout dengan dashboard
 * Implementasi skeleton loading untuk UX yang lebih baik
 */
export default function FeatureManagementPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  /**
   * Mengambil data features dari API
   */
  const fetchFeatures = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:9999/api/v1/features')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setFeatures(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch features')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handler untuk navigasi ke halaman detail feature
   * @param featureId - ID feature yang akan dilihat detailnya
   */
  const handleFeatureClick = (featureId: number) => {
    router.push(`/features/${featureId}`)
  }

  useEffect(() => {
    fetchFeatures()
  }, [])

  /**
   * Menghitung statistik features
   */
  const getFeatureStats = () => {
    const totalFeatures = features.length
    const generalFeatures = features.filter(f => f.category === 'General').length
    const recentFeatures = features.filter(f => {
      const createdDate = new Date(f.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdDate > weekAgo
    }).length

    return {
      total: totalFeatures,
      general: generalFeatures,
      recent: recentFeatures,
      latestFeature: features.length > 0 ? features[features.length - 1] : null
    }
  }

  const stats = getFeatureStats()

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Feature Management</h1>
          <p className="text-muted-foreground">
            Kelola dan monitor features aplikasi
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
          <Button onClick={fetchFeatures}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Feature Management</h1>
          <p className="text-muted-foreground">
            Kelola dan monitor features aplikasi
          </p>
        </div>
        <Button>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {/* Stats Cards - Menggunakan pola yang sama dengan dashboard */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Features</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.total}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconSettings className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              System features available <IconShield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              All registered features
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>General Category</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.general}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp className="h-3 w-3 mr-1" />
                {((stats.general / stats.total) * 100).toFixed(1)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Most common category <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              General purpose features
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Recent Features</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.recent}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp className="h-3 w-3 mr-1" />
                New
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Added this week <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Recent additions
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Latest Feature</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.latestFeature ? stats.latestFeature.name : 'None'}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconSettings className="h-3 w-3 mr-1" />
                Latest
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Most recent addition <IconShield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {stats.latestFeature 
                ? `Added on ${new Date(stats.latestFeature.createdAt).toLocaleDateString()}`
                : 'No features yet'
              }
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Features Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Features List</CardTitle>
            <CardDescription>
              Daftar semua features yang tersedia dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature) => (
                  <TableRow 
                    key={feature.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleFeatureClick(feature.id)}
                  >
                    <TableCell className="font-medium">{feature.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{feature.name}</div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={feature.description}>
                        {feature.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{feature.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(feature.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Action button logic here
                        }}
                      >
                        <IconSettings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}