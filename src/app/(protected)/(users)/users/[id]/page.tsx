"use client"

import * as React from "react"
import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { IconArrowLeft, IconUser, IconMail, IconShield, IconMapPin, IconPhone, IconActivity } from "@tabler/icons-react"

import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Skeleton } from "@/components/shadcn/ui/skeleton"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
import { Separator } from "@/components/shadcn/ui/separator"

import { useUserDetail } from "@/hooks/api/v2/users/[id]/show.hook.v2"

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const { data, loading, error, refetch } = useUserDetail(userId, {
    revalidate: 60000,
    useCache: true,
    immediate: true,
    cacheMaxAge: 300000,
  })

  const user = useMemo(() => data?.data ?? null, [data])

  const handleBack = () => {
    router.push("/user-management")
  }

  const navigate = (path: string) => () => router.push(path)

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-9 w-9 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Pengguna</h1>
            <p className="text-muted-foreground">Terjadi kesalahan saat memuat data</p>
          </div>
        </div>
        <Alert>
          <AlertDescription>
            {error.message || "Terjadi kesalahan yang tidak diketahui."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Pengguna</h1>
            <p className="text-muted-foreground">Pengguna tidak ditemukan</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-2">
          <IconArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Detail Pengguna</h1>
          <p className="text-muted-foreground">Informasi dan akses cepat</p>
        </div>
      </div>

      {/* User summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            {user.username || user.id}
          </CardTitle>
          <CardDescription>
            ID: {user.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3">
            <IconMail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.email || "-"}</span>
          </div>
          <div className="flex items-center gap-3">
            <IconShield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Aktif: {user.active ? "Ya" : "Tidak"}</span>
          </div>
          <div className="flex items-center gap-3">
            <IconMapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Region: {user.region || "-"}</span>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-2" />

      {/* Quick actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IconPhone className="h-4 w-4" />Telepon</CardTitle>
            <CardDescription>Kelola nomor telepon pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={navigate(`/users/${user.id}/phones`)}>Buka Telepon</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IconMapPin className="h-4 w-4" />Alamat</CardTitle>
            <CardDescription>Kelola alamat terkait pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={navigate(`/users/${user.id}/addresses`)}>Buka Alamat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IconShield className="h-4 w-4" />Roles</CardTitle>
            <CardDescription>Peran dan hak akses pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={navigate(`/users/${user.id}/roles`)}>Buka Roles</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IconActivity className="h-4 w-4" />Sessions</CardTitle>
            <CardDescription>Riwayat sesi login pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={navigate(`/users/${user.id}/sessions`)}>Buka Sessions</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IconActivity className="h-4 w-4" />Access Logs</CardTitle>
            <CardDescription>Log akses fitur oleh pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={navigate(`/users/${user.id}/access-logs`)}>Buka Access Logs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}