"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconBuilding,
  IconMapPin,
  IconShield,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconUserCheck,
  IconUserX,
  IconAlertCircle,
  IconHome,
  IconPlus,
  IconHistory,
  IconEye,
  IconUsers,
  IconDeviceDesktop,
  IconPhone,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar"
import { Separator } from "@/components/shadcn/ui/separator"
import { Skeleton } from "@/components/shadcn/ui/skeleton"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs"

/**
 * Interface untuk data pengguna
 */
interface User {
  id: number
  name: string
  email: string
  passwordHash: string
  active: boolean
  rolesUpdatedAt: string | null
  department: string | null
  region: string | null
  level: number | null
  createdAt: string
  updatedAt: string
}

/**
 * Interface untuk data alamat
 */
interface Address {
  id: number
  userId: number
  label: string
  recipientName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

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
 * Interface untuk data change history
 */
interface ChangeHistory {
  id: number
  userId: number | null
  tableName: string
  recordId: number
  action: string
  oldValues: any
  newValues: any
  createdAt: string
  user?: {
    id: number
    name: string
    email: string
  }
}

/**
 * Interface untuk data role pengguna
 */
interface UserRole {
  id: number
  name: string
  grantsAll: boolean
  createdAt: string
}

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
 * Interface untuk data nomor telepon pengguna
 */
interface UserPhone {
  id: number
  userId: number
  label: string
  phoneNumber: string
  countryCode: string
  isDefault: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Komponen halaman detail pengguna
 */
export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  // State untuk data pengguna dan loading
  const [user, setUser] = React.useState<User | null>(null)
  const [addresses, setAddresses] = React.useState<Address[]>([])
  const [phones, setPhones] = React.useState<UserPhone[]>([])
  const [accessLogs, setAccessLogs] = React.useState<AccessLog[]>([])
  const [changeHistories, setChangeHistories] = React.useState<ChangeHistory[]>([])
  const [userRoles, setUserRoles] = React.useState<UserRole[]>([])
  const [sessions, setSessions] = React.useState<SessionData[]>([])
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoadingAddresses, setIsLoadingAddresses] = React.useState(false)
  const [isLoadingPhones, setIsLoadingPhones] = React.useState(false)
  const [isLoadingAccessLogs, setIsLoadingAccessLogs] = React.useState(false)
  const [isLoadingChangeHistories, setIsLoadingChangeHistories] = React.useState(false)
  const [isLoadingRoles, setIsLoadingRoles] = React.useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(false)
  
  const [error, setError] = React.useState<string | null>(null)
  const [addressError, setAddressError] = React.useState<string | null>(null)
  const [phoneError, setPhoneError] = React.useState<string | null>(null)
  const [accessLogError, setAccessLogError] = React.useState<string | null>(null)
  const [changeHistoryError, setChangeHistoryError] = React.useState<string | null>(null)
  const [roleError, setRoleError] = React.useState<string | null>(null)
  const [sessionError, setSessionError] = React.useState<string | null>(null)

  /**
   * Fungsi untuk mengambil data pengguna dari API
   */
  const fetchUser = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/users/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pengguna tidak ditemukan')
        }
        throw new Error('Gagal mengambil data pengguna')
      }
      
      const userData = await response.json()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk mengambil data alamat pengguna dari API
   */
  const fetchAddresses = async (id: string) => {
    try {
      setIsLoadingAddresses(true)
      setAddressError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/users/${id}/addresses`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setAddresses([])
          return
        }
        throw new Error('Gagal mengambil data alamat')
      }
      
      const result = await response.json()
      setAddresses(result.data || [])
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil alamat')
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  /**
   * Fungsi untuk mengambil data nomor telepon pengguna dari API
   */
  /**
   * Fungsi untuk mengambil data nomor telepon pengguna dari API
   */
  const fetchPhones = async (id: string) => {
    try {
      setIsLoadingPhones(true)
      setPhoneError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/users/${id}/phones`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setPhones([])
          return
        }
        throw new Error('Gagal mengambil data nomor telepon')
      }
      
      const result = await response.json()
      setPhones(result.data || [])
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil nomor telepon')
    } finally {
      setIsLoadingPhones(false)
    }
  }

  /**
   * Fungsi untuk mengambil data access logs pengguna dari API
   */
  const fetchAccessLogs = async (id: string) => {
    try {
      setIsLoadingAccessLogs(true)
      setAccessLogError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/users/${id}/access-logs`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setAccessLogs([])
          return
        }
        throw new Error('Gagal mengambil data access logs')
      }
      
      const result = await response.json()
      setAccessLogs(result.data || [])
    } catch (err) {
      setAccessLogError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil access logs')
    } finally {
      setIsLoadingAccessLogs(false)
    }
  }

  /**
   * Fungsi untuk mengambil data change histories pengguna dari API
   */
  const fetchChangeHistories = async (id: string) => {
    try {
      setIsLoadingChangeHistories(true)
      setChangeHistoryError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/users/${id}/change-histories`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setChangeHistories([])
          return
        }
        throw new Error('Gagal mengambil data change histories')
      }
      
      const result = await response.json()
      setChangeHistories(result.data || [])
    } catch (err) {
      setChangeHistoryError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil change histories')
    } finally {
      setIsLoadingChangeHistories(false)
    }
  }

  /**
   * Fungsi untuk mengambil data roles pengguna dari API
   */
  const fetchUserRoles = async (id: string) => {
    try {
      setIsLoadingRoles(true)
      setRoleError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/users/${id}/roles`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setUserRoles([])
          return
        }
        throw new Error('Gagal mengambil data roles')
      }
      
      const result = await response.json()
      setUserRoles(result.data?.roles || [])
    } catch (err) {
      setRoleError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil roles')
    } finally {
      setIsLoadingRoles(false)
    }
  }

  /**
   * Fungsi untuk mengambil data sessions pengguna dari API
   */
  const fetchSessions = async (id: string) => {
    try {
      setIsLoadingSessions(true)
      setSessionError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/users/${id}/sessions`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setSessions([])
          return
        }
        throw new Error('Gagal mengambil data sessions')
      }
      
      const result = await response.json()
      setSessions(result.data || [])
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil sessions')
    } finally {
      setIsLoadingSessions(false)
    }
  }

  // Fetch data pengguna saat komponen dimuat
  React.useEffect(() => {
    if (userId) {
      fetchUser(userId)
    }
  }, [userId])

  /**
   * Fungsi untuk mendapatkan inisial nama
   */
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  /**
   * Fungsi untuk format tanggal
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  /**
   * Fungsi untuk format tanggal singkat
   */
  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  /**
   * Handler untuk kembali ke halaman sebelumnya
   */
  const handleGoBack = () => {
    router.back()
  }

  /**
   * Handler untuk edit pengguna
   */
  const handleEditUser = () => {
    console.log("Edit user:", user)
    // TODO: Implementasi navigasi ke halaman edit atau modal edit
  }

  /**
   * Handler untuk hapus pengguna
   */
  const handleDeleteUser = () => {
    if (!user) return
    console.log("Delete user:", user)
    // TODO: Implementasi konfirmasi hapus pengguna
  }

  /**
   * Handler untuk tambah alamat
   */
  const handleAddAddress = () => {
    console.log("Add address for user:", user)
    // TODO: Implementasi modal atau form tambah alamat
  }

  /**
   * Handler untuk edit alamat
   */
  const handleEditAddress = (address: Address) => {
    console.log("Edit address:", address)
    // TODO: Implementasi modal atau form edit alamat
  }

  /**
   * Handler untuk hapus alamat
   */
  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return
    
    try {
      const response = await fetch(`http://localhost:9999/api/v1/users/${userId}/addresses/${addressId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Gagal menghapus alamat')
      }
      
      // Refresh data alamat
      fetchAddresses(userId)
    } catch (err) {
      console.error('Error deleting address:', err)
      alert('Gagal menghapus alamat')
    }
  }

  /**
   * Handler untuk set alamat default
   */
  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/users/${userId}/addresses/${addressId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDefault: true })
      })
      
      if (!response.ok) {
        throw new Error('Gagal mengatur alamat default')
      }
      
      // Refresh data alamat
      fetchAddresses(userId)
    } catch (err) {
      console.error('Error setting default address:', err)
      alert('Gagal mengatur alamat default')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        {/* Profile Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64 mb-3" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Detail Pengguna</h1>
            <p className="text-muted-foreground">
              Informasi lengkap pengguna sistem
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={() => fetchUser(userId)}>
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  // User not found
  if (!user) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Detail Pengguna</h1>
            <p className="text-muted-foreground">
              Informasi lengkap pengguna sistem
            </p>
          </div>
        </div>

        <Alert>
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>
            Data pengguna tidak ditemukan
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header dengan tombol kembali */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <IconArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Detail Pengguna</h1>
          <p className="text-muted-foreground">
            Informasi lengkap pengguna sistem
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditUser}
            className="flex items-center gap-2"
          >
            <IconEdit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteUser}
            className="flex items-center gap-2"
          >
            <IconTrash className="h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Profil Pengguna */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/avatars/${user.id}.jpg`} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-lg mt-1">
                {user.email}
              </CardDescription>
              <div className="flex items-center gap-3 mt-3">
                <Badge 
                  variant={user.active ? "default" : "destructive"}
                  className={user.active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                >
                  {user.active ? (
                    <>
                      <IconUserCheck className="mr-1 h-3 w-3" />
                      Aktif
                    </>
                  ) : (
                    <>
                      <IconUserX className="mr-1 h-3 w-3" />
                      Nonaktif
                    </>
                  )}
                </Badge>
                {user.level && (
                  <Badge 
                    variant={user.level >= 8 ? "default" : "secondary"}
                  >
                    <IconShield className="mr-1 h-3 w-3" />
                    Level {user.level}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs untuk konten detail */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <IconUser className="h-4 w-4" />
            Informasi Umum
          </TabsTrigger>
          <TabsTrigger 
            value="addresses" 
            className="flex items-center gap-2"
            onClick={() => {
              if (addresses.length === 0 && !isLoadingAddresses) {
                fetchAddresses(userId)
              }
            }}
          >
            <IconHome className="h-4 w-4" />
            Alamat
          </TabsTrigger>
          <TabsTrigger 
            value="phones" 
            className="flex items-center gap-2"
            onClick={() => {
              if (phones.length === 0 && !isLoadingPhones) {
                fetchPhones(userId)
              }
            }}
          >
            <IconPhone className="h-4 w-4" />
            Nomor Telepon
          </TabsTrigger>
          <TabsTrigger 
            value="access-logs" 
            className="flex items-center gap-2"
            onClick={() => {
              if (accessLogs.length === 0 && !isLoadingAccessLogs) {
                fetchAccessLogs(userId)
              }
            }}
          >
            <IconEye className="h-4 w-4" />
            Access Logs
          </TabsTrigger>
          <TabsTrigger 
            value="change-histories" 
            className="flex items-center gap-2"
            onClick={() => {
              if (changeHistories.length === 0 && !isLoadingChangeHistories) {
                fetchChangeHistories(userId)
              }
            }}
          >
            <IconHistory className="h-4 w-4" />
            Change Histories
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="flex items-center gap-2"
            onClick={() => {
              if (userRoles.length === 0 && !isLoadingRoles) {
                fetchUserRoles(userId)
              }
            }}
          >
            <IconUsers className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger 
            value="sessions" 
            className="flex items-center gap-2"
            onClick={() => {
              if (sessions.length === 0 && !isLoadingSessions) {
                fetchSessions(userId)
              }
            }}
          >
            <IconDeviceDesktop className="h-4 w-4" />
            Sessions
          </TabsTrigger>
        </TabsList>

        {/* Tab Informasi Umum */}
        <TabsContent value="general" className="space-y-8">
          {/* Informasi Detail */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Informasi Pribadi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="h-5 w-5" />
                  Informasi Pribadi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    ID Pengguna
                  </label>
                  <p className="text-sm mt-1">{user.id}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nama Lengkap
                  </label>
                  <p className="text-sm mt-1">{user.name}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconMail className="h-3 w-3" />
                    Email
                  </label>
                  <p className="text-sm mt-1">{user.email}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status Akun
                  </label>
                  <div className="mt-1">
                    <Badge 
                      variant={user.active ? "default" : "destructive"}
                      className={user.active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                    >
                      {user.active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Organisasi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBuilding className="h-5 w-5" />
                  Informasi Organisasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconBuilding className="h-3 w-3" />
                    Departemen
                  </label>
                  <p className="text-sm mt-1">
                    {user.department ? (
                      <Badge variant="outline">{user.department}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Tidak ada</span>
                    )}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconMapPin className="h-3 w-3" />
                    Region
                  </label>
                  <p className="text-sm mt-1">
                    {user.region || (
                      <span className="text-muted-foreground">Tidak ada</span>
                    )}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconShield className="h-3 w-3" />
                    Level Akses
                  </label>
                  <p className="text-sm mt-1">
                    {user.level ? (
                      <Badge 
                        variant={user.level >= 8 ? "default" : "secondary"}
                      >
                        Level {user.level}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Tidak ada</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informasi Sistem */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Informasi Sistem
              </CardTitle>
              <CardDescription>
                Riwayat dan metadata sistem pengguna
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tanggal Dibuat
                  </label>
                  <p className="text-sm mt-1">{formatDate(user.createdAt)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateShort(user.createdAt)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Terakhir Diperbarui
                  </label>
                  <p className="text-sm mt-1">{formatDate(user.updatedAt)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateShort(user.updatedAt)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role Terakhir Diperbarui
                  </label>
                  <p className="text-sm mt-1">
                    {user.rolesUpdatedAt ? (
                      <>
                        {formatDate(user.rolesUpdatedAt)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateShort(user.rolesUpdatedAt)}
                        </p>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Belum pernah diperbarui</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Keamanan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconShield className="h-5 w-5" />
                Informasi Keamanan
              </CardTitle>
              <CardDescription>
                Informasi terkait keamanan akun pengguna
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Password Hash
                  </label>
                  <p className="text-xs mt-1 font-mono bg-muted p-2 rounded break-all">
                    {user.passwordHash}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Password telah di-hash menggunakan bcrypt untuk keamanan
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Alamat */}
        <TabsContent value="addresses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Alamat Pengguna</h3>
              <p className="text-sm text-muted-foreground">
                Kelola alamat pengiriman dan penagihan
              </p>
            </div>
            <Button onClick={handleAddAddress} className="flex items-center gap-2">
              <IconPlus className="h-4 w-4" />
              Tambah Alamat
            </Button>
          </div>

          {/* Loading state untuk alamat */}
          {isLoadingAddresses && (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error state untuk alamat */}
          {addressError && (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                {addressError}
              </AlertDescription>
            </Alert>
          )}

          {/* Daftar alamat */}
          {!isLoadingAddresses && !addressError && (
            <>
              {addresses.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <IconHome className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum ada alamat</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Pengguna belum menambahkan alamat pengiriman atau penagihan
                    </p>
                    <Button onClick={handleAddAddress} className="flex items-center gap-2">
                      <IconPlus className="h-4 w-4" />
                      Tambah Alamat Pertama
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <Card key={address.id} className={address.isDefault ? "ring-2 ring-primary" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {address.label}
                              {address.isDefault && (
                                <Badge variant="default" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{address.recipientName}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">{address.addressLine1}</p>
                        {address.addressLine2 && (
                          <p className="text-sm">{address.addressLine2}</p>
                        )}
                        <p className="text-sm">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm">{address.country}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.phoneNumber}
                        </p>
                        
                        {!address.isDefault && (
                          <div className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-xs"
                            >
                              Jadikan Default
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Tab Access Logs */}
        <TabsContent value="access-logs" className="space-y-6">
          {isLoadingAccessLogs ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-48" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : accessLogError ? (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                {accessLogError}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Access Logs</h3>
                <Badge variant="secondary">{accessLogs.length} log(s)</Badge>
              </div>
              
              {accessLogs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <IconEye className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum ada access log</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Belum ada aktivitas akses yang tercatat untuk pengguna ini
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {accessLogs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={log.decision === 'ALLOW' ? 'default' : 'destructive'}>
                                {log.decision}
                              </Badge>
                              <span className="text-sm font-medium">{log.method} {log.path}</span>
                            </div>
                            {log.reason && (
                              <p className="text-sm text-muted-foreground">{log.reason}</p>
                            )}
                            {log.feature && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Feature: {log.feature.name}</span>
                                <span>•</span>
                                <span>Category: {log.feature.category}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            {formatDate(log.createdAt)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Tab Change Histories */}
        <TabsContent value="change-histories" className="space-y-6">
          {isLoadingChangeHistories ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-48" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          ) : changeHistoryError ? (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                {changeHistoryError}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Change Histories</h3>
                <Badge variant="secondary">{changeHistories.length} perubahan</Badge>
              </div>
              
              {changeHistories.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <IconHistory className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum ada riwayat perubahan</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Belum ada perubahan data yang tercatat untuk pengguna ini
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {changeHistories.map((history) => (
                    <Card key={history.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{history.action}</Badge>
                                <span className="text-sm font-medium">{history.tableName}</span>
                                <span className="text-xs text-muted-foreground">ID: {history.recordId}</span>
                              </div>
                              {history.user && (
                                <p className="text-xs text-muted-foreground">
                                  Oleh: {history.user.name} ({history.user.email})
                                </p>
                              )}
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {formatDate(history.createdAt)}
                            </div>
                          </div>
                          
                          {(history.oldValues || history.newValues) && (
                            <div className="grid gap-2 md:grid-cols-2">
                              {history.oldValues && (
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">Nilai Lama:</p>
                                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                    {JSON.stringify(history.oldValues, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {history.newValues && (
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">Nilai Baru:</p>
                                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                    {JSON.stringify(history.newValues, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Tab Roles */}
        <TabsContent value="roles" className="space-y-6">
          {isLoadingRoles ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-48" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : roleError ? (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                {roleError}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">User Roles</h3>
                <Badge variant="secondary">{userRoles.length} role(s)</Badge>
              </div>
              
              {userRoles.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <IconUsers className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum ada role</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Pengguna belum memiliki role yang ditetapkan
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {userRoles.map((role) => (
                    <Card key={role.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {role.name}
                              {role.grantsAll && (
                                <Badge variant="default" className="text-xs">
                                  All Access
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              Role ID: {role.id}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <IconCalendar className="h-4 w-4" />
                          <span>Dibuat: {formatDate(role.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconShield className="h-4 w-4" />
                          <span>
                            {role.grantsAll ? 'Akses penuh ke semua fitur' : 'Akses terbatas'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Tab Sessions */}
        <TabsContent value="sessions" className="space-y-6">
          {isLoadingSessions ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-48" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : sessionError ? (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                {sessionError}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Sessions</h3>
                <Badge variant="secondary">{sessions.length} sesi</Badge>
              </div>
              
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <IconDeviceDesktop className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Tidak ada sesi aktif</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Pengguna tidak memiliki sesi yang aktif saat ini
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <IconDeviceDesktop className="h-4 w-4" />
                              <span className="text-sm font-medium">Session ID: {session.id}</span>
                              <Badge variant={new Date(session.expiresAt) > new Date() ? 'default' : 'destructive'}>
                                {new Date(session.expiresAt) > new Date() ? 'Aktif' : 'Expired'}
                              </Badge>
                            </div>
                            {session.userAgent && (
                              <p className="text-xs text-muted-foreground">
                                User Agent: {session.userAgent}
                              </p>
                            )}
                            {session.ipAddress && (
                              <p className="text-xs text-muted-foreground">
                                IP Address: {session.ipAddress}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Dibuat: {formatDate(session.createdAt.toString())}</span>
                              <span>•</span>
                              <span>Expires: {formatDate(session.expiresAt.toString())}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Tab Nomor Telepon */}
        <TabsContent value="phones" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Nomor Telepon</h3>
              <p className="text-sm text-muted-foreground">
                Kelola nomor telepon pengguna untuk komunikasi dan verifikasi
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <IconPlus className="h-4 w-4" />
              Tambah Nomor
            </Button>
          </div>

          {/* Loading state untuk nomor telepon */}
          {isLoadingPhones && (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error state untuk nomor telepon */}
          {phoneError && (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                {phoneError}
              </AlertDescription>
            </Alert>
          )}

          {/* Daftar nomor telepon */}
          {!isLoadingPhones && !phoneError && (
            <>
              {phones.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <IconPhone className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum ada nomor telepon</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Pengguna belum menambahkan nomor telepon untuk komunikasi
                    </p>
                    <Button className="flex items-center gap-2">
                      <IconPlus className="h-4 w-4" />
                      Tambah Nomor Pertama
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {phones.map((phone) => (
                    <Card key={phone.id} className={phone.isDefault ? "ring-2 ring-primary" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {phone.label}
                              {phone.isDefault && (
                                <Badge variant="default" className="text-xs">
                                  Default
                                </Badge>
                              )}
                              {phone.isVerified && (
                                <Badge variant="secondary" className="text-xs">
                                  Terverifikasi
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              {phone.countryCode} {phone.phoneNumber}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <IconPhone className="h-4 w-4 text-muted-foreground" />
                          <span>{phone.countryCode} {phone.phoneNumber}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Dibuat: {formatDate(phone.createdAt)}</span>
                          <span>•</span>
                          <span>Diperbarui: {formatDate(phone.updatedAt)}</span>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          {!phone.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Jadikan Default
                            </Button>
                          )}
                          {!phone.isVerified && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Verifikasi
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}