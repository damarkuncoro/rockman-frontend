"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft, IconUser, IconShield, IconCrown, IconCalendar, IconTrendingUp } from "@tabler/icons-react"

import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/shadcn/ui/card"
import { Badge } from "@/components/shadcn/ui/badge"
import { Skeleton } from "@/components/shadcn/ui/skeleton"

/**
 * Interface untuk data role pengguna
 */
interface UserRole {
  id: string
  name: string
  grantsAll: boolean
  createdAt?: string
}

/**
 * Interface untuk respons API user roles
 */
// Bentuk respons API v2 bisa berupa array langsung atau objek dengan data
type APIUserRole = {
  id: string
  userId: string
  roleId: string
  isPrimary?: boolean
  role?: { id: string; name: string; grantsAll?: boolean; createdAt?: string }
}

/**
 * Interface untuk data pengguna
 */
interface User {
  id: number
  name: string
  email: string
}

/**
 * Komponen skeleton untuk loading state yang konsisten dengan dashboard
 */
function SkeletonUserRoles() {
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Card Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Roles List Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Halaman User Roles dengan desain konsisten seperti dashboard
 */
export default function UserRolesPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  /**
   * Fungsi untuk mengambil data user roles dari API
   */
  const fetchUserRoles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/v2/users/${userId}/roles`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const raw = await response.json()
      const items: APIUserRole[] = Array.isArray(raw) ? raw : (raw?.data ?? [])

      const mapped: UserRole[] = items.map((ur) => ({
        id: ur.role?.id ?? ur.roleId,
        name: ur.role?.name ?? ur.roleId,
        grantsAll: Boolean(ur.role?.grantsAll),
        createdAt: ur.role?.createdAt,
      }))

      setRoles(mapped)
      // Set info user sederhana
      setUser({
        id: Number.isNaN(Number(userId)) ? 0 : Number(userId),
        name: `User ${userId}`,
        email: `user${userId}@example.com`
      })
    } catch (err) {
      console.error('Error fetching user roles:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchUserRoles()
  }, [userId])

  /**
   * Fungsi untuk menghitung statistik roles
   */
  const getRoleStats = () => {
    // Pastikan roles adalah array sebelum menggunakan method array
    const rolesArray = Array.isArray(roles) ? roles : []
    
    const totalRoles = rolesArray.length
    const superAdminCount = rolesArray.filter(role => role.grantsAll).length
    const regularRoles = totalRoles - superAdminCount
    const latestRole = rolesArray.length > 0 ? rolesArray[rolesArray.length - 1] : null

    return {
      totalRoles,
      superAdminCount,
      regularRoles,
      latestRole
    }
  }

  /**
   * Fungsi untuk navigasi kembali
   */
  const handleBack = () => {
    router.back()
  }

  // Tampilkan skeleton loading jika belum mounted atau masih loading
  if (!mounted || loading) {
    return <SkeletonUserRoles />
  }

  // Tampilkan error jika ada error
  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">User Roles</h1>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">Error Loading User Roles</div>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={fetchUserRoles}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getRoleStats()

  return (
    <div className="@container/main container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header Section - Konsisten dengan dashboard */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">User Roles Management</h1>
          <p className="text-muted-foreground">
            Manage roles and permissions for {user?.name || `User ${userId}`}
          </p>
        </div>
      </div>

      {/* Stats Cards Section - Menggunakan pola grid seperti dashboard */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Roles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.totalRoles}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconUser className="h-3 w-3" />
                Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm">
              <IconTrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">All assigned roles</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Total roles assigned to user
            </p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Super Admin Roles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.superAdminCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconCrown className="h-3 w-3" />
                Elevated
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm">
              <IconShield className="h-4 w-4 text-orange-500" />
              <span className="font-medium">High privilege roles</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Roles with super admin access
            </p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Regular Roles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.regularRoles}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconUser className="h-3 w-3" />
                Standard
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm">
              <IconUser className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Standard access roles</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Roles with regular permissions
            </p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Latest Role</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.latestRole ? stats.latestRole.name : 'None'}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconCalendar className="h-3 w-3" />
                Recent
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm">
              <IconCalendar className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Most recent assignment</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {stats.latestRole?.createdAt
                ? `Added on ${new Date(stats.latestRole.createdAt).toLocaleDateString()}`
                : 'No roles assigned yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card - Konsisten dengan dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>User Roles</CardTitle>
              <CardDescription>
                Roles and permissions assigned to {user?.name || `User ${userId}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <IconShield className="h-4 w-4" />
                <span className="hidden lg:inline">Manage Permissions</span>
              </Button>
              <Button size="sm">
                <IconUser className="h-4 w-4" />
                <span className="hidden lg:inline">Add Role</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!Array.isArray(roles) || roles.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-muted-foreground">
                <IconUser className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No roles assigned</p>
                <p className="text-sm">This user doesn&apos;t have any roles assigned yet.</p>
              </div>
              <Button>
                <IconUser className="h-4 w-4" />
                Assign First Role
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {role.grantsAll ? (
                      <IconCrown className="h-5 w-5 text-orange-500" />
                    ) : (
                      <IconShield className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    {role.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date(role.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {role.grantsAll && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                      <IconCrown className="h-3 w-3 mr-1" />
                      Super Admin
                    </Badge>
                  )}
                    <span className="text-sm text-muted-foreground">
                      Role ID: {role.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}