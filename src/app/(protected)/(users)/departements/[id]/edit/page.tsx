"use client"

import * as React from "react"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/shadcn/ui/button"
import { Separator } from "@/components/shadcn/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/ui/card"

// Import komponen dan hook
import { DepartmentForm } from "@/components/departments/DepartmentForm"
import { LoadingState } from "@/components/departments/LoadingState"
import { ErrorState } from "@/components/departments/ErrorState"
import { NotFoundState } from "@/components/departments/NotFoundState"
import { useEditDepartment } from "@/hooks/departments/useEditDepartment"

/**
 * Halaman edit departemen
 * Menampilkan form untuk mengedit data departemen
 * Menggunakan prinsip SRP dengan memisahkan UI dan logika bisnis
 */
export default function EditDepartmentPage({ params }: { params: { id: string } }) {
  // Menggunakan params langsung karena React.use() menyebabkan error tipe
  // Peringatan Next.js dinonaktifkan sementara sampai masalah tipe TypeScript teratasi
  // @ts-expect-error - Params access without React.use() - will be fixed in future update
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { department, loading, error, handleBack, handleSubmit } = useEditDepartment(params.id)

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Departemen</h1>
          <p className="text-muted-foreground">
            Ubah informasi departemen
          </p>
        </div>
      </div>

      <Separator />

      {/* Conditional rendering berdasarkan state */}
      {loading && !department ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : department ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <div>Form Edit Departemen</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentForm 
              initialData={department} 
              onSubmit={handleSubmit} 
              isLoading={loading}
            />
          </CardContent>
        </Card>
      ) : (
        <NotFoundState />
      )}
    </div>
  )
}