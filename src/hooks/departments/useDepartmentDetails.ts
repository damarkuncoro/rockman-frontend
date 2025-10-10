"use client"

import { useParams, useRouter } from "next/navigation"
import { useDetailsDepartment } from "@/hooks/api/v2/departments/[id]/show.hook.v2"

/**
 * Hook untuk mengelola logika halaman detail departemen
 * Memisahkan logika bisnis dari komponen UI sesuai prinsip SRP
 */
export function useDepartmentDetails() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  // Menggunakan custom hook untuk mengambil data detail departemen
  const { department, loading, error } = useDetailsDepartment(id)

  // Handler untuk kembali ke halaman departemen
  const handleBack = () => {
    router.push("/departements")
  }
  
  // Handler untuk edit departemen
  const handleEdit = () => {
    router.push(`/departements/${id}/edit`)
  }

  return {
    id,
    department,
    loading,
    error,
    handleBack,
    handleEdit
  }
}