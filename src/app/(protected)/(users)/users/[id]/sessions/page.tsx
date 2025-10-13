"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { IconActivity, IconClock, IconDeviceDesktop, IconUser } from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
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
import { useFetch } from "@/lib/useFetch"

/**
 * Interface untuk data session
 */
interface SessionData {
  id: number
  userId: number
  refreshToken: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  userAgent?: string
  ipAddress?: string
}

/**
 * Interface untuk response API sessions
 */
interface SessionsResponse {
  success: boolean
  data: SessionData[]
  total: number
  userId: number
}

/**
 * Halaman User Sessions yang menampilkan semua sesi login user
 * Menggunakan konsistensi desain dan layout dari dashboard
 * Implementasi skeleton loading untuk UX yang lebih baik
 */
export default function UserSessionsPage() {
  const params = useParams()
  const userId = params.id as string
  
  // Fetch sessions via helper (auth-aware, cache-aware)
  const { data, loading, error } = useFetch<SessionsResponse>(
    `/api/v2/users/${userId}/sessions`,
    {
      immediate: Boolean(userId),
      useCache: true,
      cacheMaxAge: 300000,
    }
  )
  const sessions: SessionData[] = data?.data || []

  /**
   * Fungsi untuk memformat tanggal
   */
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Fungsi untuk menentukan status session
   */
  const getSessionStatus = (expiresAt: Date | string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    return expiry > now ? 'active' : 'expired'
  }

  /**
   * Komponen untuk menampilkan session statistics cards
   */
  const SessionStatsCards = () => {
    const activeSessions = sessions.filter(session => getSessionStatus(session.expiresAt) === 'active').length
    const expiredSessions = sessions.filter(session => getSessionStatus(session.expiresAt) === 'expired').length
    const totalSessions = sessions.length
    const latestSession = sessions.length > 0 ? sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null

    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Sessions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalSessions}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconUser className="size-4" />
                User #{userId}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              All time sessions <IconActivity className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total login sessions for this user
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Sessions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {activeSessions}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-green-600">
                <IconActivity className="size-4" />
                Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Currently active sessions <IconActivity className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Sessions that haven&apos;t expired yet
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Expired Sessions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {expiredSessions}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-red-600">
                <IconClock className="size-4" />
                Expired
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Expired sessions <IconClock className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Sessions that have expired
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Latest Session</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {latestSession ? formatDate(latestSession.createdAt).split(' ')[0] : 'N/A'}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconDeviceDesktop className="size-4" />
                Recent
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Most recent login <IconClock className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {latestSession ? formatDate(latestSession.createdAt) : 'No sessions found'}
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  /**
   * Komponen untuk menampilkan tabel sessions
   */
  const SessionsTable = () => {
    if (error) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Sessions Data</CardTitle>
            <CardDescription>Daftar semua sesi login user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Error: {error.message}</p>
              <p className="text-muted-foreground">Gagal memuat data sessions</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Sessions Data</CardTitle>
          <CardDescription>
            Daftar semua sesi login untuk User #{userId} ({sessions.length} sessions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada data sessions untuk user ini</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>User Agent</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const status = getSessionStatus(session.expiresAt)
                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">#{session.id}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={status === 'active' ? 'default' : 'secondary'}
                          className={status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {status === 'active' ? 'Active' : 'Expired'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(session.createdAt)}</TableCell>
                      <TableCell>{formatDate(session.expiresAt)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {session.userAgent || 'N/A'}
                      </TableCell>
                      <TableCell>{session.ipAddress || 'N/A'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    )
  }

  // Loading state dengan skeleton yang konsisten dengan dashboard
  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-muted animate-pulse rounded" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded" />
        </div>
        <SkeletonCards />
        <div className="px-4 lg:px-6">
          <SkeletonDataTable />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">User Sessions</h1>
        <p className="text-muted-foreground">
          Kelola dan pantau semua sesi login untuk User #{userId}
        </p>
      </div>

      {/* Statistics Cards */}
      <SessionStatsCards />

      {/* Sessions Table */}
      <div className="px-4 lg:px-6">
        <SessionsTable />
      </div>
    </div>
  )
}