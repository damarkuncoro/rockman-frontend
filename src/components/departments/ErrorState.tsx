"use client"

import { IconAlertCircle } from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/ui/alert"

interface ErrorStateProps {
  error: unknown
}

/**
 * Komponen untuk menampilkan pesan error
 */
export function ErrorState({ error }: ErrorStateProps) {
  const errorMessage = typeof error === 'string' 
    ? (error.includes("ECONNRESET") || error.includes("socket hang up")
      ? "Tidak dapat terhubung ke server API. Silakan periksa koneksi server API Anda."
      : error)
    : error instanceof Error ? error.message : String(error)

  return (
    <Alert variant="destructive">
      <IconAlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )
}