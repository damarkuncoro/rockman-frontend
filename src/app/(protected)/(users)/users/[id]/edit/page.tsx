"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconBuilding,
  IconMapPin,
  IconShield,
  IconDeviceFloppy,
  IconX,
  IconUserCheck,
  IconUserX,
  IconAlertCircle,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Switch } from "@/components/shadcn/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar"
import { Separator } from "@/components/shadcn/ui/separator"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
import { useDepartments } from "@/hooks/useDepartments"

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
 * Interface untuk form data edit user
 */
interface EditUserForm {
  name: string
  email: string
  department: string
  region: string
  level: string
  active: boolean
}

/**
 * Komponen halaman edit pengguna
 */
export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  // Hook untuk departments
  const { departments, isLoading: isDepartmentsLoading } = useDepartments()

  // State untuk data pengguna dan loading
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // State untuk form data
  const [formData, setFormData] = useState<EditUserForm>({
    name: "",
    email: "",
    department: "",
    region: "",
    level: "",
    active: true
  })

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

  // Fetch data pengguna saat komponen dimuat
  useEffect(() => {
    if (userId) {
      fetchUser(userId)
    }
  }, [userId])

  /**
   * Inisialisasi form data dengan data user yang ada
   */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        department: user.department || "",
        region: user.region || "",
        level: user.level?.toString() || "",
        active: user.active
      })
    }
  }, [user])

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
   * Handler untuk perubahan input form
   */
  const handleInputChange = (field: keyof EditUserForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error untuk field yang diubah
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  /**
   * Validasi form data
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama tidak boleh kosong"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department tidak boleh kosong"
    }

    if (!formData.region.trim()) {
      newErrors.region = "Region tidak boleh kosong"
    }

    if (!formData.level.trim()) {
      newErrors.level = "Level tidak boleh kosong"
    } else if (isNaN(Number(formData.level)) || Number(formData.level) < 1 || Number(formData.level) > 10) {
      newErrors.level = "Level harus berupa angka antara 1-10"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handler untuk menyimpan perubahan
   */
  const handleSave = async () => {
    if (!validateForm() || !user) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Di sini akan ada logic untuk menyimpan ke API
      console.log("Saving user data:", {
        ...formData,
        level: Number(formData.level)
      })
      
      setIsSaved(true)
      
      // Redirect kembali ke halaman detail setelah 2 detik
      setTimeout(() => {
        router.push(`/users/${user.id}`)
      }, 2000)
      
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handler untuk kembali ke halaman detail
   */
  const handleBack = () => {
    if (!user) return
    router.push(`/users/${user.id}`)
  }

  /**
   * Handler untuk kembali ke dashboard
   */
  const handleBackToDashboard = () => {
    router.push("/user-management")
  }

  // Daftar region untuk dropdown
  const regions = [
    "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang",
    "Makassar", "Palembang", "Tangerang", "Depok", "Bekasi"
  ]

  if (!user) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="text-center">
          <p className="text-muted-foreground">Pengguna tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <IconArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Pengguna</h1>
          <p className="text-muted-foreground">
            Ubah informasi pengguna {user.name}
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {isSaved && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <IconUserCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Data pengguna berhasil disimpan! Mengalihkan ke halaman detail...
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {/* Form Edit */}
        <div className="lg:col-span-2 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Informasi Pengguna
              </CardTitle>
              <CardDescription>
                Ubah informasi dasar pengguna
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nama */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Masukkan alamat email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Pilih department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: dept.color }}
                          />
                          {dept.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleInputChange("region", value)}
                >
                  <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                    <SelectValue placeholder="Pilih region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-sm text-red-500">{errors.region}</p>
                )}
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  placeholder="Masukkan level (1-10)"
                  className={errors.level ? "border-red-500" : ""}
                />
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level}</p>
                )}
              </div>

              {/* Status Aktif */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Status Aktif</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan atau nonaktifkan pengguna
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange("active", checked)}
                />
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleSave}
                  disabled={isLoading || isSaved}
                  className="flex items-center gap-2"
                >
                  <IconDeviceFloppy className="h-4 w-4" />
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <IconX className="h-4 w-4" />
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Info Sidebar */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          {/* Current User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Saat Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/avatars/${user.id}.jpg`} />
                  <AvatarFallback>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconBuilding className="h-4 w-4 text-muted-foreground" />
                  <span>{user.department || "N/A"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconMapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.region || "N/A"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconShield className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={user.level && user.level >= 8 ? "default" : "secondary"}>
                    {user.level ? `Level ${user.level}` : "N/A"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {user.active ? (
                    <IconUserCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <IconUserX className="h-4 w-4 text-red-600" />
                  )}
                  <Badge variant={user.active ? "default" : "destructive"}>
                    {user.active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Dibuat</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Terakhir Diubah</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
              {user.rolesUpdatedAt && (
                <div>
                  <p className="text-sm font-medium">Role Terakhir Diubah</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user.rolesUpdatedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navigasi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToDashboard}
                className="w-full justify-start"
              >
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}