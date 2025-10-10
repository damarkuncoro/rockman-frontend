"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IconAlertCircle, IconLoader2, IconPlus } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/ui/alert"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Separator } from "@/components/shadcn/ui/separator"

// Import komponen dan hook yang telah dipisahkan
import { DepartmentList } from "./components/DepartmentList"
import { DepartmentFilter } from "./components/DepartmentFilter"
import { useDepartments } from "./hooks/useDepartments"

/**
 * Komponen untuk menampilkan daftar departemen
 * Mengikuti prinsip Single Responsibility Principle (SRP)
 */
export default function DepartmentsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Hindari hydration mismatch: pastikan render awal konsisten antara SSR & client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Menggunakan custom hook untuk mengelola data departemen
  const { 
    departments, 
    loading, 
    error, 
    search, 
    isActive, 
    setSearch, 
    setIsActive 
  } = useDepartments()

  // Handler untuk membuat departemen baru
  const handleCreateDepartment = () => {
    router.push("/departements/create")
  }

  // Handler untuk melihat detail departemen
  const handleViewDepartment = (id: string) => {
    router.push(`/departements/${id}`)
  }
  
  // Handler untuk edit departemen
  const handleEditDepartment = (id: string) => {
    router.push(`/departements/${id}/edit`)
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departemen</h1>
          <p className="text-muted-foreground">
            Kelola departemen dalam sistem
          </p>
        </div>
        <Button onClick={handleCreateDepartment}>
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah Departemen
        </Button>
      </div>

      <Separator />

      {/* Menggunakan komponen DepartmentFilter */}
      <DepartmentFilter 
        search={search}
        isActive={isActive}
        onSearchChange={setSearch}
        onFilterChange={setIsActive}
      />

      {!mounted || loading ? (
        <Card>
          <CardHeader>
            <div className="flex justify-center items-center h-32">
              <IconLoader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardHeader>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {typeof error === 'string' 
              ? (error.includes("ECONNRESET") || error.includes("socket hang up")
                ? "Tidak dapat terhubung ke server API. Silakan periksa koneksi server API Anda."
                : error)
              : error instanceof Error ? error.message : String(error)}
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              <div>Daftar Departemen</div>
            </CardTitle>
            <CardDescription>
              Total: {departments.length || 0} departemen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Menggunakan komponen DepartmentList */}
            <DepartmentList 
              departments={departments}
              onViewDepartment={handleViewDepartment}
              onEditDepartment={handleEditDepartment}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}