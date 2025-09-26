"use client"

import { AccessLogsAnalytics } from "@/components/analytics/access-logs-analytics"

/**
 * Halaman Access Logs Analytics
 * Menampilkan analisa komprehensif tentang log akses sistem
 * Menggunakan komponen AccessLogsAnalytics untuk visualisasi data
 */
export default function AccessLogsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Access Logs Analytics</h1>
        <p className="text-muted-foreground">
          Analisa mendalam tentang log akses API dan aktivitas sistem
        </p>
      </div>

      <AccessLogsAnalytics />
    </div>
  )
}