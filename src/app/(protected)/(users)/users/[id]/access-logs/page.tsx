"use client"

import { useEffect, useState } from "react"
import { useFetch } from "@/lib/useFetch"
import { useParams, useRouter } from "next/navigation"
import { 
  IconActivity, 
  IconClock, 
  IconShield, 
  IconUser, 
  IconArrowLeft,
  IconFilter,
  IconSearch,
  IconCheck,
  IconX,
  IconEye,
  IconCalendar,
  IconRefresh
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/shadcn/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select"
import { SkeletonCards } from "@/components/skeleton-cards"
import { SkeletonDataTable } from "@/components/skeleton-data-table"

/**
 * Interface untuk data access log
 */
interface AccessLog {
  id: number
  userId: number | null
  roleId: number | null
  featureId: number | null
  path: string
  method: string | null
  decision: string
  reason: string | null
  createdAt: string
  // Data relasi
  user?: {
    id: number
    name: string
    email: string
  }
  role?: {
    id: number
    name: string
  }
  feature?: {
    id: number
    name: string
    category: string
  }
}

/**
 * Interface untuk statistik access logs
 */
interface AccessLogStats {
  totalLogs: number
  allowedAccess: number
  deniedAccess: number
  uniqueFeatures: number
  recentLogs: number
  topFeatures: Array<{
    featureId: number
    featureName: string
    count: number
  }>
}

/**
 * Halaman User Access Logs yang menampilkan semua log akses user
 * Menggunakan konsistensi desain dan layout dari dashboard
 * Implementasi filter, pencarian, dan statistik untuk analisis mendalam
 */
export default function UserAccessLogsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  // State management
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AccessLog[]>([])
  const [stats, setStats] = useState<AccessLogStats | null>(null)
  
  // Fetch access logs via API v2 helper
  const { data, error, loading, refetch } = useFetch<{ message?: string; data: AccessLog[] } | AccessLog[]>(
    userId ? `/api/v2/users/${userId}/access-logs` : `/api/v2/access-logs`,
    {
      immediate: Boolean(userId),
      useCache: true,
      cacheMaxAge: 300000,
    }
  )
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [decisionFilter, setDecisionFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  // Sinkronisasi data ketika fetch selesai
  useEffect(() => {
    const raw = Array.isArray(data) ? data : (data?.data ?? [])
    setAccessLogs(raw)
    setFilteredLogs(raw)
    calculateStats(raw)
  }, [data, userId])

  /**
   * Fungsi untuk menghitung statistik access logs
   */
  const calculateStats = (logs: AccessLog[]) => {
    const totalLogs = logs.length
    const allowedAccess = logs.filter(log => log.decision === 'allow').length
    const deniedAccess = logs.filter(log => log.decision === 'deny').length
    
    // Hitung unique features
    const uniqueFeatureIds = new Set(logs.map(log => log.featureId).filter(id => id !== null))
    const uniqueFeatures = uniqueFeatureIds.size
    
    // Hitung recent logs (7 hari terakhir)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recentLogs = logs.filter(log => 
      new Date(log.createdAt) > weekAgo
    ).length
    
    // Hitung top features
    const featureCount = new Map<number, { name: string, count: number }>()
    logs.forEach(log => {
      if (log.featureId && log.feature) {
        const current = featureCount.get(log.featureId) || { name: log.feature.name, count: 0 }
        featureCount.set(log.featureId, { ...current, count: current.count + 1 })
      }
    })
    
    const topFeatures = Array.from(featureCount.entries())
      .map(([featureId, data]) => ({
        featureId,
        featureName: data.name,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    setStats({
      totalLogs,
      allowedAccess,
      deniedAccess,
      uniqueFeatures,
      recentLogs,
      topFeatures
    })
  }

  /**
   * Fungsi untuk menerapkan filter dan pencarian
   */
  const applyFilters = () => {
    let filtered = [...accessLogs]

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.feature?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter berdasarkan decision
    if (decisionFilter !== "all") {
      filtered = filtered.filter(log => log.decision === decisionFilter)
    }

    // Filter berdasarkan method
    if (methodFilter !== "all") {
      filtered = filtered.filter(log => log.method === methodFilter)
    }

    // Filter berdasarkan tanggal
    if (dateFilter !== "all") {
      const now = new Date()
      let startDate = new Date()

      switch (dateFilter) {
        case "today":
          startDate.setHours(0, 0, 0, 0)
          break
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
      }

      filtered = filtered.filter(log => 
        new Date(log.createdAt) >= startDate
      )
    }

    setFilteredLogs(filtered)
  }

  /**
   * Fungsi untuk memformat tanggal
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Fungsi untuk mendapatkan badge decision
   */
  const getDecisionBadge = (decision: string) => {
    if (decision === 'allow') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <IconCheck className="w-3 h-3 mr-1" />
          Allow
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
          <IconX className="w-3 h-3 mr-1" />
          Deny
        </Badge>
      )
    }
  }

  /**
   * Fungsi untuk mendapatkan badge method
   */
  const getMethodBadge = (method: string | null) => {
    if (!method) return <Badge variant="outline">-</Badge>
    
    const colors = {
      GET: "bg-blue-100 text-blue-800 border-blue-200",
      POST: "bg-green-100 text-green-800 border-green-200",
      PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
      PATCH: "bg-purple-100 text-purple-800 border-purple-200"
    }
    
    return (
      <Badge variant="outline" className={colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {method}
      </Badge>
    )
  }

  /**
   * Handler untuk navigasi kembali
   */
  const handleBack = () => {
    router.push(`/users/${userId}`)
  }

  // Effects
  // Trigger initial fetch handled by useFetch via `immediate`
  useEffect(() => {
    // No-op: kept for consistency if we need side-effects on userId change
  }, [userId])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, decisionFilter, methodFilter, dateFilter, accessLogs])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <SkeletonCards />

        {/* Table Skeleton */}
        <SkeletonDataTable />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Access Logs</h1>
            <p className="text-muted-foreground">Log akses user ke sistem</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">Error Loading Access Logs</div>
              <p className="text-muted-foreground">{error.message || String(error)}</p>
              <Button onClick={refetch}>
                <IconRefresh className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Access Logs</h1>
          <p className="text-muted-foreground">
            Log akses user ke sistem dan fitur
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <IconActivity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs}</div>
              <p className="text-xs text-muted-foreground">
                Semua aktivitas akses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Akses Diizinkan</CardTitle>
              <IconCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.allowedAccess}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalLogs > 0 ? Math.round((stats.allowedAccess / stats.totalLogs) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Akses Ditolak</CardTitle>
              <IconX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.deniedAccess}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalLogs > 0 ? Math.round((stats.deniedAccess / stats.totalLogs) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fitur Unik</CardTitle>
              <IconShield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueFeatures}</div>
              <p className="text-xs text-muted-foreground">
                Fitur yang diakses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Log Terbaru</CardTitle>
              <IconClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentLogs}</div>
              <p className="text-xs text-muted-foreground">
                7 hari terakhir
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
          <CardDescription>
            Filter log akses berdasarkan kriteria tertentu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pencarian</label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari path, fitur, atau alasan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status Akses</label>
              <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="allow">Diizinkan</SelectItem>
                  <SelectItem value="deny">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">HTTP Method</label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Method</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Periode</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="week">7 Hari Terakhir</SelectItem>
                  <SelectItem value="month">30 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Log Akses</CardTitle>
              <CardDescription>
                Menampilkan {filteredLogs.length} dari {accessLogs.length} log akses
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              <IconRefresh className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Fitur</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Alasan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <IconEye className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {searchTerm || decisionFilter !== "all" || methodFilter !== "all" || dateFilter !== "all"
                          ? 'Tidak ada log yang ditemukan'
                          : 'Belum ada log akses'
                        }
                      </h3>
                      <p className="text-muted-foreground">
                        {searchTerm || decisionFilter !== "all" || methodFilter !== "all" || dateFilter !== "all"
                          ? 'Coba ubah filter atau kata kunci pencarian'
                          : 'Log akses akan muncul ketika user mengakses fitur sistem'
                        }
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(log.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {log.path}
                      </code>
                    </TableCell>
                    <TableCell>
                      {getMethodBadge(log.method)}
                    </TableCell>
                    <TableCell>
                      {log.feature ? (
                        <div>
                          <div className="font-medium">{log.feature.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.feature.category}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getDecisionBadge(log.decision)}
                    </TableCell>
                    <TableCell>
                      {log.reason ? (
                        <span className="text-sm">{log.reason}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}