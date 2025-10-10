"use client"

import { IconAlertCircle } from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/ui/alert"

/**
 * Komponen untuk menampilkan pesan departemen tidak ditemukan
 */
export function NotFoundState() {
  return (
    <Alert>
      <IconAlertCircle className="h-4 w-4" />
      <AlertTitle>Departemen tidak ditemukan</AlertTitle>
      <AlertDescription>
        Departemen dengan ID yang diberikan tidak dapat ditemukan
      </AlertDescription>
    </Alert>
  )
}