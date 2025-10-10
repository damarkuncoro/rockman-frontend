"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDetailsDepartment } from "@/hooks/api/v2/departments/[id]/show.hook.v2"
import { useUpdateDepartment } from "@/hooks/api/v2/departments/[id]/update.hook"
import { DepartmentFormValues } from "@/components/departments/DepartmentForm"

/**
 * Hook untuk mengelola logika edit departemen
 * @param id ID departemen yang akan diedit
 */
export function useEditDepartment(id: string) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Mengambil data departemen
  const { department, loading: loadingDepartment, error: fetchError } = useDetailsDepartment(id)
  
  // Hook untuk update departemen
  const { updateDepartment, isLoading: updatingDepartment, error: updateError } = useUpdateDepartment(id)

  // Menggabungkan error dari fetch dan update
  const error = fetchError || updateError || submitError

  // Handler untuk kembali ke halaman detail
  const handleBack = () => {
    router.push(`/departements/${id}`)
  }

  // Handler untuk submit form
  const handleSubmit = async (data: DepartmentFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      await updateDepartment({
        name: data.name,
        code: data.code,
        description: data.description || null,
        isActive: data.isActive
      })
      
      // Redirect ke halaman detail setelah berhasil update
      router.push(`/departements/${id}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan departemen")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    department,
    loading: loadingDepartment || updatingDepartment || isSubmitting,
    error,
    handleBack,
    handleSubmit
  }
}