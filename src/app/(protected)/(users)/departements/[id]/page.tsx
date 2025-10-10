"use client"

import { useEffect, useState } from "react"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/shadcn/ui/button"
import { Separator } from "@/components/shadcn/ui/separator"

// Import komponen yang telah dipisahkan
import { DepartmentInfo } from "@/components/departments/DepartmentInfo"
import { MembersList } from "@/components/departments/MembersList"
import { PositionsList } from "@/components/departments/PositionsList"
import { LoadingState } from "@/components/departments/LoadingState"
import { ErrorState } from "@/components/departments/ErrorState"
import { NotFoundState } from "@/components/departments/NotFoundState"

// Import hook untuk logika bisnis
import { useDepartmentDetails } from "@/hooks/departments/useDepartmentDetails"

/**
 * Halaman detail departemen
 * Menampilkan informasi lengkap tentang departemen termasuk anggota dan posisi
 * Menggunakan prinsip SRP dengan memisahkan UI dan logika bisnis
 */
export default function DepartmentDetailsPage() {
  // Menggunakan custom hook untuk logika bisnis
  const { department, loading, error, handleBack, handleEdit } = useDepartmentDetails()
  const [mounted, setMounted] = useState(false)

  // Hindari hydration mismatch: pastikan render awal sama antara SSR & client
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detail Departemen</h1>
          <p className="text-muted-foreground">
            Informasi lengkap tentang departemen
          </p>
        </div>
      </div>

      <Separator />

      {/* Conditional rendering dengan guard mounted untuk konsistensi SSR/CSR */}
      {!mounted || loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : department ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" suppressHydrationWarning>
          {/* Komponen informasi departemen */}
          <DepartmentInfo department={department} onEdit={handleEdit} />
          
          {/* Komponen daftar anggota */}
          <MembersList users={department.users || []} />
          
          {/* Komponen daftar posisi */}
          <PositionsList positions={department.positions || []} />
        </div>
      ) : (
        <NotFoundState />
      )}
    </div>
  )
}