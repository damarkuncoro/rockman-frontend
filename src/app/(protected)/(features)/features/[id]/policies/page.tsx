"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IconShield, IconLock, IconTrendingUp, IconArrowLeft, IconSettings } from "@tabler/icons-react"
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

interface Policy {
  id: number
  featureId: number
  attribute: string
  operator: string
  value: string
  createdAt: string
}

interface Feature {
  id: number
  name: string
  description: string
  category: string
  createdAt: string
}

/**
 * Halaman Feature Policies yang menampilkan policies untuk feature tertentu
 * Menggunakan konsistensi layout dengan dashboard
 * Implementasi skeleton loading untuk UX yang lebih baik
 */
export default function FeaturePoliciesPage() {
  const params = useParams()
  const featureId = params.id as string
  
  const [policies, setPolicies] = useState<Policy[]>([])
  const [feature, setFeature] = useState<Feature | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Mengambil data policies dan feature dari API
   */
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch policies via API v2
      const policiesResponse = await fetch('/api/v2/policies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      if (!policiesResponse.ok) {
        throw new Error(`HTTP error! status: ${policiesResponse.status}`)
      }
      const policiesJson = await policiesResponse.json()
      const policiesData = Array.isArray(policiesJson) ? policiesJson : (policiesJson?.data ?? [])
      
      // Filter policies by featureId
      const filteredPolicies = policiesData.filter((policy: Policy) => 
        policy.featureId === parseInt(featureId)
      )
      setPolicies(filteredPolicies)
      
      // Fetch single feature detail via API v2
      const featuresResponse = await fetch(`/api/v2/features/${featureId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      if (!featuresResponse.ok) {
        throw new Error(`HTTP error! status: ${featuresResponse.status}`)
      }
      const featureJson = await featuresResponse.json()
      const featureData = Array.isArray(featureJson) ? featureJson[0] : (featureJson?.data ?? featureJson)
      setFeature(featureData || null)
      
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
   * Menghitung statistik policies
   */
  const getPolicyStats = () => {
    const totalPolicies = policies.length
    const departmentPolicies = policies.filter(p => p.attribute === 'department').length
    const regionPolicies = policies.filter(p => p.attribute === 'region').length
    const levelPolicies = policies.filter(p => p.attribute === 'level').length
    const equalOperators = policies.filter(p => p.operator === '==').length

    return {
      total: totalPolicies,
      department: departmentPolicies,
      region: regionPolicies,
      level: levelPolicies,
      equal: equalOperators
    }
  }

  const stats = getPolicyStats()

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
      case '==': return 'default'
      case '!=': return 'destructive'
      case '>': 
      case '>=': 
      case '<': 
      case '<=': return 'secondary'
      case 'in': return 'outline'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Feature Policies</h1>
          <p className="text-muted-foreground">
            Policies untuk feature yang dipilih
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
                {feature ? feature.name : `Feature ${featureId}`} Policies
              </h1>
              <p className="text-muted-foreground">
                {feature ? feature.description : 'Policies untuk feature yang dipilih'}
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
            <CardDescription>Total Policies</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.total}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconShield className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Access control rules <IconLock className="size-4" />
            </div>
            <div className="text-muted-foreground">
              All configured policies
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Department Rules</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.department}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp className="h-3 w-3 mr-1" />
                {stats.total > 0 ? ((stats.department / stats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Department-based access <IconSettings className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Departmental restrictions
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Region Rules</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.region}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp className="h-3 w-3 mr-1" />
                {stats.total > 0 ? ((stats.region / stats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Regional access control <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Geographic restrictions
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Level Rules</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.level}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconShield className="h-3 w-3 mr-1" />
                {stats.total > 0 ? ((stats.level / stats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Level-based access <IconLock className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Hierarchical restrictions
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Policies Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Policies List</CardTitle>
            <CardDescription>
              Daftar semua policies yang terkait dengan feature ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {policies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No policies found for this feature</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Attribute</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
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
                      <TableCell>
                        {new Date(policy.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <IconSettings className="h-4 w-4" />
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