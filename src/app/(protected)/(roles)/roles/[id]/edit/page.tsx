"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  IconArrowLeft, 
  IconEdit, 
  IconLoader, 
  IconDeviceFloppy, 
  IconShield,
  IconX,
  IconCheck,
  IconRefresh
} from "@tabler/icons-react"

import { Button } from "@/components/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Switch } from "@/components/shadcn/ui/switch"
import { Badge } from "@/components/shadcn/ui/badge"
import { Separator } from "@/components/shadcn/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/ui/alert-dialog"

/**
 * Interface untuk data role
 */
interface Role {
  id: number
  name: string
  grantsAll: boolean
  createdAt: string
  updatedAt?: string
}

/**
 * Interface untuk form data edit role
 */
interface EditRoleForm {
  name: string
  grantsAll: boolean
}

/**
 * Komponen halaman edit role
 * Memungkinkan pengguna untuk mengedit informasi role yang sudah ada
 */
export default function EditRolePage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.id as string

  // State management
  const [role, setRole] = React.useState<Role | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [hasChanges, setHasChanges] = React.useState(false)

  // Form state
  const [formData, setFormData] = React.useState<EditRoleForm>({
    name: "",
    grantsAll: false
  })

  // Original data untuk perbandingan perubahan
  const [originalData, setOriginalData] = React.useState<EditRoleForm>({
    name: "",
    grantsAll: false
  })

  /**
   * Fungsi untuk mengambil data role dari API
   */
  const fetchRole = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/roles/${roleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Role tidak ditemukan')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const roleData = await response.json()
      setRole(roleData)
      
      // Set form data dengan data yang diambil
      const formValues = {
        name: roleData.name,
        grantsAll: roleData.grantsAll
      }
      setFormData(formValues)
      setOriginalData(formValues)
      
    } catch (err) {
      console.error('Error fetching role:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data role')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fungsi untuk menyimpan perubahan role
   */
  const saveRole = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch(`http://localhost:9999/api/v1/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedRole = await response.json()
      setRole(updatedRole)
      setOriginalData(formData)
      setHasChanges(false)
      
      // Redirect ke halaman role management setelah berhasil
      router.push('/role-management')
      
    } catch (err) {
      console.error('Error updating role:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan role')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Handler untuk perubahan input form
   */
  const handleInputChange = (field: keyof EditRoleForm, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    // Check if there are changes
    const hasChanges = JSON.stringify(newFormData) !== JSON.stringify(originalData)
    setHasChanges(hasChanges)
  }

  /**
   * Handler untuk reset form ke data original
   */
  const handleReset = () => {
    setFormData(originalData)
    setHasChanges(false)
    setError(null)
  }

  /**
   * Handler untuk kembali ke halaman sebelumnya
   */
  const handleGoBack = () => {
    if (hasChanges) {
      // Jika ada perubahan, tampilkan konfirmasi
      const confirmLeave = window.confirm(
        'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?'
      )
      if (!confirmLeave) return
    }
    router.back()
  }

  /**
   * Handler untuk refresh data
   */
  const handleRefresh = () => {
    fetchRole()
  }

  /**
   * Format tanggal untuk tampilan
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Effect untuk fetch data saat komponen mount
   */
  React.useEffect(() => {
    if (roleId) {
      fetchRole()
    }
  }, [roleId])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <IconLoader className="h-6 w-6 animate-spin" />
            <span>Memuat data role...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !role) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <IconX className="h-12 w-12 text-destructive mb-4" />
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
      {/* Header */}
      <div className="flex items-center justify-between">
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
            <p className="text-muted-foreground">
              Ubah informasi role {role?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <IconRefresh className="h-4 w-4" />
            Refresh
          </Button>
          
          {hasChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <IconX className="h-4 w-4" />
              Reset
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={saving || !hasChanges || !formData.name.trim()}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <IconLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <IconDeviceFloppy className="h-4 w-4" />
                )}
                Simpan Perubahan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Perubahan</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menyimpan perubahan pada role "{formData.name}"?
                  Perubahan ini akan mempengaruhi semua pengguna yang memiliki role ini.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={saveRole}>
                  Ya, Simpan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status Changes */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <IconEdit className="h-4 w-4" />
              <span className="text-sm font-medium">
                Anda memiliki perubahan yang belum disimpan
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <IconX className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {/* Form Edit */}
        <div className="lg:col-span-2 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconEdit className="h-5 w-5" />
                Informasi Role
              </CardTitle>
              <CardDescription>
                Ubah nama dan permissions role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nama Role */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Role</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Masukkan nama role"
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Nama role harus unik dan deskriptif
                </p>
              </div>

              <Separator />

              {/* Permissions */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Permissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Atur level akses untuk role ini
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="grantsAll" className="font-medium">
                      Full Access (Super Admin)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Memberikan akses penuh ke semua fitur sistem
                    </p>
                  </div>
                  <Switch
                    id="grantsAll"
                    checked={formData.grantsAll}
                    onCheckedChange={(checked) => handleInputChange('grantsAll', checked)}
                  />
                </div>

                {formData.grantsAll && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <IconShield className="h-4 w-4" />
                      <span className="font-medium">Peringatan:</span>
                    </div>
                    <p className="text-sm text-destructive/80 mt-1">
                      Role dengan Full Access memiliki kontrol penuh atas sistem. 
                      Berikan dengan hati-hati.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          {/* Role Info */}
          {role && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconShield className="h-5 w-5" />
                  Informasi Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    ID Role
                  </Label>
                  <p className="text-sm font-mono">{role.id}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={role.grantsAll ? "destructive" : "secondary"}>
                      {role.grantsAll ? "Super Admin" : "Standard Role"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Dibuat
                  </Label>
                  <p className="text-sm">{formatDate(role.createdAt)}</p>
                </div>

                {role.updatedAt && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Terakhir Diubah
                    </Label>
                    <p className="text-sm">{formatDate(role.updatedAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navigasi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => router.push('/role-management')}
              >
                <IconShield className="h-4 w-4 mr-2" />
                Kelola Semua Role
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/user-management')}
              >
                <IconShield className="h-4 w-4 mr-2" />
                Kelola Pengguna
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}