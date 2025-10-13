"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconShield,
  IconRefresh,
  IconEdit,
  IconCalendar,
} from "@tabler/icons-react"

import { Button } from "@/components/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card"
import { Badge } from "@/components/shadcn/ui/badge"
import { Separator } from "@/components/shadcn/ui/separator"

interface Role {
  id: string
  name: string
  grantsAll?: boolean | null
  createdAt?: string
  updatedAt?: string | null
}

export default function RoleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.id as string

  const [role, setRole] = React.useState<Role | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const fetchRole = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/v2/roles/${roleId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 404) throw new Error("Role tidak ditemukan")
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      const roleData: Role = (json?.data ?? json) as Role
      setRole(roleData)
    } catch (err) {
      console.error("Error fetching role:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data role")
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => router.back()
  const handleRefresh = () => fetchRole()
  const handleEdit = () => router.push(`/roles/${roleId}/edit`)

  React.useEffect(() => {
    if (roleId) fetchRole()
  }, [roleId])

  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <span>Memuat detail role...</span>
        </div>
      </div>
    )
  }

  if (error && !role) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGoBack} className="flex items-center gap-2">
            <IconArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <IconShield className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleGoBack} className="flex items-center gap-2">
            <IconArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detail Role</h1>
            <p className="text-muted-foreground">Informasi lengkap tentang role {role?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
            <IconRefresh className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleEdit} className="flex items-center gap-2">
            <IconEdit className="h-4 w-4" />
            Edit Role
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconShield className="h-5 w-5" />
                Informasi Role
              </CardTitle>
              <CardDescription>Detail dan status role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama Role</p>
                <p className="text-lg font-semibold">{role?.name}</p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Role</p>
                  <p className="text-sm font-mono">{role?.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={role?.grantsAll ? "default" : "secondary"}>
                      {role?.grantsAll ? "Full Access" : "Limited"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dibuat</p>
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(role?.createdAt)}</span>
                  </div>
                </div>
                {role?.updatedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Terakhir Diubah</p>
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(role?.updatedAt ?? undefined)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}