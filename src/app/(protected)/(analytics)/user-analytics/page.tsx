"use client"

import { UsersAnalytics } from "@/components/analytics/users-analytics"

/**
 * Halaman User Analytics
 * Menampilkan analisa komprehensif tentang pengguna sistem
 * Menggunakan komponen UsersAnalytics untuk visualisasi data
 */
export default function UserAnalyticsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
        <p className="text-muted-foreground">
          Analisa mendalam tentang aktivitas dan statistik pengguna dalam sistem
        </p>
      </div>

      <UsersAnalytics />
    </div>
  )
}